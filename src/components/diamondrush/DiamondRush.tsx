"use client";
import { cloneElement, Fragment, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CITY, EMAIL, FB, IG, PHONE, PHONE_TEL } from "./data";

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
function useProgress<E extends HTMLElement>(from = 0.92, to = 0.3, extra?: (el: E, p: number) => void) {
  const ref = useRef<E>(null);
  useEffect(() => {
    const el = ref.current!; let raf = 0;
    const upd = () => { raf = 0; const r = el.getBoundingClientRect(), vh = innerHeight; const p = Math.min(1, Math.max(0, (vh * from - r.top) / (vh * (from - to) + r.height * 0.5))); el.style.setProperty("--p", p.toFixed(4)); extra?.(el, (vh - r.top) / (vh + r.height)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);
  return ref;
}
const Gem = ({ className = "" }: { className?: string }) => (<svg viewBox="0 0 24 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d="M6 1h12l5 6-11 12L1 7z" /><path d="M1 7h22M6 1l3 6 3-6 3 6 3-6M9 7l3 12 3-12" /></svg>);
const Crown = ({ className = "" }: { className?: string }) => (<svg viewBox="0 0 48 30" className={`crown ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden><path pathLength={1} d="M4 27 2 9l11 9L24 3l11 15 11-9-2 18z" /><path pathLength={1} d="M5 27h38" /></svg>);

function Hero({ bind }: { bind: (r: { sec: HTMLElement; caps: HTMLElement; ggc: HTMLElement; edge: HTMLElement }) => void }) {
  const sec = useRef<HTMLElement>(null), caps = useRef<HTMLDivElement>(null), ggc = useRef<HTMLDivElement>(null), edge = useRef<HTMLDivElement>(null);
  useEffect(() => { bind({ sec: sec.current!, caps: caps.current!, ggc: ggc.current!, edge: edge.current! }); }, [bind]);
  return (
    <section ref={sec} id="top" data-st="0" className="relative bg-[var(--ink)]" style={{ height: "470svh" }}>
      {/* layer 1: the two worlds */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="world bg-[radial-gradient(90%_70%_at_20%_10%,#3a0a1e_0%,#0b0709_60%)]">
          <p className="rush bigword bottom-[-2vw] left-[-1vw] text-[34vw] leading-none text-transparent opacity-40 md:text-[23vw]" style={{ WebkitTextStroke: "2px #ff2e7e" }} aria-hidden>RUSH</p>
          <div className="drphoto lit pinkonly absolute bottom-0 left-0 h-[34%] w-full md:bottom-auto md:left-auto md:right-[4%] md:top-[11%] md:h-[78%] md:w-[38%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/diamondrush/stadium.webp" alt="Cheerleader pomponokkal, kitárt karral a stadion gyepén" width={899} height={814} className="bw h-full w-full object-cover object-[50%_30%]" />
          </div>
        </div>
        <div ref={ggc} className="world world-ggc">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_90%,#f1dfb6_0%,rgba(251,243,234,0)_60%)]" />
          <div className="lit goldonly absolute left-0 top-[4.6rem] h-[30%] w-full md:left-[4%] md:top-[11%] md:h-[78%] md:w-[38%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/diamondrush/floor.webp" alt="Táncos a stadion gyepén, mosolyogva, pomponnal a kezében" width={1179} height={1399} className="bw h-full w-full object-cover object-[60%_55%]" />
          </div>
          <div className="absolute bottom-[5.2rem] left-5 right-5 md:bottom-auto md:left-auto md:right-[5%] md:top-[9.5rem] md:w-[36%]">
            <Crown className="mb-2 h-8 w-auto text-[var(--gold2)]" />
            <p className="ggc text-[clamp(2.7rem,11vw,5.6rem)] text-[var(--gold2)]">Golden Girls Club</p>
          </div>
        </div>
        <div ref={edge} className="edge" aria-hidden />
      </div>
      {/* layer 2 (above the WebGL canvas): the copy */}
      <div ref={caps} data-st="0" className="pointer-events-none sticky top-0 z-40 -mt-[100svh] h-[100svh] overflow-hidden">
        <div className="cap cap-0 left-5 right-5 top-[5.6rem] md:left-[5%] md:right-auto md:top-[8.5rem] md:w-[37%]">
          <p className="eyebrow mb-4 flex items-center gap-2 text-[var(--pink)]"><Gem className="h-4 w-auto" />Szombathely, készülj!</p>
          <h1 className="rush text-[clamp(2.7rem,11.5vw,5.8rem)]"><T>Új név. Új brand. <span className="text-[var(--pink)]">Új energiák.</span></T></h1>
          <p className="mt-5 hidden max-w-[34ch] text-[var(--mute)] md:block">A Crushers pálya széléről indultunk. Most két saját márkával megyünk tovább: Diamond Rush és Golden Girls Club.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#csatlakozz" className="btn btn-pink" data-track="jelentkezes_hero">Táncolnék veletek</a>
            <a href="#csatlakozz" className="btn btn-line" data-track="fellepes_hero" data-mode="fellepes">Fellépést kérek</a>
          </div>
        </div>
        <div className="cap cap-1 left-5 right-5 top-[5.6rem] md:left-[5%] md:right-auto md:top-[8.5rem] md:w-[37%]">
          <p className="eyebrow mb-4 flex items-center gap-2 text-[var(--pink)]"><Gem className="h-4 w-auto" />Diamond Rush · cheer</p>
          <p className="rush text-[clamp(2.7rem,11.5vw,5.8rem)]"><T>A pálya széléről <span className="text-[var(--pink)]">a reflektorba.</span></T></p>
          <p className="mt-5 max-w-[34ch] text-[var(--mute)]">Diamond Rush néven folytatjuk a cheert: meccsek, szünetek, rendezvények. Pompon, lendület, mosoly.</p>
        </div>
        <div className="cap cap-2 left-5 right-5 top-[calc(30%+5.6rem)] text-[var(--ink)] md:left-auto md:right-[5%] md:top-[25rem] md:w-[36%]">
          <p className="eyebrow mb-3 text-[var(--gold2)]">Egy egészen új világ</p>
          <p className="ggc text-[clamp(1.7rem,6.4vw,2.9rem)]"><T>Nőiesség, önkifejezés, magabiztosság.</T></p>
          <p className="mt-3 max-w-[34ch] text-[#4a3b40]">Itt nem a meccs a főszereplő, hanem te.</p>
        </div>
        <div className="cap cap-3 left-5 right-5 top-[5.6rem] md:left-[5%] md:right-auto md:top-[8.5rem] md:w-[37%]">
          <p className="eyebrow mb-4 text-[var(--pink)]">Két külön brand</p>
          <p className="rush text-[clamp(2.7rem,11.5vw,5.8rem)]"><T>Egy közös <span className="text-[var(--pink)]">szenvedély.</span></T></p>
          <a href="#csatlakozz" className="btn btn-pink mt-6" data-track="jelentkezes_hero2">Te is kipróbálnád?</a>
        </div>
        <p className="eyebrow absolute bottom-5 right-5 text-white mix-blend-difference transition-opacity duration-300 [[data-st='0']_&]:opacity-100 opacity-0" aria-hidden>Görgess ↓</p>
      </div>
    </section>
  );
}

function Manifesto() {
  const ref = useProgress<HTMLElement>(0.8, 0.25);
  const cuts: [string, string, string, string][] = [
    ["polygon(0 0,62% 0,38% 34%,0 28%)", "-60%", "-40%", "-18deg"], ["polygon(62% 0,100% 0,100% 40%,38% 34%)", "70%", "-50%", "22deg"],
    ["polygon(0 28%,38% 34%,56% 66%,0 72%)", "-80%", "10%", "14deg"], ["polygon(38% 34%,100% 40%,100% 70%,56% 66%)", "85%", "5%", "-16deg"],
    ["polygon(0 72%,56% 66%,44% 100%,0 100%)", "-55%", "60%", "20deg"], ["polygon(56% 66%,100% 70%,100% 100%,44% 100%)", "60%", "70%", "-24deg"],
  ];
  return (
    <section ref={ref} id="fejezet" className="relative overflow-hidden py-24 md:py-36">
      <div className="wrapd grid items-center gap-12 md:grid-cols-[1.2fr_.8fr] md:gap-20">
        <div>
          <p className="eyebrow mb-5 flex items-center gap-2 text-[var(--pink)]"><Gem className="h-4 w-auto" />Új fejezet</p>
          <h2 data-t className="rush text-[clamp(2.6rem,8.4vw,6rem)]"><T>Amit szívvel <span className="text-[var(--pink)]">építettünk,</span> visszük tovább.</T></h2>
          <p className="mt-7 max-w-[46ch] text-[1.15rem] text-[#e7dadf]">Hosszú út, rengeteg közös élmény, munka és emlék van mögöttünk. Az amerikaifutball-csapattól különválva, saját névvel és új branddel megyünk tovább.</p>
          <p className="ggc mt-8 text-[clamp(1.6rem,4.4vw,2.4rem)] text-[var(--lgold)]">Ez még csak a kezdet…</p>
        </div>
        <div className="shards mx-auto w-[min(74vw,22rem)]" role="img" aria-label="Táncos fellépés közben, hátravetett fejjel" style={{ "--img": "url(/diamondrush/dance.webp)" } as CSSProperties}>
          {cuts.map(([c, dx, dy, r], i) => <i key={i} style={{ clipPath: c, "--dx": dx, "--dy": dy, "--r": r } as CSSProperties} />)}
        </div>
      </div>
    </section>
  );
}

function Rush() {
  const a = useRef<HTMLParagraphElement>(null), b = useRef<HTMLParagraphElement>(null);
  const ref = useProgress<HTMLElement>(0.75, 0.15, (_, k) => { if (a.current) a.current.style.transform = `translateX(${-k * 38}%) skewX(-6deg)`; if (b.current) b.current.style.transform = `translateX(${-38 + k * 38}%) skewX(-6deg)`; });
  const words = ["Touchdown", "Félidő", "Time-out", "Show"];
  return (
    <section ref={ref} id="diamond-rush" className="relative overflow-hidden bg-[var(--ink2)] py-24 md:py-36">
      <p ref={a} className="tape rush !block text-[clamp(4rem,15vw,12rem)]" aria-hidden>{[...words, ...words].map((w, i) => <span key={i}>{w}</span>)}</p>
      <div className="wrapd relative z-[1] mt-8 grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="rhomb lit pinkonly aspect-[5/6] w-full md:order-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diamondrush/stadium.webp" alt="Cheerleader a stadionban, kezében pomponokkal" loading="lazy" width={899} height={814} className="bw h-full w-full object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-5 flex items-center gap-2 text-[var(--pink)]"><Gem className="h-4 w-auto" />Diamond Rush</p>
          <h2 data-t className="rush text-[clamp(2.6rem,8vw,5.6rem)]"><T>Cheerleader csapat <span className="text-[var(--pink)]">Szombathelyről.</span></T></h2>
          <ul className="mt-8">
            {[["Amerikaifoci-meccsek", "a Crushers mellett továbbra is ott vagyunk a pálya szélén"], ["Kosármeccsek szünetei", "rövid, pörgős koreográfiák a parketten"], ["Rendezvények", "ahol kell a lendület és a látvány"]].map(([t, d]) => (
              <li key={t} className="gig py-4"><p className="text-[1.35rem] font-extrabold">{t}</p><p className="text-[var(--mute)]">{d}</p></li>
            ))}
          </ul>
          <a href="#csatlakozz" className="btn btn-pink mt-8" data-track="fellepes_rush" data-mode="fellepes">Fellépést kérek</a>
        </div>
      </div>
      <p ref={b} className="tape rush !block mt-6 text-[clamp(4rem,15vw,12rem)]" aria-hidden>{[...words, ...words].reverse().map((w, i) => <span key={i}>{w}</span>)}</p>
    </section>
  );
}

function Golden() {
  const ref = useProgress<HTMLElement>(0.8, 0.2, (el, k) => { if (matchMedia("(pointer:fine)").matches) return; el.style.setProperty("--sx", `${20 + Math.sin(k * 7) * 30 + 30}%`); el.style.setProperty("--sy", `${k * 130 - 15}%`); });
  const box = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => { if (e.pointerType !== "mouse" || !box.current) return; const r = box.current.getBoundingClientRect(); ref.current?.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`); ref.current?.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`); };
  return (
    <section ref={ref} id="golden-girls-club" onPointerMove={move} className="on-cream relative overflow-hidden bg-[var(--cream)] py-24 text-[var(--ink)] md:py-36">
      <div className="wrapd grid items-center gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-20">
        <div className="arch lit goldonly mx-auto aspect-[3/4] w-[min(78vw,24rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diamondrush/floor.webp" alt="Mosolygó táncos a gyepen, előtte zöld-fehér pompon" loading="lazy" width={1179} height={1399} className="bw h-full w-full object-cover object-[62%_60%]" />
        </div>
        <div>
          <Crown className="mb-4 h-10 w-auto text-[var(--gold2)]" />
          <p className="eyebrow mb-4 text-[var(--gold2)]">Golden Girls Club · GGC</p>
          <h2 data-t className="ggc text-[clamp(2.2rem,6vw,3.8rem)]"><T>Ahol te vagy a főszereplő.</T></h2>
          <div ref={box} className="mt-8" aria-label="Nőiesség, önkifejezés, magabiztosság" role="group">
            {["Nőiesség", "Önkifejezés", "Magabiztosság"].map((w) => <p key={w} className="ggc spot text-[clamp(2.9rem,11.5vw,7rem)]">{w}</p>)}
          </div>
          <p className="mt-8 max-w-[44ch] text-[#4a3b40]">A Golden Girls Club egy egészen új, különleges világ. Hamarosan megmutatjuk, mi minden van még bennünk. Ha elsőként szeretnél tudni róla, kövess minket.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={IG} target="_blank" rel="noopener" className="btn btn-gold" data-track="instagram">Követem Instagramon</a>
            <a href="#csatlakozz" className="btn bg-[var(--ink)] text-white" data-track="jelentkezes_ggc">Érdekel, szóljatok</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const EXP = ["Még sosem táncoltam", "Táncoltam már", "Van cheer múltam"], WANT = ["Diamond Rush", "Golden Girls Club", "Mindkettő"], KIND = ["Meccs", "Céges esemény", "Városi rendezvény", "Más"];
function Join({ end }: { end: (el: HTMLElement, slot: HTMLElement) => void }) {
  const ref = useRef<HTMLElement>(null), slot = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"tanc" | "fellepes">("tanc");
  const [name, setName] = useState(""), [exp, setExp] = useState(0), [want, setWant] = useState(2), [kind, setKind] = useState(0), [when, setWhen] = useState("");
  useEffect(() => {
    end(ref.current!, slot.current!);
    const click = (e: MouseEvent) => { const a = (e.target as HTMLElement).closest<HTMLElement>('a[href="#csatlakozz"]'); if (a) setMode(a.dataset.mode === "fellepes" ? "fellepes" : "tanc"); };
    document.addEventListener("click", click); return () => document.removeEventListener("click", click);
  }, [end]);
  const subject = mode === "tanc" ? "Jelentkezés a csapatba" : "Fellépés kérése";
  const body = mode === "tanc"
    ? `Sziasztok!\n\nSzeretnék kipróbálni egy edzést.\nNevem: ${name}\nTapasztalat: ${EXP[exp]}\nEz érdekel: ${WANT[want]}\nTelefonszámom: `
    : `Sziasztok!\n\nFellépést szeretnék kérni.\nNevem / szervezet: ${name}\nEsemény: ${KIND[kind]}\nIdőpont és helyszín: ${when}\nTelefonszámom: `;
  const Chips = ({ opts, v, set, label }: { opts: string[]; v: number; set: (i: number) => void; label: string }) => (
    <div><p className="mb-3 text-sm font-bold opacity-80">{label}</p><div className="flex flex-wrap gap-2" role="group" aria-label={label}>{opts.map((o, i) => <button key={o} className="chip" aria-pressed={v === i} onClick={() => set(i)}>{o}</button>)}</div></div>
  );
  return (
    <section ref={ref} id="csatlakozz" data-mode={mode} className={`flip relative py-24 md:py-36 ${mode === "fellepes" ? "on-cream" : ""}`}>
      <div ref={slot} aria-hidden className="mx-auto mb-8 h-32 w-32 md:absolute md:right-[9%] md:top-20 md:mb-0 md:h-48 md:w-48" />
      <div className="wrapd grid gap-12 md:grid-cols-[1.1fr_.9fr] md:gap-16">
        <div>
          <div className="tabs mb-9" role="group" aria-label="Miért írsz?">
            <button aria-pressed={mode === "tanc"} onClick={() => { setMode("tanc"); track("urlap_mod", { mode: "tanc" }); }}>Táncolnék</button>
            <button aria-pressed={mode === "fellepes"} onClick={() => { setMode("fellepes"); track("urlap_mod", { mode: "fellepes" }); }}>Fellépést kérnék</button>
          </div>
          <h2 data-t className={mode === "tanc" ? "rush text-[clamp(2.5rem,8vw,5.6rem)]" : "ggc text-[clamp(2.4rem,7vw,4.6rem)]"}><T>{mode === "tanc" ? "Te is kipróbálnád magad nálunk?" : "Hozzuk a hangulatot az eseményedre."}</T></h2>
          <p className="mt-5 max-w-[42ch] opacity-80">{mode === "tanc" ? "Bátran csatlakozz, és légy része annak, ami most kezdődik. Írd meg pár kattintással, honnan indulsz." : "Írd meg, milyen eseményre és mikorra kérnél fellépést, és visszajelzünk."}</p>
          <div className="mt-9 grid gap-7">
            <div><label htmlFor="dr-name" className="mb-1 block text-sm font-bold opacity-80">{mode === "tanc" ? "Neved" : "Neved vagy a szervezet neve"}</label><input id="dr-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ide írd" /></div>
            {mode === "tanc" ? (<><Chips label="Táncoltál már?" opts={EXP} v={exp} set={setExp} /><Chips label="Melyik világ érdekel?" opts={WANT} v={want} set={setWant} /></>) : (<><Chips label="Milyen esemény?" opts={KIND} v={kind} set={setKind} /><div><label htmlFor="dr-when" className="mb-1 block text-sm font-bold opacity-80">Időpont és helyszín</label><input id="dr-when" className="field" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="pl. március 14., sportcsarnok" /></div></>)}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} className={`btn ${mode === "tanc" ? "btn-pink" : "btn-gold"}`} data-track={mode === "tanc" ? "jelentkezes_email" : "fellepes_email"}>Elküldöm e-mailben</a>
            <a href={`tel:${PHONE_TEL}`} className={`btn ${mode === "tanc" ? "btn-line" : "bg-[var(--ink)] text-white"}`} data-track="hivas">{PHONE}</a>
          </div>
        </div>
        <div className="self-end md:pb-2 md:pt-56">
          <div className={`lit ${mode === "tanc" ? "pinkonly" : "goldonly"} aspect-[5/3] w-full`} style={{ clipPath: "polygon(8% 0,100% 0,92% 100%,0 100%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/diamondrush/coach.webp" alt="Kovács Ildikó, a csapat edzője mosolyog, mögötte pompon" loading="lazy" width={1179} height={700} className="bw h-full w-full object-cover object-[20%_30%]" />
          </div>
          <p className="mt-4 text-[1.3rem] font-extrabold">Kovács Ildikó</p>
          <p className="eyebrow opacity-70">Edző</p>
          <dl className="mt-8 grid gap-4">
            <div><dt className="eyebrow opacity-60">Hol</dt><dd className="font-bold">{CITY}</dd></div>
            <div><dt className="eyebrow opacity-60">E-mail</dt><dd><a className="font-bold underline underline-offset-4" href={`mailto:${EMAIL}`} data-track="email">{EMAIL}</a></dd></div>
            <div><dt className="eyebrow opacity-60">Kövess</dt><dd className="flex gap-5 font-bold"><a className="underline underline-offset-4" href={IG} target="_blank" rel="noopener" data-track="instagram">Instagram</a><a className="underline underline-offset-4" href={FB} target="_blank" rel="noopener" data-track="facebook">Facebook</a></dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function DiamondRush() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [bar, setBar] = useState(false);
  const r = useRef<{ sec?: HTMLElement; caps?: HTMLElement; ggc?: HTMLElement; edge?: HTMLElement; end?: HTMLElement; slot?: HTMLElement }>({});
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const click = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]"); if (el) track(el.dataset.track!); };
    const scroll = () => setBar(scrollY > innerHeight * 3.9);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".dr [data-t]").forEach((el) => io.observe(el));
    document.addEventListener("click", click); addEventListener("scroll", scroll, { passive: true });
    let api: { destroy: () => void } | null = null, dead = false, st = -1;
    const start = () => import("./gem3d").then((m) => {
      const { sec, caps, ggc, edge, end, slot } = r.current;
      if (dead || !sec || !caps || !ggc || !edge || !end || !slot) return;
      try {
        api = m.mount({
          canvas: canvas.current!, hero: sec, end, slot,
          onFrame: ({ stage, cx, cy, nx, ny }) => {
            if (stage !== st) { st = stage; caps.setAttribute("data-st", String(stage)); sec.setAttribute("data-st", String(stage)); }
            const dx = -ny, dy = nx, L = 3, P = (x: number, y: number) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
            ggc.style.setProperty("--clip", `polygon(${P(cx + dx * L, cy + dy * L)},${P(cx - dx * L, cy - dy * L)},${P(cx - dx * L + nx * L, cy - dy * L + ny * L)},${P(cx + dx * L + nx * L, cy + dy * L + ny * L)})`);
            edge.style.transform = `translate(${cx * innerWidth}px, ${cy * edge.parentElement!.clientHeight}px) rotate(${Math.atan2(dy * innerHeight, dx * innerWidth)}rad)`;
          },
        });
      } catch { /* no WebGL: the split hero stays as a static composition */ }
    });
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => start(), { timeout: 1000 }); else setTimeout(start, 250);
    return () => { dead = true; api?.destroy(); io.disconnect(); document.removeEventListener("click", click); removeEventListener("scroll", scroll); };
  }, []);
  return (
    <div className="dr pb-[4.6rem] md:pb-0">
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="wrapd flex items-center justify-between py-4 text-white">
          <a href="#top" className="flex items-center gap-2 font-extrabold tracking-wide" aria-label="DR × GGC: Diamond Rush és Golden Girls Club, a lap tetejére"><Gem className="h-5 w-auto" /><span>DR × GGC</span></a>
          <nav className="hidden items-center gap-7 font-bold md:flex" aria-label="Fő menü"><a href="#fejezet">Új fejezet</a><a href="#diamond-rush">Diamond Rush</a><a href="#golden-girls-club">Golden Girls Club</a><a href="#csatlakozz">Csatlakozz</a></nav>
          <a href="#csatlakozz" className="border-2 border-white px-4 py-2 font-extrabold" data-track="jelentkezes_fejlec">Csatlakozz</a>
        </div>
      </header>
      <main>
        <Hero bind={(x) => { r.current = { ...r.current, ...x }; }} />
        <Manifesto />
        <Rush />
        <Golden />
        <Join end={(el, slot) => { r.current.end = el; r.current.slot = slot; }} />
      </main>
      <footer className="border-t border-white/10 bg-[var(--ink)] py-8">
        <div className="wrapd flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--mute)]">
          <p>Golden Girls Club – Diamond Rush Cheer Team · Szombathely</p>
          <p>Koncepcióterv, nem hivatalos oldal. Készítette: <a className="font-bold text-white underline" href="/">HRVT</a></p>
        </div>
      </footer>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-3 border-t border-white/15 bg-[rgba(11,7,9,.94)] px-4 py-2 backdrop-blur transition-transform duration-300 md:hidden ${bar ? "" : "translate-y-full"}`}>
        <a href="#csatlakozz" className="btn btn-pink whitespace-nowrap" data-track="jelentkezes_sav">Táncolnék</a>
        <a href="#csatlakozz" className="btn btn-line whitespace-nowrap" data-track="fellepes_sav" data-mode="fellepes">Fellépés</a>
      </div>
    </div>
  );
}
