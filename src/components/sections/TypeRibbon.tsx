"use client";
import { useEffect, useRef } from "react";
import { LiquidEdge } from "../LiquidEdge";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import { plop } from "@/lib/sound";

type P = { name: string; f: string; font: string; bg: string; ink: string; acc: string; band: string; best: string; glyph: string; light?: boolean };
// Invented sample identities — not clients.
const POSTERS: P[] = [
  { name: "Kert Bisztró", f: "f-ins", font: "Instrument Serif Italic", bg: "#16231b", ink: "#f3ead8", acc: "#e0673f", band: "rgba(0,0,0,.28)", best: "Éttermeknek, bisztróknak", glyph: "&" },
  { name: "Lila Szalon", f: "f-bod", font: "Bodoni Moda Italic", bg: "#2a1131", ink: "#f6dccd", acc: "#ff7aa8", band: "rgba(255,122,168,.1)", best: "Szalonoknak, fodrászoknak", glyph: "S" },
  { name: "GARÁZS 24", f: "f-bag", font: "Bagel Fat One", bg: "#ff5a12", ink: "#0d1726", acc: "#0d1726", band: "rgba(13,23,38,.14)", best: "Autószervizeknek, műhelyeknek", glyph: "24", light: true },
  { name: "Hajnal Pékség", f: "f-all", font: "Allura", bg: "#e3a72f", ink: "#3b2416", acc: "#fff3dc", band: "rgba(59,36,22,.1)", best: "Pékségeknek, cukrászdáknak", glyph: "P", light: true },
  { name: "Fenyves Panzió", f: "f-gv", font: "Great Vibes", bg: "#f1ebdf", ink: "#1d3a1f", acc: "#6f8f3a", band: "rgba(29,58,31,.07)", best: "Panzióknak, esküvői helyszíneknek", glyph: "F", light: true },
  { name: "ZÖLDKERT", f: "f-cli", font: "Climate Crisis", bg: "#1d3a1f", ink: "#b6f08a", acc: "#89e900", band: "rgba(182,240,138,.07)", best: "Kertészeteknek, tájépítőknek", glyph: "Z" },
];
const N = POSTERS.length;
const SPEC = "Aa Bb Cc Őő Űű 123";

/**
 * "Arculat-plakátok": full-screen type posters, one per invented business. Scrolling floods the next
 * poster's colour up from the bottom with a liquid surface; its name settles into place as the old one lifts away.
 */
