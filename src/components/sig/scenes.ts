import type { Scene } from "./resolve";

const DISPLAY = '"Funnel Display Variable", "Arial Black", sans-serif';
const SANS = '"Geist Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';

const frame = (x: CanvasRenderingContext2D, w: number, h: number, ink: string, lw = 1.5) => {
  x.strokeStyle = ink;
  x.lineWidth = lw;
  x.strokeRect(lw, lw, w - 2 * lw, h - 2 * lw);
};

/** 01 Egyedi design: a small page layout with a generative picture that keeps turning. */
export const sceneDesign: Scene = (x, w, h, t, pal) => {
  const u = w / 100, m = 5 * u;
  frame(x, w, h, pal.ink);
  // browser bar
  x.fillStyle = pal.ink;
  for (let i = 0; i < 3; i++) x.fillRect(m + i * 2.6 * u, 3.2 * u, 1.5 * u, 1.5 * u);
  x.fillRect(0, 7.6 * u, w, 1.5);
  // nav
  x.font = `800 ${2.6 * u}px ${DISPLAY}`;
  x.textBaseline = "alphabetic";
  x.textAlign = "left";
  x.fillText("A TE CÉGED", m, 14.4 * u);
  for (let i = 0; i < 3; i++) x.fillRect(w - m - 34 * u + i * 8 * u, 13 * u, 5.4 * u, 0.9 * u);
  x.fillStyle = pal.acc;
  x.fillRect(w - m - 9.5 * u, 11.2 * u, 9.5 * u, 4.4 * u);
  // headline
  x.fillStyle = pal.ink;
  const fs = Math.min(8.4 * u, h * 0.12);
  x.font = `800 ${fs}px ${DISPLAY}`;
  const y0 = Math.max(27 * u, h * 0.46);
  x.fillText("Csak rólad", m, y0);
  x.fillText("szól.", m, y0 + fs * 1.02);
  x.globalAlpha = 0.72;
  x.fillRect(m, y0 + fs * 1.5, 30 * u, 1 * u);
  x.fillRect(m, y0 + fs * 1.5 + 2.4 * u, 24 * u, 1 * u);
  x.globalAlpha = 1;
  x.fillStyle = pal.acc;
  const by = y0 + fs * 1.5 + 6.5 * u;
  x.fillRect(m, by, 25 * u, 6.4 * u);
  x.fillStyle = pal.bg;
  x.font = `700 ${2.3 * u}px ${SANS}`;
  x.fillText("Ajánlatot kérek", m + 2.6 * u, by + 4.1 * u);
  // generative picture: turning arcs
  const s = Math.min(36 * u, h * 0.6), cx = w - m - s / 2, cy = Math.min(h - m - s / 2, y0 + s * 0.22);
  x.strokeStyle = pal.ink;
  x.lineWidth = 1.5;
  x.strokeRect(cx - s / 2, cy - s / 2, s, s);
  x.save();
  x.beginPath();
  x.rect(cx - s / 2, cy - s / 2, s, s);
  x.clip();
  for (let i = 0; i < 7; i++) {
    const r = s * (0.1 + i * 0.075), a0 = t * (0.25 + i * 0.07) * (i % 2 ? -1 : 1) + i;
    x.beginPath();
    x.arc(cx, cy + s * 0.16, r, a0, a0 + Math.PI * (0.7 + 0.12 * i));
    x.strokeStyle = i % 3 === 1 ? pal.acc : pal.ink;
    x.lineWidth = s * 0.034;
    x.stroke();
  }
  x.restore();
};

