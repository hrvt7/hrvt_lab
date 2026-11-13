"use client";
import { cloneElement, Fragment, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const TICKET = "https://www.palyaautozas.hu";
const MAP = "https://www.google.com/maps/search/?api=1&query=Pann%C3%B3nia-Ring%2C%20Ostffyasszonyfa";
const LAP_KM = 4.74; // Pannónia-Ring pályahossz

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
function useProgress<E extends HTMLElement>(from = 0.9, to = 0.3) {
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
const Arrow = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

/* ---------- hero: stylized circuit, a taillight laps it as you scroll ---------- */
const PTS: [number, number][] = [[.18,.70],[.10,.52],[.16,.30],[.34,.20],[.50,.30],[.56,.46],[.70,.40],[.84,.22],[.93,.36],[.88,.62],[.70,.78],[.50,.72],[.34,.82]];
function spline(t: number) {
  const n = PTS.length, f = ((t % 1) + 1) % 1 * n, i = Math.floor(f), u = f - i;
  const p = (k: number) => PTS[(i + k + n) % n];
  const [p0, p1, p2, p3] = [p(-1), p(0), p(1), p(2)];
  const c = (a: number, b: number, c2: number, d: number) => 0.5 * (2 * b + (-a + c2) * u + (2 * a - 5 * b + 4 * c2 - d) * u * u + (-a + 3 * b - 3 * c2 + d) * u * u * u);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])] as const;
}
function Hero() {
  const sec = useRef<HTMLElement>(null), cv = useRef<HTMLCanvasElement>(null), km = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const c = cv.current!, g = c.getContext("2d")!, s = sec.current!;
    let w = 0, h = 0, dpr = 1, raf = 0, ps = 0, last = performance.now(), idle = 0, vis = true;
    const box = () => { const mob = innerWidth < 768; return mob ? { x: w * .06, y: h * .66, W: w * .88, H: h * .3 } : { x: w * .42, y: h * .1, W: w * .56, H: h * .82 }; };
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(s);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame); const dt = Math.min(.05, (now - last) / 1000); last = now; if (!vis) return;
      const r = s.getBoundingClientRect(), target = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      ps += (target - ps) * (1 - Math.exp(-dt * 6)); idle += dt * 0.025;
      const t = ps * 0.999 + idle, b = box(), P = (u: number) => { const [x, y] = spline(u); return [b.x + x * b.W, b.y + y * b.H]; };
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      g.lineJoin = "round"; g.lineCap = "round";
      const path = () => { g.beginPath(); for (let k = 0; k <= 240; k++) { const [x, y] = P(k / 240); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); };
      path(); g.strokeStyle = "#0e2350"; g.lineWidth = Math.max(18, b.W * .035); g.stroke();
      path(); g.strokeStyle = "rgba(246,239,228,.22)"; g.lineWidth = 1.5; g.setLineDash([10, 14]); g.stroke(); g.setLineDash([]);
      const [sx, sy] = P(0); g.save(); g.translate(sx, sy); g.fillStyle = "#f6efe4"; for (let k = 0; k < 6; k++) g.fillRect(-14 + (k % 2) * 7, -12 + Math.floor(k / 2) * 7, 7, 7); g.restore();
      for (let k = 70; k > 0; k--) { const [x, y] = P(t - k * .0022); g.fillStyle = `rgba(239,128,95,${(1 - k / 70) * .55})`; g.beginPath(); g.arc(x, y, 3 + (1 - k / 70) * 4, 0, 7); g.fill(); }
      const [x, y] = P(t); const gr = g.createRadialGradient(x, y, 0, x, y, 46); gr.addColorStop(0, "rgba(239,128,95,.9)"); gr.addColorStop(1, "rgba(239,128,95,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, 46, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill();
      if (km.current) km.current.textContent = (((t % 1) + 1) % 1 * LAP_KM).toFixed(2).replace(".", ",");
    };
    size(); addEventListener("resize", size); raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); io.disconnect(); };
  }, []);
  return (
    <section ref={sec} id="top" className="relative" style={{ height: "190svh" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="wrapx relative flex h-full flex-col justify-start pt-[6.2rem] md:justify-center md:pt-0">
          <div className="hero-copy md:max-w-[50%]">
            <p className="eb text-[var(--amber)]">A nyár legnagyobb autós bulija!</p>
            <h1 className="d mt-3 text-[clamp(3.6rem,15vw,9.2rem)]">Pálya<span className="plus">+</span><br />Buli<span className="plus">+</span><br />Tábor</h1>
            <p className="mt-4 text-[1.12rem] font-medium">Grafico BMW Meet és Magyar Autós Pálya-Tábor</p>
            <p className="mt-2 font-bold text-[var(--pink)]">2026. augusztus 1. és 2. · szombat és vasárnap · Pannónia-Ring</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={TICKET} target="_blank" rel="noopener" className="btn btn-pink" data-track="jegy_hero">Jegyvásárlás <Arrow /></a>
              <a href="#nap" className="btn btn-line" data-track="melyik_nap_hero">Melyik nap az enyém?</a>
            </div>
          </div>
        </div>
        <p aria-hidden className="eb absolute bottom-5 right-5 text-[var(--mute)] md:bottom-8 md:right-8">Pannónia-Ring · <span ref={km}>0,00</span> / 4,74 km</p>
      </div>
    </section>
  );
}

/* ---------- PÁLYA: three groups race as light trails ---------- */
function Palya() {
  const ref = useProgress<HTMLElement>(0.95, 0.15);
  const lanes = [{ n: "1.", c: "#ef805f", s: 1 }, { n: "2.", c: "#f5a100", s: .86 }, { n: "3.", c: "#f6efe4", s: .72 }];
  return (
    <section ref={ref} id="program" className="relative py-24 md:py-36">
      <div className="wrapx">
        <p className="eb text-[var(--pink)]">01 · Pálya</p>
        <h2 data-t className="d mt-3 text-[clamp(3rem,10vw,7rem)]"><T>Pályázás 3 csoportban</T></h2>
        <p className="mt-4 max-w-[46ch] text-[var(--mute)]">Szombaton és vasárnap is. Szombaton délben M-es körök. Vasárnap a lényeg a pályázás: kiegészítő programok nélkül, a maximum a köridőkért.</p>
        <div className="mt-12" aria-hidden>
          {lanes.map((l) => (<div key={l.n} className="lane" style={{ "--c": l.c, "--s": l.s } as CSSProperties}><span className="d text-[1.6rem] text-[var(--mute)]">{l.n} csoport</span><i /><b /></div>))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BULI: string lights switch on bulb by bulb ---------- */
function Buli() {
  const ref = useRef<HTMLElement>(null);
  const N = 22;
  useEffect(() => {
    const el = ref.current!; let raf = 0;
    const upd = () => { raf = 0; const r = el.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .7))); el.querySelectorAll(".bulb").forEach((b, i) => b.classList.toggle("on", i / N < p)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd(); addEventListener("scroll", on, { passive: true });
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const items = ["BMW-találkozó – Grafico BMW Meet", "Esti buli a depóban", "Zene, közös kajálás", "Látványos kiegészítő programok"];
  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--ink2)] pb-24 pt-10 md:pb-32">
      <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="h-[110px] w-full md:h-[150px]" aria-hidden>
        <path d="M0 20 Q300 130 600 60 T1200 30" fill="none" stroke="#3a4670" strokeWidth="2" />
        {Array.from({ length: N }, (_, i) => { const t = (i + .5) / N, x = t * 1200; const yy = t <= .5 ? (1 - 2 * t) ** 2 * 20 + 2 * (1 - 2 * t) * (2 * t) * 130 + (2 * t) ** 2 * 60 : (1 - (2 * t - 1)) ** 2 * 60 + 2 * (1 - (2 * t - 1)) * (2 * t - 1) * -10 + (2 * t - 1) ** 2 * 30; return <g key={i}><line x1={x} y1={yy} x2={x} y2={yy + 12} stroke="#3a4670" strokeWidth="2" /><ellipse className={`bulb ${i % 3 === 1 ? "pk" : ""}`} cx={x} cy={yy + 22} rx="8" ry="11" /></g>; })}
      </svg>
      <div className="wrapx mt-6 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
        <div>
          <p className="eb text-[var(--amber)]">02 · Buli · szombat</p>
          <h2 data-t className="d mt-3 text-[clamp(3rem,10vw,7rem)]"><T>Este a depó a miénk</T></h2>
        </div>
        <ul className="chk" style={{ "--c": "var(--amber)" } as CSSProperties}>{items.map((t) => <li key={t} className="text-[1.15rem] font-medium">{t}</li>)}</ul>
      </div>
    </section>
  );
}

/* ---------- TÁBOR: campfire + sparks between the tents ---------- */
function Tabor() {
  const sec = useRef<HTMLElement>(null), cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, g = c.getContext("2d")!; let w = 0, h = 0, dpr = 1, raf = 0, vis = false, last = performance.now();
    const sparks: { x: number; y: number; vx: number; vy: number; l: number }[] = [];
    const stars = Array.from({ length: 60 }, () => [Math.random(), Math.random() * .55, Math.random() * 1.6 + .4]);
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(sec.current!);
    const tent = (x: number, base: number, s: number, col: string) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - s, base); g.lineTo(x, base - s * 1.05); g.lineTo(x + s, base); g.closePath(); g.fill(); g.fillStyle = "rgba(245,161,0,.16)"; g.beginPath(); g.moveTo(x - s * .18, base); g.lineTo(x, base - s * .55); g.lineTo(x + s * .18, base); g.closePath(); g.fill(); };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame); const dt = Math.min(.05, (now - last) / 1000); last = now; if (!vis) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      for (const [sx, sy, r] of stars) { g.fillStyle = `rgba(246,239,228,${.35 + .3 * Math.sin(now / 900 + sx * 40)})`; g.beginPath(); g.arc(sx * w, sy * h, r, 0, 7); g.fill(); }
      const base = h * .86, fx = w * (innerWidth < 768 ? .5 : .62), fl = .85 + .15 * Math.sin(now / 90) * Math.sin(now / 53);
      const glow = g.createRadialGradient(fx, base, 0, fx, base, Math.min(w, h) * .55 * fl); glow.addColorStop(0, "rgba(245,161,0,.35)"); glow.addColorStop(1, "rgba(245,161,0,0)"); g.fillStyle = glow; g.fillRect(0, 0, w, h);
      g.fillStyle = "#000a1f"; g.fillRect(0, base, w, h - base);
      const S = Math.min(w, h);
      tent(fx - S * .42, base, S * .2, "#0b1a3c"); tent(fx + S * .4, base, S * .16, "#0b1a3c"); tent(fx - S * .78, base, S * .13, "#081530");
      for (const [k, col] of [[1, "#ef805f"], [.66, "#f5a100"], [.36, "#fff3c4"]] as [number, string][]) { const fh = S * .2 * k * fl, fw = S * .07 * k; g.fillStyle = col; g.beginPath(); g.moveTo(fx - fw, base); g.quadraticCurveTo(fx - fw * 1.1, base - fh * .5, fx + Math.sin(now / 140) * fw * .3, base - fh); g.quadraticCurveTo(fx + fw * 1.1, base - fh * .5, fx + fw, base); g.closePath(); g.fill(); }
      g.fillStyle = "#3a2312"; g.save(); g.translate(fx, base); g.rotate(.18); g.fillRect(-S * .09, -6, S * .18, 12); g.rotate(-.36); g.fillRect(-S * .09, -6, S * .18, 12); g.restore();
      if (sparks.length < 70 && Math.random() < .6) sparks.push({ x: fx + (Math.random() - .5) * S * .06, y: base - S * .08, vx: (Math.random() - .5) * 20, vy: -60 - Math.random() * 70, l: 1 });
      for (let i = sparks.length - 1; i >= 0; i--) { const p = sparks[i]; p.x += (p.vx + Math.sin(now / 300 + i) * 14) * dt; p.y += p.vy * dt; p.l -= dt * .45; if (p.l <= 0) { sparks.splice(i, 1); continue; } g.fillStyle = `rgba(245,161,0,${p.l})`; g.fillRect(p.x, p.y, 2.5, 2.5); }
    };
    size(); addEventListener("resize", size); raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); io.disconnect(); };
  }, []);
  const opts = [["Sátrazás", "a saját sátradban"], ["Boxban alvás", "a depó boxaiban"], ["Szobabérlés", "ha ágy kell"]];
  return (
    <section ref={sec} className="relative min-h-[100svh] overflow-hidden">
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="wrapx relative pb-[44vh] pt-24 md:pb-24 md:pt-32">
        <p className="eb text-[var(--pink)]">03 · Tábor</p>
        <h2 data-t className="d mt-3 text-[clamp(3rem,10vw,7rem)] md:max-w-[50%]"><T>Táborozás a depóban</T></h2>
        <ul className="mt-8 grid max-w-[34rem] gap-0">
          {opts.map(([a, b]) => <li key={a} className="flex items-baseline justify-between border-t border-white/15 py-4"><span className="d text-[2.2rem] text-[var(--amber)]">{a}</span><span className="text-[var(--mute)]">{b}</span></li>)}
        </ul>
        <p className="mt-6 max-w-[34rem] font-bold">Minden szaniter, víz, áram elérhető!</p>
      </div>
    </section>
  );
}

