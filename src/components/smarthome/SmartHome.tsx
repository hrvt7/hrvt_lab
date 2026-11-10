"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReduced, scrollToHash } from "@/lib/gsap";
import { EMAIL } from "@/lib/content";
import { Wordmark } from "../Logo";
import { Meta } from "../Scramble";
import { ArrowIcon } from "../Icons";
import type { UI } from "./house3d";
import { Areas } from "./Areas";
import { Wire } from "./Wire";
import { Breakers } from "./Breakers";
import { Plan } from "./Plan";

const ROOM_NAMES = ["Nappali", "Konyha", "Hálószoba", "Fürdő"];
const STAGES = [
  ["Vezetékezés", "Minden a falban kezdődik. Egy rendszerbe kötjük a lámpákat, a redőnyöket és a fűtést."],
  ["Világítás", "Egy érintés, vagy semmi: a fény követ, amerre jársz, és lekapcsol, ha kimész."],
  ["Árnyékolás", "A redőny tudja, mikor süt be a nap, és mikor mész aludni."],
  ["Fűtés", "Szobánként annyi meleg, amennyi kell. Üres házat nem fűtünk."],
  ["Jó éjt", "Egy gomb: minden lekapcsol, a redőny lemegy, csak az éjszakai fény marad a fürdőben."],
] as const;
const SCENES: [string, UI][] = [
  ["Reggel", { l: [0, 1, 0, 1], shut: 0, heat: 1 }],
  ["Mozi", { l: [0.22, 0, 0, 0], shut: 1, heat: 1 }],
  ["Jó éjt", { l: [0, 0, 0, 0.2], shut: 1, heat: 0 }],
];
const WANTS = ["Világítás", "Árnyékolás", "Fűtés", "Biztonság", "Energia"], KINDS = ["Új építés", "Felújítás", "Lakott ház"];
const go = (h: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToHash(h); };

