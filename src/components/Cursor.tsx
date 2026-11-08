"use client";

import { useEffect, useRef } from "react";
import { gsap, isFinePointer } from "@/lib/gsap";

/** Engineering crosshair with live coordinates; becomes a labelled kiwi tag over [data-cursor]. */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const coords = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    document.documentElement.classList.add("has-cursor");
    const el = root.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3" });
    let label: string | null = null;
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      coords.current!.textContent = `${String(Math.round(e.clientX)).padStart(4, "0")} · ${String(Math.round(e.clientY + window.scrollY)).padStart(5, "0")}`;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t ? t.dataset.cursor || "→" : null;
      if (next !== label) {
        label = next;
        el.dataset.mode = next ? "tag" : "cross";
        if (next) tag.current!.textContent = next;
      }
    };
    const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={root}
      data-mode="cross"
      aria-hidden
      className="group pointer-events-none invisible fixed left-0 top-0 z-[95] opacity-0 [@media(hover:none)]:hidden"
    >
      {/* crosshair */}
      <span className="absolute inset-0 mix-blend-difference">
      <span className="absolute left-[-10px] top-0 h-px w-5 bg-paper transition-transform duration-300 group-data-[mode=tag]:scale-0" />
      <span className="absolute left-0 top-[-10px] h-5 w-px bg-paper transition-transform duration-300 group-data-[mode=tag]:scale-0" />
      <span
        ref={coords}
        className="t-meta absolute left-3 top-3 whitespace-nowrap text-[0.6rem] text-paper/70 transition-opacity duration-300 group-data-[mode=tag]:opacity-0"
      />
      </span>
      {/* tag */}
      <span
        ref={tag}
        className="t-meta absolute left-0 top-0 origin-top-left -translate-x-1/2 -translate-y-1/2 scale-0 whitespace-nowrap rounded-full bg-kiwi px-3.5 py-2 text-[0.66rem] text-night transition-transform duration-300 ease-[cubic-bezier(.7,0,.2,1)] group-data-[mode=tag]:scale-100"
      />
    </div>
  );
}
