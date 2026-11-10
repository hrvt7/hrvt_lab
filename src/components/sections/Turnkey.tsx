"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReduced, scrollToHash } from "@/lib/gsap";
import { TURNKEY } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { ArrowIcon } from "../Icons";

/** "Weboldal, kulcsrakészen": each row fills with kiwi like a tube as it crosses the screen, and its text turns to ink. */
export function Turnkey() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
        gsap.fromTo(row, { "--f": 0 }, { "--f": 1, ease: "none", scrollTrigger: { trigger: row, start: "top 78%", end: "top 38%", scrub: 0.5 } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} id="weboldal" data-theme="night" className="relative bg-night [overflow-x:clip]">
      <div className="wrap pb-[var(--sec)] pt-[var(--sec)]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Meta n="02">Weboldal-készítés</Meta>
          </div>
          <div className="min-w-0 md:col-span-9">
            <Rise as="h2" className="t-xl max-md:!text-[12.6vw]" lines={[<>Weboldal,</>, <span className="text-kiwi">kulcsrakészen.</span>]} />
            <p className="t-lead mt-8 max-w-[46ch] text-smoke" data-fade="">
              Nem csak design. Minden, ami ahhoz kell, hogy az oldalad éljen, megtalálják, és érdeklődőt hozzon —{" "}
              <span className="text-paper">egy kézből.</span>
            </p>
          </div>
        </div>
        <ol className="mt-14 border-t border-line md:mt-20">
          {TURNKEY.map(([t, d], i) => (
            <li key={t} data-row="" className="tk-row relative border-b border-line">
              {[false, true].map((ink) => (
                <div key={String(ink)} aria-hidden={ink} className={`grid grid-cols-[2.4rem_1fr] items-baseline gap-x-4 gap-y-1 px-1 py-5 md:grid-cols-12 md:px-4 md:py-7 ${ink ? "tk-ink absolute inset-0 bg-kiwi text-night" : ""}`}>
                  <span className={`t-meta md:col-span-1 ${ink ? "" : "text-kiwi"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-m md:col-span-5">{t}</span>
                  <span className={`col-start-2 md:col-span-6 md:col-start-7 ${ink ? "" : "text-smoke"}`}>{d}</span>
                </div>
              ))}
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap items-center gap-4" data-fade="">
          <a href="#kapcsolat" onClick={(e) => { e.preventDefault(); scrollToHash("#kapcsolat"); }} className="pill pill--kiwi" data-cursor="Írj">
            Kérek egy weboldalt
            <span className="pill-dot">
              <ArrowIcon />
            </span>
          </a>
          <p className="t-meta text-smoke">Az első egyeztetés ingyenes</p>
        </div>
      </div>
    </section>
  );
}
