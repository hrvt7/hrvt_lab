"use client";
import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";
import { Wordmark } from "./Logo";

/** The footer wordmark as a real 3D block: follows the pointer or the phone's tilt, each letter with its own inertia. */
export function FootMark() {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), svg = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    let dead = false, stop = () => {};
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      import("./footMark3d").then((m) => { if (dead) return; const s = m.mount(box.current!, cv.current!, () => { svg.current!.style.opacity = "0"; cv.current!.style.opacity = "1"; }); if (s) stop = s; }).catch(() => {});
    }, { rootMargin: "900px" });
    io.observe(box.current!);
    return () => { dead = true; io.disconnect(); stop(); };
  }, []);
  return (
    <div ref={box} className="relative -mx-[var(--m)] pb-[5vw] pt-[6vw]" aria-hidden>
      <div ref={svg} className="px-[var(--m)] transition-opacity duration-300"><Wordmark className="h-auto w-full" /></div>
      <canvas ref={cv} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [touch-action:pan-y]" />
    </div>
  );
}
