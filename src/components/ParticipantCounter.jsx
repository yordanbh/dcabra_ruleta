import { Trophy, Users } from "lucide-react";

export default function ParticipantCounter({ count, winnersCount }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
      <div className="flex items-center gap-2 rounded-xl bg-dcabra-primary/5 px-4 py-2">
        <Users size={18} className="text-dcabra-primary" />
        <span className="text-sm font-semibold text-dcabra-text">
          <strong className="text-dcabra-primary">{count}</strong> participante{count !== 1 ? "s" : ""} disponible{count !== 1 ? "s" : ""}
        </span>
      </div>
      {winnersCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-dcabra-gold/10 px-4 py-2">
          <Trophy size={17} className="text-dcabra-gold" />
          <span className="text-sm font-semibold text-dcabra-text">
            <strong className="text-dcabra-gold">{winnersCount}</strong> ganador{winnersCount !== 1 ? "es" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
