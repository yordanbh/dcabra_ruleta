import { RotateCcw } from "lucide-react";
import raffleConfig from "../config/raffleConfig";
import ConfirmResetModal from "./ConfirmResetModal";

export default function Header({ onReplayWelcome, onReset }) {
  return (
    <header className="flex w-full flex-col items-center gap-3 py-5">
      <div className="flex w-full items-center justify-center gap-3">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onReplayWelcome}
            className="inline-flex items-center bg-dcabra-primary gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-dcabra-primary/20 hover:text-dcabra-primary"
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
