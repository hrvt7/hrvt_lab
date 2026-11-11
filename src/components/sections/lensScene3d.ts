/**
 * "Röntgen-lencse": the hero is the blueprint of a website (wireframe, labels, code).
 * A liquid glass lens follows the pointer; under it the same page is finished and live.
 * The lens refracts (magnifies the centre, bends the rim, splits colour at the edge) and
 * squashes along its own velocity like a drop. Scroll grows it until the whole screen is
 * the finished page, while three different sample sites wipe through it.
 */

type Ctx = CanvasRenderingContext2D;
type R = { x: number; y: number; w: number; h: number };

const DISP = '"Lexend Giga Variable", "Arial Black", sans-serif';
const SANS = '"Geist Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';
const KIWI = "#89e900";

type Theme = {
  name: string;
  bg: string;
  surf: string;
  ink: string;
  mute: string;
  acc: string;
  onAcc: string;
  font: (px: number) => string;
  logo: string;
  head: [string, string];
  sub: string;
  cta: [string, string];
  links: string[];
  cards: [string, string][];
  art: (g: Ctx, r: R, t: Theme) => void;
};

// Three invented sample sites. Different colour, type and mood, same skeleton: nothing here is a real client.
const THEMES: Theme[] = [
  {
    name: "Kert Bisztró",
    bg: "#16231b",
    surf: "#20332a",
    ink: "#f3ead8",
    mute: "#b9b39f",
    acc: "#e0673f",
    onAcc: "#16231b",
    font: (px) => `italic 500 ${px}px Georgia, "Times New Roman", serif`,
    logo: "Kert Bisztró",
    head: ["Friss tészta,", "lassú esték."],
    sub: "Szezonális étlap, kertre nyíló terasz, asztalfoglalás két érintéssel.",
    cta: ["Asztalt foglalok", "Étlap"],
    links: ["Étlap", "Terasz", "Rólunk", "Kapcsolat"],
    cards: [["Napi menü", "11:30-tól"], ["Terasz", "60 fő"], ["Foglalás", "online"]],
    art: (g, r, t) => {
      const gr = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
      gr.addColorStop(0, "#3b2a1c");
      gr.addColorStop(1, "#7a3b22");
      g.fillStyle = gr;
      g.fillRect(r.x, r.y, r.w, r.h);
      const s = Math.min(r.w, r.h);
      const plates: [number, number, number][] = [[0.36, 0.55, 0.3], [0.72, 0.36, 0.2], [0.78, 0.78, 0.16]];
      plates.forEach(([px, py, pr]) => {
        const cx = r.x + r.w * px, cy = r.y + r.h * py, rad = s * pr;
        g.fillStyle = "rgba(0,0,0,.35)";
        g.beginPath(); g.ellipse(cx + rad * 0.08, cy + rad * 0.12, rad, rad, 0, 0, 7); g.fill();
        g.fillStyle = t.ink;
        g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
        g.fillStyle = "#e9dcc2";
        g.beginPath(); g.arc(cx, cy, rad * 0.72, 0, 7); g.fill();
        g.fillStyle = t.acc;
        g.beginPath(); g.arc(cx - rad * 0.12, cy - rad * 0.05, rad * 0.4, 0, 7); g.fill();
        g.fillStyle = "#6f8f3a";
        for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(cx + Math.cos(i * 1.3) * rad * 0.32, cy + Math.sin(i * 1.3) * rad * 0.32, rad * 0.09, rad * 0.04, i, 0, 7); g.fill(); }
      });
    },
  },
  {
    name: "Lila Szalon",
    bg: "#24112b",
    surf: "#35193f",
    ink: "#f6dccd",
    mute: "#c7a3b4",
    acc: "#ff7aa8",
    onAcc: "#24112b",
    font: (px) => `400 ${px}px "Didot", "Bodoni 72", Georgia, serif`,
    logo: "Lila Szalon",
    head: ["Szépség,", "időre foglalva."],
    sub: "Haj, köröm, smink. Szabad időpontok élőben, emlékeztető SMS-ben.",
    cta: ["Időpontot kérek", "Árak"],
    links: ["Szolgáltatások", "Csapat", "Galéria", "Foglalás"],
    cards: [["Hajvágás", "45 perc"], ["Manikűr", "60 perc"], ["Smink", "alkalmira"]],
    art: (g, r, t) => {
      const gr = g.createRadialGradient(r.x + r.w * 0.3, r.y + r.h * 0.3, 0, r.x + r.w * 0.5, r.y + r.h * 0.5, Math.max(r.w, r.h) * 0.8);
      gr.addColorStop(0, "#ff9cc0");
      gr.addColorStop(0.45, "#a33f7c");
      gr.addColorStop(1, "#3a1640");
      g.fillStyle = gr;
      g.fillRect(r.x, r.y, r.w, r.h);
      g.save();
      g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip();
      g.strokeStyle = t.ink;
      g.globalAlpha = 0.5;
      g.lineWidth = Math.max(1.5, r.w * 0.004);
      for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(r.x + r.w * 0.72, r.y + r.h * 0.7, r.w * (0.12 + i * 0.07), Math.PI, Math.PI * 1.9); g.stroke(); }
      g.globalAlpha = 1;
      g.fillStyle = "#f6dccd";
      g.beginPath(); g.ellipse(r.x + r.w * 0.36, r.y + r.h * 0.58, r.w * 0.16, r.h * 0.3, -0.3, 0, 7); g.fill();
      g.fillStyle = "#2a0f30";
      g.beginPath(); g.ellipse(r.x + r.w * 0.33, r.y + r.h * 0.38, r.w * 0.19, r.h * 0.2, -0.4, 0, 7); g.fill();
      g.restore();
    },
  },
  {
    name: "Garázs 24",
    bg: "#0d1726",
    surf: "#16243a",
    ink: "#eef2f7",
    mute: "#93a3b8",
    acc: "#ff6a1a",
    onAcc: "#0d1726",
    font: (px) => `900 ${px}px "Arial Black", "Helvetica Neue", Impact, sans-serif`,
    logo: "GARÁZS 24",
    head: ["SZERVIZ,", "AMI NEM VÁR."],
    sub: "Időpont még ma, fix árajánlat előre, autó kész SMS-értesítéssel.",
    cta: ["Időpontot foglalok", "Hívás"],
    links: ["Szerviz", "Gumi", "Árak", "Kapcsolat"],
    cards: [["Olajcsere", "30 perc"], ["Futómű", "mérés"], ["Gumi", "tárolás"]],
    art: (g, r, t) => {
      g.fillStyle = "#101e33";
      g.fillRect(r.x, r.y, r.w, r.h);
      g.save();
      g.beginPath(); g.rect(r.x, r.y, r.w, r.h); g.clip();
      const glow = g.createRadialGradient(r.x + r.w * 0.7, r.y + r.h * 0.45, 0, r.x + r.w * 0.7, r.y + r.h * 0.45, r.w * 0.6);
      glow.addColorStop(0, "rgba(255,106,26,.75)");
      glow.addColorStop(1, "rgba(255,106,26,0)");
      g.fillStyle = glow;
      g.fillRect(r.x, r.y, r.w, r.h);
      g.fillStyle = "rgba(255,255,255,.06)";
      const st = r.w * 0.08;
      for (let x = -r.h; x < r.w; x += st * 2) { g.beginPath(); g.moveTo(r.x + x, r.y + r.h); g.lineTo(r.x + x + st, r.y + r.h); g.lineTo(r.x + x + st + r.h, r.y); g.lineTo(r.x + x + r.h, r.y); g.fill(); }
      // a wheel
      const cx = r.x + r.w * 0.62, cy = r.y + r.h * 0.6, rad = Math.min(r.w, r.h) * 0.3;
      g.fillStyle = "#05090f"; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
      g.fillStyle = "#c9d2de"; g.beginPath(); g.arc(cx, cy, rad * 0.62, 0, 7); g.fill();
      g.fillStyle = "#1a2738";
      for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(cx + Math.cos(i * 1.2566) * rad * 0.36, cy + Math.sin(i * 1.2566) * rad * 0.36, rad * 0.11, rad * 0.2, i * 1.2566 + 1.57, 0, 7); g.fill(); }
      g.fillStyle = t.acc; g.beginPath(); g.arc(cx, cy, rad * 0.12, 0, 7); g.fill();
      g.restore();
    },
  },
];

