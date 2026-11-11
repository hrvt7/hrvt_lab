"use client";

import { useEffect, useRef } from "react";
import { gsap, onReady, prefersReduced, scrollToHash } from "@/lib/gsap";
import { HERO_WORDS, SERVICES } from "@/lib/content";
import { Wordmark } from "../Logo";
import { Magnetic } from "../Magnetic";
import { Clock } from "../Clock";
import { Scramble } from "../Scramble";
import { ArrowIcon } from "../Icons";

const LINES = ["Egyedi", "weboldalt", "építek, ami"];
/** Each rolling word arrives in its own typeface: wide grotesk, Bodoni italic, melting display, script. */
const WORD_FONT = ["f-unb", "f-bod text-[1.14em] leading-[1.02]", "f-cli", "f-gv text-[1.3em] leading-[0.95]"];

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

  // The full-screen wordmark turns liquid (same shader as the footer), loaded after the intro.
  useEffect(() => {
    if (prefersReduced()) return;
    let dead = false, stop = () => {};
    const off = onReady(() => {
      const idle = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 150));
      idle(() => import("./liquidMark").then((m) => { if (!dead) stop = m.mount(root.current!.querySelector<HTMLElement>("[data-hero-wm]")!, { hi: [0.35, 0.35, 0.35], splash: true }) ?? (() => {}); }), { timeout: 900 });
    });
    return () => { dead = true; off(); stop(); };
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
    <section ref={root} id="top" data-theme="kiwi" className="relative flex h-[100svh] min-h-[640px] flex-col bg-kiwi text-night">
      <Content />
    </section>
  );
}

const go = (h: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  scrollToHash(h);
};

/** The hero content. It is rendered twice: once in paper on night, and once in ink, which only shows where the liquid is. */
function Content({ ink = false }: { ink?: boolean }) {
  const dim = "text-night/75";
  return (
    <div className={`wrap relative z-10 flex min-h-0 flex-1 flex-col pb-6 pt-24 md:pb-8 md:pt-28 ${ink ? "h-full text-night" : ""}`}>
      <div className="hero-tag t-meta flex items-start justify-between gap-6 text-night">
        <p className="flex items-center gap-2.5">
          <i className={`h-2 w-2 rounded-full bg-night`} />
          {ink ? <span>Egyedi weboldal készítés — új projekteket vállalok</span> : <Scramble text="Egyedi weboldal készítés — új projekteket vállalok" />}
        </p>
        <p className="hidden text-right sm:block">
          Szombathely / Bécs
          <br />
          <span className="text-night">
            <Clock />
          </span>
        </p>
      </div>


      <div className="flex min-h-0 flex-1 flex-col justify-center py-4 md:py-6" data-hf="">
        <div data-hero-wm="" className="relative flex max-h-full w-full flex-col justify-center text-night">
          <Wordmark className="h-auto max-h-[62svh] w-full" />
        </div>
      </div>

      <h1 className="t-mega [contain:layout_style] md:whitespace-nowrap" style={{ fontSize: "clamp(1.7rem, min(8.4vw, 5.6vh), 2.6rem)" }}>
        {LINES.map((l, i) => (
          <span key={l}>
            <span className="mr-[0.35em] inline-block whitespace-nowrap">{ink ? l : <Letters text={l} />}</span>
            {i === 1 && <br className="md:hidden" />}
          </span>
        ))}
        <span className="inline-block align-top max-md:block">
          <span className={`relative -mt-[0.24em] inline-block h-[1.22em] overflow-hidden align-top `}>
            <span data-roll="" className="block">
              {[...HERO_WORDS, HERO_WORDS[0]].map((w, i) => (
                <span key={i} className={`block h-[1.22em] pt-[0.24em] ${WORD_FONT[i % HERO_WORDS.length]}`}>
                  {i === 0 && !ink ? <Letters text={w + "."} /> : w + "."}
                </span>
              ))}
            </span>
          </span>
        </span>
      </h1>

      <div className="relative pt-4 md:pt-6">
        <div data-hrule="" className={`h-px origin-left bg-night/30`} />
        <div className="mt-4 grid gap-4 md:mt-6 md:grid-cols-12 md:items-end md:gap-7">
          <p className={`t-lead max-w-[38ch] md:col-span-5 ${dim}`}>
            Egyedi weboldal készítés helyi vállalkozásoknak és cégeknek.{" "}
            <span className="text-night">Tervezéstől az élesítésig, egy kézben.</span>
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
                <a href="#kapcsolat" onClick={go("#kapcsolat")} className="pill pill--night" data-cursor="Írj">
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
                  <a href="#szolgaltatasok" onClick={go("#szolgaltatasok")} className="flex gap-2 hover:text-night hover:underline">
                    <span>{s.n}</span>
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
