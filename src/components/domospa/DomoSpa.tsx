"use client";
import { cloneElement, Fragment, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ADDRESS, CATS, EMAIL, FAQ, FB, IG, MAP, PHONE, PHONE2, PHONE2_TEL, PHONE_TEL, type P } from "./data";

const ft = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
function track(name: string, props?: Record<string, unknown>) {
  const w = window as unknown as { va?: (e: string, p: unknown) => void; plausible?: (n: string, o?: unknown) => void; gtag?: (...a: unknown[]) => void };
  try { w.va?.("event", { name, ...props }); w.plausible?.(name, { props }); w.gtag?.("event", name, props); } catch {}
}
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
function useProgress<E extends HTMLElement>(from = 0.9, to = 0.35) {
  const ref = useRef<E>(null);
  useEffect(() => {
    const el = ref.current!; let raf = 0;
    const upd = () => { raf = 0; const r = el.getBoundingClientRect(), vh = innerHeight; el.style.setProperty("--p", Math.min(1, Math.max(0, (vh * from - r.top) / (vh * (from - to) + r.height * 0.5))).toFixed(4)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [from, to]);
  return ref;
}
function Roll({ value }: { value: number }) {
  const s = ft(value);
  return (<span aria-label={`${s} forint`} role="text">{s.split("").map((c, i) => /\d/.test(c) ? <span key={s.length - i} className="digit" aria-hidden><span style={{ transform: `translateY(-${Number(c) * 10}%)` }}>{"0123456789".split("").map((d) => <i key={d}>{d}</i>)}</span></span> : <span key={s.length - i} aria-hidden>&nbsp;</span>)}</span>);
}
const Arrow = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const cat = (id: string) => CATS.find((c) => c.id === id)!;
const min = (id: string) => Math.min(...cat(id).items.map((i) => i.p));

const SEASONS = ["Tél", "Tavasz", "Nyár", "Ősz"];
function Hero({ bind }: { bind: (sec: HTMLElement, host: HTMLElement, canvas: HTMLCanvasElement) => void }) {
  const sec = useRef<HTMLElement>(null), host = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => { bind(sec.current!, host.current!, cv.current!); }, [bind]);
  const cap = "cap left-5 right-5 top-[5.8rem] md:left-[5%] md:right-auto md:top-[9rem] md:w-[38%]";
  const big = "serif text-[clamp(2.5rem,9.6vw,5.4rem)]";
  return (
    <section ref={sec} id="top" className="relative" style={{ height: "480svh" }}>
      <div ref={host} data-st="0" className="sky sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="scrim" />
        <div className={`${cap} cap-0`}>
          <p className="eyebrow mb-4 text-[#bfe9ff]">Tél · jakuzzi {ft(min("jakuzzi"))} Ft-tól</p>
          <h1 className={big}><T>Odakint hó. <em>Odabent gőz.</em></T></h1>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] text-white/85">Jakuzzi, szauna, medence, grill és pergola egy helyen, Szombathelyen. Egész éves feltöltődés a saját kertedben.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#kert" className="btn btn-cream" data-track="tervezo_hero">Összerakom a kertem <Arrow /></a>
            <a href="#bemutatoterem" className="btn btn-line" data-track="bemutatoterem_hero">Megnézem élőben</a>
          </div>
        </div>
        <div className={`${cap} cap-1`}>
          <p className="eyebrow mb-4 text-[#ffd3e2]">Tavasz · pergola {ft(1549900)} Ft-tól</p>
          <p className={big}><T>Nyílik <em>a pergola.</em></T></p>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] text-white/85">A bioklimatikus pergola lamellái annyi napot engednek be, amennyit kérsz. Este a LED világít.</p>
        </div>
        <div className={`${cap} cap-2`}>
          <p className="eyebrow mb-4 text-[#ffe9a8]">Nyár · grill {ft(min("grill"))} Ft-tól · swimspa {ft(min("medence"))} Ft-tól</p>
          <p className={big}><T>Ég a grill, <em>hűs a víz.</em></T></p>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] text-white/85">Gázgrill vagy kemence a vacsorához, swimspa az úszáshoz. A kert a nappali lesz.</p>
        </div>
        <div className={`${cap} cap-3`}>
          <p className="eyebrow mb-4 text-[#ffd0a3]">Ősz · szauna {ft(min("szauna"))} Ft-tól</p>
          <p className={big}><T>Hull a levél. <em>Fűt a szauna.</em></T></p>
          <p className="mt-5 max-w-[34ch] text-[1.1rem] text-white/85">Finn, infra vagy kombinált, típusméretben vagy egyedi kivitelben.</p>
          <a href="#kert" className="btn btn-cream mt-6" data-track="tervezo_hero2">Összerakom a kertem <Arrow /></a>
        </div>
        <div className="dial bottom-6 left-5 md:left-[5%]" aria-hidden>{SEASONS.map((s) => <i key={s} />)}</div>
        <p className="eyebrow absolute bottom-10 left-5 text-white/80 md:left-[5%]" aria-hidden>Görgess, telik az év</p>
      </div>
    </section>
  );
}

