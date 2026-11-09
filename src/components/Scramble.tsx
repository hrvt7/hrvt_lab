"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReduced } from "@/lib/gsap";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_+*";

/** Decodes its text from random glyphs — on first view and again on hover. */
export function Scramble({ text, className = "", as: Tag = "span" }: { text: string; className?: string; as?: "span" | "p" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (prefersReduced()) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const dur = 380 + text.length * 22;
      const frame = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const reveal = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          out += i < reveal || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    const st = ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: run });
    const host = el.closest("a,button,[data-scramble-host]") ?? el;
    host.addEventListener("pointerenter", run);
    return () => {
      st.kill();
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", run);
    };
  }, [text]);
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}

export function Meta({ n, children, className = "", dark = false }: { n?: string; children: string; className?: string; dark?: boolean }) {
  return (
    <p className={`t-meta flex items-center gap-3 ${dark ? "text-night/80" : "text-smoke"} ${className}`}>
      {n && <span className={dark ? "text-night" : "text-kiwi"}>[{n}]</span>}
      <Scramble text={children} />
    </p>
  );
}
