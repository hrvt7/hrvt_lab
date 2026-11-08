"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced, onReady } from "@/lib/gsap";

/**
 * Lenis smooth scroll on GSAP's ticker + declarative reveals:
 *  [data-rise]  — each child rises out of a clipped baseline (staggered)
 *  [data-fade]  — soft lift-in (value = delay)
 *  [data-theme] — tells the nav whether it sits on night or kiwi
 */
export function Motion() {
  useEffect(() => {
    const reduced = prefersReduced();
    let lenis: Lenis | null = null;
    const w = window as unknown as { __lenis?: Lenis; __hrvtReady?: boolean };

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.3 });
      w.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis!.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      if (!w.__hrvtReady) lenis.stop();
    }

    let ctx: gsap.Context | null = null;
    const off = onReady(() => {
      lenis?.start();
      ctx = gsap.context(() => {
        // Nav theme follows whichever section sits under it.
        gsap.utils.toArray<HTMLElement>("[data-theme]").forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 40px",
            end: "bottom 40px",
            onToggle: (s) => s.isActive && document.documentElement.setAttribute("data-nav", sec.dataset.theme!),
          });
        });
        if (reduced) return;

        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.to(el.querySelectorAll(".ri"), {
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            delay: Number(el.dataset.rise || 0),
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: Number(el.dataset.fade || 0),
            scrollTrigger: { trigger: el, start: "top 92%" },
          });
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // Re-measure triggers whenever the document height changes (fonts, images, lazy content).
    let h = 0;
    let to: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      const nh = document.body.scrollHeight;
      if (Math.abs(nh - h) < 2) return;
      h = nh;
      clearTimeout(to);
      to = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      clearTimeout(to);
      off();
      ctx?.revert();
      lenis?.destroy();
    };
  }, []);
  return null;
}
