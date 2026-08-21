import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PartyPopper, Users } from "lucide-react";
import DrawButton from "./DrawButton";
import Roulette from "./Roulette";

export default function RouletteStage({
  participants,
  isSpinning,
  targetAngle,
  totalParticipants,
  maxVisible,
  canSpin,
  isFinished,
  onDraw,
}) {
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    if (!isSpinning || !stageRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        { scale: 0.88, opacity: 0.8 },
        { scale: 1.06, opacity: 1, duration: 0.75, ease: "back.out(1.6)" },
      );
    }, stageRef);
    return () => context.revert();
  }, [isSpinning]);

  const limited = totalParticipants > maxVisible;

  return (
    <section className="relative min-h-[70vh]">
      <div
        className={`flex items-center justify-center ${isSpinning
          ? "fixed inset-0 z-[70] bg-white/92 p-4 backdrop-blur-xl"
          : "absolute inset-0 z-50 p-4 backdrop-blur-xl"
          }`}
      >
        <div
          id="roulette-stage"
          ref={stageRef}
          className="flex w-full max-w-xl flex-col items-center gap-5"
          style={{ viewTransitionName: "raffle-focus" }}
        >
          {isSpinning && (
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-dcabra-gold">La suerte está girando</p>
              <h2 className="mt-1 text-xl font-black uppercase text-dcabra-primary md:text-2xl">Buscando al ganador</h2>
            </div>
          )}

          <Roulette participants={participants} isSpinning={isSpinning} targetAngle={targetAngle} />

          {limited && !isSpinning && (
            <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-dcabra-border bg-dcabra-primaryFaded/70 px-5 py-3">
              <Users size={18} className="shrink-0 text-dcabra-primary" />
              <p className="text-xs leading-snug text-dcabra-muted">
                Hay <strong className="text-dcabra-primary">{totalParticipants}</strong> participantes. La ruleta muestra una selección de <strong className="text-dcabra-primary">{participants.length}</strong>; el ganador se elige entre todos.
              </p>
            </div>
          )}

          {isFinished ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-gold/20 bg-dcabra-gold/10 p-6 text-center">
              <PartyPopper size={32} className="mx-auto mb-3 text-dcabra-gold" />
              <h3 className="text-lg font-bold text-dcabra-text">Dinámica finalizada</h3>
              <p className="mt-2 text-sm text-dcabra-muted">Ya no quedan participantes disponibles.</p>
            </div>
          ) : totalParticipants === 0 ? (
            <div className="w-full max-w-sm rounded-2xl border border-dcabra-border bg-dcabra-primaryFaded p-6 text-center">
              <p className="text-sm text-dcabra-muted">Carga una lista para comenzar.</p>
            </div>
          ) : (
            <DrawButton onClick={onDraw} disabled={!canSpin} isSpinning={isSpinning} />
          )}
        </div>
      </div>
    </section>
  );
}
