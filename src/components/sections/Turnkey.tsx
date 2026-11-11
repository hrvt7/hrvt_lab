"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReduced, scrollToHash } from "@/lib/gsap";
import { TURNKEY } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { ArrowIcon } from "../Icons";

const LOG = ["váz kész · 12 hasáb", "szövegek megírva", "képek optimalizálva · webp", "build rendben · 0 hiba", "űrlap → e-mail + SMS", "Google-találat élő", "domain élesítve · https", "mérés bekapcsolva"];
const N = TURNKEY.length;

/** "Építési napló": scroll builds one site in eight passes; each step on the right adds its layer on the left. */
export function Turnkey() {
  const root = useRef<HTMLElement>(null);
  const [s, setS] = useState(-1);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReduced()) { setS(N - 1); return; }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "[data-tk-stage]",
        start: "top top",
        end: () => `+=${N * window.innerHeight * 0.5}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const k = Math.min(N - 1, Math.floor(self.progress * N * 1.02 - 0.04));
          setS((o) => (o === k ? o : k));
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const on = (k: number) => s >= k;
  const url = on(6) ? "hajnalpekseg.hu" : "localhost:3000";
  return (
    <section ref={root} id="weboldal" data-theme="night" className="relative bg-night [overflow-x:clip]">
      <div className="wrap pt-[var(--sec)]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Meta n="02">Weboldal-készítés</Meta>
          </div>
          <div className="min-w-0 md:col-span-9">
            <Rise as="h2" className="t-xl" lines={[<>Weboldal,</>, <span className="f-bod text-kiwi">kulcsrakészen.</span>]} />
            <p className="t-lead mt-8 max-w-[46ch] text-smoke" data-words="">
              Nem csak design. Görgess, és nézd, ahogy egy oldal nyolc lépésben elkészül —{" "}
              <span className="text-paper">mind egy kézből.</span>
            </p>
          </div>
        </div>
      </div>

      <div data-tk-stage="" className="relative flex h-[100svh] items-center">
        <div className="wrap grid w-full gap-5 md:grid-cols-12 md:gap-10">
          {/* the site being built */}
          <div className="relative md:col-span-7">
            <div className="overflow-hidden rounded-[18px] border border-line-2 bg-night-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
              <div className="flex items-center gap-2 border-b border-line px-3 py-2.5 font-mono text-[0.66rem]">
                <i className="h-2 w-2 rounded-full bg-night-4" /><i className="h-2 w-2 rounded-full bg-night-4" /><i className="h-2 w-2 rounded-full bg-night-4" />
                <span className={`ml-2 flex items-center gap-1.5 rounded-full bg-night-3 px-3 py-1 transition-colors duration-500 ${on(6) ? "text-paper" : "text-smoke"}`}>
                  {on(6) && <span className="text-kiwi">●</span>}
                  {url}
                </span>
              </div>
              <div className="relative h-[42svh] min-h-[260px] overflow-hidden transition-colors duration-700 md:h-[min(58svh,520px)]" style={{ background: on(3) ? "#f4ede1" : "#1a1a1a", color: "#3b2416" }}>
                <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto] gap-3 p-4 md:gap-5 md:p-7">
                  {/* nav */}
                  <div className="flex items-center justify-between">
                    <Slot k={0} s={s} className="h-7 w-32 md:w-40">
                      <span className={`f-all text-[1.5rem] leading-none transition-opacity duration-500 md:text-[1.9rem] ${on(1) ? "opacity-100" : "opacity-0"} ${on(3) ? "" : "text-paper"}`}>Hajnal Pékség</span>
                    </Slot>
                    <Slot k={0} s={s} className="h-8 w-24 rounded-full md:w-32">
                      <span className="grid h-full w-full place-items-center rounded-full text-[0.62rem] font-semibold transition-all duration-500" style={{ background: on(3) ? "#e3a72f" : "transparent", opacity: on(1) ? 1 : 0, color: on(3) ? "#3b2416" : "#f2f2ee" }}>Rendelés</span>
                    </Slot>
                  </div>
                  {/* hero */}
                  <div className="grid grid-cols-5 gap-3 md:gap-5">
                    <div className="col-span-3 flex flex-col justify-center gap-2">
                      <Slot k={0} s={s} className="min-h-[4.2em] text-[clamp(1.3rem,3.4vw,2.9rem)]">
                        <p className={`f-bag leading-[0.98] transition-all duration-700 ${on(1) ? "opacity-100" : "translate-y-3 opacity-0"} ${on(3) ? "" : "text-paper"}`}>
                          Ropogós<br /><span style={{ color: on(3) ? "#c0571f" : "#89e900" }}>reggelek.</span>
                        </p>
                      </Slot>
                      <Slot k={0} s={s} className="h-auto min-h-6">
                        <p className={`text-[0.7rem] leading-snug transition-opacity duration-700 md:text-[0.85rem] ${on(1) ? "opacity-80" : "opacity-0"} ${on(3) ? "" : "text-smoke"}`}>Hajnali 5-től friss kenyér. Rendeld meg este, reggel vár a pulton.</p>
                      </Slot>
                    </div>
                    <Slot k={0} s={s} className="col-span-2 h-full min-h-[120px] rounded-xl" cross>
                      <div className={`relative h-full w-full overflow-hidden rounded-xl transition-all duration-700 ${on(2) ? "scale-100 opacity-100" : "scale-110 opacity-0"}`} style={{ background: "radial-gradient(circle at 70% 20%, #f7c66b, #c0571f 55%, #5a2c14)" }}>
                        <span className="absolute left-[12%] top-[38%] h-[34%] w-[70%] rounded-[50%] bg-[#e9a65a] shadow-[inset_-8px_-10px_0_#b8692c] [animation:tkfloat_4s_ease-in-out_infinite]" />
                        {[0, 1, 2].map((k) => <span key={k} className="absolute h-[3%] w-[16%] rotate-[-25deg] rounded-full bg-[#f6d7a0]" style={{ left: `${24 + k * 16}%`, top: `${48 + (k % 2) * 4}%` }} />)}
                      </div>
                    </Slot>
                  </div>
                  {/* cards */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {["Kenyér", "Péksütemény", "Torta"].map((c, k) => (
                      <Slot key={c} k={0} s={s} className="h-12 rounded-lg md:h-16">
                        <div className="flex h-full items-end rounded-lg p-2 text-[0.62rem] font-semibold transition-all duration-500 md:text-[0.74rem]" style={{ background: on(3) ? "#eadfcd" : "transparent", opacity: on(1) ? 1 : 0, color: on(3) ? "#3b2416" : "#f2f2ee", transitionDelay: `${k * 80}ms` }}>{c}</div>
                      </Slot>
                    ))}
                  </div>
                </div>
                {/* order form */}
                <div className={`absolute bottom-3 right-3 w-[44%] rounded-xl bg-white p-3 shadow-[0_20px_40px_-12px_rgba(59,36,22,.45)] transition-all duration-700 md:bottom-5 md:right-5 md:w-[36%] ${on(4) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                  <p className="f-ins text-[1rem] leading-none md:text-[1.2rem]">Holnap reggelre</p>
                  {["2 × kovászos", "6 × kakaós csiga"].map((r) => <p key={r} className="mt-1.5 rounded-md bg-[#f4ede1] px-2 py-1 text-[0.6rem] md:text-[0.68rem]">{r}</p>)}
                  <p className="mt-2 rounded-full bg-[#3b2416] py-1.5 text-center text-[0.6rem] font-semibold text-[#f4ede1]">Megrendelem</p>
                </div>
                {/* search snippet */}
                <div className={`absolute left-3 top-[34%] w-[56%] rounded-xl bg-night/95 p-3 text-paper shadow-xl ring-1 ring-kiwi/30 backdrop-blur transition-all duration-700 md:left-5 md:w-[46%] ${on(5) ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}>
                  <p className="font-mono text-[0.56rem] text-ash">hajnalpekseg.hu</p>
                  <p className="mt-0.5 text-[0.78rem] font-semibold text-kiwi">Pékség Szombathelyen — rendelés estétől</p>
                  <p className="text-[0.6rem] text-smoke">Nyitva 5:00-tól · előrendelés online</p>
                </div>
                {/* analytics */}
                <div className={`absolute left-3 top-3 flex items-end gap-1 rounded-lg bg-night/90 p-2 ring-1 ring-line-2 transition-all duration-700 md:left-auto md:right-5 md:top-5 ${on(7) ? "opacity-100" : "opacity-0"}`}>
                  {[30, 45, 38, 60, 72, 66, 90].map((h, k) => <span key={k} className="w-1.5 rounded-sm bg-kiwi transition-[height] duration-700" style={{ height: on(7) ? h * 0.32 : 2, transitionDelay: `${k * 60}ms` }} />)}
                  <span className="ml-1.5 font-mono text-[0.55rem] text-paper">+ rendelés</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 font-mono text-[0.66rem]">
              <span className="text-kiwi">{s >= 0 ? "✓" : "›"}</span>
              <span className="truncate text-smoke">{s >= 0 ? LOG[s] : "build indul…"}</span>
              <span className="relative ml-auto h-px w-24 bg-line-2 md:w-40"><span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-kiwi" /></span>
              <span className="text-ash">{String(Math.max(0, s + 1)).padStart(2, "0")}/{String(N).padStart(2, "0")}</span>
            </div>
          </div>

          {/* the log */}
          <ol className="md:col-span-5 md:self-center">
            {TURNKEY.map(([t, d], i) => (
              <li key={t} className={`border-b border-line transition-all duration-500 max-md:hidden ${s === i ? "py-4" : "py-2.5"}`} data-active={s === i}>
                <div className="flex items-baseline gap-4">
                  <span className={`t-meta w-6 transition-colors ${s >= i ? "text-kiwi" : "text-ash"}`}>{s > i ? "✓" : String(i + 1).padStart(2, "0")}</span>
                  <span className={`transition-all duration-500 ${s === i ? "t-m text-paper" : s > i ? "text-smoke" : "text-ash"}`}>{t}</span>
                </div>
                <p className={`grid pl-10 text-smoke transition-all duration-500 ${s === i ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><span className="overflow-hidden">{d}</span></p>
              </li>
            ))}
            {/* mobile: only the active step */}
            <li className="md:hidden">
              <p className="t-meta text-kiwi">{String(Math.max(0, s) + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</p>
              <p className="t-m mt-2">{TURNKEY[Math.max(0, s)][0]}</p>
              <p className="mt-1.5 text-smoke">{TURNKEY[Math.max(0, s)][1]}</p>
            </li>
          </ol>
        </div>
      </div>

      <div className="wrap pb-[var(--sec)] pt-6">
        <div className="flex flex-wrap items-center gap-4" data-fade="">
          <a href="#kapcsolat" onClick={(e) => { e.preventDefault(); scrollToHash("#kapcsolat"); }} className="pill pill--kiwi" data-cursor="Írj">
            Kérek egy weboldalt
            <span className="pill-dot">
              <ArrowIcon />
            </span>
          </a>
          <p className="t-meta text-smoke">Az első egyeztetés ingyenes</p>
        </div>
      </div>
      <style>{`@keyframes tkfloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6%) rotate(2deg)}}`}</style>
    </section>
  );
}

/** A wireframe slot: dashed kiwi outline until the "Fejlesztés" pass turns it into real UI. */
function Slot({ k, s, className = "", cross = false, children }: { k: number; s: number; className?: string; cross?: boolean; children?: React.ReactNode }) {
  const wire = s >= k && s < 3;
  return (
    <div className={`relative rounded-md transition-[outline-color,opacity] duration-500 ${className}`} style={{ outline: `1px dashed ${wire ? "rgba(137,233,0,.55)" : "rgba(137,233,0,0)"}`, outlineOffset: 2, opacity: s >= k ? 1 : 0.15 }}>
      {cross && wire && s < 2 && <span aria-hidden className="absolute inset-0 rounded-xl bg-[linear-gradient(to_top_right,transparent_49.6%,rgba(137,233,0,.35)_50%,transparent_50.4%),linear-gradient(to_bottom_right,transparent_49.6%,rgba(137,233,0,.35)_50%,transparent_50.4%)]" />}
      {children}
    </div>
  );
}
