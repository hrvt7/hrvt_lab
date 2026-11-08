"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import { Monogram } from "../Logo";

const TEXT = "AI · AUTOMATIZÁLÁS · SZOFTVER · WEB · 3D · ";

/** Rotating seal: idles slowly, spins with scroll velocity. */
export function Badge({ className = "" }: { className?: string }) {
  const ring = useRef<SVGGElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    let rot = 0, boost = 0;
    const st = ScrollTrigger.create({ onUpdate: (s) => (boost = Math.min(12, Math.abs(s.getVelocity()) / 150)) });
    const tick = () => {
      boost *= 0.93;
      rot += 0.12 + boost;
      gsap.set(ring.current, { rotation: rot, svgOrigin: "100 100" });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#89e900" />
        <g ref={ring}>
          <text fontFamily="var(--font-mono)" fontSize="12.4" fill="#222" textLength="486" lengthAdjust="spacing">
            <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">{TEXT}</textPath>
          </text>
        </g>
      </svg>
      <Monogram className="absolute left-1/2 top-1/2 h-[34%] w-auto -translate-x-1/2 -translate-y-1/2 text-night" />
    </div>
  );
}
