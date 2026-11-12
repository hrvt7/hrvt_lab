"use client";
import { cloneElement, Fragment, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ADDRESS, ASZF, BOOK, COACH, COACHES, EMAIL, EVENTS, EXTRA, FAQ, FB, IG, MAP, PASSES, PHONE, PHONE_TEL, PRICE } from "./data";

const ft = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function track(name: string, props?: Record<string, unknown>) {
  const w = window as unknown as { va?: (e: string, p: unknown) => void; plausible?: (n: string, o?: unknown) => void; gtag?: (...a: unknown[]) => void };
  try { w.va?.("event", { name, ...props }); w.plausible?.(name, { props }); w.gtag?.("event", name, props); } catch {}
}

/** Splits heading text into word spans so every word can be "served" in on its own. */
function T({ children }: { children: ReactNode }) {
  let i = 0;
  const walk = (n: ReactNode): ReactNode => {
    if (typeof n === "string") return n.split(/(\s+)/).map((p, k) => (p.trim() ? <span key={k} className="w" style={{ "--i": i++ } as CSSProperties}>{p}</span> : p));
    if (Array.isArray(n)) return n.map((c, k) => <Fragment key={k}>{walk(c)}</Fragment>);
    if (isValidElement<{ children?: ReactNode }>(n)) return cloneElement(n, undefined, walk(n.props.children));
    return n;
  };
  return <>{walk(children)}</>;
}

/** --p (0..1) while the element crosses the viewport. */
function useProgress<T extends HTMLElement>(from = 0.92, to = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current!; let raf = 0;
    const upd = () => { raf = 0; const r = el.getBoundingClientRect(), vh = innerHeight; el.style.setProperty("--p", Math.min(1, Math.max(0, (vh * from - r.top) / (vh * (from - to) + r.height * 0.5))).toFixed(4)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [from, to]);
  return ref;
}
/** Switches --on to 1 on each child row once it passes the given viewport line. */
function useRows<T extends HTMLElement>(sel: string, line = 0.8) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const rows = [...ref.current!.querySelectorAll<HTMLElement>(sel)]; let raf = 0;
    const upd = () => { raf = 0; rows.forEach((r) => r.style.setProperty("--on", r.getBoundingClientRect().top < innerHeight * line ? "1" : "0")); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [sel, line]);
  return ref;
}

const Arrow = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const Phone = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>);

/** Rolling scoreboard number. */
function Roll({ value }: { value: number }) {
  const s = ft(value);
  return (
    <span aria-label={`${s} forint`} role="text">
      {s.split("").map((c, i) => /\d/.test(c)
        ? <span key={s.length - i} className="digit" aria-hidden><span style={{ transform: `translateY(-${Number(c) * 10}%)` }}>{"0123456789".split("").map((d) => <i key={d}>{d}</i>)}</span></span>
        : <span key={s.length - i} aria-hidden>&nbsp;</span>)}
    </span>
  );
}

