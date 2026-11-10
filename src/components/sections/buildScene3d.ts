import * as THREE from "three";

THREE.ColorManagement.enabled = false;
const C = { bg: "#181818", card: "#272727", paper: "#f2f2ee", smoke: "#9a9a93", kiwi: "#89e900", night: "#222222" };
const DISP = '"Lexend Giga Variable", "Arial Black", sans-serif', SANS = '"Geist Variable", system-ui, sans-serif';
type Ctx = CanvasRenderingContext2D;
type Block = { id: string; x: number; y: number; w: number; h: number; z: number; grey: string; draw: (g: Ctx, w: number, h: number) => void };
const rr = (g: Ctx, x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const fit = (g: Ctx, text: string, font: (px: number) => string, maxW: number, px: number) => { g.font = font(px); const m = g.measureText(text).width; if (m > maxW) g.font = font((px * maxW) / m); };
const photo = (g: Ctx, w: number, h: number) => {
  const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, "#101010"); sky.addColorStop(1, "#2f3a14"); g.fillStyle = sky; g.fillRect(0, 0, w, h);
  g.fillStyle = C.kiwi; g.beginPath(); g.arc(w * 0.68, h * 0.4, Math.min(w, h) * 0.26, 0, 7); g.fill();
  g.fillStyle = "#1c1c1c"; g.beginPath(); g.moveTo(0, h); g.lineTo(0, h * 0.62); g.lineTo(w * 0.22, h * 0.42); g.lineTo(w * 0.45, h * 0.7); g.lineTo(w * 0.62, h * 0.52); g.lineTo(w, h * 0.8); g.lineTo(w, h); g.fill();
  g.fillStyle = "#0e0e0e"; g.beginPath(); g.moveTo(0, h); g.lineTo(0, h * 0.84); g.lineTo(w * 0.3, h * 0.7); g.lineTo(w * 0.7, h * 0.9); g.lineTo(w, h * 0.74); g.lineTo(w, h); g.fill();
  g.strokeStyle = "rgba(242,242,238,.14)"; g.lineWidth = 1; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo((w * i) / 6, 0); g.lineTo((w * i) / 6, h); g.stroke(); }
};
const head = (a: string, b: string) => (g: Ctx, w: number, h: number) => {
  g.fillStyle = C.bg; g.fillRect(0, 0, w, h); g.textBaseline = "alphabetic";
  const f = (px: number) => `650 ${px}px ${DISP}`; fit(g, a.length > b.length ? a : b, f, w * 0.98, h * 0.52); const px = parseFloat(g.font.split("px")[0].split(" ").pop()!);
  g.font = f(px); g.fillStyle = C.paper; g.fillText(a, 0, h * 0.46); g.fillStyle = C.kiwi; g.fillText(b, 0, h * 0.95);
};
const lines = (g: Ctx, w: number, h: number) => { g.fillStyle = C.bg; g.fillRect(0, 0, w, h); g.fillStyle = C.smoke; g.textBaseline = "top"; const px = h * 0.3; g.font = `400 ${px}px ${SANS}`; g.fillText("Egyedi weboldal, ami ügyfelet hoz.", 0, h * 0.08); g.fillText("Telefonon is villámgyors.", 0, h * 0.54); };
const cta = (g: Ctx, w: number, h: number) => { g.fillStyle = C.kiwi; g.fillRect(0, 0, w, h); g.fillStyle = C.night; g.textBaseline = "middle"; g.textAlign = "center"; g.font = `600 ${h * 0.36}px ${SANS}`; g.fillText("Ajánlatot kérek  →", w / 2, h * 0.53); g.textAlign = "left"; };
const card = (n: string, t: string) => (g: Ctx, w: number, h: number) => {
  g.fillStyle = C.card; g.fillRect(0, 0, w, h); g.textBaseline = "top"; g.fillStyle = C.kiwi; g.font = `500 ${h * 0.13}px ui-monospace, monospace`; g.fillText(n, h * 0.14, h * 0.14);
  g.fillStyle = C.paper; fit(g, t, (px) => `650 ${px}px ${DISP}`, w - h * 0.28, h * 0.3); g.textBaseline = "alphabetic"; g.fillText(t, h * 0.14, h * 0.86);
};
const DESK: { W: number; H: number; blocks: Block[] } = {
  W: 16, H: 10, blocks: [
    { id: "bg", x: 0, y: 0, w: 16, h: 10, z: 0, grey: "#1c1c1c", draw: (g, w, h) => { g.fillStyle = C.bg; g.fillRect(0, 0, w, h); } },
    { id: "chrome", x: 0, y: 0, w: 16, h: 0.7, z: 1, grey: "#333", draw: (g, w, h) => { g.fillStyle = "#2c2c2c"; g.fillRect(0, 0, w, h); ["#555", "#555", C.kiwi].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(h * (0.6 + i * 0.55), h / 2, h * 0.16, 0, 7); g.fill(); }); g.fillStyle = "#1a1a1a"; rr(g, w * 0.3, h * 0.2, w * 0.4, h * 0.6, h * 0.3); g.fill(); g.fillStyle = C.smoke; g.font = `400 ${h * 0.34}px ${SANS}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ateceged.hu", w / 2, h * 0.53); g.textAlign = "left"; } },
    { id: "nav", x: 0, y: 0.7, w: 16, h: 1, z: 1, grey: "#2e2e2e", draw: (g, w, h) => { g.fillStyle = C.bg; g.fillRect(0, 0, w, h); g.fillStyle = C.paper; g.textBaseline = "middle"; g.font = `650 ${h * 0.34}px ${DISP}`; g.fillText("A TE CÉGED", w * 0.05, h * 0.54); g.font = `400 ${h * 0.26}px ${SANS}`; g.fillStyle = C.smoke; ["Szolgáltatások", "Munkák", "Kapcsolat"].forEach((t, i) => g.fillText(t, w * (0.5 + i * 0.115), h * 0.53)); g.fillStyle = C.kiwi; rr(g, w * 0.86, h * 0.24, w * 0.09, h * 0.52, h * 0.26); g.fill(); } },
    { id: "img", x: 9, y: 2.2, w: 6.2, h: 5.2, z: 2, grey: "#4a4a4a", draw: photo },
    { id: "c1", x: 0.8, y: 8, w: 4.53, h: 1.6, z: 2, grey: "#3a3a3a", draw: card("01", "TERVEZÉS") },
    { id: "c2", x: 5.73, y: 8, w: 4.53, h: 1.6, z: 2, grey: "#3a3a3a", draw: card("02", "FEJLESZTÉS") },
    { id: "c3", x: 10.66, y: 8, w: 4.53, h: 1.6, z: 2, grey: "#3a3a3a", draw: card("03", "ÉLESÍTÉS") },
    { id: "h1", x: 0.8, y: 2.3, w: 7.4, h: 2.6, z: 3, grey: "#5a5a5a", draw: head("A TE CÉGED,", "ONLINE.") },
    { id: "txt", x: 0.8, y: 5.15, w: 6.4, h: 0.95, z: 3, grey: "#444", draw: lines },
    { id: "cta", x: 0.8, y: 6.4, w: 3.7, h: 0.95, z: 4, grey: "#777", draw: cta },
  ],
};
const PHONE: typeof DESK = {
  W: 9, H: 17, blocks: [
    { id: "bg", x: 0, y: 0, w: 9, h: 17, z: 0, grey: "#1c1c1c", draw: (g, w, h) => { g.fillStyle = C.bg; g.fillRect(0, 0, w, h); } },
    { id: "nav", x: 0, y: 0, w: 9, h: 1.4, z: 1, grey: "#2e2e2e", draw: (g, w, h) => { g.fillStyle = "#202020"; g.fillRect(0, 0, w, h); g.fillStyle = C.paper; g.textBaseline = "middle"; g.font = `650 ${h * 0.3}px ${DISP}`; g.fillText("A TE CÉGED", w * 0.08, h * 0.55); g.fillStyle = C.kiwi; g.beginPath(); g.arc(w * 0.88, h / 2, h * 0.26, 0, 7); g.fill(); } },
    { id: "img", x: 0.7, y: 7.1, w: 7.6, h: 4.5, z: 2, grey: "#4a4a4a", draw: photo },
    { id: "c1", x: 0.7, y: 13.9, w: 3.65, h: 2.4, z: 2, grey: "#3a3a3a", draw: card("01", "TERVEZÉS") },
    { id: "c2", x: 4.65, y: 13.9, w: 3.65, h: 2.4, z: 2, grey: "#3a3a3a", draw: card("02", "ÉLESÍTÉS") },
    { id: "h1", x: 0.7, y: 2.1, w: 7.6, h: 3.1, z: 3, grey: "#5a5a5a", draw: head("A TE CÉGED,", "ONLINE.") },
    { id: "txt", x: 0.7, y: 5.5, w: 7.6, h: 1.2, z: 3, grey: "#444", draw: lines },
    { id: "cta", x: 0.7, y: 12.05, w: 7.6, h: 1.35, z: 4, grey: "#777", draw: cta },
  ],
};

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`;
const FS = `uniform sampler2D map; uniform vec3 grey; uniform float fill, tex, flatK; varying vec2 vUv;
void main(){ vec3 kiwi = vec3(.537,.914,0.); float d = vUv.x*.75 + (1.-vUv.y)*.25; float e = tex*1.32 - .16; float r = smoothstep(e, e-.1, d);
  vec3 t = mix(texture2D(map, vUv).rgb, kiwi, flatK); vec3 c = mix(grey, t, r);
  float ln = smoothstep(.035, 0., abs(d-e)) * step(.002, tex) * step(tex, .998); c = mix(c, kiwi, ln);
  gl_FragColor = vec4(c, fill); }`;
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (seed: number) => () => { let t = (seed += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export function mount({ host, sec, canvas, flood, bar }: { host: HTMLElement; sec: HTMLElement; canvas: HTMLCanvasElement; flood: HTMLElement; bar: HTMLElement }) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { return null; }
  const gl = renderer.getContext(), dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 0.1, 400); cam.position.z = 40;
  const phone = innerWidth < 768, L = phone ? PHONE : DESK, group = new THREE.Group(); scene.add(group);
  const kiwi = new THREE.Color(C.kiwi), R = rnd(7), PX = soft ? 48 : phone ? 72 : 88;
  type Item = { b: Block; pivot: THREE.Group; mat: THREE.ShaderMaterial; edge: THREE.LineBasicMaterial; home: THREE.Vector3; sc: THREE.Vector3; q: THREE.Quaternion; ph: number; i: number };
  const items: Item[] = [], ID = new THREE.Quaternion(), disposables: { dispose(): void }[] = [];
  const paint = (it: Item) => { const b = it.b, c = document.createElement("canvas"); c.width = Math.round(b.w * PX); c.height = Math.round(b.h * PX); b.draw(c.getContext("2d")!, c.width, c.height); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; (it.mat.uniforms.map.value as THREE.Texture | null)?.dispose(); it.mat.uniforms.map.value = t; };
  L.blocks.forEach((b, i) => {
    const geo = new THREE.BoxGeometry(b.w, b.h, 0.16), mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthTest: false, uniforms: { map: { value: null }, grey: { value: new THREE.Color(b.grey) }, fill: { value: 0 }, tex: { value: 0 }, flatK: { value: 0 } } });
    const mesh = new THREE.Mesh(geo, mat); mesh.renderOrder = b.z * 2;
    const edge = new THREE.LineBasicMaterial({ color: kiwi, transparent: true, opacity: 0, depthTest: false }), ln = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge); ln.renderOrder = b.z * 2 + 1;
    const pivot = new THREE.Group(); pivot.add(mesh, ln); group.add(pivot); disposables.push(geo, mat, edge, ln.geometry);
    const home = new THREE.Vector3(b.x + b.w / 2 - L.W / 2, L.H / 2 - (b.y + b.h / 2), 0), a = R() * 6.283, rad = (0.55 + R() * 0.75) * Math.max(L.W, L.H) * (b.id === "bg" ? 0.1 : 0.62);
    const sc = new THREE.Vector3(Math.cos(a) * rad * (phone ? 0.75 : 1), Math.sin(a) * rad * (phone ? 0.42 : 0.62), (R() - 0.5) * 12);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler((R() - 0.5) * 2.4, (R() - 0.5) * 2.4, (R() - 0.5) * 1.6));
    const it = { b, pivot, mat, edge, home, sc, q, ph: R() * 6.283, i }; items.push(it); paint(it);
  });
  Promise.all([document.fonts.load(`650 40px ${DISP}`), document.fonts.load(`400 20px ${SANS}`), document.fonts.load(`600 20px ${SANS}`)]).then(() => { items.forEach(paint); dirty = true; });
  const grid = new THREE.GridHelper(160, 32, kiwi, kiwi); const gm = grid.material as THREE.LineBasicMaterial; gm.transparent = true; gm.opacity = 0; gm.depthTest = false; grid.renderOrder = -5; scene.add(grid); disposables.push(grid.geometry, gm);
  scene.fog = new THREE.Fog(0x222222, 38, 95);
  // Cursor that clicks the button once the page is live.
  const cc = document.createElement("canvas"); cc.width = cc.height = 96; const cg = cc.getContext("2d")!; cg.fillStyle = "#fff"; cg.strokeStyle = "#111"; cg.lineWidth = 5; cg.lineJoin = "round"; cg.beginPath(); cg.moveTo(14, 8); cg.lineTo(14, 74); cg.lineTo(32, 58); cg.lineTo(46, 88); cg.lineTo(58, 82); cg.lineTo(44, 54); cg.lineTo(68, 54); cg.closePath(); cg.stroke(); cg.fill();
  const curMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cc), transparent: true, opacity: 0, depthTest: false }), cur = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), curMat); cur.renderOrder = 30; group.add(cur);
  const ctaI = items.find((x) => x.b.id === "cta")!, n = items.length;

  let W = 0, H = 0, vw = 1, vh = 1, dirty = true, raf = 0, vis = true, t0 = performance.now(), lastP = -1, born = 0, stage = "-1";
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const size = () => { W = host.clientWidth; H = host.clientHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, soft ? 1 : phone ? 2 : 1.75)); renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); vh = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z; vw = vh * cam.aspect; dirty = true; };
  size();
  const move = (e: PointerEvent) => { if (e.pointerType === "touch") return; ptr.tx = (e.clientX / innerWidth - 0.5) * 2; ptr.ty = (e.clientY / innerHeight - 0.5) * 2; };
  addEventListener("pointermove", move, { passive: true });
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }); io.observe(host);
  const ro = new ResizeObserver(size); ro.observe(host);

  const frame = (now: number) => {
    raf = 0; if (!vis) return; raf = requestAnimationFrame(frame);
    const r = sec.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - H)));
    ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
    const pm = Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 0.002; born = soft ? 1 : Math.min(1, born + 0.02);
    if (soft && p === lastP && !pm && !dirty && born >= 1) return; lastP = p; dirty = false;
    const t = soft ? 0 : (now - t0) / 1000;
    const M = sm(0.05, 0.3, p), A = sm(0.08, 0.34, p), F = sm(0.34, 0.5, p), T = sm(0.52, 0.72, p), D = sm(0.74, 0.86, p), E = sm(0.9, 1, p), Ez = Math.pow(E, 2.4);
    const s1 = phone ? Math.min((vw * 0.8) / L.W, (vh * 0.54) / L.H) : Math.min((vw * 0.54) / L.W, (vh * 0.66) / L.H), s0 = s1 * (phone ? 0.5 : 0.72);
    const sc = lerp(s0, s1, M) * (1 + D * (phone ? 0.1 : 0.22)) * (1 + Ez * 26);
    group.scale.setScalar(sc);
    const cx = lerp(phone ? 0 : vw * 0.2, phone ? 0 : vw * 0.1, M), cy = lerp(phone ? vh * 0.2 : vh * 0.03, phone ? vh * 0.13 : vh * (0.03 + 0.08 * D), M);
    const zk = sm(0, 0.55, E); group.position.set(lerp(cx, -ctaI.home.x * sc, zk), lerp(cy, -ctaI.home.y * sc, zk), 0);
    const iso = A * (1 - D);
    group.rotation.set(lerp(-0.18, -0.5, iso) * (1 - D) + ptr.y * 0.07 * (1 - E), lerp(0.5 + Math.sin(t * 0.25) * 0.25 * (1 - A), 0.62, A) * (1 - D) + ptr.x * 0.1 * (1 - E), lerp(0, 0.06, iso));
    const gap = lerp(lerp(1.5, 0.7, T), 0.03, D);
    for (const it of items) {
      const k = it.i / n, a = sm(k * 0.45, k * 0.45 + 0.55, A), ea = 1 - Math.pow(1 - a, 3), f = sm(k * 0.5, k * 0.5 + 0.5, F), tx = sm(k * 0.5, k * 0.5 + 0.5, T);
      const dr = (1 - ea) * 0.8; it.pivot.position.set(lerp(it.sc.x + Math.sin(t * 0.5 + it.ph) * dr, it.home.x, ea), lerp(it.sc.y + Math.cos(t * 0.4 + it.ph) * dr, it.home.y, ea), lerp(it.sc.z, it.b.z * gap, ea));
      it.pivot.quaternion.copy(it.q).slerp(ID, ea); if (ea < 1) it.pivot.rotateY(t * 0.15 * (1 - ea));
      it.mat.uniforms.fill.value = f; it.mat.uniforms.tex.value = tx; it.edge.opacity = born * lerp(lerp(it.b.id === "bg" ? 0.35 : 0.95, 0.5, f), 0, sm(0.3, 1, tx));
    }
    grid.position.set(0, -vh * (phone ? 0.3 : 0.4), ((t * 1.5) % 5)); gm.opacity = 0.22 * A * (1 - sm(0.8, 0.9, p)) * born;
    // click
    const cm = sm(0.78, 0.875, p), press = Math.exp(-Math.pow((p - 0.888) / 0.008, 2));
    cur.position.set(lerp(L.W * 0.3, ctaI.home.x + ctaI.b.w * 0.18, cm), lerp(-L.H * 0.42, ctaI.home.y - ctaI.b.h * 0.55, cm), 1); curMat.opacity = Math.min(sm(0.76, 0.8, p), 1 - sm(0.9, 0.93, p)); cur.scale.setScalar(1 - press * 0.15);
    ctaI.pivot.scale.setScalar(1 - press * 0.07); ctaI.mat.uniforms.flatK.value = sm(0.1, 0.7, E);
    renderer.render(scene, cam);
    flood.style.opacity = String(sm(0.72, 0.96, E));
    const st = p < 0.13 || p >= 0.915 ? "-1" : p < 0.34 ? "0" : p < 0.52 ? "1" : p < 0.74 ? "2" : "3";
    if (st !== stage) host.dataset.stage = stage = st;
    bar.style.transform = `scaleX(${sm(0.13, 0.9, p) * 0.999 + 0.001})`;
    if (r.top <= 40 && r.bottom > 40) { const want = E > 0.8 ? "kiwi" : "night", el = document.documentElement; if (el.dataset.nav !== want) el.dataset.nav = want; }
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener("pointermove", move); disposables.forEach((d) => d.dispose()); renderer.dispose(); };
}
