"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { createFluid } from "@/lib/fluid";
import { onReady, prefersReduced } from "@/lib/gsap";

/**
 * Kiwi liquid over the hero. Three layers sit on top of the normal (paper on night) content:
 *  1. the WebGL liquid itself, which covers the paper text where it flows;
 *  2. an "ink" copy of the content in night colour, multiplied over the page;
 *  3. a white cover canvas inside that copy with a hole wherever the liquid is — so ink only shows on liquid.
 */
export function HeroFluid({ children }: { children: ReactNode }) {
  const glc = useRef<HTMLCanvasElement>(null), liq = useRef<HTMLCanvasElement>(null), cover = useRef<HTMLCanvasElement>(null), ink = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    const c = glc.current!, cv = cover.current!, lq = liq.current!, host = lq.parentElement as HTMLElement, g2 = cv.getContext("2d")!, g1 = lq.getContext("2d")!;
    const lite = innerWidth < 768 || !matchMedia("(hover: hover)").matches;
    const size = () => {
      const s = Math.min(devicePixelRatio || 1, 1.5) * (lite ? 0.62 : 0.6);
      const w = Math.max(2, Math.round(host.clientWidth * s)), h = Math.max(2, Math.round(host.clientHeight * s));
      if (c.width === w && c.height === h) return false;
      c.width = cv.width = lq.width = w; c.height = cv.height = lq.height = h; return true;
    };
    size();
    const force = location.search.includes("fluid=1");
    const fluid = createFluid(c, lite, force);
    if (!fluid) return;
    const BASE = lite ? 0.07 : 0.06;
    let raf = 0, vis = true, live = false, last = performance.now(), t = 0, lastScroll = scrollY, slosh = 0, nextBubble = 1.2, shown = false, cost = 6, n = 0, tier = 0;
    const ptr = { x: 0, y: 0, px: 0, py: 0, moved: false, has: false };
    const at = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect();
      const x = (cx - r.left) / r.width, y = 1 - (cy - r.top) / r.height;
      if (!ptr.has) { ptr.px = x; ptr.py = y; ptr.has = true; }
      ptr.x = x; ptr.y = y; ptr.moved = true;
    };
    const onMouse = (e: PointerEvent) => { if (e.pointerType !== "touch") at(e.clientX, e.clientY); };
    const onTouch = (e: TouchEvent) => { const p = e.touches[0]; if (p) at(p.clientX, p.clientY); };
    const onEnd = () => (ptr.has = false);
    addEventListener("pointermove", onMouse, { passive: true }); addEventListener("touchstart", onTouch, { passive: true }); addEventListener("touchmove", onTouch, { passive: true }); addEventListener("touchend", onEnd, { passive: true });
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } });
    io.observe(host);
    const asp = () => c.width / c.height;
    const burst = () => { for (let i = 0; i < 7; i++) { const x = 0.08 + (i / 6) * 0.84 + (Math.random() - 0.5) * 0.06; fluid.splat(x, BASE + 0.02, (Math.random() - 0.5) * 220, 520 + Math.random() * 380, 1.1, 0.004 / Math.max(0.6, asp())); } };
    const off = onReady(() => { live = true; setTimeout(burst, 500); });
    const frame = (now: number) => {
      raf = 0; if (!vis) return;
      const raw = now - last, dt = Math.min(0.033, raw / 1000); last = now; t += dt; n++;
      // Slow device guard (tier): 0 full · 1 solver at half rate · 2 wave surface only at ~10 fps · 3 frozen.
      if (tier === 2 && n % 6) { raf = requestAnimationFrame(frame); return; }
      const w0 = performance.now();
      const H = host.clientHeight, p = Math.min(1, Math.max(0, scrollY / H)), ds = scrollY - lastScroll; lastScroll = scrollY;
      const v = Math.min(1, Math.abs(ds) / 50); slosh += (v - slosh) * (v > slosh ? 0.3 : 0.05);
      fluid.level = BASE + p * 1.08; fluid.amp = 0.011 + slosh * 0.03; fluid.kick = Math.max(-60, Math.min(60, ds * 1.4)); fluid.cut = 1 - (scrollY + 58) / H;
      if (live && tier < 2) {
        if (ptr.moved && ptr.has) {
          const dx = ptr.x - ptr.px, dy = ptr.y - ptr.py, sp = Math.hypot(dx * asp(), dy);
          if (sp > 0.0015) fluid.splat(ptr.x, ptr.y, dx * asp() * 5200, dy * 5200, Math.min(0.9, 0.22 + sp * 14), (lite ? 0.0034 : 0.0022) / Math.max(0.6, asp()));
          ptr.px = ptr.x; ptr.py = ptr.y; ptr.moved = false;
        }
        nextBubble -= dt;
        if (nextBubble < 0 && p < 0.6) { nextBubble = 0.7 + Math.random() * 1.1; fluid.splat(0.06 + Math.random() * 0.88, fluid.level + 0.01, (Math.random() - 0.5) * 160, 300 + Math.random() * 330, 0.95, (0.0022 + Math.random() * 0.0028) / Math.max(0.6, asp())); }
      }
      if (tier === 0 || (tier === 1 && n % 2 === 0)) fluid.step(tier ? dt * 2 : dt);
      fluid.render(t);
      // Both visible layers are 2D copies of the same GL frame, so they can never drift apart.
      g1.clearRect(0, 0, lq.width, lq.height); g1.drawImage(c, 0, 0);
      g2.globalCompositeOperation = "source-over"; g2.fillStyle = "#fff"; g2.fillRect(0, 0, cv.width, cv.height);
      g2.globalCompositeOperation = "destination-out"; g2.drawImage(c, 0, 0);
      const work = performance.now() - w0;
      if (n > 4) { cost += (work - cost) * 0.2; if (!force && tier < 2 && n > 10 && cost > 13) { tier++; n = 0; cost = tier === 2 ? 0 : 8; } else if (!force && tier === 2 && n > 30 && cost > 40) tier = 3; }
      if (!shown) { shown = true; ink.current!.style.visibility = "visible"; lq.style.opacity = "1"; }
      // The nav must flip to ink while the liquid is under it.
      const top = H * (1 - fluid.level) - scrollY, want = top < 64 ? "kiwi" : "night", el = document.documentElement;
      if (scrollY < H - 40 && el.dataset.nav !== want) el.dataset.nav = want;
      if (tier < 3) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(() => { if (size()) fluid.resize(); }); ro.observe(host);
    (window as unknown as { __fluid?: unknown }).__fluid = fluid;
    return () => { off(); cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); fluid.destroy(); removeEventListener("pointermove", onMouse); removeEventListener("touchstart", onTouch); removeEventListener("touchmove", onTouch); removeEventListener("touchend", onEnd); };
  }, []);
  return (
    <>
      <canvas ref={glc} aria-hidden className="hidden" />
      <canvas ref={liq} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-0" />
      <div ref={ink} aria-hidden className="pointer-events-none invisible absolute inset-0 z-[21] flex flex-col bg-white mix-blend-multiply [isolation:isolate]" inert>
        {children}
        <canvas ref={cover} className="absolute inset-0 z-20 h-full w-full" />
      </div>
    </>
  );
}
