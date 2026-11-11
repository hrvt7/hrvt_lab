"use client";

import { useEffect, useRef } from "react";
import { LiquidEdge } from "../LiquidEdge";
import { ScrollTrigger, gsap, prefersReduced } from "@/lib/gsap";
import { plop } from "@/lib/sound";
import { SERVICES } from "@/lib/content";
import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { AiViz } from "../viz/AiViz";
import { FlowViz } from "../viz/FlowViz";
import { CodeViz } from "../viz/CodeViz";
import { WebViz } from "../viz/WebViz";

const VIZ = { ai: AiViz, flow: FlowViz, code: CodeViz, web: WebViz } as const;
const N = SERVICES.length;
const DR = [[0.08, 16, 1], [0.21, 10, 0.6], [0.37, 22, 0.85], [0.55, 12, 1], [0.68, 18, 0.7], [0.83, 11, 0.95], [0.94, 15, 0.55]];
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const backOut = (x: number) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

/**
 * "Folyadékba merülő kártyák": the services rise one by one out of a dark pool, dripping as they
 * leave the surface, and sink back in when the next one comes up. Desktop: one pinned stage.
 * Mobile: every card has its own little pool and rises out of it as it scrolls into view.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
    if (prefersReduced()) return;
    const desk = matchMedia("(min-width: 768px)").matches;
    const pools = [...el.querySelectorAll<SVGPathElement>(desk ? "[data-pool-d] path" : "[data-pool-m] path")];
    const drips = cards.map((c) => c.querySelector<SVGPathElement>("[data-drip] path")!);
    const inners = cards.map((c) => c.querySelector<HTMLElement>("[data-card-inner]")!);
    const ys = cards.map(() => 1);
    const sunk = cards.map(() => true);
    let vis = false, t0 = performance.now();

    // y: 0 = fully risen, 1 = fully under the surface
    const travel = (i: number) => inners[i].offsetHeight + 60;
    const paint = (now: number) => {
      const t = (now - t0) / 1000;
      cards.forEach((c, i) => {
        const y = ys[i], up = 1 - y;
        inners[i].style.transform = `translate3d(0,${(y * travel(i)).toFixed(1)}px,0) scaleY(${(1 + Math.sin(up * Math.PI) * 0.025).toFixed(4)})`;
        if (y > 0.97 !== sunk[i]) { sunk[i] = y > 0.97; if (!sunk[i]) plop({ pitch: 0.9 + i * 0.12 }); }
        // drips hang from the card's bottom edge down toward the surface, then snap into short stubs
        const W = inners[i].offsetWidth, gap = Math.min(travel(i) * up, 200);
        const stick = 1 - sm(0.55, 0.9, up);
        const p = drips[i];
        let d = `M0 -2H${W}`;
        for (let k = 48; k >= 0; k--) {
          const x = (k / 48) * W;
          let yy = 0;
          for (const [dx, w, L] of DR) {
            const q = Math.abs(x - dx * W) / w;
            if (q < 2.4) yy += Math.exp(-q * q * q) * (L * (gap * stick + 10 * (1 - stick)) + Math.sin(t * 2 + dx * 30) * 2);
          }
          d += `L${x.toFixed(1)} ${yy.toFixed(1)}`;
        }
        p.setAttribute("d", y > 0.985 ? "" : d + "Z");
      });
      // the pool surface sloshes; it bulges where a card is breaking through
      pools.forEach((pool, j) => {
        const svg = pool.ownerSVGElement!, Wp = svg.clientWidth, Hp = svg.clientHeight;
        const cut = desk ? cards.map((_, i) => ys[i]) : [ys[j]];
        const crossing = Math.max(...cut.map((y) => Math.sin(Math.min(1, Math.max(0, y)) * Math.PI)));
        let d = `M0 ${Hp}`;
        for (let k = 0; k <= 60; k++) {
          const x = (k / 60) * Wp, u = x / Wp;
          const edge = Math.exp(-Math.pow((u - 0.03) / 0.03, 2)) + Math.exp(-Math.pow((u - 0.97) / 0.03, 2));
          const yy = 14 + Math.sin(x * 0.012 + t * 1.3) * 4 + Math.sin(x * 0.031 - t * 2.1) * 2 - crossing * (10 * Math.sin(u * Math.PI) + 18 * edge);
          d += `L${x.toFixed(1)} ${yy.toFixed(1)}`;
        }
        pool.setAttribute("d", `${d}L${Wp} ${Hp}Z`);
      });
    };
    const tick = () => { if (vis) paint(performance.now()); };
    gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    const triggers: ScrollTrigger[] = [];
    if (desk) {
      const stage = el.querySelector<HTMLElement>("[data-stage]")!;
      const count = el.querySelector<HTMLElement>("[data-deck-n]")!, bar = el.querySelector<HTMLElement>("[data-deck-bar]")!;
      triggers.push(ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${(N - 0.4) * innerHeight}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          const P = s.progress * (N - 0.4) - 0.3; // -0.3 → first card rises as the stage settles
          cards.forEach((_, i) => {
            const rise = sm(i - 0.5, i - 0.04, P), sink = i === N - 1 ? 0 : sm(i + 0.08, i + 0.5, P);
            ys[i] = Math.min(1, 1 - backOut(rise) + sink);
          });
          const k = Math.max(0, Math.min(N - 1, Math.round(P)));
          count.textContent = String(k + 1).padStart(2, "0");
          bar.style.transform = `scaleX(${Math.max(0.02, s.progress).toFixed(3)})`;
        },
      }));
    } else {
      cards.forEach((c, i) => {
        triggers.push(ScrollTrigger.create({
          trigger: c,
          start: "top 95%",
          end: "top 30%",
          scrub: 0.5,
          onUpdate: (s) => (ys[i] = 1 - backOut(sm(0, 1, s.progress))),
        }));
      });
    }
    return () => { gsap.ticker.remove(tick); io.disconnect(); triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section ref={root} id="szolgaltatasok" data-theme="kiwi" className="relative bg-kiwi">
      <LiquidEdge color="#222222" />
      <div className="relative bg-kiwi text-night">
        <div className="wrap pt-[calc(var(--sec)*0.9)]">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <Meta n="01" dark>
                Mit vállalok
              </Meta>
            </div>
            <div className="md:col-span-9">
              <Rise as="h2" className="t-xl" lines={[<>Weboldal készítés</>, <span className="f-gv text-[1.25em] leading-[0.9]">Szombathelyen.</span>]} />
              <p className="t-lead mt-8 max-w-[46ch] text-night/75" data-words="">
                Egyedi weboldalt: megtervezve, megírva, megépítve. Ha a cégednek nincs jó oldala, vagy van, de nem hoz
                érdeklődőt — <span className="text-night">azt megépítem.</span>
              </p>
            </div>
          </div>
        </div>

        <div data-stage="" className="relative mt-12 pb-[var(--sec)] md:mt-6 md:h-[100svh] md:overflow-hidden md:pb-0">
          <div className="wrap relative md:absolute md:inset-x-0 md:bottom-[17svh] md:top-[92px]">
            {SERVICES.map((s, i) => {
              const Viz = VIZ[s.viz];
              return (
                <article key={s.n} data-card="" className="relative mb-8 overflow-hidden pb-14 last:mb-0 md:absolute md:inset-x-[var(--m)] md:bottom-0 md:mb-0 md:overflow-visible md:pb-0">
                  <div data-card-inner="" className="relative origin-bottom will-change-transform">
                    <div className="grid overflow-hidden rounded-[22px] bg-night text-paper md:h-[min(64svh,580px)] md:grid-cols-12 md:rounded-[30px]">
                      <div className="flex flex-col justify-between gap-8 p-6 md:col-span-6 md:p-10">
                        <div className="flex items-start justify-between">
                          <span className="t-meta text-kiwi">[{s.n}]</span>
                          <span className="t-meta text-ash">{String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
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
                      <div className="m-2 min-h-[260px] overflow-hidden rounded-[16px] bg-night-2 md:col-span-6 md:m-3 md:min-h-0 md:rounded-[22px]">
                        <div aria-hidden className="h-full w-full">
                          <Viz />
                        </div>
                      </div>
                    </div>
                    <svg data-drip="" aria-hidden className="pointer-events-none absolute left-0 top-full h-[220px] w-full overflow-visible">
                      <path fill="#222222" />
                    </svg>
                  </div>
                  {/* mobile: each card's own pool */}
                  <svg data-pool-m="" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 w-full md:hidden">
                    <path fill="#222222" />
                  </svg>
                </article>
              );
            })}
          </div>
          {/* desktop: one shared pool the cards rise out of */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-[15svh] md:block">
            <svg data-pool-d="" className="absolute inset-0 h-full w-full overflow-visible">
              <path fill="#222222" />
            </svg>
            <div className="wrap absolute inset-x-0 bottom-0 flex h-[calc(15svh-24px)] items-center gap-6 text-kiwi">
              <span className="t-meta"><span data-deck-n="">01</span> / {String(N).padStart(2, "0")}</span>
              <span className="relative h-px flex-1 bg-kiwi/25"><span data-deck-bar="" className="absolute inset-0 origin-left scale-x-[0.02] bg-kiwi" /></span>
              <span className="t-meta text-paper/70">görgess — a következő feljön a mélyből</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