type Lay = { mob: boolean; nav: { logo: R; links: R[]; btn: R }; head: R; lh: number; sub: R; ctas: R[]; img: R; cards: R[]; code: { x: number; y: number } | null };

function layout(W: number, H: number): Lay {
  const mob = W < 768;
  if (mob) {
    const p = W * 0.06, y0 = H * 0.165, cw = W - p * 2;
    const lh = Math.min(W * 0.1, H * 0.05);
    return {
      mob,
      nav: { logo: { x: p, y: y0, w: W * 0.3, h: 22 }, links: [], btn: { x: W - p - 36, y: y0 - 4, w: 36, h: 30 } },
      head: { x: p, y: y0 + H * 0.05, w: cw, h: lh * 2.1 },
      lh,
      sub: { x: p, y: y0 + H * 0.05 + lh * 2.35, w: cw * 0.9, h: 34 },
      ctas: [{ x: p, y: y0 + H * 0.05 + lh * 2.35 + 46, w: W * 0.44, h: 40 }],
      img: { x: p, y: y0 + H * 0.05 + lh * 2.35 + 100, w: cw, h: Math.max(80, H * 0.5 - (y0 + H * 0.05 + lh * 2.35 + 100)) },
      cards: [],
      code: null,
    };
  }
  const p = W * 0.055, y0 = Math.max(150, H * 0.19);
  const rx = W * 0.54, rw = W - p - rx;
  const lh = Math.min(W * 0.042, H * 0.075);
  return {
    mob,
    nav: {
      logo: { x: p, y: y0, w: 150, h: 26 },
      links: [0, 1, 2, 3].map((i) => ({ x: W * 0.42 + i * W * 0.085, y: y0 + 4, w: W * 0.065, h: 18 })),
      btn: { x: W - p - 150, y: y0 - 6, w: 150, h: 38 },
    },
    head: { x: rx, y: y0 + H * 0.1, w: rw, h: lh * 2.15 },
    lh,
    sub: { x: rx, y: y0 + H * 0.1 + lh * 2.4, w: rw * 0.82, h: 44 },
    ctas: [
      { x: rx, y: y0 + H * 0.1 + lh * 2.4 + 66, w: 190, h: 46 },
      { x: rx + 206, y: y0 + H * 0.1 + lh * 2.4 + 66, w: 110, h: 46 },
    ],
    img: { x: p, y: y0 + H * 0.08, w: W * 0.43, h: H * 0.86 - (y0 + H * 0.08) },
    cards: [0, 1, 2].map((i) => ({ x: rx + i * (rw / 3), y: H * 0.7, w: rw / 3 - 14, h: H * 0.16 })),
    code: { x: rx, y: H * 0.665 },
  };
}

