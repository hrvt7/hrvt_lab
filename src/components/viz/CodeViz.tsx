"use client";
import { useRef } from "react";
import { useClock, seg } from "./useClock";

const CODE: [string, string][] = [
  ["tag", '<section class="hero">'],
  ["h1", '  <h1>Friss tészta,</h1>'],
  ["p", '  <p>Asztalfoglalás 2 érintéssel.</p>'],
  ["btn", '  <a class="btn">Foglalok</a>'],
  ["tag", "</section>"],
  ["css", ".btn { background: #e0673f }"],
  ["css2", "h1 { font: italic 3rem Instrument }"],
];
const SPEED = 26; // chars / second
const starts = CODE.reduce<number[]>((a, [, l], i) => (a.push(i ? a[i - 1] + CODE[i - 1][1].length / SPEED + 0.25 : 0.4), a), []);
const END = starts[starts.length - 1] + CODE[CODE.length - 1][1].length / SPEED;
const CHECKS = ["Sebesség", "Akadálymentesség", "Keresők"];

/** Hand-written code typed on the left; the page it describes builds itself on the right, then gets measured. */
export function CodeViz() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useClock(ref, END + 5.5);
  const done = (i: number) => t >= starts[i] + CODE[i][1].length / SPEED;
  return (
    <div ref={ref} className="grid h-full grid-rows-[1fr_auto] gap-3 p-4 font-mono text-[0.7rem] md:p-6 md:text-[0.74rem]">
      <div className="grid min-h-0 gap-3 sm:grid-cols-[1.15fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-night-3 p-3.5">
          <p className="mb-2 text-ash">index.html — kézzel írva</p>
          {CODE.map(([k, l], i) => {
            const n = Math.max(0, Math.min(l.length, Math.floor((t - starts[i]) * SPEED)));
            const typing = n > 0 && n < l.length;
            return (
              <div key={i} className={`whitespace-pre ${k.startsWith("css") ? "text-kiwi" : k === "tag" ? "text-ash" : "text-paper"}`}>
                <span className="mr-2 inline-block w-4 text-right text-night-4">{i + 1}</span>
                {l.slice(0, n)}
                {typing && <span className="ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-kiwi" />}
              </div>
            );
          })}
        </div>
        <div className="relative flex flex-col justify-center overflow-hidden rounded-xl p-4 transition-colors duration-500" style={{ background: done(0) ? "#16231b" : "#1f1f1f" }}>
          <p className={`text-[1.5rem] leading-none text-[#f3ead8] transition-all duration-500 ${done(6) ? "f-ins" : "font-sans font-bold"} ${done(1) ? "opacity-100" : "translate-y-2 opacity-0"}`}>Friss tészta,</p>
          <p className={`mt-2 font-sans text-[0.72rem] text-[#b9b39f] transition-all duration-500 ${done(2) ? "opacity-100" : "translate-y-2 opacity-0"}`}>Asztalfoglalás 2 érintéssel.</p>
          <span
            className={`mt-3 w-max rounded-full px-3 py-1.5 font-sans text-[0.66rem] font-semibold transition-all duration-500 ${done(3) ? "opacity-100" : "scale-90 opacity-0"}`}
            style={{ background: done(5) ? "#e0673f" : "#3a3a3a", color: done(5) ? "#16231b" : "#f2f2ee" }}
          >
            Foglalok →
          </span>
          <span className="absolute right-3 top-3 text-[0.6rem] text-[#b9b39f]/70">előnézet · élő</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {CHECKS.map((c, i) => {
          const f = seg(t, END + 0.4 + i * 0.35, END + 1.4 + i * 0.35);
          return (
            <span key={c} className="flex items-center gap-2 rounded-full border border-line px-2.5 py-1 text-ash">
              <svg viewBox="0 0 20 20" className="h-4 w-4 -rotate-90"><circle cx="10" cy="10" r="8" fill="none" stroke="#3a3a3a" strokeWidth="2.5" /><circle cx="10" cy="10" r="8" fill="none" stroke="#89e900" strokeWidth="2.5" strokeDasharray="50.3" strokeDashoffset={50.3 * (1 - f)} /></svg>
              <span className={f >= 1 ? "text-paper" : ""}>{c}{f >= 1 ? " ✓" : ""}</span>
            </span>
          );
        })}
        <span className="ml-auto self-center text-ash">mérve élesítés előtt</span>
      </div>
    </div>
  );
}
