"use client";

import { useEffect, useRef } from "react";
import { gsap, onReady, prefersReduced, scrollToHash } from "@/lib/gsap";
import { HERO_WORDS, SERVICES } from "@/lib/content";
import { LensScene } from "./LensScene";
import { Magnetic } from "../Magnetic";
import { Clock } from "../Clock";
import { Scramble } from "../Scramble";
import { ArrowIcon } from "../Icons";

const LINES = ["Egyedi", "weboldalt", "építek, ami"];

function Letters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} data-ch="" className="inline-block whitespace-pre" style={{ ["--w" as string]: 100 }}>
          {ch}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // Entrance: letters rise while their weight swells from hairline to heavy.
  useEffect(() => {
    const el = root.current!;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");
    const fades = el.querySelectorAll("[data-hf]");
    if (prefersReduced()) {
      chars.forEach((c) => c.style.setProperty("--w", "650"));
      return;
    }
    gsap.set(chars, { yPercent: 105 });
    gsap.set(fades, { opacity: 0, y: 16 });
    return onReady(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(chars, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.022 }, 0.32)
        .to(chars, { "--w": 650, duration: 0.9, ease: "power2.out", stagger: 0.022 }, 0)
        .to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.04, ease: "power3.out" }, 0.7)
        .fromTo(el.querySelectorAll("[data-hrule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.4);
    });
  }, []);

  // Slot-machine word roll (both the paper and the ink copy move together).
  useEffect(() => {
    if (prefersReduced()) return;
    const lists = root.current!.querySelectorAll<HTMLElement>("[data-roll]");
    const items = HERO_WORDS.length;
    let i = 0;
    let id: ReturnType<typeof setInterval>;
    const off = onReady(() => {
      id = setInterval(() => {
        i++;
        gsap.to(lists, {
          yPercent: (-100 / (items + 1)) * i,
          duration: 0.9,
          ease: "expo.inOut",
          onComplete: () => {
            if (i === items) {
              i = 0;
              gsap.set(lists, { yPercent: 0 });
            }
          },
        });
      }, 2400);
    });
    return () => {
      off();
      clearInterval(id);
    };
  }, []);

  return (
    <section ref={root} id="top" data-theme="night" className="relative bg-night" style={{ height: "260svh" }}>
      <LensScene />
      <div data-hero-content="" className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[100svh] flex-col [&_a]:pointer-events-auto [&_h1]:[text-shadow:0_2px_28px_rgba(0,0,0,.45)]">
        <Content />
      </div>
    </section>
  );
}

const go = (h: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  scrollToHash(h);
};

/** The hero content. It is rendered twice: once in paper on night, and once in ink, which only shows where the liquid is. */
function Content({ ink = false }: { ink?: boolean }) {
  const dim = ink ? "text-night" : "text-smoke";
  return (
    <div className={`wrap relative z-10 flex flex-1 flex-col pb-6 pt-24 md:pb-8 md:pt-28 ${ink ? "h-full text-night" : ""}`}>
      <div className={`hero-tag t-meta flex items-start justify-between gap-6 ${dim}`} data-hf="">
        <p className="flex items-center gap-2.5">
          <i className={`h-2 w-2 rounded-full ${ink ? "bg-night" : "bg-kiwi"}`} />
          {ink ? <span>Egyedi weboldal készítés — új projekteket vállalok</span> : <Scramble text="Egyedi weboldal készítés — új projekteket vállalok" />}
        </p>
        <p className="hidden text-right sm:block">
          Szombathely / Bécs
          <br />
          <span className={ink ? "" : "text-paper"}>
            <Clock />
          </span>
        </p>
      </div>


      <h1 className="t-mega mt-auto pt-10 [contain:layout_style] max-md:bg-night max-md:shadow-[0_-36px_32px_-6px_var(--color-night)]" style={{ fontSize: "clamp(1.7rem, min(7.3vw, 9.6vh), 5.6rem)" }}>
        {LINES.map((l) => (
          <span key={l} className="rl whitespace-nowrap">
            {ink ? l : <Letters text={l} />}
          </span>
        ))}
        <span className="block">
          <span className={`relative -mt-[0.24em] inline-block h-[1.22em] overflow-hidden align-top ${ink ? "" : "text-kiwi"}`}>
            <span data-roll="" className="block">
              {[...HERO_WORDS, HERO_WORDS[0]].map((w, i) => (
                <span key={i} className="block h-[1.22em] pt-[0.24em]">
                  {i === 0 && !ink ? <Letters text={w + "."} /> : w + "."}
                </span>
              ))}
            </span>
          </span>
        </span>
      </h1>

      <div className="relative pt-7 max-md:-mb-6 max-md:bg-night max-md:pb-6 md:mt-9 md:pt-0">
        <div data-hrule="" className={`h-px origin-left ${ink ? "bg-night/40" : "bg-line-2"}`} />
        <div className="mt-6 grid gap-7 md:grid-cols-12 md:items-end">
          <p className={`t-lead max-w-[38ch] md:col-span-5 ${dim}`}>
            Egyedi weboldal készítés helyi vállalkozásoknak és cégeknek.{" "}
            <span className={ink ? "" : "text-paper"}>Tervezéstől az élesítésig, egy kézben.</span>
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:col-start-6" data-hf="">
            {ink ? (
              <span className="pill bg-night text-white">
                Kérek egy weboldalt
                <span className="pill-dot bg-white text-night">
                  <ArrowIcon />
                </span>
              </span>
            ) : (
              <Magnetic>
                <a href="#kapcsolat" onClick={go("#kapcsolat")} className="pill pill--kiwi" data-cursor="Írj">
                  Kérek egy weboldalt
                  <span className="pill-dot">
                    <ArrowIcon />
                  </span>
                </a>
              </Magnetic>
            )}
          </div>
          <ul className={`t-meta hidden gap-1.5 md:col-span-2 md:col-start-11 md:grid ${dim}`} data-hf="">
            {SERVICES.map((s) => (
              <li key={s.n}>
                {ink ? (
                  <span className="flex gap-2">
                    <span>{s.n}</span>
                    <span>{s.title}</span>
                  </span>
                ) : (
                  <a href="#szolgaltatasok" onClick={go("#szolgaltatasok")} className="flex gap-2 transition-colors hover:text-kiwi">
                    <span className="text-ash">{s.n}</span>
                    <Scramble text={s.title} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
