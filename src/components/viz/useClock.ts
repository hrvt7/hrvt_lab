"use client";
import { useEffect, useState, type RefObject } from "react";
import { useVisible } from "./useVisible";

/** Seconds elapsed in a looping cycle, ticking ~20×/s and only while the element is on screen. */
export function useClock(ref: RefObject<Element | null>, period: number) {
  const vis = useVisible(ref, "80px");
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!vis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setT(period * 0.7); return; }
    const t0 = performance.now() - t * 1000;
    const id = setInterval(() => setT(((performance.now() - t0) / 1000) % period), 50);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vis, period]);
  return t;
}
export const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
