import { WORDMARK, MONOGRAM } from "@/lib/logo";

export function Wordmark({ className = "h-5 w-auto", title = "HRVT" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={WORDMARK.viewBox} className={className} role="img" aria-label={title} fill="currentColor">
      <path d={WORDMARK.d} data-wm-path="" />
    </svg>
  );
}

export function Monogram({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox={MONOGRAM.viewBox} className={className} aria-hidden fill="currentColor">
      <path d={MONOGRAM.d} />
    </svg>
  );
}

// The wordmark's sub-paths: H (2 pieces), R, V, T. Used to stack "HR" over "VT" on narrow screens.
const SUBS = WORDMARK.d.match(/M[^M]+/g) ?? [];
const [, VY, , VH] = WORDMARK.viewBox.split(" ").map(Number);
export function WordmarkHalf({ half, className = "" }: { half: 0 | 1; className?: string }) {
  return (
    <svg viewBox={half ? `1329 ${VY} 1252 ${VH}` : `40 ${VY} 1338 ${VH}`} className={className} aria-hidden fill="currentColor">
      <path d={(half ? SUBS.slice(3) : SUBS.slice(0, 3)).join("")} />
    </svg>
  );
}