const rr = (g: Ctx, r: R, rad: number) => { g.beginPath(); g.roundRect(r.x, r.y, r.w, r.h, rad); };
function fit(g: Ctx, text: string, font: (px: number) => string, maxW: number, px: number) {
  g.font = font(px);
  const m = g.measureText(text).width;
  if (m > maxW) g.font = font((px * maxW) / m);
}
function wrap(g: Ctx, text: string, x: number, y: number, maxW: number, lh: number, max = 3) {
  const words = text.split(" ");
  let line = "", n = 0;
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y + n * lh); line = w; if (++n >= max) return; }
    else line = t;
  }
  if (line) g.fillText(line, x, y + n * lh);
}

/** The blueprint: thin kiwi outlines, crossed image boxes, measurements and a little code. */
function paintWire(g: Ctx, W: number, H: number, L: Lay) {
  g.fillStyle = "#1e1e1e";
  g.fillRect(0, 0, W, H);
  // 12-column grid + baseline dots
  const cols = L.mob ? 4 : 12, p = L.mob ? W * 0.06 : W * 0.055, cw = (W - p * 2) / cols;
  g.fillStyle = "rgba(137,233,0,.035)";
  for (let i = 0; i < cols; i += 2) g.fillRect(p + i * cw, 0, cw, H);
  g.fillStyle = "rgba(255,255,255,.07)";
  const st = L.mob ? 22 : 28;
  for (let y = st; y < H; y += st) for (let x = st; x < W; x += st) g.fillRect(x, y, 1, 1);

  const line = (a: number) => { g.strokeStyle = `rgba(137,233,0,${a})`; g.lineWidth = 1; };
  const label = (t: string, x: number, y: number, a = 0.75) => { g.font = `500 ${L.mob ? 9 : 10.5}px ${MONO}`; g.fillStyle = `rgba(137,233,0,${a})`; g.textBaseline = "alphabetic"; g.fillText(t, x, y); };
  const box = (r: R, rad = 4, a = 0.5) => { line(a); rr(g, { x: r.x + 0.5, y: r.y + 0.5, w: r.w, h: r.h }, rad); g.stroke(); };
  const bars = (r: R, n: number, h: number, gap: number, a = 0.35) => { line(a); for (let i = 0; i < n; i++) { rr(g, { x: r.x + 0.5, y: r.y + i * (h + gap) + 0.5, w: r.w * (i === n - 1 ? 0.62 : 1), h }, h / 2); g.stroke(); } };

  // nav
  box(L.nav.logo, 3);
  label("logo.svg", L.nav.logo.x, L.nav.logo.y - 7);
  L.nav.links.forEach((r) => bars(r, 1, r.h * 0.55, 0));
  box(L.nav.btn, L.nav.btn.h / 2, 0.6);
  line(0.18);
  g.beginPath(); g.moveTo(0, L.nav.btn.y + L.nav.btn.h + 14.5); g.lineTo(W, L.nav.btn.y + L.nav.btn.h + 14.5); g.stroke();
  label(L.mob ? "nav · 56" : "<nav> · sticky · 72px", W - (L.mob ? 70 : 170), L.nav.btn.y + L.nav.btn.h + 30, 0.5);

  // headline: two heavy bars with type spec
  line(0.55);
  for (let i = 0; i < 2; i++) { rr(g, { x: L.head.x + 0.5, y: L.head.y + i * L.lh * 1.05 + 0.5, w: L.head.w * (i ? 0.7 : 0.94), h: L.lh * 0.8 }, 6); g.stroke(); }
  label(`h1 · display ${Math.round(L.lh * 0.8)}px / 1.05`, L.head.x, L.head.y - 9);
  bars(L.sub, L.mob ? 2 : 2, L.mob ? 9 : 11, L.mob ? 8 : 11);
  label("p.lead · max 46ch", L.sub.x, L.sub.y + L.sub.h + (L.mob ? 12 : 18), 0.45);
  L.ctas.forEach((r, i) => { box(r, r.h / 2, i ? 0.35 : 0.7); label(i ? "btn.ghost" : "btn.primary → #foglalas", r.x, r.y + r.h + 15, 0.5); });

  // image with cross + aspect
  const im = L.img;
  box(im, 8, 0.5);
  line(0.22);
  g.beginPath(); g.moveTo(im.x, im.y); g.lineTo(im.x + im.w, im.y + im.h); g.moveTo(im.x + im.w, im.y); g.lineTo(im.x, im.y + im.h); g.stroke();
  label(`img.hero · ${Math.round(im.w)}×${Math.round(im.h)} · webp`, im.x + 12, im.y + 22, 0.7);
  // measurement arrow on the image
  line(0.45);
  const my = im.y + im.h + (L.mob ? 12 : 18);
  g.beginPath(); g.moveTo(im.x, my); g.lineTo(im.x + im.w, my); g.moveTo(im.x, my - 4); g.lineTo(im.x, my + 4); g.moveTo(im.x + im.w, my - 4); g.lineTo(im.x + im.w, my + 4); g.stroke();

  L.cards.forEach((r, i) => {
    box(r, 8, 0.4);
    line(0.3);
    g.beginPath(); g.arc(r.x + 26, r.y + 28, 10, 0, 7); g.stroke();
    bars({ x: r.x + 18, y: r.y + r.h - 48, w: r.w - 50, h: 0 }, 2, 9, 9, 0.3);
    label(`card[${i}]`, r.x + 46, r.y + 32, 0.45);
  });

  if (L.code) {
    g.font = `500 11px ${MONO}`;
    g.fillStyle = "rgba(154,154,147,.55)";
    g.fillText('<section id="hero" class="grid-12"> <h1 class="display">…</h1>', L.code.x, L.code.y);
  }
  // corner registration marks
  line(0.6);
  const m = L.mob ? 10 : 16, k = 10;
  [[m, H * 0.09], [W - m, H * 0.09], [m, H - m], [W - m, H - m]].forEach(([x, y], i) => {
    const sx = i % 2 ? -1 : 1, sy = i > 1 ? -1 : 1;
    g.beginPath(); g.moveTo(x + 0.5, y + sy * k); g.lineTo(x + 0.5, y + 0.5); g.lineTo(x + sx * k, y + 0.5); g.stroke();
  });
}

