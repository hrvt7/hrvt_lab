"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

const STEPS = [
  ["Felmérés", "Bejárjuk a házat vagy a terveket, és megbeszéljük, hogyan éltek benne."],
  ["Terv", "Kapcsolási terv és tételes ajánlat. Előre látod, mi mennyibe kerül."],
  ["Kivitelezés", "Vezetékezés, szerelés, programozás, a többi szakággal egyeztetve."],
  ["Betanítás", "Megmutatjuk, mit tud a ház, és később is átállítjuk, ha változik az életetek."],
] as const;

/** One copper cable runs down the section as you scroll; every step it reaches switches on, and at the end a bulb lights the room. */
export function Wire() {
  const root = useRef<HTMLElement>(null), svg = useRef<SVGSVGElement>(null), path = useRef<SVGPathElement>(null), glow = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = root.current!, s = svg.current!;
    const build = () => {
      const r = el.getBoundingClientRect(), nodes = [...el.querySelectorAll<HTMLElement>("[data-node]")].map((n) => { const b = n.getBoundingClientRect(); return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top]; });
      const bulb = el.querySelector<HTMLElement>("[data-bulb]")!.getBoundingClientRect(), end = [bulb.left + bulb.width / 2 - r.left, bulb.top - r.top + 4];
      s.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const pts = [[nodes[0][0], 0], ...nodes, end]; let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], dy = y1 - y0, sw = (i % 2 ? 1 : -1) * Math.min(70, r.width * 0.08); d += ` C${x0 + sw} ${y0 + dy * 0.35} ${x1 - sw} ${y1 - dy * 0.35} ${x1} ${y1}`; }
      path.current!.setAttribute("d", d); glow.current!.setAttribute("d", d);
    };
    build();
    const ro = new ResizeObserver(() => { build(); ScrollTrigger.refresh(); }); ro.observe(el);
    if (prefersReduced()) { el.querySelectorAll("[data-step]").forEach((x) => x.setAttribute("data-on", "true")); el.dataset.lit = "true"; gsap.set([path.current, glow.current], { strokeDashoffset: 0 }); return () => ro.disconnect(); }
    const ctx = gsap.context(() => {
      gsap.fromTo([path.current, glow.current], { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 55%", end: "bottom 85%", scrub: 0.6 } });
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((x) => ScrollTrigger.create({ trigger: x.querySelector("[data-node]"), start: "center 62%", onToggle: (st) => x.setAttribute("data-on", String(st.isActive || st.progress > 0)), end: "+=99999" }));
      ScrollTrigger.create({ trigger: el.querySelector("[data-bulb]"), start: "top 82%", onEnter: () => (el.dataset.lit = "true"), onLeaveBack: () => (el.dataset.lit = "false") });
    }, el);
    return () => { ro.disconnect(); ctx.revert(); };
  }, []);
  return (
    <section ref={root} id="folyamat" data-theme="night" className="wr relative overflow-hidden bg-night-2" data-lit="false">
      <div className="wr-room" aria-hidden />
      <svg ref={svg} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden fill="none">
        <path ref={glow} pathLength={1} className="wr-glow" />
        <path ref={path} pathLength={1} className="wr-path" />
      </svg>
      <div className="wrap relative py-[var(--sec)]">
        <p className="t-meta flex items-center gap-3 text-smoke"><span className="text-kiwi">[02]</span>Folyamat</p>
        <h2 className="t-xl mt-8 max-w-[14ch]">Felméréstől <em className="text-kiwi">a betanításig.</em></h2>
        <ol className="mt-20 md:mt-28">
          {STEPS.map(([t, d], i) => (
            <li key={t} data-step="" data-on="false" className={`wr-step relative grid grid-cols-[3rem_1fr] gap-x-5 pb-24 md:grid-cols-2 md:gap-x-[12vw] md:pb-36`}>
              <span data-node="" className={`wr-node mt-3 md:absolute md:left-1/2 md:top-3 md:-translate-x-1/2`} />
              <div className={`${i % 2 ? "md:col-start-2" : "md:col-start-1 md:text-right"} col-start-2`}>
                <p className="wr-num font-display leading-none" style={{ fontVariationSettings: '"wght" 300, "opsz" 144' }}>0{i + 1}</p>
                <h3 className="t-m mt-4">{t}</h3>
                <p className={`mt-3 max-w-[34ch] text-smoke ${i % 2 ? "" : "md:ml-auto"}`}>{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex justify-start md:justify-center">
          <div data-bulb="" className="wr-bulb ml-[0.4rem] md:ml-0" aria-hidden>
            <svg viewBox="0 0 60 90" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M30 0v14M22 14h16v8H22zM30 22c-16 0-24 12-24 24 0 10 6 15 10 21 2 3 3 6 3 9h22c0-3 1-6 3-9 4-6 10-11 10-21 0-12-8-24-24-24z" /><path d="M24 76h12M25 82h10" /></svg>
          </div>
        </div>
        <p className="wr-done t-lead mt-8 text-center text-smoke md:mt-10">…és a ház <span className="text-paper">életre kel.</span></p>
      </div>
    </section>
  );
}
