"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FRAMES, PAPERS, SIZES, priceOf, type GalleryConfig, type Work } from "./data";
import { approachU, artU, makeCurve, railP, unit } from "./rail";
import type { Api, Frame } from "./scene";

const ft = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ft`;
function track(name: string, props?: Record<string, unknown>) {
  const w = window as unknown as { va?: (e: string, p: unknown) => void; plausible?: (n: string, o?: unknown) => void; gtag?: (...a: unknown[]) => void };
  try { w.va?.("event", { name, ...props }); w.plausible?.(name, { props }); w.gtag?.("event", name, props); } catch {}
}

/** Top-view map of the corridor: the dot is you, the ticks are the works. */
function MiniMap({ works, dotRef, onJump, active }: { works: Work[]; dotRef: React.RefObject<SVGGElement | null>; onJump: (i: number) => void; active: number }) {
  const N = works.length;
  const { d, ticks, box } = useMemo(() => {
    const c = makeCurve(N); const pts = c.getSpacedPoints(Math.round(80 / unit(N)));
    const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
    const box = { x0: Math.min(...xs) - 3, x1: Math.max(...xs) + 3, z0: Math.min(...zs), z1: Math.max(...zs) };
    const d = pts.map((p, k) => `${k ? "L" : "M"}${p.x.toFixed(2)} ${p.z.toFixed(2)}`).join(" ");
    const ticks = works.map((_, i) => { const u = artU(i, N), p = c.getPointAt(u), t = c.getTangentAt(u); const s = i % 2 === 0 ? 1 : -1; return { x: p.x + t.z * s * 1.6, z: p.z - t.x * s * 1.6 }; });
    return { d, ticks, box };
  }, [works, N]);
  return (
    <svg className="map" viewBox={`${box.x0} ${box.z0} ${box.x1 - box.x0} ${box.z1 - box.z0}`} role="group" aria-label="A folyosó térképe">
      <path d={d} className="map-path" />
      {ticks.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.z} r={i === active ? 1.15 : 0.8} className={`map-tick ${i === active ? "on" : ""}`} data-ui role="button" tabIndex={-1} aria-label={works[i].title} onClick={() => onJump(i)} />
      ))}
      <g ref={dotRef}><path d="M0 -2.4 L1.5 1.4 L0 0.6 L-1.5 1.4Z" className="map-dot" /></g>
    </svg>
  );
}

/** A short roll-in for the "you are walking past" title. */
function Roll({ text, whole }: { text: string; whole?: boolean }) {
  // script faces overhang their letter boxes and join up, so they move as one piece instead of letter by letter
  if (whole) return <span className="roll roll-whole">{text}</span>;
  return <span key={text} className="roll">{[...text].map((c, i) => <span key={i} style={{ "--i": i } as CSSProperties}>{c === " " ? " " : c}</span>)}</span>;
}

export function Galeria({ cfg }: { cfg: GalleryConfig }) {
  const works = cfg.works, N = works.length;
  const canvas = useRef<HTMLCanvasElement>(null), api = useRef<Api | null>(null);
  const dot = useRef<SVGGElement>(null), root = useRef<HTMLDivElement>(null);
  const uRef = useRef(0), lastNear = useRef(-1), opener = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(-1), [hover, setHover] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null), [open, setOpen] = useState(false);
  const [noGL, setNoGL] = useState(false), [bag, setBag] = useState(0), [toast, setToast] = useState("");
  const [paper, setPaper] = useState(0), [size, setSize] = useState(0), [frame, setFrame] = useState(0), [qty, setQty] = useState(1);
  const panelHead = useRef<HTMLHeadingElement>(null);

  const progress = () => { const max = document.documentElement.scrollHeight - innerHeight; return max > 0 ? scrollY / max : 0; };

  const onFrame = useCallback((f: Frame) => {
    uRef.current = f.u;
    if (dot.current) dot.current.setAttribute("transform", `translate(${f.x.toFixed(2)} ${f.z.toFixed(2)}) rotate(${((-f.yaw * 180) / Math.PI).toFixed(1)})`);
    const n = f.k > 0.25 ? f.near : -1;
    if (n !== lastNear.current) { lastNear.current = n; setNear(n); }
  }, []);

  const doFocus = useCallback((i: number, from?: HTMLElement | null) => {
    if (from !== undefined) opener.current = from;
    setPaper(0); setSize(0); setFrame(0); setQty(1);
    document.documentElement.style.overflow = "hidden";
    track("kep_megnyitas", { kep: works[i].id });
    if (api.current) { setOpen(false); setFocus(i); api.current.focus(i); } else { setFocus(i); setOpen(true); }
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (api.current && focus !== null) api.current.unfocus(approachU(focus, N));
    else { document.documentElement.style.overflow = ""; setFocus(null); }
  }, [focus, N]);

  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) { w.__hrvtReady = true; dispatchEvent(new Event("hrvt:ready")); }
    let alive = true;
    import("./scene").then((m) => {
      if (!alive) return;
      try {
        api.current = m.mount({
          canvas: canvas.current!, works, theme: cfg.theme, endLogo: cfg.endLogo, onFrame,
          onHover: (i) => setHover(i),
          onFocused: () => setOpen(true),
          onReleased: () => {
            document.documentElement.style.overflow = "";
            const max = document.documentElement.scrollHeight - innerHeight;
            scrollTo({ top: railP(uRef.current) * max, behavior: "instant" as ScrollBehavior });
            api.current?.setProgress(railP(uRef.current), true);
            setFocus(null); opener.current?.focus?.();
          },
        });
        api.current.setProgress(progress(), true);
      } catch { setNoGL(true); }
    });
    let px = 0, py = 0, pickRaf = 0;
    const scroll = () => api.current?.setProgress(progress());
    const move = (e: PointerEvent) => {
      api.current?.setPointer((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
      if (e.pointerType === "mouse" && !(e.target as HTMLElement).closest("[data-ui]")) { px = e.clientX; py = e.clientY; if (!pickRaf) pickRaf = requestAnimationFrame(() => { pickRaf = 0; api.current?.pick(px, py); }); }
      else if ((e.target as HTMLElement).closest("[data-ui]")) setHover(null);
    };
    const click = (e: MouseEvent) => {
      const el = e.target as HTMLElement; const tr = el.closest<HTMLElement>("[data-track]"); if (tr) track(tr.dataset.track!);
      if (el.closest("[data-ui]") || !api.current) return;
      const i = api.current.pick(e.clientX, e.clientY); if (i !== null) doFocus(i, null);
    };
    const tilt = (e: DeviceOrientationEvent) => { if (e.gamma != null && e.beta != null) api.current?.setPointer(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (45 - e.beta) / 30))); };
    addEventListener("scroll", scroll, { passive: true }); addEventListener("pointermove", move); addEventListener("click", click);
    if (matchMedia("(pointer: coarse)").matches) addEventListener("deviceorientation", tilt);
    return () => {
      alive = false; api.current?.destroy(); api.current = null;
      removeEventListener("scroll", scroll); removeEventListener("pointermove", move); removeEventListener("click", click); removeEventListener("deviceorientation", tilt);
      document.documentElement.style.overflow = "";
    };
  }, [onFrame, doFocus, works, cfg.theme, cfg.endLogo]);

  useEffect(() => {
    if (!open) return;
    panelHead.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (focus !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { const n = focus + (e.key === "ArrowRight" ? 1 : -1); if (n >= 0 && n < N) doFocus(n); }
    };
    addEventListener("keydown", key); return () => removeEventListener("keydown", key);
  }, [open, focus, close, doFocus, N]);

  const jump = (i: number) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top: railP(approachU(i, N)) * max, behavior: "smooth" }); track("terkep_ugras", { kep: works[i].id });
  };
  const add = () => {
    if (focus === null) return; setBag((b) => b + qty); setToast(`${works[focus].title} a kosárban`); track("kosarba", { kep: works[focus].id, ar: priceOf(works[focus], paper, size, frame) * qty });
    setTimeout(() => setToast(""), 2600);
  };

  const w = focus !== null ? works[focus] : null;
  const label = hover !== null ? hover : near;
  return (
    <div ref={root} className={`gal ${cfg.cls ?? ""} ${hover !== null ? "is-hover" : ""} ${focus !== null ? "is-focus" : ""}`}>
      <canvas ref={canvas} aria-hidden className="gal-canvas" />

      <header className="gal-head" data-ui>
        <a href="#top" className="brand" aria-label={`${cfg.logo.alt}, vissza az elejére`} onClick={(e) => { e.preventDefault(); if (focus === null) scrollTo({ top: 0, behavior: "smooth" }); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cfg.logo.src} alt="" width={cfg.logo.w} height={cfg.logo.h} />
          {cfg.logo.label && <span>{cfg.logo.label}</span>}
        </a>
        {cfg.shop
          ? <a className="bagpill" href={cfg.shop.href} target="_blank" rel="noopener" data-track="shop_fejlec">{cfg.shop.label} <span aria-hidden>↗</span></a>
          : !cfg.noCart && <span className="bagpill" aria-live="polite">Kosár · {bag}</span>}
      </header>

<h1 id="top" className="sr">{cfg.title[0]} {cfg.title[1]}</h1>



      <div className={`passing ${label >= 0 && focus === null ? "show" : ""}`} data-ui>
        {label >= 0 && (
          <>
            <p className="passing-t disp"><Roll key={works[label].id} text={works[label].title} whole={cfg.script} /></p>
            <button className="passing-btn" onClick={(e) => doFocus(label, e.currentTarget)} data-track="megnezem">Megnézem <span aria-hidden>→</span></button>
          </>
        )}
      </div>

      {!noGL && <div className="mapwrap" data-ui><MiniMap works={works} dotRef={dot} onJump={jump} active={label} /></div>}

      <nav className="worklist" aria-label="A kiállított képek" data-ui>
        <p className="lbl">A kiállított képek</p>
        <ol>{works.map((x, i) => <li key={x.id}><button onClick={(e) => doFocus(i, e.currentTarget)}><span className="disp">{x.title}</span> <span>{x.artist}</span></button></li>)}</ol>
      </nav>


      <div className="rail" aria-hidden style={{ height: `${Math.round(1000 / unit(N))}svh` }} />

      <aside className={`panel ${open && w ? "open" : ""}`} aria-hidden={!open} aria-labelledby="pnl-h" data-ui role="dialog" aria-modal="false">
        {w && focus !== null && (
          <div className="panel-in">
            <div className="panel-top">
              <p className="lbl">{focus + 1} / {N}</p>
              <div className="panel-nav">
                <button onClick={() => focus > 0 && doFocus(focus - 1)} disabled={focus === 0} aria-label="Előző kép">←</button>
                <button onClick={() => focus < N - 1 && doFocus(focus + 1)} disabled={focus === N - 1} aria-label="Következő kép">→</button>
                <button onClick={close} aria-label="Vissza a folyosóra" className="x">Vissza</button>
              </div>
            </div>
            <h2 id="pnl-h" ref={panelHead} tabIndex={-1} className="disp panel-title">{w.title}</h2>
            <p className="panel-by">{[w.artist, w.year, w.medium].filter(Boolean).join(" · ")}</p>
            {w.story.split("\n").filter(Boolean).map((para, k) => <p key={k} className="panel-story">{para}</p>)}
            {w.base != null ? (
              <>
              <p className="price disp" aria-live="polite">{ft(priceOf(w, paper, size, frame) * qty)}</p>
              <p className="fine">Mintaár, koncepcióterv.</p>
              <fieldset><legend className="lbl">Papír</legend><div className="chips">{PAPERS.map((p, k) => <button key={p.id} aria-pressed={paper === k} onClick={() => setPaper(k)}>{p.label}</button>)}</div></fieldset>
              <fieldset><legend className="lbl">Méret</legend><div className="chips">{SIZES.map((p, k) => <button key={p.id} aria-pressed={size === k} onClick={() => setSize(k)}>{p.label}</button>)}</div></fieldset>
              <fieldset><legend className="lbl">Keret</legend><div className="frames">{FRAMES.map((p, k) => (
                <button key={p.id} aria-pressed={frame === k} onClick={() => setFrame(k)}>
                  <span className="fr" style={{ "--fc": p.color ?? "transparent" } as CSSProperties}><span style={{ background: w.img ? `center/cover url(${w.img})` : `linear-gradient(135deg, ${w.palette[1]}, ${w.palette[2]})` }} /></span>{p.label}
                </button>
              ))}</div></fieldset>
              <div className="buy">
                <span className="step"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kevesebb">−</button><span>{qty}</span><button onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Több">+</button></span>
                <button className="btn" onClick={add}>Kosárba <span aria-hidden>→</span></button>
              </div>
              <p className="fine">Szállítás 3–5 munkanap, papírhengerben vagy keretezve, dobozban.</p>
              </>
            ) : (
              (w.shop || w.video) && <div className="links">
                {w.shop && <a className="btn" href={w.shop} target="_blank" rel="noopener" data-track="shop_kep">Megnézem a shopban <span aria-hidden>↗</span></a>}
                {w.video && <a className="btn btn-line" href={w.video} target="_blank" rel="noopener" data-track="video_kep">Videó a képről <span aria-hidden>↗</span></a>}
              </div>
            )}
          </div>
        )}
      </aside>
      <p className={`toast ${toast ? "show" : ""}`} role="status">{toast}</p>
    </div>
  );
}
