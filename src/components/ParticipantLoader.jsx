import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  Sparkles,
  UploadCloud,
} from "lucide-react";

const ACCEPTED_FILES =
  ".txt,.csv,.tsv,.xlsx,.xls,.xlsm,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export default function ParticipantLoader({
  onLoadFile,
  onLoadDemo,
  disabled,
}) {
  const inputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file) => {
    if (!file || disabled || isLoading) return;

    setIsLoading(true);

    try {
      await onLoadFile(file);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    await processFile(file);

    // Permite volver a seleccionar el mismo archivo.
    event.target.value = "";
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled || isLoading) return;

    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled || isLoading) return;

    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current -= 1;

    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current = 0;
    setIsDragging(false);

    if (disabled || isLoading) return;

    const file = event.dataTransfer.files?.[0];

    await processFile(file);
  };

  const isDisabled = disabled || isLoading;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILES}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isDisabled}
        className={`
          inline-flex items-center gap-2 rounded-xl
          border-2 px-5 py-2.5 text-sm font-semibold
          transition-all duration-300
          disabled:cursor-not-allowed disabled:opacity-40
          ${isDragging
            ? "scale-105 border-dcabra-primary bg-dcabra-primary text-white shadow-lg"
            : "border-dcabra-primary text-dcabra-primary hover:bg-dcabra-primary hover:text-white"
          }
        `}
      >
        {isDragging ? (
          <UploadCloud size={16} />
        ) : (
          <FileSpreadsheet size={16} />
        )}

        {isLoading
          ? "Procesando..."
          : isDragging
            ? "Suelta el archivo"
            : "Cargar participantes"}
      </button>

      <button
        type="button"
        onClick={onLoadDemo}
        disabled={isDisabled}
        className="
          inline-flex items-center gap-2 rounded-xl
          bg-dcabra-primary/10 px-5 py-2.5
          text-sm font-semibold text-dcabra-primary
          transition hover:bg-dcabra-primary/20
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <Sparkles size={16} />
        Cargar demo
      </button>
    </div>
  );
}