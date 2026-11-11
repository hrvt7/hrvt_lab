"use client";
import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

// Deterministic drips: position (0–1), half-width (px), max length (share of height), how early it starts running.
const DRIPS = [
  [0.06, 30, 0.55, 1.0], [0.17, 20, 0.95, 1.35], [0.29, 38, 0.4, 0.9], [0.41, 24, 0.8, 1.15], [0.52, 44, 0.5, 1.0],
  [0.63, 18, 1.0, 1.5], [0.74, 34, 0.6, 0.95], [0.85, 22, 0.85, 1.25], [0.95, 30, 0.45, 1.05],
];
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * The section above "runs" into this one: its colour hangs from the top edge as liquid, the drips
 * lengthen as the boundary travels up the screen, and the edge sloshes with scroll speed.
 * Place it as a direct child of the lower (position: relative) section.
 */
export function LiquidEdge({ color }: { color: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current!, path = svg.querySelector("path")!;
    const N = 72;
    let W = 0, H = 0, raf = 0, vis = false, lastY = scrollY, vel = 0, t0 = performance.now();
    const draw = (now: number) => {
      raf = 0;
      if (!vis) return;
      raf = requestAnimationFrame(draw);
      const r = svg.getBoundingClientRect();
      if (r.width !== W || r.height !== H) { W = r.width; H = r.height; svg.setAttribute("viewBox", `0 0 ${W} ${H}`); }
      const p = 1 - r.top / innerHeight; // 0: boundary at the bottom of the screen, 1: at the top
      const y = scrollY;
      vel += (Math.max(-60, Math.min(60, y - lastY)) - vel) * 0.12;
      lastY = y;
      const t = (now - t0) / 1000, k = W < 768 ? 0.7 : 1, step = W < 768 ? 2 : 1;
      const grow = (s: number) => sm(0.08, 0.72, p * s) * (1 - 0.6 * sm(0.82, 1.02, p));
      let d = `M0 -2H${W}`;
      for (let i = N; i >= 0; i--) {
        const x = (i / N) * W;
        let yy = 6 + Math.sin(x * 0.011 + t * 1.1) * 3 + Math.sin(x * 0.023 - t * 2.3) * Math.abs(vel) * 0.35;
        for (let j = 0; j < DRIPS.length; j += step) {
          const [dx, w, L, s] = DRIPS[j];
          const q = Math.abs(x - dx * W) / (w * k);
          if (q < 2.2) yy += Math.exp(-q * q * q) * (L * H * grow(s) + Math.sin(t * 1.4 + dx * 40) * 3 + vel * 0.5 * L);
        }
        d += `L${x.toFixed(1)} ${Math.max(0, yy).toFixed(1)}`;
      }
      path.setAttribute("d", d + "Z");
    };
    if (prefersReduced()) { path.setAttribute("d", ""); return; }
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(draw); }, { rootMargin: "80px" });
    io.observe(svg);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <svg ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[15svh] w-full overflow-visible md:h-[20svh]" preserveAspectRatio="none">
      <path fill={color} />
    </svg>
  );
}
