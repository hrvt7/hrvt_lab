/**
 * "Négy évszak a kertben": one low-poly garden in WebGL. Scrolling turns the year — snow and a steaming
 * hot tub, the pergola opening in spring, grill and swim spa in summer, the sauna glowing in autumn.
 */
import {
  AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CircleGeometry, Color, ConeGeometry, CylinderGeometry,
  DirectionalLight, Fog, Group, HemisphereLight, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera,
  PlaneGeometry, PointLight, Points, PointsMaterial, Scene, SRGBColorSpace, Vector3, WebGLRenderer, type Material,
} from "three";

export type Api = { destroy: () => void };
type Opts = { canvas: HTMLCanvasElement; hero: HTMLElement; host: HTMLElement; onFrame: (s: { stage: number; top: string; bottom: string }) => void };

const S = (...h: number[]) => h.map((x) => new Color(x));
// winter, spring, summer, autumn
const SKY_TOP = S(0x182645, 0x8fc7ee, 0x4fa8ee, 0x4d3f66), SKY_BOT = S(0x7f97c2, 0xf6e6ee, 0xffe6ae, 0xf5a85e);
const GROUND = S(0xeaf1f8, 0x86c35c, 0x5a9f3f, 0xb7873a), LEAF = S(0xf6fafd, 0xf7a8c6, 0x3c8b38, 0xdc6420), HEDGE = S(0xdfe9f2, 0x5f9f4b, 0x3f7f35, 0x8f7a2e);
const SUN = S(0x9db9ff, 0xfff2e0, 0xfff1cc, 0xffad6b), SUN_I = [1.0, 1.9, 2.5, 1.7], HEMI_I = [1.2, 1.5, 1.6, 1.2];
const FLAKE = S(0xffffff, 0xffb7d0, 0xfff3b0, 0xe8742a), FLAKE_O = [0.95, 0.75, 0.0, 0.9], FLAKE_V = [0.5, 0.35, 0.1, 0.8];
const STEAM = [0.6, 0.3, 0.12, 0.45], SAUNA = [2.2, 0.5, 0.2, 2.6], GRILL = [0, 0.15, 1.8, 0.2], SLAT = [0.0, 0.75, 1.25, 0.4];
const CAM: [Vector3, Vector3][] = [
  [new Vector3(-6.8, 3.4, 9.2), new Vector3(-1.2, 0.8, 0.2)],
  [new Vector3(6.8, 3.8, 9.6), new Vector3(1.3, 1.3, -0.2)],
  [new Vector3(11.2, 3.9, 7.4), new Vector3(2.6, 0.9, -0.8)],
  [new Vector3(-10.4, 3.2, 6.6), new Vector3(-3.2, 1.0, -1.2)],
];

function dot() {
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.5, "rgba(255,255,255,.45)"); r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