/** The same skeleton, finished: real type, colour, imagery. */
function paintSite(g: Ctx, W: number, H: number, L: Lay, t: Theme) {
  g.fillStyle = t.bg;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.8, H * 0.2, 0, W * 0.8, H * 0.2, Math.max(W, H) * 0.7);
  glow.addColorStop(0, t.surf);
  glow.addColorStop(1, t.bg);
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);
  g.textBaseline = "middle";

  // nav
  g.fillStyle = t.ink;
  fit(g, t.logo, t.font, L.nav.logo.w, L.mob ? 19 : 24);
  g.fillText(t.logo, L.nav.logo.x, L.nav.logo.y + L.nav.logo.h / 2);
  g.font = `500 ${13}px ${SANS}`;
  g.fillStyle = t.mute;
  L.nav.links.forEach((r, i) => g.fillText(t.links[i], r.x, r.y + r.h / 2));
  rr(g, L.nav.btn, L.nav.btn.h / 2);
  g.fillStyle = t.acc;
  g.fill();
  g.fillStyle = t.onAcc;
  if (L.mob) { for (let i = 0; i < 3; i++) g.fillRect(L.nav.btn.x + 10, L.nav.btn.y + 9 + i * 5.5, 16, 2); }
  else { g.font = `600 13px ${SANS}`; g.textAlign = "center"; g.fillText(t.cta[0], L.nav.btn.x + L.nav.btn.w / 2, L.nav.btn.y + L.nav.btn.h / 2); g.textAlign = "left"; }

  // headline
  g.fillStyle = t.ink;
  t.head.forEach((h, i) => {
    fit(g, h, t.font, L.head.w, L.lh * 0.98);
    g.fillStyle = i ? t.acc : t.ink;
    g.fillText(h, L.head.x, L.head.y + i * L.lh * 1.05 + L.lh * 0.42);
  });
  g.fillStyle = t.mute;
  g.font = `400 ${L.mob ? 12.5 : 16}px ${SANS}`;
  g.textBaseline = "top";
  wrap(g, t.sub, L.sub.x, L.sub.y - 2, L.sub.w, L.mob ? 17 : 23, 2);
  g.textBaseline = "middle";
  L.ctas.forEach((r, i) => {
    rr(g, r, r.h / 2);
    if (i) { g.strokeStyle = t.mute; g.lineWidth = 1.2; g.stroke(); g.fillStyle = t.ink; }
    else { g.fillStyle = t.acc; g.fill(); g.fillStyle = t.onAcc; }
    g.font = `600 ${L.mob ? 12.5 : 14}px ${SANS}`;
    g.textAlign = "center";
    g.fillText(t.cta[i] + (i ? "" : "  →"), r.x + r.w / 2, r.y + r.h / 2 + 0.5);
    g.textAlign = "left";
  });

  // image
  g.save();
  rr(g, L.img, 10);
  g.clip();
  t.art(g, L.img, t);
  g.restore();

  L.cards.forEach((r, i) => {
    rr(g, r, 10);
    g.fillStyle = t.surf;
    g.fill();
    g.fillStyle = t.acc;
    g.beginPath(); g.arc(r.x + 26, r.y + 28, 10, 0, 7); g.fill();
    g.fillStyle = t.ink;
    g.font = `600 15px ${SANS}`;
    g.fillText(t.cards[i][0], r.x + 18, r.y + r.h - 40);
    g.fillStyle = t.mute;
    g.font = `400 13px ${SANS}`;
    g.fillText(t.cards[i][1], r.x + 18, r.y + r.h - 20);
  });
  if (L.code) {
    g.font = `500 11px ${MONO}`;
    g.fillStyle = t.mute;
    g.fillText("© " + t.logo + "  ·  minta-oldal, a lencse alatt", L.code.x, L.code.y);
  }
}

