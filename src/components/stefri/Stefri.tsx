"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATS, CATALOG, EMAIL, FAQ, FB, MESSENGER, PHONE, PHONE2, PHONE2_TEL, PHONE_TEL, wa, type Item } from "./data";

const ft = (n: number) => n.toLocaleString("hu-HU").replace(/ | /g, " ") + " Ft";

function track(name: string, props?: Record<string, unknown>) {
  const w = window as unknown as { va?: (e: string, p: unknown) => void; plausible?: (n: string, o?: unknown) => void; gtag?: (...a: unknown[]) => void };
  try { w.va?.("event", { name, ...props }); w.plausible?.(name, { props }); w.gtag?.("event", name, props); } catch {}
}

/** Sets --p (0..1) on the element while it crosses the viewport. */
function useProgress<T extends HTMLElement>(from = 0.9, to = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const upd = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * from - r.top) / (vh * (from - to) + r.height * 0.6)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [from, to]);
  return ref;
}

const Phone = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>);
const Wa = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0 1 12 4Zm-3.2 3.6c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.300 0 1.400 1 2.700 1.200 2.900.1.200 2 3.100 4.900 4.300 2.400 1 2.900.8 3.400.7.500 0 1.700-.7 1.900-1.300.200-.700.200-1.200.200-1.300l-.6-.4-1.800-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.500 6.500 0 0 1-3.300-2.900c-.2-.4.2-.4.600-1.200.1-.2 0-.3 0-.5l-.8-2c-.2-.4-.4-.4-.600-.4Z" /></svg>);

function Hero() {
  const sec = useRef<HTMLElement>(null), host = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let stop = () => {}, dead = false;
    import("./scene").then((m) => { if (!dead) stop = m.mount(host.current!, sec.current!, cv.current!, (s) => host.current?.setAttribute("data-st", String(s))); });
    return () => { dead = true; stop(); };
  }, []);
  const capBox = "cap wrap2 inset-x-0 top-[5.5rem] md:top-[7.5rem]";
  return (
    <section ref={sec} id="top" className="relative" style={{ height: "380svh" }}>
      <div ref={host} data-st="0" className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className={`${capBox} cap-0`}>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1 text-sm font-bold">Mozgóbolt · 2014 óta · közel 100 településen</p>
          <h1 className="disp max-w-[13ch] text-[clamp(2.6rem,8.2vw,6.2rem)]">Jön az autó. <span className="text-[var(--red)]">Hozza a felvágottat.</span></h1>
          <p className="mt-4 max-w-[34ch] text-[1.1rem] font-medium md:text-[1.25rem]">Osztrák virsli, sonka, kolbász és gyorsfagyasztott finomságok: minden héten ugyanakkor, a te utcádban.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#mikor" className="btn btn-red" data-track="mikor_jon_hero">Mikor jön hozzám?</a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-white" data-track="hivas"><Phone />{PHONE}</a>
          </div>
        </div>
        <div className={`${capBox} cap-1`}>
          <p className="disp max-w-[14ch] text-[clamp(2.1rem,6vw,4.6rem)]">Hetente kétszer <span className="text-[var(--green)]">friss áru,</span> egyenesen a gyártótól.</p>
          <p className="mt-3 max-w-[32ch] font-medium">A burgenlandi Stefri Frischeteamtől hozzuk, közvetítő nélkül.</p>
        </div>
        <div className={`${capBox} cap-2`}>
          <p className="disp max-w-[15ch] text-[clamp(2.1rem,6vw,4.6rem)]">Ugyanazon a napon, <span className="text-[var(--red)]">ugyanabban az órában.</span></p>
          <p className="mt-3 max-w-[32ch] font-medium">Az időpontot pontosan tartjuk, így nem kell találgatnod, mikor érünk oda.</p>
        </div>
        <div className={`${capBox} cap-3`}>
          <p className="disp max-w-[13ch] text-[clamp(2.1rem,6vw,4.6rem)]">Megállunk <span className="text-[var(--red)]">nálad is.</span></p>
          <p className="mt-3 max-w-[32ch] font-medium">15 000 Ft feletti vásárlásnál 10 km-en belül házhoz is visszük.</p>
          <a href="#mikor" className="btn btn-red mt-5" data-track="mikor_jon_hero2">Megnézem, mikor jön</a>
        </div>
      </div>
    </section>
  );
}

