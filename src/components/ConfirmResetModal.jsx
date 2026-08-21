import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export default function ConfirmResetModal({ onReset }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-dcabra-muted transition hover:bg-dcabra-primary/5 hover:text-dcabra-primary"
      >
        <RotateCcw size={14} /> Reiniciar dinámica
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-2xl animate-scale-in"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <RotateCcw size={24} className="text-red-500" />
              </div>
              <h3 id="reset-title" className="text-lg font-bold text-dcabra-text">¿Reiniciar dinámica?</h3>
              <p className="mt-2 text-sm text-dcabra-muted">Se eliminarán participantes y ganadores guardados.</p>
            </div>
            <div className="flex border-t border-dcabra-border/50">
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3.5 text-sm font-semibold text-dcabra-muted hover:bg-gray-50">Cancelar</button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                className="flex-1 border-l border-dcabra-border/50 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
