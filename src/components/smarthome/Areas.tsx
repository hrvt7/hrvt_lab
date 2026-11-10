"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

const AREAS = [
  ["Világítás", "A fény ott van, ahol te. Jelenetek, fényerő, mozgásérzékelés, és a fali kapcsoló is megmarad."],
  ["Árnyékolás", "Redőny és zsalúzia, ami tudja, merre jár a nap, mikor fúj a szél, és mikor mész aludni."],
  ["Fűtés", "Szobánként annyi meleg, amennyi kell. Nyitott ablaknál és üres háznál magától visszavesz."],
  ["Biztonság", "Kamera, riasztó, füst- és vízérzékelő egy felületen. Ha valami történik, a telefonod szól."],
  ["Energia", "Napelem, akkumulátor és autótöltő egy ütemben: akkor fogyasztasz, amikor termelsz."],
] as const;
const N = AREAS.length;

/** Pinned: one stage, five lighting moods. Each area takes over the whole screen with its own scene. */
export function Areas() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), temp = useRef<HTMLSpanElement>(null), clock = useRef<HTMLSpanElement>(null), kwh = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = root.current!, st = stage.current!;
    const reduced = prefersReduced();
    const setLocal = (p: number) => {
      const f = Math.min(N - 0.0001, p * N), i = Math.floor(f), lp = f - i;
      if (st.dataset.step !== String(i)) st.dataset.step = String(i);
      st.style.setProperty("--lp", lp.toFixed(3));
      st.style.setProperty("--p", p.toFixed(3));
      if (temp.current) temp.current.textContent = (19 + 3 * Math.min(1, i > 2 ? 1 : i < 2 ? 0 : lp * 1.3)).toFixed(1).replace(".", ",");
      if (kwh.current) kwh.current.textContent = (i < 4 ? 0 : lp * 18.4).toFixed(1).replace(".", ",");
    };
    let st1: ScrollTrigger | null = null;
    if (reduced) setLocal(0);
    else {
      st1 = ScrollTrigger.create({ trigger: el, start: "top top", end: () => `+=${window.innerHeight * (N + 0.4)}`, pin: st, scrub: true, onUpdate: (s) => setLocal(s.progress), invalidateOnRefresh: true, anticipatePin: 1 });
      setLocal(0);
    }
    // light pool follows the pointer; on touch it drifts on its own
    const move = (e: PointerEvent) => { if (e.pointerType === "touch") return; const r = st.getBoundingClientRect(); st.style.setProperty("--mx", `${e.clientX - r.left}px`); st.style.setProperty("--my", `${e.clientY - r.top}px`); };
    addEventListener("pointermove", move, { passive: true });
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick); const t = (now - t0) / 1000;
      if (!matchMedia("(hover: hover)").matches) { const r = st.getBoundingClientRect(); st.style.setProperty("--mx", `${r.width * (0.5 + Math.sin(t * 0.6) * 0.3)}px`); st.style.setProperty("--my", `${r.height * (0.66 + Math.cos(t * 0.45) * 0.14)}px`); }
      if (clock.current) { const d = new Date(); clock.current.textContent = d.toLocaleTimeString("hu-HU"); }
    };
    if (!reduced) raf = requestAnimationFrame(tick);
    return () => { st1?.kill(); removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={root} id="megoldasok" data-theme="night" className="relative bg-night">
      <div ref={stage} className="ar relative h-[100svh] overflow-hidden" data-step="0" style={{ ["--mx" as string]: "60%", ["--my" as string]: "60%" }}>
        {/* scenes */}
        <div className="ar-scene ar-s0" aria-hidden>
          <svg viewBox="0 0 800 520" className="ar-room" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 470H760M110 470V250h580v220" opacity=".5" />
            <path d="M170 470v-90q0-30 30-30h210q30 0 30 30v90M150 400h320M150 400v70M470 400v70" />
            <path d="M560 470V330M520 470h80M545 330h30l25-70h-80z" />
            <path d="M300 250v-60M270 190h60l-30-35z" />
            <path d="M620 250V150h90v100" opacity=".6" /><path d="M635 175h60v50h-60z" opacity=".6" />
            <path d="M250 300h80M250 300v40h80v-40" opacity=".55" />
          </svg>
          <div className="ar-dark" />
        </div>
        <div className="ar-scene ar-s1" aria-hidden>
          <div className="ar-window"><div className="ar-sun" />{Array.from({ length: 16 }).map((_, i) => <i key={i} style={{ ["--i" as string]: i }} />)}</div>
        </div>
        <div className="ar-scene ar-s2" aria-hidden>
          <div className="ar-heat" />
          <svg viewBox="0 0 300 300" className="ar-dial"><circle cx="150" cy="150" r="128" className="ar-dial-bg" /><circle cx="150" cy="150" r="128" className="ar-dial-fg" pathLength={1} /></svg>
          <p className="ar-temp"><span ref={temp}>19,0</span><sup>°C</sup></p>
          <svg viewBox="0 0 600 200" className="ar-waves" fill="none" stroke="currentColor" strokeWidth="2">{[0, 1, 2].map((k) => <path key={k} d={`M0 ${60 + k * 50} Q75 ${30 + k * 50} 150 ${60 + k * 50} T300 ${60 + k * 50} T450 ${60 + k * 50} T600 ${60 + k * 50}`} style={{ animationDelay: `${k * -1.3}s` }} />)}</svg>
        </div>
        <div className="ar-scene ar-s3" aria-hidden>
          <svg viewBox="0 0 800 520" className="ar-room ar-facade" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M120 470V240L400 80l280 160v230z" /><path d="M350 470V360h100v110M190 290h100v80H190zM510 290h100v80H510zM40 470h720" />
          </svg>
          <div className="ar-vf"><b /><b /><b /><b /><p className="t-meta"><i />REC <span ref={clock}>00:00:00</span></p><p className="t-meta ar-cam">CAM 02 · BEJÁRAT</p><div className="ar-scan" /><div className="ar-lock"><span className="t-meta">MOZGÁS</span></div></div>
        </div>
        <div className="ar-scene ar-s4" aria-hidden>
          <svg viewBox="0 0 800 420" className="ar-flow" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <g stroke="currentColor" strokeWidth="2.2">
              <circle cx="110" cy="90" r="40" /><path d="M110 30v-14M110 164v-14M50 90H36M184 90h-14M68 48l-10-10M162 142l-10-10M68 132l-10 10M162 48l-10 10" />
              <path d="M300 300V190l110-70 110 70v110zM270 210l140-90 140 90" /><path d="M330 190l40-26M372 164l40-26" opacity=".7" />
              <rect x="620" y="210" width="90" height="120" rx="12" /><path d="M650 200h30M640 255h50M640 285h50" />
              <path d="M330 380h150l20-40h-190z" /><circle cx="345" cy="388" r="14" /><circle cx="470" cy="388" r="14" />
            </g>
            <g className="ar-wire" strokeWidth="3">
              <path d="M150 110C220 150 260 170 330 182" /><path d="M520 250C570 250 590 260 620 270" /><path d="M410 300C410 330 410 340 405 350" />
            </g>
          </svg>
          <p className="ar-kwh"><span ref={kwh}>0,0</span> kWh <small className="t-meta">ma megtermelve</small></p>
        </div>

        {/* copy */}
        <div className="wrap relative z-10 flex h-full flex-col justify-between pb-[max(1.5rem,5svh)] pt-24 md:pt-28">
          <div className="flex items-start justify-between gap-6">
            <p className="t-meta flex items-center gap-3 text-smoke"><span className="text-kiwi">[01]</span>Megoldások · egy rendszer, öt terület</p>
            <ol className="ar-dots" aria-hidden>{AREAS.map(([t], i) => <li key={t} data-i={i} />)}</ol>
          </div>
          <div className="relative h-[12.5rem] md:h-[15rem] md:max-w-[32rem]">
            {AREAS.map(([t, d], i) => (
              <div key={t} className="ar-copy absolute inset-x-0 bottom-0" data-i={i}>
                <p className="t-meta mb-3 text-kiwi">0{i + 1} / 0{N}</p>
                <h2 className="t-xl">{t}</h2>
                <p className="t-lead mt-4 max-w-[34ch] text-smoke">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
