"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import type { PergolaApi } from "./pergola";
import { ArrowUpRight } from "../Hero";

const FINISHES = [
  { name: "Anthracite", hex: "#2a2b2d" },
  { name: "Signal white", hex: "#e4e0d6" },
  { name: "Bronze", hex: "#5b3d27" },
];

const BEATS = [
  { k: "Configure", t: "Customers shape the structure in real-time 3D — size, roof, sides, finish." },
  { k: "Price", t: "Every change re-prices instantly, with VAT, installation and a monthly view." },
  { k: "Convert", t: "A finished spec, PDF and contact land in the manufacturer's inbox." },
];

export function Featured() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<PergolaApi | null>(null);
  const angleEl = useRef<HTMLSpanElement>(null);
  const [finish, setFinish] = useState(0);
  const [width, setWidth] = useState(4.2);
  const [beat, setBeat] = useState(-1);
  const [loaded, setLoaded] = useState(false);

  // Lazy-boot three.js only when the section approaches the viewport.
  useEffect(() => {
    const c = canvas.current!;
    let disposed = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || api.current) return;
        io.disconnect();
        const { createPergola } = await import("./pergola");
        if (disposed) return;
        const mobile = window.matchMedia("(max-width: 900px)").matches;
        const a = createPergola(c, { mobile });
        api.current = a;
        let last = -1;
        a.onReadout(({ angle }) => {
          if (angle !== last && angleEl.current) {
            last = angle;
            angleEl.current.textContent = String(angle).padStart(2, "0");
          }
        });
        if (mobile || prefersReduced()) a.setAuto(!prefersReduced());
        setLoaded(true);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(c);
    return () => {
      disposed = true;
      io.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  // Pinned scroll choreography (desktop only).
  useEffect(() => {
    if (prefersReduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const st = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          api.current?.setProgress(self.progress);
          setBeat(Math.min(2, Math.floor(self.progress * 3)));
          gsap.set("[data-fprog]", { scaleY: self.progress });
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  useEffect(() => api.current?.setFinish(FINISHES[finish].hex), [finish, loaded]);
  useEffect(() => api.current?.setWidth(width), [width, loaded]);

  return (
    <article ref={root} className="relative">
      <div ref={stage} className="wrap relative flex min-h-[100svh] flex-col justify-center py-24 min-[901px]:h-[100svh] min-[901px]:py-0">
        <div className="grid grid-cols-1 items-center gap-10 min-[901px]:grid-cols-12 min-[901px]:gap-[var(--gutter)]">
          {/* Narrative column */}
          <div className="min-[901px]:col-span-4">
            <p className="t-meta mb-6 flex items-center gap-3 text-bone-3" data-fade="">
              <span className="text-ember">Featured</span>
              <span className="h-px w-8 bg-line-2" />
              Lamelix — 2026
            </p>
            <h3 className="t-h2 mb-6" style={{ fontSize: "clamp(2.3rem,3.9vw,4rem)" }} data-lines="auto">
              <span className="line">
                <span className="line-inner" data-hide="">
                  <span className="t-serif">Price</span> it
                </span>
              </span>
              <span className="line">
                <span className="line-inner" data-hide="">
                  before it
                </span>
              </span>
              <span className="line">
                <span className="line-inner" data-hide="">
                  exists.
                </span>
              </span>
            </h3>
            <p className="mb-10 max-w-[38ch] text-bone-2" data-fade="">
              A white-label 3D configurator for pergola, veranda and conservatory manufacturers. Designed, modelled and
              engineered end to end by HRVT.
            </p>

            <ol className="relative mb-10 hidden border-l border-line pl-6 min-[901px]:block">
              <span data-fprog="" className="absolute -left-px top-0 h-full w-px origin-top scale-y-0 bg-ember" />
              {BEATS.map((b, i) => (
                <li
                  key={b.k}
                  className="py-3 transition-opacity duration-700"
                  style={{ opacity: beat < 0 || beat === i ? 1 : 0.32 }}
                >
                  <p className="t-meta mb-1.5 text-bone">
                    <span className="mr-2 text-bone-3">0{i + 1}</span>
                    {b.k}
                  </p>
                  <p className="max-w-[34ch] text-[0.95rem] text-bone-2">{b.t}</p>
                </li>
              ))}
            </ol>

            <a
              href="https://lamelix.vercel.app/konfigurator"
              target="_blank"
              rel="noreferrer"
              className="btn"
              data-cursor=""
              data-fade=""
            >
              Open the live configurator
              <ArrowUpRight />
            </a>
          </div>

          {/* Stage */}
          <div className="min-[901px]:col-span-8">
            <div
              className="relative overflow-hidden rounded-[18px] border border-line bg-ink-900"
              data-cursor="Drag"
              data-fade=""
            >
              <canvas
                ref={canvas}
                className="block h-[62vh] w-full touch-pan-y min-[901px]:h-[76vh]"
                aria-label="Interactive 3D pergola. Drag to rotate."
              />
              {!loaded && (
                <div className="t-meta absolute inset-0 grid place-items-center text-bone-3">Loading scene…</div>
              )}

              {/* HUD */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-6">
                <div>
                  <p className="t-meta text-bone-3">Live scene</p>
                  <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.04em]">
                    Aero <span className="text-ember">/</span> {width.toFixed(1)}
                    <span className="text-[0.5em] text-bone-2"> m</span>
                  </p>
                </div>
                <div className="t-meta text-right text-bone-3">
                  <p>Louvres</p>
                  <p className="font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-bone normal-case">
                    <span ref={angleEl}>00</span>°
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 md:p-6">
                <div className="flex items-center gap-2 rounded-full border border-line-2 bg-ink-950/70 p-1.5 backdrop-blur-md">
                  {FINISHES.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setFinish(i)}
                      className="group relative flex h-9 items-center gap-2 rounded-full px-3 transition-colors"
                      style={{ background: finish === i ? "rgba(236,233,226,.1)" : "transparent" }}
                      aria-pressed={finish === i}
                      data-cursor=""
                    >
                      <span className="h-3.5 w-3.5 rounded-full border border-line-2" style={{ background: f.hex }} />
                      <span className="t-meta hidden text-[0.64rem] sm:inline">{f.name}</span>
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-3 rounded-full border border-line-2 bg-ink-950/70 px-4 py-2.5 backdrop-blur-md">
                  <span className="t-meta text-[0.64rem] text-bone-3">Width</span>
                  <input
                    type="range"
                    min={3}
                    max={6}
                    step={0.1}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="h-px w-28 cursor-pointer appearance-none bg-line-2 accent-[#ff5a1f] md:w-36"
                    aria-label="Pergola width in metres"
                    data-cursor=""
                  />
                  <span className="t-meta w-12 text-right text-[0.64rem] tabular-nums">{width.toFixed(1)} m</span>
                </label>
              </div>
            </div>
            <p className="t-meta mt-3 flex justify-between text-bone-3">
              <span>Three.js · parametric geometry · real-time shadows</span>
              <span className="hidden sm:inline">Drag to orbit</span>
            </p>
          </div>
        </div>
      </div>

      {/* The real product */}
      <div className="wrap pb-[var(--section)] pt-10 min-[901px]:pt-0">
        <div className="grid grid-cols-1 gap-[var(--gutter)] min-[901px]:grid-cols-12">
          <div className="min-w-0 min-[901px]:col-span-3 min-[901px]:pt-4">
            <p className="t-meta mb-4 text-bone-3" data-fade="">
              The shipped product
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 [&>div]:min-w-0 text-[0.92rem] min-[901px]:grid-cols-1" data-fade="">
              {[
                ["Role", "Product, design, 3D, engineering"],
                ["Scope", "Configurator, live pricing, PDF quote, lead flow"],
                ["Model", "White-label, embedded on the manufacturer's site"],
                ["Status", "Beta — onboarding first manufacturers"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta mb-1 text-[0.64rem] text-bone-3">{k}</dt>
                  <dd className="text-bone-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a
            href="https://lamelix.vercel.app/konfigurator"
            target="_blank"
            rel="noreferrer"
            className="group block min-[901px]:col-span-9"
            data-cursor="Open"
          >
            <BrowserFrame url="lamelix.vercel.app/konfigurator">
              <Image
                src="/work/lamelix.webp"
                alt="The Lamelix configurator: step-by-step build panel, live 3D scene of a pergola, and an instant price breakdown."
                width={2400}
                height={1500}
                sizes="(min-width: 901px) 70vw, 100vw"
                className="h-auto w-full scale-[1.02] transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
              />
            </BrowserFrame>
          </a>
        </div>
      </div>
    </article>
  );
}

export function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-ink-900" data-clip="">
      <div className="flex h-9 items-center gap-3 border-b border-line px-4">
        <span className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-ink-700" />
          <i className="h-2 w-2 rounded-full bg-ink-700" />
          <i className="h-2 w-2 rounded-full bg-ink-700" />
        </span>
        <span className="t-meta mx-auto truncate text-[0.6rem] normal-case tracking-[0.06em] text-bone-3">{url}</span>
        <span className="w-10" />
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
