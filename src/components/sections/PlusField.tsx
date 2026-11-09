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
      gap = W < 700 ? 30 : 34;
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
    let frame = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!vis) return;
      // touch devices: ambient motion only, at half rate to save battery
      if (touch && frame++ % 2) return;
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
      // Idle marks: one batched path per brightness band (cheap). Active marks: drawn individually.
      const bands: Path2D[] = [new Path2D(), new Path2D(), new Path2D()];
      const active: { x: number; y: number; a: number }[] = [];
      for (const p of pts) {
        const d = Math.abs(p.x - m.x) + Math.abs(p.y - m.y) < R * 1.5 ? Math.hypot(p.x - m.x, p.y - m.y) : R;
        const k = Math.max(0, 1 - d / R);
        p.a += (k - p.a) * 0.15;
        if (p.a > 0.04) {
          active.push(p);
          continue;
        }
        const wave = 0.5 + 0.5 * Math.sin(p.x * 0.012 + p.y * 0.008 - t * 0.9);
        const path = bands[Math.min(2, (wave * 3) | 0)];
        path.moveTo(p.x - 2.6, p.y);
        path.lineTo(p.x + 2.6, p.y);
        path.moveTo(p.x, p.y - 2.6);
        path.lineTo(p.x, p.y + 2.6);
      }
      ctx.lineWidth = 1;
      bands.forEach((path, i) => {
        ctx.strokeStyle = `rgba(242,242,238,${0.08 + i * 0.03})`;
        ctx.stroke(path);
      });
      for (const p of active) {
        const a = p.a;
        const s = 2.6 + a * 6.5;
        const r = a * Math.PI * 0.25;
        const c = Math.cos(r) * s, sn = Math.sin(r) * s;
        ctx.strokeStyle = `rgba(137,233,0,${0.25 + a * 0.75})`;
        ctx.lineWidth = 1 + a * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - c, p.y - sn);
        ctx.lineTo(p.x + c, p.y + sn);
        ctx.moveTo(p.x + sn, p.y - c);
        ctx.lineTo(p.x - sn, p.y + c);
        ctx.stroke();
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
