"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, onReady, scrollToHash } from "@/lib/gsap";
import { NAV, EMAIL } from "@/lib/content";
import { Clock } from "./Clock";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = bar.current!;
    gsap.set(el, { yPercent: -120 });
    const off = onReady(() => gsap.to(el, { yPercent: 0, duration: 1.2, delay: 0.5 }));
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const hide = self.direction === 1 && y > 240;
        if (hide !== hidden) {
          hidden = hide;
          gsap.to(el, { yPercent: hide ? -120 : 0, duration: 0.7, ease: "expo.out" });
        }
      },
    });
    return () => {
      off();
      st.kill();
    };
  }, []);

  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) {
      lenis?.stop();
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(
        m.querySelectorAll("[data-mi]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.06, delay: 0.35 },
      );
    } else {
      lenis?.start();
      gsap.to(m, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.7,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(m, { display: "none" });
        },
      });
    }
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToHash(href), open ? 450 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className="wrap fixed inset-x-0 top-0 z-[80] flex h-20 items-center justify-between text-bone mix-blend-difference"
      >
        <a href="#top" onClick={go("#top")} className="group flex items-center gap-3" aria-label="HRVT — home">
          <Mark />
          <span className="font-display text-[1.05rem] font-[760] tracking-[-0.04em]">HRVT</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="t-meta link-u pb-0.5 text-bone">
              <span className="mr-1.5 text-bone-3">0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <span className="t-meta text-bone-2">
            <Clock />
          </span>
          <a href="#contact" onClick={go("#contact")} className="t-meta link-u pb-0.5">
            Start a project
          </a>
        </div>

        <button
          className="t-meta relative z-[85] flex h-11 items-center gap-3 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "Close" : "Menu"}
          <span className="relative block h-2.5 w-5">
            <span
              className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500"
              style={{ transform: open ? "translateY(5px) rotate(45deg)" : "none" }}
            />
            <span
              className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500"
              style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="wrap fixed inset-0 z-[79] hidden flex-col justify-between bg-ink-900 pb-10 pt-28"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {[...NAV, { label: "Contact", href: "#contact" }].map((n, i) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="block overflow-hidden">
              <span data-mi="" className="t-display-l flex items-baseline gap-4" style={{ fontSize: "clamp(2.8rem,13vw,5rem)" }}>
                <span className="t-meta text-bone-3">0{i + 1}</span>
                {n.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="t-meta flex items-end justify-between text-bone-2">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <Clock />
        </div>
      </div>
    </>
  );
}

export function Mark({ className = "h-[22px] w-[22px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6v12M17 6v12M7 12h10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="6" r="1.6" fill="#ff5a1f" />
    </svg>
  );
}
