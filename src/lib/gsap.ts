"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Resolves once the preloader has finished (or immediately if it never ran). */
export function onReady(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const w = window as unknown as { __hrvtReady?: boolean };
  if (w.__hrvtReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("hrvt:ready", h, { once: true });
  return () => window.removeEventListener("hrvt:ready", h);
}

export function scrollToHash(hash: string) {
  const w = window as unknown as { __lenis?: { scrollTo: (t: string | number, o?: object) => void } };
  if (w.__lenis) w.__lenis.scrollTo(hash, { offset: 0, duration: 1.6 });
  else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}
