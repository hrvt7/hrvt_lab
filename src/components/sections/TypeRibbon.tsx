"use client";
import { useEffect, useRef, useState } from "react";
import { LiquidEdge } from "../LiquidEdge";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

// word · typeface class · typeface name · card colour · ink
const W: [string, string, string, string, string][] = [
  ["Bisztró", "f-ins", "Instrument Serif Italic", "#16231b", "#f3ead8"],
  ["GARÁZS", "f-bag", "Bagel Fat One", "#0d1726", "#ff6a1a"],
  ["Szalon", "f-bod", "Bodoni Moda Italic", "#24112b", "#ff7aa8"],
  ["Panzió", "f-gv", "Great Vibes", "#f4ede1", "#3b2416"],
  ["MŰHELY", "f-unb", "Unbounded", "#89e900", "#222222"],
  ["Pékség", "f-all", "Allura", "#e3a72f", "#3b2416"],
  ["KERTÉSZ", "f-cli", "Climate Crisis", "#1d3a1f", "#b6f08a"],
  ["Ügyvéd", "f-bod", "Bodoni Moda Italic", "#101418", "#d9c9a3"],
];
const big = (f: string) => (f === "f-gv" || f === "f-all" ? "1.5em" : f === "f-ins" || f === "f-bod" ? "1.12em" : f === "f-cli" ? "0.66em" : f === "f-unb" ? "0.74em" : "0.9em");

/**
 * Type ticker through a lens card: outside the card every trade is the same hollow outline;
 * as a word passes through the card it gets its own typeface and colours. Scroll drives the row.
 */
export function TypeRibbon() {
  const root = useRef<HTMLElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const n = W.length;
      ScrollTrigger.create({
        trigger: "[data-ribbon]",
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight * 0.42}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          rows.forEach((r) => (r.style.transform = `translate3d(calc(var(--cell) * ${-p.toFixed(4)}),0,0)`));
          const i = Math.round(p);
          setK((o) => (o === i ? o : i));
          root.current!.style.setProperty("--yr", String(Math.round(1979 + Math.min(1, Math.max(0, p - 5)) * 71)));
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const cur = W[k];
  return (
    <section ref={root} data-theme="night" aria-label="Minden vállalkozásnak saját hangja van" className="relative bg-night [--cell:78vw] md:[--cell:44vw]">
      <LiquidEdge color="#89e900" />
      <div data-ribbon="" className="relative flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="wrap absolute inset-x-0 top-24 flex flex-wrap items-end justify-between gap-4 md:top-28">
          <p className="t-meta text-kiwi">Betű · hang · karakter</p>
          <p className="t-lead max-w-[34ch] text-smoke">
            Minden vállalkozásnak saját hangja van. <span className="text-paper">A betűt is hozzád választom.</span>
          </p>
        </div>

        <div className="relative h-[34svh] md:h-[40svh]" style={{ fontSize: "clamp(2.6rem, 9.2vw, 8.4rem)" }}>
          {/* outside the card: every word the same hollow outline */}
          <div data-row="" aria-hidden className="absolute left-[calc(50%-var(--cell)/2)] top-0 flex h-full will-change-transform">
            {W.map(([w]) => (
              <span key={w} className="grid h-full w-[var(--cell)] shrink-0 place-items-center font-display uppercase leading-none text-paper/[0.09]" style={{ fontSize: "0.62em", fontVariationSettings: '"wght" 650' }}>
                {w}
              </span>
            ))}
          </div>
          {/* the lens card */}
          <div className="absolute left-1/2 top-0 h-full w-[var(--cell)] -translate-x-1/2 overflow-hidden rounded-[26px] shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)] transition-colors duration-500 md:rounded-[36px]" style={{ background: cur[3] }}>
            <div data-row="" className="absolute left-0 top-0 flex h-full will-change-transform">
              {W.map(([w, f, , , ink]) => (
                <span key={w} className={`${f} grid h-full w-[var(--cell)] shrink-0 place-items-center whitespace-nowrap leading-none`} style={{ color: ink, fontSize: big(f) }}>
                  {w}
                </span>
              ))}
            </div>
            <span className="t-meta absolute left-4 top-4 text-[0.6rem] transition-colors duration-500 md:left-6 md:top-5" style={{ color: cur[4] }}>
              {String(k + 1).padStart(2, "0")} / {String(W.length).padStart(2, "0")}
            </span>
            <span className="t-meta absolute bottom-4 right-4 text-[0.6rem] transition-colors duration-500 md:bottom-5 md:right-6" style={{ color: cur[4] }}>
              {cur[2]}
            </span>
          </div>
        </div>

        <p className="t-meta wrap absolute inset-x-0 bottom-8 text-center text-ash md:bottom-10">görgess — ugyanaz a szó-sor, nyolc különböző karakter</p>
      </div>
    </section>
  );
}