function Hero({ onCanvas }: { onCanvas: (hero: HTMLElement, host: HTMLElement) => void }) {
  const sec = useRef<HTMLElement>(null), host = useRef<HTMLDivElement>(null);
  useEffect(() => { onCanvas(sec.current!, host.current!); }, [onCanvas]);
  const cap = "cap wrapw inset-x-0 top-[6.2rem] md:top-[8.5rem]";
  return (
    <section ref={sec} id="top" className="relative" style={{ height: "430svh", background: "radial-gradient(120% 70% at 50% 100%, #12356e 0%, #0b2247 38%, #081629 72%)" }}>
      <div ref={host} data-st="0" className="sticky top-0 z-40 h-[100svh] overflow-hidden">
        <div className={`${cap} cap-0`}>
          <p className="eyebrow lime mb-4">Szombathely · fedett panoráma pályák · minden nap 8–23</p>
          <h1 className="disp max-w-[9ch] text-[clamp(2.3rem,9.3vw,8.2rem)]"><T>Üsd át a <span className="lime">határaidat.</span></T></h1>
          <p className="mt-5 max-w-[30ch] text-[1.1rem] text-[var(--mute)] md:text-[1.25rem]">Padel Szombathelyen. Könnyű megtanulni, négyen a legjobb, és az első óra után már nem akarod letenni az ütőt.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime" data-track="foglalas"><span>Pályát foglalok</span><Arrow /></a>
            <a href="#arak" className="btn btn-ghost" data-track="arak_hero"><span>Mennyibe kerül?</span></a>
          </div>
        </div>
        <div className={`${cap} cap-1`}>
          <p className="eyebrow lime mb-4">Az üvegfal is játszik</p>
          <p className="disp max-w-[11ch] text-[clamp(2.6rem,8vw,6.4rem)]"><T>A labda <span className="lime">visszajön.</span></T></p>
          <p className="mt-4 max-w-[30ch] text-[var(--mute)]">A falról visszapattanó labdát is meg lehet játszani, ezért hosszabbak a labdamenetek, és kezdőként is hamar jön a sikerélmény.</p>
        </div>
        <div className={`${cap} cap-2`}>
          <p className="eyebrow lime mb-4">Páros sport</p>
          <p className="disp max-w-[11ch] text-[clamp(2.6rem,8vw,6.4rem)]"><T>Négyen <span className="lime">a legjobb.</span></T></p>
          <p className="mt-4 max-w-[30ch] text-[var(--mute)]">Barátokkal, családdal, kollégákkal. Ha hiányzik valaki a párosból, ingyen segítünk játékostársat találni.</p>
        </div>
        <div className={`${cap} cap-3`}>
          <p className="eyebrow lime mb-4">Most te jössz</p>
          <p className="disp max-w-[9ch] text-[clamp(2.6rem,8vw,6.4rem)]"><T>Gyere, <span className="lime">üsd át.</span></T></p>
        </div>
        <div className="burst !absolute" aria-hidden />
        <p className="eyebrow absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--mute)] transition-opacity duration-300 [[data-st='0']_&]:opacity-100 opacity-0" aria-hidden>Görgess ↓</p>
      </div>
    </section>
  );
}

