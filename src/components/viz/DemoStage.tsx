"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Demo = {
  id: string;
  tab: string;
  title: string;
  src: string;
  poster: string;
  alt: string;
  body: string;
  facts: [string, string][];
};

type Lenis = { stop(): void; start(): void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Stage for heavy WebGL demos (fixed 1600×900 layouts that scale themselves to their viewport).
 * - Poster until the visitor starts it, so the 1–4 MB of 3D only loads on intent.
 * - Plays in the page on every device. On touch screens the inline frame is "watch mode" (the auto tour runs,
 *   the page still scrolls over it); "Kipróbálom" switches to an immersive full-screen mode.
 * - Full screen: native Fullscreen API + landscape lock where supported (desktop, Android); elsewhere (iPhone)
 *   a fixed overlay that rotates the 16:9 frame to landscape when the phone is held upright.
 *   The iframe is never re-parented, so switching modes never reloads the demo.
 * - Rendering is suspended (display:none) while the stage is far off screen.
 */
export function DemoStage({ demos }: { demos: Demo[] }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [full, setFull] = useState(false);
  const [touch, setTouch] = useState(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [near, setNear] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const d = demos[active];

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const set = () => setTouch(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Pause off-screen demos.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const exitFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setFull(false);
  }, []);

  // Full-screen bookkeeping: viewport size, Esc, native fullscreen exit, scroll lock.
  useEffect(() => {
    if (!full) return;
    const size = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    size();
    const key = (e: KeyboardEvent) => e.key === "Escape" && exitFull();
    const fs = () => !document.fullscreenElement && setFull(false);
    window.addEventListener("resize", size);
    window.addEventListener("keydown", key);
    document.addEventListener("fullscreenchange", fs);
    lenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", key);
      document.removeEventListener("fullscreenchange", fs);
      lenis()?.start();
      document.documentElement.style.overflow = "";
    };
  }, [full, exitFull]);

  const enterFull = () => {
    setFull(true);
    const el = frame.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen({ navigationUI: "hide" })
        .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })?.lock?.("landscape"))
        .catch(() => {});
    }
  };

  const start = (andFull = false) => {
    // The pointer is about to sit over an iframe, which the page never hears from: drop the custom cursor.
    window.dispatchEvent(new Event("hrvt:cursor-hide"));
    if (running !== d.id) {
      setLoaded(false);
      setRunning(d.id);
    }
    // Wait one frame so the frame wrapper exists before asking for full screen.
    if (andFull) requestAnimationFrame(() => requestAnimationFrame(enterFull));
  };

  const portrait = full && vp.h > vp.w;
  // The outer wrapper is what goes full screen (the UA forbids transforms on it); the inner layer rotates
  // the 16:9 frame to landscape whenever the screen is still upright (iPhone, or a refused orientation lock).
  const fullStyle: React.CSSProperties = { position: "fixed", inset: 0, width: "100vw", height: "100dvh", zIndex: 400 };
  const rotStyle: React.CSSProperties = portrait
    ? { position: "absolute", top: 0, left: 0, width: vp.h, height: vp.w, transform: `translateX(${vp.w}px) rotate(90deg)`, transformOrigin: "0 0" }
    : { position: "absolute", inset: 0 };
  const live = running === d.id;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        {demos.length > 1 ? (
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-night-2 p-1 [scrollbar-width:none]" role="tablist" aria-label="Demók">
            {demos.map((x, i) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setRunning(null);
                  setFull(false);
                }}
                className={`t-meta shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[0.64rem] transition-colors duration-300 ${
                  i === active ? "bg-kiwi text-night" : "text-smoke hover:text-paper"
                }`}
                data-cursor=""
              >
                {x.tab}
              </button>
            ))}
          </div>
        ) : (
          <p className="t-meta text-smoke">{d.tab}</p>
        )}
        <button onClick={() => start(true)} className="t-meta inline-flex items-center gap-2 text-smoke transition-colors hover:text-kiwi" data-cursor="">
          Teljes képernyő <ExpandIcon />
        </button>
      </div>

      <div className="mx-auto w-full md:w-[min(100%,calc((100svh-140px)*16/9))]">
        <div ref={box} className="relative aspect-video overflow-hidden rounded-[14px] border border-line bg-[#e9ebee] md:rounded-[26px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${d.poster}-1400.webp`}
            srcSet={`${d.poster}-800.webp 800w, ${d.poster}-1400.webp 1400w, ${d.poster}.webp 1600w`}
            sizes="(min-width: 768px) 90vw, 100vw"
            alt={d.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {live ? (
            <div
              ref={frame}
              className="bg-[#e9ebee]"
              style={full ? fullStyle : { position: "absolute", inset: 0, display: near ? "block" : "none" }}
            >
              <div style={rotStyle}>
              <iframe
                key={d.id}
                src={d.src}
                title={d.title}
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
                style={{ opacity: loaded ? 1 : 0, pointerEvents: touch && !full ? "none" : "auto" }}
                allow="fullscreen"
              />
              {!loaded && (
                <span className="t-meta absolute inset-0 grid place-items-center bg-night/40 text-paper">
                  <span className="flex items-center gap-3 rounded-full bg-night px-5 py-3">
                    <i className="h-2 w-2 animate-pulse rounded-full bg-kiwi" />
                    3D betöltése…
                  </span>
                </span>
              )}
              {full ? (
                <button
                  onClick={exitFull}
                  className="t-meta absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-night px-4 py-2.5 text-[0.62rem] text-paper shadow-lg"
                  aria-label="Teljes képernyő bezárása"
                >
                  Bezárás <span aria-hidden>✕</span>
                </button>
              ) : touch ? (
                loaded && (
                  <button
                    onClick={enterFull}
                    className="absolute inset-0 flex items-end justify-center pb-3"
                    aria-label={`${d.title} — kipróbálás teljes képernyőn`}
                  >
                    <span className="flex items-center gap-2 rounded-full bg-kiwi py-1.5 pl-4 pr-1.5 text-[0.8rem] font-medium text-night shadow-[0_10px_30px_rgba(0,0,0,.3)]">
                      Kipróbálom
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-night text-kiwi">
                        <ExpandIcon />
                      </span>
                    </span>
                  </button>
                )
              ) : (
                loaded && (
                  <button
                    onClick={enterFull}
                    className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-night/85 text-paper backdrop-blur transition-colors hover:bg-kiwi hover:text-night"
                    aria-label="Teljes képernyő"
                    data-cursor="Teljes"
                  >
                    <ExpandIcon />
                  </button>
                )
              )}
              </div>
            </div>
          ) : (
            <button onClick={() => start()} className="group absolute inset-0 block h-full w-full" aria-label={`${d.title} — élő 3D indítása`} data-cursor="Indítás">
              <span className="absolute inset-0 bg-night/30 transition-colors duration-500 group-hover:bg-night/10" />
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-kiwi py-1.5 pl-4 pr-1.5 text-[0.86rem] text-night shadow-[0_20px_60px_rgba(0,0,0,.35)] transition-transform duration-500 group-hover:scale-105 md:py-2 md:pl-6 md:pr-2 md:text-base">
                <span className="font-medium">Élő 3D indítása</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-night text-kiwi md:h-10 md:w-10">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                    <path d="M4 2.5v11L13 8z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
        {touch && live && !full && <p className="t-meta mt-3 text-center text-[0.6rem] text-ash">Automatikus bemutató · a „Kipróbálom” gombbal irányíthatod</p>}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <h4 className="t-m mb-4">{d.title}</h4>
          <p className="max-w-[46ch] text-smoke">{d.body}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-end text-[0.92rem] md:col-span-6 md:col-start-7 md:grid-cols-4">
          {d.facts.map(([k, v]) => (
            <div key={k} className="min-w-0 border-t border-line pt-3">
              <dt className="t-meta mb-1 text-[0.62rem] text-ash">{k}</dt>
              <dd className="text-paper">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
    </svg>
  );
}