const CODE: [string, number][][] = [
  [["<main>", 0]],
  [["  <h1>", 0], ["Egyedi weboldalt készítek.", 1], ["</h1>", 0]],
  [["  <p ", 0], ["class", 2], ["=", 0], ['"lead"', 1], [">", 0], ["Sablon nélkül.", 1], ["</p>", 0]],
  [["  <a ", 0], ["href", 2], ["=", 0], ['"#kapcsolat"', 1], [">", 0]],
  [["    Kérek egy weboldalt", 1]],
  [["  </a>", 0]],
  [["</main>", 0]],
];
/** 02 Fejlesztés: this page's own markup, with a live caret. */
export const sceneCode: Scene = (x, w, h, t, pal) => {
  const u = w / 100, m = 5 * u;
  frame(x, w, h, pal.ink);
  const fs = Math.min(3.05 * u, h * 0.058), lh = fs * 2.05;
  const y0 = (h - lh * CODE.length) / 2 + fs;
  x.textBaseline = "alphabetic";
  x.textAlign = "left";
  x.font = `500 ${fs}px ${MONO}`;
  const cw = x.measureText("M").width;
  CODE.forEach((line, i) => {
    const y = y0 + i * lh;
    x.globalAlpha = 0.55;
    x.fillStyle = pal.ink;
    x.fillText(String(i + 1).padStart(2, "0"), m, y);
    x.globalAlpha = 1;
    let cx = m + cw * 4;
    line.forEach(([s, k]) => {
      x.fillStyle = k === 1 ? pal.acc : pal.ink;
      x.globalAlpha = k === 2 ? 0.7 : 1;
      x.fillText(s, cx, y);
      cx += cw * s.length;
    });
    x.globalAlpha = 1;
    if (i === 4 && Math.floor(t * 1.6) % 2 === 0) {
      x.fillStyle = pal.acc;
      x.fillRect(cx + cw * 0.3, y - fs * 0.86, cw * 0.6, fs * 1.1);
    }
  });
};

const QUERY = "weboldal készítés szombathely";
/** 03 Szöveg és keresők: the query types itself, the page's real title answers. */
export const sceneSearch: Scene = (x, w, h, t, pal) => {
  const u = w / 100, m = 6 * u;
  frame(x, w, h, pal.ink);
  x.textBaseline = "alphabetic";
  x.textAlign = "left";
  const top = Math.max(6 * u, h * 0.1), bh = Math.min(8.4 * u, h * 0.14);
  x.strokeStyle = pal.ink;
  x.lineWidth = 1.5;
  x.strokeRect(m, top, w - 2 * m, bh);
  x.beginPath();
  x.arc(m + bh * 0.5, top + bh * 0.47, bh * 0.2, 0, 7);
  x.moveTo(m + bh * 0.64, top + bh * 0.62);
  x.lineTo(m + bh * 0.78, top + bh * 0.78);
  x.stroke();
  const n = t === 0 ? QUERY.length : Math.min(QUERY.length, Math.floor((t % 9) * 7));
  const fs = Math.min(3.1 * u, bh * 0.42);
  x.fillStyle = pal.ink;
  x.font = `500 ${fs}px ${MONO}`;
  const q = QUERY.slice(0, n);
  x.fillText(q, m + bh, top + bh * 0.62);
  if (n < QUERY.length || Math.floor(t * 2) % 2 === 0) x.fillRect(m + bh + x.measureText(q).width + 3, top + bh * 0.26, fs * 0.5, fs * 1.1);
  // the result
  let y = top + bh + Math.max(6 * u, h * 0.09);
  x.globalAlpha = 0.72;
  x.font = `500 ${Math.min(2.2 * u, 15)}px ${MONO}`;
  x.fillText("hrvt.vercel.app", m, y);
  x.globalAlpha = 1;
  x.fillStyle = pal.acc;
  const ts = Math.min(4.3 * u, h * 0.075);
  x.font = `700 ${ts}px ${DISPLAY}`;
  y += ts * 1.35;
  x.fillText("Weboldal készítés Szombathely", m, y);
  y += ts * 1.12;
  x.fillText("egyedi, sablon nélkül | HRVT", m, y);
  x.fillStyle = pal.ink;
  const ds = Math.min(2.5 * u, 16);
  x.font = `400 ${ds}px ${SANS}`;
  y += ds * 2.1;
  x.fillText("Design, szöveg, fejlesztés, keresőoptimalizálás", m, y);
  x.fillText("és élesítés egy kézben.", m, y + ds * 1.5);
  // the rest of the page stays anonymous bars
  x.globalAlpha = 0.28;
  let by = y + ds * 4.2;
  for (let i = 0; i < 2 && by < h - 6 * u; i++, by += 8.5 * u) {
    x.fillRect(m, by, 38 * u, 2 * u);
    x.fillRect(m, by + 3.4 * u, 62 * u, 1.1 * u);
  }
  x.globalAlpha = 1;
};

