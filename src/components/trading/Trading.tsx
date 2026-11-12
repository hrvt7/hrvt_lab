"use client";
import { cloneElement, Fragment, isValidElement, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { WORDMARK } from "@/lib/logo";

/* ---------- helpers ---------- */
const fx = (n: number, d = 2) => n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
function useProgress<E extends HTMLElement | SVGElement>(from = 0.95, to = 0.45) {
  const ref = useRef<E>(null);
  useEffect(() => {
    const el = ref.current!; let raf = 0;
    const upd = () => { raf = 0; const r = el.getBoundingClientRect(), vh = innerHeight; el.style.setProperty("--p", Math.min(1, Math.max(0, (vh * from - r.top) / (vh * (from - to)))).toFixed(4)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [from, to]);
  return ref;
}
const Mark = ({ className = "" }: { className?: string }) => (<svg viewBox={WORDMARK.viewBox} className={className} fill="currentColor" role="img" aria-label="HRVT"><path d={WORDMARK.d} /></svg>);
const Lockup = ({ h = "h-5" }: { h?: string }) => (<span className="flex items-center gap-2"><Mark className={`${h} w-auto`} /><span className="mono border-l border-[var(--line)] pl-2 text-[.7rem] font-bold tracking-[.22em]">TRADING</span></span>);

/** A price line that draws itself as the section scrolls in. */
function Spark({ seed, up = true }: { seed: number; up?: boolean }) {
  const ref = useProgress<SVGSVGElement>();
  const d = useMemo(() => { let y = 30, s = seed; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; let p = "M0 30"; for (let x = 8; x <= 1000; x += 8) { y = Math.min(54, Math.max(6, y + (r() - (up ? 0.54 : 0.46)) * 12)); p += `L${x} ${y.toFixed(1)}`; } return p; }, [seed, up]);
  return <svg ref={ref} className="spark" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden><path d={d} pathLength={1} stroke={up ? "var(--bid)" : "var(--ask)"} /></svg>;
}

/* ---------- a tiny market, simulated in the browser ---------- */
type Inst = { s: string; n: string; p: number; ch: number; w: number };
const SEED: [string, string, number][] = [["HRVT", "HRVT Index", 4820.5], ["KIWI", "Kiwi Energy", 89.12], ["NGHT", "Night Capital", 222.4], ["ORBT", "Orbit Systems", 61.87], ["VASI", "Vasi Minerals", 14.36], ["LQD", "Liquid Labs", 310.2], ["NOVA", "Nova Grid", 47.05], ["FLUX", "Flux Motors", 128.6], ["ALPN", "Alpine Data", 73.4], ["DLTA", "Delta Nine", 9.84], ["RUGS", "Rugis Type", 35.2], ["SGNL", "Signal Works", 156.9]];
function useMarket(ms = 1300) {
  const [m, setM] = useState<Inst[]>(() => SEED.map(([s, n, p], i) => ({ s, n, p, ch: ((i * 37) % 9 - 4) * 0.31, w: 1 + ((i * 53) % 7) / 3 })));
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { if (document.hidden) return; setM((a) => a.map((x) => { const d = (Math.random() - 0.5) * 0.9; const ch = Math.max(-6, Math.min(6, x.ch * 0.92 + d)); return { ...x, ch, p: x.p * (1 + d / 400), w: Math.max(0.6, Math.min(3.4, x.w + (Math.random() - 0.5) * 0.5)) }; })); }, ms);
    return () => clearInterval(id);
  }, [ms]);
  return m;
}

function Tape({ m }: { m: Inst[] }) {
  const row = (k: string) => m.map((x) => (<span key={k + x.s} className="mono flex items-center gap-2 px-5 text-[.8rem]"><b>{x.s}</b><span className="dim">{fx(x.p)}</span><span className={x.ch >= 0 ? "bid" : "ask"}>{x.ch >= 0 ? "▲" : "▼"} {Math.abs(x.ch).toFixed(2)}%</span></span>));
  return (<div className="overflow-hidden border-y border-[var(--line)] bg-[rgba(6,7,10,.8)] py-2 backdrop-blur" aria-hidden><div className="tape">{row("a")}{row("b")}</div></div>);
}

/* ---------- hero ---------- */
function Hero({ bind }: { bind: (sec: HTMLElement, host: HTMLElement, cv: HTMLCanvasElement) => void }) {
  const sec = useRef<HTMLElement>(null), host = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => { bind(sec.current!, host.current!, cv.current!); }, [bind]);
  const cap = "cap left-5 right-5 top-[8.2rem] md:left-[4.5%] md:right-auto md:top-auto md:bottom-[13%] md:w-[46%]";
  const big = "disp text-[clamp(1.9rem,8.4vw,6.2rem)]";
  return (
    <section ref={sec} id="top" className="relative" style={{ height: "520svh" }}>
      <div ref={host} data-st="0" className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--bg)]">
        <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="vig" /><div className="scan" />
        <div className={`${cap} cap-0`}>
          <p className="eyebrow bid mb-4">01 · Árfolyam-táj</p>
          <h1 className={big}><T>A piac nem vonal. <span className="bid">Táj.</span></T></h1>
          <p className="mt-5 max-w-[40ch] text-[1.08rem] text-[var(--dim)]">Minden sor egy instrumentum, minden oszlop egy gyertya. Egy kitalált kereskedési platform, ahol az árfolyamot bejárni lehet, nem csak nézni.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#terminal" className="btn btn-bid">Kipróbálom a terminált</a>
            <a href="#keszult" className="btn btn-line">Hogyan készült</a>
          </div>
        </div>
        <div className={`${cap} cap-1`}>
          <p className="eyebrow ask mb-4">02 · Ajánlati könyv</p>
          <p className={big}><T>Lásd a <span className="ask">mélységet.</span></T></p>
          <p className="mt-5 max-w-[40ch] text-[1.08rem] text-[var(--dim)]">Balra a vételi, jobbra az eladási fal. A könyv itt nem táblázat, hanem szurdok, amin átrepülsz.</p>
        </div>
        <div className={`${cap} cap-2`}>
          <p className="eyebrow bid mb-4">03 · Kereskedési órák</p>
          <p className={big}><T>24 óra. <span className="bid">Egy bolygó.</span></T></p>
          <p className="mt-5 max-w-[40ch] text-[1.08rem] text-[var(--dim)]">Tokió zár, London nyit, New York ébred. A felület követi a napot.</p>
        </div>
        <div className={`${cap} cap-3 md:!bottom-[9%]`}>
          <p className="eyebrow mb-4 text-[var(--bone)]">04 · A jel</p>
          <p className="disp text-[clamp(1.9rem,6.4vw,3.6rem)]"><T>Négyezer elem. <span className="bid">Egy márka.</span></T></p>
          <a href="#terminal" className="btn btn-bid mt-6">Jöhet a terminál</a>
        </div>
        <div className="hud mono bottom-5 right-5 w-[9.5rem] text-[.68rem] text-[var(--dim)] md:bottom-[13%] md:right-[4.5%]" aria-hidden>
          <span className="flex justify-between"><span>JELENET</span><span data-hud="st">01 / 04</span></span>
          <span className="bar"><i /></span>
          <span className="flex justify-between"><span>SZIMULÁLT ADAT</span><span className="bid">● ÉLŐ</span></span>
        </div>
      </div>
    </section>
  );
}

