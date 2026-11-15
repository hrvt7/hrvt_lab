"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ready } from "@/components/Ready";
import { track } from "@/lib/track";
import { HERO_ID, IG_PHOTO, IG_SMASH, SHOTS } from "./data";

const N = SHOTS.length;
const num = (i: number) => String(i + 1).padStart(2, "0");
/** All photos are 3:4 portrait. */
const AR = "3 / 4";
const ARN = 0.75;

/** The SMASH lettering, cut from the logo, painted in the brand green through a CSS mask. */
function Logo({ className }: { className: string }) {
  return <span className={className} aria-hidden />;
}

/** 1 — Opening screen: only the SMASH lettering over the blurred hero photo. */
function Hero() {
  return (
    <section id="top" className="fh" aria-label="SMASH">
      <h1 className="fh-h1">
        <span className="sr">SMASH</span>
        <Logo className="sm-logo fh-logo" />
      </h1>
      <p className="fh-sub">Audi RS e-tron GT · Aston Martin Vantage</p>
    </section>
  );
}

/** Focus-distance marks on the lens scale, one per photo (near → far). */
const MARKS = ["0,5", "0,7", "1", "1,2", "1,5", "2", "3", "4", "5", "7", "10", "∞"];

/**
 * 2 — Rack focus: one photo at a time stands sharp and in colour; its neighbours wait above and below,
 * blurred and black-and-white. Motion is CSS scroll-driven (compositor thread, no JS per frame).
 * JS only tracks which photo is in the middle (for the caption and the lens scale).
 */
function Focus({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const items = [...root.current!.querySelectorAll<HTMLElement>("[data-f]")];
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          e.target.classList.toggle("is-focus", e.isIntersecting);
          if (e.isIntersecting) setCur(Number((e.target as HTMLElement).dataset.f));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  // A tap on a waiting (blurred) photo brings it to the middle; a tap on the sharp one opens it big.
  const pick = (i: number, el: HTMLElement) => {
    if (i === cur) return onOpen(i);
    const li = el.closest("li")!;
    const w = window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } };
    if (w.__lenis) w.__lenis.scrollTo(li, { offset: -(innerHeight - li.offsetHeight) / 2, duration: 1 });
    else li.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const p = SHOTS[cur];
  return (
    <section ref={root} id="autok" className="fz" aria-labelledby="fz-h" style={{ ["--n" as string]: N }}>
      <h2 id="fz-h" className="sr">
        Az autók
      </h2>
      <div className="fz-hud" aria-live="polite">
        <div className="fz-scale" aria-hidden>
          <div className="fz-scale-track">
            {MARKS.map((m, i) => (
              <span key={i} className={i === cur ? "on" : ""}>
                {m}
              </span>
            ))}
          </div>
          <i className="fz-index" />
          <b className="fz-unit">m</b>
        </div>
        <p className="fz-cap">
          <b>{num(cur)}</b>
          <span>/ {num(N - 1)}</span>
          <em>{p.tag}</em>
        </p>
      </div>
      <ul className="fz-list">
        {SHOTS.map((ph, i) => (
          <li key={ph.id} className="fz-item" data-f={i}>
            <button
              type="button"
              className="fz-frame"
              style={{ ["--ar" as string]: AR, ["--arn" as string]: ARN }}
              onClick={(e) => pick(i, e.currentTarget)}
              aria-label={i === cur ? `${num(i)}. kép megnyitása nagyban: ${ph.alt}` : `${num(i)}. kép középre: ${ph.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fz-soft" src={`/smash/b/${ph.id}.webp`} alt="" aria-hidden decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="fz-sharp"
                src={`/smash/t/${ph.id}.webp`}
                srcSet={`/smash/m/${ph.id}.webp 480w, /smash/t/${ph.id}.webp 768w`}
                sizes="(min-width: 900px) 46vh, 62vw"
                alt={ph.alt}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>
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
  const p = index >= 0 ? SHOTS[index] : null;
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
          <img key={p.id} src={`/smash/f/${p.id}.webp`} alt={p.alt} className="lb-img" />
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

export function Smash() {
  const [open, setOpen] = useState(-1);
  const show = useCallback((i: number) => {
    setOpen(i);
    track("smash_nagyitas", { kep: SHOTS[i].id });
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i < 0 ? i : (i + d + N) % N)), []);
  const close = useCallback(() => setOpen(-1), []);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => document.documentElement.classList.toggle("sm-past", !e.isIntersecting), { threshold: 0.15 });
    io.observe(hero);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("sm-past");
    };
  }, []);

  return (
    <div className="smash">
      <Ready />
      <div className="ft-backdrop" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/smash/m/${HERO_ID}.webp`} alt="" fetchPriority="high" />
      </div>
      <header className="ft-top">
        <a href="#top" aria-label="SMASH, a lap tetejére">
          <Logo className="sm-logo ft-top-logo" />
        </a>
        <nav aria-label="Fő menü">
          <a href="#autok">Autók</a>
          <a href="#kapcsolat" className="ft-top-cta">
            Instagram
          </a>
        </nav>
      </header>
      <main>
        <Hero />
        <Focus onOpen={show} />
        <section id="kapcsolat" className="fc" aria-labelledby="fc-h">
          <p className="ft-mono">Kövesd</p>
          <h2 id="fc-h" className="ft-h2 fc-h">
            A SMASH autói <span>az Instagramon.</span>
          </h2>
          <div className="fc-act">
            <a href={IG_SMASH} className="fc-btn" target="_blank" rel="noopener" data-track="instagram">
              @1kocsis
            </a>
            <a href={IG_PHOTO} className="fc-btn fc-btn--ghost" target="_blank" rel="noopener" data-track="fotos">
              Fotók: @sz_geri
            </a>
          </div>
        </section>
      </main>
      <footer className="ff">
        <Logo className="sm-logo ff-logo" />
        <p>
          Koncepcióterv, nem hivatalos oldal. A SMASH hivatalos felülete:{" "}
          <a href={IG_SMASH} target="_blank" rel="noopener">
            instagram.com/1kocsis
          </a>
          . Fotók:{" "}
          <a href={IG_PHOTO} target="_blank" rel="noopener">
            @sz_geri
          </a>
          , felhasználás csak engedéllyel.
        </p>
      </footer>
      <Lightbox index={open} onClose={close} onStep={step} />
    </div>
  );
}
