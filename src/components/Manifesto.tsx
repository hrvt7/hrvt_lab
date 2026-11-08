"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { Label } from "./Lines";

const TEXT =
  "Most software works. Very little of it feels considered. I design and engineer products end to end — the model, the motion, the last pixel — so they work like tools and feel like objects.";
const ACCENT = new Set(["considered.", "tools", "objects."]);

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-w]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: "[data-mtext]", start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const words = TEXT.split(" ");
  return (
    <section ref={root} className="wrap section relative">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Label n="01">Manifesto</Label>
        </div>
        <p data-mtext="" className="t-h2 md:col-span-9" style={{ fontWeight: 560, lineHeight: 1.04 }}>
          {words.map((w, i) => (
            <span key={i} data-w="" className={`inline-block pr-[0.24em] ${ACCENT.has(w) ? "t-serif text-ember" : ""}`}>
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
