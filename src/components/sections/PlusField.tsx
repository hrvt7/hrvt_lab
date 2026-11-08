"use client";

import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

/** A field of engineering "+" marks that wake up, rotate and turn kiwi around the pointer. */
export function PlusField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduced = prefersReduced();
    const touch = !window.matchMedia("(hover: hover)").matches;
    let W = 0, H = 0, dpr = 1, gap = 34;
    let pts: { x: number; y: number; a: number }[] = [];
    const m = { x: -999, y: -999, tx: -999, ty: -999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      W = c.clientWidth;
      H = c.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      gap = W < 700 ? 26 : 34;
      pts = [];
      const ox = (W % gap) / 2, oy = (H % gap) / 2;
      for (let y = oy; y <= H; y += gap) for (let x = ox; x <= W; x += gap) pts.push({ x, y, a: 0 });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      m.tx = e.clientX - r.left;
      m.ty = e.clientY - r.top;
    };
    window.addEventListener("pointermove", move);

    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(c);

    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!vis) return;
      const t = (now - t0) / 1000;
      if (touch) {
        // ambient sweep on touch devices
        m.tx = W * (0.5 + Math.sin(t * 0.4) * 0.38);
        m.ty = H * (0.45 + Math.cos(t * 0.31) * 0.3);
      }
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = W < 700 ? 140 : 210;
      for (const p of pts) {
        const d = Math.hypot(p.x - m.x, p.y - m.y);
        const k = Math.max(0, 1 - d / R);
        p.a += (k - p.a) * 0.15;
        const a = p.a;
        const wave = 0.5 + 0.5 * Math.sin(p.x * 0.012 + p.y * 0.008 - t * 0.9);
        const s = 2.6 + a * 6.5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(a * Math.PI * 0.25);
        ctx.strokeStyle = a > 0.04 ? `rgba(137,233,0,${0.25 + a * 0.75})` : `rgba(242,242,238,${0.07 + wave * 0.07})`;
        ctx.lineWidth = 1 + a * 0.6;
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();
        ctx.restore();
      }
    };
    if (reduced) {
      draw(performance.now());
      cancelAnimationFrame(raf);
    } else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
