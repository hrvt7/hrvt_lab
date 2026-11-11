"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced, onReady } from "@/lib/gsap";

/**
 * Lenis smooth scroll on GSAP's ticker + declarative reveals:
 *  [data-rise]  — each child rises out of a clipped baseline (staggered)
 *  [data-fade]  — soft lift-in (value = delay)
 *  [data-words] — words sharpen one by one, scrubbed by scroll
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
        // [data-words]: the paragraph sharpens word by word as it crosses the screen.
        gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
          const walk = (n: Node) => {
            if (n.nodeType === 3) {
              const parts = (n.textContent || "").split(/(\s+)/);
              const f = document.createDocumentFragment();
              parts.forEach((p) => {
                if (!p.trim()) return f.appendChild(document.createTextNode(p));
                const sp = document.createElement("span");
                sp.className = "wd";
                sp.textContent = p;
                f.appendChild(sp);
              });
              n.parentNode!.replaceChild(f, n);
            } else if (n.nodeType === 1) [...n.childNodes].forEach(walk);
          };
          if (!el.querySelector(".wd")) [...el.childNodes].forEach(walk);
          gsap.fromTo(
            el.querySelectorAll(".wd"),
            { filter: "blur(5px) opacity(0.2)", y: 6 },
            { filter: "blur(0px) opacity(1)", y: 0, ease: "none", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 88%", end: "top 45%", scrub: 0.4 } },
          );
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
