"use client";
import { useRef } from "react";
import { useClock, seg } from "./useClock";

const T = [
  { name: "kert-bisztro.hu", bg: "#16231b", surf: "#23382c", ink: "#f3ead8", mute: "#b9b39f", acc: "#e0673f", logo: "f-all", head: "f-ins", h: ["Friss tészta,", "lassú esték."], cta: "Asztalt foglalok" },
  { name: "lila-szalon.hu", bg: "#24112b", surf: "#3a1b45", ink: "#f6dccd", mute: "#c7a3b4", acc: "#ff7aa8", logo: "f-bod", head: "f-bod", h: ["Szépség,", "időre foglalva."], cta: "Időpontot kérek" },
  { name: "garazs24.hu", bg: "#0d1726", surf: "#18263d", ink: "#eef2f7", mute: "#93a3b8", acc: "#ff6a1a", logo: "f-unb", head: "f-bag", h: ["SZERVIZ,", "AMI NEM VÁR."], cta: "Időpont még ma" },
];
const P = 5.2; // seconds per site

/** One skeleton, three finished sites: a design pass sweeps across the wireframe and the brand snaps in. */
export function WebViz() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useClock(ref, P * T.length);
  const i = Math.floor(t / P) % T.length, lt = t % P;
  const x = seg(lt, 0.5, 1.9) * (1 - seg(lt, 4.5, 5.1)); // sweep in, hold, sweep out
  const s = T[i];
  const wire = "rounded-[3px] border border-kiwi/45";
  return (
    <div ref={ref} className="flex h-full flex-col p-4 md:p-6">
      <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] text-smoke">
        <i className="h-2 w-2 rounded-full bg-night-4" /><i className="h-2 w-2 rounded-full bg-night-4" /><i className="h-2 w-2 rounded-full bg-night-4" />
        <span className="ml-2 flex-1 truncate rounded-full bg-night-3 px-3 py-1">{x > 0.5 ? s.name : "vazlat.html"}</span>
        <span className="text-kiwi">{String(i + 1).padStart(2, "0")}/03</span>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-xl border border-line">
        {/* blueprint */}
        <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] gap-3 bg-night-2 p-4">
          <div className="flex items-center justify-between"><span className={`${wire} h-4 w-20`} /><span className={`${wire} h-6 w-24 rounded-full`} /></div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 flex flex-col justify-center gap-2"><span className={`${wire} h-7 w-[90%]`} /><span className={`${wire} h-7 w-[65%]`} /><span className={`${wire} mt-2 h-8 w-32 rounded-full`} /></div>
            <div className={`${wire} col-span-2 bg-[linear-gradient(to_top_right,transparent_49.5%,rgba(137,233,0,.25)_50%,transparent_50.5%)]`} />
          </div>
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((k) => <span key={k} className={`${wire} h-10`} />)}</div>
          <span className="absolute bottom-2 right-3 font-mono text-[0.6rem] text-kiwi/60">wireframe · v0.3</span>
        </div>
        {/* finished */}
        <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] gap-3 p-4" style={{ background: s.bg, color: s.ink, clipPath: `inset(0 ${100 - x * 100}% 0 0)` }}>
          <div className="flex items-center justify-between">
            <span className={`${s.logo} text-[1.15rem] leading-none`}>{s.name.split(".")[0].replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}</span>
            <span className="rounded-full px-3 py-1.5 text-[0.62rem] font-semibold" style={{ background: s.acc, color: s.bg }}>{s.cta}</span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 flex flex-col justify-center">
              <p className={`${s.head} text-[clamp(1.2rem,2.3vw,2rem)] leading-[1.02]`}>{s.h[0]}<br /><span style={{ color: s.acc }}>{s.h[1]}</span></p>
              <span className="mt-3 w-max rounded-full px-3 py-1.5 text-[0.62rem] font-semibold" style={{ background: s.acc, color: s.bg }}>{s.cta} →</span>
            </div>
            <div className="col-span-2 rounded-lg" style={{ background: `radial-gradient(circle at 30% 30%, ${s.acc}, ${s.surf} 70%)` }} />
          </div>
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((k) => <span key={k} className="h-10 rounded-md" style={{ background: s.surf }} />)}</div>
        </div>
        {/* sweep line */}
        {x > 0 && x < 1 && <span className="absolute inset-y-0 w-px bg-kiwi shadow-[0_0_18px_4px_rgba(137,233,0,.6)]" style={{ left: `${x * 100}%` }} />}
      </div>
      <p className="mt-3 font-mono text-[0.66rem] text-ash">ugyanaz a váz → <span className="text-kiwi">három különböző márka</span></p>
    </div>
  );
}