/* ---------- playable terminal ---------- */
type Candle = { o: number; h: number; l: number; c: number };
type Lvl = { p: number; q: number };
function Terminal() {
  const cv = useRef<HTMLCanvasElement>(null), box = useRef<HTMLDivElement>(null);
  const S = useRef({ price: 4820.5, vel: 0, candles: [] as Candle[], tick: 0, cross: null as null | { x: number; y: number } });
  const [px, setPx] = useState(4820.5), [dir, setDir] = useState(0);
  const [book, setBook] = useState<{ a: Lvl[]; b: Lvl[] }>({ a: [], b: [] });
  const [qty, setQty] = useState(5), [pos, setPos] = useState(0), [avg, setAvg] = useState(0), [real, setReal] = useState(0);
  const [log, setLog] = useState<{ t: string; side: "V" | "E"; q: number; p: number }[]>([]);
  const st = useRef({ pos: 0, avg: 0 }); st.current = { pos, avg };
  useEffect(() => {
    const s = S.current, c = cv.current!, g = c.getContext("2d")!; let W = 0, H = 0, raf = 0, vis = false, last = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // history so the chart is never empty
    let p = s.price - 40; for (let i = 0; i < 64; i++) { const o = p; let h = o, l = o; for (let k = 0; k < 10; k++) { p += (Math.random() - 0.48) * 3.2; h = Math.max(h, p); l = Math.min(l, p); } s.candles.push({ o, h, l, c: p }); }
    s.price = p; s.candles.push({ o: p, h: p, l: p, c: p });
    const size = () => { const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; c.width = Math.round(W * d); c.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0); draw(); };
    const css = getComputedStyle(c), BID = css.getPropertyValue("--bid").trim() || "#4ff0e0", ASK = css.getPropertyValue("--ask").trim() || "#ff5a1f";
    const draw = () => {
      if (!W) return; g.clearRect(0, 0, W, H);
      const cs = s.candles, padR = 62, n = cs.length, cw = (W - padR) / 70, hi = Math.max(...cs.map((k) => k.h)), lo = Math.min(...cs.map((k) => k.l)), pad = (hi - lo) * 0.12 + 0.5;
      const y = (v: number) => 8 + (1 - (v - (lo - pad)) / (hi - lo + pad * 2)) * (H - 16);
      g.strokeStyle = "rgba(236,232,223,.07)"; g.lineWidth = 1; g.font = '11px "JetBrains Mono Variable", monospace'; g.fillStyle = "rgba(154,158,170,.9)"; g.textBaseline = "middle";
      for (let i = 0; i <= 4; i++) { const v = lo - pad + ((hi - lo + pad * 2) * i) / 4, yy = Math.round(y(v)) + 0.5; g.beginPath(); g.moveTo(0, yy); g.lineTo(W - padR, yy); g.stroke(); g.fillText(v.toFixed(1), W - padR + 8, yy); }
      cs.forEach((k, i) => { const x = (70 - n + i) * cw + cw / 2, up = k.c >= k.o; g.strokeStyle = g.fillStyle = up ? BID : ASK; g.beginPath(); g.moveTo(x, y(k.h)); g.lineTo(x, y(k.l)); g.stroke(); const a = y(Math.max(k.o, k.c)), b = y(Math.min(k.o, k.c)); g.fillRect(x - cw * 0.32, a, cw * 0.64, Math.max(1.5, b - a)); });
      const yy = y(s.price), up = cs[n - 1].c >= cs[n - 1].o; g.setLineDash([4, 4]); g.strokeStyle = up ? BID : ASK; g.beginPath(); g.moveTo(0, yy); g.lineTo(W - padR, yy); g.stroke(); g.setLineDash([]);
      g.fillStyle = up ? BID : ASK; g.fillRect(W - padR + 2, yy - 10, padR - 2, 20); g.fillStyle = "#06070a"; g.fillText(s.price.toFixed(1), W - padR + 8, yy);
      if (st.current.pos !== 0) { const ye = y(st.current.avg); g.strokeStyle = "#ece8df"; g.beginPath(); g.moveTo(0, ye); g.lineTo(W - padR, ye); g.stroke(); g.fillStyle = "#ece8df"; g.fillText(`${st.current.pos > 0 ? "LONG" : "SHORT"} ${Math.abs(st.current.pos)}`, 8, ye - 10); }
      if (s.cross) { g.strokeStyle = "rgba(236,232,223,.4)"; g.beginPath(); g.moveTo(s.cross.x + 0.5, 0); g.lineTo(s.cross.x + 0.5, H); g.moveTo(0, s.cross.y + 0.5); g.lineTo(W - padR, s.cross.y + 0.5); g.stroke(); }
    };
    const step = () => {
      s.vel = s.vel * 0.9 + (Math.random() - 0.5) * 1.5; s.price = Math.max(100, s.price + s.vel + (Math.random() - 0.5) * 1.2);
      const k = s.candles[s.candles.length - 1]; k.c = s.price; k.h = Math.max(k.h, s.price); k.l = Math.min(k.l, s.price);
      if (++s.tick % 14 === 0) { s.candles.push({ o: s.price, h: s.price, l: s.price, c: s.price }); if (s.candles.length > 66) s.candles.shift(); }
      setPx((o) => { setDir(s.price >= o ? 1 : -1); return s.price; });
      if (s.tick % 2 === 0) { const mk = (sg: number) => Array.from({ length: 7 }, (_, i) => ({ p: s.price + sg * (0.5 + i * 0.5), q: Math.round((12 + i * 9) * (0.5 + Math.random())) })); setBook({ a: mk(1), b: mk(-1) }); }
    };
    const loop = (t: number) => { raf = requestAnimationFrame(loop); if (!vis || document.hidden) return; if (!reduced && t - last > 220) { last = t; step(); } draw(); };
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); io.observe(c);
    const ro = new ResizeObserver(size); ro.observe(c);
    const mv = (e: PointerEvent) => { const r = c.getBoundingClientRect(); s.cross = { x: e.clientX - r.left, y: e.clientY - r.top }; }, out = () => (s.cross = null);
    c.addEventListener("pointermove", mv); c.addEventListener("pointerleave", out);
    step(); size(); raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); c.removeEventListener("pointermove", mv); c.removeEventListener("pointerleave", out); };
  }, []);
  const trade = (sg: 1 | -1) => {
    const p = S.current.price, q = sg * qty, np = pos + q;
    if (pos === 0 || Math.sign(pos) === sg) { setAvg((avg * Math.abs(pos) + p * qty) / Math.abs(np)); }
    else { const closed = Math.min(Math.abs(pos), qty); setReal((r) => r + (p - avg) * closed * Math.sign(pos)); if (Math.abs(q) > Math.abs(pos)) setAvg(p); }
    setPos(np); setLog((l) => [{ t: new Date().toLocaleTimeString("hu-HU"), side: (sg > 0 ? "V" : "E") as "V" | "E", q: qty, p }, ...l].slice(0, 4));
  };
  const unreal = pos ? (px - avg) * pos : 0, equity = 100000 + real + unreal, maxQ = Math.max(...book.a.map((l) => l.q), ...book.b.map((l) => l.q), 1);
  return (
    <section id="terminal" className="relative py-20 md:py-28">
      <Spark seed={7} />
      <div className="wrapt mt-6">
        <p className="eyebrow bid mb-4">Demó terminál · szimulált árfolyam</p>
        <h2 data-t className="disp max-w-[13ch] text-[clamp(1.9rem,8vw,6rem)]"><T>Ne nézd. <span className="bid">Kereskedj.</span></T></h2>
        <p className="mt-5 max-w-[52ch] text-[var(--dim)]">100 000 játékdollárral indulsz. Az árfolyamot a böngésződ generálja, valódi pénz és valódi piac nincs mögötte. Vegyél, adj el, és figyeld az eredményt.</p>
        <div ref={box} className="term mt-10 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_15rem_17rem]">
          <div className="min-w-0 p-4 md:p-5">
            <div className="mono flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-[.74rem] text-[var(--dim)]">HRVT INDEX · 1 gyertya ≈ 3 mp</p><p key={Math.round(px * 10)} className={`text-[clamp(2rem,6vw,3rem)] font-bold leading-none ${dir >= 0 ? "flash-up" : "flash-dn"}`}>{fx(px, 1)}</p></div>
              <p className="text-[.74rem] text-[var(--dim)]">Mozgasd az egeret a grafikonon</p>
            </div>
            <canvas ref={cv} className="mt-4 block h-[17rem] w-full cursor-crosshair md:h-[23rem]" role="img" aria-label="Élő gyertyadiagram szimulált árfolyammal" />
          </div>
          <div className="mono cell py-3 lg:border-l lg:border-t-0 lg:border-[var(--line)]" aria-label="Ajánlati könyv">
            <p className="px-3 pb-2 text-[.7rem] text-[var(--dim)]">AJÁNLATI KÖNYV</p>
            {[...book.a].reverse().map((l, i) => <p key={`a${i}`} className="lvl ask"><i style={{ width: `${(l.q / maxQ) * 100}%`, background: "var(--ask)" }} /><span>{fx(l.p, 1)}</span><span className="text-right text-[var(--bone)]">{l.q}</span></p>)}
            <p className={`px-3 py-2 text-[1.05rem] font-bold ${dir >= 0 ? "bid" : "ask"}`}>{fx(px, 1)} {dir >= 0 ? "▲" : "▼"}</p>
            {book.b.map((l, i) => <p key={`b${i}`} className="lvl bid"><i style={{ width: `${(l.q / maxQ) * 100}%`, background: "var(--bid)" }} /><span>{fx(l.p, 1)}</span><span className="text-right text-[var(--bone)]">{l.q}</span></p>)}
          </div>
          <div className="mono cell grid content-start gap-4 p-4 lg:border-l lg:border-t-0 lg:border-[var(--line)]">
            <div><p className="text-[.7rem] text-[var(--dim)]">MENNYISÉG</p><div className="qty mt-2 flex gap-2" role="group" aria-label="Mennyiség">{[1, 5, 10, 25].map((q) => <button key={q} aria-pressed={qty === q} onClick={() => setQty(q)}>{q}</button>)}</div></div>
            <div className="grid grid-cols-2 gap-2"><button className="btn btn-bid" onClick={() => trade(1)}>Vétel</button><button className="btn btn-ask" onClick={() => trade(-1)}>Eladás</button></div>
            <dl className="grid gap-2 text-[.84rem]">
              <div className="flex justify-between"><dt className="dim">Pozíció</dt><dd>{pos === 0 ? "nincs" : `${pos > 0 ? "LONG" : "SHORT"} ${Math.abs(pos)} @ ${fx(avg, 1)}`}</dd></div>
              <div className="flex justify-between"><dt className="dim">Nyitott eredmény</dt><dd className={unreal >= 0 ? "bid" : "ask"}>{unreal >= 0 ? "+" : "−"}{fx(Math.abs(unreal))} $</dd></div>
              <div className="flex justify-between"><dt className="dim">Lezárt eredmény</dt><dd className={real >= 0 ? "bid" : "ask"}>{real >= 0 ? "+" : "−"}{fx(Math.abs(real))} $</dd></div>
              <div className="flex justify-between border-t border-[var(--line)] pt-2 text-[1rem] font-bold"><dt>Egyenleg</dt><dd>{fx(equity)} $</dd></div>
            </dl>
            <ul className="min-h-[5.2rem] text-[.74rem] text-[var(--dim)]" aria-live="polite">{log.map((l, i) => <li key={i} className="flex justify-between"><span>{l.t}</span><span className={l.side === "V" ? "bid" : "ask"}>{l.side === "V" ? "VÉTEL" : "ELADÁS"} {l.q}</span><span>{fx(l.p, 1)}</span></li>)}{!log.length && <li>Még nincs kötésed.</li>}</ul>
            <button className="text-left text-[.74rem] underline" onClick={() => { setPos(0); setAvg(0); setReal(0); setLog([]); }}>Számla visszaállítása</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- living treemap ---------- */
function Heat({ m }: { m: Inst[] }) {
  const rows = [m.slice(0, 3), m.slice(3, 7), m.slice(7, 12)];
  const col = (ch: number) => { const k = Math.min(1, Math.abs(ch) / 4); return ch >= 0 ? `color-mix(in srgb, #4ff0e0 ${10 + k * 26}%, #0b0d12)` : `color-mix(in srgb, #ff5a1f ${14 + k * 34}%, #0b0d12)`; };
  return (
    <section id="piac" className="relative py-20 md:py-28">
      <Spark seed={19} up={false} />
      <div className="wrapt mt-6">
        <p className="eyebrow ask mb-4">Piactérkép · kitalált instrumentumok</p>
        <h2 data-t className="disp max-w-[12ch] text-[clamp(1.9rem,8vw,6rem)]"><T>Ami nő, <span className="ask">helyet kér.</span></T></h2>
        <p className="mt-5 max-w-[50ch] text-[var(--dim)]">A csempék mérete a forgalmat, a színe az irányt mutatja. Semmi nem áll: a térkép másodpercenként újrarendezi magát.</p>
        <div className="tree mt-10" role="img" aria-label="Élő, szimulált piactérkép tizenkét kitalált instrumentummal">
          {rows.map((r, i) => (
            <div key={i} style={{ flexGrow: r.reduce((a, x) => a + x.w, 0) }}>
              {r.map((x) => (<div key={x.s} className="tile mono" style={{ flexGrow: x.w, flexBasis: 0, backgroundColor: col(x.ch) }}><b>{x.s}</b><span>{x.ch >= 0 ? "+" : "−"}{Math.abs(x.ch).toFixed(2)}%<br /><span>{fx(x.p)}</span></span></div>))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- position-size ladder ---------- */
function Risk() {
  const [acc, setAcc] = useState(25000), [risk, setRisk] = useState(1), [stop, setStop] = useState(4);
  const amount = (acc * risk) / 100, size = amount / (stop / 100), unit = Math.min(22, 6 + stop * 1.4); // % of the ladder width per 1R
  const In = ({ label, v, set, min, max, step, out }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step: number; out: string }) => (
    <label className="block"><span className="mono flex justify-between text-[.8rem]"><span className="dim">{label}</span><b>{out}</b></span><input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={label} /></label>
  );
  return (
    <section id="kockazat" className="relative py-20 md:py-28">
      <Spark seed={31} />
      <div className="wrapt mt-6 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="eyebrow bid mb-4">Pozícióméret-kalkulátor</p>
          <h2 data-t className="disp text-[clamp(1.9rem,8vw,5.6rem)]"><T>Előbb a kockázat. <span className="bid">Aztán a klikk.</span></T></h2>
          <p className="mt-5 max-w-[44ch] text-[var(--dim)]">Mondd meg, mennyit vagy hajlandó elveszíteni egy kötésen, és megkapod, mekkora pozíció fér bele. Egyszerű számtan, nem befektetési tanács.</p>
          <div className="mt-8 grid gap-5">
            <In label="Számla" v={acc} set={setAcc} min={1000} max={250000} step={1000} out={`${fx(acc, 0)} $`} />
            <In label="Kockázat kötésenként" v={risk} set={setRisk} min={0.25} max={5} step={0.25} out={`${risk.toFixed(2)} %`} />
            <In label="Stop távolsága" v={stop} set={setStop} min={0.5} max={15} step={0.5} out={`${stop.toFixed(1)} %`} />
          </div>
        </div>
        <div className="self-end">
          <div className="mono grid grid-cols-2 gap-6">
            <div><p className="text-[.74rem] text-[var(--dim)]">KOCKÁZTATOTT ÖSSZEG</p><p className="ask text-[clamp(1.8rem,5.4vw,3rem)] font-bold">{fx(amount, 0)} $</p></div>
            <div><p className="text-[.74rem] text-[var(--dim)]">POZÍCIÓMÉRET</p><p className="bid text-[clamp(1.8rem,5.4vw,3rem)] font-bold">{fx(size, 0)} $</p></div>
          </div>
          <div className="ladder mono mt-8" role="img" aria-label={`Stop ${stop} százaléknál mínusz ${Math.round(amount)} dollár, a célok ennek egy-, két- és háromszorosai`}>
            <div className="z" style={{ left: `${30 - unit}%`, width: `${unit}%`, background: "linear-gradient(90deg,rgba(255,90,31,.55),rgba(255,90,31,.12))" }} />
            <div className="z" style={{ left: "30%", width: `${unit * 3}%`, background: "linear-gradient(90deg,rgba(79,240,224,.12),rgba(79,240,224,.5))" }} />
            <div className="mk" style={{ left: `${30 - unit}%`, background: "var(--ask)" }}><span className="ask top-2">STOP −{fx(amount, 0)} $</span></div>
            <div className="mk" style={{ left: "30%" }}><span className="bottom-2">BELÉPŐ</span></div>
            {[1, 2, 3].map((r) => <div key={r} className="mk" style={{ left: `${30 + unit * r}%`, background: "var(--bid)" }}><span className="bid" style={{ top: `${0.5 + r * 1.5}rem` }}>{r}R +{fx(amount * r, 0)} $</span></div>)}
          </div>
          <p className="mono mt-4 text-[.78rem] text-[var(--dim)]">Pozícióméret = kockáztatott összeg ÷ stop távolsága. Tőkeáttétellel és költségekkel nem számol.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- how it was built ---------- */
function Decode({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!; if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); let f = 0; const id = setInterval(() => { f++; el.textContent = text.split("").map((c, i) => (i < f / 2 || /\s/.test(c) ? c : "0123456789#%$"[(Math.random() * 13) | 0])).join(""); if (f / 2 > text.length) { clearInterval(id); el.textContent = text; } }, 32); }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el); return () => io.disconnect();
  }, [text]);
  return <span ref={ref}>{text}</span>;
}
const FACTS: [string, string, string][] = [
  ["4 200", "elem, egyetlen rajzhívás", "A nyitójelenet minden oszlopa ugyanannak a hasábnak a példánya. A négy alakzat a videókártyán vált át, nem a processzoron."],
  ["0", "képfájl a nyitóképben", "A táj, a szurdok, a bolygó és a logó is kódból áll össze. A HRVT jelet a márka vektoros rajzából mintavételezi."],
  ["100%", "böngészőben futó szimuláció", "Az árfolyam, az ajánlati könyv és a piactérkép helyben generálódik. Nincs szerver, nincs adatgyűjtés, nincs valódi piac."],
  ["3", "betűcsalád, egy rendszer", "Syne a címekhez, JetBrains Mono a számokhoz, Instrument Sans a szöveghez. Vétel türkiz, eladás narancs, minden más csontfehér."],
];
function Built() {
  return (
    <section id="keszult" className="relative py-20 md:py-28">
      <Spark seed={43} up={false} />
      <div className="wrapt mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
        <div><p className="eyebrow mb-4 text-[var(--bone)]">Hogyan készült</p><h2 data-t className="disp text-[clamp(1.9rem,8vw,5.6rem)]"><T>Kód, <span className="ask">nem sablon.</span></T></h2><p className="mt-5 max-w-[40ch] text-[var(--dim)]">Next.js, three.js és saját GLSL shaderek. Ez az oldal azt mutatja meg, mire képes ma egy weboldal, ha valaki megírja.</p></div>
        <div>{FACTS.map(([n, t, d]) => (<div key={t} className="fact"><p className="mono bid text-[clamp(2.2rem,6vw,3.6rem)] font-bold leading-none"><Decode text={n} /></p><div><p className="text-[1.2rem] font-bold">{t}</p><p className="mt-1 text-[var(--dim)]">{d}</p></div></div>))}</div>
      </div>
    </section>
  );
}

export function Trading() {
  const m = useMarket();
  const r = useRef<{ sec?: HTMLElement; host?: HTMLElement; cv?: HTMLCanvasElement }>({});
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".tr [data-t]").forEach((el) => io.observe(el));
    let api: { destroy: () => void } | null = null, dead = false, st = -1;
    const start = () => import("./field3d").then((mod) => {
      const { sec, host, cv } = r.current; if (dead || !sec || !host || !cv) return;
      const hud = host.querySelector<HTMLElement>('[data-hud="st"]');
      try { api = mod.mount({ canvas: cv, hero: sec, host, onStage: (s, p) => { host.style.setProperty("--hp", p.toFixed(3)); if (s !== st) { st = s; host.setAttribute("data-st", String(s)); if (hud) hud.textContent = `0${s + 1} / 04`; } } }); } catch { /* no WebGL: copy and layout still work */ }
    });
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => start(), { timeout: 900 }); else setTimeout(start, 200);
    return () => { dead = true; api?.destroy(); io.disconnect(); };
  }, []);
  return (
    <div className="tr">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="bg-[rgba(6,7,10,.72)] backdrop-blur">
          <div className="wrapt flex items-center justify-between py-3">
            <a href="#top" aria-label="HRVT Trading, a lap tetejére"><Lockup /></a>
            <nav className="mono hidden items-center gap-7 text-[.78rem] font-bold uppercase tracking-[.1em] md:flex" aria-label="Fő menü"><a href="#terminal">Terminál</a><a href="#piac">Piactérkép</a><a href="#kockazat">Kockázat</a><a href="#keszult">Hogyan készült</a></nav>
            <a href="#terminal" className="btn btn-bid !min-h-[2.6rem] !px-4 !text-[.78rem]">Demó</a>
          </div>
        </div>
        <Tape m={m} />
      </header>
      <main>
        <Hero bind={(sec, host, cv) => { r.current = { sec, host, cv }; }} />
        <Terminal />
        <Heat m={m} />
        <Risk />
        <Built />
        <section className="relative overflow-hidden py-24 md:py-36">
          <div className="wrapt">
            <Mark className="w-full text-[var(--bone)]" />
            <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
              <h2 data-t className="disp text-[clamp(2.2rem,6.6vw,4.6rem)]"><T>Ilyet a te márkádnak is <span className="bid">építek.</span></T></h2>
              <div className="flex flex-wrap gap-3 md:justify-end"><a href="/#kapcsolat" className="btn btn-bid">Beszéljünk</a><a href="/" className="btn btn-line">HRVT főoldal</a></div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--line)] py-8">
        <div className="wrapt grid gap-4 text-sm text-[var(--dim)] md:grid-cols-[auto_1fr] md:items-center md:gap-10">
          <Lockup h="h-4" />
          <p>A HRVT TRADING kitalált márka, ez az oldal webdesign-portfólióprojekt. Nem brókercég, nem nyújt befektetési vagy kereskedési szolgáltatást, nem fogad el pénzt. Minden árfolyam, instrumentum és eredmény szimulált, és nem minősül befektetési tanácsnak.</p>
        </div>
      </footer>
    </div>
  );
}
