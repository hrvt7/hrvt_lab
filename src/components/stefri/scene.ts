/**
 * "Jön az autó": a hand-drawn 2D road scene. Scroll drives the Stefri mobile-shop van from the
 * Austrian border, across the Vas hills, through villages. Everything is drawn in code (canvas 2D).
 */
type G = CanvasRenderingContext2D;
const C = { sky1: "#f6efe2", sky2: "#f3d9a8", sun: "#e8b23a", far: "#c9d3a6", mid: "#9fb873", near: "#6f9a4a", field: "#e3c873", road: "#4a3a33", line: "#f6efe2", ink: "#2a1a14", red: "#c8201c", green: "#1f6b3a", white: "#fffdf7", roof: "#b5482f", wall: "#f3e6cf" };
const WORLD = 5200; // world length in px at scale 1
const SIGNS: [number, string, string][] = [[520, "MAGYARORSZÁG", "border"], [1750, "Tanakajd", "town"], [3050, "Vasszécseny", "town"], [4550, "A te utcád", "stop"]];
const VILLAGES = [1900, 3200, 4700];

function hill(g: G, W: number, base: number, amp: number, off: number, freq: number, color: string, H: number) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(0, H);
  for (let x = 0; x <= W + 20; x += 20) g.lineTo(x, base - Math.sin((x + off) * freq) * amp - Math.sin((x + off) * freq * 2.3 + 1) * amp * 0.35);
  g.lineTo(W, H);
  g.fill();
}
function house(g: G, x: number, y: number, s: number, church = false) {
  g.fillStyle = C.wall; g.strokeStyle = C.ink; g.lineWidth = 2 * s;
  if (church) {
    g.fillRect(x, y - 70 * s, 26 * s, 70 * s); g.strokeRect(x, y - 70 * s, 26 * s, 70 * s);
    g.fillStyle = C.roof; g.beginPath(); g.moveTo(x - 3 * s, y - 70 * s); g.lineTo(x + 13 * s, y - 112 * s); g.lineTo(x + 29 * s, y - 70 * s); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = C.wall; g.fillRect(x + 26 * s, y - 38 * s, 58 * s, 38 * s); g.strokeRect(x + 26 * s, y - 38 * s, 58 * s, 38 * s);
    g.fillStyle = C.roof; g.beginPath(); g.moveTo(x + 24 * s, y - 38 * s); g.lineTo(x + 40 * s, y - 60 * s); g.lineTo(x + 80 * s, y - 60 * s); g.lineTo(x + 87 * s, y - 38 * s); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = C.ink; g.fillRect(x + 10 * s, y - 56 * s, 6 * s, 12 * s);
    return;
  }
  g.fillRect(x, y - 34 * s, 60 * s, 34 * s); g.strokeRect(x, y - 34 * s, 60 * s, 34 * s);
  g.fillStyle = C.roof; g.beginPath(); g.moveTo(x - 6 * s, y - 34 * s); g.lineTo(x + 12 * s, y - 60 * s); g.lineTo(x + 48 * s, y - 60 * s); g.lineTo(x + 66 * s, y - 34 * s); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = C.ink; g.fillRect(x + 10 * s, y - 24 * s, 10 * s, 10 * s); g.fillRect(x + 38 * s, y - 22 * s, 11 * s, 22 * s);
}
function tree(g: G, x: number, y: number, s: number) {
  g.fillStyle = C.ink; g.fillRect(x - 2 * s, y - 26 * s, 4 * s, 26 * s);
  g.fillStyle = C.green; g.beginPath(); g.arc(x, y - 38 * s, 17 * s, 0, 7); g.arc(x - 11 * s, y - 28 * s, 12 * s, 0, 7); g.arc(x + 11 * s, y - 28 * s, 12 * s, 0, 7); g.fill();
}
function sign(g: G, x: number, y: number, s: number, text: string, kind: string) {
  g.fillStyle = C.ink; g.fillRect(x - 3 * s, y - 92 * s, 6 * s, 92 * s);
  g.font = `400 ${21 * s}px "Alfa Slab One", Georgia, serif`;
  const w = g.measureText(text).width + 30 * s, h = 44 * s;
  g.fillStyle = kind === "stop" ? C.red : C.white; g.strokeStyle = C.ink; g.lineWidth = 3.5 * s;
  g.beginPath(); g.roundRect(x - w / 2, y - 92 * s - h, w, h, 7 * s); g.fill(); g.stroke();
  if (kind === "border") { g.fillStyle = C.red; g.fillRect(x - w / 2 + 3 * s, y - 92 * s - h + 3 * s, w - 6 * s, 6 * s); g.fillStyle = C.green; g.fillRect(x - w / 2 + 3 * s, y - 92 * s - 9 * s, w - 6 * s, 6 * s); }
  g.fillStyle = kind === "stop" ? C.white : C.ink; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, x, y - 92 * s - h / 2 + 1 * s);
}
function van(g: G, x: number, y: number, s: number, roll: number, bob: number) {
  g.save(); g.translate(x, y + bob); g.scale(s, s);
  // shadow
  g.fillStyle = "rgba(42,26,20,.18)"; g.beginPath(); g.ellipse(0, 4 - bob / s, 150, 10, 0, 0, 7); g.fill();
  g.lineWidth = 4; g.strokeStyle = C.ink; g.lineJoin = "round";
  // box
  g.fillStyle = C.white; g.beginPath(); g.roundRect(-150, -150, 190, 126, 8); g.fill(); g.stroke();
  // red panel with product dots
  g.fillStyle = C.red; g.beginPath(); g.roundRect(-140, -140, 170, 74, 5); g.fill();
  const dots = ["#f3c9a5", "#e8a07a", "#fff3dc", "#d98a6a", "#f6d98f", "#c96f55", "#f3c9a5", "#fff3dc"];
  dots.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.ellipse(-122 + (i % 4) * 44, -122 + Math.floor(i / 4) * 34, 15, 10, i, 0, 7); g.fill(); });
  g.fillStyle = C.red; g.font = '400 17px "Alfa Slab One", Georgia, serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MOZGÓ BOLT", -55, -48);
  g.fillStyle = C.green; g.fillRect(-140, -36, 170, 5);
  // cab
  g.fillStyle = C.white; g.beginPath(); g.moveTo(40, -112); g.lineTo(92, -112); g.quadraticCurveTo(112, -108, 124, -72); g.lineTo(150, -58); g.quadraticCurveTo(158, -54, 158, -40); g.lineTo(158, -24); g.lineTo(40, -24); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#bfd9e6"; g.beginPath(); g.moveTo(58, -102); g.lineTo(90, -102); g.quadraticCurveTo(102, -98, 112, -70); g.lineTo(58, -70); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#e8b23a"; g.fillRect(150, -50, 8, 10);
  // chassis
  g.fillStyle = C.ink; g.fillRect(-150, -26, 308, 8);
  // wheels
  for (const wx of [-96, 104]) {
    g.fillStyle = C.ink; g.beginPath(); g.arc(wx, -14, 26, 0, 7); g.fill();
    g.fillStyle = "#d9d2c4"; g.beginPath(); g.arc(wx, -14, 12, 0, 7); g.fill();
    g.strokeStyle = C.ink; g.lineWidth = 3;
    for (let i = 0; i < 4; i++) { const a = roll + (i * Math.PI) / 2; g.beginPath(); g.moveTo(wx, -14); g.lineTo(wx + Math.cos(a) * 12, -14 + Math.sin(a) * 12); g.stroke(); }
  }
  g.restore();
}
(C as Record<string, string>).must = "#e8b23a";