export function mount({ canvas, hero, host, onFrame }: Opts): Api {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0, 0); renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene(); scene.fog = new Fog(0xffffff, 24, 70);
  const cam = new PerspectiveCamera(40, 1, 0.1, 120);
  const hemi = new HemisphereLight(0xffffff, 0x556655, 1.4); scene.add(hemi);
  const sun = new DirectionalLight(0xffffff, 2); sun.position.set(6, 9, 5); scene.add(sun);
  scene.add(new AmbientLight(0xffffff, 0.25));
  const bin: { dispose: () => void }[] = [];
  const L = (c: number, o: Partial<{ emissive: number; ei: number; transparent: boolean; opacity: number }> = {}) => { const m = new MeshLambertMaterial({ color: c, flatShading: true, emissive: o.emissive ?? 0, emissiveIntensity: o.ei ?? 0, transparent: o.transparent, opacity: o.opacity ?? 1 }); bin.push(m); return m; };
  const box = (w: number, h: number, d: number, m: Material, x: number, y: number, z: number, p: Group | Scene = scene) => { const g = new BoxGeometry(w, h, d); bin.push(g); const me = new Mesh(g, m); me.position.set(x, y, z); p.add(me); return me; };

  // ground, hedge, deck
  const groundM = L(0xffffff), gG = new CircleGeometry(40, 48); bin.push(gG);
  const ground = new Mesh(gG, groundM); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const hedgeM = L(0xffffff);
  box(28, 1.5, 0.9, hedgeM, 0, 0.75, -6.8); box(0.9, 1.5, 10, hedgeM, -13.5, 0.75, -1.8); box(0.9, 1.5, 10, hedgeM, 13.5, 0.75, -1.8);
  const deckM = L(0x8a5a3a), deckM2 = L(0x7a4e31);
  for (let i = 0; i < 14; i++) box(0.5, 0.16, 5, i % 2 ? deckM : deckM2, -3.25 + i * 0.5, 0.08, 0);
  // house wall hint behind the deck
  box(7.4, 3.4, 0.3, L(0xf1ede4), 0, 1.7, -2.75); box(2.2, 2.2, 0.08, L(0x21303a, { emissive: 0xffd9a0, ei: 0.5 }), -1.6, 1.3, -2.58); box(2.2, 2.2, 0.08, L(0x21303a, { emissive: 0xffd9a0, ei: 0.35 }), 1.6, 1.3, -2.58);

  // hot tub
  const tub = new Group(); tub.position.set(-1.5, 0.16, 0.5); scene.add(tub);
  box(2.2, 0.82, 2.2, L(0x3b3f45), 0, 0.41, 0, tub); box(2.3, 0.1, 2.3, L(0xf4f6f7), 0, 0.86, 0, tub);
  const waterM = L(0x39c6c0, { emissive: 0x1aa7b0, ei: 0.9 });
  const wG = new PlaneGeometry(1.9, 1.9, 10, 10); bin.push(wG); const water = new Mesh(wG, waterM); water.rotation.x = -Math.PI / 2; water.position.y = 0.975; tub.add(water);
  const wBase = (wG.attributes.position.array as Float32Array).slice();
  box(0.6, 0.18, 0.5, deckM, -1.5, 0.09, 0, tub); // step
  // swim spa at the back right
  const swim = new Group(); swim.position.set(4.6, 0, -3.6); scene.add(swim);
  box(5, 1.1, 2.2, L(0x4a4f56), 0, 0.55, 0, swim); box(5.1, 0.1, 2.3, L(0xf4f6f7), 0, 1.14, 0, swim); box(4.6, 0.04, 1.85, L(0x39c6c0, { emissive: 0x1aa7b0, ei: 0.7 }), 0, 1.2, 0, swim);
  // pergola with louvres, sofa and table
  const per = new Group(); per.position.set(1.7, 0.16, 0.1); scene.add(per);
  const steel = L(0x2a2d31);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.14, 2.5, 0.14, steel, sx * 1.6, 1.25, sz * 1.7, per);
  box(3.34, 0.18, 0.14, steel, 0, 2.5, -1.7, per); box(3.34, 0.18, 0.14, steel, 0, 2.5, 1.7, per); box(0.14, 0.18, 3.54, steel, -1.6, 2.5, 0, per); box(0.14, 0.18, 3.54, steel, 1.6, 2.5, 0, per);
  const slatM = L(0x3a3e44), slats = Array.from({ length: 12 }, (_, i) => box(3.1, 0.03, 0.27, slatM, 0, 2.52, -1.52 + i * 0.277, per));
  const sofaM = L(0x8d949b), cush = L(0xe9e4d8);
  box(2.1, 0.36, 0.8, sofaM, 0, 0.2, -1.1, per); box(2.1, 0.5, 0.2, sofaM, 0, 0.6, -1.42, per); box(1.9, 0.14, 0.62, cush, 0, 0.44, -1.05, per);
  box(1.1, 0.06, 0.6, L(0x5d4030), 0, 0.42, 0.1, per); box(0.08, 0.4, 0.08, steel, -0.45, 0.2, 0.1, per); box(0.08, 0.4, 0.08, steel, 0.45, 0.2, 0.1, per);
  // grill on the lawn
  const grill = new Group(); grill.position.set(4.4, 0, 1.2); grill.rotation.y = -0.9; scene.add(grill);
  box(1.2, 0.7, 0.55, L(0xb9bec4), 0, 0.5, 0, grill); box(1.3, 0.36, 0.6, L(0x8f959c), 0, 1.02, 0, grill); box(0.5, 0.05, 0.5, L(0x9aa0a6), -0.9, 0.86, 0, grill);
  const emberM = L(0x221008, { emissive: 0xff6a1a, ei: 0 }); box(1.1, 0.06, 0.06, emberM, 0, 0.86, 0.3, grill);
  const fire = new PointLight(0xff8a3a, 0, 6); fire.position.set(0, 1.2, 0.5); grill.add(fire);
  // sauna cabin
  const sauna = new Group(); sauna.position.set(-4.6, 0, -2.2); sauna.rotation.y = 0.5; scene.add(sauna);
  box(2.3, 2.1, 2, L(0xd9b98a), 0, 1.05, 0, sauna); box(2.5, 0.12, 2.2, L(0x6a4a33), 0, 2.16, 0, sauna);
  const glassM = L(0x402a12, { emissive: 0xffa040, ei: 1 }); box(0.9, 1.7, 0.06, glassM, 0.35, 0.95, 1.02, sauna);
  const glow = new PointLight(0xffa24a, 0, 7); glow.position.set(0.4, 1, 1.8); sauna.add(glow);
  // trees
  const leafM = L(0xffffff), trunkM = L(0x5b4030), tG = new CylinderGeometry(0.12, 0.18, 1.6, 6), cG = new IcosahedronGeometry(1, 1), coneG = new ConeGeometry(1, 2.6, 7); bin.push(tG, cG, coneG);
  const canopies: Mesh[] = [];
  for (const [x, z, s] of [[-7.6, -4.4, 1.5], [7.8, -4.8, 1.7], [-12, -5.2, 1.3], [12, -5.4, 1.4], [0.4, -8.6, 1.9]] as const) {
    const t = new Mesh(tG, trunkM); t.position.set(x, 0.8 * s, z); t.scale.setScalar(s); scene.add(t);
    const c = new Mesh(cG, leafM); c.position.set(x, 2.1 * s, z); c.scale.setScalar(s); scene.add(c); canopies.push(c);
  }
  const pineM = L(0x2f6b3a); for (const [x, z] of [[-3.2, -8.4], [5.2, -8.8]] as const) { const p = new Mesh(coneG, pineM); p.position.set(x, 1.5, z); scene.add(p); }

  // falling particles (snow / petals / leaves) and steam
  const tex = dot(); bin.push(tex);
  const N = 420, fp = new Float32Array(N * 3), fs = new Float32Array(N);
  for (let i = 0; i < N; i++) { fp[i * 3] = (Math.random() - 0.5) * 26; fp[i * 3 + 1] = Math.random() * 9; fp[i * 3 + 2] = (Math.random() - 0.5) * 20; fs[i] = Math.random(); }
  const fG = new BufferGeometry(); fG.setAttribute("position", new BufferAttribute(fp, 3)); bin.push(fG);
  const fM = new PointsMaterial({ map: tex, size: 0.16, transparent: true, depthWrite: false, color: 0xffffff }); bin.push(fM);
  scene.add(new Points(fG, fM));
  const M = 46, sp = new Float32Array(M * 3), sl = new Float32Array(M);
  for (let i = 0; i < M; i++) sl[i] = Math.random();
  const sG = new BufferGeometry(); sG.setAttribute("position", new BufferAttribute(sp, 3)); bin.push(sG);
  const sM = new PointsMaterial({ map: tex, size: 1.1, transparent: true, depthWrite: false, color: 0xffffff, opacity: 0.3 }); bin.push(sM);
  const steam = new Points(sG, sM); steam.position.copy(tub.position); steam.frustumCulled = false; scene.add(steam);

  let W = 1, H = 1, mob = false, top = 0, range = 1, raf = 0, ps = -1, tPrev = performance.now(), vis = true, stage = -1;
  const c1 = new Color(), c2 = new Color(), pos = new Vector3(), tgt = new Vector3();
  const mix = (arr: Color[], i: number, f: number, out: Color) => out.copy(arr[i]).lerp(arr[Math.min(3, i + 1)], f);
  const num = (arr: number[], i: number, f: number) => arr[i] + (arr[Math.min(3, i + 1)] - arr[i]) * f;
  const measure = () => {
    W = host.clientWidth; H = host.clientHeight; mob = W < 768;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.fov = mob ? 52 : 40;
    // desktop: push the garden to the right so the copy has the left third; mobile: push it down
    if (mob) cam.setViewOffset(W, H, 0, -H * 0.2, W, H); else cam.setViewOffset(W, H, -W * 0.17, -H * 0.04, W, H);
    cam.updateProjectionMatrix();
    top = hero.getBoundingClientRect().top + scrollY; range = Math.max(1, hero.offsetHeight - innerHeight);
  };
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!vis) return;
    const dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now; const t = now / 1000;
    const target = Math.min(1, Math.max(0, (scrollY - top) / range));
    ps = ps < 0 || reduced ? target : ps + (target - ps) * (1 - Math.exp(-dt * 6));
    // four seasons with a hold on each and a blend between
    const s = Math.min(2.9999, ps * 3.6), i = Math.floor(s), fr = s - i, f = fr < 0.45 ? 0 : fr > 0.85 ? 1 : ((x) => x * x * (3 - 2 * x))((fr - 0.45) / 0.4);
    const st = Math.min(3, Math.round(i + f)); if (st !== stage) stage = st;
    mix(SKY_TOP, i, f, c1); mix(SKY_BOT, i, f, c2);
    (scene.fog as Fog).color.copy(c2); hemi.color.copy(c1).lerp(c2, 0.6); hemi.intensity = num(HEMI_I, i, f);
    onFrame({ stage: st, top: `#${c1.getHexString()}`, bottom: `#${c2.getHexString()}` });
    mix(GROUND, i, f, groundM.color); mix(HEDGE, i, f, hedgeM.color); mix(LEAF, i, f, leafM.color); mix(SUN, i, f, sun.color); sun.intensity = num(SUN_I, i, f);
    hemi.groundColor.copy(groundM.color).multiplyScalar(0.6);
    const bare = 1 - Math.min(1, Math.abs(i + f - 0) ) * 0.0; // canopies stay, only shrink a little in winter
    canopies.forEach((c, k) => c.scale.setScalar((1.2 + (k % 3) * 0.25) * (0.82 + 0.18 * Math.min(1, i + f)) * bare));
    const open = num(SLAT, i, f); slats.forEach((sl2) => (sl2.rotation.x = open));
    emberM.emissiveIntensity = num(GRILL, i, f) * (1.6 + Math.sin(t * 9) * 0.25); fire.intensity = num(GRILL, i, f) * 6;
    glassM.emissiveIntensity = num(SAUNA, i, f) * 0.7; glow.intensity = num(SAUNA, i, f) * 5;
    // water ripples
    const wp = wG.attributes.position.array as Float32Array;
    for (let k = 0; k < wp.length; k += 3) wp[k + 2] = Math.sin(wBase[k] * 5 + t * 2.4) * 0.018 + Math.cos(wBase[k + 1] * 6 - t * 2) * 0.018;
    wG.attributes.position.needsUpdate = true;
    // falling things
    mix(FLAKE, i, f, fM.color); fM.opacity = num(FLAKE_O, i, f); fM.size = mob ? 0.22 : 0.16;
    const v = num(FLAKE_V, i, f);
    if (!reduced) { for (let k = 0; k < N; k++) { const j = k * 3; fp[j + 1] -= dt * v * (0.6 + fs[k]); fp[j] += Math.sin(t * 0.8 + fs[k] * 30) * dt * 0.35; if (fp[j + 1] < 0) fp[j + 1] = 9; } fG.attributes.position.needsUpdate = true; }
    sM.opacity = num(STEAM, i, f) * 0.55;
    for (let k = 0; k < M; k++) { const life = (sl[k] + t * 0.12) % 1, j = k * 3; sp[j] = Math.sin(k * 12.9) * 0.8 + Math.sin(t * 0.5 + k) * 0.25 * life; sp[j + 1] = 0.95 + life * 2.6; sp[j + 2] = Math.cos(k * 7.3) * 0.8 + life * 0.3; }
    sG.attributes.position.needsUpdate = true;
    // camera
    const a = CAM[i], b = CAM[Math.min(3, i + 1)];
    pos.copy(a[0]).lerp(b[0], f); tgt.copy(a[1]).lerp(b[1], f);
    if (mob) { pos.sub(tgt).multiplyScalar(1.55).add(tgt); pos.y += 1.2; }
    pos.x += Math.sin(t * 0.25) * 0.25; pos.y += Math.sin(t * 0.33) * 0.08;
    cam.position.copy(pos); cam.lookAt(tgt);
    renderer.render(scene, cam);
  };
  const ro = new ResizeObserver(measure); ro.observe(host);
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; tPrev = performance.now(); }); io.observe(host);
  addEventListener("resize", measure); measure(); raf = requestAnimationFrame(frame);
  return { destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("resize", measure); bin.forEach((d) => d.dispose()); renderer.dispose(); } };
}
