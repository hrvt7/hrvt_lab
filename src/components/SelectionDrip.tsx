"use client";
import { useEffect } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";

/**
 * Selected text turns into liquid: the highlight is kiwi (ink on kiwi sections), and when a
 * selection settles, drops gather on the underside of each selected line and fall off.
 */
export function SelectionDrip() {
  useEffect(() => {
    if (prefersReduced()) return;
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:70";
    document.body.appendChild(layer);
    let to: ReturnType<typeof setTimeout>, lastText = "";
    const drip = (x: number, y: number, color: string, delay: number) => {
      const w = 7 + Math.random() * 6;
      const d = document.createElement("span");
      d.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - 2}px;width:${w}px;height:${w}px;background:${color};border-radius:0 0 ${w}px ${w}px;transform-origin:50% 0`;
      const drop = document.createElement("span");
      drop.style.cssText = `position:absolute;left:${x - w * 0.42}px;top:${y}px;width:${w * 0.84}px;height:${w * 0.84}px;background:${color};border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;opacity:0`;
      layer.append(d, drop);
      const len = 12 + Math.random() * 22;
      gsap.timeline({ delay, onComplete: () => { d.remove(); drop.remove(); } })
        .fromTo(d, { scaleY: 0 }, { scaleY: len / w, duration: 0.55, ease: "power1.in" })
        .set(drop, { opacity: 1, y: len - w * 0.4 })
        .to(d, { scaleY: 0.4, duration: 0.25, ease: "elastic.out(1,0.4)" })
        .to(drop, { y: `+=${30 + Math.random() * 40}`, opacity: 0, scaleY: 1.4, duration: 0.55, ease: "power2.in" }, "<")
        .to(d, { scaleY: 0, duration: 0.4, ease: "power2.in" }, "<0.2");
    };
    const settle = () => {
      const sel = getSelection();
      const text = sel?.toString().trim() ?? "";
      if (!sel || sel.isCollapsed || !text || text === lastText) { if (!text) lastText = ""; return; }
      lastText = text;
      const range = sel.getRangeAt(0);
      const host = (range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement)?.closest<HTMLElement>("[data-theme]");
      const color = host?.dataset.theme === "kiwi" ? "#222222" : "#89e900";
      const rects = [...range.getClientRects()].filter((r) => r.width > 6).slice(0, 8);
      rects.forEach((r, i) => {
        const n = Math.max(1, Math.min(4, Math.round(r.width / 90)));
        for (let k = 0; k < n; k++) drip(r.left + scrollX + r.width * ((k + 0.2 + Math.random() * 0.6) / n), r.bottom + scrollY, color, i * 0.06 + Math.random() * 0.25);
      });
    };
    const onChange = () => { clearTimeout(to); to = setTimeout(settle, 260); };
    document.addEventListener("selectionchange", onChange);
    return () => { document.removeEventListener("selectionchange", onChange); clearTimeout(to); layer.remove(); };
  }, []);
  return null;
}
