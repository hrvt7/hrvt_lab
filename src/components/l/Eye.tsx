"use client";

import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/Logo";
import { prefersReduced } from "@/lib/gsap";
import { track } from "./Stage";

/**
 * A field of the word everyone else settles for, and a round lens that follows the pointer:
 * only inside it does the HRVT wordmark show, on an inverted plate. Idle, the lens wanders by itself.
 * The lens and its content move by transform only (the content is counter-shifted).
 */
export function Eye() {
  const root = useRef<HTMLElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!, L = lens.current!, I = inner.current!;
    const reduced = prefersReduced();
    let W = 0, H = 0, R = 0;
    let x = 0, y = 0, tx = 0, ty = 0, s = 1, ts = 1;
    let active = 0, raf = 0, visible = false, t0 = performance.now(), used = false;

    const size = () => {
      const r = el.getBoundingClientRect();
      W = r.width; H = r.height;
      R = Math.max(84, Math.min(W * 0.17, 250));
      L.style.width = L.style.height = `${R * 2}px`;
      I.style.width = `${W}px`;
      I.style.height = `${H}px`;
      if (!x && !y) { x = tx = W / 2; y = ty = H / 2; }
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - active > 2600 && !reduced) {
        // Nobody is steering: drift across the letters.
        const t = (now - t0) / 1000;
        tx = W / 2 + Math.sin(t * 0.42) * W * 0.36;
        ty = H / 2 + Math.sin(t * 0.67 + 1.2) * H * 0.2;
        ts = 1;
      }
      x += (tx - x) * 0.14; y += (ty - y) * 0.14; s += (ts - s) * 0.12;
      L.style.transform = `translate3d(${(x - R).toFixed(1)}px,${(y - R).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
      I.style.transform = `scale(${(1 / s).toFixed(4)}) translate3d(${(-(x - R)).toFixed(1)}px,${(-(y - R)).toFixed(1)}px,0)`;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      active = performance.now();
      if (!used) { used = true; track("lencse"); }
    };
    const down = () => { ts = 1.28; };
    const up = () => { ts = 1; };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    size();
    tick(performance.now());
    cancelAnimationFrame(raf);
    io.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(el);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <section ref={root} className="l-eye" aria-hidden data-l-sec="">
      <div className="l-eye-field">
        <Wordmark className="l-eye-wm" />
      </div>
      <div ref={lens} className="l-eye-lens">
        <div ref={inner} className="l-eye-in">
          <Wordmark className="l-eye-wm" />
        </div>
      </div>
      <p className="l-eye-hint">
        <span className="l-eye-fine">Vidd fölé az egeret</span>
        <span className="l-eye-touch">Húzd rá az ujjad</span>
      </p>
    </section>
  );
}
