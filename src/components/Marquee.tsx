"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

const ITEMS = ["AI systems", "Automations", "Websites", "Real-time 3D", "Configurators", "Copilots", "Landing pages"];

/** Velocity-reactive marquee: speeds up and skews with scroll. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const el = track.current!;
    let x = 0;
    let dir = -1;
    let boost = 0;
    const half = () => el.scrollWidth / 2;
    const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });
    const st = ScrollTrigger.create({
      onUpdate: (s) => {
        const v = s.getVelocity();
        dir = v < 0 ? 1 : -1;
        boost = Math.min(Math.abs(v) / 120, 18);
        skewTo(gsap.utils.clamp(-8, 8, -v / 300));
      },
    });
    const tick = () => {
      boost *= 0.94;
      x += dir * (0.6 + boost);
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      gsap.set(el, { x });
      if (Math.abs(boost) < 0.05) skewTo(0);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const row = (
    <>
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center gap-[0.5em] pr-[0.5em]">
          <span className={i % 2 ? "t-serif font-normal" : ""}>{t}</span>
          <svg viewBox="0 0 20 20" className="h-[0.42em] w-[0.42em] text-ember" aria-hidden>
            <path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-line py-6 md:py-8" aria-hidden>
      <div
        ref={track}
        className="marquee-track t-display-l whitespace-nowrap text-bone"
        style={{ fontSize: "clamp(2.6rem,6.4vw,6.8rem)" }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
