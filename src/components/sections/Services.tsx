"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { SERVICES } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { AiViz } from "../viz/AiViz";
import { FlowViz } from "../viz/FlowViz";
import { CodeViz } from "../viz/CodeViz";
import { WebViz } from "../viz/WebViz";

const VIZ = { ai: AiViz, flow: FlowViz, code: CodeViz, web: WebViz } as const;

export function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      const inners = cards.map((c) => c.querySelector<HTMLElement>("[data-card-inner]")!);
      const words = (c: HTMLElement) => c.querySelectorAll<HTMLElement>("[data-cw]");
      const viz = (c: HTMLElement) => c.querySelector<HTMLElement>("[data-cviz]");

      // Desktop: a pinned 3D deck. Each scroll step flips the next card up out of the floor while the
      // current one tilts back into the dark; its title then rises and its visual zooms into focus.
      mm.add("(min-width: 768px)", () => {
        const deck = root.current!.querySelector<HTMLElement>("[data-deck]")!;
        const bar = root.current!.querySelector<HTMLElement>("[data-deck-bar]");
        const count = root.current!.querySelector<HTMLElement>("[data-deck-n]");
        const n = cards.length;
        gsap.set(deck, { height: "100svh", position: "relative" });
        gsap.set("[data-deck-ui]", { display: "flex" });
        gsap.set(cards, { position: "absolute", left: 0, right: 0, top: "calc(50% + 36px)", yPercent: -50, marginBottom: 0, zIndex: (i) => i, perspective: 1600 });
        gsap.set(inners, { filter: "brightness(1)", transformOrigin: "50% 100%" });
        gsap.set(inners.slice(1), { yPercent: 125, rotateX: -38, scale: 0.9 });

        // First card swings up as the deck arrives.
        gsap.fromTo(inners[0], { rotateX: -22, scale: 0.92 }, {
          rotateX: 0, scale: 1, ease: "none",
          scrollTrigger: { trigger: deck, start: "top bottom", end: "top top", scrub: true },
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: deck,
            start: "top top",
            end: () => `+=${(n - 1) * window.innerHeight * 0.95}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (count) count.textContent = String(Math.min(n, Math.round(self.progress * (n - 1)) + 1)).padStart(2, "0");
            },
          },
        });
        if (bar) tl.fromTo(bar, { scaleX: 1 / n }, { scaleX: 1, duration: n - 1 }, 0);
        cards.forEach((card, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.fromTo(inners[i], { yPercent: 125, rotateX: -38, scale: 0.9 }, { yPercent: 0, rotateX: 0, scale: 1, duration: 1, ease: "power2.out" }, at)
            .fromTo(inners[i - 1],
              { yPercent: 0, rotateX: 0, scale: 1, filter: "brightness(1)" },
              { yPercent: -9, rotateX: 22, scale: 0.86, filter: "brightness(0.38)", transformOrigin: "50% 0%", duration: 1, ease: "power1.in", immediateRender: false },
              at)
            .fromTo(words(card), { yPercent: 115 }, { yPercent: 0, duration: 0.45, stagger: 0.06, ease: "power3.out", immediateRender: false }, at + 0.5)
            .fromTo(viz(card), { scale: 1.22, autoAlpha: 0.15 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "power2.out", immediateRender: false }, at + 0.3);
          if (i >= 2) tl.to(inners[i - 2], { autoAlpha: 0, duration: 0.35 }, at);
        });
        tl.to({}, { duration: 0.25 });
      });

      // Mobile: a scrubbed 3D conveyor. Cards unfold out of the floor as they enter and fold away at the top.
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card, i) => {
          gsap.set(card, { perspective: 1100 });
          gsap.fromTo(inners[i], { rotateX: -30, scale: 0.86, yPercent: 14, transformOrigin: "50% 0%" }, {
            rotateX: 0, scale: 1, yPercent: 0, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 40%", scrub: 0.4 },
          });
          gsap.fromTo(viz(card), { scale: 1.3 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom 30%", scrub: true },
          });
          gsap.fromTo(words(card), { yPercent: 115 }, {
            yPercent: 0, duration: 0.8, stagger: 0.07, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 72%", toggleActions: "play none none reverse" },
          });
          gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, {
            scale: 0.9, filter: "brightness(0.55)", transformOrigin: "50% 100%", ease: "none",
            scrollTrigger: { trigger: card, start: "bottom 55%", end: "bottom top", scrub: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="szolgaltatasok" data-theme="kiwi" className="relative bg-kiwi">
      <div className="relative bg-kiwi text-night">
        <div className="wrap pb-[var(--sec)] pt-[calc(var(--sec)*0.9)]">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <Meta n="01" dark>
                Mit vállalok
              </Meta>
            </div>
            <div className="md:col-span-9">
              <Rise as="h2" className="t-xl" lines={[<>Weboldal készítés</>, <>Szombathelyen.</>]} />
              <p className="t-lead mt-8 max-w-[46ch] text-night/75" data-fade="">
                Egyedi weboldalt: megtervezve, megírva, megépítve. Ha a cégednek nincs jó oldala, vagy van, de nem hoz
                érdeklődőt — <span className="text-night">azt megépítem.</span>
              </p>
            </div>
          </div>

          <div data-deck="" className="mt-16 md:mt-10 md:overflow-hidden">
            <div data-deck-ui="" aria-hidden className="pointer-events-none absolute left-0 right-0 top-[calc(50%+2px-min(34vh,310px))] hidden items-center gap-4">
              <span className="t-meta text-night">
                <span data-deck-n="">01</span> / {String(SERVICES.length).padStart(2, "0")}
              </span>
              <span className="relative h-px flex-1 bg-night/20">
                <span data-deck-bar="" className="absolute inset-0 origin-left bg-night" style={{ transform: `scaleX(${1 / SERVICES.length})` }} />
              </span>
            </div>
            {SERVICES.map((s, i) => {
              const Viz = VIZ[s.viz];
              return (
                <article
                  key={s.n}
                  data-card=""
                  className="mb-6 last:mb-0 md:mb-10"
                >
                  <div
                    data-card-inner=""
                    className="grid overflow-hidden rounded-[22px] bg-night text-paper will-change-transform md:min-h-[min(68vh,620px)] md:grid-cols-12 md:rounded-[30px]"
                  >
                    <div className="flex flex-col justify-between gap-10 p-6 md:col-span-6 md:p-10">
                      <div className="flex items-start justify-between">
                        <span className="t-meta text-kiwi">[{s.n}]</span>
                        <span className="t-meta text-ash">{String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <h3 className="t-l mb-5" aria-label={s.title}>
                          {s.title.split(" ").map((w, k) => (
                            <span key={k} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pt-[0.24em] -mt-[0.24em] align-bottom last:mr-0">
                              <span data-cw="" className="inline-block">
                                {w}
                              </span>
                            </span>
                          ))}
                        </h3>
                        <p className="t-lead mb-4 max-w-[30ch] text-paper">{s.lede}</p>
                        <p className="mb-6 max-w-[48ch] text-smoke">{s.body}</p>
                        <ul className="flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <li key={t} className="t-meta rounded-full border border-line-2 px-3 py-1.5 text-[0.62rem] text-smoke">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="m-2 min-h-[260px] overflow-hidden rounded-[16px] bg-night-2 md:col-span-6 md:m-3 md:min-h-0 md:rounded-[22px]">
                      <div data-cviz="" aria-hidden className="h-full w-full">
                        <Viz />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
