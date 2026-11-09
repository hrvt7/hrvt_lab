"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReduced } from "@/lib/gsap";

/** Image resolves from coarse kiwi-tinted pixels to full resolution as it scrolls into view. */
/** src = base path without extension, e.g. "/work/lamelix" (expects -800 / -1400 / full .webp variants) */
export function PixelReveal({ src, alt, ratio = 1.6 }: { src: string; alt: string; ratio?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    const im = new Image();
    im.src = `${src}-800.webp`; // the pixel stage only ever needs a small source
    let block = 64;
    let st: ScrollTrigger | null = null;

    const render = () => {
      if (!im.complete || !im.naturalWidth) return;
      const W = c.clientWidth, H = c.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      if (c.width !== Math.round(W * dpr)) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      const b = Math.max(1, block);
      const sw = Math.max(1, Math.ceil(W / b)), sh = Math.max(1, Math.ceil(H / b));
      small.width = sw;
      small.height = sh;
      sctx.drawImage(im, 0, 0, sw, sh);
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(small, 0, 0, sw, sh, 0, 0, c.width, c.height);
      // kiwi tint fades out as the image resolves
      const tint = Math.min(1, (b - 1) / 40);
      if (tint > 0) {
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = `rgba(137,233,0,${tint * 0.9})`;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.globalCompositeOperation = "source-over";
      }
      img.current!.style.opacity = b <= 1.4 ? "1" : "0";
    };

    const start = () => {
      if (prefersReduced()) {
        block = 1;
        render();
        return;
      }
      render();
      st = ScrollTrigger.create({
        trigger: wrap.current,
        start: "top 85%",
        end: "center 55%",
        scrub: 0.4,
        onUpdate: (s) => {
          const p = s.progress;
          block = Math.round(64 * Math.pow(1 - p, 2.2));
          render();
        },
      });
    };
    im.onload = start;
    if (im.complete) start();
    const ro = new ResizeObserver(render);
    ro.observe(c);
    return () => {
      st?.kill();
      ro.disconnect();
    };
  }, [src]);

  return (
    <div ref={wrap} className="relative w-full overflow-hidden" style={{ aspectRatio: String(ratio) }}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={`${src}-1400.webp`} srcSet={`${src}-800.webp 800w, ${src}-1400.webp 1400w, ${src}.webp 2400w`} sizes="(min-width: 768px) 62vw, 100vw" alt={alt} decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300" loading="lazy" />
    </div>
  );
}