/** 04 Űrlap és foglalás: a request leaves the form and lands as a notification. */
export const sceneForm: Scene = (x, w, h, t, pal) => {
  const u = w / 100, m = 6 * u;
  frame(x, w, h, pal.ink);
  x.textBaseline = "alphabetic";
  x.textAlign = "left";
  const fw = Math.min(50 * u, w - 2 * m), fh = Math.min(7.6 * u, h * 0.12), ls = Math.min(2.2 * u, 15);
  let y = Math.max(8 * u, h * 0.13);
  const field = (label: string, val: string) => {
    x.fillStyle = pal.ink;
    x.globalAlpha = 0.72;
    x.font = `500 ${ls}px ${MONO}`;
    x.fillText(label, m, y);
    x.globalAlpha = 1;
    x.strokeStyle = pal.ink;
    x.lineWidth = 1.5;
    x.strokeRect(m, y + ls * 0.7, fw, fh);
    x.font = `500 ${fh * 0.36}px ${SANS}`;
    x.fillText(val, m + fh * 0.36, y + ls * 0.7 + fh * 0.62);
    y += fh + ls * 3.2;
  };
  field("NÉV", "A neved");
  field("MIRE VAN SZÜKSÉGED?", "Új weboldal a cégemnek");
  const cyc = t === 0 ? 3.2 : t % 5;
  const pressed = cyc > 1 && cyc < 1.25;
  x.fillStyle = pal.acc;
  x.fillRect(m + (pressed ? 2 : 0), y - ls + (pressed ? 2 : 0), fw * 0.52, fh);
  x.fillStyle = pal.bg;
  x.font = `700 ${fh * 0.38}px ${SANS}`;
  x.fillText("Elküldöm", m + fh * 0.5, y - ls + fh * 0.63);
  // the request travels as raster dots, then arrives
  const nx = w - m - 34 * u, ny = Math.max(8 * u, h * 0.13), nw = 34 * u, nh = Math.max(15 * u, 64);
  const wide = w > 520;
  if (cyc > 1.2 && cyc < 2.2 && wide) {
    const k = (cyc - 1.2) / 1;
    x.fillStyle = pal.acc;
    for (let i = 0; i < 9; i++) {
      const kk = Math.max(0, Math.min(1, k * 1.5 - i * 0.055));
      const px = m + fw * 0.52 + (nx - m - fw * 0.52 + nw * 0.2) * kk;
      const py = y - ls + fh / 2 + (ny + nh - (y - ls + fh / 2)) * kk * kk;
      x.fillRect(Math.round(px / 4) * 4, Math.round(py / 4) * 4, 4, 4);
    }
  }
  if (cyc > 2.1 && wide) {
    const k = Math.min(1, (cyc - 2.1) * 4);
    const oy = (1 - k) * -3 * u;
    x.fillStyle = pal.ink;
    x.fillRect(nx, ny + oy, nw, nh);
    x.fillStyle = pal.acc;
    const pulse = 1 + 0.35 * Math.sin(t * 6);
    x.beginPath();
    x.arc(nx + 4 * u, ny + oy + 4.6 * u, 1.1 * u * pulse, 0, 7);
    x.fill();
    x.fillStyle = pal.bg;
    x.font = `700 ${Math.min(2.7 * u, 18)}px ${SANS}`;
    x.fillText("Új ajánlatkérés", nx + 7 * u, ny + oy + 5.6 * u);
    x.font = `500 ${Math.min(2.1 * u, 14)}px ${MONO}`;
    x.fillText("most érkezett", nx + 7 * u, ny + oy + 10 * u);
  }
};

