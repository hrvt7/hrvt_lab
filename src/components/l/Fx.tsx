"use client";

import { useEffect } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger, prefersReduced, isFinePointer } from "@/lib/gsap";

gsap.registerPlugin(SplitText);

/** Slow, exact reveals. Everything animates transform and opacity only. */
export function Fx() {
  useEffect(() => {
    if (prefersReduced()) return;
    let ctx: gsap.Context | null = null;
    let dead = false;
    let cleanup = () => {};

    document.fonts.ready.then(() => {
      if (dead) return;
      ctx = gsap.context(() => {
        const ease = "expo.out";
        gsap.from("[data-l-hero]", { y: 22, opacity: 0, duration: 1.4, ease, stagger: 0.12, delay: 0.2 });

        // Headings rise line by line out of their own baseline.
        gsap.utils.toArray<HTMLElement>("[data-l-lines]").forEach((el) => {
          const sp = new SplitText(el, { type: "lines", mask: "lines", linesClass: "l-ln", aria: "auto" });
          gsap.from(sp.lines, { yPercent: 112, duration: 1.5, ease, stagger: 0.12, scrollTrigger: { trigger: el, start: "top 86%" } });
        });
        gsap.utils.toArray<HTMLElement>("[data-l-in]").forEach((el) => {
          gsap.from(el, { y: 24, opacity: 0, duration: 1.3, ease, scrollTrigger: { trigger: el, start: "top 90%" } });
        });
        gsap.from("[data-l-big]", { yPercent: 100, duration: 1.8, ease, scrollTrigger: { trigger: "[data-l-big-wrap]", start: "top 96%" } });
        // Folyamat: each hairline draws, then its step settles under it.
        gsap.utils.toArray<HTMLElement>("[data-l-step]").forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%" } });
          tl.from(el.querySelector("[data-l-rule]"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" })
            .from(el.querySelector(".l-step-n"), { yPercent: 60, opacity: 0, duration: 1.2, ease }, 0.25)
            .from(el.querySelector("div"), { y: 20, opacity: 0, duration: 1.2, ease }, 0.35);
        });
      });
      // Mit vállalok: when a service takes the stage, its paragraph arrives word by word, like a reply being written.
      const bodies = [...document.querySelectorAll<HTMLElement>("[data-l-item] .l-body")].map((el) => new SplitText(el, { type: "words", aria: "none" }).words);
      const stream = (e: Event) => {
        const words = bodies[(e as CustomEvent<number>).detail];
        if (!words) return;
        gsap.killTweensOf(words);
        gsap.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "none", stagger: 0.022, delay: 0.35 });
      };
      window.addEventListener("l:stage", stream);

      // The main buttons lean toward the pointer before you reach them.
      const offs: (() => void)[] = [() => window.removeEventListener("l:stage", stream)];
      if (isFinePointer()) {
        document.querySelectorAll<HTMLElement>("[data-l-magnet]").forEach((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" }), y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            const k = Math.max(0, 1 - Math.hypot(dx / (r.width / 2 + 70), dy / (r.height / 2 + 70)));
            x(dx * 0.28 * k);
            y(dy * 0.4 * k);
          };
          window.addEventListener("pointermove", move, { passive: true });
          offs.push(() => window.removeEventListener("pointermove", move));
        });
      }
      cleanup = () => offs.forEach((f) => f());
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      dead = true;
      cleanup();
      ctx?.revert();
    };
  }, []);
  return null;
}