export function TypeRibbon() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const posters = [...el.querySelectorAll<HTMLElement>("[data-poster]")];
    const names = posters.map((p) => p.querySelector<HTMLElement>("[data-pname]")!);
    const bodies = posters.map((p) => p.querySelector<HTMLElement>("[data-pbody]")!);
    // Fit every name to the poster width in its own face.
    const fit = () => {
      const max = innerWidth * (innerWidth < 768 ? 0.9 : 0.86);
      names.forEach((n) => {
        n.style.fontSize = "100px";
        const w = n.scrollWidth;
        n.style.fontSize = `${Math.min(innerHeight * (innerWidth < 768 ? 0.15 : 0.34), (100 * max) / w)}px`;
      });
    };
    fit();
    document.fonts?.ready.then(fit);
    addEventListener("resize", fit);
    if (prefersReduced()) { posters.forEach((p, i) => i && (p.style.display = "none")); return () => removeEventListener("resize", fit); }

    let cur = -1, P = 0, raf = 0;
    const paint = () => {
      raf = 0;
      const W = innerWidth, H = el.querySelector<HTMLElement>("[data-pstage]")!.clientHeight, t = performance.now() / 1000;
      posters.forEach((p, i) => {
        const f = Math.min(1, Math.max(0, P - i + 1)); // 0: not arrived, 1: fully in
        const out = Math.min(1, Math.max(0, P - i)); // 0..1 while the next one floods over it
        if (i > 0) {
          if (f <= 0) { p.style.visibility = "hidden"; return; }
          p.style.visibility = "visible";
          if (f >= 1) p.style.clipPath = "none";
          else {
            const amp = 46 * Math.sin(f * Math.PI), lvl = H * (1 - f) - amp * 0.4;
            let d = `M0 ${H}`;
            for (let k = 0; k <= 32; k++) {
              const x = (k / 32) * W;
              d += `L${x.toFixed(0)} ${(lvl + Math.sin(x * 0.009 + t * 3 + i) * amp + Math.sin(x * 0.023 - t * 4) * amp * 0.3).toFixed(0)}`;
            }
            p.style.clipPath = `path("${d}L${W} ${H}Z")`;
          }
        }
        const e = 1 - Math.pow(1 - f, 3);
        names[i].style.transform = `translate3d(0,${((1 - e) * 22 - out * 14).toFixed(2)}svh,0) scale(${(1.12 - 0.12 * e).toFixed(4)})`;
        bodies[i].style.opacity = String(1 - out * 0.85);
        if (POSTERS[i].f === "f-cli") names[i].style.setProperty("--yr", String(Math.round(1979 + 71 * Math.min(1, Math.max(0, (P - i + 0.2) / 1.1)))));
      });
      const k = Math.min(N - 1, Math.max(0, Math.floor(P + 0.5)));
      if (k !== cur) {
        cur = k;
        document.documentElement.setAttribute("data-nav", POSTERS[k].light ? "kiwi" : "night");
        if (P > 0.3) plop({ pitch: 0.7 + k * 0.15, gain: 0.16 });
      }
    };
    const st = ScrollTrigger.create({
      trigger: el.querySelector("[data-pstage]"),
      start: "top top",
      end: () => `+=${(N - 1) * innerHeight * 0.95}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (s) => { P = s.progress * (N - 1) + 0.0001; if (!raf) raf = requestAnimationFrame(paint); },
      onToggle: (s) => s.isActive && (cur = -1),
    });
    // keep the surface sloshing while a transition is mid-way
    const idle = () => { const fr = P % 1; if (st.isActive && fr > 0.01 && fr < 0.99 && !raf) raf = requestAnimationFrame(paint); };
    gsap.ticker.add(idle);
    paint();
    return () => { st.kill(); gsap.ticker.remove(idle); removeEventListener("resize", fit); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={root} data-theme="night" aria-label="Minta-arculatok: minden vállalkozásnak saját hangja van" className="relative bg-[#16231b]">
      <LiquidEdge color="#89e900" />
      <div data-pstage="" className="relative h-[100svh] overflow-hidden">
        {POSTERS.map((p, i) => (
          <article key={p.name} data-poster="" className="absolute inset-0 overflow-hidden" style={{ background: p.bg, color: p.ink, zIndex: i, visibility: i ? "hidden" : "visible" }}>
            {/* diagonal band + giant outline glyph, like a type-foundry poster */}
            <span aria-hidden className="absolute -left-[10%] top-[38%] h-[34%] w-[130%] -rotate-[24deg]" style={{ background: p.band }} />
            <span aria-hidden className={`${p.f} pointer-events-none absolute -right-[4vw] top-1/2 -translate-y-1/2 leading-none text-transparent`} style={{ fontSize: "min(78svh, 70vw)", WebkitTextStroke: `1.5px ${p.ink}`, opacity: 0.14 }}>
              {p.glyph}
            </span>

            <div data-pbody="" className="wrap relative flex h-full flex-col justify-between pb-8 pt-24 md:pb-10 md:pt-28">
              <div className="t-meta flex items-start justify-between gap-4 text-[0.66rem]">
                <span>
                  Minta-arculat
                  <br />
                  <span className="opacity-70">kitalált cég · saját betű</span>
                </span>
                <span className="text-right">
                  {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  <br />
                  <span className="opacity-70">{i === 0 ? "görgess tovább" : p.font}</span>
                </span>
              </div>

              <div className="relative">
                <p className="mb-[1.5svh] text-right text-[clamp(0.9rem,1.6vw,1.4rem)] opacity-85">{p.font}</p>
                <h3 aria-label={p.name} data-pname="" className={`${p.f} inline-block origin-bottom-left whitespace-nowrap leading-[0.92] will-change-transform`}>
                  {p.name.split(" ").map((w, k) => (
                    <span key={k} className="max-md:block">{k ? <span className="md:inline max-md:hidden"> </span> : null}{w}</span>
                  ))}
                </h3>
                <div className="mt-[3svh] flex items-start gap-3">
                  <svg viewBox="0 0 20 28" className="h-9 w-6 shrink-0 md:h-11 md:w-8" aria-hidden><path d="M0 0h20v28l-10-7-10 7z" fill={p.acc} /></svg>
                  <p className="font-display text-[clamp(0.85rem,1.4vw,1.15rem)] uppercase leading-tight" style={{ fontVariationSettings: '"wght" 600' }}>
                    Legjobb:
                    <br />
                    {p.best}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-5">
                <p className={`${p.f} text-[clamp(1.4rem,3vw,2.6rem)] leading-none opacity-80`}>{SPEC}</p>
                <div className="flex items-center gap-2">
                  {[p.bg, p.ink, p.acc].map((c, k) => (
                    <span key={k} className="flex items-center gap-1.5">
                      <i className="h-5 w-5 rounded-full" style={{ background: c, boxShadow: `inset 0 0 0 1px ${p.ink}55` }} />
                      <span className="t-meta text-[0.58rem] opacity-75 max-md:hidden">{c.toUpperCase()}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
        <p className="sr-only">Minden vállalkozásnak saját hangja van, a betűt is hozzá választom: hat kitalált minta-arculat, mindegyik más betűtípussal és színnel.</p>
      </div>
    </section>
  );
}
