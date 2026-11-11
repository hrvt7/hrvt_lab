"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";

function markReady() {
  const w = window as unknown as { __hrvtReady?: boolean };
  if (w.__hrvtReady) return;
  w.__hrvtReady = true;
  window.dispatchEvent(new Event("hrvt:ready"));
}

/** A kiwi drop falls into the dark, splashes, and floods the screen: the flood is the hero's background. */
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
    const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
    const cover = (Math.hypot(innerWidth, innerHeight) / 44) * 1.08;
    gsap.set("[data-drop]", { yPercent: -50, xPercent: -50, y: -innerHeight * 0.62, scaleX: 0.72, scaleY: 1.5 });
    gsap.set(q("[data-ring]"), { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 });
    gsap.set(q("[data-bit]"), { xPercent: -50, yPercent: -50, scale: 0 });

    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.to("[data-drop]", { y: 0, duration: 0.55, ease: "power2.in" })
      .to("[data-drop]", { scaleX: 1.9, scaleY: 0.5, duration: 0.09, ease: "power2.out" })
      .to(q("[data-ring]"), { scale: 5, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.09, startAt: { opacity: 0.9 } }, "<")
      .to(q("[data-bit]"), { x: (i) => Math.cos(i * 1.05 - 2.6) * (70 + (i % 3) * 38), y: (i) => Math.sin(i * 1.05 - 2.6) * (60 + (i % 2) * 44) - 30, scale: (i) => 0.5 + (i % 3) * 0.25, duration: 0.34, ease: "power2.out" }, "<")
      .to(q("[data-bit]"), { y: "+=90", scale: 0, duration: 0.36, ease: "power2.in" }, ">-0.04")
      .to("[data-drop]", { scaleX: 1.15, scaleY: 1.1, duration: 0.22, ease: "elastic.out(1.2,0.4)" }, 0.64)
      .to("[data-intro-meta]", { opacity: 0, duration: 0.2 }, 0.8)
      .to("[data-drop]", { scale: cover, duration: 0.62, ease: "expo.in" }, 0.84)
      .to("[data-drop]", { borderRadius: "46% 54% 58% 42% / 52% 44% 56% 48%", duration: 0.3, yoyo: true, repeat: 1 }, 0.84)
      .add(markReady, 1.4);
    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;
  return (
    <div ref={root} className="pointer-events-auto fixed inset-0 z-[100] overflow-hidden bg-night" aria-hidden>
      {[0, 1].map((i) => <span key={i} data-ring="" className="absolute left-1/2 top-1/2 h-11 w-11 rounded-full border-2 border-kiwi opacity-0" />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} data-bit="" className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-kiwi" />)}
      <span data-drop="" className="absolute left-1/2 top-1/2 h-11 w-11 rounded-full bg-kiwi will-change-transform" style={{ transform: "translate(-50%,-200vh)" }} />
      <div data-intro-meta="" className="t-meta absolute inset-x-0 bottom-0 flex justify-between p-[var(--m)] text-smoke">
        <span>HRVT — egyedi weboldalak</span>
        <span className="text-kiwi">●</span>
      </div>
    </div>
  );
}