function Finder() {
  const [town, setTown] = useState("");
  const t = town.trim();
  const msg = t ? `Jó napot! ${t} településről érdeklődöm: melyik napon és mikor jön a mozgóbolt?` : "Jó napot! Szeretném megtudni, mikor jön hozzánk a mozgóbolt.";
  const ref = useProgress<HTMLElement>();
  return (
    <section ref={ref} id="mikor" className="relative overflow-hidden bg-[var(--green)] py-20 text-white md:py-28">
      <div className="wrap2 grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#ffe08a]">Menetrend</p>
          <h2 className="disp text-[clamp(2.2rem,5.4vw,4.2rem)]">Mikor jön hozzám az autó?</h2>
          <p className="mt-4 max-w-[38ch] text-[1.1rem] text-white/90">Írd be a településed nevét, és egy koppintással megkérdezheted. A válaszban megkapod a napot és az órát, ami aztán minden héten ugyanaz.</p>
          <label htmlFor="town" className="mt-7 block text-sm font-bold">Településed neve</label>
          <input id="town" value={town} onChange={(e) => setTown(e.target.value)} autoComplete="address-level2" placeholder="pl. Vasszécseny" className="mt-2 h-14 w-full max-w-md rounded-xl border-2 border-[var(--ink)] bg-white px-4 text-[1.15rem] font-bold text-[var(--ink)] placeholder:font-medium placeholder:text-[var(--mute)]" />
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={wa(msg)} target="_blank" rel="noopener" className="btn btn-white" data-track="mikor_jon_whatsapp"><Wa />Megkérdezem WhatsAppon</a>
            <a href={`sms:${PHONE_TEL}?&body=${encodeURIComponent(msg)}`} className="btn btn-white" data-track="sms">SMS-ben</a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-red" data-track="hivas"><Phone />Felhívom</a>
          </div>
        </div>
        {/* the place-name sign fills in as you type and "rolls in" with scroll */}
        <div className="relative mx-auto w-full max-w-md" style={{ transform: "translateX(calc((1 - var(--p,1)) * 60%)) rotate(calc((1 - var(--p,1)) * 6deg))" }} aria-hidden>
          <div className="sign px-6 py-8 text-center text-[var(--ink)]">
            <p className="disp break-words text-[clamp(2rem,6vw,3.6rem)] leading-none">{t || "A te falud"}</p>
          </div>
          <div className="mx-auto h-28 w-3 bg-[var(--ink)]" />
          <div className="sign -mt-16 ml-auto w-max rotate-[-3deg] bg-[var(--must)] px-4 py-2 text-[var(--ink)]">
            <p className="text-sm font-extrabold uppercase tracking-wider">Mozgóbolt megálló</p>
            <p className="text-sm font-bold">minden héten, ugyanakkor</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kinalat() {
  const [cat, setCat] = useState(CATS[0].id);
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const all = useMemo(() => CATS.flatMap((c) => c.items), []);
  const items = q.trim() ? all.filter((i) => i.n.toLowerCase().includes(q.trim().toLowerCase())) : CATS.find((c) => c.id === cat)!.items;
  const step = (i: Item) => (i.u === "db" ? 1 : 10); // db or dkg
  const add = (i: Item, d: number) => setCart((c) => { const v = Math.max(0, (c[i.n] ?? 0) + d * step(i)); const n = { ...c }; if (v) n[i.n] = v; else delete n[i.n]; return n; });
  const lines = Object.entries(cart).map(([n, v]) => { const it = all.find((i) => i.n === n)!; return { n, v, it, sum: it.u === "db" ? v * it.p : (v / 100) * it.p }; });
  const total = lines.reduce((a, l) => a + l.sum, 0);
  useEffect(() => { dispatchEvent(new CustomEvent("sf:cart", { detail: lines.length })); }, [lines.length]);
  const text = `Jó napot! Szeretnék rendelni:\n${lines.map((l) => `- ${l.n}: ${l.v} ${l.it.u === "db" ? "db" : "dkg"}`).join("\n")}\nKb. ${ft(Math.round(total))} (tájékoztató ár).\nNév, település: `;
  return (
    <section id="kinalat" className="py-20 md:py-28">
      <div className="wrap2">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--red)]">Kínálat és árak</p>
        <h2 className="disp max-w-[16ch] text-[clamp(2.2rem,5.4vw,4.2rem)]">Írd össze, mi kerüljön a papírba.</h2>
        <p className="mt-4 max-w-[52ch] text-[var(--mute)]">Az árak kilogrammra értendők, az áfát tartalmazzák, és tájékoztató jellegűek. Állítsd be a mennyiséget, a cetlit pedig egy gombbal elküldheted nekünk.</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <div className="sticky top-[4.5rem] z-10 -mx-2 flex gap-2 overflow-x-auto bg-[var(--paper)] px-2 py-3" role="tablist" aria-label="Kategóriák">
              {CATS.map((c) => (<button key={c.id} role="tab" aria-selected={!q && cat === c.id} className="tab" onClick={() => { setQ(""); setCat(c.id); track("kinalat_kategoria", { cat: c.id }); }}>{c.name}</button>))}
            </div>
            <label className="sr-only" htmlFor="q">Keresés a kínálatban</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keresés: pl. prágai, debreceni…" className="mt-2 h-12 w-full rounded-xl border-2 border-[var(--ink)] bg-white px-4 font-medium" />
            <ul className="mt-4">
              {items.map((i, k) => (
                <li key={i.n} className="row" style={{ animation: `sfIn .5s ${Math.min(k, 12) * 35}ms both` }}>
                  <span className="row-n font-bold">{i.n}</span>
                  <span className="whitespace-nowrap text-right font-bold tabular-nums">{ft(i.p)}<span className="font-medium text-[var(--mute)]">/{i.u ?? "kg"}</span></span>
                  <span className="qty">
                    <button onClick={() => add(i, -1)} aria-label={`${i.n}: kevesebb`}>−</button>
                    <span>{cart[i.n] ? `${cart[i.n]} ${i.u === "db" ? "db" : "dkg"}` : "0"}</span>
                    <button onClick={() => add(i, 1)} aria-label={`${i.n}: több`}>+</button>
                  </span>
                </li>
              ))}
              {!items.length && <li className="py-6 text-[var(--mute)]">Nincs ilyen a listán. Kérdezz rá telefonon, lehet, hogy az autón van.</li>}
            </ul>
            <p className="mt-5 text-sm text-[var(--mute)]">A teljes választék képekkel: <a className="font-bold underline" href={CATALOG} target="_blank" rel="noopener" data-track="katalogus">online katalógus</a>. Heti akciók a <a className="font-bold underline" href={FB} target="_blank" rel="noopener" data-track="facebook">Facebook-oldalunkon</a>.</p>
          </div>
          <aside id="cetli" className="min-w-0 scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-label="Rendelési cetli">
            <div className="slip px-5 pt-5">
              <p className="disp text-[1.5rem]">Cetli</p>
              <p className="text-sm text-[var(--mute)]">Minőségi húskészítmények Ausztriából</p>
              <ul className="mt-3 min-h-[5rem] border-y-2 border-dashed border-[var(--ink)]/30 py-3 text-[.95rem]">
                {lines.map((l) => (<li key={l.n} className="flex justify-between gap-3 py-1"><span>{l.n} <b>· {l.v} {l.it.u === "db" ? "db" : "dkg"}</b></span><span className="whitespace-nowrap tabular-nums">{ft(Math.round(l.sum))}</span></li>))}
                {!lines.length && <li className="text-[var(--mute)]">Még üres. A + gombbal tehetsz rá tételeket.</li>}
              </ul>
              <p className="mt-3 flex justify-between text-[1.1rem] font-extrabold"><span>Kb. összesen</span><span className="tabular-nums">{ft(Math.round(total))}</span></p>
              {total >= 15000 && <p className="mt-2 rounded-lg bg-[var(--must)] px-3 py-2 text-sm font-bold">15 000 Ft felett 10 km-en belül házhoz visszük.</p>}
              <div className="mt-4 grid gap-2">
                <a href={wa(text)} target="_blank" rel="noopener" aria-disabled={!lines.length} className={`btn btn-green ${lines.length ? "" : "pointer-events-none opacity-50"}`} data-track="rendeles_whatsapp"><Wa />Elküldöm WhatsAppon</a>
                <a href={`tel:${PHONE_TEL}`} className="btn btn-white" data-track="hivas"><Phone />Inkább telefonálok</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <style>{`@keyframes sfIn{from{opacity:0;transform:translateX(-18px) skewX(-6deg)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}

const STEPS: [string, string][] = [
  ["Megkérdezed az időpontot", "Egy üzenet vagy hívás, és megmondjuk, melyik napon, hány órakor áll meg az autó a településeden."],
  ["Kijössz az autóhoz", "Minden héten ugyanakkor érkezünk. Válogathatsz a pultról, vagy átveszed, amit előre összeírtál."],
  ["Vagy házhoz kéred", "15 000 Ft feletti vásárlásnál 10 km-es körzetben az ajtódig visszük a rendelést."],
];
function Hogyan() {
  const ref = useProgress<HTMLElement>(0.8, 0.3);
  return (
    <section ref={ref} id="hogyan" className="bg-[var(--paper2)] py-20 md:py-28">
      <div className="wrap2">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--red2)]">Így megy</p>
        <h2 className="disp max-w-[14ch] text-[clamp(2.2rem,5.4vw,4.2rem)]">Három megálló a vacsoráig.</h2>
        {/* a little road: the van rides it as you scroll, stops light up when it passes */}
        <div className="relative mt-14">
          <div className="absolute left-5 top-0 h-full w-3 rounded-full bg-[var(--ink)] md:left-0 md:top-6 md:h-3 md:w-full" aria-hidden>
            <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[repeating-linear-gradient(var(--paper)_0_10px,transparent_10px_22px)] md:left-0 md:top-1/2 md:h-[3px] md:w-full md:-translate-y-1/2 md:translate-x-0 md:bg-[repeating-linear-gradient(90deg,var(--paper)_0_10px,transparent_10px_22px)]" />
          </div>
          <div aria-hidden className="sf-van absolute z-[2]">
            <svg viewBox="0 0 64 40" className="h-9 w-14"><rect x="2" y="4" width="38" height="24" rx="3" fill="#c8201c" stroke="#2a1a14" strokeWidth="2.5" /><path d="M40 12h11l9 9v7H40z" fill="#fff" stroke="#2a1a14" strokeWidth="2.5" strokeLinejoin="round" /><rect x="6" y="19" width="30" height="5" fill="#fff" /><circle cx="15" cy="31" r="5.500" fill="#2a1a14" /><circle cx="48" cy="31" r="5.500" fill="#2a1a14" /><circle cx="15" cy="31" r="2" fill="#fff" /><circle cx="48" cy="31" r="2" fill="#fff" /></svg>
          </div>
          <ol className="grid gap-10 pl-16 md:grid-cols-3 md:gap-8 md:pl-0 md:pt-16">
            {STEPS.map(([t, d], i) => (
              <li key={t} style={{ transform: `translateY(calc((1 - clamp(0, (var(--p,0) - ${i * 0.3}) * 6, 1)) * 18px))`, transition: "transform .5s cubic-bezier(.2,.8,.2,1)" }}>
                <p className="disp text-[3rem] text-[var(--red)]">{i + 1}.</p>
                <h3 className="mt-1 text-[1.4rem] font-extrabold leading-tight">{t}</h3>
                <p className="mt-2 max-w-[34ch] text-[var(--mute)]">{d}</p>
              </li>
            ))}
          </ol>
        </div>
        <a href="#mikor" className="btn btn-red mt-12" data-track="mikor_jon_hogyan">Mikor jön hozzám?</a>
      </div>
    </section>
  );
}

function Eredet() {
  const ref = useProgress<HTMLElement>(0.75, 0.2);
  return (
    <section ref={ref} id="eredet" className="py-20 md:py-28">
      <div className="wrap2 grid items-center gap-10 md:grid-cols-2">
        {/* the van's cold-room doors open with scroll */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-[var(--ink)] shadow-[0_8px_0_var(--ink)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stefri/pult.webp" alt="A mozgóbolt hűtött pultja: virslik, kolbászok, sonkák és felvágottak" loading="lazy" width={1400} height={1050} className="h-full w-full object-cover" />
          {[0, 1].map((s) => (
            <div key={s} aria-hidden className={`absolute inset-y-0 ${s ? "right-0 border-l-2" : "left-0 border-r-2"} w-1/2 border-[var(--ink)] bg-[#fffdf7]`} style={{ transform: `translateX(calc(var(--p,1) * ${s ? "" : "-"}101%))` }}>
              <span className={`absolute top-1/2 h-16 w-2 -translate-y-1/2 rounded-full bg-[var(--ink)] ${s ? "left-3" : "right-3"}`} />
              <span className="absolute inset-x-0 bottom-0 h-3 bg-[var(--green)]" /><span className="absolute inset-x-0 bottom-3 h-3 bg-[var(--red)]" />
            </div>
          ))}
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--green)]">Honnan jön</p>
          <h2 className="disp text-[clamp(2.2rem,5.4vw,4.2rem)]">Burgenlandból, közvetítő nélkül.</h2>
          <p className="mt-4 max-w-[46ch]">A húskészítményeket közvetlenül az osztrák gyártótól, a Stefri Frischeteamtől hozzuk, hetente kétszer. Kiváló minőségű sertés- és marhahúsból készülnek.</p>
          <ul className="mt-6 grid gap-3 font-bold">
            <li className="flex gap-3"><span className="text-[var(--red)]">●</span>2014 óta járjuk a környéket</li>
            <li className="flex gap-3"><span className="text-[var(--red)]">●</span>Közel 100 településen állunk meg</li>
            <li className="flex gap-3"><span className="text-[var(--red)]">●</span>Hetente kétszer friss áru a gyártótól</li>
          </ul>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stefri/stefri-frischeteam.png" alt="Stefri Frischeteam" width={150} height={109} loading="lazy" className="mt-7 h-16 w-auto" />
        </div>
      </div>
    </section>
  );
}

