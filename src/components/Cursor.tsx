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
    let lastX = 0, lastY = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        // first move, or coming back from outside the window / an iframe
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
        shown = true;
      }
      lastX = e.clientX;
      lastY = e.clientY;
      xTo(e.clientX);
      yTo(e.clientY);
      coords.current!.textContent = `${String(Math.round(lastX)).padStart(4, "0")} · ${String(Math.round(lastY + window.scrollY)).padStart(5, "0")}`;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t ? t.dataset.cursor || "→" : null;
      if (next !== label) {
        label = next;
        el.dataset.mode = next ? "tag" : "cross";
        if (next) tag.current!.textContent = next;
      }
    };
    const hide = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
    };
    // Pointer left the page (window edge or into an iframe): hide, and re-show on the next move.
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };
    // While scrolling the pointer stays put but the page moves under it — keep the readout and target state fresh.
    const onScroll = () => {
      if (!shown) return;
      coords.current!.textContent = `${String(Math.round(lastX)).padStart(4, "0")} · ${String(Math.round(lastY + window.scrollY)).padStart(5, "0")}`;
      const t = (document.elementFromPoint(lastX, lastY) as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t ? t.dataset.cursor || "→" : null;
      if (next !== label) {
        label = next;
        el.dataset.mode = next ? "tag" : "cross";
        if (next) tag.current!.textContent = next;
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerout", out);
    window.addEventListener("blur", hide);
    window.addEventListener("hrvt:cursor-hide", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", out);
      window.removeEventListener("blur", hide);
      window.removeEventListener("hrvt:cursor-hide", hide);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={root}
      data-mode="cross"
      data-old-cursor=""
      aria-hidden
      className="group pointer-events-none invisible fixed left-0 top-0 z-[95] opacity-0 [@media(hover:none)]:hidden"
    >
      {/* crosshair */}
      <span className="absolute inset-0 mix-blend-difference">
      <span className="absolute left-[-13px] top-[-0.75px] h-[1.5px] w-[26px] bg-paper transition-transform duration-300 group-data-[mode=tag]:scale-0" />
      <span className="absolute left-[-0.75px] top-[-13px] h-[26px] w-[1.5px] bg-paper transition-transform duration-300 group-data-[mode=tag]:scale-0" />
      <span className="absolute left-[-3.5px] top-[-3.5px] h-[7px] w-[7px] rounded-full bg-paper transition-transform duration-300 group-data-[mode=tag]:scale-0" />
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