export function mount(host: HTMLElement, sec: HTMLElement, canvas: HTMLCanvasElement, onStage: (s: number) => void) {
  const g = canvas.getContext("2d")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, dpr = 1, raf = 0, vis = true, last = -1, stage = -1, tPrev = performance.now(), idle = 0;
  const size = () => {
    W = host.clientWidth; H = host.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    last = -1;
  };
  const draw = (p: number, t: number) => {
    const mob = W < 768;
    const s = mob ? Math.min(0.62, W / 620) : Math.min(1, Math.max(0.7, H / 900));
    const ground = H * (mob ? 0.86 : 0.84);
    const vanX = W * (mob ? 0.4 : 0.34);
    const cam = p * (WORLD * s - W * 0.5); // world offset
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sky = g.createLinearGradient(0, 0, 0, ground); sky.addColorStop(0, C.sky1); sky.addColorStop(1, C.sky2);
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // sun travels the sky with the trip
    g.fillStyle = C.sun; g.beginPath(); g.arc(W * (0.82 - p * 0.5), ground - H * (0.34 + Math.sin(p * Math.PI) * 0.12), 46 * s, 0, 7); g.fill();
    hill(g, W, ground - 150 * s, 46 * s, cam * 0.15, 0.0035 / s, C.far, H);
    hill(g, W, ground - 86 * s, 34 * s, cam * 0.35 + 300, 0.005 / s, C.mid, H);
    // field stripes on the mid hill
    g.strokeStyle = "rgba(42,26,20,.08)"; g.lineWidth = 2;
    for (let i = 0; i < 14; i++) { const x = ((i * 190 * s - cam * 0.35) % (W + 300)) ; const xx = x < -150 ? x + W + 300 : x; g.beginPath(); g.moveTo(xx, ground - 60 * s); g.lineTo(xx + 70 * s, ground - 8 * s); g.stroke(); }
    // villages (parallax .7) and trees
    VILLAGES.forEach((vx, i) => {
      const x = vx * s - cam * 0.8 + vanX;
      if (x < -400 * s || x > W + 200) return;
      house(g, x, ground - 22 * s, s * 0.9, true); house(g, x + 110 * s, ground - 20 * s, s * 0.9); house(g, x - 90 * s, ground - 20 * s, s * 0.8); house(g, x + 190 * s, ground - 20 * s, s * 0.75);
      void i;
    });
    hill(g, W, ground - 14 * s, 9 * s, cam * 0.8, 0.008 / s, C.near, H);
    for (let i = 0; i < 26; i++) { const x = i * 215 * s + 80 * s - cam + vanX; if (x > -60 && x < W + 60 && i % 3 !== 1) tree(g, x, ground - 12 * s, s * (0.8 + (i % 3) * 0.15)); }
    // road
    g.fillStyle = C.road; g.fillRect(0, ground, W, H - ground);
    g.fillStyle = C.line; const dash = 70 * s;
    for (let x = -((cam) % (dash * 2)); x < W; x += dash * 2) g.fillRect(x, ground + (H - ground) * 0.42, dash, 5 * s);
    g.fillStyle = C.ink; g.fillRect(0, ground - 3, W, 3);
    // signs
    SIGNS.forEach(([sx, text, kind]) => { const x = sx * s - cam + vanX; if (x > -200 && x < W + 200) sign(g, x, ground, s, text, kind); });
    // van
    const dist = cam + idle;
    van(g, vanX, ground + (H - ground) * 0.3, s * (mob ? 1.05 : 1), dist / (26 * s), reduced ? 0 : Math.sin(dist * 0.012 / s) * 1.4);
    // exhaust puffs
    if (!reduced && p < 0.985) for (let i = 0; i < 3; i++) { const k = (t * 1.6 + i / 3) % 1; g.fillStyle = `rgba(255,253,247,${0.5 * (1 - k)})`; g.beginPath(); g.arc(vanX - 165 * s - k * 60 * s, ground + (H - ground) * 0.3 - 22 * s - k * 22 * s, (6 + k * 12) * s, 0, 7); g.fill(); }
  };
  // Scroll position is read cheaply (no layout) and eased, so the camera glides instead of
  // jumping with every scroll event; touch scrolling delivers uneven steps otherwise.
  let top = 0, range = 1, ps = -1;
  const measure = () => { top = sec.getBoundingClientRect().top + scrollY; range = Math.max(1, sec.offsetHeight - H); };
  const frame = (now: number) => {
    raf = 0;
    if (!vis) return;
    if (!reduced) raf = requestAnimationFrame(frame);
    const target = Math.min(1, Math.max(0, (scrollY - top) / range));
    const dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now;
    ps = ps < 0 || reduced ? target : ps + (target - ps) * (1 - Math.exp(-dt * 9));
    if (Math.abs(target - ps) < 0.00002) ps = target;
    const p = ps;
    if (p < 0.01) idle += dt * 60; // wheels keep turning gently at the very top
    const st = p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.78 ? 2 : 3;
    if (st !== stage) { stage = st; onStage(st); }
    draw(p, now / 1000); last = p;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const ro = new ResizeObserver(() => { size(); measure(); kick(); });
  ro.observe(sec);
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); }, { rootMargin: "100px" });
  io.observe(host);
  size(); measure(); kick();
  if (reduced) addEventListener("scroll", kick, { passive: true });
  document.fonts?.ready.then(kick);
  void last;
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("scroll", kick); };
}
