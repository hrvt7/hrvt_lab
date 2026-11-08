"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";

function markReady() {
  const w = window as unknown as { __hrvtReady?: boolean };
  if (w.__hrvtReady) return;
  w.__hrvtReady = true;
  document.documentElement.classList.add("is-ready");
  window.dispatchEvent(new Event("hrvt:ready"));
}

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("hrvt:intro") === "1";
    if (seen || prefersReduced()) {
      setShow(false);
      markReady();
      return;
    }
    sessionStorage.setItem("hrvt:intro", "1");

    const el = root.current!;
    const counter = el.querySelector<HTMLElement>("[data-count]")!;
    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;
    const obj = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => setShow(false),
    });
    tl.to(letters, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: "expo.out" }, 0.1)
      .to(
        obj,
        {
          v: 100,
          duration: 1.5,
          ease: "power3.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(obj.v)).padStart(3, "0");
          },
        },
        0,
      )
      .to(bar, { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, 0)
      .to(letters, { yPercent: -110, duration: 0.8, stagger: 0.04, ease: "expo.in" }, 1.6)
      .add(() => markReady(), 2.05)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, 2.0);

    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-950 p-[var(--margin)]"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="t-meta flex justify-between text-bone-3">
        <span>HRVT — Digital products</span>
        <span>Est. 2026</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="t-display-xl flex overflow-hidden leading-[0.8]" style={{ fontSize: "clamp(5rem,22vw,22rem)" }}>
          {"HRVT".split("").map((c, i) => (
            <span key={i} data-letter="" className="inline-block" style={{ transform: "translateY(110%)" }}>
              {c}
            </span>
          ))}
        </div>
        <div className="t-meta pb-3 text-right text-bone-2">
          <span data-count="">000</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div data-bar="" className="h-full origin-left scale-x-0 bg-ember" />
      </div>
    </div>
  );
}
