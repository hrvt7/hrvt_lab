"use client";
import { useEffect, useRef } from "react";
import { onReady, prefersReduced } from "@/lib/gsap";

const STAGES = [
  ["Drótváz", "Először a szerkezet: mi kerül az oldalra, és milyen sorrendben."],
  ["Elrendezés", "A blokkok a helyükre kerülnek. Itt dől el, hova néz először a látogató."],
  ["Design", "Betű, szín, kép és mozgás: a céged saját arculata, nem sablon."],
  ["Éles oldal", "Gyors, telefonra kész, a keresők is megtalálják. Egy kattintás, és ajánlatot kérnek."],
] as const;

/** "Épül a szemed előtt": a website assembles in 3D as you scroll: wireframe → layout → design → live. */
export function BuildScene() {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), flood = useRef<HTMLDivElement>(null), bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = box.current!, sec = host.parentElement as HTMLElement;
    const collapse = () => { sec.style.height = "100svh"; host.style.display = "none"; };
    if (prefersReduced()) { collapse(); return; }
    let dead = false, stop = () => {};
    const off = onReady(() => {
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
      idle(() => import("./buildScene3d").then((m) => { if (dead) return; const s = m.mount({ host, sec, canvas: cv.current!, flood: flood.current!, bar: bar.current! }); if (!s) collapse(); else stop = s; }).catch(collapse), { timeout: 1200 });
    });
    return () => { dead = true; off(); stop(); };
  }, []);
  return (
    <div ref={box} className="sticky top-0 h-[100dvh] overflow-hidden" data-stage="-1">
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-[2] pb-[max(1.5rem,5svh)]">
        <div className="relative h-[11.5rem] md:h-[13rem] md:max-w-[30rem]">
          {STAGES.map(([t, d], i) => (
            <div key={t} className={`cap cap-${i} absolute inset-x-0 bottom-0`}>
              <p className="t-meta mb-2 text-kiwi">0{i + 1} / 04</p>
              <h2 className="t-l">{t}</h2>
              <p className="mt-3 max-w-[34ch] text-smoke">{d}</p>
            </div>
          ))}
        </div>
        <div className="cap-ui mt-5 h-px w-full bg-line-2 md:max-w-[30rem]"><span ref={bar} className="block h-full origin-left scale-x-0 bg-kiwi" /></div>
      </div>
      <div ref={flood} aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-kiwi opacity-0" />
    </div>
  );
}
