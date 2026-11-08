"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced, onReady } from "@/lib/gsap";

/**
 * Global motion layer: Lenis smooth scroll wired into GSAP's ticker,
 * plus declarative scroll reveals for [data-lines="auto"], [data-fade], [data-clip], [data-parallax].
 */
export function Motion() {
  useEffect(() => {
    const reduced = prefersReduced();
    let lenis: Lenis | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      if (!(window as unknown as { __hrvtReady?: boolean }).__hrvtReady) lenis.stop();
      onReady(() => lenis?.start());
    }

    let ctx: gsap.Context | null = null;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        if (reduced) return;

        gsap.utils.toArray<HTMLElement>('[data-lines="auto"]').forEach((el) => {
          gsap.to(el.querySelectorAll(".line-inner[data-hide]"), {
            yPercent: 0,
            y: 0,
            duration: 1.25,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: Number(el.dataset.fade || 0),
            scrollTrigger: { trigger: el, start: "top 92%" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
          gsap.to(el, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax || 0.15);
          gsap.fromTo(
            el,
            { yPercent: -amt * 50 },
            {
              yPercent: amt * 50,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("load", onResize);

    return () => {
      off();
      ctx?.revert();
      lenis?.destroy();
      window.removeEventListener("load", onResize);
    };
  }, []);

  return null;
}