/** Kulcsrakészen: a small site assembles band by band, the band in progress drawn interlaced. */
export const sceneSite: Scene = (x, w, h, t, pal, s) => {
  const done = Number(s.done || 0);
  const bands = 8, bh = h / bands, u = w / 100, m = 6 * u;
  x.textBaseline = "alphabetic";
  x.textAlign = "left";
  const draw = (i: number) => {
    const y = i * bh;
    x.fillStyle = pal.ink;
    x.strokeStyle = pal.ink;
    x.lineWidth = 1.5;
    switch (i) {
      case 0: // Tervezés
        x.strokeRect(m, y + bh * 0.2, w - 2 * m, bh * 0.6);
        x.beginPath();
        x.moveTo(m + (w - 2 * m) * 0.62, y + bh * 0.2);
        x.lineTo(m + (w - 2 * m) * 0.62, y + bh * 0.8);
        x.stroke();
        for (let k = 0; k < 3; k++) x.fillRect(m + 3 * u, y + bh * (0.34 + k * 0.14), (40 - k * 9) * u, 1.4);
        break;
      case 1: // Szöveg
        x.font = `800 ${bh * 0.52}px ${DISPLAY}`;
        x.fillText("A te céged.", m, y + bh * 0.72);
        break;
      case 2: { // Kép és mozgás
        x.strokeRect(m, y + bh * 0.12, w - 2 * m, bh * 0.76);
        for (let k = 0; k < 5; k++) {
          x.beginPath();
          x.arc(m + (w - 2 * m) * (0.2 + k * 0.15) + Math.sin(t * 0.8 + k) * 2 * u, y + bh * 0.5, bh * (0.13 + 0.035 * k), 0, 7);
          k % 2 ? x.stroke() : x.fill();
        }
        break;
      }
      case 3: // Fejlesztés
        x.font = `500 ${bh * 0.26}px ${MONO}`;
        x.fillText("<h1>A te céged.</h1>", m, y + bh * 0.46);
        x.fillText("<a href=\"#ajanlat\">", m, y + bh * 0.82);
        break;
      case 4: // Űrlap és foglalás
        x.strokeRect(m, y + bh * 0.24, (w - 2 * m) * 0.6, bh * 0.52);
        x.fillRect(m + (w - 2 * m) * 0.64, y + bh * 0.24, (w - 2 * m) * 0.36, bh * 0.52);
        x.fillStyle = pal.bg;
        x.font = `700 ${bh * 0.24}px ${SANS}`;
        x.fillText("Elküldöm", m + (w - 2 * m) * 0.64 + 2.4 * u, y + bh * 0.59);
        break;
      case 5: // Keresők
        x.beginPath();
        x.arc(m + bh * 0.3, y + bh * 0.46, bh * 0.17, 0, 7);
        x.moveTo(m + bh * 0.42, y + bh * 0.58);
        x.lineTo(m + bh * 0.56, y + bh * 0.72);
        x.stroke();
        x.font = `500 ${bh * 0.26}px ${MONO}`;
        x.fillText("a te céged + város", m + bh * 0.8, y + bh * 0.58);
        break;
      case 6: // Domain és tárhely
        x.strokeRect(m, y + bh * 0.26, w - 2 * m, bh * 0.48);
        x.font = `500 ${bh * 0.25}px ${MONO}`;
        x.fillText("https://[a te céged].hu", m + 3 * u, y + bh * 0.59);
        break;
      case 7: // Mérés és karbantartás
        for (let k = 0; k < 9; k++) {
          const bhk = bh * (0.2 + 0.5 * Math.abs(Math.sin(k * 1.7 + 0.6)));
          x.fillRect(m + k * ((w - 2 * m) / 9), y + bh * 0.84 - bhk, (w - 2 * m) / 9 - 4, bhk);
        }
        break;
    }
  };
  for (let i = 0; i < bands; i++) {
    const k = done - i;
    if (k <= 0) {
      // not rendered yet: sparse raster
      x.fillStyle = pal.ink;
      x.globalAlpha = 0.34;
      for (let yy = i * bh + 6; yy < (i + 1) * bh; yy += 12) for (let xx = m; xx < w - m; xx += 12) x.fillRect(xx, yy, 2, 2);
      x.globalAlpha = 1;
      continue;
    }
    x.save();
    x.beginPath();
    if (k >= 1) x.rect(0, i * bh, w, bh);
    else {
      // interlaced: every other 3 px row first, the gaps fill in as k grows
      for (let yy = i * bh; yy < (i + 1) * bh; yy += 6) {
        x.rect(0, yy, w * Math.min(1, k * 2), 3);
        if (k > 0.5) x.rect(0, yy + 3, w * (k - 0.5) * 2, 3);
      }
    }
    x.clip();
    draw(i);
    x.restore();
  }
  frame(x, w, h, pal.ink);
};

/** Kapcsolat: whatever is typed as the business name stands behind the form as a huge raster. */
export const sceneName: Scene = (x, w, h, _t, pal, s) => {
  const txt = String(s.text || "A TE CÉGED").toUpperCase().slice(0, 28);
  const words = txt.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  words.forEach((wd) => {
    if ((cur + " " + wd).trim().length > 9 && cur) { lines.push(cur); cur = wd; } else cur = (cur + " " + wd).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(0, 3);
  let fs = h / (L.length * 1.02 + 0.2);
  x.font = `800 ${fs}px ${DISPLAY}`;
  const widest = Math.max(...L.map((l) => x.measureText(l).width));
  if (widest > w * 0.88) fs *= (w * 0.88) / widest;
  x.font = `800 ${fs}px ${DISPLAY}`;
  x.fillStyle = pal.ink;
  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  const total = L.length * fs * 1.0;
  L.forEach((l, i) => x.fillText(l, w * 0.03, (h - total) / 2 + fs * 0.86 + i * fs * 1.0));
};
