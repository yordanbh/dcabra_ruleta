import { useEffect, useState } from "react";
import { Search, Users, X } from "lucide-react";

export default function ParticipantList({ participants, isOpen, onClose }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = participants.filter((name) =>
    name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")),
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="participants-title"
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-2xl animate-scale-in"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-dcabra-border bg-dcabra-primary/5 p-5">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-dcabra-primary" />
            <div>
              <h3 id="participants-title" className="text-lg font-bold text-dcabra-text">Participantes</h3>
              <p className="text-xs text-dcabra-muted">{participants.length} disponibles</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-xl p-2 text-dcabra-muted hover:bg-dcabra-primary/10 hover:text-dcabra-primary">
            <X size={20} />
          </button>
        </div>
        <div className="border-b border-dcabra-border/50 p-4">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dcabra-muted" />
            <input
              autoFocus
              type="search"
              placeholder="Buscar participante..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-dcabra-border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-dcabra-primary focus:ring-2 focus:ring-dcabra-primary/20"
            />
          </label>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length ? (
            <ul className="space-y-1">
              {filtered.map((participant) => (
                <li key={participant} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-dcabra-primary/5">
                  <span className="w-6 text-right font-mono text-xs text-dcabra-muted">{participants.indexOf(participant) + 1}.</span>
                  <span className="text-sm font-medium text-dcabra-text">{participant}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-dcabra-muted">No se encontraron resultados.</p>
          )}
        </div>
        <p className="border-t border-dcabra-border/50 bg-gray-50/50 p-4 text-center text-xs text-dcabra-muted">
          Mostrando {filtered.length} de {participants.length}
        </p>
      </div>
    </div>
  );
}
