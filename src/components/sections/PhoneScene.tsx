"use client";
import { useEffect, useRef } from "react";
import { onReady, prefersReduced } from "@/lib/gsap";

const STAGES = [
  ["Telefonon nézik", "A látogatóid többsége telefonról nyitja meg az oldalt. Ezért ott kezdem a tervezést, és csak utána jön a laptop."],
  ["Hüvelykujjra szabva", "Gombok ott, ahol az ujjad van, jól olvasható betűk. Nem kell csipegetni és nagyítani."],
  ["Villámgyors", "Kézzel írt kód, könnyű képek: mobilneten is gyorsan betölt, mielőtt a látogató továbblapozna."],
  ["Egy érintés", "Hívás vagy ajánlatkérés egyetlen érintéssel. Így lesz a látogatóból ügyfél."],
] as const;

/** "Telefon a kézben": a 3D phone with a live website on its screen; scroll scrolls it, then the screen becomes the page. */
export function PhoneScene({ intro = false }: { intro?: boolean }) {
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), flood = useRef<HTMLDivElement>(null), bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = box.current!, sec = host.parentElement as HTMLElement;
    const collapse = () => { sec.style.height = "100svh"; host.style.display = "none"; };
    if (prefersReduced()) { collapse(); return; }
    let dead = false, stop = () => {};
    const off = onReady(() => {
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
      idle(() => import("./phoneScene3d").then((m) => { if (dead) return; const s = m.mount({ host, sec, canvas: cv.current!, flood: flood.current!, bar: bar.current! }); if (!s) collapse(); else stop = s; }).catch(collapse), { timeout: 1200 });
    });
    return () => { dead = true; off(); stop(); };
  }, []);
  return (
    <div ref={box} className="sticky top-0 h-[100dvh] overflow-hidden" data-stage="-1">
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      {intro && (
        <div className="cap-intro wrap pointer-events-none absolute inset-x-0 bottom-0 z-[2] pb-10 md:bottom-auto md:top-0 md:pb-0 md:pt-32">
          <p className="t-meta text-kiwi">[01] Mit vállalok</p>
          <h2 className="t-xl mt-4 max-w-[13ch]">Telefonra tervezve, minden képernyőre.</h2>
        </div>
      )}
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
