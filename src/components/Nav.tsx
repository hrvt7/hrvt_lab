"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, onReady, scrollToHash } from "@/lib/gsap";
import { NAV, EMAIL } from "@/lib/content";
import { Wordmark } from "./Logo";
import { Scramble } from "./Scramble";
import { SoundToggle } from "./SoundToggle";
import { pour } from "@/lib/sound";

const FACE = ["f-ins", "f-bag", "f-bod", "f-unb"];
const SIZE = ["1.35em", "1.05em", "1.25em", "0.8em"];

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const level = useRef({ v: 0, dir: 0 });
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    gsap.set(bar.current, { yPercent: -100 });
    return onReady(() => gsap.to(bar.current, { yPercent: 0, duration: 1, delay: 0.6, ease: "expo.out" }));
  }, []);

  useEffect(() => {
    const m = menu.current!;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    // The menu fills with kiwi liquid from the bottom: a sloshing surface rises past the items,
    // and each item surfaces (in its own typeface) as the level reaches it. Closing drains it.
    const path = m.querySelector<SVGPathElement>("[data-fill] path")!;
    const lv = level.current;
    const draw = () => {
      const W = innerWidth, H = innerHeight, t = performance.now() / 1000, L = lv.v;
      const amp = 26 * Math.sin(Math.min(1, L) * Math.PI) + 4 * (1 - Math.min(1, L));
      const top = H * (1 - L) - (L >= 1 ? 60 : 0);
      let d = `M0 ${H + 2}`;
      for (let k = 0; k <= 40; k++) {
        const x = (k / 40) * W;
        d += `L${x.toFixed(1)} ${(top + Math.sin(x * 0.011 + t * 4 + lv.dir) * amp + Math.sin(x * 0.027 - t * 6) * amp * 0.35).toFixed(1)}`;
      }
      path.setAttribute("d", `${d}L${W} ${H + 2}Z`);
    };
    gsap.ticker.remove(drawRef.current);
    drawRef.current = draw;
    if (open) {
      lenis?.stop();
      pour({ dur: 0.9, gain: 0.1 });
      gsap.set(m, { display: "flex" });
      gsap.set(m.querySelectorAll("[data-mi]"), { yPercent: 110 });
      gsap.ticker.add(draw);
      lv.dir = 0;
      gsap.fromTo(lv, { v: 0 }, { v: 1.06, duration: 0.95, ease: "power2.inOut", onComplete: () => void gsap.ticker.remove(draw) });
      gsap.fromTo(m.querySelectorAll("[data-mi]"), { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: { each: 0.08, from: "end" }, delay: 0.5, ease: "elastic.out(1,0.7)" });
      gsap.fromTo(m.querySelectorAll("[data-mfade]"), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.7 });
    } else if (m.style.display === "flex") {
      lenis?.start();
      gsap.ticker.add(draw);
      lv.dir = 2;
      gsap.to(m.querySelectorAll("[data-mi]"), { yPercent: 110, duration: 0.35, stagger: 0.03, ease: "power2.in" });
      gsap.to(m.querySelectorAll("[data-mfade]"), { opacity: 0, duration: 0.2 });
      gsap.to(lv, { v: 0, duration: 0.7, delay: 0.15, ease: "power2.in", onComplete: () => { gsap.ticker.remove(draw); gsap.set(m, { display: "none" }); } });
    }
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => scrollToHash(href), wasOpen ? 500 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className="wrap fixed inset-x-0 top-0 z-[80] flex h-[72px] items-center justify-between text-paper transition-colors duration-500 [html[data-nav=kiwi]_&]:text-night"
      >
        <a href="#top" onClick={go("#top")} aria-label="HRVT — vissza a tetejére" data-cursor="Fel">
          <Wordmark className="h-[22px] w-auto" />
        </a>
        <nav className="hidden items-center gap-1 rounded-full p-1 lg:flex" aria-label="Fő navigáció">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={go(n.href)}
              className="t-meta rounded-full px-4 py-2.5 transition-colors duration-300 hover:bg-paper/10 [html[data-nav=kiwi]_&]:hover:bg-night/10"
            >
              <Scramble text={n.label} />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <a
            href="#kapcsolat"
            onClick={go("#kapcsolat")}
            className="t-meta hidden h-10 items-center rounded-full bg-kiwi px-5 text-night transition-colors duration-300 hover:bg-paper sm:inline-flex [html[data-nav=kiwi]_&]:bg-night [html[data-nav=kiwi]_&]:text-kiwi"
          >
            <Scramble text="Beszéljünk" />
          </a>
          <button
            className="relative z-[85] grid h-10 w-10 place-items-center rounded-full bg-paper text-night lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Menü bezárása" : "Menü"}
          >
            <span className="relative block h-2.5 w-4">
              <i className="absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500" style={{ transform: open ? "translateY(4.5px) rotate(45deg)" : "none" }} />
              <i className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500" style={{ transform: open ? "translateY(-4.5px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </header>

      <div ref={menu} id="menu" className="wrap fixed inset-0 z-[79] hidden flex-col justify-between pb-8 pt-28 text-night">
        <svg data-fill="" aria-hidden className="pointer-events-none absolute inset-0 -z-[1] h-full w-full overflow-visible">
          <path fill="#89e900" />
        </svg>
        <nav className="flex flex-col" aria-label="Mobil navigáció">
          {[...NAV, { label: "Kapcsolat", href: "#kapcsolat" }].map((n, i) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="block overflow-hidden border-b border-line-ink py-2">
              <span data-mi="" className="flex items-baseline justify-between py-1 leading-none" style={{ fontSize: "clamp(1.6rem,8vw,2.8rem)" }}>
                <span className={FACE[i]} style={{ fontSize: SIZE[i] }}>{n.label}</span>
                <span className="t-meta">0{i + 1}</span>
              </span>
            </a>
          ))}
        </nav>
        <a href={`mailto:${EMAIL}`} className="t-meta" data-mfade="">
          {EMAIL}
        </a>
      </div>
    </>
  );
}
