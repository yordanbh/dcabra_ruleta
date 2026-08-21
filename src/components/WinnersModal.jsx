import { useEffect } from "react";
import {
    CalendarDays,
    Clock,
    Trophy,
    X,
} from "lucide-react";

export default function WinnersModal({
    winners,
    isOpen,
    onClose,
}) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="winners-title"
                className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-2xl animate-scale-in"
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* Encabezado */}
                <div className="flex items-center justify-between border-b border-dcabra-border bg-dcabra-gold/10 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dcabra-gold/15">
                            <Trophy
                                size={20}
                                className="text-dcabra-gold"
                            />
                        </div>

                        <div>
                            <h2
                                id="winners-title"
                                className="font-bold text-dcabra-text"
                            >
                                Ganadores del sorteo
                            </h2>

                            <p className="text-xs text-dcabra-muted">
                                {winners.length} ganador
                                {winners.length !== 1 ? "es" : ""}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar ganadores"
                        className="rounded-xl p-2 text-dcabra-muted transition hover:bg-dcabra-gold/10 hover:text-dcabra-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-4">
                    {winners.length > 0 ? (
                        <ul className="space-y-2">
                            {winners.map((winner) => (
                                <li
                                    key={winner.timestamp}
                                    className="flex items-center gap-3 rounded-xl border border-dcabra-border/60 bg-dcabra-primary/[0.03] p-3 transition hover:bg-dcabra-primary/[0.06]"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dcabra-gold/15">
                                        <span className="text-xs font-black text-dcabra-gold">
                                            #{winner.selectionNumber}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-dcabra-text">
                                            {winner.name}
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-dcabra-muted">
                                            <span className="inline-flex items-center gap-1">
                                                <CalendarDays size={12} />
                                                {winner.date}
                                            </span>

                                            <span className="inline-flex items-center gap-1">
                                                <Clock size={12} />
                                                {winner.time}
                                            </span>
                                        </div>
                                    </div>

                                    <Trophy
                                        size={16}
                                        className="shrink-0 text-dcabra-gold"
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="py-8 text-center text-sm text-dcabra-muted">
                            Todavía no hay ganadores.
                        </p>
                    )}
                </div>

                {/* Pie */}
                <div className="border-t border-dcabra-border/50 p-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-dcabra-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-dcabra-primaryDark"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}