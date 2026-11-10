"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { prefersReduced } from "@/lib/gsap";

/** A 3D laptop that arrives closed, opens as you scroll and boots into the given screenshot. `children` is the flat fallback. */
export function LaptopStage({ src, children }: { src: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), flat = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    let dead = false, stop = () => {};
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      import("./laptop3d").then((m) => { if (dead) return; const s = m.mount(box.current!, cv.current!, src, () => { flat.current!.style.visibility = "hidden"; cv.current!.style.opacity = "1"; }); if (s) stop = s; }).catch(() => {});
    }, { rootMargin: "700px" });
    io.observe(box.current!);
    return () => { dead = true; io.disconnect(); stop(); };
  }, [src]);
  return (
    <div ref={box} className="relative">
      <div ref={flat}>{children}</div>
      <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-x-[-6%] bottom-[-26%] top-[-14%] h-[140%] w-[112%] opacity-0 transition-opacity duration-500" />
    </div>
  );
}
