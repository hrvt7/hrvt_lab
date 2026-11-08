"use client";

import { useEffect, useRef } from "react";
import { gsap, isFinePointer } from "@/lib/gsap";

/** Lerped dot that grows into a labelled disc over [data-cursor] targets. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    document.documentElement.classList.add("has-cursor");
    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let active: string | null = null;
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.4 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button");
      const next = t ? t.dataset.cursor ?? "" : null;
      if (next !== active) {
        active = next;
        if (next) {
          label.current!.textContent = next;
          gsap.to(el, { width: 92, height: 92, backgroundColor: "#ece9e2", duration: 0.5, ease: "expo.out" });
          gsap.to(label.current, { opacity: 1, scale: 1, duration: 0.35, delay: 0.05 });
        } else if (next === "") {
          gsap.to(el, { width: 44, height: 44, backgroundColor: "rgba(236,233,226,0.12)", duration: 0.5, ease: "expo.out" });
          gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.2 });
        } else {
          gsap.to(el, { width: 8, height: 8, backgroundColor: "#ece9e2", duration: 0.5, ease: "expo.out" });
          gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.2 });
        }
      }
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const enter = () => shown && gsap.to(el, { opacity: 1, duration: 0.3 });
    const down = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(3)" });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-2 w-2 items-center justify-center rounded-full bg-bone mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:flex"
    >
      <span ref={label} className="t-meta scale-50 text-[0.62rem] text-ink-950 opacity-0" />
    </div>
  );
}
