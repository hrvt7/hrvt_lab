import type { ElementType, ReactNode } from "react";

/** Lines that rise out of their own clipped baseline. Extra headroom keeps Hungarian accents (Á, Ő, Ű) unclipped. */
export function Rise({ lines, as: Tag = "h2", className = "", delay }: { lines: ReactNode[]; as?: ElementType; className?: string; delay?: number }) {
  return (
    <Tag className={className} data-rise={delay ?? ""}>
      {lines.map((l, i) => (
        <span key={i} className="rl">
          <span className="ri">{l}</span>
        </span>
      ))}
    </Tag>
  );
}
