"use client";
import { useEffect, useRef } from "react";
import { CENTER } from "@/lib/photos";
import { CROP, FRAMES, PAPER } from "@/lib/film";

const N = FRAMES;
const FILM_END = 0.72; // share of the scroll the film takes; the rest melts the print into the backdrop
const MELT_END = 0.95;
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => v * v * (3 - 2 * v);
const pad = (i: number) => String(i).padStart(3, "0");

type Box = { x: number; y: number; w: number; h: number };

/**
 * 1 — Opening: a darkroom film scrubbed by scroll. The print develops in the tray, the camera leans in,
 * the print turns into the blurred black-and-white portrait, which then grows until it IS the page backdrop
 * (same image, same blur), with the HRVT wordmark on top — so the hand-off to the gallery has no seam.
 * Frames are fetched once as blobs and decoded off the main thread into a small sliding window of bitmaps.
 */
export function Darkroom() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    const stage = sec.querySelector<HTMLElement>(".fd-stage")!;
    const cv = sec.querySelector<HTMLCanvasElement>(".fd-cv")!;
    const melt = sec.querySelector<HTMLElement>(".fd-melt")!;
    const meltIn = sec.querySelector<HTMLElement>(".fd-melt-in")!;
    const meltImg = meltIn.querySelector<HTMLElement>(".fd-melt-img")!;
    const wm = sec.querySelector<HTMLElement>(".fh-h1")!;
    const ctx = cv.getContext("2d", { alpha: false })!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let live = true, phone = false, vw = 0, vh = 0, top = 0, span = 1;
    let cur = 0, painted = -1, last = "", raf = 0, running = false;
    let blobs: (Blob | undefined)[] = [];
    const bmp = new Map<number, ImageBitmap>();
    const pending = new Set<number>();
    let fw = 1280, fh = 712;

    // Fetch every frame (coarse to fine, so a fast scroll always has something near), keep the blobs.
    function load() {
      blobs = new Array(N);
      bmp.forEach((b) => b.close());
      bmp.clear();
      const set = phone ? "m" : "d";
      [fw, fh] = phone ? [720, 1068] : [1280, 712];
      const order: number[] = [];
      const seen = new Set<number>();
      for (let step = 32; step >= 1; step >>= 1)
        for (let i = 0; i < N; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
      if (!seen.has(N - 1)) order.push(N - 1);
      const mine = set;
      let k = 0;
      const next = (): Promise<void> | void => {
        const i = order[k++];
        if (i === undefined || !live || mine !== (phone ? "m" : "d")) return;
        return fetch(`/foto/film/${set}/f_${pad(i)}.webp`)
          .then((r) => r.blob())
          .then((b) => {
            blobs[i] = b;
            painted = -1;
          })
          .catch(() => {})
          .then(next);
      };
      // The poster already shows frame 0, so the film waits until the page has loaded (or the visitor scrolls).
      const go = () => {
        removeEventListener("scroll", go);
        clearTimeout(timer);
        for (let c = 0; c < 6; c++) next();
      };
      let timer = 0;
      addEventListener("scroll", go, { once: true, passive: true });
      const later = () => (timer = window.setTimeout(go, 1500));
      if (document.readyState === "complete") later();
      else addEventListener("load", later, { once: true });
    }

    // Decode a window of frames around the playhead; drop the rest.
    function ensure(c: number) {
      for (let i = Math.max(0, c - 8); i <= Math.min(N - 1, c + 20); i++) {
        const b = blobs[i];
        if (b && !bmp.has(i) && !pending.has(i)) {
          pending.add(i);
          createImageBitmap(b)
            .then((im) => {
              pending.delete(i);
              if (live && blobs[i] === b) (bmp.set(i, im), (painted = -1));
              else im.close();
            })
            .catch(() => pending.delete(i));
        }
      }
      for (const [i, b] of bmp) if (i < c - 14 || i > c + 26) (b.close(), bmp.delete(i));
    }
    const near = (i: number) => {
      for (let d = 0; d < N; d++) {
        if (bmp.has(i - d)) return i - d;
        if (bmp.has(i + d)) return i + d;
      }
      return -1;
    };

    function size() {
      vw = stage.clientWidth;
      vh = stage.clientHeight;
      const d = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(vw * d);
      cv.height = Math.round(vh * d);
      top = sec.getBoundingClientRect().top + scrollY;
      span = Math.max(1, sec.offsetHeight - vh);
      const ph = vw / vh < 1;
      if (ph !== phone || !blobs.length) {
        phone = ph;
        load();
      }
      painted = -1;
      last = "";
    }

    // The film frame is drawn "cover"; this maps a fraction of the frame to screen pixels.
    const cover = () => {
      const s = Math.max(vw / fw, vh / fh);
      return { s, ox: (vw - fw * s) / 2, oy: (vh - fh * s) / 2 };
    };
    function paper(i: number): Box {
      let [x0, y0, x1, y1] = PAPER[Math.max(0, Math.min(N - 1, Math.round(i)))];
      if (phone) (x0 = (x0 - CROP.x) / CROP.w), (x1 = (x1 - CROP.x) / CROP.w);
      const { s, ox, oy } = cover();
      return { x: ox + x0 * fw * s, y: oy + y0 * fh * s, w: (x1 - x0) * fw * s, h: (y1 - y0) * fh * s };
    }

    function paint(f: number) {
      const i = Math.floor(f), j = near(i);
      if (j < 0) return;
      const { s, ox, oy } = cover();
      const sx = cv.width / vw;
      const a = bmp.get(j)!;
      ctx.globalAlpha = 1;
      ctx.drawImage(a, ox * sx, oy * sx, fw * s * sx, fh * s * sx);
      const fr = f - i, b = bmp.get(i + 1);
      if (j === i && b && fr > 0.02) {
        ctx.globalAlpha = fr;
        ctx.drawImage(b, ox * sx, oy * sx, fw * s * sx, fh * s * sx);
        ctx.globalAlpha = 1;
      }
      if (!stage.dataset.live) stage.dataset.live = "1";
    }

    // The blurred portrait, laid out exactly like the fixed backdrop, then shrunk onto the print.
    // The image is placed as its whole uncropped box B (inside the viewport identical to the backdrop's
    // cover + scale(1.18)), so when it is shrunk onto the print the full portrait fills the paper.
    function meltTo(P: Box, e: number, alpha: number) {
      const nw = CENTER.w, nh = CENTER.h;
      const sc = Math.max(vw / nw, vh / nh), w0 = nw * sc, h0 = nh * sc;
      const x0 = (vw - w0) * 0.5, y0 = (vh - h0) * 0.3, z = 1.18;
      const B = { x: vw / 2 + (x0 - vw / 2) * z, y: vh / 2 + (y0 - vh / 2) * z, w: w0 * z, h: h0 * z };
      const box = `${B.x.toFixed(1)}|${B.y.toFixed(1)}|${B.w.toFixed(1)}`;
      if (meltImg.dataset.box !== box) {
        meltImg.dataset.box = box;
        Object.assign(meltImg.style, { left: `${B.x}px`, top: `${B.y}px`, width: `${B.w}px`, height: `${B.h}px` });
      }
      const W0 = Math.max(P.w, (P.h * nw) / nh);
      const k0 = W0 / B.w;
      const tx0 = P.x + P.w / 2 - W0 / 2 - B.x * k0;
      const ty0 = P.y + P.h / 2 - (W0 * nh) / nw / 2 - B.y * k0;
      const k = k0 + (1 - k0) * e, tx = tx0 * (1 - e), ty = ty0 * (1 - e);
      const r = 1 - e;
      const clip = `inset(${(P.y * r).toFixed(1)}px ${((vw - P.x - P.w) * r).toFixed(1)}px ${((vh - P.y - P.h) * r).toFixed(1)}px ${(P.x * r).toFixed(1)}px)`;
      const key = `${alpha.toFixed(3)}|${clip}|${k.toFixed(4)}`;
      if (key === last) return;
      last = key;
      melt.style.opacity = alpha.toFixed(3);
      melt.style.clipPath = e >= 1 ? "none" : clip;
      meltIn.style.transform = e >= 1 ? "none" : `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})`;
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      const p = clamp((scrollY - top) / span);
      const target = clamp(p / FILM_END) * (N - 1);
      cur += (target - cur) * (reduced ? 1 : 0.2);
      if (Math.abs(target - cur) < 0.002) cur = target;
      const i = Math.floor(cur);
      ensure(i);
      if (Math.abs(cur - painted) > 0.001) (paint(cur), (painted = cur));
      const e = smooth(clamp((p - FILM_END) / (MELT_END - FILM_END)));
      const alpha = e > 0 ? 1 : smooth(clamp((cur / (N - 1) - 0.55) / 0.45));
      meltTo(paper(e > 0 ? N - 1 : cur), e, alpha);
      const w = clamp((p - 0.84) / 0.13);
      wm.style.opacity = w.toFixed(3);
      wm.style.transform = `scale(${(0.96 + 0.04 * w).toFixed(4)})`;
    }

    const start = () => !running && ((running = true), (raf = requestAnimationFrame(tick)));
    const stop = () => running && ((running = false), cancelAnimationFrame(raf));
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()));
    const onResize = () => size();

    size();
    io.observe(sec);
    addEventListener("resize", onResize);
    return () => {
      live = false;
      stop();
      io.disconnect();
      removeEventListener("resize", onResize);
      bmp.forEach((b) => b.close());
      bmp.clear();
    };
  }, []);

  return (
    <section ref={root} id="top" className="fd" aria-label="HRVT">
      <div className="fd-stage">
        <picture>
          <source media="(max-aspect-ratio: 1/1)" srcSet="/foto/film/m/f_000.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fd-poster" src="/foto/film/d/f_000.webp" alt="" fetchPriority="high" />
        </picture>
        <canvas className="fd-cv" aria-hidden />
        <div className="fd-melt" aria-hidden>
          <div className="fd-melt-in">
            <div className="fd-melt-img" style={{ backgroundImage: `url(/foto/m/${CENTER.id}.webp)` }} />
          </div>
        </div>
        <h1 className="fh-h1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fh-wm" src="/foto/hrvt-wordmark.svg" alt="HRVT — fotók" width={2541} height={907} />
        </h1>
      </div>
      <i className="fd-end" aria-hidden />
    </section>
  );
}
