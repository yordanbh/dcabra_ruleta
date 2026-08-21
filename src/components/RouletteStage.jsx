import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PartyPopper } from "lucide-react";
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

  useLayoutEffect(() => {
    if (!isSpinning || !stageRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        {
          scale: 0.88,
          opacity: 0.8,
        },
        {
          scale: 1.06,
          opacity: 1,
          duration: 0.75,
          ease: "back.out(1.6)",
        },
      );
    }, stageRef);

    return () => context.revert();
  }, [isSpinning]);

  return (
    <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
      <div
        className={
          isSpinning
            ? "fixed inset-0 z-[70] flex items-center justify-center bg-white/95 p-4 backdrop-blur-xl"
            : "flex h-full w-full items-center justify-center"
        }
      >
        <div
          id="roulette-stage"
          ref={stageRef}
          className={`flex w-full max-w-xl flex-col items-center ${isSpinning ? "gap-5" : "gap-3"
            }`}
          style={{
            viewTransitionName: "raffle-focus",
          }}
        >
          {isSpinning && (
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-dcabra-gold">
                La suerte está girando
              </p>

              <h2 className="mt-1 text-xl font-black uppercase text-dcabra-primary md:text-2xl">
                Buscando al ganador
              </h2>
            </div>
          )}

          <Roulette
            participants={participants}
            isSpinning={isSpinning}
            targetAngle={targetAngle}
          />

          {isFinished ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-gold/20 bg-dcabra-gold/10 p-4 text-center">
              <PartyPopper
                size={28}
                className="mx-auto mb-2 text-dcabra-gold"
              />

              <h3 className="font-bold text-dcabra-text">
                Dinámica finalizada
              </h3>

              <p className="mt-1 text-sm text-dcabra-muted">
                Ya no quedan participantes disponibles.
              </p>
            </div>
          ) : participants.length === 0 ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-border bg-dcabra-primaryFaded p-4 text-center">
              <p className="text-sm text-dcabra-muted">
                Carga una lista para comenzar.
              </p>
            </div>
          ) : (
            <DrawButton
              onClick={onDraw}
              disabled={!canSpin}
              isSpinning={isSpinning}
            />
          )}
        </div>
      </div>
    </section>
  );
}