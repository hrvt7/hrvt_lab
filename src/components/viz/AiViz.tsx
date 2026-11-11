"use client";
import { useRef } from "react";
import { useClock, seg } from "./useClock";

const Q = "fodrász szombathely időpont";

/** A search typed out, then the client's result assembling itself: title, description, sitelinks, AI summary. */
export function AiViz() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useClock(ref, 11);
  const typed = Math.floor(seg(t, 0.3, 2.2) * Q.length);
  const a = (s: number) => ({ opacity: seg(t, s, s + 0.45), transform: `translateY(${(1 - seg(t, s, s + 0.45)) * 8}px)` });
  const ai = "Online foglalható időpontok, árak és nyitvatartás egy helyen, a lila-szalon.hu oldalon.";
  const aiN = Math.floor(seg(t, 5.2, 8) * ai.length);
  return (
    <div ref={ref} className="flex h-full flex-col gap-3 p-4 text-[0.78rem] md:p-6">
      <div className="flex items-center gap-2 rounded-full bg-night-3 px-4 py-2.5 font-mono text-paper">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-ash" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
        <span className="truncate">{Q.slice(0, typed)}</span>
        {typed < Q.length && <span className="inline-block h-3.5 w-1.5 bg-kiwi" />}
      </div>
      <div className="rounded-xl border border-line p-3.5">
        <div className="flex items-center gap-2 text-[0.7rem] text-ash" style={a(2.5)}>
          <i className="grid h-5 w-5 place-items-center rounded-full bg-[#24112b] font-serif text-[0.6rem] italic text-[#ff7aa8]">L</i>
          lila-szalon.hu › idopontfoglalas
        </div>
        <p className="f-bod mt-1.5 text-[1.05rem] leading-tight text-kiwi" style={a(2.9)}>Fodrász Szombathelyen, időpont online</p>
        <p className="mt-1 text-smoke" style={a(3.3)}>Hajvágás, festés, kezelések. Szabad időpontok élőben, emlékeztető SMS-ben.</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5" style={a(3.8)}>
          {["Árak", "Csapat", "Foglalás", "Megközelítés"].map((s) => <span key={s} className="rounded-full border border-line-2 px-2.5 py-0.5 text-[0.66rem] text-paper">{s}</span>)}
        </div>
      </div>
      <div className="flex-1 rounded-xl bg-night-3 p-3.5" style={a(4.6)}>
        <p className="mb-1.5 flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-wider text-kiwi"><i className="h-1.5 w-1.5 rounded-full bg-kiwi" />AI-összefoglaló</p>
        <p className="text-paper">{ai.slice(0, aiN)}{aiN < ai.length && aiN > 0 && <span className="ml-0.5 inline-block h-3 w-1.5 bg-kiwi" />}</p>
      </div>
      <p className="font-mono text-[0.64rem] text-ash">minta · így érti a Google és az AI-kereső az oldalt</p>
    </div>
  );
}
