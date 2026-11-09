"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced, isFinePointer, scrollToHash } from "@/lib/gsap";
import { EMAIL, NAV } from "@/lib/content";
import { Meta } from "../Scramble";
import { Magnetic } from "../Magnetic";
import { Wordmark } from "../Logo";
import { ArrowIcon } from "../Icons";

const WORD = "Beszéljünk.";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          "[data-rise-shape]",
          { borderTopLeftRadius: "50% 22vw", borderTopRightRadius: "50% 22vw" },
          {
            borderTopLeftRadius: "0% 0vw",
            borderTopRightRadius: "0% 0vw",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-bl]",
          { yPercent: 100, "--w": 100 },
          { yPercent: 0, "--w": 800, duration: 1.2, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: word.current, start: "top 85%" } },
        );
        gsap.fromTo(
          "[data-wm-foot]",
          { yPercent: 100 },
          { yPercent: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "[data-wm-wrap]", start: "top bottom" } },
        );
      }
    }, root);

    // Letters lean toward the pointer, each with its own inertia.
    let cleanup = () => {};
    if (isFinePointer() && !reduced) {
      const letters = [...word.current!.querySelectorAll<HTMLElement>("[data-bl]")];
      const tos = letters.map((l) => ({ x: gsap.quickTo(l, "x", { duration: 0.8, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 0.8, ease: "power3" }) }));
      const move = (e: PointerEvent) => {
        letters.forEach((l, i) => {
          const r = l.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy);
          const k = Math.max(0, 1 - d / 420);
          tos[i].x(dx * 0.12 * k);
          tos[i].y(dy * 0.12 * k);
        });
      };
      const h = word.current!;
      const leave = () => tos.forEach((t) => (t.x(0), t.y(0)));
      h.addEventListener("pointermove", move);
      h.addEventListener("pointerleave", leave);
      cleanup = () => {
        h.removeEventListener("pointermove", move);
        h.removeEventListener("pointerleave", leave);
      };
    }
    return () => {
      cleanup();
      ctx.revert();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <footer ref={root} id="kapcsolat" data-theme="kiwi" className="relative bg-night-2">
      <div data-rise-shape="" className="relative overflow-hidden bg-kiwi text-night">
        <div className="wrap pt-[calc(var(--sec)*0.9)]">
          <Meta n="04" dark>
            Kapcsolat
          </Meta>
          <h2 ref={word} className="t-mega mt-8 flex flex-wrap" style={{ fontSize: "clamp(4rem, 15.4vw, 18rem)" }} aria-label={WORD}>
            {[...WORD].map((c, i) => (
              <span key={i} className="-mt-[0.24em] inline-block overflow-hidden pb-[0.04em] pt-[0.24em]" aria-hidden>
                <span data-bl="" data-ch="" className="inline-block">
                  {c}
                </span>
              </span>
            ))}
          </h2>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="t-lead mb-10 max-w-[42ch] text-night/75">
                Írd le pár mondatban, mit szeretnél elérni. Egy munkanapon belül személyesen válaszolok — általában már egy
                első ötlettel.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.22}>
                  <a href={`mailto:${EMAIL}?subject=Projekt`} className="pill pill--night h-16 pl-7 text-base" data-cursor="Írj">
                    {EMAIL}
                    <span className="pill-dot h-11 w-11">
                      <ArrowIcon />
                    </span>
                  </a>
                </Magnetic>
                <button
                  onClick={copy}
                  className="t-meta h-16 rounded-full px-6 shadow-[inset_0_0_0_1px_rgba(34,34,34,.3)] transition-colors hover:bg-night hover:text-kiwi"
                  aria-live="polite"
                  data-cursor="Másol"
                >
                  {copied ? "Kimásolva ✓" : "E-mail másolása"}
                </button>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-6 text-[0.95rem] md:col-span-4 md:col-start-9">
              {[
                ["Helyszín", "Szombathely / Bécs"],
                ["Nyelv", "Magyar, angol"],
                ["Együttműködés", "Projekt vagy havidíjas"],
                ["Válaszidő", "1 munkanap"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta mb-1.5 text-[0.62rem] text-night/55">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-20 flex flex-col gap-4 border-t border-line-ink py-6 md:mt-28 md:flex-row md:items-center md:justify-between">
            <nav className="t-meta flex flex-wrap gap-x-7 gap-y-2" aria-label="Lábléc">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(n.href);
                  }}
                  className="hover:underline"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <p className="t-meta text-night/60">© 2026 HRVT — tervezve és fejlesztve házon belül</p>
          </div>
          <div data-wm-wrap="" className="overflow-hidden pb-[2.4vw]" aria-hidden>
            <div data-wm-foot="">
              <Wordmark className="h-auto w-full" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
