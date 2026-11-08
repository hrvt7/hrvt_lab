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
