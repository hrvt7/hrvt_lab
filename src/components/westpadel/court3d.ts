/**
 * "Üsd át": a WebGL padel court. Scroll plays one rally — the ball lobs over the net, comes off the
 * back glass, crosses again, kisses the side glass and is finally smashed straight at the viewer.
 * After the hero the same ball keeps travelling down the page in screen space.
 */
import {
  AmbientLight, BoxGeometry, CanvasTexture, CircleGeometry, Color, DirectionalLight, DoubleSide, Group, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, OrthographicCamera, PerspectiveCamera, PlaneGeometry, RingGeometry,
  Scene, SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer, RepeatWrapping, type Material,
} from "three";

export type Api = { destroy: () => void };
type Opts = { canvas: HTMLCanvasElement; hero: HTMLElement; onStage: (s: number) => void; onBurst: (k: number, x: number, y: number) => void; onImpact: (x: number, y: number, idx: number) => void };

const NAVY = 0x081629, BLUE = 0x1c5fd4, LIME = 0xc6f135, LINE = 0xf4f7fb, STEEL = 0x0c1320;
const W2 = 5, L2 = 10; // half width / half length of the court (10 x 20 m)

/** One shot of the rally: from → to with a parabolic apex, played between scroll p0..p1. */
type Seg = { p0: number; p1: number; a: Vector3; b: Vector3; h: number; hit?: "floor" | "back" | "side" };
const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
const R = 0.24;
const SEGS: Seg[] = [
  { p0: 0.044, p1: 0.176, a: v(-1.6, 1.1, 6.2), b: v(1.8, R, -3.6), h: 3.4, hit: "floor" },
  { p0: 0.176, p1: 0.273, a: v(1.8, R, -3.6), b: v(3.1, 1.7, -L2 + R), h: 1.5, hit: "back" },
  { p0: 0.273, p1: 0.378, a: v(3.1, 1.7, -L2 + R), b: v(0.6, R, -6.4), h: 1.2, hit: "floor" },
  { p0: 0.378, p1: 0.510, a: v(0.6, R, -6.4), b: v(-2.6, R, 3.8), h: 3.6, hit: "floor" },
  { p0: 0.510, p1: 0.607, a: v(-2.6, R, 3.8), b: v(-W2 + R, 1.5, 7.4), h: 1.3, hit: "side" },
  { p0: 0.607, p1: 0.739, a: v(-W2 + R, 1.5, 7.4), b: v(0.2, 3.1, 5.6), h: 2.2 },
];
const SMASH0 = 0.739;

