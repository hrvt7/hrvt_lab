"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import { STEPS } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";

const FACE = ["f-ins", "f-unb", "f-bag", "f-bod"];
const SIZE = ["1.5em", "0.95em", "1.2em", "1.35em"];

/** A title that types itself the moment its step is switched on. */
function Typed({ text, on }: { text: string; on: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) { setN(0); return; }
    if (prefersReduced()) { setN(text.length); return; }
    let i = 0;
    const id = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(id); }, 55);
    return () => clearInterval(id);
  }, [on, text]);
  return (
    <span>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className={`ml-[0.06em] inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-kiwi ${on && n >= text.length ? "animate-[blink_0.9s_steps(1)_infinite]" : ""} ${on ? "" : "opacity-0"}`} />
      <span aria-hidden className="invisible">{text.slice(n)}</span>
    </span>
  );
}

/** "Idővonal-vezeték": a kiwi wire draws itself down the page and snakes between the steps; each step switches on as the current reaches it. */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    const el = root.current!;
    const box = el.querySelector<HTMLElement>("[data-wire]")!;
    const svg = box.querySelector("svg")!;
    const [track, live] = [...svg.querySelectorAll("path")] as SVGPathElement[];
    const head = box.querySelector<HTMLElement>("[data-head]")!;
    const dots = [...box.querySelectorAll<HTMLElement>("[data-dot]")];
    if (prefersReduced()) { setLit(STEPS.length); svg.style.display = "none"; head.style.display = "none"; return; }

    let len = 1, at: number[] = [];
    const build = () => {
      const b = box.getBoundingClientRect();
      const pts = dots.map((d) => { const r = d.getBoundingClientRect(); return [r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]; });
      const wide = b.width >= 768;
      const mid = wide ? b.width / 2 : pts[0][0];
      // On wide screens the wire loops through the empty half beside each step, touches its node, and swings back out.
      const way = pts.flatMap(([x, y], i) => {
        if (!wide) return [[x, y]];
        const ex = b.width * (i % 2 ? 0.2 : 0.8), dy = b.height * 0.105;
        return [[ex, y - dy], [x, y], [ex, y + dy]];
      });
      const all = [[mid, 0], ...way, [mid, b.height]];
      let d = `M${all[0][0]} ${all[0][1]}`;
      for (let i = 1; i < all.length; i++) {
        const [x0, y0] = all[i - 1], [x1, y1] = all[i], k = (y1 - y0) * 0.55;
        d += ` C${x0} ${y0 + k} ${x1} ${y1 - k} ${x1} ${y1}`;
      }
      svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
      track.setAttribute("d", d);
      live.setAttribute("d", d);
      len = live.getTotalLength();
      live.style.strokeDasharray = `${len}`;
      // where along the wire each step sits
      at = pts.map(([, y]) => { let lo = 0, hi = len; for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (live.getPointAtLength(m).y < y) lo = m; else hi = m; } return lo / len; });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(box);

    const st = ScrollTrigger.create({
      trigger: box,
      start: "top 62%",
      end: "bottom 62%",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        live.style.strokeDashoffset = `${len * (1 - p)}`;
        const pt = live.getPointAtLength(len * p);
        head.style.transform = `translate3d(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px,0)`;
        head.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
        let k = -1;
        at.forEach((a, i) => { if (p >= a - 0.004) k = i; });
        setLit((o) => (o === k ? o : k));
      },
    });
    live.style.strokeDashoffset = `${len}`;
    return () => { st.kill(); ro.disconnect(); };
  }, []);

  return (
    <section ref={root} id="folyamat" data-theme="night" className="relative bg-night-2 [overflow-x:clip]">
      <div className="wrap py-[var(--sec)]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Meta n="03">Folyamat</Meta>
          </div>
          <div className="md:col-span-9">
            <Rise as="h2" className="t-xl" lines={[<>Így lesz ötletből</>, <span className="f-unb text-[0.78em] text-kiwi">éles weboldal.</span>]} />
          </div>
        </div>

        <div data-wire="" className="relative mt-14 md:mt-24">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none" preserveAspectRatio="none">
            <path stroke="rgba(242,242,238,.12)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
            <path stroke="#89e900" strokeWidth="3" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(137,233,0,.7))" }} />
          </svg>
          <span data-head="" aria-hidden className="pointer-events-none absolute left-0 top-0 z-[2] -ml-2.5 -mt-2.5 h-5 w-5 rounded-full bg-kiwi opacity-0 shadow-[0_0_24px_8px_rgba(137,233,0,.65)]" />

          {STEPS.map((s, i) => {
            const on = lit >= i;
            const right = i % 2 === 1;
            return (
              <article key={s.n} className={`relative grid items-center py-10 md:min-h-[66vh] md:grid-cols-2 md:py-0`} data-on={on}>
                {/* the node the wire passes through */}
                <span data-dot="" aria-hidden className={`absolute left-[11px] top-[3.4rem] z-[1] grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full border-2 bg-night-2 transition-all duration-500 md:top-1/2 md:-translate-y-1/2 ${right ? "md:left-[54%]" : "md:left-[46%]"} ${on ? "scale-125 border-kiwi shadow-[0_0_0_8px_rgba(137,233,0,.14)]" : "border-night-4"}`}>
                  <i className={`h-2 w-2 rounded-full transition-colors duration-500 ${on ? "bg-kiwi" : "bg-night-4"}`} />
                </span>
                <div className={`pl-10 transition-all duration-700 md:pl-0 ${right ? "md:col-start-2 md:pl-[24%]" : "md:pr-[24%] md:text-right"} ${on ? "opacity-100" : "translate-y-4 opacity-25"}`}>
                  <p className={`font-display leading-none transition-colors duration-700 ${on ? "text-kiwi" : "text-paper/10"}`} style={{ fontSize: "clamp(3.4rem, 8vw, 7rem)", fontVariationSettings: '"wght" 650' }}>
                    {s.n}
                  </p>
                  <h3 aria-label={s.title} className={`mt-3 text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.05] ${FACE[i]}`}>
                    <span style={{ fontSize: SIZE[i] }}><Typed text={s.title} on={on} /></span>
                  </h3>
                  <p className={`t-lead mt-4 max-w-[36ch] text-smoke ${right ? "" : "md:ml-auto"}`}>{s.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
