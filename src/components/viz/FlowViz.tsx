"use client";
import { useRef } from "react";
import { useClock, seg } from "./useClock";

const FIELDS: [string, string][] = [["Név", "Kovács Anna"], ["Telefon", "+36 30 123 4567"], ["Mikor?", "Csütörtök 10:00"]];

/** A visitor fills the booking form; a beat later the owner's phone lights up with the request. */
export function FlowViz() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useClock(ref, 10);
  const press = seg(t, 4.6, 4.8) * (1 - seg(t, 4.85, 5.1));
  const sent = t > 5;
  const n = seg(t, 5.6, 6.2);
  return (
    <div ref={ref} className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-4 p-4 md:p-6">
      <div className="rounded-xl bg-[#f3ead8] p-4 text-[#16231b]">
        <p className="f-ins text-[1.25rem] leading-none">Időpontot kérek</p>
        <div className="mt-3 space-y-2.5">
          {FIELDS.map(([k, v], i) => {
            const c = Math.floor(seg(t, 0.4 + i * 1.3, 1.5 + i * 1.3) * v.length);
            const on = c > 0 && c < v.length;
            return (
              <label key={k} className="block">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider opacity-80">{k}</span>
                <span className={`mt-0.5 block rounded-md border bg-white/70 px-2.5 py-1.5 text-[0.74rem] ${on ? "border-[#e0673f]" : "border-[#16231b]/15"}`}>
                  {v.slice(0, c)}{on && <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-[#16231b]" />}&nbsp;
                </span>
              </label>
            );
          })}
        </div>
        <span className="mt-3 flex items-center justify-center rounded-full py-2 text-[0.72rem] font-semibold text-[#16231b] transition-colors" style={{ background: sent ? "#6f8f3a" : "#e0673f", transform: `scale(${1 - press * 0.06})`, color: sent ? "#f3ead8" : "#16231b" }}>
          {sent ? "Elküldve ✓" : "Küldés"}
        </span>
      </div>
      <div className="relative mx-auto aspect-[9/17] w-full max-w-[150px] rounded-[22px] border-[3px] border-night-4 bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#141414)] p-2">
        <p className="mt-5 text-center font-display text-[1.3rem] leading-none text-paper">10:02</p>
        <p className="text-center font-mono text-[0.5rem] text-ash">csütörtök</p>
        <div className="mt-4 rounded-xl bg-paper/95 p-2 text-night shadow-lg" style={{ opacity: n, transform: `translateY(${(1 - n) * -14}px) scale(${0.9 + n * 0.1})` }}>
          <p className="flex items-center gap-1 text-[0.5rem] font-semibold uppercase opacity-80"><i className="h-1.5 w-1.5 rounded-full bg-kiwi" />Weboldal · most</p>
          <p className="mt-0.5 text-[0.62rem] font-semibold leading-tight">Új időpontkérés</p>
          <p className="text-[0.56rem] leading-tight opacity-75">Kovács Anna · csüt. 10:00</p>
        </div>
        <div className="mt-2 rounded-lg bg-kiwi/90 px-2 py-1 text-[0.52rem] font-semibold text-night" style={{ opacity: seg(t, 6.8, 7.3) }}>+ naptárba téve</div>
      </div>
    </div>
  );
}
