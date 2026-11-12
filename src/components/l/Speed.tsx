"use client";

import { useEffect } from "react";

/**
 * "Fejlesztés": how long this page took to load on the visitor's own device, read from the browser's
 * navigation timing. Shown only when it is honestly fast (under 3 s); counts up the first time the
 * service comes on stage.
 */
export function Speed() {
  useEffect(() => {
    const box = document.querySelector<HTMLElement>("[data-l-speed]");
    const out = box?.querySelector<HTMLElement>("[data-l-speed-n]");
    if (!box || !out) return;
    let ms = 0, shown = false, raf = 0;
    const fmt = (v: number) => `${(v / 1000).toFixed(2).replace(".", ",")} mp`;
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      ms = nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : 0;
      if (ms > 0 && ms < 3000) { box.hidden = false; out.textContent = fmt(ms); }
    };
    if (document.readyState === "complete") setTimeout(read, 0);
    else window.addEventListener("load", () => setTimeout(read, 0), { once: true });

    const count = () => {
      if (shown || !ms || box.hidden) return;
      shown = true;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1100);
        out.textContent = fmt(ms * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const onStage = (e: Event) => { if ((e as CustomEvent<number>).detail === 1) count(); };
    window.addEventListener("l:stage", onStage);
    return () => { window.removeEventListener("l:stage", onStage); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
