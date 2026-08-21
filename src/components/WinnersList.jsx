import { Trophy } from "lucide-react";

export default function WinnersList({ winners }) {
  if (!winners.length) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-dcabra-border/50 bg-dcabra-primary/5 p-4">
        <Trophy size={18} className="text-dcabra-gold" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-dcabra-primary">Ganadores</h3>
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-dcabra-muted">{winners.length}</span>
      </div>
      <ul className="max-h-[320px] space-y-2 overflow-y-auto p-3">
        {winners.map((winner) => (
          <li key={winner.timestamp} className="flex items-start gap-3 rounded-xl bg-dcabra-primary/[0.04] p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dcabra-gold/15 text-xs font-bold text-dcabra-gold">
              #{winner.selectionNumber}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-dcabra-text">{winner.name}</p>
              <p className="mt-0.5 text-xs text-dcabra-muted">{winner.date} • {winner.time}</p>
            </div>
            <Trophy size={15} className="shrink-0 text-dcabra-gold" />
          </li>
        ))}
      </ul>
    </article>
  );
}
