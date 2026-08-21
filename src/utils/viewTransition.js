import { flushSync } from "react-dom";

export function runViewTransition(update) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduceMotion) {
    flushSync(update);
    return Promise.resolve();
  }

  return document.startViewTransition(() => {
    flushSync(update);
  }).finished;
}
