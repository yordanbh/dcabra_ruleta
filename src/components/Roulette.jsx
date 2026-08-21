import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import theme from "../config/theme";
import raffleConfig from "../config/raffleConfig";

function fitName(name, maxLength) {
  if (!name) return "";

  return name.length > maxLength
    ? `${name.slice(0, maxLength)}…`
    : name;
}

function mixColors(colorA, colorB, amount) {
  const parseColor = (color) => {
    const cleanColor = color.replace("#", "");

    return {
      red: Number.parseInt(cleanColor.slice(0, 2), 16),
      green: Number.parseInt(cleanColor.slice(2, 4), 16),
      blue: Number.parseInt(cleanColor.slice(4, 6), 16),
    };
  };

  const first = parseColor(colorA);
  const second = parseColor(colorB);

  const mix = (start, end) =>
    Math.round(start + (end - start) * amount);

  return `rgb(
    ${mix(first.red, second.red)},
    ${mix(first.green, second.green)},
    ${mix(first.blue, second.blue)}
  )`;
}

export default function Roulette({
  participants,
  isSpinning,
  targetAngle,
}) {
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const tweenRef = useRef(null);

  const [canvasSize, setCanvasSize] = useState(400);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const availableWidth = window.innerWidth - 40;

      const availableHeight = isSpinning
        ? window.innerHeight - 190
        : window.innerHeight - 330;

      const maximumSize = isSpinning ? 460 : 400;

      setCanvasSize(
        Math.max(
          240,
          Math.min(
            maximumSize,
            availableWidth,
            availableHeight,
          ),
        ),
      );
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [isSpinning]);

  const drawWheel = useCallback(
    (angle) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      const center = canvasSize / 2;
      const radius = center - 15;
      const total = participants.length;

      if (
        canvas.width !== canvasSize * dpr ||
        canvas.height !== canvasSize * dpr
      ) {
        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;

        canvas.style.width = `${canvasSize}px`;
        canvas.style.height = `${canvasSize}px`;
      }

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      );

      context.clearRect(
        0,
        0,
        canvasSize,
        canvasSize,
      );

      if (!total) {
        // Sombra exterior
        context.beginPath();
        context.arc(
          center,
          center,
          radius,
          0,
          Math.PI * 2,
        );

        context.fillStyle = theme.primaryFaded;
        context.shadowColor = "rgba(82, 46, 94, 0.12)";
        context.shadowBlur = 24;
        context.shadowOffsetY = 8;
        context.fill();

        context.shadowColor = "transparent";
        context.shadowBlur = 0;
        context.shadowOffsetY = 0;

        // Borde
        context.strokeStyle = theme.border;
        context.lineWidth = 3;
        context.stroke();

        // Texto cuando no hay participantes
        context.fillStyle = theme.muted;
        context.font =
          "600 13px Inter, system-ui, sans-serif";

        context.textAlign = "center";
        context.textBaseline = "middle";

        // Radio del hub central (mismo cálculo que usas más abajo)
        const hubRadius = canvasSize <= 280 ? 26 : 31;

        context.fillText(
          "Sin participantes",
          center,
          center + hubRadius + 20,
        );

        return;
      }

      const segmentAngle =
        (Math.PI * 2) / total;

      context.save();

      context.beginPath();
      context.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2,
      );

      context.fillStyle = "#FFFFFF";
      context.shadowColor = "rgba(82, 46, 94, 0.16)";
      context.shadowBlur = 26;
      context.shadowOffsetY = 10;
      context.fill();

      context.restore();

      context.save();

      context.translate(center, center);

      context.rotate(
        (angle * Math.PI) / 180,
      );

      participants.forEach((name, index) => {
        const start = segmentAngle * index;
        const end = start + segmentAngle;
        const middle =
          start + segmentAngle / 2;

        const baseColor =
          theme.wheelColors[
          index % theme.wheelColors.length
          ];

        const segmentGradient =
          context.createRadialGradient(
            0,
            0,
            radius * 0.12,
            0,
            0,
            radius,
          );

        segmentGradient.addColorStop(
          0,
          mixColors(
            baseColor,
            "#FFFFFF",
            0.16,
          ),
        );

        segmentGradient.addColorStop(
          1,
          baseColor,
        );

        context.beginPath();
        context.moveTo(0, 0);

        context.arc(
          0,
          0,
          radius,
          start,
          end,
        );

        context.closePath();

        context.fillStyle = segmentGradient;
        context.fill();

        context.strokeStyle =
          "rgba(255,255,255,0.40)";

        context.lineWidth = 1.4;
        context.stroke();

        context.save();

        context.rotate(middle);

        const fontSize =
          canvasSize <= 280
            ? 9
            : total <= 8
              ? 12
              : 10;

        const maximumLength =
          total <= 8 ? 18 : 14;

        context.fillStyle = "#FFFFFF";

        context.font =
          `700 ${fontSize}px Inter, system-ui, sans-serif`;

        context.textAlign = "right";
        context.textBaseline = "middle";

        context.shadowColor =
          "rgba(20, 10, 25, 0.35)";

        context.shadowBlur = 3;

        context.fillText(
          fitName(name, maximumLength),
          radius - 20,
          0,
        );

        context.restore();
      });

      context.restore();

      context.save();

      context.beginPath();

      context.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2,
      );

      context.clip();

      const wheelShade =
        context.createRadialGradient(
          center,
          center,
          radius * 0.25,
          center,
          center,
          radius,
        );

      wheelShade.addColorStop(
        0,
        "rgba(255,255,255,0.08)",
      );

      wheelShade.addColorStop(
        0.72,
        "rgba(255,255,255,0)",
      );

      wheelShade.addColorStop(
        1,
        "rgba(30,10,35,0.13)",
      );

      context.fillStyle = wheelShade;

      context.fillRect(
        0,
        0,
        canvasSize,
        canvasSize,
      );

      context.restore();

      context.beginPath();

      context.arc(
        center,
        center,
        radius + 3,
        0,
        Math.PI * 2,
      );

      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 7;
      context.stroke();

      context.beginPath();

      context.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2,
      );

      context.strokeStyle = theme.primary;
      context.lineWidth = 3;
      context.stroke();

      const hubRadius =
        canvasSize <= 280 ? 26 : 31;

      context.beginPath();

      context.arc(
        center,
        center,
        hubRadius,
        0,
        Math.PI * 2,
      );

      context.fillStyle = "#FFFFFF";

      context.shadowColor =
        "rgba(82, 46, 94, 0.22)";

      context.shadowBlur = 12;
      context.fill();

      context.shadowColor = "transparent";
      context.shadowBlur = 0;

      context.strokeStyle =
        "rgba(107, 58, 122, 0.18)";

      context.lineWidth = 2;
      context.stroke();
    },
    [participants, canvasSize],
  );

  useLayoutEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  useEffect(() => {
    if (
      !isSpinning ||
      !participants.length
    ) {
      return undefined;
    }

    tweenRef.current?.kill();

    const state = {
      angle: currentAngleRef.current,
    };

    const currentNormalized =
      ((state.angle % 360) + 360) % 360;

    const desiredNormalized =
      ((targetAngle % 360) + 360) % 360;

    const completeTurns =
      Math.floor(targetAngle / 360);

    const alignmentDelta =
      (
        desiredNormalized -
        currentNormalized +
        360
      ) % 360;

    const finalAngle =
      state.angle +
      completeTurns * 360 +
      alignmentDelta;

    tweenRef.current = gsap.to(state, {
      angle: finalAngle,

      duration:
        raffleConfig.spinDurationMs / 1000,

      ease: "power4.out",

      onUpdate: () => {
        currentAngleRef.current =
          state.angle;

        drawWheel(state.angle);
      },

      onComplete: () => {
        currentAngleRef.current =
          ((finalAngle % 360) + 360) % 360;

        drawWheel(
          currentAngleRef.current,
        );
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [
    isSpinning,
    targetAngle,
    participants,
    drawWheel,
  ]);

  const centerSize =
    canvasSize <= 280 ? 44 : 54;

  return (
    <div className="relative flex items-center justify-center">
      {/* Brillo exterior */}
      <div
        aria-hidden="true"
        className={`
          absolute rounded-full
          transition-all duration-700
          ${isSpinning
            ? "scale-110 opacity-60"
            : "scale-100 opacity-20"
          }
        `}
        style={{
          width: canvasSize + 55,
          height: canvasSize + 55,

          background: `
            radial-gradient(
              circle,
              ${theme.primary}2A 0%,
              ${theme.primary}12 42%,
              transparent 72%
            )
          `,
        }}
      />

      {/* Puntero */}
      <div className="pointer-events-none absolute -top-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dcabra-border bg-white shadow-lg">
          <div className="h-2.5 w-2.5 rounded-full bg-dcabra-primary" />
        </div>

        <div
          className="-mt-1 h-0 w-0 drop-shadow-md"
          style={{
            borderLeft:
              "9px solid transparent",

            borderRight:
              "9px solid transparent",

            borderTop:
              `17px solid ${theme.primary}`,
          }}
        />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        aria-label={
          `Ruleta con ${participants.length} ` +
          "participantes visibles"
        }
        className={`
          relative z-[1]
          transition-[filter] duration-500
          ${isSpinning
            ? "drop-shadow-2xl"
            : "drop-shadow-lg"
          }
        `}
      />

      {/* Logo central */}
      <div
        className={`
          pointer-events-none absolute z-20
          flex items-center justify-center
          overflow-hidden rounded-full
          border border-dcabra-primary/15
          bg-white shadow-lg
          transition-all duration-500
          ${isSpinning
            ? "scale-110"
            : "scale-100"
          }
        `}
        style={{
          width: centerSize,
          height: centerSize,
        }}
      >
        {!logoError ? (
          <img
            src={raffleConfig.favicon}
            alt=""
            className="h-full w-full object-cover p-1"
            onError={() =>
              setLogoError(true)
            }
          />
        ) : (
          <span className="text-sm font-black text-dcabra-primary">
            D'C
          </span>
        )}
      </div>
    </div>
  );
}