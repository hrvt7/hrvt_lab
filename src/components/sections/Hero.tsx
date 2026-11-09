"use client";

import { useEffect, useRef } from "react";
import { gsap, onReady, prefersReduced, isFinePointer, scrollToHash } from "@/lib/gsap";
import { HERO_WORDS, SERVICES } from "@/lib/content";
import { PlusField } from "./PlusField";
import { Magnetic } from "../Magnetic";
import { Clock } from "../Clock";
import { Scramble } from "../Scramble";
import { ArrowIcon } from "../Icons";
import { Badge } from "./Badge";

const LINES = ["Szoftvert", "építek, ami"];

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
  const roll = useRef<HTMLSpanElement>(null);

  // Entrance: letters rise while their weight swells from hairline to heavy.
  useEffect(() => {
    const el = root.current!;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");
    const fades = el.querySelectorAll("[data-hf]");
    const reduced = prefersReduced();
    if (reduced) {
      chars.forEach((c) => c.style.setProperty("--w", "800"));
      return;
    }
    gsap.set(chars, { yPercent: 105 });
    gsap.set(fades, { opacity: 0, y: 16 });
    return onReady(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(chars, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.035 })
        .to(chars, { "--w": 800, duration: 1.4, ease: "power3.inOut", stagger: 0.035 }, 0.15)
        .to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: "power3.out" }, 0.7)
        .fromTo("[data-hrule]", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.4);
    });
  }, []);

  // Weight lens: letters near the pointer thin out, the rest stay heavy.
  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const el = root.current!;
    const chars = [...el.querySelectorAll<HTMLElement>("[data-ch]")];
    let rects: { x: number; y: number }[] = [];
    const cur = chars.map(() => 800);
    const measure = () => {
      rects = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
      });
    };
    let live = false;
    const off = onReady(() => setTimeout(() => ((live = true), measure()), 2600));
    const p = { x: -9999, y: -9999 };
    const move = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY + window.scrollY;
    };
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!live) return;
      const R = Math.max(220, window.innerWidth * 0.2);
      if (window.scrollY > window.innerHeight) return; // hero off-screen: nothing to do
      chars.forEach((c, i) => {
        const r = rects[i];
        const d = Math.hypot(r.x - p.x, (r.y - p.y) * 1.4);
        const k = Math.max(0, 1 - d / R);
        const target = 800 - 640 * k * k * (3 - 2 * k);
        const prev = Math.round(cur[i]);
        cur[i] += (target - cur[i]) * 0.14;
        const next = Math.round(cur[i]);
        if (next !== prev) c.style.setProperty("--w", String(next)); // only touch letters that changed
      });
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move);
    window.addEventListener("resize", measure);
    return () => {
      off();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Slot-machine word roll.
  useEffect(() => {
    if (prefersReduced()) return;
    const list = roll.current!;
    const items = list.children.length - 1; // last is a clone of the first
    let i = 0;
    let id: ReturnType<typeof setInterval>;
    const off = onReady(() => {
      id = setInterval(() => {
        i++;
        gsap.to(list, {
          yPercent: (-100 / (items + 1)) * i,
          duration: 0.9,
          ease: "expo.inOut",
          onComplete: () => {
            if (i === items) {
              i = 0;
              gsap.set(list, { yPercent: 0 });
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

  // Exit: the headline compresses vertically as you leave.
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hhead]", {
        scaleY: 0.55,
        opacity: 0.25,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const go = (h: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(h);
  };

  return (
    <section ref={root} id="top" data-theme="night" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night">
      <PlusField />
      <div className="wrap relative z-10 flex flex-1 flex-col pb-6 pt-24 md:pb-8 md:pt-28">
        <div className="t-meta flex items-start justify-between gap-6 text-smoke" data-hf="">
          <p className="flex items-center gap-2.5">
            <i className="h-2 w-2 rounded-full bg-kiwi" />
            <Scramble text="Független digitális műhely — új projekteket vállalok" />
          </p>
          <p className="hidden text-right sm:block">
            Szombathely / Bécs
            <br />
            <span className="text-paper">
              <Clock />
            </span>
          </p>
        </div>

        <div className="pointer-events-none absolute right-[var(--m)] top-[38%] hidden w-[clamp(140px,13vw,210px)] lg:block" data-hf="">
          <Badge className="aspect-square" />
        </div>

        <h1 data-hhead="" className="t-mega mt-auto pt-10 [contain:layout_style]" style={{ fontSize: "clamp(3.6rem, min(12.6vw, 16.5vh), 16rem)" }}>
          {LINES.map((l) => (
            <span key={l} className="rl">
              <Letters text={l} />
            </span>
          ))}
          <span className="block">
            <span className="relative -mt-[0.24em] inline-block h-[1.22em] overflow-hidden align-top text-kiwi">
              <span ref={roll} className="block">
                {[...HERO_WORDS, HERO_WORDS[0]].map((w, i) => (
                  <span key={i} className="block h-[1.22em] pt-[0.24em]">
                    {i === 0 ? <Letters text={w + "."} /> : w + "."}
                  </span>
                ))}
              </span>
            </span>
          </span>
        </h1>

        <div className="relative mt-8 md:mt-10">
          <div data-hrule="" className="h-px origin-left bg-line-2" />
          <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="t-lead max-w-[36ch] text-smoke md:col-span-5" data-hf="">
              AI-rendszerek, automatizálás, egyedi szoftver, prémium weboldalak és interaktív 3D.{" "}
              <span className="text-paper">Tervezéstől az élesítésig, egy kézben.</span>
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-4 md:col-start-6" data-hf="">
              <Magnetic>
                <a href="#kapcsolat" onClick={go("#kapcsolat")} className="pill pill--kiwi" data-cursor="Írj">
                  Beszéljünk a projektedről
                  <span className="pill-dot">
                    <ArrowIcon />
                  </span>
                </a>
              </Magnetic>
            </div>
            <ul className="t-meta hidden gap-1.5 text-smoke md:col-span-2 md:col-start-11 md:grid" data-hf="">
              {SERVICES.map((s) => (
                <li key={s.n}>
                  <a href="#szolgaltatasok" onClick={go("#szolgaltatasok")} className="flex gap-2 transition-colors hover:text-kiwi">
                    <span className="text-ash">{s.n}</span>
                    <Scramble text={s.title} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
