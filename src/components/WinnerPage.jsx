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

const CONFETTI_COLORS = [
  "#6B3A7A",
  "#C4A265",
  "#9B59B6",
  "#8B5E9B",
  "#D4A574",
];

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 85,
    startVelocity: 42,
    origin: { y: 0.58 },
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 65,
      angle: 60,
      spread: 60,
      startVelocity: 38,
      origin: { x: 0.05, y: 0.65 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount: 65,
      angle: 120,
      spread: 60,
      startVelocity: 38,
      origin: { x: 0.95, y: 0.65 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });
  }, 280);
}

export default function WinnerPage({ winner, onBack }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!winner) return;

    launchConfetti();
  }, [winner?.timestamp]);

  useGSAP(
    () => {
      if (!winner) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set("[data-result-card], [data-result-item]", {
          clearProps: "all",
          opacity: 1,
        });

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          "[data-result-card]",
          {
            opacity: 0,
            scale: 0.92,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
          },
        )
        .fromTo(
          "[data-result-item]",
          {
            opacity: 0,
            y: 22,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.075,
          },
          "-=0.45",
        )
        .fromTo(
          "[data-trophy]",
          {
            rotate: -12,
            scale: 0.75,
          },
          {
            rotate: 0,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.8)",
          },
          "-=0.5",
        );
    },
    {
      scope: rootRef,
      dependencies: [winner?.timestamp],
      revertOnUpdate: true,
    },
  );

  if (!winner) return null;

  return (
    <main
      ref={rootRef}
      className="winner-page relative h-dvh min-h-[600px] overflow-hidden bg-dcabra-primary px-4 py-4 text-white sm:px-6"
    >
      {/* Fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 welcome-mesh opacity-60" />

        <div className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.055] blur-3xl" />

        <div className="absolute -left-36 top-[18%] h-80 w-80 rounded-full border border-white/10" />

        <div className="absolute -right-36 bottom-[5%] h-96 w-96 rounded-full border border-dcabra-gold/20" />

        <div className="absolute left-[12%] top-[14%] h-2 w-2 rounded-full bg-dcabra-gold/70" />

        <div className="absolute bottom-[12%] right-[17%] h-1.5 w-1.5 rounded-full bg-white/50" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      {/* Navegación */}
      <nav className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white/25 hover:bg-white/15"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          <span>Volver a la ruleta</span>
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/5 px-3 py-2 backdrop-blur-md sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-dcabra-gold" />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Gran Sorteo D&apos;Cabra
          </span>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex h-[calc(100%-52px)] w-full max-w-5xl items-center justify-center">
        <section
          data-result-card
          aria-live="polite"
          className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/30 bg-white/[0.97] px-5 py-7 text-center text-dcabra-text shadow-[0_30px_90px_rgba(30,10,40,0.32)] backdrop-blur-xl sm:px-9 sm:py-9"
          style={{ viewTransitionName: "raffle-focus" }}
        >
          {/* Detalle superior */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-dcabra-primary via-dcabra-gold to-dcabra-primary"
          />

          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-dcabra-primary/[0.04]"
          />

          {/* Trofeo */}
          <div
            data-result-item
            data-trophy
            className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-dcabra-gold/10 ring-1 ring-dcabra-gold/20 sm:h-20 sm:w-20"
          >
            <div className="absolute inset-2 rounded-xl bg-white shadow-sm" />

            <Trophy
              size={34}
              strokeWidth={1.8}
              className="relative text-dcabra-gold sm:h-[38px] sm:w-[38px]"
            />
          </div>

          {/* Mensaje */}
          <div data-result-item className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-dcabra-primary/5 px-3 py-1.5">
              <Sparkles
                size={13}
                className="text-dcabra-primary"
                strokeWidth={2}
              />

              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-dcabra-primary">
                Tenemos un ganador
              </span>
            </div>
          </div>

          {/* Ganador */}
          <h1
            data-result-item
            className="mx-auto mt-4 max-w-lg break-words text-3xl font-black leading-[1.05] tracking-tight text-dcabra-text sm:text-5xl md:text-6xl"
          >
            {winner.name}
          </h1>

          <div
            data-result-item
            className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium text-dcabra-muted sm:text-sm"
          >
            <span className="rounded-full bg-dcabra-primaryFaded px-2.5 py-1 font-bold text-dcabra-primary">
              Selección #{winner.selectionNumber}
            </span>

            <span>{winner.date}</span>

            <span aria-hidden="true" className="text-dcabra-border">
              •
            </span>

            <span>{winner.time}</span>
          </div>

          {/* Premio */}
          <div
            data-result-item
            className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-dcabra-border/70 bg-dcabra-primaryFaded/70 p-3.5 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-dcabra-border/50">
              <Gift
                size={21}
                strokeWidth={1.8}
                className="text-dcabra-primary"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-dcabra-muted">
                Premio
              </p>

              <p className="truncate text-sm font-bold text-dcabra-primary sm:text-base">
                {raffleConfig.prizeName}
              </p>

              {raffleConfig.prizeDescription && (
                <p className="mt-0.5 truncate text-xs text-dcabra-muted">
                  {raffleConfig.prizeDescription}
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div
            data-result-item
            className="mt-6 flex flex-col-reverse justify-center gap-2.5 sm:flex-row"
          >
            <button
              type="button"
              onClick={launchConfetti}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-dcabra-border bg-white px-5 py-3 text-sm font-bold text-dcabra-muted transition hover:border-dcabra-primary/25 hover:bg-dcabra-primaryFaded hover:text-dcabra-primary"
            >
              <Sparkles size={16} />
              Celebrar otra vez
            </button>

            <button
              type="button"
              onClick={onBack}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-dcabra-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-dcabra-primary/20 transition hover:-translate-y-0.5 hover:bg-dcabra-primaryDark hover:shadow-xl"
            >
              Continuar sorteo

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}