type Pick = { tub: number; perg: number; sau: number; gr: number };
function Planner() {
  const [pk, setPk] = useState<Pick>({ tub: 0, perg: 0, sau: -1, gr: -1 });
  const tubs = cat("jakuzzi").items, pergs = cat("pergola").items.slice(0, 2), saus = cat("szauna").items, grs = cat("grill").items;
  const chosen: P[] = [tubs[pk.tub], pergs[pk.perg], saus[pk.sau], grs[pk.gr]].filter(Boolean);
  const total = chosen.reduce((a, c) => a + c.p, 0);
  const body = `Jó napot!\n\nAjánlatot szeretnék kérni az alábbi összeállításra:\n${chosen.map((c) => `- ${c.n} (${ft(c.p)} Ft)`).join("\n")}\nTájékoztató végösszeg: ${ft(total)} Ft\n\nNevem: \nTelepülés: \nTelefonszám: `;
  const Row = ({ label, items, v, k, none }: { label: string; items: P[]; v: number; k: keyof Pick; none?: boolean }) => (
    <div>
      <p className="mb-1 text-sm font-extrabold text-[var(--mute2)]">{label}</p>
      <div className="pick" role="group" aria-label={label}>
        {none && <button aria-pressed={v === -1} onClick={() => setPk((p) => ({ ...p, [k]: -1 }))}><b>Most nem kérek</b><span>0 Ft</span></button>}
        {items.map((it, i) => <button key={it.n} aria-pressed={v === i} onClick={() => { setPk((p) => ({ ...p, [k]: i })); track("tervezo_valasztas", { k, n: it.n }); }}><b>{it.n}</b><span>{ft(it.p)} Ft</span></button>)}
      </div>
    </div>
  );
  return (
    <section id="kert" className="on-cream bg-[var(--cream)] py-20 text-[var(--ink)] md:py-28">
      <div className="wrapx">
        <p className="eyebrow mb-4 text-[var(--water2)]">Kerttervező</p>
        <h2 data-t className="serif max-w-[14ch] text-[clamp(2.4rem,7vw,5rem)]"><T>Rakd össze <em>a saját kertedet.</em></T></h2>
        <p className="mt-5 max-w-[50ch] text-[var(--mute2)]">Válaszd ki, mi kerüljön a teraszra. A rajz és a végösszeg azonnal frissül, az összeállítást pedig egy gombbal elküldheted ajánlatkérésként.</p>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-14">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-5">
            <Row label="Jakuzzi" items={tubs} v={pk.tub} k="tub" none />
            <Row label="Pergola" items={pergs} v={pk.perg} k="perg" none />
            <Row label="Szauna" items={saus} v={pk.sau} k="sau" none />
            <Row label="Grill vagy kemence" items={grs} v={pk.gr} k="gr" none />
          </div>
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="plot" role="img" aria-label={`A kerted felülről: ${chosen.map((c) => c.n).join(", ") || "még üres"}`}>
              <div className="house">Ház</div><div className="deck" />
              <div className={`it ${pk.perg < 0 ? "off" : ""} perg`} style={{ left: "47%", top: "33%", width: pk.perg === 1 ? "42%" : "36%", height: "44%" }}><span className="lbl">Pergola</span></div>
              <div className={`it ${pk.tub < 0 ? "off" : ""}`} style={{ left: "13%", top: "39%", width: "29%", height: "29%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="tubimg" src={tubs[Math.max(0, pk.tub)].img ?? "/domospa/tub-budapest.webp"} alt="" width={520} height={520} loading="lazy" /><span className="lbl">Jakuzzi</span>
              </div>
              <div className={`it ${pk.sau < 0 ? "off" : ""} sau`} style={{ left: "10%", top: "82%", width: pk.sau === 1 ? "24%" : "15%", height: "13%" }}><span className="lbl" style={{ top: "auto", bottom: "100%", transform: "translate(-50%,-.25rem)" }}>Szauna</span></div>
              <div className={`it ${pk.gr < 0 ? "off" : ""} gr`} style={{ left: "72%", top: "84%", width: "13%", height: "8%" }}><span className="lbl" style={{ top: "auto", bottom: "100%", transform: "translate(-50%,-.25rem)" }}>{pk.gr > 1 ? "Kemence" : "Grill"}</span></div>
            </div>
            <div className="mt-6 rounded-[1.4rem] bg-[var(--ink)] p-6 text-[var(--cream)]">
              <p className="eyebrow text-[var(--water)]">Tájékoztató végösszeg</p>
              <p className="serif mt-2 text-[clamp(2.4rem,8vw,3.4rem)] tabular-nums"><Roll value={total} /> <span className="text-[1.2rem]">Ft</span></p>
              {pk.tub >= 0 && pk.perg >= 0 && <p className="mt-3 rounded-xl bg-[var(--water)] px-3 py-2 text-sm font-extrabold text-[var(--ink)]">Jakuzzi és pergola együtt: 10% kedvezmény jár. Az ajánlatban számoljuk ki.</p>}
              {pk.sau >= 0 && <p className="mt-2 text-sm text-[var(--mute)]">A szauna kiszállítása és összeszerelése Vas megyében +80 000 Ft.</p>}
              <div className="mt-5 grid gap-2">
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Ajánlatkérés a kerttervezőből")}&body=${encodeURIComponent(body)}`} aria-disabled={!chosen.length} className={`btn btn-water ${chosen.length ? "" : "pointer-events-none opacity-50"}`} data-track="ajanlatkeres">Ajánlatot kérek erre <Arrow /></a>
                <a href={`tel:${PHONE_TEL}`} className="btn btn-line" data-track="hivas">{PHONE}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalog() {
  const [id, setId] = useState("jakuzzi");
  const c = cat(id);
  return (
    <section id="kinalat" className="py-20 md:py-28">
      <div className="wrapx">
        <p className="eyebrow mb-4 text-[var(--water)]">Kínálat és árak</p>
        <h2 data-t className="serif max-w-[15ch] text-[clamp(2.4rem,7vw,5rem)]"><T>Ami most <em>kedvezménnyel vihető.</em></T></h2>
        <div className="tabs2 mt-9" role="tablist" aria-label="Termékcsoportok">
          {CATS.map((x) => <button key={x.id} role="tab" aria-selected={id === x.id} onClick={() => { setId(x.id); track("kinalat_kategoria", { id: x.id }); }}>{x.name}</button>)}
        </div>
        <ul className="mt-5" key={id}>
          {c.items.map((it, k) => (
            <li key={it.n} className="prow" style={{ "--k": k } as CSSProperties}>
              <div className="flex min-w-0 items-center gap-4">
                {it.img && (/* eslint-disable-next-line @next/next/no-img-element */<img src={it.img} alt="" width={96} height={96} loading="lazy" className="h-16 w-16 flex-none rounded-xl bg-white object-cover" />)}
                <div className="min-w-0"><p className="text-[1.15rem] font-extrabold leading-tight">{it.n}{it.tag && <span className={`tag ${it.tag.startsWith("Bemutató") ? "demo" : ""}`}>{it.tag}</span>}</p>{it.note && <p className="text-sm text-[var(--mute)]">{it.note}</p>}</div>
              </div>
              <div className="text-right">
                <p className="serif text-[1.5rem] tabular-nums">{ft(it.p)} Ft</p>
                {it.was && <p className="text-sm text-[var(--mute)]"><s>{ft(it.was)} Ft</s> <span className="font-extrabold text-[var(--water)]">−{Math.round((1 - it.p / it.was) * 100)}%</span></p>}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[62ch] text-sm text-[var(--mute)]">Az árak a domospa.hu oldalon közzétett akciós árak, a készlet változhat. Kerti bútorok, vízkezelés és kiegészítők a bemutatóteremben.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${PHONE_TEL}`} className="btn btn-water" data-track="hivas">Rákérdezek a készletre</a>
          <a href="#kert" className="btn btn-line" data-track="tervezo_kinalat">Összerakom a kertem</a>
        </div>
      </div>
    </section>
  );
}

function Showroom() {
  const ref = useProgress<HTMLElement>(0.85, 0.3);
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "numeric", minute: "numeric", hour12: false, timeZone: "Europe/Budapest" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const m = Number(p.hour) * 60 + Number(p.minute); setOpen(!["Sat", "Sun"].includes(p.weekday) && m >= 480 && m < 990);
  }, []);
  return (
    <section ref={ref} id="bemutatoterem" className="on-cream bg-[var(--cream)] py-20 text-[var(--ink)] md:py-28">
      <div className="wrapx grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="floor aspect-[3/2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/domospa/showroom.webp" srcSet="/domospa/showroom-800.webp 800w, /domospa/showroom.webp 1500w" sizes="(min-width:1024px) 55vw, 100vw" alt="A domoSPA bemutatóterme: jakuzzik, kerti bútorok és kemence egy világos, üvegfalú térben" loading="lazy" width={1500} height={1000} />
        </div>
        <div>
          <p className="eyebrow mb-4 text-[var(--water2)]">Bemutatóterem · Szombathely</p>
          <h2 data-t className="serif text-[clamp(2.4rem,6.4vw,4.6rem)]"><T>400 m², ahol <em>mindent megnézhetsz.</em></T></h2>
          <p className="mt-5 max-w-[44ch] text-[var(--mute2)]">Jakuzzik, szaunák, grillek és kerti bútorok egy helyen. Ülj bele, nyisd ki, hasonlítsd össze, és csak utána dönts.</p>
          <dl className="mt-7 grid gap-4">
            <div><dt className="eyebrow text-[var(--mute2)]">Cím</dt><dd><a className="text-[1.15rem] font-extrabold underline decoration-[var(--water2)] decoration-2 underline-offset-4" href={MAP} target="_blank" rel="noopener" data-track="utvonal">{ADDRESS}</a></dd></div>
            <div><dt className="eyebrow text-[var(--mute2)]">Nyitvatartás</dt><dd className="font-extrabold">Hétfőtől péntekig 8:00–16:30{open !== null && <span className={`ml-3 inline-block rounded-full px-3 py-1 text-sm ${open ? "bg-[var(--water)]" : "bg-[var(--cream2)]"}`}>{open ? "Most nyitva" : "Most zárva"}</span>}<br /><span className="font-semibold text-[var(--mute2)]">Szombaton és vasárnap zárva</span></dd></div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={MAP} target="_blank" rel="noopener" className="btn btn-dark" data-track="utvonal">Útvonalat kérek <Arrow /></a>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-line" data-track="hivas">{PHONE}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fire() {
  return (
    <section id="domofire" className="ember py-20 md:py-24">
      <div className="wrapx grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow mb-4 text-[#ffb070]">Domofire</p>
          <h2 data-t className="serif text-[clamp(2.4rem,7vw,5rem)]"><T>Ha a tűz <em className="glow">is kell.</em></T></h2>
          <p className="mt-5 max-w-[44ch] text-[#e9d6c8]">Épített cserépkályhák és kandallók, valamint mobil kandallók, kályhák és kemencék a testvérmárkánktól.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <a href="https://domofire.hu" target="_blank" rel="noopener" className="btn btn-cream" data-track="domofire">domofire.hu</a>
          <a href="https://domofireshop.hu" target="_blank" rel="noopener" className="btn btn-line" data-track="domofireshop">domofireshop.hu</a>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="gyik" className="on-cream bg-[var(--cream)] py-20 text-[var(--ink)] md:py-28">
      <div className="wrapx grid gap-10 lg:grid-cols-[1fr_1.35fr]">
        <div><p className="eyebrow mb-4 text-[var(--water2)]">Gyakori kérdések</p><h2 data-t className="serif max-w-[10ch] text-[clamp(2.4rem,6.4vw,4.4rem)]"><T>Mielőtt <em>elindulsz.</em></T></h2></div>
        <div>{FAQ.map(([q, a], i) => (
          <div key={q} className="qa" data-open={open === i}>
            <button aria-expanded={open === i} aria-controls={`dsa${i}`} onClick={() => { setOpen(open === i ? null : i); track("gyik", { q }); }}><span>{q}</span><span className="drop" aria-hidden /></button>
            <div className="ans" id={`dsa${i}`} role="region"><div><p>{a}</p></div></div>
          </div>))}
        </div>
      </div>
    </section>
  );
}

export function DomoSpa() {
  const [bar, setBar] = useState(false);
  const r = useRef<{ sec?: HTMLElement; host?: HTMLElement; cv?: HTMLCanvasElement }>({});
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const click = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]"); if (el) track(el.dataset.track!); };
    const scroll = () => setBar(scrollY > innerHeight * 3.9);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".ds [data-t]").forEach((el) => io.observe(el));
    document.addEventListener("click", click); addEventListener("scroll", scroll, { passive: true });
    let api: { destroy: () => void } | null = null, dead = false, st = -1;
    const start = () => import("./garden3d").then((m) => {
      const { sec, host, cv } = r.current; if (dead || !sec || !host || !cv) return;
      try { api = m.mount({ canvas: cv, hero: sec, host, onFrame: ({ stage, top, bottom }) => { if (stage !== st) { st = stage; host.setAttribute("data-st", String(stage)); } host.style.setProperty("--sky-top", top); host.style.setProperty("--sky-bot", bottom); } }); } catch { /* no WebGL: the sky gradient and the copy remain */ }
    });
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => start(), { timeout: 1000 }); else setTimeout(start, 250);
    return () => { dead = true; api?.destroy(); io.disconnect(); document.removeEventListener("click", click); removeEventListener("scroll", scroll); };
  }, []);
  return (
    <div className="ds pb-[4.6rem] md:pb-0">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrapx mt-3 flex items-center justify-between rounded-full bg-[rgba(243,239,230,.94)] px-3 py-2 text-[var(--ink)] shadow-[0_10px_30px_-18px_rgba(0,0,0,.6)] backdrop-blur">
          <a href="#top" className="pl-2" aria-label="domoSPA, a lap tetejére">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/domospa/logo.png" alt="domoSPA" width={310} height={120} className="h-9 w-auto" /></a>
          <nav className="hidden items-center gap-6 font-extrabold lg:flex" aria-label="Fő menü"><a href="#kert">Kerttervező</a><a href="#kinalat">Kínálat és árak</a><a href="#bemutatoterem">Bemutatóterem</a><a href="#gyik">Kérdések</a></nav>
          <a href={`tel:${PHONE_TEL}`} className="btn btn-dark !min-h-[2.75rem] !px-5 !text-[.95rem]" data-track="hivas"><span className="max-sm:hidden">{PHONE}</span><span className="sm:hidden">Hívás</span></a>
        </div>
      </header>
      <main>
        <Hero bind={(sec, host, cv) => { r.current = { sec, host, cv }; }} />
        <Planner />
        <Catalog />
        <Showroom />
        <Fire />
        <Faq />
        <section id="kapcsolat" className="py-20 md:py-28">
          <div className="wrapx">
            <p className="eyebrow mb-4 text-[var(--water)]">Kapcsolat</p>
            <h2 data-t className="serif text-[clamp(2.6rem,9vw,6.4rem)]"><T>Gyere el, <em>ülj bele.</em></T></h2>
            <a href={`tel:${PHONE_TEL}`} data-track="hivas" className="serif mt-7 block w-max max-w-full text-[clamp(2rem,8vw,4.6rem)] underline decoration-[var(--water)] decoration-[.06em] underline-offset-[.14em]">{PHONE}</a>
            <p className="mt-4 text-[var(--mute)]">Vezetékes: <a className="font-extrabold text-[var(--cream)] underline" href={`tel:${PHONE2_TEL}`} data-track="hivas">{PHONE2}</a> · <a className="font-extrabold text-[var(--cream)] underline" href={`mailto:${EMAIL}`} data-track="email">{EMAIL}</a></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={MAP} target="_blank" rel="noopener" className="btn btn-water" data-track="utvonal">{ADDRESS}</a>
              <a href={FB} target="_blank" rel="noopener" className="btn btn-line" data-track="facebook">Facebook</a>
              <a href={IG} target="_blank" rel="noopener" className="btn btn-line" data-track="instagram">Instagram</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-8"><div className="wrapx flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--mute)]"><p>domoSPA · jakuzzi, szauna, medence, grill, pergola · Szombathely</p><p>Koncepcióterv, nem hivatalos oldal. Készítette: <a className="font-bold text-[var(--cream)] underline" href="/">HRVT</a></p></div></footer>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-3 border-t border-white/15 bg-[rgba(15,33,29,.95)] px-4 py-2 backdrop-blur transition-transform duration-300 md:hidden ${bar ? "" : "translate-y-full"}`}>
        <a href={`tel:${PHONE_TEL}`} className="btn btn-water whitespace-nowrap" data-track="hivas">Hívás</a>
        <a href={MAP} target="_blank" rel="noopener" className="btn btn-cream whitespace-nowrap" data-track="utvonal">Útvonal</a>
      </div>
    </div>
  );
}
