export default function DrawButton({ onClick, disabled, isSpinning }) {
  return (
    <button
      id="draw-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full max-w-xs overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold uppercase tracking-wider transition duration-300 ${
        isSpinning
          ? "cursor-not-allowed bg-dcabra-primary/70 text-white/80"
          : disabled
            ? "cursor-not-allowed bg-gray-200 text-gray-400"
            : "bg-dcabra-primary text-white shadow-lg hover:-translate-y-0.5 hover:bg-dcabra-primaryDark hover:shadow-xl"
      }`}
    >
      {!disabled && !isSpinning && <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />}
      {isSpinning ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 30" strokeLinecap="round" />
          </svg>
          Seleccionando...
        </span>
      ) : (
        <span className="relative">Seleccionar ganador</span>
      )}
    </button>
  );
}