/* ---------- MELYIK NAP: start lights pick your day ---------- */
const SAT = ["Pályázás 3 csoportban", "BMW-találkozó – Grafico BMW Meet", "Délben M-es körök", "Esti buli a depóban", "Zene, közös kajálás", "Látványos kiegészítő programok", "Táborozás a depóban"];
const SUN = ["Pályázás 3 csoportban", "A lényeg a pályázás!", "Kiegészítő programok nélkül", "A maximum a köridőkért!"];
const DAYS = [
  { id: "szo", label: "Szombat", lamps: 1, line: "Akit a nyüzsgő depó érdekel, annak szombat az ideális.", list: SAT, date: "Augusztus 1., szombat" },
  { id: "vas", label: "Vasárnap", lamps: 2, line: "Aki a köridőre megy, annak a vasárnap.", list: SUN, date: "Augusztus 2., vasárnap" },
  { id: "mind", label: "Mindkét nap", lamps: 3, line: "Aki fanatikus, annak mindkét nap kötelező!", list: [...SAT, ...SUN.slice(1)], date: "Augusztus 1–2." },
];
function Nap() {
  const [d, setD] = useState(0); const day = DAYS[d];
  return (
    <section id="nap" className="relative bg-[var(--ink2)] py-24 md:py-36">
      <div className="wrapx grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="eb text-[var(--amber)]">04 · Melyik nap az enyém?</p>
          <h2 data-t className="d mt-3 text-[clamp(3rem,9vw,6.4rem)]"><T>Válaszd ki a rajtod</T></h2>
          <div className="mt-8 flex gap-4" aria-hidden>{[0, 1, 2].map((k) => <span key={k} className={`lamp ${k < day.lamps ? "on" : ""} ${k === 2 && day.lamps === 3 ? "am" : ""}`} />)}</div>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Nap kiválasztása">
            {DAYS.map((x, i) => <button key={x.id} type="button" aria-pressed={i === d} onClick={() => { setD(i); track("nap_valaszto", { nap: x.id }); }} className="day btn btn-line">{x.label}</button>)}
          </div>
          <p className="mt-8 text-[1.3rem] font-bold text-[var(--pink)]" aria-live="polite">{day.line}</p>
        </div>
        <div>
          <p className="d text-[2rem] text-[var(--mute)]">{day.date}</p>
          <ul className="chk mt-3">{day.list.map((t, i) => <li key={day.id + i} className="text-[1.1rem]">{t}</li>)}</ul>
          <a href={TICKET} target="_blank" rel="noopener" className="btn btn-pink mt-8" data-track="jegy_nap">Jegyet veszek erre <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

/* ---------- JEGY + HELYSZÍN ---------- */
function Jegy() {
  const ref = useProgress<HTMLElement>(0.95, 0.4);
  return (
    <section ref={ref} id="jegy" className="relative overflow-hidden py-24 md:py-36">
      <div className="wrapx">
        <p className="eb text-[var(--pink)]">05 · Jegy</p>
        <h2 className="d mt-3 text-[clamp(3.4rem,13vw,10rem)]" style={{ transform: "translateX(calc((1 - var(--p,0)) * -12%))" }}>Elő a vasakkal</h2>
        <p className="mt-4 max-w-[48ch] text-[1.15rem]">Augusztusban betáborozunk a Pannónia-Ringre! Jegyvásárlás és minden részlet a szervezőnél.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={TICKET} target="_blank" rel="noopener" className="btn btn-pink" data-track="jegy">Jegyvásárlás: palyaautozas.hu <Arrow /></a>
          <a href={MAP} target="_blank" rel="noopener" className="btn btn-line" data-track="utvonal">Útvonal a Pannónia-Ringre</a>
        </div>
        <dl className="mt-14 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
          <div><dt className="eb text-[var(--mute)]">Mikor</dt><dd className="mt-1 font-bold">2026. augusztus 1–2.</dd></div>
          <div><dt className="eb text-[var(--mute)]">Hol</dt><dd className="mt-1 font-bold"><a href={MAP} target="_blank" rel="noopener" className="underline decoration-[var(--pink)] decoration-2 underline-offset-4" data-track="utvonal">Pannónia-Ring, Ostffyasszonyfa</a></dd></div>
          <div><dt className="eb text-[var(--mute)]">Mi</dt><dd className="mt-1 font-bold">2 napos autós pálya-hétvége</dd></div>
        </dl>
      </div>
    </section>
  );
}

export function PalyaTabor() {
  const [bar, setBar] = useState(false);
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    const click = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]"); if (el) track(el.dataset.track!); };
    const scroll = () => setBar(scrollY > innerHeight * .9);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".pt [data-t]").forEach((el) => io.observe(el));
    document.addEventListener("click", click); addEventListener("scroll", scroll, { passive: true });
    return () => { io.disconnect(); document.removeEventListener("click", click); removeEventListener("scroll", scroll); };
  }, []);
  return (
    <div className="pt pb-[4.6rem] md:pb-0">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="wrapx mt-3 flex items-center justify-between rounded-md bg-[rgba(0,18,49,.82)] px-4 py-2.5 backdrop-blur">
          <a href="#top" className="d text-[1.6rem] leading-none">Pálya<span className="plus">-</span>Tábor</a>
          <nav className="hidden items-center gap-6 font-bold md:flex" aria-label="Fő menü"><a href="#program">Program</a><a href="#nap">Melyik nap?</a><a href="#jegy">Helyszín</a></nav>
          <span className="hidden md:block"><a href={TICKET} target="_blank" rel="noopener" className="btn btn-pink !min-h-[2.6rem]" data-track="jegy_header">Jegyvásárlás</a></span>
        </div>
      </header>
      <main>
        <Hero />
        <Palya />
        <Buli />
        <Tabor />
        <Nap />
        <Jegy />
      </main>
      <footer className="border-t border-white/10 py-8"><div className="wrapx flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--mute)]"><p>Pálya-Tábor 2026 · Grafico BMW Meet és Magyar Autós Pálya-Tábor · Pannónia-Ring</p><p>Koncepcióterv, nem hivatalos oldal. Készítette: <a className="font-bold text-[var(--paper)] underline" href="/">HRVT</a></p></div></footer>
      <div className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 bg-[rgba(0,18,49,.94)] p-2.5 backdrop-blur transition-transform duration-300 md:hidden ${bar ? "translate-y-0" : "translate-y-full"}`}>
        <a href={TICKET} target="_blank" rel="noopener" className="btn btn-pink justify-center" data-track="jegy_mobilsav">Jegyvásárlás</a>
        <a href={MAP} target="_blank" rel="noopener" className="btn btn-line justify-center" data-track="utvonal_mobilsav">Útvonal</a>
      </div>
    </div>
  );
}
