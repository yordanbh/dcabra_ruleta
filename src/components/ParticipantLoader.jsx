import { useRef } from "react";
import { Sparkles, Upload } from "lucide-react";

export default function ParticipantLoader({ onLoadFile, onLoadDemo, disabled }) {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onLoadFile(file);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-dcabra-primary px-5 py-2.5 text-sm font-semibold text-dcabra-primary transition hover:bg-dcabra-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Upload size={16} /> Cargar lista
      </button>
      <button
        type="button"
        onClick={onLoadDemo}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl bg-dcabra-primary/10 px-5 py-2.5 text-sm font-semibold text-dcabra-primary transition hover:bg-dcabra-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles size={16} /> Cargar demo
      </button>
    </div>
  );
}
