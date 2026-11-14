"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, onReady, prefersReduced } from "@/lib/gsap";
import { CENTER, PHOTOS } from "@/lib/photos";
import { EMAIL, PHONE, PHONE_TEL } from "@/lib/content";
import { Wordmark } from "@/components/Logo";
import { track } from "@/lib/track";

const N = PHOTOS.length;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** 1 — The tunnel: sticky WebGL scene with the intro, the live caption and the end line on top. */
function Tunnel({ onOpen }: { onOpen: (i: number) => void }) {
  const sec = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [sel, setSel] = useState(-1);
  const [live, setLive] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(matchMedia("(pointer: coarse)").matches);
    let dead = false;
    let stop = () => {};
    const off = onReady(() => {
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 150));
      idle(
        () =>
          import("./tunnel3d").then((m) => {
            if (dead || !host.current || !sec.current || !cv.current) return;
            const h = host.current;
            const s = m.mount({
              host: h,
              sec: sec.current,
              canvas: cv.current,
              photos: PHOTOS,
              onSelect: setSel,
              onOpen,
              onProgress: (p) => h.style.setProperty("--p", p.toFixed(4)),
            });
            if (s) {
              stop = s;
              setLive(true);
            }
          }),
        { timeout: 1200 },
      );
    });
    return () => {
      dead = true;
      off();
      stop();
    };
  }, [onOpen]);

  const ph = sel >= 0 ? PHOTOS[sel] : null;
  return (
    <section ref={sec} id="top" className="ft-tunnel" aria-label="Fotóalagút">
      <div ref={host} className={`ft-stage${live ? " is-live" : ""}`} style={{ ["--p" as string]: 0 }}>
        <canvas ref={cv} className="ft-canvas" aria-hidden />
        {/* The portrait fills the screen behind the tunnel: sharp in the middle, blurred towards the edges. */}
        <div className="ft-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ft-bg-soft" src={`/foto/m/${CENTER.id}.webp`} alt="" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ft-bg-sharp"
            src={`/foto/f/${CENTER.id}.webp`}
            srcSet={`/foto/m/${CENTER.id}.webp 640w, /foto/t/${CENTER.id}.webp 1024w, /foto/f/${CENTER.id}.webp 1600w`}
            sizes="100vw"
            alt={CENTER.alt}
            fetchPriority="high"
          />
        </div>

        <div className="ft-intro">
          <h1 className="ft-h1">
            <Wordmark className="ft-wm" title="HRVT" />
            <span className="ft-sub">Fotók</span>
          </h1>
          <p className="ft-hint">
            <i aria-hidden /> {touch ? "Görgess: az elöl lévő kép kap színt" : "Vidd az egeret egy képre: színt kap"}
          </p>
        </div>

        <p className="ft-cap" aria-live="polite">
          {ph ? (
            <>
              <b>{num(sel)}</b>
              <span>/ {num(N - 1)}</span>
              <em>{ph.tag}</em>
              <span className="ft-cap-act">{touch ? "koppints a nagyításhoz" : "kattints a nagyításhoz"}</span>
            </>
          ) : (
            <span className="ft-cap-idle">{num(N - 1)} kép · fekete-fehérben, amíg rá nem nézel</span>
          )}
        </p>

        <p className="ft-end">
          Minden kép saját fotó.
          <a href="#kontaktlap">Lent mind egymás után</a>
        </p>
      </div>
    </section>
  );
}

