"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";

// Symbols the plan analysis "detects": [x, y, kind]
const MARKS: [number, number, "s" | "l" | "w"][] = [
  [62, 58, "l"], [150, 58, "l"], [62, 128, "s"], [118, 150, "s"], [176, 112, "w"],
  [250, 60, "l"], [318, 60, "l"], [250, 140, "s"], [338, 128, "s"], [296, 168, "w"],
  [70, 212, "l"], [150, 236, "s"], [92, 268, "s"], [250, 222, "l"], [334, 260, "s"], [276, 270, "w"],
];
const COLORS = { s: "#ff5a1f", l: "#ece9e2", w: "#a9a59c" };

export function TakeoffPreview() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const marks = el.querySelectorAll("[data-mark]");
    const counts = el.querySelectorAll<HTMLElement>("[data-count]");
    if (prefersReduced()) {
      counts.forEach((c) => (c.textContent = c.dataset.count!));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(marks, { scale: 0, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%" } });
      tl.fromTo("[data-scan]", { attr: { y: 0 } }, { attr: { y: 300 }, duration: 2.2, ease: "power2.inOut" })
        .to(marks, { scale: 1, duration: 0.6, stagger: 0.09, ease: "back.out(3)" }, 0.2);
      counts.forEach((c) => {
        const o = { v: 0 };
        tl.to(o, { v: Number(c.dataset.count), duration: 2, ease: "power2.out", onUpdate: () => (c.textContent = String(Math.round(o.v))) }, 0.3);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="grid aspect-[16/11] grid-cols-[1.55fr_1fr] gap-px bg-line">
      <div className="relative bg-ink-900">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(236,233,226,.05)" />
            </pattern>
            <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff5a1f" stopOpacity="0" />
              <stop offset="1" stopColor="#ff5a1f" stopOpacity=".35" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#g)" />
          <g fill="none" stroke="rgba(236,233,226,.55)" strokeWidth="2">
            <path d="M30 30H370V290H30Z" />
            <path d="M210 30V180M30 180H120M160 180H370M210 210V290M120 180V290" />
          </g>
          <g className="t-meta" fill="rgba(236,233,226,.35)" fontSize="8" fontFamily="var(--font-mono)">
            <text x="40" y="44">LIVING 24.6 m²</text>
            <text x="220" y="44">KITCHEN 18.2 m²</text>
            <text x="40" y="194">BED 14.1 m²</text>
            <text x="220" y="194">BATH 7.8 m²</text>
          </g>
          {MARKS.map(([x, y, k], i) => (
            <g key={i} data-mark="">
              <circle cx={x} cy={y} r="7" fill="none" stroke={COLORS[k]} strokeWidth="1.2" />
              <circle cx={x} cy={y} r="2" fill={COLORS[k]} />
            </g>
          ))}
          <rect data-scan="" x="30" y="0" width="340" height="26" fill="url(#scan)" />
        </svg>
      </div>
      <div className="flex flex-col justify-between bg-ink-900 p-4 md:p-5">
        <div>
          <p className="t-meta mb-4 text-[0.6rem] text-bone-3">Detected</p>
          {[
            ["Sockets", 7, "#ff5a1f"],
            ["Luminaires", 6, "#ece9e2"],
            ["Switches", 3, "#a9a59c"],
          ].map(([k, n, c]) => (
            <div key={k as string} className="flex items-center justify-between border-b border-line py-2 text-[0.8rem]">
              <span className="flex items-center gap-2 text-bone-2">
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: c as string }} />
                {k}
              </span>
              <span className="tabular-nums" data-count={n}>
                0
              </span>
            </div>
          ))}
        </div>
        <div>
          <p className="t-meta text-[0.6rem] text-bone-3">Cable</p>
          <p className="font-display text-[clamp(1.2rem,2vw,1.8rem)] font-semibold tracking-[-0.04em]">
            <span data-count="214">0</span>
            <span className="text-[0.55em] text-bone-2"> m</span>
          </p>
        </div>
      </div>
    </div>
  );
}
