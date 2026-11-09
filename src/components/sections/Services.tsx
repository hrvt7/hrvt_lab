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
import { GearViz } from "../viz/GearViz";

const VIZ = { ai: AiViz, flow: FlowViz, code: CodeViz, web: WebViz, gear: GearViz } as const;

export function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      // Liquid rise: the kiwi field arrives with a deep curve that flattens.
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
      // Stacked cards (desktop only): a card sinks back only while the next one actually covers it.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const inner = card.querySelector<HTMLElement>("[data-card-inner]")!;
          gsap.fromTo(inner, { scale: 1, filter: "brightness(1)" }, {
            scale: 0.94,
            filter: "brightness(0.72)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: () => `top ${84 + i * 14 + inner.offsetHeight}px`,
              end: () => `top ${84 + (i + 1) * 14}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="szolgaltatasok" data-theme="kiwi" className="relative bg-night">
      <div data-rise-shape="" className="relative bg-kiwi text-night">
        <div className="wrap pb-[var(--sec)] pt-[calc(var(--sec)*0.9)]">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <Meta n="01" dark>
                Szolgáltatások
              </Meta>
            </div>
            <div className="md:col-span-9">
              <Rise as="h2" className="t-xl" lines={[<>Mit vállalok?</>]} />
              <p className="t-lead mt-8 max-w-[46ch] text-night/75" data-fade="">
                Mindent, ami AI-építés, automatizálás és szoftver. Ha a cégedben valami lassú, kézzel megy, vagy még nem
                is létezik — <span className="text-night">azt megépítem.</span>
              </p>
            </div>
          </div>

          <div className="mt-16 md:mt-24">
            {SERVICES.map((s, i) => {
              const Viz = VIZ[s.viz];
              return (
                <article
                  key={s.n}
                  data-card=""
                  className="mb-6 last:mb-0 md:sticky md:mb-10"
                  style={{ top: `calc(84px + ${i} * 14px)` }}
                >
                  <div
                    data-card-inner=""
                    className="grid origin-top overflow-hidden rounded-[22px] bg-night text-paper md:min-h-[min(68vh,620px)] md:grid-cols-12 md:rounded-[30px]"
                  >
                    <div className="flex flex-col justify-between gap-10 p-6 md:col-span-6 md:p-10">
                      <div className="flex items-start justify-between">
                        <span className="t-meta text-kiwi">[{s.n}]</span>
                        <span className="t-meta text-ash">{String(i + 1).padStart(2, "0")} / 05</span>
                      </div>
                      <div>
                        <h3 className="t-l mb-5">{s.title}</h3>
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
                    <div className="m-2 min-h-[300px] overflow-hidden rounded-[16px] bg-night-2 md:col-span-6 md:m-3 md:rounded-[22px]">
                      <Viz />
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
