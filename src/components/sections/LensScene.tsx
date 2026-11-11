"use client";
import { useEffect, useRef } from "react";
import { onReady, prefersReduced } from "@/lib/gsap";

/** "Röntgen-lencse": blueprint everywhere, the finished site only under the liquid glass lens. */
export function LensScene() {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), tag = useRef<HTMLDivElement>(null), line = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = box.current!, sec = host.parentElement as HTMLElement;
    const content = sec.querySelector<HTMLElement>("[data-hero-content]");
    const collapse = () => { sec.style.height = "100svh"; tag.current!.style.display = "none"; line.current!.style.display = "none"; };
    let dead = false, stop = () => {};
    if (prefersReduced()) {
      collapse();
      import("./lensScene3d").then((m) => !dead && m.still(cv.current!));
      return () => { dead = true; };
    }
    const off = onReady(() => {
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 120));
      idle(() => import("./lensScene3d").then((m) => {
        if (dead) return;
        const s = m.mount({ host, sec, canvas: cv.current!, tag: tag.current!, line: line.current!, content });
        if (!s) { collapse(); m.still(cv.current!); } else stop = s;
      }).catch(collapse), { timeout: 900 });
    });
    return () => { dead = true; off(); stop(); };
  }, []);
  return (
    <div ref={box} className="sticky top-0 h-[100svh] overflow-hidden bg-night">
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      <div ref={tag} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[1] opacity-0 will-change-transform">
        <div className="t-meta flex items-center gap-2 whitespace-nowrap rounded-full bg-night/85 px-3 py-1.5 text-paper ring-1 ring-kiwi/40 backdrop-blur-sm">
          <i className="not-italic text-kiwi">01/03</i>
          <b className="font-medium">Kész oldal</b>
          <span className="text-smoke">· minta</span>
        </div>
      </div>
      <div ref={line} className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center opacity-0 max-md:items-end max-md:pb-[16svh]">
        <p className="t-mega px-6 text-center text-paper [text-shadow:0_4px_40px_rgba(0,0,0,.55)]" style={{ fontSize: "clamp(2rem, min(8vw, 11vh), 7rem)" }}>
          Mindegyik más.
          <br />
          <span className="text-kiwi">Egyik sem sablon.</span>
        </p>
      </div>
    </div>
  );
}
