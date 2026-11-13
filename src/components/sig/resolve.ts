/**
 * Kirajzolódó jelenetek: a 2D engine that shows a code-drawn picture through the page's raster
 * language. p = 0 is raw (20 px ASCII cells), p = 1 is the finished, crisp drawing. A lens around
 * the pointer (or finger) knocks the picture back to coarse cells.
 */
export type Palette = { bg: string; ink: string; acc: string };
export type SceneState = { [k: string]: number | string };
export type Scene = (x: CanvasRenderingContext2D, w: number, h: number, t: number, pal: Palette, s: SceneState) => void;

const RAMP = " .:-=+*x#%@";
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export type Resolver = {
  setP: (p: number) => void;
  setManual: (p: number | null) => void;
  state: SceneState;
  poke: () => void;
  destroy: () => void;
};

export function mountResolve(
  cv: HTMLCanvasElement,
  scene: Scene,
  pal: Palette,
  opts: { animated?: boolean; lens?: boolean; state?: SceneState } = {},
): Resolver {
  const ctx = cv.getContext("2d")!;
  const off = document.createElement("canvas");
  const ox = off.getContext("2d")!;
  const tiny = document.createElement("canvas");
  const tx = tiny.getContext("2d", { willReadFrequently: true })!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state: SceneState = opts.state || {};
  const bg = rgb(pal.bg), ink = rgb(pal.ink), acc = rgb(pal.acc);
  const cand = [ink, acc].map((c) => {
    const d = c.map((v, i) => v - bg[i]);
    return { c, d, n: d[0] * d[0] + d[1] * d[1] + d[2] * d[2] || 1 };
  });

  let w = 0, h = 0, dpr = 1, p = reduced ? 1 : 0, manual: number | null = null, shown = -1;
  let dirty = true, visible = false, raf = 0, frameN = 0;
  let lx = -999, ly = -999, lk = 0, ltk = 0;

  const size = () => {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.round(r.width);
    h = Math.round(r.height);
    cv.width = w * dpr;
    cv.height = h * dpr;
    off.width = w;
    off.height = h;
    dirty = true;
  };

  const cells = (c: number, x0: number, y0: number, x1: number, y1: number) => {
    const tw = Math.ceil(w / c), th = Math.ceil(h / c);
    tiny.width = tw;
    tiny.height = th;
    tx.imageSmoothingEnabled = true;
    tx.drawImage(off, 0, 0, tw, th);
    const cx0 = Math.max(0, Math.floor(x0 / c)), cy0 = Math.max(0, Math.floor(y0 / c));
    const cx1 = Math.min(tw, Math.ceil(x1 / c)), cy1 = Math.min(th, Math.ceil(y1 / c));
    if (cx1 <= cx0 || cy1 <= cy0) return;
    const d = tx.getImageData(cx0, cy0, cx1 - cx0, cy1 - cy0).data;
    const ascii = c >= 9;
    if (ascii) {
      ctx.font = `700 ${c}px "Geist Mono Variable", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    }
    let i = 0;
    for (let y = cy0; y < cy1; y++) {
      for (let x = cx0; x < cx1; x++, i += 4) {
        let best = 0, bt = 0, br = 1e9;
        for (let k = 0; k < 2; k++) {
          const q = cand[k];
          const s0 = d[i] - bg[0], s1 = d[i + 1] - bg[1], s2 = d[i + 2] - bg[2];
          const t = (s0 * q.d[0] + s1 * q.d[1] + s2 * q.d[2]) / q.n;
          const r0 = s0 - t * q.d[0], r1 = s1 - t * q.d[1], r2 = s2 - t * q.d[2];
          const r = r0 * r0 + r1 * r1 + r2 * r2;
          if (r < br) { br = r; bt = t; best = k; }
        }
        const a = bt < 0 ? 0 : bt > 1 ? 1 : bt;
        if (a < 0.06) continue;
        ctx.fillStyle = best ? pal.acc : pal.ink;
        if (ascii) {
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(a * 1.25 * RAMP.length))];
          if (ch !== " ") ctx.fillText(ch, x * c + c / 2, y * c + c / 2);
        } else if (a * 1.1 > B4[(x & 3) + (y & 3) * 4]) {
          ctx.fillRect(x * c, y * c, c, c);
        }
      }
    }
  };

  const draw = (now: number) => {
    const pp = manual ?? p;
    const c = Math.max(1, Math.round(20 * Math.pow(1 - pp, 1.5) + 1 - 0.5 * pp));
    const t = reduced ? 0 : now / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, w, h);
    const lensOn = lk > 0.03;
    if (c <= 1 && !lensOn) {
      scene(ctx, w, h, t, pal, state);
      return;
    }
    ox.setTransform(1, 0, 0, 1, 0, 0);
    ox.fillStyle = pal.bg;
    ox.fillRect(0, 0, w, h);
    scene(ox, w, h, t, pal, state);
    if (c <= 1) scene(ctx, w, h, t, pal, state);
    else cells(c, 0, 0, w, h);
    if (lensOn) {
      const R = 96 * lk, c2 = Math.max(13, c * 3);
      ctx.save();
      ctx.beginPath();
      // a square, cell-aligned lens reads as raster, not as a soft spotlight
      const x0 = Math.floor((lx - R) / c2) * c2, y0 = Math.floor((ly - R) / c2) * c2;
      const s = Math.ceil((2 * R) / c2) * c2;
      ctx.rect(x0, y0, s, s);
      ctx.clip();
      ctx.fillStyle = pal.bg;
      ctx.fillRect(x0, y0, s, s);
      cells(c2, x0, y0, x0 + s, y0 + s);
      ctx.restore();
    }
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    frameN++;
    const dk = ltk - lk;
    if (Math.abs(dk) > 0.01) { lk += dk * 0.12; dirty = true; }
    const pp = manual ?? p;
    if (pp !== shown) dirty = true;
    if (opts.animated && !reduced && frameN % 2 === 0) dirty = true;
    if (!dirty) return;
    dirty = false;
    shown = pp;
    draw(now);
  };

  const pm = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    lx = e.clientX - r.left;
    ly = e.clientY - r.top;
    ltk = lx > -40 && ly > -40 && lx < r.width + 40 && ly < r.height + 40 ? 1 : 0;
    dirty = true;
  };
  const pl = () => { ltk = 0; };
  if (opts.lens !== false && !reduced) {
    window.addEventListener("pointermove", pm, { passive: true });
    cv.addEventListener("pointerdown", pm, { passive: true });
    window.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && pl(), { passive: true });
    window.addEventListener("pointercancel", pl, { passive: true });
  }

  const ro = new ResizeObserver(size);
  ro.observe(cv);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; dirty = true; }, { rootMargin: "120px" });
  io.observe(cv);
  size();
  document.fonts?.ready.then(() => { dirty = true; });
  raf = requestAnimationFrame(loop);

  return {
    setP: (v) => { p = reduced ? 1 : Math.max(0, Math.min(1, v)); },
    setManual: (v) => { manual = v; dirty = true; },
    state,
    poke: () => { dirty = true; },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointercancel", pl);
    },
  };
}
