import raffleConfig from "../config/raffleConfig";

/**
 * Returns an absolute landing angle plus complete turns. Canvas arcs start at
 * 3 o'clock, while the pointer is at 12 o'clock (270 degrees in canvas space).
 */
export function calculateTargetAngle(winnerIndex, totalParticipants) {
  if (totalParticipants <= 0) return 0;

  const segmentAngle = 360 / totalParticipants;
  const segmentCenter = segmentAngle * winnerIndex + segmentAngle / 2;
  const landingAngle = (270 - segmentCenter + 360) % 360;
  const minSpins = raffleConfig.minSpins ?? 5;
  const maxSpins = raffleConfig.maxSpins ?? 7;
  const fullSpins = Math.floor(minSpins + Math.random() * (maxSpins - minSpins + 1));

  return landingAngle + fullSpins * 360;
}
