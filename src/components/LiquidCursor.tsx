"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReduced } from "@/lib/gsap";
import { plop } from "@/lib/sound";

const TRAIL = 5;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/**
 * A kiwi drop instead of a pointer. A gooey SVG filter melts the head and its trail into one blob,
 * so fast moves leave a liquid tail. Over links and buttons the drop flows onto the element and wraps it;
 * over running text it thins into a caret. Desktop (fine pointer) only.
 */
export function LiquidCursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const shapeReady = () => !!ring.current;

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    if (!shapeReady()) return;
    const html = document.documentElement;
    html.classList.add("liquid-cursor", "has-cursor");
    const el = root.current!;
    const head = el.querySelector<HTMLElement>("[data-lc-head]")!;
    const shape = ring.current!;
    const bits = [...el.querySelectorAll<HTMLElement>("[data-lc-bit]")];
    const tag = label.current!;

    const m = { x: -100, y: -100 };
    const h = { x: -100, y: -100, w: 22, hgt: 22, r: 11, vx: 0, vy: 0 };
    const g = { x: -100, y: -100, w: 22, hgt: 22, r: 11, o: 0 };
    const trail = bits.map(() => ({ x: -100, y: -100 }));
    let target: HTMLElement | null = null, mode: "dot" | "wrap" | "text" = "dot", textH = 22, shown = false, raf = 0, down = false;

    const pick = (x: number, y: number) => {
      const t = document.elementFromPoint(x, y) as HTMLElement | null;
      const theme = t?.closest<HTMLElement>("[data-theme]")?.dataset.theme;
      const c = theme === "kiwi" ? "#222222" : "#89e900";
      if (el.style.getPropertyValue("--lc") !== c) { el.style.setProperty("--lc", c); shape.style.setProperty("--lc", c); }
      const hit = t?.closest<HTMLElement>("a, button, [data-cursor], input, textarea, label") ?? null;
      if (hit) {
        target = hit;
        mode = "wrap";
        const txt = hit.dataset.cursor;
        tag.textContent = txt ?? "";
        tag.dataset.on = txt ? "1" : "";
        return;
      }
      target = null;
      tag.dataset.on = "";
      const tx = t?.closest<HTMLElement>("p, li, h1, h2, h3, dd, blockquote");
      if (tx && tx.textContent?.trim()) {
        mode = "text";
        textH = Math.min(64, parseFloat(getComputedStyle(tx).fontSize) * 1.15);
      } else mode = "dot";
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      // 1) the drop (gooey layer): always follows the pointer; small while the crisp shape is active
      const dot = mode === "dot" ? (down ? 16 : 22) : 9;
      const px = h.x, py = h.y;
      h.x = lerp(h.x, m.x, 0.32); h.y = lerp(h.y, m.y, 0.32);
      h.w = lerp(h.w, dot, 0.2);
      h.vx = lerp(h.vx, h.x - px, 0.3); h.vy = lerp(h.vy, h.y - py, 0.3);
      const sp = Math.min(1, Math.hypot(h.vx, h.vy) / 40), ang = Math.atan2(h.vy, h.vx);
      head.style.width = head.style.height = `${h.w.toFixed(1)}px`;
      head.style.transform = `translate3d(${(h.x - h.w / 2).toFixed(1)}px,${(h.y - h.w / 2).toFixed(1)}px,0) rotate(${ang}rad) scale(${1 + sp * 0.7},${1 - sp * 0.35}) rotate(${-ang}rad)`;
      let fx = h.x, fy = h.y;
      trail.forEach((p, i) => {
        p.x = lerp(p.x, fx, 0.42 - i * 0.04); p.y = lerp(p.y, fy, 0.42 - i * 0.04);
        const sz = (mode === "dot" ? 18 : 9) * (1 - i / (TRAIL + 1));
        bits[i].style.transform = `translate3d(${(p.x - sz / 2).toFixed(1)}px,${(p.y - sz / 2).toFixed(1)}px,0)`;
        bits[i].style.width = bits[i].style.height = `${sz.toFixed(1)}px`;
        fx = p.x; fy = p.y;
      });
      // 2) the crisp shape: grows out of the drop and hugs the target (ring) or becomes a caret over text
      let tx = h.x, ty = h.y, tw = h.w, th = h.w, tr = h.w / 2, to = 0;
      if (mode === "wrap" && target) {
        const b = target.getBoundingClientRect(), pad = 6;
        tw = b.width + pad * 2; th = b.height + pad * 2;
        tr = Math.min(th / 2, (parseFloat(getComputedStyle(target).borderTopLeftRadius) || 6) + pad);
        tx = b.left + b.width / 2; ty = b.top + b.height / 2; to = 1;
      } else if (mode === "text") {
        tx = m.x; ty = m.y; tw = 3; th = textH; tr = 1.5; to = 1;
      }
      const k = to ? 0.22 : 0.3;
      g.x = lerp(g.x, tx, k); g.y = lerp(g.y, ty, k); g.w = lerp(g.w, tw, k); g.hgt = lerp(g.hgt, th, k); g.r = lerp(g.r, tr, k); g.o = lerp(g.o, to, 0.25);
      shape.style.width = `${g.w.toFixed(1)}px`;
      shape.style.height = `${g.hgt.toFixed(1)}px`;
      shape.style.borderRadius = `${g.r.toFixed(1)}px`;
      shape.style.opacity = g.o.toFixed(3);
      shape.dataset.mode = mode;
      shape.style.transform = `translate3d(${(g.x - g.w / 2).toFixed(1)}px,${(g.y - g.hgt / 2).toFixed(1)}px,0)`;
      tag.style.transform = `translate3d(${(m.x + 18).toFixed(1)}px,${(m.y + 18).toFixed(1)}px,0)`;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      m.x = e.clientX; m.y = e.clientY;
      if (!shown) {
        shown = true;
        h.x = m.x; h.y = m.y;
        trail.forEach((p) => ((p.x = m.x), (p.y = m.y)));
        el.style.opacity = "1";
        shape.style.visibility = "visible";
        if (!raf) raf = requestAnimationFrame(frame);
      }
      pick(m.x, m.y);
    };
    const hide = () => { shown = false; el.style.opacity = "0"; shape.style.visibility = "hidden"; cancelAnimationFrame(raf); raf = 0; };
    const out = (e: PointerEvent) => { if (!e.relatedTarget) hide(); };
    const onScroll = () => shown && pick(m.x, m.y);
    const dn = () => { down = true; plop({ pitch: mode === "wrap" ? 1.5 : 1.1, gain: 0.14 }); }, up = () => (down = false);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointerdown", dn);
    addEventListener("pointerup", up);
    document.addEventListener("pointerout", out);
    addEventListener("blur", hide);
    addEventListener("hrvt:cursor-hide", hide);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointerdown", dn);
      removeEventListener("pointerup", up);
      document.removeEventListener("pointerout", out);
      removeEventListener("blur", hide);
      removeEventListener("hrvt:cursor-hide", hide);
      html.classList.remove("liquid-cursor");
    };
  }, []);

  return (
    <>
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="hrvt-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>
      <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[95] opacity-0 transition-opacity duration-200 [@media(hover:none)]:hidden" style={{ filter: "url(#hrvt-goo)" }}>
        {Array.from({ length: TRAIL }).map((_, i) => (
          <span key={i} data-lc-bit="" className="absolute left-0 top-0 rounded-full bg-[var(--lc,#89e900)] will-change-transform" />
        ))}
        <span data-lc-head="" className="absolute left-0 top-0 rounded-full bg-[var(--lc,#89e900)] will-change-transform" />
      </div>
      <span ref={ring} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-[95] border-2 border-[var(--lc,#89e900)] opacity-0 will-change-transform data-[mode=text]:border-0 data-[mode=text]:bg-[var(--lc,#89e900)] [@media(hover:none)]:hidden" />
      <span ref={label} aria-hidden className="t-meta pointer-events-none fixed left-0 top-0 z-[96] scale-0 whitespace-nowrap rounded-full bg-night px-3 py-1.5 text-[0.62rem] text-kiwi transition-[scale] duration-300 data-[on='1']:scale-100 [@media(hover:none)]:hidden" />
    </>
  );
}
