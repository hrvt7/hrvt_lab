"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CENTER, PHOTOS } from "@/lib/photos";
import { EMAIL, PHONE, PHONE_TEL } from "@/lib/content";
import { Wordmark } from "@/components/Logo";
import { track } from "@/lib/track";
import { Darkroom } from "./Darkroom";

const N = PHOTOS.length;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** Focus-distance marks on the lens scale, one per photo (near → far), shown beside the gallery. */
const MARKS = ["0,5", "0,6", "0,7", "0,8", "1", "1,2", "1,5", "2", "2,5", "3", "4", "5", "7", "10", "20", "∞"];

/**
 * 2 — Rack focus: one photo at a time stands sharp and in colour; its neighbours wait above and below,
 * blurred and black-and-white. All motion is CSS scroll-driven (compositor thread, no JS per frame):
 * each frame scales up and its sharp colour layer fades in as it reaches the middle of the screen.
 * The blur is a tiny pre-rendered greyscale image scaled up, so no blur filter runs while scrolling.
 * Phones snap natively to each photo. JS only tracks which photo is in the middle (for the caption).
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

  const p = PHOTOS[cur];
  return (
    <section ref={root} id="kepek" className="fz" aria-labelledby="fz-h" style={{ ["--n" as string]: N }}>
      <h2 id="fz-h" className="sr">
        Fotók
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
        {PHOTOS.map((ph, i) => (
          <li key={ph.id} className="fz-item" data-f={i}>
            <button
              type="button"
              className="fz-frame"
              style={{ ["--ar" as string]: `${ph.w} / ${ph.h}`, ["--arn" as string]: (ph.w / ph.h).toFixed(4) }}
              onClick={(e) => pick(i, e.currentTarget)}
              aria-label={i === cur ? `${num(i)}. kép megnyitása nagyban: ${ph.alt}` : `${num(i)}. kép középre: ${ph.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fz-soft" src={`/foto/b/${ph.id}.webp`} alt="" aria-hidden decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="fz-sharp"
                src={`/foto/t/${ph.id}.webp`}
                srcSet={`/foto/m/${ph.id}.webp 640w, /foto/t/${ph.id}.webp 1024w`}
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

  useEffect(() => {
    // The last screen of the opening (the wordmark over the backdrop) behaves like the old one-screen hero.
    const hero = document.querySelector(".fd-end");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([e]) => document.documentElement.classList.toggle("ft-past", !e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0.15 },
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("ft-past");
    };
  }, []);

  return (
    <>
      <div className="ft-backdrop" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/foto/m/${CENTER.id}.webp`} alt="" fetchPriority="high" />
      </div>
      <header className="ft-top">
        <a href="#top" aria-label="HRVT, a lap tetejére">
          <Wordmark className="ft-top-wm" />
        </a>
        <nav aria-label="Fő menü">
          <a href="#kepek">Képek</a>
          <a href="#kapcsolat" className="ft-top-cta">
            Kapcsolat
          </a>
        </nav>
      </header>
      <main>
        <Darkroom />
        <Focus onOpen={show} />
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
