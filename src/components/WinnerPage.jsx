import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Gift,
  Sparkles,
  Trophy,
} from "lucide-react";
import raffleConfig from "../config/raffleConfig";

function launchConfetti() {
  const colors = ["#6B3A7A", "#C4A265", "#9B59B6", "#8B5E9B", "#D4A574"];
  confetti({ particleCount: 170, spread: 90, origin: { y: 0.58 }, colors });
  window.setTimeout(() => {
    confetti({ particleCount: 75, spread: 65, origin: { x: 0.2, y: 0.48 }, colors });
    confetti({ particleCount: 75, spread: 65, origin: { x: 0.8, y: 0.48 }, colors });
  }, 280);
}

export default function WinnerPage({ winner, onBack }) {
  const rootRef = useRef(null);

  useEffect(() => {
    launchConfetti();
  }, [winner?.timestamp]);

  useGSAP(
    () => {
      gsap.from("[data-result-item]", {
        opacity: 0,
        y: 30,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.12,
      });
    },
    { scope: rootRef },
  );

  if (!winner) return null;

  return (
    <main ref={rootRef} className="winner-page relative min-h-screen overflow-hidden bg-dcabra-primary py-3 text-white">
      <div className="absolute inset-0 welcome-mesh opacity-70" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-dcabra-gold/20 blur-3xl" />

      <nav className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md hover:bg-white/20">
          <ArrowLeft size={15} /> Volver a la ruleta
        </button>
      </nav>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center">
        <section
          className="w-full max-w-2xl rounded-[2rem] border border-white/25 bg-white/95 p-6 text-center text-dcabra-text shadow-2xl backdrop-blur-xl md:p-10"
          style={{ viewTransitionName: "raffle-focus" }}
        >
          <div data-result-item className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-dcabra-gold/15 ring-8 ring-dcabra-gold/5">
            <Trophy size={38} className="text-dcabra-gold" />
          </div>
          <p data-result-item className="mt-6 text-xs font-black uppercase tracking-[0.34em] text-dcabra-primary">¡Tenemos un ganador!</p>
          <h1 data-result-item className="mt-3 text-4xl font-black leading-tight text-dcabra-text md:text-6xl">{winner.name}</h1>
          <p data-result-item className="mt-3 text-sm font-medium text-dcabra-muted">
            Selección #{winner.selectionNumber} • {winner.date} • {winner.time}
          </p>

          <div data-result-item className="mx-auto mt-7 flex max-w-md items-center gap-4 rounded-2xl bg-dcabra-primaryFaded p-4 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Gift size={22} className="text-dcabra-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-dcabra-muted">Premio</p>
              <p className="font-bold text-dcabra-primary">{raffleConfig.prizeName}</p>
            </div>
          </div>

          <div data-result-item className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={launchConfetti} className="inline-flex items-center gap-2 rounded-xl bg-dcabra-primary px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-dcabra-primaryDark">
              <Sparkles size={17} /> Celebrar otra vez
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-dcabra-border px-5 py-3 text-sm font-bold text-dcabra-muted transition hover:bg-dcabra-primaryFaded hover:text-dcabra-primary"
            >
              Continuar sorteo
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
