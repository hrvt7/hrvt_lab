"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { Wordmark } from "./Logo";

const STRIPS = 8;

function markReady() {
  const w = window as unknown as { __hrvtReady?: boolean };
  if (w.__hrvtReady) return;
  w.__hrvtReady = true;
  window.dispatchEvent(new Event("hrvt:ready"));
}

/** Kiwi curtain: the Rugis wordmark draws itself, then the screen lifts away in vertical strips. */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("hrvt:intro") === "1" || prefersReduced()) {
      setShow(false);
      markReady();
      return;
    }
    sessionStorage.setItem("hrvt:intro", "1");
    const el = root.current!;
    const path = el.querySelector<SVGPathElement>("[data-wm-path]")!;
    const len = path.getTotalLength();
    const count = el.querySelector<HTMLElement>("[data-count]")!;
    const o = { v: 0 };
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0, stroke: "#222222", strokeWidth: 10 });

    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.to(path, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })
      .to(o, { v: 100, duration: 1.5, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(o.v)).padStart(3, "0")) }, 0)
      .to(path, { fillOpacity: 1, strokeWidth: 0, duration: 0.45, ease: "power2.out" }, 1.15)
      .to("[data-intro-content]", { yPercent: -40, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.75)
      .add(markReady, 2.0)
      .to("[data-strip]", { yPercent: -100, duration: 0.9, ease: "expo.inOut", stagger: { each: 0.045, from: "start" } }, 1.95);
    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;
  return (
    <div ref={root} className="pointer-events-auto fixed inset-0 z-[100]" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: STRIPS }).map((_, i) => (
          <div key={i} data-strip="" className="h-full flex-1 bg-kiwi" style={{ marginLeft: i ? -1 : 0 }} />
        ))}
      </div>
      <div data-intro-content="" className="absolute inset-0 flex flex-col items-center justify-center text-night">
        <Wordmark className="h-[clamp(64px,13vw,170px)] w-auto overflow-visible" />
        <div className="t-meta absolute inset-x-0 bottom-0 flex justify-between p-[var(--m)] text-night">
          <span>HRVT — digitális termékek</span>
          <span data-count="">000</span>
        </div>
      </div>
    </div>
  );
}
