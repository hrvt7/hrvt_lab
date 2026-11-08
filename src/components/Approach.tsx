"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { STEPS } from "@/lib/content";
import { Label } from "./Lines";

/** Pinned horizontal rail on desktop; a clean vertical stack on mobile. */
export function Approach() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const r = rail.current!;
      const dist = () => r.scrollWidth - window.innerWidth;
      const tween = gsap.to(r, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (s) => gsap.set("[data-aprog]", { scaleX: s.progress }),
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-step-num]").forEach((n) => {
        gsap.fromTo(
          n,
          { xPercent: 30 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: n.closest("[data-step]"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="approach" className="relative overflow-hidden bg-ink-900 min-[900px]:h-[100svh]">
      <div className="flex h-full flex-col py-[var(--section)] min-[900px]:py-0">
        <div className="wrap flex items-end justify-between gap-8 min-[900px]:pt-24">
          <div>
            <Label n="04">Approach</Label>
            <h2 className="t-display-l mt-8" data-lines="auto">
              <span className="line">
                <span className="line-inner" data-hide="">
                  How it <span className="t-serif">gets</span> built.
                </span>
              </span>
            </h2>
          </div>
          <div className="hidden w-64 min-[900px]:block">
            <div className="h-px w-full bg-line-2">
              <div data-aprog="" className="h-full origin-left scale-x-0 bg-ember" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div
            ref={rail}
            className="wrap mt-14 flex flex-col gap-px min-[900px]:mt-0 min-[900px]:w-max min-[900px]:flex-row min-[900px]:gap-[var(--gutter)] min-[900px]:pr-[30vw]"
          >
            {STEPS.map((s) => (
              <article
                key={s.n}
                data-step=""
                className="relative flex flex-col justify-between overflow-hidden border-t border-line py-10 min-[900px]:h-[min(46vh,460px)] min-[900px]:w-[min(38vw,560px)] min-[900px]:rounded-[18px] min-[900px]:border min-[900px]:bg-ink-950 min-[900px]:p-10"
                data-fade=""
              >
                <span
                  data-step-num=""
                  className="pointer-events-none absolute -right-4 -top-6 font-display text-[clamp(8rem,16vw,15rem)] font-[760] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(236,233,226,0.12)]"
                  aria-hidden
                >
                  {s.n}
                </span>
                <p className="t-meta text-bone-3">{s.meta}</p>
                <div className="relative mt-16 min-[900px]:mt-0">
                  <h3 className="t-h2 mb-5">{s.title}</h3>
                  <p className="max-w-[40ch] text-bone-2">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
