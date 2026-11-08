"use client";

import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

/** A wireframe spur gear, extruded and rotating in 3D (projected by hand on a 2D canvas). */
export function GearViz() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const T = 18;
    const prof: [number, number][] = [];
    for (let i = 0; i < T; i++) {
      const a0 = (i / T) * Math.PI * 2;
      const st = (Math.PI * 2) / T;
      [
        [a0, 0.78],
        [a0 + st * 0.18, 1],
        [a0 + st * 0.5, 1],
        [a0 + st * 0.68, 0.78],
      ].forEach(([a, r]) => prof.push([Math.cos(a) * r, Math.sin(a) * r]));
    }
    const hole = Array.from({ length: 24 }, (_, i) => [Math.cos((i / 24) * Math.PI * 2) * 0.3, Math.sin((i / 24) * Math.PI * 2) * 0.3]);
    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(c);
    let raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!vis) return;
      const dpr = Math.min(devicePixelRatio, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== W * dpr) {
        c.width = W * dpr;
        c.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = now / 1000;
      const spin = t * 0.5, tiltX = 0.95 + Math.sin(t * 0.3) * 0.15, tiltY = Math.sin(t * 0.22) * 0.4;
      const S = Math.min(W, H) * 0.36;
      const proj = (x: number, y: number, z: number): [number, number, number] => {
        // spin about z, tilt about x then y
        const cx = Math.cos(spin), sx = Math.sin(spin);
        let X = x * cx - y * sx, Y = x * sx + y * cx, Z = z;
        const c1 = Math.cos(tiltX), s1 = Math.sin(tiltX);
        [Y, Z] = [Y * c1 - Z * s1, Y * s1 + Z * c1];
        const c2 = Math.cos(tiltY), s2 = Math.sin(tiltY);
        [X, Z] = [X * c2 + Z * s2, -X * s2 + Z * c2];
        const f = 3.2 / (3.2 + Z);
        return [W / 2 + X * S * f, H / 2 + Y * S * f, Z];
      };
      const ring = (pts: number[][], z: number, col: string, lw: number) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        pts.forEach(([x, y], i) => {
          const [px, py] = proj(x, y, z);
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
      };
      const d = 0.22;
      ring(prof, d, "rgba(242,242,238,.25)", 1);
      ring(hole, d, "rgba(242,242,238,.25)", 1);
      ctx.strokeStyle = "rgba(242,242,238,.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      prof.forEach(([x, y]) => {
        const a = proj(x, y, -d), b = proj(x, y, d);
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      });
      ctx.stroke();
      ring(prof, -d, "#89e900", 1.6);
      ring(hole, -d, "#89e900", 1.2);
    };
    if (prefersReduced()) {
      draw(4000);
      cancelAnimationFrame(raf);
    } else raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
  return (
    <div className="relative flex h-full flex-col p-5 md:p-6">
      <p className="font-mono text-[0.72rem] text-ash">3D · valós idejű geometria</p>
      <canvas ref={ref} className="h-full min-h-0 w-full flex-1" aria-hidden />
      <div className="flex justify-between font-mono text-[0.66rem] text-ash">
        <span>z = 18 fog · m = 2</span>
        <span className="text-kiwi">élő render</span>
      </div>
    </div>
  );
}
