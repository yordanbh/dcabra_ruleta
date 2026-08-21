import { useCallback, useEffect, useRef, useState } from "react";
import raffleConfig from "../config/raffleConfig";
import demoParticipants from "../data/demoParticipants";
import { mergeParticipants, parseParticipantFile } from "../utils/participants";
import { calculateTargetAngle } from "../utils/roulette";
import {
  getParticipants,
  getWinners,
  resetRaffle as resetStorage,
  saveParticipants,
  saveWinners,
} from "../utils/storage";

import { sileo } from "sileo";

const MAX_VISIBLE = 10;

function shuffledCopy(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function pickVisibleSubset(items, count, requiredName) {
  if (items.length <= count) return [...items];
  const subset = shuffledCopy(items.filter((name) => name !== requiredName)).slice(0, count - 1);
  subset.splice(Math.floor(Math.random() * count), 0, requiredName);
  return subset;
}

function pickIdleSubset(items, count) {
  return items.length <= count ? [...items] : shuffledCopy(items).slice(0, count);
}

export default function useDraw({ onDrawComplete }) {
  const [participants, setParticipants] = useState(getParticipants);
  const [winners, setWinners] = useState(getWinners);
  const [visibleParticipants, setVisibleParticipants] = useState(() => pickIdleSubset(getParticipants(), MAX_VISIBLE));
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [targetAngle, setTargetAngle] = useState(0);
  const spinningRef = useRef(false);
  const drawTimerRef = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(drawTimerRef.current);
  }, []);

  useEffect(() => {
    if (!spinningRef.current) setVisibleParticipants(pickIdleSubset(participants, MAX_VISIBLE));
    saveParticipants(participants);
  }, [participants]);

  useEffect(() => saveWinners(winners), [winners]);

  const showToast = useCallback(
    (message, type = "info") => {
      const options = {
        title: message,
        duration: 4000,
      };

      switch (type) {
        case "success":
          sileo.success(options);
          break;

        case "error":
          sileo.error(options);
          break;

        case "warning":
          sileo.warning(options);
          break;

        default:
          sileo.info(options);
          break;
      }
    },
    [],
  );

  const loadParticipantsFromFile = useCallback(
    async (file) => {
      try {
        const {
          participants: parsedParticipants,
          duplicatesRemoved,
          error,
        } = await parseParticipantFile(file);

        if (error) {
          showToast(error, "error");
          return false;
        }

        const {
          merged,
          added,
        } = mergeParticipants(
          participants,
          parsedParticipants,
        );

        setParticipants(merged);

        let message =
          `${added} participante${added !== 1 ? "s" : ""} ` +
          `cargado${added !== 1 ? "s" : ""}`;

        if (duplicatesRemoved > 0) {
          message +=
            ` · ${duplicatesRemoved} duplicado` +
            `${duplicatesRemoved !== 1 ? "s" : ""} omitido` +
            `${duplicatesRemoved !== 1 ? "s" : ""}`;
        }

        if (added === 0) {
          message = "Todos los participantes ya estaban cargados.";
        }

        showToast(
          message,
          added > 0 ? "success" : "info",
        );

        return true;
      } catch (error) {
        console.error("Error procesando participantes:", error);

        showToast(
          "No se pudo procesar el archivo seleccionado.",
          "error",
        );

        return false;
      }
    },
    [participants, showToast],
  );

  const loadDemoData = useCallback(() => {
    setParticipants((current) => {
      const { merged, added } = mergeParticipants(current, demoParticipants);
      showToast(`${added} participantes demo cargados`, "success");
      return merged;
    });
  }, [showToast]);

  const selectWinner = useCallback(() => {
    if (spinningRef.current || !participants.length) return;

    spinningRef.current = true;
    setIsSpinning(true);
    setCurrentWinner(null);

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winnerName = participants[winnerIndex];
    const subset = pickVisibleSubset(participants, MAX_VISIBLE, winnerName);
    const visibleWinnerIndex = subset.indexOf(winnerName);

    setVisibleParticipants(subset);
    setTargetAngle(calculateTargetAngle(visibleWinnerIndex, subset.length));

    drawTimerRef.current = window.setTimeout(async () => {
      const now = new Date();
      const winner = {
        name: winnerName,
        selectionNumber: winners.length + 1,
        date: now.toLocaleDateString("es-PE"),
        time: now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
        prize: raffleConfig.prizeName,
        timestamp: Date.now(),
      };

      const remainingParticipants = participants.filter((_, index) => index !== winnerIndex);

      setCurrentWinner(winner);
      setWinners((current) => [winner, ...current]);
      setParticipants(remainingParticipants);

      await onDrawComplete(winner);
      setVisibleParticipants(pickIdleSubset(remainingParticipants, MAX_VISIBLE));
      setIsSpinning(false);
      spinningRef.current = false;
    }, raffleConfig.spinDurationMs + 150);
  }, [onDrawComplete, participants, winners.length]);

  const resetDraw = useCallback(() => {
    window.clearTimeout(drawTimerRef.current);
    resetStorage();
    setParticipants([]);
    setWinners([]);
    setVisibleParticipants([]);
    setCurrentWinner(null);
    setTargetAngle(0);
    setIsSpinning(false);
    spinningRef.current = false;
    showToast("Dinámica reiniciada correctamente.");
  }, [showToast]);

  return {
    participants,
    winners,
    visibleParticipants,
    isSpinning,
    currentWinner,
    targetAngle,
    isFinished: participants.length === 0 && winners.length > 0,
    canSpin: participants.length > 0 && !isSpinning,
    maxVisible: MAX_VISIBLE,
    loadParticipantsFromFile,
    loadDemoData,
    selectWinner,
    resetDraw,
  };
}
