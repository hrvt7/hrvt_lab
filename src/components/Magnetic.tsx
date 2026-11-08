"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, isFinePointer } from "@/lib/gsap";

export function Magnetic({
  children,
  strength = 0.32,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isFinePointer()) return;
    const el = ref.current!;
    const inner = el.firstElementChild as HTMLElement | null;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      if (inner) gsap.to(inner, { x: dx * strength * 0.35, y: dy * strength * 0.35, duration: 0.6, ease: "power3" });
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