function Gyik() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="gyik" className="bg-[var(--paper2)] py-20 md:py-28">
      <div className="wrap2">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--red2)]">Gyakori kérdések</p>
        <h2 className="disp max-w-[14ch] text-[clamp(2.2rem,5.4vw,4.2rem)]">Árcédulák, válaszokkal.</h2>
        <p className="mt-3 text-[var(--mute)]">Koppints egy cédulára, megfordul.</p>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ.map(([q, a], i) => (
            <button key={q} className="flip relative" aria-expanded={open === i} onClick={() => { setOpen(open === i ? null : i); track("gyik", { q }); }} style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5, -1][i]}deg)` }}>
              <span className="hole" aria-hidden />
              <span className="flip-in block">
                <span className="flip-f"><span className="text-sm font-bold text-[var(--red)]">{String(i + 1).padStart(2, "0")}</span><span className="text-[1.3rem] font-extrabold leading-tight">{q}</span><span className="text-sm font-bold text-[var(--mute)]">Megfordítom ↻</span></span>
                <span className="flip-b"><span className="text-[1rem] leading-snug">{a}</span><span className="text-sm font-bold text-[var(--must)]">Vissza ↻</span></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Kapcsolat() {
  return (
    <section id="kapcsolat" className="bg-[var(--red)] py-20 text-white md:py-28">
      <div className="wrap2">
        <h2 className="disp text-[clamp(2.4rem,7vw,5.6rem)]">Rendelés, kérdés? Hívj.</h2>
        <a href={`tel:${PHONE_TEL}`} data-track="hivas" className="disp mt-6 block w-max max-w-full text-[clamp(2rem,8.4vw,6.4rem)] underline decoration-[var(--must)] decoration-[.08em] underline-offset-[.12em]">{PHONE}</a>
        <p className="mt-3 text-white/90">Második szám: <a className="font-bold underline" href={`tel:${PHONE2_TEL}`} data-track="hivas">{PHONE2}</a>. Mindkettő WhatsAppon is elérhető.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={wa("Jó napot! Érdeklődnék.")} target="_blank" rel="noopener" className="btn btn-white" data-track="whatsapp"><Wa />WhatsApp</a>
          <a href={MESSENGER} target="_blank" rel="noopener" className="btn btn-white" data-track="messenger">Messenger</a>
          <a href={`mailto:${EMAIL}`} className="btn btn-white" data-track="email">E-mail</a>
          <a href={FB} target="_blank" rel="noopener" className="btn btn-white" data-track="facebook">Facebook: heti akciók</a>
        </div>
      </div>
    </section>
  );
}

export function Stefri() {
  const [bar, setBar] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    const click = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]"); if (el) track(el.dataset.track!); };
    const scroll = () => setBar(scrollY > innerHeight * 2.6);
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const cart = (e: Event) => setN((e as CustomEvent<number>).detail);
    addEventListener("sf:cart", cart);
    document.addEventListener("click", click);
    addEventListener("scroll", scroll, { passive: true });
    return () => { document.removeEventListener("click", click); removeEventListener("scroll", scroll); removeEventListener("sf:cart", cart); };
  }, []);
  return (
    <div className="sf pb-[4.5rem] md:pb-0">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="stripe" />
        <div className="wrap2 mt-2 flex items-center justify-between rounded-2xl border-2 border-[var(--ink)] bg-white px-3 py-2 shadow-[0_4px_0_var(--ink)]">
          <a href="#top" className="flex items-center gap-2 leading-none" aria-label="Stefri Minőségi húskészítmények Ausztriából, a lap tetejére">
            <span className="disp rounded-md bg-[var(--red)] px-2 py-1 text-[1.05rem] text-white">Stefri</span>
            <span className="text-[.82rem] font-extrabold leading-tight max-[380px]:hidden">Minőségi húskészítmények<br />Ausztriából</span>
          </a>
          <nav className="hidden items-center gap-6 font-bold md:flex" aria-label="Fő menü">
            <a href="#mikor">Mikor jön?</a><a href="#kinalat">Kínálat és árak</a><a href="#hogyan">Így megy</a><a href="#gyik">Kérdések</a>
          </nav>
          <a href={`tel:${PHONE_TEL}`} className="btn btn-red !min-h-[2.75rem] !px-4 !text-[.95rem] !shadow-none" data-track="hivas"><Phone /><span className="max-sm:hidden">{PHONE}</span><span className="sm:hidden">Hívás</span></a>
        </div>
      </header>
      <main>
        <Hero />
        <Finder />
        <Kinalat />
        <Hogyan />
        <Eredet />
        <Gyik />
        <Kapcsolat />
      </main>
      <footer className="bg-[var(--ink)] py-8 text-[var(--paper)]">
        <div className="wrap2 flex flex-wrap items-center justify-between gap-4 text-sm">
          <p>Minőségi húskészítmények Ausztriából · mozgóbolt 2014 óta</p>
          <p className="opacity-80">Koncepcióterv, nem hivatalos oldal. Készítette: <a className="font-bold underline" href="/">HRVT</a></p>
        </div>
      </footer>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t-2 border-[var(--ink)] bg-white p-2 transition-transform duration-300 md:hidden ${bar ? "" : "translate-y-full"}`}>
        <a href={`tel:${PHONE_TEL}`} className="btn btn-red !shadow-none" data-track="hivas"><Phone />Hívás</a>
        {n ? <a href="#cetli" className="btn btn-green !shadow-none" data-track="cetli_sav">Cetli ({n})</a> : <a href="#mikor" className="btn btn-white !shadow-none" data-track="mikor_jon_sav">Mikor jön?</a>}
      </div>
    </div>
  );
}
