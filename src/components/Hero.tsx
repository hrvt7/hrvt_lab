"use client";

import { useEffect, useRef } from "react";
import { gsap, onReady, prefersReduced, scrollToHash } from "@/lib/gsap";
import { HeroShader } from "./HeroShader";
import { Magnetic } from "./Magnetic";
import { Clock } from "./Clock";

const DISCIPLINES = ["AI systems", "Automations", "Websites", "Real-time 3D"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const fade = useRef(1);

  useEffect(() => {
    const el = root.current!;
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".line-inner[data-hide]");
      const fades = el.querySelectorAll("[data-hero-fade]");
      gsap.set(fades, { opacity: 0, y: 18 });

      const off = onReady(() => {
        if (reduced) {
          gsap.set(lines, { y: 0, yPercent: 0 });
          gsap.set(fades, { opacity: 1, y: 0 });
          return;
        }
        const tl = gsap.timeline({ delay: 0.15 });
        tl.to(lines, { y: 0, yPercent: 0, duration: 1.5, stagger: 0.11, ease: "expo.out" })
          .to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.07 }, 0.55)
          .fromTo("[data-hero-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.3);
      });

      if (!reduced) {
        // Exit choreography: lines drift apart, shader dims.
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-l1]", { xPercent: -6, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-l2]", { xPercent: 9, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-copy]", { yPercent: -60, opacity: 0, ease: "none", scrollTrigger: st });
        gsap.to(fade, {
          current: 0.15,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      return off;
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <HeroShader fadeRef={fade} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-8 pt-32 md:pb-10">
        <div className="mb-10 grid gap-8 md:mb-14 md:grid-cols-12" data-hero-copy="">
          <p className="t-meta flex items-center gap-3 text-bone-2 md:col-span-6" data-hero-fade="">
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-ember pulse" />
            Independent studio of one — open for select projects
          </p>
        </div>

        <h1 className="t-display-xl" aria-label="Digital products with gravity.">
          <span className="line" data-hero-l1="">
            <span className="line-inner" data-hide="">
              Digital products
            </span>
          </span>
          <span className="line" data-hero-l2="">
            <span className="line-inner" data-hide="">
              with <span className="t-serif pr-[0.04em] text-ember">gravity</span>.
            </span>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12" data-hero-copy="">
          <p className="t-body-l max-w-[34ch] text-bone-2 md:col-span-5" data-hero-fade="">
            HRVT designs and engineers AI systems, automations, cinematic websites and real-time 3D software —
            <span className="text-bone"> end to end, for clients who notice the difference.</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:col-start-7" data-hero-fade="">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#work");
                }}
                className="btn btn--solid"
                data-cursor=""
              >
                See the work
                <Arrow />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#contact");
                }}
                className="btn"
                data-cursor=""
              >
                Start a project
              </a>
            </Magnetic>
          </div>
          <div className="t-meta hidden flex-col items-end gap-1 text-right text-bone-3 md:col-span-2 md:col-start-11 md:flex" data-hero-fade="">
            <span>47.23° N — 16.62° E</span>
            <span className="text-bone-2">
              <Clock />
            </span>
          </div>
        </div>

        <div className="relative mt-10 md:mt-14">
          <div data-hero-rule="" className="h-px origin-left bg-line-2" />
          <ul className="t-meta mt-4 flex flex-wrap justify-between gap-x-6 gap-y-2 text-bone-3">
            {DISCIPLINES.map((d, i) => (
              <li key={d} data-hero-fade="" className="flex gap-2">
                <span className="text-bone-2">0{i + 1}</span>
                {d}
              </li>
            ))}
            <li data-hero-fade="" className="hidden items-center gap-2 text-bone-2 sm:flex">
              Scroll
              <span className="relative block h-5 w-px overflow-hidden bg-line-2">
                <span className="absolute inset-x-0 top-0 h-2 animate-[scrollcue_1.8s_cubic-bezier(.76,0,.24,1)_infinite] bg-bone" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(250%)}}`}</style>
    </section>
  );
}

export function Arrow({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
