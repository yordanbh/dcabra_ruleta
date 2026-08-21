import { Gift } from "lucide-react";
import raffleConfig from "../config/raffleConfig";

export default function PrizeCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Gift size={18} className="text-dcabra-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-dcabra-primary">Premio</h3>
        </div>
        <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-dcabra-primaryFaded p-4">
          <img src={raffleConfig.prizeImage} alt={raffleConfig.prizeName} className="max-h-[120px] w-auto object-contain" />
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-dcabra-text">{raffleConfig.prizeName}</p>
        <p className="mt-1 text-center text-xs text-dcabra-muted">{raffleConfig.prizeDescription}</p>
      </div>
    </article>
  );
}
