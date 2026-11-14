"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, onReady, prefersReduced } from "@/lib/gsap";
import { CENTER, PHOTOS } from "@/lib/photos";
import { EMAIL, PHONE, PHONE_TEL } from "@/lib/content";
import { Wordmark } from "@/components/Logo";
import { track } from "@/lib/track";

const N = PHOTOS.length;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** 1 — Opening screen: only the HRVT wordmark over the blurred portrait. */
function Hero() {
  return (
    <section id="top" className="fh" aria-label="HRVT">
      <h1 className="fh-h1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fh-wm" src="/foto/hrvt-wordmark.svg" alt="HRVT — fotók" width={2541} height={907} fetchPriority="high" />
      </h1>
    </section>
  );
}

/** Focus-distance marks on the lens scale, one per photo (near → far), shown beside the gallery. */
const MARKS = ["0,5", "0,6", "0,7", "0,8", "1", "1,2", "1,5", "2", "2,5", "3", "4", "5", "7", "10", "20", "∞"];

/**
 * 2 — Rack focus: one photo at a time stands sharp and in colour; its neighbours wait above and below,
 * blurred and black-and-white. Scrolling turns the focus ring: the next photo racks into focus.
 * Every photo has two pre-rendered layers (blurred b/w + sharp colour); focus is a crossfade, so it stays smooth on phones.
 */
function Focus({ onOpen }: { onOpen: (i: number) => void }) {
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const st = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const el = root.current!;
    const frames = [...el.querySelectorAll<HTMLElement>("[data-f]")];
    const soft = frames.map((f) => f.querySelector<HTMLElement>(".fz-soft")!);
    const sharp = frames.map((f) => f.querySelector<HTMLElement>(".fz-sharp")!);
    const scale = el.querySelector<HTMLElement>(".fz-scale-track")!;
    const reduced = prefersReduced();
    let last = -1;
    const paint = (f: number) => {
      frames.forEach((fr, i) => {
        const d = i - f;
        const a = Math.abs(d);
        if (a > 2.6) {
          fr.style.visibility = "hidden";
          return;
        }
        fr.style.visibility = "visible";
        const k = Math.min(a, 2.6);
        fr.style.transform = `translate3d(0, ${(d * 58).toFixed(2)}svh, 0) scale(${(1 - Math.min(k, 2) * 0.17).toFixed(4)})`;
        fr.style.zIndex = String(100 - Math.round(a * 10));
        fr.style.opacity = String(Math.max(0, 1 - Math.max(0, a - 1.4) / 1.2).toFixed(3));
        const focus = Math.max(0, 1 - a * 1.6);
        sharp[i].style.opacity = focus.toFixed(3);
        soft[i].style.opacity = (1 - focus * 0.85).toFixed(3);
      });
      scale.style.transform = `translate3d(0, ${(-f * 44).toFixed(2)}px, 0)`;
      const n = Math.round(f);
      if (n !== last) {
        last = n;
        setCur(n);
      }
    };
    paint(0);
    let ctx: gsap.Context | null = null;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        st.current = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (s) => paint(s.progress * (N - 1)),
          snap: reduced ? undefined : { snapTo: 1 / (N - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.inOut" },
        });
      }, el);
    });
    return () => {
      off();
      ctx?.revert();
      st.current = null;
    };
  }, []);

  // A click on a waiting (blurred) photo pulls focus to it; a click on the sharp one opens it big.
  const pick = (i: number) => {
    if (i === cur) return onOpen(i);
    const s = st.current;
    if (!s) return onOpen(i);
    const y = s.start + ((s.end - s.start) * i) / (N - 1);
    const w = window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } };
    if (w.__lenis) w.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const p = PHOTOS[cur];
  return (
    <section ref={root} id="kepek" className="fz" style={{ height: `${N * 70 + 30}svh` }} aria-labelledby="fz-h">
      <h2 id="fz-h" className="sr">
        Fotók
      </h2>
      <div className="fz-stage">
        <ul className="fz-stack">
          {PHOTOS.map((ph, i) => (
            <li key={ph.id} className="fz-frame" data-f="" style={{ ["--ar" as string]: `${ph.w} / ${ph.h}`, ["--arn" as string]: (ph.w / ph.h).toFixed(4) }}>
              <button type="button" onClick={() => pick(i)} aria-label={i === cur ? `${num(i)}. kép megnyitása nagyban: ${ph.alt}` : `Élesítés a ${num(i)}. képre: ${ph.alt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="fz-soft" src={`/foto/m/${ph.id}.webp`} alt="" aria-hidden loading={i < 3 ? "eager" : "lazy"} decoding="async" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="fz-sharp"
                  src={`/foto/t/${ph.id}.webp`}
                  srcSet={`/foto/m/${ph.id}.webp 640w, /foto/t/${ph.id}.webp 1024w`}
                  sizes="(min-width: 900px) 46vh, 62vw"
                  alt={ph.alt}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ul>

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

        <p className="fz-cap" aria-live="polite">
          <b>{num(cur)}</b>
          <span>/ {num(N - 1)}</span>
          <em>{p.tag}</em>
        </p>
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

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => document.documentElement.classList.toggle("ft-past", !e.isIntersecting), { threshold: 0.15 });
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
        <Hero />
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
