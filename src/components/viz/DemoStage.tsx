"use client";

import { useState } from "react";
import { ArrowUpRight } from "../Icons";

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

/**
 * Stage for heavy WebGL demos (fixed 16:9 layouts). Shows a poster until the visitor starts it,
 * so ~1 MB of 3D only loads on intent. On small screens it opens full screen instead of a tiny inline frame.
 * Height is capped to the viewport so the page can always be scrolled past it.
 */
export function DemoStage({ demos }: { demos: Demo[] }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const d = demos[active];

  const start = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.open(d.src, "_blank", "noopener");
      return;
    }
    setLoaded(false);
    setRunning(d.id);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        {demos.length > 1 ? (
          <div className="flex gap-1 rounded-full bg-night-2 p-1" role="tablist" aria-label="Demók">
            {demos.map((x, i) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setRunning(null);
                }}
                className={`t-meta rounded-full px-4 py-2.5 text-[0.64rem] transition-colors duration-300 ${
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
        <a href={d.src} target="_blank" rel="noreferrer" className="t-meta inline-flex items-center gap-2 text-smoke transition-colors hover:text-kiwi" data-cursor="Megnyitás">
          Teljes képernyő <ArrowUpRight />
        </a>
      </div>

      <div className="mx-auto w-full md:w-[min(100%,calc((100svh-140px)*16/9))]">
        <div className="relative aspect-video overflow-hidden rounded-[18px] border border-line bg-[#e9ebee] md:rounded-[26px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${d.poster}-1400.webp`} srcSet={`${d.poster}-800.webp 800w, ${d.poster}-1400.webp 1400w, ${d.poster}.webp 1600w`} sizes="(min-width: 768px) 90vw, 100vw" alt={d.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          {running === d.id ? (
            <>
              {!loaded && (
                <span className="t-meta absolute inset-0 grid place-items-center bg-night/40 text-paper">
                  <span className="flex items-center gap-3 rounded-full bg-night px-5 py-3">
                    <i className="h-2 w-2 animate-pulse rounded-full bg-kiwi" />
                    3D betöltése…
                  </span>
                </span>
              )}
              <iframe
                key={d.id}
                src={d.src}
                title={d.title}
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
                style={{ opacity: loaded ? 1 : 0 }}
                allow="fullscreen"
              />
            </>
          ) : (
            <button onClick={start} className="group absolute inset-0 block h-full w-full" aria-label={`${d.title} — élő 3D indítása`} data-cursor="Indítás">
              <span className="absolute inset-0 bg-night/30 transition-colors duration-500 group-hover:bg-night/10" />
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-kiwi py-2 pl-5 pr-2 text-[0.92rem] text-night shadow-[0_20px_60px_rgba(0,0,0,.35)] transition-transform duration-500 group-hover:scale-105 md:pl-6 md:text-base">
                <span className="font-medium">Élő 3D indítása</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-night text-kiwi md:h-10 md:w-10">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                    <path d="M4 2.5v11L13 8z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
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