const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const FS = `precision highp float;
uniform sampler2D tA,t0,t1,t2;
uniform vec2 res,L,vel,sh;
uniform float R,th,time,fade,cover,born,wob,dim;
vec3 pick(vec2 uv,float k){ if(k<.5) return texture2D(t0,uv).rgb; if(k<1.5) return texture2D(t1,uv).rgb; return texture2D(t2,uv).rgb; }
vec3 site(vec2 q,float k0,float k1,float f,vec2 p){
  vec2 uv=clamp(q/res,0.,1.);
  vec3 a=pick(uv,k0);
  if(f<=0.001) return a;
  float w=p.y/res.y+.06*sin(p.x/res.x*9.+time*2.2);
  float m=smoothstep(w-.04,w+.04,f*1.2-.1);
  return mix(a,pick(uv,k1),m);
}
void main(){
  vec2 p=gl_FragCoord.xy;
  vec2 d=p-L;
  float sp=length(vel);
  vec2 dir=sp>.01?vel/sp:vec2(1.,0.);
  float s=clamp(sp*.006,0.,.2)*(1.-cover);
  float al=dot(d,dir);
  vec2 dq=dir*al/(1.+s)+(d-dir*al)*(1.+s*.45);
  float ang=atan(dq.y,dq.x);
  float r=length(dq)/R;
  r*=1.+(.012+wob*.02)*sin(ang*5.+time*1.7)*(1.-cover)+.008*sin(ang*3.-time*1.1)*(1.-cover);
  float aa=1.6/R;
  float inside=1.-smoothstep(1.-aa,1.,r);
  vec3 col=texture2D(tA,p/res).rgb;
  // scanning line on the blueprint
  float sy=mod(time*.11,1.3)*res.y;
  col+=vec3(.537,.914,0.)*.12*exp(-pow((p.y-(res.y-sy))/(2.5*sh.x),2.));
  // drop shadow of the lens on the blueprint
  float rs=length(d+vec2(0.,R*.09))/R;
  col*=1.-.55*(1.-smoothstep(.92,1.32,rs))*(1.-inside)*(1.-cover);
  float k0=mod(floor(th),3.),k1=mod(k0+1.,3.),f=smoothstep(.0,1.,fract(th)*1.6-.3);
  if(inside>0.){
    float rc=min(r,1.);
    float m=.80+.16*rc*rc+.26*pow(rc,7.);
    m=mix(m,1.,cover);
    float ca=.028*pow(rc,4.)*(1.-cover);
    vec3 b;
    b.r=site(L+d*(m+ca),k0,k1,f,p).r;
    b.g=site(L+d*m,k0,k1,f,p).g;
    b.b=site(L+d*(m-ca),k0,k1,f,p).b;
    float e=1.-cover;
    b*=1.-.3*smoothstep(.78,1.,rc)*e;
    vec2 nd=dq/max(length(dq),1.);
    b+=vec3(1.)*.55*pow(max(0.,dot(nd,normalize(vec2(-.55,.84)))),9.)*smoothstep(.72,.98,rc)*e;
    b+=vec3(.537,.914,0.)*.25*pow(max(0.,dot(nd,normalize(vec2(.6,-.8)))),6.)*smoothstep(.8,1.,rc)*e;
    vec2 bl=(dq/R-vec2(-.36,.4))*vec2(3.2,5.2);
    b+=vec3(1.)*.35*exp(-dot(bl,bl)*2.4)*e;
    col=mix(col,b,inside);
  }
  float ring=exp(-pow((r-.995)*R/1.3,2.))*(1.-cover);
  col+=vec3(.9,1.,.85)*ring*.55;
  col*=1.-.55*dim;
  col=mix(vec3(.133),col,born);
  col=mix(col,vec3(.133),fade);
  gl_FragColor=vec4(col,1.);
}`;

