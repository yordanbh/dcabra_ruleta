import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { PartyPopper, Sparkles } from "lucide-react";

import DrawButton from "./DrawButton";
import Roulette from "./Roulette";

export default function RouletteStage({
  participants,
  isSpinning,
  targetAngle,
  canSpin,
  isFinished,
  onDraw,
}) {
  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    if (!isSpinning || !stageRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([overlayRef.current, stageRef.current, headingRef.current], {
          clearProps: "all",
          opacity: 1,
        });

        return;
      }

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          overlayRef.current,
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
          },
          {
            opacity: 1,
            backdropFilter: "blur(18px)",
            duration: 0.45,
            ease: "power2.out",
          },
        )
        .fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: -18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .fromTo(
          stageRef.current,
          {
            opacity: 0,
            scale: 0.82,
            y: 35,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "back.out(1.35)",
          },
          "-=0.35",
        );
    }, overlayRef);

    return () => context.revert();
  }, [isSpinning]);

  const rouletteContent = (
    <div
      id="roulette-stage"
      ref={stageRef}
      className="relative z-10 flex w-full max-w-xl flex-col items-center gap-4"
      style={{ viewTransitionName: "raffle-focus" }}
    >
      <Roulette
        participants={participants}
        isSpinning={isSpinning}
        targetAngle={targetAngle}
      />

      {!isSpinning && (
        <>
          {isFinished ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-gold/20 bg-white px-5 py-4 text-center shadow-sm">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-dcabra-gold/10">
                <PartyPopper
                  size={22}
                  className="text-dcabra-gold"
                  strokeWidth={1.8}
                />
              </div>

              <h3 className="mt-3 font-bold text-dcabra-text">
                Dinámica finalizada
              </h3>

              <p className="mt-1 text-sm text-dcabra-muted">
                Ya no quedan participantes disponibles.
              </p>
            </div>
          ) : participants.length === 0 ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-border bg-white/80 px-5 py-3 text-center shadow-sm">
              <p className="text-sm font-medium text-dcabra-muted">
                Carga una lista para comenzar
              </p>
            </div>
          ) : (
            <DrawButton
              onClick={onDraw}
              disabled={!canSpin}
              isSpinning={false}
            />
          )}
        </>
      )}
    </div>
  );

  const spinningOverlay = isSpinning
    ? createPortal(
      <div
        ref={overlayRef}
        role="status"
        aria-live="polite"
        aria-label="La ruleta está buscando al ganador"
        className="fixed inset-0 z-[200] flex min-h-dvh items-center justify-center overflow-hidden bg-white/95 px-4 py-6"
      >
        {/* Fondo decorativo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dcabra-primary/[0.055] blur-3xl" />

          <div className="absolute left-[8%] top-[16%] h-36 w-36 rounded-full border border-dcabra-primary/10" />

          <div className="absolute bottom-[10%] right-[7%] h-48 w-48 rounded-full border border-dcabra-gold/15" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dcabra-primary/20 to-transparent" />
        </div>

        <div className="relative z-10 flex max-h-dvh w-full flex-col items-center justify-center">
          <div ref={headingRef} className="mb-10 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-dcabra-gold/20 bg-dcabra-gold/10 px-3 py-1.5">
              <Sparkles
                size={13}
                className="text-dcabra-gold"
                strokeWidth={2}
              />

              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-dcabra-gold">
                Sorteo en curso
              </span>
            </div>

            <h2 className="text-xl font-black uppercase tracking-tight text-dcabra-primary sm:text-2xl">
              Buscando al ganador
            </h2>

            <p className="mt-1 text-xs font-medium text-dcabra-muted">
              La suerte ya está girando
            </p>
          </div>

          {rouletteContent}

          <div
            aria-hidden="true"
            className="mt-5 flex items-center justify-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dcabra-primary/30" />
            <span className="h-1.5 w-6 animate-pulse rounded-full bg-dcabra-primary/70 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dcabra-primary/30 [animation-delay:300ms]" />
          </div>
        </div>
      </div>,
      document.body,
    )
    : null;

  return (
    <>
      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
        {!isSpinning && rouletteContent}
      </section>

      {spinningOverlay}
    </>
  );
}