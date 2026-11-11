"use client";
import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

const FACES = ["f-ins", "f-bod", "f-gv", "f-all", "f-bag", "f-unb", "f-cli"];

/** On hover each letter briefly tries on another typeface, left to right, then settles back. */
export function TypeSwap({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (prefersReduced()) return;
    const host = el.closest("a,button") ?? el;
    const ls = [...el.querySelectorAll<HTMLElement>("[data-l]")];
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers.forEach(clearTimeout);
      timers = [];
      // lock each letter's width first, so the swap never shifts the nav
      ls.forEach((l) => { l.style.width = ""; l.className = "inline-block text-center"; });
      ls.forEach((l) => (l.style.width = `${l.getBoundingClientRect().width}px`));
      ls.forEach((l, i) => {
        if (l.textContent === " ") return;
        const f = FACES[(i + Math.floor(Math.random() * FACES.length)) % FACES.length];
        timers.push(setTimeout(() => { l.className = `inline-block text-center ${f} uppercase scale-[1.18]`; }, i * 38));
        timers.push(setTimeout(() => { l.className = "inline-block text-center"; }, i * 38 + 420));
      });
    };
    host.addEventListener("pointerenter", run);
    return () => { host.removeEventListener("pointerenter", run); timers.forEach(clearTimeout); };
  }, [text]);
  return (
    <span ref={ref} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} data-l="" aria-hidden className="inline-block text-center">
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}
