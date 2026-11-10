"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import { STEPS } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";

/** Sticky odometer on the left rolls 01 → 04 while the steps pass on the right. */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (s) => s.isActive && setActive(i),
        });
      });
      if (!prefersReduced()) {
        gsap.fromTo(
          "[data-pbar]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 55%", end: "bottom 55%", scrub: true } },
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.to(digits.current, { yPercent: -25 * active, duration: prefersReduced() ? 0 : 0.9, ease: "expo.inOut" });
  }, [active]);

  return (
    <section ref={root} id="folyamat" data-theme="night" className="relative bg-night-2">
      <div className="wrap py-[var(--sec)]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Meta n="04">Folyamat</Meta>
              <Rise as="h2" className="t-l mt-8" lines={[<>Így lesz</>, <>ötletből</>, <span className="text-kiwi">éles rendszer.</span>]} />
              <div className="mt-12 hidden items-end gap-6 md:flex" aria-hidden>
                <span
                  className="flex items-start font-display leading-none text-kiwi"
                  style={{ fontSize: "clamp(5rem, 10vw, 9.5rem)", fontVariationSettings: '"wght" 650' }}
                >
                  <span>0</span>
                  <span className="relative inline-block h-[1em] overflow-hidden leading-none">
                    <span ref={digits} className="block">
                      {STEPS.map((s) => (
                        <span key={s.n} className="block h-[1em]">
                          {s.n[1]}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
                <span className="t-meta mb-3 text-smoke">/ 04</span>
              </div>
            </div>
          </div>

          <div className="relative md:col-span-6 md:col-start-7" data-steps="">
            <span className="absolute -left-6 top-0 hidden h-full w-px bg-line md:block" aria-hidden />
            <span data-pbar="" className="absolute -left-6 top-0 hidden h-full w-px origin-top bg-kiwi md:block" aria-hidden />
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                data-step=""
                data-active={active === i}
                className="flex flex-col justify-center border-t border-line py-12 transition-opacity duration-700 md:min-h-[62vh] md:border-none md:data-[active=false]:opacity-30"
              >
                <p className="t-meta mb-5 text-kiwi md:hidden">{s.n}</p>
                <h3 className="t-l mb-6">{s.title}</h3>
                <p className="t-lead max-w-[38ch] text-smoke">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
