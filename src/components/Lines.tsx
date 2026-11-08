import type { ElementType, ReactNode } from "react";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** "auto" = revealed on scroll by <Motion/>; "manual" = animated by the owning component */
  mode?: "auto" | "manual";
  id?: string;
};

export function Lines({ lines, as: Tag = "h2", className, mode = "auto", id }: Props) {
  return (
    <Tag className={className} data-lines={mode} id={id}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span className="line-inner" data-hide="">
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Label({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <p className={`t-meta flex items-center gap-3 text-bone-3 ${className}`} data-fade="">
      <span className="text-bone-2">({n})</span>
      <span className="h-px w-8 bg-line-2" />
      <span>{children}</span>
    </p>
  );
}
