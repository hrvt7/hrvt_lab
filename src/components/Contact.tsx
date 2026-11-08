"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, scrollToHash } from "@/lib/gsap";
import { EMAIL, NAV } from "@/lib/content";
import { Magnetic } from "./Magnetic";
import { Clock } from "./Clock";
import { Lines, Label } from "./Lines";
import { Arrow } from "./Hero";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-wm] span",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "expo.out",
          duration: 1.6,
          stagger: 0.07,
          scrollTrigger: { trigger: word.current, start: "top bottom", end: "bottom bottom" },
        },
      );
    }, word);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_72%_62%,rgba(255,90,31,0.14),transparent_75%)]" />

      <div className="wrap relative pb-[var(--section)] pt-[calc(var(--section)*0.7)]">
        <Label n="06">Contact</Label>
        <Lines
          as="h2"
          className="t-display-xl mt-10"
          lines={[
            "Have something",
            <>
              worth <span className="t-serif text-ember">building</span>?
            </>,
          ]}
        />

        <div className="mt-14 grid items-end gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="t-body-l mb-10 max-w-[44ch] text-bone-2" data-fade="">
              Tell me what you&apos;re trying to make happen. I reply personally within one working day — usually with
              a first idea attached.
            </p>
            <div className="flex flex-wrap items-center gap-3" data-fade="">
              <Magnetic strength={0.25}>
                <a href={`mailto:${EMAIL}?subject=Project%20enquiry`} className="btn btn--solid h-16 px-8 text-base" data-cursor="">
                  {EMAIL}
                  <Arrow />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <button onClick={copy} className="btn h-16 px-7" data-cursor="" aria-live="polite">
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
              </Magnetic>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-6 md:col-span-4 md:col-start-9" data-fade="">
            <div>
              <dt className="t-meta mb-2 text-[0.64rem] text-bone-3">Local time</dt>
              <dd className="text-bone-2">
                <Clock prefix="Vienna" />
              </dd>
            </div>
            <div>
              <dt className="t-meta mb-2 text-[0.64rem] text-bone-3">Languages</dt>
              <dd className="text-bone-2">English, Hungarian</dd>
            </div>
            <div>
              <dt className="t-meta mb-2 text-[0.64rem] text-bone-3">Based</dt>
              <dd className="text-bone-2">Western Hungary · Vienna</dd>
            </div>
            <div>
              <dt className="t-meta mb-2 text-[0.64rem] text-bone-3">Engagements</dt>
              <dd className="text-bone-2">Project or retainer</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="wrap relative">
        <div className="flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <nav className="t-meta flex flex-wrap gap-x-8 gap-y-3 text-bone-2" aria-label="Footer">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="link-u pb-0.5"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(n.href);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <p className="t-meta text-bone-3">© 2026 HRVT — Designed &amp; engineered in-house</p>
        </div>
        <div ref={word} className="overflow-hidden pb-[2vw]" aria-hidden>
          <div
            data-wm=""
            className="flex justify-between font-display font-[780] leading-[0.78] tracking-[-0.02em] text-bone"
            style={{ fontSize: "clamp(5rem, 29.5vw, 36rem)", fontStretch: "108%" }}
          >
            {"HRVT".split("").map((c, i) => (
              <span key={i} className="inline-block">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
