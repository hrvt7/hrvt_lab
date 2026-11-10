"use client";
import { useEffect, useRef } from "react";
import { createEdge } from "@/lib/fluid";
import { prefersReduced } from "@/lib/gsap";

/** A strip of live liquid on a kiwi section boundary. It sloshes with scroll speed. */
export function LiquidEdge({ mode, className = "" }: { mode: "drip" | "surface"; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const size = () => { const s = Math.min(devicePixelRatio || 1, 1.5) * (innerWidth < 768 ? 0.8 : 0.7); c.width = Math.max(2, Math.round(c.clientWidth * s)); c.height = Math.max(2, Math.round(c.clientHeight * s)); };
    size();
    const edge = createEdge(c, mode, location.search.includes("fluid=1"));
    if (!edge) { c.style.display = "none"; return; }
    if (prefersReduced()) { edge.render(3, 0); return () => edge.destroy(); }
    let raf = 0, vis = false, slosh = 0, last = scrollY, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: "80px" });
    io.observe(c);
    const frame = (now: number) => {
      raf = 0; if (!vis) return;
      const v = Math.min(1, Math.abs(scrollY - last) / 60); last = scrollY; slosh += (v - slosh) * (v > slosh ? 0.25 : 0.04);
      edge.render((now - t0) / 1000, slosh); raf = requestAnimationFrame(frame);
    };
    const ro = new ResizeObserver(size); ro.observe(c);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); edge.destroy(); };
  }, [mode]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-x-0 z-[5] h-[clamp(130px,24vh,260px)] w-full ${className}`} />;
}