export function SmartHome() {
  const [ui, setUi] = useState<UI>({ l: [1, 1, 1, 1], shut: 0, heat: 1 });
  const uiRef = useRef(ui); uiRef.current = ui;
  const box = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), tags = useRef<(HTMLParagraphElement | null)[]>([]);
  const [kind, setKind] = useState(KINDS[0]), [wants, setWants] = useState<string[]>(["Világítás", "Fűtés"]);

  useEffect(() => { // this route has no intro: release everything that waits for it
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; window.dispatchEvent(new Event("hrvt:ready")); }
  }, []);
  useEffect(() => {
    const host = box.current!, sec = host.parentElement as HTMLElement;
    const collapse = () => { sec.style.height = "100svh"; host.style.display = "none"; };
    if (prefersReduced()) { collapse(); return; }
    let dead = false, stop = () => {};
    import("./house3d").then((m) => { if (dead) return; const s = m.mount({ host, sec, canvas: cv.current!, labels: tags.current as HTMLElement[], ui: uiRef }); if (!s) collapse(); else stop = s; }).catch(collapse);
    return () => { dead = true; stop(); };
  }, []);

  const msg = useMemo(() => `Szia! Okosotthon-felmérést kérnék.\nÉpület: ${kind}.\nÉrdekel: ${wants.join(", ") || "még nem tudom"}.`, [kind, wants]);
  const toggleL = (i: number) => setUi((u) => ({ ...u, l: u.l.map((x, k) => (k === i ? (x > 0.5 ? 0 : 1) : x)) }));

  return (
    <div className="sh">
      <header className="wrap fixed inset-x-0 top-0 z-[80] flex h-[72px] items-center justify-between text-paper transition-colors duration-500 [html[data-nav=kiwi]_&]:text-night">
        <a href="#top" onClick={go("#top")} className="flex items-baseline gap-2.5" aria-label="HRVT Smart Home">
          <Wordmark className="h-5 w-auto" />
          <span className="t-meta">Smart Home</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Fő menü">
          {[["#megoldasok", "Megoldások"], ["#folyamat", "Folyamat"], ["#gyik", "Kérdések"]].map(([h, t]) => (
            <a key={h} href={h} onClick={go(h)} className="t-meta rounded-full px-4 py-2.5 hover:bg-paper/10 [html[data-nav=kiwi]_&]:hover:bg-night/10">{t}</a>
          ))}
        </nav>
        <a href="#felmeres" onClick={go("#felmeres")} className="t-meta inline-flex h-10 items-center rounded-full bg-kiwi px-5 text-night [html[data-nav=kiwi]_&]:bg-night [html[data-nav=kiwi]_&]:text-kiwi">Felmérés</a>
      </header>

      <main>
        <section id="top" data-theme="night" className="relative bg-night" style={{ height: "640svh" }}>
          <div ref={box} className="sticky top-0 h-[100dvh] overflow-hidden" data-stage="-1">
            <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full cursor-grab [touch-action:pan-y] active:cursor-grabbing" />
            {ROOM_NAMES.map((n, i) => (
              <p key={n} ref={(el) => { tags.current[i] = el; }} aria-hidden className="tag3d t-meta pointer-events-none rounded-full bg-night-2/90 px-2.5 py-1 text-[0.6rem] text-smoke">
                {n} <b className="font-normal text-kiwi">19°</b>
              </p>
            ))}
            <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-[2] pb-[max(1.25rem,4svh)]">
              <div className="relative h-[15.5rem] md:h-[17rem] md:max-w-[30rem]">
                {STAGES.map(([t, d], i) => (
                  <div key={t} className={`cap cap-${i} absolute inset-x-0 bottom-0`}>
                    <p className="t-meta mb-2 text-kiwi">0{i + 1} / 05</p>
                    <h2 className="t-l">{t}</h2>
                    <p className="mt-3 max-w-[34ch] text-smoke">{d}</p>
                  </div>
                ))}
                <div className="cap cap-5 absolute inset-x-0 bottom-0 rounded-[22px] bg-night-2/95 p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
                  <h2 className="t-m">Próbáld ki</h2>
                  <p className="mt-1 text-[0.86rem] text-smoke">Kapcsolgass, és húzd el a házat a forgatáshoz.</p>
                  <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Lámpák">
                    {ROOM_NAMES.map((n, i) => <button key={n} className="chip" aria-pressed={ui.l[i] > 0.5} onClick={() => toggleL(i)}><i />{n}</button>)}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <button className="chip" aria-pressed={ui.shut > 0.5} onClick={() => setUi((u) => ({ ...u, shut: u.shut > 0.5 ? 0 : 1 }))}><i />Redőnyök le</button>
                    <button className="chip" aria-pressed={ui.heat > 0.5} onClick={() => setUi((u) => ({ ...u, heat: u.heat > 0.5 ? 0 : 1 }))}><i />Fűtés</button>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3" role="group" aria-label="Jelenetek">
                    <span className="t-meta mr-1 text-[0.6rem] text-ash">Jelenet</span>
                    {SCENES.map(([n, s]) => <button key={n} className="chip !min-h-[2.4rem] !px-3" onClick={() => setUi(s)}>{n}</button>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] flex-col">
            <div className="wrap flex flex-1 flex-col pb-6 pt-24 md:pb-8 md:pt-28">
              <p className="t-meta flex items-center gap-2.5 text-smoke"><i className="h-2 w-2 rounded-full bg-kiwi" />Okosotthon-tervezés és kivitelezés</p>
              <h1 className="t-mega mt-auto pt-10" style={{ fontSize: "clamp(2.6rem, min(11.5vw, 12vh), 8rem)" }}>
                <span className="block">Az otthonod,</span>
                <span className="block text-kiwi"><em>egy érintésre.</em></span>
              </h1>
              <div className="mt-7 h-px bg-line-2 md:mt-9" />
              <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
                <p className="t-lead max-w-[36ch] text-smoke md:col-span-5">Világítás, árnyékolás, fűtés és biztonság egy rendszerben. <span className="text-paper">Görgess, és nézz bele a falakba.</span></p>
                <div className="pointer-events-auto md:col-span-4 md:col-start-6">
                  <a href="#felmeres" onClick={go("#felmeres")} className="pill pill--kiwi" data-cursor="Írj">Felmérést kérek<span className="pill-dot"><ArrowIcon /></span></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Areas />
        <Wire />
        <Breakers />

        <footer id="felmeres" data-theme="kiwi" className="relative bg-kiwi text-night">
          <div className="wrap pt-[var(--sec)]">
            <Meta n="04" dark>Felmérés</Meta>
            <h2 className="t-mega mt-8" style={{ fontSize: "clamp(2.8rem, 11vw, 9.5rem)" }}>Nézzük meg<br /><em>a házadat.</em></h2>
            <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-4">
                <p className="t-meta mb-3">Milyen épület?</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Épület típusa">{KINDS.map((k) => <button key={k} className="chip chip-ink" aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>)}</div>
                <p className="t-meta mb-3 mt-8">Mi érdekel?</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Érdeklődési területek">{WANTS.map((w) => <button key={w} className="chip chip-ink" aria-pressed={wants.includes(w)} onClick={() => setWants((s) => (s.includes(w) ? s.filter((x) => x !== w) : [...s, w]))}>{w}</button>)}</div>
                <p className="mt-6 text-[0.9rem] text-night/75">Az alaprajz élőben mutatja, mit tervezünk a házadba.</p>
              </div>
              <div className="md:col-span-4">
                <div key={kind}><Plan kind={kind} wants={wants} /></div>
              </div>
              <div className="md:col-span-4">
                <p className="whitespace-pre-line rounded-[18px] bg-night p-5 text-[0.95rem] text-paper" data-msg="">{msg}</p>
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Okosotthon-felmérés")}&body=${encodeURIComponent(msg)}`} className="pill pill--night mt-4 h-14 pl-6" data-cursor="Küldés">Elküldöm e-mailben<span className="pill-dot"><ArrowIcon /></span></a>
                <p className="mt-3 text-[0.85rem] text-night/75">Ez bemutató oldal: az üzenet a HRVT-hez érkezik.</p>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-3 border-t border-line-ink py-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-[60ch] text-[0.9rem]"><strong>Bemutató oldal.</strong> A HRVT Smart Home nem valódi cég: ez a HRVT mintamunkája okosotthon-kivitelezőknek. Saját arculattal, ahogy minden ügyfélnek.</p>
              <a href="/#kapcsolat" className="t-meta underline underline-offset-4">Ilyen oldalt szeretnék a cégemnek →</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
