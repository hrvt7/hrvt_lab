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
 * Tabbed stage for heavy WebGL demos: shows a poster until the visitor starts it,
 * so ~1 MB of 3D only loads on intent.
 */
export function DemoStage({ demos }: { demos: Demo[] }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState<string | null>(null);
  const d = demos[active];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
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
        <a href={d.src} target="_blank" rel="noreferrer" className="t-meta inline-flex items-center gap-2 text-smoke transition-colors hover:text-kiwi" data-cursor="Megnyitás">
          Teljes képernyő <ArrowUpRight />
        </a>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-line bg-[#eef0f2] md:rounded-[30px]">
        {running === d.id ? (
          <iframe
            key={d.id}
            src={d.src}
            title={d.title}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allow="fullscreen"
          />
        ) : (
          <button
            onClick={() => setRunning(d.id)}
            className="group absolute inset-0 block h-full w-full"
            aria-label={`${d.title} — demó indítása`}
            data-cursor="Indítás"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.poster}
              alt={d.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-night/35 transition-colors duration-500 group-hover:bg-night/15" />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-kiwi py-2 pl-6 pr-2 text-night shadow-[0_20px_60px_rgba(0,0,0,.35)] transition-transform duration-500 group-hover:scale-105">
              <span className="font-medium">Élő 3D indítása</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-night text-kiwi">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M4 2.5v11L13 8z" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        )}
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
