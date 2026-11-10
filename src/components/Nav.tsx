"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, onReady, scrollToHash } from "@/lib/gsap";
import { NAV, EMAIL } from "@/lib/content";
import { Wordmark } from "./Logo";
import { Scramble } from "./Scramble";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    gsap.set(bar.current, { yPercent: -100 });
    return onReady(() => gsap.to(bar.current, { yPercent: 0, duration: 1, delay: 0.6, ease: "expo.out" }));
  }, []);

  useEffect(() => {
    const m = menu.current!;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) {
      lenis?.stop();
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(m.querySelectorAll("[data-mi]"), { yPercent: 100 }, { yPercent: 0, duration: 0.9, stagger: 0.05, delay: 0.3, ease: "expo.out" });
    } else if (m.style.display === "flex") {
      lenis?.start();
      gsap.to(m, { clipPath: "circle(0% at 100% 0%)", duration: 0.6, ease: "expo.inOut", onComplete: () => void gsap.set(m, { display: "none" }) });
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

      <div ref={menu} id="menu" className="wrap fixed inset-0 z-[79] hidden flex-col justify-between bg-kiwi pb-8 pt-28 text-night">
        <nav className="flex flex-col" aria-label="Mobil navigáció">
          {[...NAV, { label: "Kapcsolat", href: "#kapcsolat" }].map((n, i) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="block overflow-hidden border-b border-line-ink py-1">
              <span data-mi="" className="t-l flex items-baseline justify-between" style={{ fontSize: "clamp(1.3rem,6vw,2.4rem)" }}>
                {n.label}
                <span className="t-meta">0{i + 1}</span>
              </span>
            </a>
          ))}
        </nav>
        <a href={`mailto:${EMAIL}`} className="t-meta">
          {EMAIL}
        </a>
      </div>
    </>
  );
}