const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function mount({ host, sec, canvas, tag, line, content }: { host: HTMLElement; sec: HTMLElement; canvas: HTMLCanvasElement; tag: HTMLElement; line: HTMLElement; content: HTMLElement | null }) {
  const ctx = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
  if (!ctx) return null;
  const gl: WebGLRenderingContext = ctx;
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");

  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader"); return s; };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U("res"), L: U("L"), vel: U("vel"), sh: U("sh"), R: U("R"), th: U("th"), time: U("time"), fade: U("fade"), dim: U("dim"), cover: U("cover"), born: U("born"), wob: U("wob") };
  const texs = [0, 1, 2, 3].map((i) => {
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([34, 34, 34, 255]));
    return t;
  });
  ["tA", "t0", "t1", "t2"].forEach((n, i) => gl.uniform1i(U(n), i));
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let W = 0, H = 0, dpr = 1, ready = 0, L: Lay;
  const paintCv = document.createElement("canvas");
  const pg = paintCv.getContext("2d")!;
  const upload = (i: number) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, texs[i]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paintCv); };
  const idle = () => new Promise<void>((r) => { const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback; if (ric) ric(() => r(), { timeout: 300 }); else setTimeout(r, 16); });
  let gen = 0;
  // Paint the four layers in separate idle slices so no single task blocks the main thread.
  const paintAll = async () => {
    const my = ++gen;
    ready = 0;
    paintCv.width = Math.round(W * dpr);
    paintCv.height = Math.round(H * dpr);
    for (let i = 0; i < 4; i++) {
      await idle();
      if (my !== gen) return;
      pg.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (i === 0) paintWire(pg, W, H, L); else paintSite(pg, W, H, L, THEMES[i - 1]);
      upload(i);
      ready = i + 1;
      dirty = true;
    }
  };

  const size = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (w === W && Math.abs(h - H) < 120 && W) return; // ignore mobile URL-bar jitter
    W = w; H = h;
    dpr = Math.min(devicePixelRatio || 1, W < 768 ? 1.5 : 1.6, soft ? 1 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    L = layout(W, H);
    lens.x = lens.tx = L.mob ? W * 0.62 : W * 0.7;
    lens.y = lens.ty = L.mob ? H * 0.33 : H * 0.42;
    paintAll();
  };

  const lens = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, r: 0, boost: 1, tb: 1 };
  let lastInput = -1e9, dirty = true;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.buttons === 0 && e.type === "pointermove") return;
    const b = host.getBoundingClientRect();
    if (e.clientY < b.top || e.clientY > b.bottom) return;
    lens.tx = e.clientX - b.left;
    lens.ty = e.clientY - b.top;
    if (L?.mob) lens.ty = Math.min(lens.ty, H * 0.5);
    lastInput = performance.now();
    dirty = true;
  };
  const onDown = (e: PointerEvent) => { onMove(e); lens.tb = 1.22; };
  const onUp = () => { lens.tb = 1; };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", onDown, { passive: true });
  addEventListener("pointerup", onUp, { passive: true });
  addEventListener("pointercancel", onUp, { passive: true });
  const ro = new ResizeObserver(() => size());
  ro.observe(host);
  size();

  let raf = 0, t0 = performance.now(), last = t0, th = 0, themeShown = -1, born = 0, vis = true, lastTag = "", lastC = "";
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: "100px" });
  io.observe(host);

  function frame(now: number) {
    raf = 0;
    if (!vis) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const secH = sec.offsetHeight;
    const top = sec.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / Math.max(1, secH - H)));
    const cover = sm(0.08, 0.5, p);
    const t = (now - t0) / 1000;

    // Idle wander (a slow Lissajous) when nobody steers it.
    if (now - lastInput > 2600 && !soft) {
      const cx = L.mob ? W * 0.5 : W * 0.66, cy = L.mob ? H * 0.34 : H * 0.44;
      lens.tx = cx + Math.sin(t * 0.37) * (L.mob ? W * 0.28 : W * 0.2);
      lens.ty = cy + Math.sin(t * 0.53 + 1) * (L.mob ? H * 0.11 : H * 0.2);
    }
    const k = 1 - Math.pow(0.0008, dt);
    const px = lens.x, py = lens.y;
    lens.x += (lens.tx - lens.x) * k;
    lens.y += (lens.ty - lens.y) * k;
    lens.vx += ((lens.x - px) / Math.max(dt, 0.001) / 60 - lens.vx) * 0.25;
    lens.vy += ((lens.y - py) / Math.max(dt, 0.001) / 60 - lens.vy) * 0.25;
    lens.boost += (lens.tb - lens.boost) * Math.min(1, dt * 8);
    born = soft ? 1 : Math.min(1, born + dt * 1.2);

    const r0 = (L.mob ? Math.min(W * 0.27, H * 0.13) : Math.min(W, H) * 0.21) * lens.boost * (0.6 + 0.4 * sm(0, 1, born));
    const diag = Math.hypot(W, H);
    const ce = Math.pow(cover, 1.6);
    const R = r0 + (diag * 0.75 - r0) * ce;
    const lx = lens.x + (W / 2 - lens.x) * cover, ly = lens.y + (H / 2 - lens.y) * cover;

    // Sample sites wipe through every few seconds; faster once the lens fills the screen.
    th += dt / (cover > 0.6 ? 1.7 : 3.4);

    if (ready > 0) {
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform2f(u.L, lx * dpr, (H - ly) * dpr);
      gl.uniform2f(u.vel, lens.vx * dpr, -lens.vy * dpr);
      gl.uniform2f(u.sh, dpr, 0);
      gl.uniform1f(u.R, R * dpr);
      gl.uniform1f(u.th, ready === 4 ? th : 0);
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.cover, cover);
      gl.uniform1f(u.born, sm(0, 1, born));
      gl.uniform1f(u.wob, Math.min(1, Math.hypot(lens.vx, lens.vy) * 0.08));
      gl.uniform1f(u.fade, 0);
      gl.uniform1f(u.dim, sm(0.4, 0.55, p));
      if (!soft || dirty || p > 0) gl.drawArrays(gl.TRIANGLES, 0, 3);
      dirty = false;
    }

    // DOM: the lens label rides on the rim; the hero copy lifts away as the lens grows.
    const ti = Math.floor(th + (fractS(th) > 0.55 ? 1 : 0)) % 3;
    if (ti !== themeShown) { themeShown = ti; tag.querySelector("b")!.textContent = THEMES[ti].name; tag.querySelector("i")!.textContent = `0${ti + 1}/03`; }
    const ta = (1 - sm(0.04, 0.16, p)) * sm(0.3, 1, born);
    const tx = `translate3d(${(lx + R * 0.7).toFixed(1)}px,${(ly + R * 0.72).toFixed(1)}px,0)`;
    const tagS = tx + ta.toFixed(2);
    if (tagS !== lastTag) { lastTag = tagS; tag.style.transform = tx; tag.style.opacity = ta.toFixed(2); }
    const ca = sm(0.42, 0.56, p);
    const cs = ca.toFixed(3) + p.toFixed(3);
    if (cs !== lastC) {
      lastC = cs;
      line.style.opacity = ca.toFixed(3);
      line.style.transform = `translate3d(0,${((1 - sm(0.42, 0.6, p)) * 40).toFixed(1)}px,0)`;
      if (content) {
        const co = 1 - sm(0.03, 0.26, p);
        content.style.opacity = co.toFixed(3);
        content.style.transform = `translate3d(0,${(-sm(0.03, 0.3, p) * 80).toFixed(1)}px,0)`;
        content.style.visibility = co < 0.01 ? "hidden" : "";
      }
    }
  }
  const fractS = (x: number) => x - Math.floor(x);
  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.fonts?.ready.then(() => { W = 0; size(); });
  start();

  return () => {
    cancelAnimationFrame(raf);
    gen++;
    io.disconnect();
    ro.disconnect();
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerdown", onDown);
    removeEventListener("pointerup", onUp);
    removeEventListener("pointercancel", onUp);
    texs.forEach((t) => gl.deleteTexture(t));
    gl.deleteProgram(prog);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

/** Still fallback (reduced motion / no WebGL): blueprint with one finished circle. */
export function still(canvas: HTMLCanvasElement) {
  const W = canvas.clientWidth, H = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  const g = canvas.getContext("2d");
  if (!g) return;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const L = layout(W, H);
  paintWire(g, W, H, L);
  g.save();
  g.beginPath();
  g.arc(L.mob ? W * 0.62 : W * 0.7, L.mob ? H * 0.3 : H * 0.42, L.mob ? W * 0.27 : Math.min(W, H) * 0.21, 0, 7);
  g.clip();
  paintSite(g, W, H, L, THEMES[0]);
  g.restore();
}

export { KIWI };
