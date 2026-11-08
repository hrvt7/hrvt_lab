"use client";

import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

const CS = 202; // circular spline, internal teeth (fixed)
const FS = 200; // flexspline, external teeth (output)

/**
 * Live 2D model of strain wave gearing: the elliptical wave generator (input) bends the flexspline,
 * whose 200 teeth mesh with 202 fixed teeth — the output creeps back two teeth per input turn (100:1).
 * Drag to drive the input by hand.
 */
export function StrainWave() {
  const ref = useRef<HTMLCanvasElement>(null);
  const inRef = useRef<HTMLSpanElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduced = prefersReduced();
    let theta = 0.6; // input angle (rad)
    let vel = 0.9; // rad/s auto drive
    let drag = false;
    let lastA = 0;
    let vis = true;
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(c);

    const angleAt = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    };
    const pd = (e: PointerEvent) => {
      drag = true;
      lastA = angleAt(e);
      c.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => {
      if (!drag) return;
      let a = angleAt(e);
      let d = a - lastA;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      theta += d;
      vel = d * 60;
      lastA = a;
    };
    const pu = () => (drag = false);
    c.addEventListener("pointerdown", pd);
    c.addEventListener("pointermove", pm);
    c.addEventListener("pointerup", pu);
    c.addEventListener("pointercancel", pu);

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!vis) return;
      if (!drag && !reduced) {
        vel += (0.9 - vel) * 0.02;
        theta += vel * dt;
      }
      const dpr = Math.min(devicePixelRatio, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr)) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.44;
      const phi = -theta / 100; // output (opposite direction)
      const ecc = R * 0.018;
      const toothCS = R * 0.035;
      const toothFS = R * 0.034;

      // Circular spline body + 202 internal teeth
      ctx.fillStyle = "#2c2c2c";
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.arc(cx, cy, R, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.strokeStyle = "rgba(242,242,238,.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let j = 0; j < CS; j++) {
        const a = (j / CS) * Math.PI * 2;
        ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.lineTo(cx + Math.cos(a) * (R - toothCS), cy + Math.sin(a) * (R - toothCS));
      }
      ctx.stroke();

      // Flexspline: two-lobed shape aligned with the wave generator; teeth carried at the output angle
      const rFS = (a: number) => R - toothCS - ecc + ecc * 2 * Math.pow(Math.cos(a - theta), 2) - R * 0.004;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a = (i / 360) * Math.PI * 2;
        const r = rFS(a) - toothFS;
        i ? ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = "#1a1a1a";
      ctx.fill();
      ctx.strokeStyle = "rgba(242,242,238,.35)";
      ctx.stroke();
      ctx.beginPath();
      for (let k = 0; k < FS; k++) {
        const a = (k / FS) * Math.PI * 2 + phi;
        const r0 = rFS(a) - toothFS, r1 = rFS(a);
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      }
      ctx.strokeStyle = "#f2f2ee";
      ctx.lineWidth = 1.1;
      ctx.stroke();
      // engagement zones glow
      for (const s of [0, Math.PI]) {
        const a = theta + s;
        const g = ctx.createRadialGradient(cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97, 0, cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97, R * 0.22);
        g.addColorStop(0, "rgba(137,233,0,.35)");
        g.addColorStop(1, "rgba(137,233,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Wave generator (input): ellipse + bearing balls
      const a1 = R * 0.83, b1 = R * 0.76;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(theta);
      ctx.beginPath();
      ctx.ellipse(0, 0, a1, b1, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#89e900";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.fillStyle = "#89e900";
      for (let i = 0; i < 28; i++) {
        const u = (i / 28) * Math.PI * 2 + theta * 0.5;
        ctx.beginPath();
        ctx.arc(Math.cos(u) * (a1 - R * 0.035), Math.sin(u) * (b1 - R * 0.035), R * 0.012, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.ellipse(0, 0, a1 * 0.62, b1 * 0.58, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(137,233,0,.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // input marker
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(a1 * 0.62, 0);
      ctx.strokeStyle = "#89e900";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      // hub
      ctx.fillStyle = "#89e900";
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.035, 0, Math.PI * 2);
      ctx.fill();
      // output marker on flexspline
      const ro = rFS(phi);
      ctx.fillStyle = "#f2f2ee";
      ctx.beginPath();
      ctx.arc(cx + Math.cos(phi) * (ro - toothFS - R * 0.05), cy + Math.sin(phi) * (ro - toothFS - R * 0.05), R * 0.022, 0, Math.PI * 2);
      ctx.fill();

      const deg = (r: number) => ((((r * 180) / Math.PI) % 360) + 360) % 360;
      if (inRef.current) inRef.current.textContent = deg(theta).toFixed(0).padStart(3, "0") + "°";
      if (outRef.current) outRef.current.textContent = deg(phi).toFixed(2).padStart(6, "0") + "°";
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      c.removeEventListener("pointerdown", pd);
      c.removeEventListener("pointermove", pm);
      c.removeEventListener("pointerup", pu);
      c.removeEventListener("pointercancel", pu);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" aria-label="Hullámhajtómű működési modellje — húzással forgatható" data-cursor="Forgasd" />
      <div className="t-meta pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-4 text-[0.62rem] md:p-5">
        <span className="text-kiwi">
          Be <span ref={inRef}>000°</span>
        </span>
        <span className="text-paper">100 : 1</span>
        <span className="text-smoke">
          Ki <span ref={outRef}>000.00°</span>
        </span>
      </div>
    </div>
  );
}