/** 2 — Contact sheet: a strip of negatives. Desktop: pinned, scroll moves it sideways. Phone: swipe. */
function Strip({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  const track$ = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = root.current!;
    const tr = track$.current!;
    const frames = [...tr.querySelectorAll<HTMLElement>("[data-frame]")];
    let ctx: gsap.Context | null = null;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 900px) and (pointer: fine)", () => {
          if (prefersReduced()) return;
          gsap.to(tr, {
            x: () => -(tr.scrollWidth - innerWidth),
            ease: "none",
            scrollTrigger: { trigger: el.querySelector(".fs-pin"), start: "top top", end: () => `+=${tr.scrollWidth - innerWidth}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
          });
        });
      }, el);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    // Phone: the frame nearest the middle of the strip is the coloured one.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!matchMedia("(pointer: coarse)").matches) return;
        const mid = innerWidth / 2;
        let best = -1;
        let bd = Infinity;
        frames.forEach((f, i) => {
          const r = f.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    tr.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onScroll(), { threshold: 0.4 });
    io.observe(tr);
    return () => {
      off();
      ctx?.revert();
      tr.removeEventListener("scroll", onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} id="kontaktlap" className="fs" aria-labelledby="fs-h">
      <div className="fs-pin">
        <header className="fs-head">
          <p className="ft-mono">Kontaktlap</p>
          <h2 id="fs-h" className="ft-h2">
            Mind a {N} kép, <span>egymás után.</span>
          </h2>
        </header>
        <ul ref={track$} className="fs-track">
          {PHOTOS.map((p, i) => (
            <li key={p.id} className={`fs-frame${active === i ? " on" : ""}`} data-frame="" style={{ ["--ar" as string]: `${p.w} / ${p.h}` }}>
              <button type="button" onClick={() => onOpen(i)} aria-label={`${num(i)}. kép megnyitása nagyban: ${p.alt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/foto/m/${p.id}.webp`} srcSet={`/foto/m/${p.id}.webp 640w, /foto/t/${p.id}.webp 1024w`} sizes="(min-width: 900px) 30vh, 62vw" alt={p.alt} loading="lazy" decoding="async" width={p.w} height={p.h} />
              </button>
              <p className="fs-edge">
                <span>{num(i)}A</span>
                <span>{p.tag}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Full-colour viewer. */
function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const sx = useRef<number | null>(null);
  useEffect(() => {
    const d = dlg.current!;
    if (index >= 0 && !d.open) d.showModal();
    if (index < 0 && d.open) d.close();
  }, [index]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (index < 0) return;
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [index, onStep]);
  const p = index >= 0 ? PHOTOS[index] : null;
  return (
    <dialog
      ref={dlg}
      className="lb"
      aria-label="Kép nagyban"
      onClose={onClose}
      onClick={(e) => e.target === dlg.current && onClose()}
      onPointerDown={(e) => (sx.current = e.clientX)}
      onPointerUp={(e) => {
        if (sx.current == null) return;
        const dx = e.clientX - sx.current;
        sx.current = null;
        if (Math.abs(dx) > 60) onStep(dx < 0 ? 1 : -1);
      }}
    >
      {p && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={p.id} src={`/foto/f/${p.id}.webp`} alt={p.alt} className="lb-img" />
          <p className="lb-cap">
            <b>{num(index)}</b> / {num(N - 1)} · {p.tag}
          </p>
          <button type="button" className="lb-btn lb-prev" onClick={() => onStep(-1)} aria-label="Előző kép">
            ←
          </button>
          <button type="button" className="lb-btn lb-next" onClick={() => onStep(1)} aria-label="Következő kép">
            →
          </button>
          <button type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Bezárás" autoFocus>
            ✕
          </button>
        </>
      )}
    </dialog>
  );
}

export function Foto() {
  const [open, setOpen] = useState(-1);
  const show = useCallback((i: number) => {
    setOpen(i);
    track("foto_nagyitas", { kep: PHOTOS[i].id });
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i < 0 ? i : (i + d + N) % N)), []);
  const close = useCallback(() => setOpen(-1), []);

  return (
    <>
      <header className="ft-top">
        <a href="#top" aria-label="HRVT, a lap tetejére">
          <Wordmark className="ft-top-wm" />
        </a>
        <nav aria-label="Fő menü">
          <a href="#kontaktlap">Képek</a>
          <a href="#kapcsolat" className="ft-top-cta">
            Kapcsolat
          </a>
        </nav>
      </header>
      <main>
        <Tunnel onOpen={show} />
        <Strip onOpen={show} />
        <section id="kapcsolat" className="fc" aria-labelledby="fc-h">
          <p className="ft-mono">Kapcsolat</p>
          <h2 id="fc-h" className="ft-h2 fc-h">
            Fotózást szeretnél? <span>Írj, és megbeszéljük.</span>
          </h2>
          <div className="fc-act">
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("Fotózás")}`} className="fc-btn" data-track="email">
              {EMAIL}
            </a>
            <a href={`tel:${PHONE_TEL}`} className="fc-btn fc-btn--ghost" data-track="hivas">
              {PHONE}
            </a>
          </div>
        </section>
      </main>
      <footer className="ff">
        <Wordmark className="ff-wm" />
        <p>© 2026 HRVT · Minden kép saját fotó, felhasználás csak engedéllyel.</p>
      </footer>
      <Lightbox index={open} onClose={close} onStep={step} />
    </>
  );
}
