"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { WORDMARK } from "@/lib/logo";

const [X0, Y0, VW, VH] = WORDMARK.viewBox.split(" ").map(Number);

/** The nav wordmark is a glass that fills with liquid as you scroll: outline when empty, solid when you reach the footer. */
export function NavLogo({ className = "" }: { className?: string }) {
  const clip = useRef<SVGPathElement>(null);
  useEffect(() => {
    let last = "", vel = 0, lastY = scrollY;
    const tick = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      vel += (Math.min(80, Math.abs(scrollY - lastY)) - vel) * 0.1;
      lastY = scrollY;
      const t = performance.now() / 1000;
      // level: from just under the letters (empty) to just above them (full)
      const level = Y0 + VH * 1.04 - p * VH * 1.08;
      const amp = 14 + vel * 2.2;
      let d = `M${X0 - 20} ${Y0 + VH + 40}`;
      for (let k = 0; k <= 24; k++) {
        const x = X0 + (k / 24) * VW;
        d += `L${x.toFixed(0)} ${(level + Math.sin(x * 0.006 + t * 3) * amp + Math.sin(x * 0.017 - t * 4.4) * amp * 0.4).toFixed(0)}`;
      }
      d += `L${X0 + VW + 20} ${Y0 + VH + 40}Z`;
      if (d !== last) { last = d; clip.current?.setAttribute("d", d); }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <svg viewBox={WORDMARK.viewBox} className={`overflow-visible ${className}`} role="img" aria-label="HRVT" fill="currentColor">
      <defs>
        <clipPath id="hrvt-fill" clipPathUnits="userSpaceOnUse">
          <path ref={clip} />
        </clipPath>
      </defs>
      <path d={WORDMARK.d} fill="none" stroke="currentColor" strokeWidth="26" strokeLinejoin="round" opacity=".9" />
      <path d={WORDMARK.d} clipPath="url(#hrvt-fill)" />
    </svg>
  );
}
