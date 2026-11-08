"use client";

import { useState } from "react";
import { CAPABILITIES } from "@/lib/content";
import { Label, Lines } from "./Lines";

const ICONS: Record<string, React.ReactNode> = {
  ai: (
    <>
      <circle cx="24" cy="24" r="6" pathLength={1} />
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8M10 10l6 6M32 32l6 6M38 10l-6 6M16 32l-6 6" pathLength={1} />
    </>
  ),
  flow: (
    <>
      <rect x="4" y="6" width="14" height="10" rx="2" pathLength={1} />
      <rect x="30" y="19" width="14" height="10" rx="2" pathLength={1} />
      <rect x="4" y="32" width="14" height="10" rx="2" pathLength={1} />
      <path d="M18 11h6v26h-6M24 24h6" pathLength={1} />
    </>
  ),
  web: (
    <>
      <rect x="4" y="8" width="40" height="32" rx="3" pathLength={1} />
      <path d="M4 16h40M10 26h16M10 32h10" pathLength={1} />
      <circle cx="35" cy="29" r="4" pathLength={1} />
    </>
  ),
  cube: (
    <>
      <path d="M24 4l18 10v20L24 44 6 34V14z" pathLength={1} />
      <path d="M6 14l18 10 18-10M24 24v20" pathLength={1} />
    </>
  ),
};

export function Capabilities() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="capabilities" className="wrap section">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <Label n="03">Capabilities</Label>
          </div>
        </div>
        <div className="md:col-span-9">
          <Lines
            className="t-display-l mb-16 md:mb-24"
            lines={[
              "Four disciplines.",
              <>
                One <span className="t-serif">standard</span>.
              </>,
            ]}
          />

          <ul className="border-t border-line">
            {CAPABILITIES.map((c, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={c.n}
                  className="cap-row group border-b border-line"
                  data-open={isOpen}
                  onMouseEnter={() => setOpen(i)}
                  data-fade=""
                >
                  <button
                    className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[4rem_1fr_auto] md:py-9"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    data-cursor=""
                  >
                    <span className="t-meta text-bone-3">{c.n}</span>
                    <span
                      className="font-display text-[clamp(1.9rem,4.4vw,4.2rem)] font-[640] leading-[1] tracking-[-0.045em] transition-[transform,color] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{
                        transform: isOpen ? "translateX(0.35em)" : "none",
                        color: isOpen ? "var(--color-bone)" : "var(--color-bone-2)",
                      }}
                    >
                      {c.title}
                    </span>
                    <span
                      className="relative grid h-10 w-10 place-items-center rounded-full border border-line-2 transition-[transform,background-color] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "none",
                        background: isOpen ? "var(--color-ember)" : "transparent",
                        borderColor: isOpen ? "var(--color-ember)" : undefined,
                      }}
                      aria-hidden
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                        <path d="M6 1v10M1 6h10" stroke={isOpen ? "#080807" : "currentColor"} strokeWidth="1.4" />
                      </svg>
                    </span>
                  </button>
                  <div className="drawer">
                    <div>
                      <div className="grid gap-8 pb-10 md:grid-cols-[4rem_1fr_1fr_auto] md:gap-4">
                        <span />
                        <p className="t-body-l max-w-[30ch] text-bone">{c.lede}</p>
                        <div>
                          <p className="mb-5 max-w-[44ch] text-bone-2">{c.body}</p>
                          <ul className="flex flex-wrap gap-2">
                            {c.tags.map((t) => (
                              <li key={t} className="t-meta rounded-full border border-line px-3 py-1.5 text-[0.62rem] text-bone-2">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <svg
                          viewBox="0 0 48 48"
                          className="cap-icon hidden h-16 w-16 text-ember md:block"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          aria-hidden
                        >
                          {ICONS[c.icon]}
                        </svg>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