function gridTexture(cell: number, line: string, bg: string) {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d")!; g.fillStyle = bg; g.fillRect(0, 0, 64, 64);
  g.strokeStyle = line; g.lineWidth = 3; g.strokeRect(0, 0, 64, 64);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(cell, cell); t.colorSpace = SRGBColorSpace;
  return t;
}
/** Soft vertical sheen so the glass reads as glass without costly transmission. */
function glassTexture() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 256, 128);
  gr.addColorStop(0, "rgba(255,255,255,.02)"); gr.addColorStop(0.42, "rgba(255,255,255,.2)"); gr.addColorStop(0.5, "rgba(255,255,255,.05)"); gr.addColorStop(0.78, "rgba(255,255,255,.14)"); gr.addColorStop(1, "rgba(255,255,255,.02)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}
/** Felt ball with the two-lobed seam drawn onto an equirect texture. */
function ballTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256;
  const g = c.getContext("2d")!; g.fillStyle = "#c6f135"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${i % 2 ? 255 : 60},${i % 2 ? 255 : 90},${i % 2 ? 200 : 0},.05)`; g.fillRect(Math.random() * 512, Math.random() * 256, 2, 2); }
  g.strokeStyle = "#f7ffd9"; g.lineWidth = 9; g.beginPath();
  for (let x = 0; x <= 512; x += 4) { const y = 128 + Math.sin((x / 512) * Math.PI * 4) * 62; if (x) g.lineTo(x, y); else g.moveTo(x, y); }
  g.stroke();
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

export function mount({ canvas, hero, onStage, onBurst, onImpact }: Opts): Api {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.autoClear = false;

  const scene = new Scene();
  const cam = new PerspectiveCamera(42, 1, 0.1, 200);
  scene.add(new AmbientLight(0xbfd4ff, 1.5));
  const sun = new DirectionalLight(0xffffff, 2.2); sun.position.set(6, 14, 8); scene.add(sun);
  const disposables: { dispose: () => void }[] = [];
  const mat = <T extends Material>(m: T) => { disposables.push(m); return m; };
  const box = (w: number, h: number, d: number, m: Material, x: number, y: number, z: number, parent: Group | Scene = court) => {
    const geo = new BoxGeometry(w, h, d); disposables.push(geo);
    const mesh = new Mesh(geo, m); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };

  const court = new Group(); scene.add(court);
  // apron + playing surface
  const apronM = mat(new MeshStandardMaterial({ color: 0x0b2247, roughness: 0.95 }));
  const floorM = mat(new MeshStandardMaterial({ color: BLUE, roughness: 0.85 }));
  box(W2 * 2 + 7, 0.1, L2 * 2 + 7, apronM, 0, -0.06, 0);
  box(W2 * 2, 0.1, L2 * 2, floorM, 0, -0.04, 0);
  const lineM = mat(new MeshBasicMaterial({ color: LINE }));
  const ln = (w: number, d: number, x: number, z: number) => box(w, 0.012, d, lineM, x, 0.016, z);
  ln(W2 * 2, 0.06, 0, -L2 + 0.03); ln(W2 * 2, 0.06, 0, L2 - 0.03); ln(0.06, L2 * 2, -W2 + 0.03, 0); ln(0.06, L2 * 2, W2 - 0.03, 0);
  ln(W2 * 2, 0.06, 0, -6.95); ln(W2 * 2, 0.06, 0, 6.95); ln(0.06, 13.9, 0, 0);
  // net
  const netT = gridTexture(1, "rgba(255,255,255,.9)", "rgba(8,22,41,.35)"); netT.repeat.set(46, 4); disposables.push(netT);
  const netM = mat(new MeshBasicMaterial({ map: netT, transparent: true, side: DoubleSide }));
  const netG = new PlaneGeometry(W2 * 2, 0.9); disposables.push(netG);
  const net = new Mesh(netG, netM); net.position.set(0, 0.45, 0); court.add(net);
  box(W2 * 2, 0.06, 0.03, lineM, 0, 0.92, 0);
  const steelM = mat(new MeshStandardMaterial({ color: STEEL, roughness: 0.5, metalness: 0.6 }));
  box(0.09, 1, 0.09, steelM, -W2, 0.5, 0); box(0.09, 1, 0.09, steelM, W2, 0.5, 0);
  // glass: full back walls + 4 m side returns, mesh fence along the middle of the sides
  const glassT = glassTexture(); disposables.push(glassT);
  const glassM = mat(new MeshBasicMaterial({ map: glassT, color: 0xbfe0ff, transparent: true, opacity: 0.55, side: DoubleSide, depthWrite: false }));
  const fenceT = gridTexture(1, "rgba(190,215,255,.5)", "rgba(0,0,0,0)"); disposables.push(fenceT);
  const fenceM = mat(new MeshBasicMaterial({ map: fenceT, transparent: true, side: DoubleSide, depthWrite: false }));
  const pane = (w: number, h: number, x: number, y: number, z: number, ry: number, m: Material, rep?: [number, number]) => {
    const g = new PlaneGeometry(w, h); disposables.push(g);
    if (rep) { const t = fenceT.clone(); t.repeat.set(rep[0], rep[1]); t.needsUpdate = true; disposables.push(t); m = mat(new MeshBasicMaterial({ map: t, transparent: true, side: DoubleSide, depthWrite: false })); }
    const mesh = new Mesh(g, m); mesh.position.set(x, y, z); mesh.rotation.y = ry; court.add(mesh); return mesh;
  };
  const GH = 3;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 5; i++) pane(2, GH, -W2 + 1 + i * 2, GH / 2, s * L2, 0, glassM);
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 2; i++) pane(2, GH, sx * W2, GH / 2, s * (L2 - 1 - i * 2), Math.PI / 2, glassM);
      pane(6, GH, sx * W2, GH / 2, s * 3, Math.PI / 2, fenceM, [22, 11]);
    }
    // top fence above the back glass
    pane(W2 * 2, 1, 0, GH + 0.5, s * L2, 0, fenceM, [36, 4]);
  }
  // steel frame
  for (const sx of [-1, 1]) for (const z of [-L2, -L2 + 2, -L2 + 4, -3, 0, 3, L2 - 4, L2 - 2, L2]) box(0.08, z === -L2 || z === L2 ? 4 : GH, 0.08, steelM, sx * W2, (z === -L2 || z === L2 ? 4 : GH) / 2, z);
  for (const s of [-1, 1]) {
    for (let i = 1; i < 5; i++) box(0.06, GH, 0.06, steelM, -W2 + i * 2, GH / 2, s * L2);
    box(W2 * 2, 0.07, 0.07, steelM, 0, GH, s * L2); box(W2 * 2, 0.07, 0.07, steelM, 0, 4, s * L2);
  }
  for (const sx of [-1, 1]) box(0.07, 0.07, L2 * 2, steelM, sx * W2, GH, 0);
  // floodlights: 4 masts with glowing heads
  const glowM = mat(new MeshBasicMaterial({ color: 0xfffbe0 }));
  for (const sx of [-1, 1]) for (const z of [-5, 5]) { box(0.1, 6, 0.1, steelM, sx * (W2 + 0.2), 3, z); box(0.2, 0.12, 0.9, glowM, sx * (W2 - 0.15), 6, z); }

  // ball, its floor shadow, the ghost trail, impact rings
  const ballT = ballTexture(); disposables.push(ballT);
  const ballG = new SphereGeometry(1, 40, 28); disposables.push(ballG);
  const ballM = mat(new MeshStandardMaterial({ map: ballT, roughness: 0.75, emissive: new Color(LIME), emissiveIntensity: 0.22 }));
  const ball = new Mesh(ballG, ballM); ball.scale.setScalar(R); scene.add(ball);
  const shG = new CircleGeometry(1, 28); disposables.push(shG);
  const shM = mat(new MeshBasicMaterial({ color: 0x020814, transparent: true, opacity: 0.4, depthWrite: false }));
  const shadow = new Mesh(shG, shM); shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
  const TR = 12;
  const trail = Array.from({ length: TR }, (_, i) => {
    const m = mat(new MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.32 * (1 - i / TR), depthWrite: false }));
    const g = new Mesh(ballG, m); g.scale.setScalar(R * (0.9 - i * 0.045)); scene.add(g); return g;
  });
  const ringG = new RingGeometry(0.72, 1, 40); disposables.push(ringG);
  const rings = SEGS.filter((s) => s.hit).map((s) => {
    const m = mat(new MeshBasicMaterial({ color: s.hit === "floor" ? 0xffffff : LIME, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false }));
    const r = new Mesh(ringG, m); r.position.copy(s.b);
    if (s.hit === "floor") { r.rotation.x = -Math.PI / 2; r.position.y = 0.03; }
    if (s.hit === "back") r.position.z = -L2 + 0.04;
    if (s.hit === "side") { r.rotation.y = Math.PI / 2; r.position.x = -W2 + 0.04; }
    scene.add(r); return { r, m, p: s.p1 };
  });

  // screen-space pass for the ball once it has left the court
  const scene2 = new Scene();
  const cam2 = new OrthographicCamera(0, 1, 0, 1, -500, 500);
  scene2.add(new AmbientLight(0xffffff, 1.9));
  const sun2 = new DirectionalLight(0xffffff, 2); sun2.position.set(-0.5, -1, 1.2); scene2.add(sun2);
  const ball2 = new Mesh(ballG, ballM); scene2.add(ball2);

  let W = 1, H = 1, mob = false, heroTop = 0, heroRange = 1, docH = 1, raf = 0, ps = -1, tPrev = performance.now(), stage = -1, burst = -1, lastKey = "", spin = 0;
  let bounds: number[] = [], lastSect: number | null = null;
  const camPos = new Vector3(), camAim = new Vector3(), tmp = new Vector3();

  const measure = () => {
    W = innerWidth; H = innerHeight; mob = W < 768;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.fov = mob ? 50 : 40; cam.updateProjectionMatrix();
    cam2.right = W; cam2.bottom = H; cam2.updateProjectionMatrix();
    heroTop = hero.getBoundingClientRect().top + scrollY; heroRange = Math.max(1, hero.offsetHeight - H);
    docH = document.documentElement.scrollHeight;
    bounds = [...document.querySelectorAll<HTMLElement>("[data-hit]")].map((el) => el.getBoundingClientRect().top + scrollY);
    lastKey = "";
  };

  const ballAt = (p: number, out: Vector3) => {
    if (p <= SEGS[0].p0) return out.copy(SEGS[0].a);
    for (const s of SEGS) if (p <= s.p1) {
      const k = (p - s.p0) / (s.p1 - s.p0);
      return out.lerpVectors(s.a, s.b, k).setY(s.a.y + (s.b.y - s.a.y) * k + s.h * 4 * k * (1 - k));
    }
    // the smash: straight at the lens
    const k = Math.min(1, (p - SMASH0) / (0.875 - SMASH0)), e = k * k * (3 - 2 * k);
    return out.lerpVectors(SEGS[SEGS.length - 1].b, tmp.copy(camPos).lerp(camAim, 0.07), e * e);
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now;
    const target = Math.min(1.2, Math.max(0, (scrollY - heroTop) / heroRange));
    ps = ps < 0 || reduced ? target : ps + (target - ps) * (1 - Math.exp(-dt * 8));
    if (Math.abs(target - ps) < 0.00003) ps = target;
    const p = Math.min(1, ps), t = now / 1000;
    const idle = p < 0.025 && !reduced;
    const key = `${ps.toFixed(5)}|${scrollY | 0}|${idle ? (t * 30) | 0 : 0}`;
    if (key === lastKey) return;
    lastKey = key;

    const st = p < 0.176 ? 0 : p < 0.396 ? 1 : p < 0.634 ? 2 : 3;
    if (st !== stage) { stage = st; onStage(st); }
    // the lime burst that carries the ball through into the page
    const bk = Math.min(1, Math.max(0, (p - 0.84) / 0.07));
    const bkNew = bk;

    renderer.clear();
    if (ps < 1.02) {
      // camera: slow orbit; portrait looks down the length of the court, landscape from the corner
      const a = (mob ? 0.1 : 0.62) - p * (mob ? 0.2 : 0.5);
      const rad = mob ? 25 : 23, hgt = mob ? 8.5 - p * 2 : 7 - p * 2.2;
      camPos.set(Math.sin(a) * rad, hgt, Math.cos(a) * rad);
      camAim.set(mob ? 0 : -5.5 + p * 1.5, mob ? 6.4 : 4.6, mob ? -1 : 0);
      cam.position.copy(camPos); cam.lookAt(camAim);
      court.position.y = 0;

      ballAt(p, ball.position);
      if (idle) ball.position.y = R + Math.abs(Math.sin(t * 4.2)) * 1.25; // dribble while waiting at the top
      spin += dt * 3 + Math.abs(target - ps) * 40;
      ball.rotation.set(spin * 0.7, spin, 0);
      ball.scale.setScalar(R * (mob ? 1.25 : 1));
      shadow.position.set(ball.position.x, 0.02, ball.position.z);
      const hs = Math.max(0.25, 1 - ball.position.y / 7); shadow.scale.setScalar(R * 1.5 * hs + 0.12); shM.opacity = p > SMASH0 ? 0 : 0.42 * hs;
      trail.forEach((g, i) => { ballAt(Math.max(0, p - (i + 1) * 0.006), g.position); g.visible = p > 0.05 && !idle; });
      rings.forEach(({ r, m, p: hp }) => { const k = (p - hp) / 0.07; const on = k > 0 && k < 1; m.opacity = on ? 0.85 * (1 - k) : 0; r.scale.setScalar(on ? 0.3 + k * 1.9 : 0.01); });
      if (bkNew !== burst) { burst = bkNew; tmp.copy(ball.position).project(cam); onBurst(bkNew, Math.min(85, Math.max(15, (tmp.x * 0.5 + 0.5) * 100)), Math.min(85, Math.max(15, (-tmp.y * 0.5 + 0.5) * 100))); }
      renderer.render(scene, cam);
    } else {
      // after the hero: the ball rides the page in screen space, crossing from margin to margin
      const y0 = scrollY + H * 0.5, total = Math.max(1, docH - (heroTop + heroRange + H));
      const u = Math.min(1, Math.max(0, (scrollY - heroTop - heroRange) / total));
      const rad = mob ? 15 : 24, pad = rad + (mob ? 6 : 26);
      const cyc = (scrollY - heroTop - heroRange) / (H * 0.9);
      const tri = Math.abs(((cyc % 2) + 2) % 2 - 1); // 0..1..0
      const x = pad + (W - pad * 2) * (mob ? (tri > 0.5 ? 1 : 0) * 0 + (0.08 + tri * 0.84) : tri);
      const y = H * (mob ? 0.2 : 0.3) + Math.abs(Math.sin(cyc * Math.PI)) * H * (mob ? 0.16 : 0.22);
      ball2.position.set(x, y, 0); ball2.scale.setScalar(rad);
      ball2.rotation.set(0, 0, cyc * 5); ball2.rotateX(cyc * 3);
      ball2.visible = u < 0.985;
      // crossing a section edge: tell the page where the ball "hit" it
      let sect = -1; for (let i = 0; i < bounds.length; i++) if (y0 - H * 0.5 + y >= bounds[i]) sect = i;
      if (sect !== lastSect) { if (lastSect !== null) { const i = Math.max(sect, lastSect); onImpact(x, bounds[i] - scrollY, i); } lastSect = sect; }
      if (burst !== 1) { burst = 1; onBurst(1, 50, 50); }
      renderer.render(scene2, cam2);
    }
  };

  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  addEventListener("resize", measure);
  measure();
  raf = requestAnimationFrame(frame);

  return {
    destroy: () => {
      cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("resize", measure);
      disposables.forEach((d) => d.dispose()); renderer.dispose();
    },
  };
}