function Calc() {
  const [mode, setMode] = useState<"jatek" | "edzo">("jatek");
  const [court, setCourt] = useState<"dupla" | "egyeni">("dupla");
  const [band, setBand] = useState<"nappal" | "este">("este");
  const [hours, setHours] = useState(1);
  const [rackets, setRackets] = useState(0);
  const [balls, setBalls] = useState<"sajat" | "berles" | "uj">("sajat");
  const [n, setN] = useState(2);
  const fo = mode === "edzo" ? n : PRICE[court].fo;
  const base = mode === "edzo" ? COACH[n - 1] : PRICE[court][band] * fo * hours;
  const extra = Math.min(rackets, fo) * EXTRA.uto * (mode === "edzo" ? 1 : hours) + (balls === "berles" ? EXTRA.labdaBerles : balls === "uj" ? EXTRA.labdaUj : 0);
  const total = base + extra, per = total / fo;
  // player dots on the little court
  const spots: [number, number][] = mode === "edzo"
    ? [[50, 78], [28, 70], [72, 70], [50, 62]].slice(0, n).map(([x, y]) => [x, y] as [number, number])
    : court === "dupla" ? [[28, 22], [72, 30], [28, 70], [72, 78]] : [[50, 24], [50, 76]];
  const Seg = <V extends string | number>({ v, set, opts, label, name }: { v: V; set: (x: V) => void; opts: [V, string][]; label: string; name: string }) => (
    <div>
      <p className="mb-2 text-sm font-bold">{label}</p>
      <div className="seg" role="group" aria-label={label}>
        {opts.map(([k, l]) => <button key={String(k)} aria-pressed={v === k} onClick={() => { set(k); track("kalkulator", { [name]: k }); }}>{l}</button>)}
      </div>
    </div>
  );
  return (
    <section id="arak" data-hit data-light className="on-lime relative z-[41] -mt-[30svh] bg-[var(--lime)] pb-20 pt-12 text-[var(--ink)] md:pb-28 md:pt-16">
      <div className="wrapw">
        <p className="eyebrow mb-4">Árak · kalkulátor</p>
        <h2 data-t className="disp max-w-[12ch] text-[clamp(2.5rem,7vw,5.6rem)]"><T>Mennyi az fejenként?</T></h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_26rem] lg:gap-14">
          <div className="grid content-start gap-6">
            <Seg label="Mire jössz?" name="mod" v={mode} set={setMode} opts={[["jatek", "Játék"], ["edzo", "Edzés edzővel"]]} />
            {mode === "jatek" ? (
              <>
                <Seg label="Melyik pálya?" name="palya" v={court} set={setCourt} opts={[["dupla", "Dupla · 4 fő"], ["egyeni", "Egyéni · 2 fő"]]} />
                <Seg label="Mikor?" name="idosav" v={band} set={setBand} opts={[["nappal", "8–16 óra"], ["este", "16–23 óra"]]} />
                <Seg label="Mennyi ideig?" name="ora" v={hours} set={setHours} opts={[[1, "1 óra"], [2, "2 óra"]]} />
              </>
            ) : (
              <Seg label="Hányan jöttök az edzésre?" name="fo" v={n} set={setN} opts={[[1, "1 fő"], [2, "2 fő"], [3, "3 fő"], [4, "4 fő"]]} />
            )}
            <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
              <div>
                <p className="mb-2 text-sm font-bold">Ütőbérlés ({ft(EXTRA.uto)} Ft/óra)</p>
                <span className="step">
                  <button onClick={() => setRackets((r) => Math.max(0, r - 1))} aria-label="Kevesebb bérelt ütő">−</button>
                  <span aria-live="polite">{Math.min(rackets, fo)}</span>
                  <button onClick={() => setRackets((r) => Math.min(fo, r + 1))} aria-label="Több bérelt ütő">+</button>
                </span>
              </div>
              <div className="min-w-[16rem] flex-1">
                <Seg label="Labda" name="labda" v={balls} set={setBalls} opts={[["sajat", "Van saját"], ["berles", "Bérlek"], ["uj", "Újat veszek"]]} />
              </div>
            </div>
          </div>
          <div className="board self-start p-6 md:p-8 lg:sticky lg:top-28">
            <div className="flex items-start gap-5">
              <div className="mini w-[5.2rem] flex-none" aria-hidden>
                {[0, 1, 2, 3].map((i) => <i key={i} className={`${spots[i] ? "" : "off"} ${mode === "edzo" && i === 0 ? "coach" : ""}`} style={{ left: `${(spots[i] ?? [50, 50])[0]}%`, top: `${(spots[i] ?? [50, 50])[1]}%` }} />)}
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-[var(--lime)]">Fejenként</p>
                <p className="disp mt-1 text-[clamp(3rem,9vw,4.6rem)] !not-italic tabular-nums text-[var(--lime)]"><Roll value={per} /></p>
                <p className="-mt-1 font-bold">Ft / fő{mode === "jatek" ? ` · ${hours} óra` : ""}</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-2 border-t border-white/15 pt-5 text-[.98rem]">
              <div className="flex justify-between gap-4"><dt className="text-[var(--mute)]">{mode === "edzo" ? `Edzés pályadíjjal, ${n} fő` : `${court === "dupla" ? "Dupla" : "Egyéni"} pálya, ${hours} óra`}</dt><dd className="font-bold tabular-nums">{ft(base)} Ft</dd></div>
              {extra > 0 && <div className="flex justify-between gap-4"><dt className="text-[var(--mute)]">Ütő és labda</dt><dd className="font-bold tabular-nums">{ft(extra)} Ft</dd></div>}
              <div className="flex justify-between gap-4 text-[1.1rem]"><dt className="font-bold">Összesen</dt><dd className="font-extrabold tabular-nums">{ft(total)} Ft</dd></div>
            </dl>
            <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime mt-6 w-full" data-track="foglalas_kalkulator"><span>Időpontot választok</span><Arrow /></a>
            <p className="mt-4 text-sm text-[var(--mute)]">Tájékoztató számítás a honlapon közzétett árakból. A fizetendő összeget a foglalási rendszer mutatja.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Passes() {
  const ref = useProgress<HTMLElement>(0.85, 0.3);
  return (
    <section ref={ref} id="berletek" data-hit className="py-20 md:py-28">
      <div className="wrapw">
        <p className="eyebrow lime mb-4">Bérletek</p>
        <h2 data-t className="disp max-w-[13ch] text-[clamp(2.5rem,7vw,5.6rem)]"><T>Többet játszol, <span className="lime">többet kapsz.</span></T></h2>
        <p className="mt-5 max-w-[46ch] text-[var(--mute)]">A bérlet játékkeret: befizetsz egy összeget, és ennél többet játszhatsz le. Bármelyik idősávban, dupla és egyéni pályán is felhasználható.</p>
        <div className="mt-12 grid gap-10">
          {PASSES.map((p) => (
            <div key={p.name} className="pass grid items-end gap-x-8 gap-y-3 md:grid-cols-[11rem_1fr_auto]" style={{ "--pay": (p.pay / 172000) * 100, "--bonus": ((p.get - p.pay) / 172000) * 100 } as CSSProperties}>
              <p className="disp text-[2.6rem] md:text-[3.2rem]">{p.name}</p>
              <div className="pb-2">
                <div className="bar" aria-hidden><b /><u /></div>
                <p className="mt-2 text-sm text-[var(--mute)]">{ft(p.pay)} Ft befizetés → <span className="font-bold text-[var(--paper)]">{ft(p.get)} Ft játékkeret</span></p>
              </div>
              <p className="disp lime text-[1.9rem] md:pb-2 md:text-[2.3rem]">+{ft(p.get - p.pay)} Ft</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[var(--mute)]">A bérleteket a recepción lehet megvásárolni. <a className="font-bold text-[var(--paper)] underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={`tel:${PHONE_TEL}`} data-track="hivas">Kérdésed van? {PHONE}</a></p>
      </div>
    </section>
  );
}

function Courts() {
  const a = useProgress<HTMLDivElement>(0.95, 0.4), b = useProgress<HTMLDivElement>(0.95, 0.4);
  const Dim = ({ w, l, label }: { w: number; l: number; label: string }) => (
    <svg viewBox="0 0 120 220" className="h-44 w-auto flex-none" role="img" aria-label={label}>
      <rect x={60 - w * 4} y="10" width={w * 8} height={l * 10} fill="none" stroke="#c6f135" strokeWidth="2.5" pathLength={1} className="dim" />
      <line x1={60 - w * 4} y1="110" x2={60 + w * 4} y2="110" stroke="#f4f7fb" strokeWidth="2" pathLength={1} className="dim" />
      <text x="60" y="104" textAnchor="middle" fill="#f4f7fb" fontSize="13" fontWeight="700">{w} m</text>
      <text x={60 + w * 4 + 6} y="60" fill="#f4f7fb" fontSize="13" fontWeight="700">{l} m</text>
    </svg>
  );
  return (
    <section id="palyak" data-hit className="bg-[var(--navy2)] py-20 md:py-28">
      <div className="wrapw">
        <p className="eyebrow lime mb-4">Pályáink</p>
        <h2 data-t className="disp max-w-[12ch] text-[clamp(2.5rem,7vw,5.6rem)]"><T>Üvegfalak között, <span className="lime">bármilyen időben.</span></T></h2>
        <div className="mt-12 grid gap-14">
          <div ref={a} className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
            <div className="glass aspect-[3/2]"><img src="/westpadel/hall.webp" srcSet="/westpadel/hall-800.webp 800w, /westpadel/hall.webp 1400w" sizes="(min-width:768px) 55vw, 100vw" alt="A West Padel fedett csarnoka: kék pályák üvegfallal, játék közben" loading="lazy" width={1400} height={909} /></div>
            <div className="flex items-center gap-6">
              <Dim w={10} l={20} label="Dupla pálya: 10 × 20 méter" />
              <div>
                <h3 className="disp text-[1.9rem]">Panoráma dupla pálya</h3>
                <p className="mt-2 text-[var(--mute)]">Szabványos, 10 × 20 méteres pálya négy játékosnak. Az üvegfalak tetején nincs zavaró oszlop, így a nézők is mindent látnak. Versenyekre is alkalmas.</p>
              </div>
            </div>
          </div>
          <div ref={b} className="grid items-center gap-8 md:grid-cols-[1fr_1.25fr]">
            <div className="flex items-center gap-6 md:order-1">
              <Dim w={6} l={20} label="Egyéni pálya: 6 × 20 méter" />
              <div>
                <h3 className="disp text-[1.9rem]">Egyéni pálya</h3>
                <p className="mt-2 text-[var(--mute)]">6 × 20 méter, egy az egy elleni játékra, edzésre és gyerekprogramokra. Fedett és szabadtéri pályáink is vannak.</p>
              </div>
            </div>
            <div className="glass aspect-[16/9] md:order-2"><img src="/westpadel/drone.webp" srcSet="/westpadel/drone-800.webp 800w, /westpadel/drone.webp 1400w" sizes="(min-width:768px) 55vw, 100vw" alt="A West Padel szabadtéri pályái felülről, parkolóval" loading="lazy" width={1400} height={788} /></div>
          </div>
        </div>
        <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime mt-12" data-track="foglalas"><span>Kipróbálom a pályát</span><Arrow /></a>
      </div>
    </section>
  );
}

function Coaches() {
  const ref = useProgress<HTMLElement>(0.75, 0.25);
  return (
    <section ref={ref} id="edzok" data-hit data-light className="bg-[var(--paper)] py-20 text-[var(--ink)] md:py-28">
      <div className="wrapw">
        <p className="eyebrow mb-4 text-[var(--blue)]">Edzők</p>
        <h2 data-t className="disp max-w-[12ch] text-[clamp(2.5rem,7vw,5.6rem)]"><T>Az első ütéstől <span className="text-[var(--blue)]">a versenyig.</span></T></h2>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1fr_1.1fr] md:gap-8">
          {COACHES.map((c) => (
            <a key={c.name} href={c.href} target="_blank" rel="noopener" className="group block" data-track="edzo_adatlap">
              <div className="aspect-[3/4] overflow-hidden rounded-[1.2rem] bg-[var(--navy)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={`${c.name}, a West Padel edzője`} loading="lazy" width={1050} height={1400} className="holes h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="disp mt-4 text-[1.7rem]">{c.name}</h3>
              <p className="text-[#3c4f6b]">Aktív edző{c.langs ? ` · ${c.langs}` : ""}</p>
            </a>
          ))}
          <div className="self-end rounded-[1.2rem] bg-[var(--navy)] p-6 text-[var(--paper)] md:p-7">
            <p className="eyebrow lime">Edzés pályadíjjal együtt</p>
            <ul className="mt-4 grid gap-2">
              {COACH.map((p, i) => <li key={i} className="flex items-baseline justify-between border-b border-white/15 pb-2"><span>{i + 1} fő</span><span className="disp text-[1.5rem] !not-italic tabular-nums">{ft(p)} Ft</span></li>)}
            </ul>
            <p className="mt-4 text-sm text-[var(--mute)]">Privát és csoportos órák, gyerekeknek és felnőtteknek.</p>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-lime mt-5 w-full" data-track="hivas"><Phone /><span>Edzést kérek</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Events() {
  const ref = useRows<HTMLOListElement>("li", 0.82);
  return (
    <section id="esemenyek" data-hit className="py-20 md:py-28">
      <div className="wrapw">
        <p className="eyebrow lime mb-4">Versenyek, események</p>
        <h2 data-t className="disp max-w-[12ch] text-[clamp(2.5rem,7vw,5.6rem)]"><T>Egy év, <span className="lime">hét labdamenet.</span></T></h2>
        <p className="mt-5 max-w-[46ch] text-[var(--mute)]">A 2025-ös nyitás óta klubversenyek, ranglistás tornák és egy országos sorozat állomása is volt nálunk.</p>
        <ol ref={ref} className="rally mt-12 grid gap-9">
          {EVENTS.map((e) => (
            <li key={e.n}>
              <p className="eyebrow text-[var(--mute)]">{e.d}</p>
              <h3 className="disp mt-1 text-[1.6rem] md:text-[2rem]">{e.n}</h3>
              <p className="text-[var(--mute)]">{e.t}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-[var(--mute)]">A következő versenyeket itt hirdetjük meg: <a className="font-bold text-[var(--paper)] underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={FB} target="_blank" rel="noopener" data-track="facebook">Facebook</a> és <a className="font-bold text-[var(--paper)] underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={IG} target="_blank" rel="noopener" data-track="instagram">Instagram</a>.</p>
      </div>
    </section>
  );
}

const LEVELS = ["Kezdő", "Középhaladó", "Haladó", "Versenyző"];
function Partner() {
  const [lvl, setLvl] = useState(0);
  const ref = useRows<HTMLUListElement>("li", 0.85);
  const body = `Sziasztok!\n\nCsapattársat keresek padelhez.\nSzintem: ${LEVELS[lvl]}\nMikor érek rá: \nNevem, telefonszámom: `;
  return (
    <section id="szolgaltatasok" data-hit className="bg-[var(--blue)] py-20 md:py-28">
      <div className="wrapw grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">Csapattárskereső · ingyenes</p>
          <h2 data-t className="disp max-w-[10ch] text-[clamp(2.5rem,7vw,5.2rem)]"><T>Hiányzik <span className="lime">a negyedik?</span></T></h2>
          <p className="mt-5 max-w-[40ch]">Írd meg, milyen szinten játszol, és keresünk hozzád hasonló tudású játékostársat.</p>
          <div className="mt-7 flex items-center gap-6">
            <div className="mini w-[5.2rem] flex-none" aria-hidden>
              <i style={{ left: "28%", top: "22%" }} /><i style={{ left: "72%", top: "30%" }} /><i style={{ left: "28%", top: "70%" }} />
              <i className="animate-pulse !bg-transparent !shadow-[0_0_0_3px_var(--lime)]" style={{ left: "72%", top: "78%" }} />
            </div>
            <div className="grid gap-2" role="group" aria-label="A szinted">
              {LEVELS.map((l, i) => <button key={l} aria-pressed={lvl === i} onClick={() => setLvl(i)} className={`rounded-full border-2 px-4 py-2 text-left font-bold transition ${lvl === i ? "border-[var(--lime)] bg-[var(--lime)] text-[var(--ink)]" : "border-white/40"}`}>{l}</button>)}
            </div>
          </div>
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Csapattársat keresek")}&body=${encodeURIComponent(body)}`} className="btn btn-lime mt-8" data-track="partner_email"><span>Csapattársat keresek</span><Arrow /></a>
        </div>
        <div>
          <p className="eyebrow mb-4">Minden egy helyen</p>
          <ul ref={ref} className="grid">
            {[["Padel shop", "ütők, cipők, gripek, labdák"], ["Büfé", "kávé, üdítő, szendvics, proteinszelet"], ["Öltözők", "zuhanyzóval"], ["Parkolás", "ingyenes, a csarnok előtt"], ["Ütőbérlés", `${ft(EXTRA.uto)} Ft egy órára`], ["Ajándékutalvány", "padelrajongóknak"]].map(([t, d]) => (
              <li key={t} className="border-b border-white/25 py-4">
                <p className="disp text-[clamp(1.9rem,5vw,3rem)] transition-[color,transform] duration-500" style={{ color: "color-mix(in srgb, var(--paper) calc(var(--on,0) * 100%), rgba(244,247,251,.72))", transform: "translateX(calc((1 - var(--on,0)) * -22px)) skewX(calc((1 - var(--on,0)) * -10deg))" }}>{t}</p>
                <p className="text-white/85">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="gyik" data-hit data-light className="on-lime bg-[var(--lime)] py-20 text-[var(--ink)] md:py-28">
      <div className="wrapw grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow mb-4">Gyakori kérdések</p>
          <h2 data-t className="disp max-w-[9ch] text-[clamp(2.5rem,7vw,5.2rem)]"><T>Kérdezz, visszaütjük.</T></h2>
        </div>
        <div>
          {FAQ.map(([q, a], i) => (
            <div key={q} className="qa" data-open={open === i}>
              <button aria-expanded={open === i} aria-controls={`wpa${i}`} onClick={() => { setOpen(open === i ? null : i); track("gyik", { q }); }}><span>{q}</span><span className="dot" aria-hidden /></button>
              <div className="ans" id={`wpa${i}`} role="region"><div><p>{a}{i === 4 && <> <a className="font-bold underline" href={ASZF} target="_blank" rel="noopener" data-track="aszf">ÁSZF megnyitása</a></>}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Budapest" }).format(new Date()));
    setOpen(h >= 8 && h < 23);
  }, []);
  return (
    <section id="kapcsolat" data-hit className="py-20 md:py-28">
      <div className="wrapw grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow lime mb-4">Kapcsolat · helyszín</p>
          <h2 data-t className="disp text-[clamp(2.1rem,8.6vw,5.4rem)]"><T>Találkozunk<br /><span className="lime">a pályán.</span></T></h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime" data-track="foglalas"><span>Pályát foglalok</span><Arrow /></a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost" data-track="hivas"><Phone /><span>{PHONE}</span></a>
          </div>
        </div>
        <dl className="grid content-start gap-6 text-[1.1rem]">
          <div><dt className="eyebrow text-[var(--mute)]">Cím</dt><dd className="mt-1"><a className="font-bold underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={MAP} target="_blank" rel="noopener" data-track="utvonal">{ADDRESS}</a><br /><span className="text-[var(--mute)]">Ingyenes parkolás</span></dd></div>
          <div><dt className="eyebrow text-[var(--mute)]">Nyitvatartás</dt><dd className="mt-1 font-bold">Hétfőtől vasárnapig 8:00–23:00{open !== null && <span className={`ml-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${open ? "bg-[var(--lime)] text-[var(--ink)]" : "bg-white/15"}`}>{open ? "Most nyitva" : "Most zárva"}</span>}</dd></div>
          <div><dt className="eyebrow text-[var(--mute)]">E-mail</dt><dd className="mt-1"><a className="font-bold underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={`mailto:${EMAIL}`} data-track="email">{EMAIL}</a></dd></div>
          <div><dt className="eyebrow text-[var(--mute)]">Kövess minket</dt><dd className="mt-1 flex gap-5 font-bold"><a className="underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={FB} target="_blank" rel="noopener" data-track="facebook">Facebook</a><a className="underline decoration-[var(--lime)] decoration-2 underline-offset-4" href={IG} target="_blank" rel="noopener" data-track="instagram">Instagram</a></dd></div>
        </dl>
      </div>
    </section>
  );
}

export function WestPadel() {
  const canvas = useRef<HTMLCanvasElement>(null), root = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState(false);
  const refs = useRef<{ hero?: HTMLElement; host?: HTMLElement }>({});
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const click = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]"); if (el) track(el.dataset.track!); };
    const scroll = () => setBar(scrollY > innerHeight * 3.4);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".wp [data-t]").forEach((el) => io.observe(el));
    document.addEventListener("click", click); addEventListener("scroll", scroll, { passive: true });
    let api: { destroy: () => void } | null = null, dead = false;
    const sections = [...document.querySelectorAll<HTMLElement>(".wp [data-hit]")];
    const start = () => import("./court3d").then((m) => {
      if (dead || !refs.current.hero) return;
      try {
        api = m.mount({
          canvas: canvas.current!, hero: refs.current.hero,
          onStage: (s) => refs.current.host?.setAttribute("data-st", String(s)),
          onBurst: (k, x, y) => { const h = refs.current.host; if (!h) return; h.style.setProperty("--b", k.toFixed(4)); if (k < 0.05) { h.style.setProperty("--bx", `${x}%`); h.style.setProperty("--by", `${y}%`); } },
          onImpact: (x, y, i) => {
            const r = document.createElement("i"); r.className = `ripple${sections[i]?.hasAttribute("data-light") ? " dark" : ""}`; r.style.left = `${x}px`; r.style.top = `${y}px`;
            root.current?.appendChild(r); r.addEventListener("animationend", () => r.remove());
          },
        });
      } catch { /* no WebGL: the page still works, the hero keeps its gradient */ }
    });
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => start(), { timeout: 1200 }); else setTimeout(start, 300);
    return () => { dead = true; api?.destroy(); io.disconnect(); document.removeEventListener("click", click); removeEventListener("scroll", scroll); };
  }, []);
  return (
    <div ref={root} className="wp pb-[4.6rem] md:pb-0">
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrapw mt-3 flex items-center justify-between rounded-full border border-white/15 bg-[rgba(8,22,41,.82)] px-3 py-2 backdrop-blur-md">
          <a href="#top" className="flex items-center gap-2 pl-2" aria-label="West Padel, a lap tetejére">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/westpadel/logo.webp" alt="" width={610} height={476} className="h-9 w-auto" />
            <span className="disp text-[1.05rem] max-[360px]:hidden">West Padel</span>
          </a>
          <nav className="hidden items-center gap-6 font-bold lg:flex" aria-label="Fő menü">
            <a href="#arak">Árak</a><a href="#berletek">Bérletek</a><a href="#palyak">Pályák</a><a href="#edzok">Edzők</a><a href="#esemenyek">Versenyek</a><a href="#kapcsolat">Kapcsolat</a>
          </nav>
          <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime !min-h-[2.75rem] !px-5 !text-[.9rem]" data-track="foglalas"><span>Foglalás</span></a>
        </div>
      </header>
      <main>
        <Hero onCanvas={(hero, host) => { refs.current = { hero, host }; }} />
        <Calc />
        <Passes />
        <Courts />
        <Coaches />
        <Events />
        <Partner />
        <Faq />
        <Contact />
      </main>
      <footer className="border-t border-white/10 py-8">
        <div className="wrapw flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--mute)]">
          <p>West Padel · Beling Kft. · <a className="underline" href={ASZF} target="_blank" rel="noopener" data-track="aszf">ÁSZF</a></p>
          <p>Koncepcióterv, nem hivatalos oldal. Készítette: <a className="font-bold text-[var(--paper)] underline" href="/">HRVT</a></p>
        </div>
      </footer>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-[1.5fr_1fr] gap-3 border-t border-white/15 bg-[rgba(8,22,41,.94)] px-4 py-2 backdrop-blur transition-transform duration-300 md:hidden ${bar ? "" : "translate-y-full"}`}>
        <a href={BOOK} target="_blank" rel="noopener" className="btn btn-lime whitespace-nowrap" data-track="foglalas"><span>Pályát foglalok</span></a>
        <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost whitespace-nowrap" data-track="hivas"><Phone /><span>Hívás</span></a>
      </div>
    </div>
  );
}
