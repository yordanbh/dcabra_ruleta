import { RotateCcw } from "lucide-react";
import raffleConfig from "../config/raffleConfig";
import ConfirmResetModal from "./ConfirmResetModal";

export default function Header({ onReplayWelcome, onReset }) {
  return (
    <header className="flex w-full flex-col items-center gap-3 py-5">
      <div className="flex w-full items-start justify-between gap-3">
        <span className="w-28" aria-hidden="true" />
        <img
          src={raffleConfig.logo}
          alt="Logo D'Cabra"
          className="h-16 w-auto rounded-xl object-contain md:h-20"
        />
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onReplayWelcome}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-dcabra-muted transition hover:bg-dcabra-primary/5 hover:text-dcabra-primary"
          >
            <RotateCcw size={14} />
            Ver bienvenida
          </button>

          <ConfirmResetModal onReset={onReset} />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-dcabra-primary md:text-3xl">
          {raffleConfig.title}
        </h1>
        <p className="mt-1 text-sm font-medium text-dcabra-muted md:text-base">{raffleConfig.subtitle}</p>
      </div>
    </header>
  );
}
