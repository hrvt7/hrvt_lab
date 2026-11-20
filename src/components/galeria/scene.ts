/**
 * HRVT Galéria: one curved white museum corridor, swept from a coved cross-section along a spline.
 * Scroll moves the camera along the rail; passing works pull the gaze a little toward them;
 * a click turns the camera square to the work and offsets the view so the side panel has room.
 */
import {
  BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, type CatmullRomCurve3, DoubleSide, Group, Matrix4, Mesh,
  MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Quaternion, Raycaster, Scene, ShaderMaterial, Shape,
  ShapeGeometry, SRGBColorSpace, type Texture, TextureLoader, Euler, Vector2, Vector3, WebGLRenderer,
} from "three";
import type { Work } from "./data";

import { ART_Y, EYE, HALF_W, HEIGHT, approachU, artU, makeCurve, railU, unit } from "./rail";
const UP = new Vector3(0, 1, 0);

export type Frame = { u: number; near: number; k: number; x: number; z: number; yaw: number };
export type Api = {
  setProgress: (p: number, immediate?: boolean) => void;
  setPointer: (x: number, y: number) => void;
  pick: (cx: number, cy: number) => number | null;
  focus: (i: number) => void;
  unfocus: (u?: number) => void;
  resize: () => void;
  destroy: () => void;
};
export type Theme = { serif: string; sans: string; accent: string };
type Opts = {
  canvas: HTMLCanvasElement; works: Work[]; theme?: Theme;
  onFrame: (f: Frame) => void; onHover: (i: number | null) => void;
  onFocused: (i: number) => void; onReleased: () => void;
};

const easeIO = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // zero speed and zero acceleration at both ends
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/* ---------- placeholder artworks, drawn in code ---------- */
function rnd(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
function artTexture(w: Work, idx: number) {
  const W = 900, H = Math.round((900 * w.h) / w.w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d")!; const [a, b, d, e] = w.palette; const r = rnd(idx * 977 + 13);
  g.fillStyle = a; g.fillRect(0, 0, W, H);
  if (w.style === 0) { // horizon: sky bands, sun, water
    const hz = H * (0.55 + r() * 0.1);
    const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, b); sky.addColorStop(1, a); g.fillStyle = sky; g.fillRect(0, 0, W, hz);
    g.fillStyle = e; g.beginPath(); g.arc(W * (0.3 + r() * 0.4), hz - H * 0.08, W * 0.11, 0, Math.PI * 2); g.fill();
    g.fillStyle = d; g.fillRect(0, hz, W, H - hz);
    g.globalAlpha = 0.35; g.fillStyle = a; for (let i = 0; i < 18; i++) g.fillRect(W * r(), hz + (H - hz) * r(), W * (0.05 + r() * 0.25), 3); g.globalAlpha = 1;
  } else if (w.style === 1) { // planes: rotated slabs
    for (let i = 0; i < 6; i++) {
      g.save(); g.translate(W * (0.2 + r() * 0.6), H * (0.2 + r() * 0.6)); g.rotate((r() - 0.5) * 0.9);
      g.fillStyle = [b, d, e, b][i % 4]; g.fillRect(-W * (0.08 + r() * 0.22), -H * (0.03 + r() * 0.12), W * (0.16 + r() * 0.4), H * (0.06 + r() * 0.2)); g.restore();
    }
    g.strokeStyle = d; g.lineWidth = 4; g.beginPath(); g.moveTo(W * 0.1, H * 0.86); g.lineTo(W * 0.9, H * 0.12); g.stroke();
    g.fillStyle = e; g.beginPath(); g.arc(W * 0.72, H * 0.72, W * 0.09, 0, Math.PI * 2); g.fill();
  } else if (w.style === 2) { // arcs: quarter-circle tiles
    const n = 3, cw = W / n, ch = H / Math.round((n * H) / W); const rows = Math.round(H / ch);
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) {
      const cols = [b, d, e]; g.fillStyle = cols[Math.floor(r() * 3)];
      const q = Math.floor(r() * 4), cx = x * cw + (q % 2) * cw, cy = y * ch + (q > 1 ? ch : 0);
      g.save(); g.beginPath(); g.rect(x * cw, y * ch, cw, ch); g.clip();
      g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, Math.min(cw, ch), 0, Math.PI * 2); g.fill();
      if (r() > 0.5) { g.fillStyle = a; g.beginPath(); g.arc(cx, cy, Math.min(cw, ch) * 0.45, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
  } else { // fields: stacked soft colour fields
    const f = [b, d, e];
    let y = H * 0.06;
    for (let i = 0; i < 3; i++) {
      const hh = H * (0.22 + r() * 0.1); g.fillStyle = f[i]; g.filter = "blur(2px)";
      g.fillRect(W * 0.08, y, W * 0.84, hh); y += hh + H * 0.04;
    }
    g.filter = "none";
  }
  // paper grain
  const img = g.getImageData(0, 0, W, H), px = img.data;
  for (let i = 0; i < px.length; i += 4) { const n = (Math.random() - 0.5) * 16; px[i] += n; px[i + 1] += n; px[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
}
function plaqueTexture(w: Work, th: Theme) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256;
  const g = c.getContext("2d")!;
  const draw = () => {
    g.fillStyle = "#f6f3ee"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#1a1814"; g.font = `400 50px ${th.serif}`; g.fillText(w.title, 30, 90);
    g.font = `500 30px ${th.sans}`; g.fillStyle = "#4a463f"; g.fillText(w.year ? `${w.artist}, ${w.year}` : w.artist, 30, 150);
    g.fillStyle = th.accent; g.fillRect(30, 190, 40, 6);
  };
  draw();
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  document.fonts?.ready.then(() => { draw(); t.needsUpdate = true; });
  return t;
}
function shadowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, "rgba(0,0,0,.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new CanvasTexture(c);
}

/* ---------- corridor geometry ---------- */
type P = [number, number, number]; // s (across, + = left), y, shade
function profile(): P[] {
  const pts: P[] = [], r1 = 0.35, r2 = 1.55;
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number, sh: (t: number) => number) => {
    for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, sh(k / n)]); }
  };
  arc(-(HALF_W - r1), r1, r1, -Math.PI / 2, -Math.PI, 6, (t) => 0.87 + 0.07 * t);
  arc(-(HALF_W - r2), HEIGHT - r2, r2, Math.PI, Math.PI / 2, 16, (t) => 0.985 - 0.03 * t);
  arc(HALF_W - r2, HEIGHT - r2, r2, Math.PI / 2, 0, 16, (t) => 0.955 + 0.03 * t);
  arc(HALF_W - r1, r1, r1, 0, -Math.PI / 2, 6, (t) => 0.94 - 0.07 * t);
  return pts;
}
function sweep(curve: CatmullRomCurve3, prof: P[], segs: number) {
  const n = prof.length, pos = new Float32Array((segs + 1) * n * 3), sh = new Float32Array((segs + 1) * n), across = new Float32Array((segs + 1) * n);
  const T = new Vector3(), L = new Vector3(), Pt = new Vector3();
  for (let i = 0; i <= segs; i++) {
    const u = i / segs; curve.getPointAt(u, Pt); curve.getTangentAt(u, T); T.y = 0; T.normalize(); L.crossVectors(UP, T).normalize();
    for (let j = 0; j < n; j++) {
      const [s, y, shade] = prof[j], k = i * n + j;
      pos[k * 3] = Pt.x + L.x * s; pos[k * 3 + 1] = y; pos[k * 3 + 2] = Pt.z + L.z * s; sh[k] = shade; across[k] = s / HALF_W;
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < segs; i++) for (let j = 0; j < n - 1; j++) { const a = i * n + j, b = a + n; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3)); geo.setAttribute("aShade", new BufferAttribute(sh, 1)); geo.setAttribute("aS", new BufferAttribute(across, 1));
  geo.setIndex(idx); return geo;
}

const GLSL_COMMON = /* glsl */ `
uniform vec3 uCam; uniform vec3 uGlow; uniform vec3 uArts[24]; uniform float uHov[24]; uniform vec3 uBase; uniform float uTime;
varying float vShade; varying float vS; varying vec3 vW;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`;
const VERT = /* glsl */ `
attribute float aShade; attribute float aS; varying float vShade; varying float vS; varying vec3 vW;
void main(){ vShade = aShade; vS = aS; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const WALL_FRAG = /* glsl */ `${GLSL_COMMON}
void main(){
  float pool = 0.0;
  for (int i = 0; i < 24; i++) { vec3 d = vW - uArts[i]; d.y *= 0.7; pool += (0.075 + 0.09 * uHov[i]) * exp(-dot(d, d) * 0.42); }
  vec3 dg = vW - uGlow; float glow = exp(-dot(dg, dg) * 0.11) * 0.06;
  float fade = mix(1.0, 0.84, smoothstep(5.0, 30.0, length(vW - uCam)));
  vec3 c = uBase * vShade * (0.92 + pool + glow) * fade;
  c += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.014;
  gl_FragColor = vec4(c, 1.0);
}`;
const FLOOR_FRAG = /* glsl */ `${GLSL_COMMON}
void main(){
  float pool = 0.0;
  for (int i = 0; i < 24; i++) { vec2 d = vW.xz - uArts[i].xz; pool += (0.05 + 0.06 * uHov[i]) * exp(-dot(d, d) * 0.5); }
  float edge = smoothstep(0.55, 1.0, abs(vS));
  float fade = mix(1.0, 0.82, smoothstep(4.0, 30.0, length(vW - uCam)));
  vec3 c = uBase * (0.95 + pool - edge * 0.06) * fade;
  c += (hash(gl_FragCoord.xy * 1.3 + fract(uTime)) - 0.5) * 0.012;
  gl_FragColor = vec4(c, 0.86 - edge * 0.08);
}`;

export function mount({ canvas, works, theme = { serif: "Gloock, Georgia, serif", sans: '"Schibsted Grotesk Variable", sans-serif', accent: "#2b3cff" }, onFrame, onHover, onFocused, onReleased }: Opts): Api {
  const mobile = matchMedia("(pointer: coarse)").matches || innerWidth < 760;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 2 : 2.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0xe4e0d8, 1);
  const scene = new Scene();
  const cam = new PerspectiveCamera(52, 1, 0.05, 140);
  const N = Math.min(24, works.length), K = unit(N);
  const curve = makeCurve(N);

  const arts = Array.from({ length: 24 }, () => new Vector3(0, -99, 0));
  const uniforms = {
    uCam: { value: new Vector3() }, uGlow: { value: new Vector3() }, uArts: { value: arts },
    uHov: { value: new Array(24).fill(0) as number[] }, uBase: { value: new Vector3(0.957, 0.948, 0.928) }, uTime: { value: 0 },
  };
  const wallM = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: WALL_FRAG, side: DoubleSide });
  const floorU = { ...uniforms, uBase: { value: new Vector3(0.93, 0.922, 0.9) } };
  const floorM = new ShaderMaterial({ uniforms: floorU, vertexShader: VERT, fragmentShader: FLOOR_FRAG, transparent: true, depthWrite: false, side: DoubleSide });

  const prof = profile();
  scene.add(new Mesh(sweep(curve, prof, Math.round((mobile ? 220 : 340) / K)), wallM));
  const floorProf: P[] = Array.from({ length: 13 }, (_, k) => [-(HALF_W - 0.35) + ((HALF_W - 0.35) * 2 * k) / 12, 0, 1]);
  const floor = new Mesh(sweep(curve, floorProf, Math.round((mobile ? 160 : 240) / K)), floorM); floor.renderOrder = 10; scene.add(floor);

  // end caps: the entrance behind the camera and the far wall
  const shape = new Shape(); prof.forEach(([s, y], k) => (k ? shape.lineTo(s, y) : shape.moveTo(s, y))); shape.closePath();
  for (const u of [0.0005, 0.9995]) {
    const g = new ShapeGeometry(shape, 24); const cnt = g.attributes.position.count;
    g.setAttribute("aShade", new BufferAttribute(new Float32Array(cnt).fill(u < 0.5 ? 0.9 : 0.97), 1));
    g.setAttribute("aS", new BufferAttribute(new Float32Array(cnt), 1));
    const m = new Mesh(g, wallM); const p = curve.getPointAt(u), t = curve.getTangentAt(u).setY(0).normalize(), l = new Vector3().crossVectors(UP, t).normalize();
    m.matrixAutoUpdate = false; m.matrix.makeBasis(l, UP, t).setPosition(p); scene.add(m);
  }

  /* artworks + their reflections */
  const artRoot = new Group(), mirror = new Group(); mirror.scale.y = -1; scene.add(artRoot, mirror);
  const shadowT = shadowTexture(), loader = new TextureLoader(), maxAniso = renderer.capabilities.getMaxAnisotropy();
  type ArtObj = { g: Group; m: Group; canvas: Mesh; mat: MeshBasicMaterial; lo: Texture | null; hi: Texture | null; busy: boolean; base: Vector3; normal: Vector3; center: Vector3; u: number; w: number; h: number };
  const objs: ArtObj[] = works.slice(0, N).map((w, i) => {
    const u = artU(i, N), P = curve.getPointAt(u), T = curve.getTangentAt(u).setY(0).normalize(), L = new Vector3().crossVectors(UP, T).normalize();
    const side = i % 2 === 0 ? 1 : -1;
    const base = P.clone().addScaledVector(L, side * (HALF_W - 0.02)).setY(ART_Y);
    const normal = L.clone().multiplyScalar(-side);
    const g = new Group(); g.position.copy(base); g.lookAt(base.clone().add(normal));
    const sh = new Mesh(new PlaneGeometry(w.w + 0.7, w.h + 0.7), new MeshBasicMaterial({ map: shadowT, transparent: true, opacity: 0.28, depthWrite: false, color: 0x000000 }));
    sh.position.set(0.04, -0.09, 0.004); g.add(sh);
    const frame = new Mesh(new BoxGeometry(w.w + 0.09, w.h + 0.09, 0.05), new MeshBasicMaterial({ color: 0x1f1c18, side: DoubleSide })); frame.position.z = 0.03; g.add(frame);
    const mat = w.img ? new MeshBasicMaterial({ color: 0xd8d4cc, side: DoubleSide }) : new MeshBasicMaterial({ map: artTexture(w, i), side: DoubleSide });
    const cv = new Mesh(new PlaneGeometry(w.w, w.h), mat); cv.position.z = 0.058; cv.userData.idx = i; g.add(cv);
    const pl = new Mesh(new PlaneGeometry(0.36, 0.18), new MeshBasicMaterial({ map: plaqueTexture(w, theme), side: DoubleSide }));
    pl.position.set(w.w / 2 + 0.34, -w.h / 2 + 0.09, 0.006); g.add(pl);
    const fit = (t: { image: unknown }) => {
      const img = t.image as { width: number; height: number }; const nw = (w.h * img.width) / img.height;
      cv.scale.x = nw / w.w; frame.scale.x = (nw + 0.09) / (w.w + 0.09); sh.scale.x = (nw + 0.7) / (w.w + 0.7); pl.position.x = nw / 2 + 0.34;
      const o = objs[i]; if (o) o.w = nw;
    };
    const first = w.imgT ?? w.img;
    if (first) loader.load(first, (t) => {
      t.colorSpace = SRGBColorSpace; t.anisotropy = maxAniso; fit(t);
      const o = objs[i]; if (o) { o.lo = t; if (!w.imgT) o.hi = t; if (!o.hi) { mat.map = t; mat.color.set(0xffffff); mat.needsUpdate = true; } }
      if (!w.imgT) { mat.map = t; mat.color.set(0xffffff); mat.needsUpdate = true; }
    });
    artRoot.add(g);
    const m = g.clone(); mirror.add(m);
    arts[i].copy(base);
    return { g, m, canvas: cv, mat, base, normal, center: base.clone().addScaledVector(normal, 0.06), u, w: w.w, h: w.h, lo: null, hi: null, busy: false };
  });

  /* camera state */
  let uTarget = railU(0), u = uTarget, uMid = uTarget; const qS = new Quaternion(); let qInit = false;
  const ptr = new Vector2(), ptrS = new Vector2();
  let hover: number | null = null; const hov = new Array(N).fill(0);
  let mode: "rail" | "to" | "focus" | "back" = "rail", focusI = -1, t0 = 0, dur = 1.35;
  const fromPos = new Vector3(), fromQ = new Quaternion(), toPos = new Vector3(), toQ = new Quaternion(), ctrl = new Vector3();
  let offK = 0, offFrom = 0, offTo = 0;
  const mtx = new Matrix4(), q = new Quaternion(), sway = new Quaternion(), eul = new Euler();
  const pos = new Vector3(), look = new Vector3(), tmp = new Vector3(), tmp2 = new Vector3();
  let near = -1, nearK = 0;

  function railPose(uu: number, outPos: Vector3, outQ: Quaternion) {
    curve.getPointAt(uu, outPos); outPos.y = EYE;
    curve.getPointAt(Math.min(1, uu + 0.03 * K), look); look.y = 1.55;
    near = -1; nearK = 0; tmp.set(0, 0, 0);
    // every work pulls the gaze with a smooth bell-shaped weight, so the pulls blend instead of switching
    for (let i = 0; i < N; i++) {
      const t = (objs[i].u - uu - 0.045 * K) / (0.065 * K); if (Math.abs(t) >= 1) continue;
      const k = 0.5 + 0.5 * Math.cos(Math.PI * t); if (k > nearK) { nearK = k; near = i; }
      tmp.addScaledVector(tmp2.copy(objs[i].center).sub(look), k * (mobile ? 0.5 : 0.3));
    }
    look.add(tmp);
    mtx.lookAt(outPos, look, UP); outQ.setFromRotationMatrix(mtx);
  }
  function focusPose(i: number, outPos: Vector3, outQ: Quaternion) {
    const o = objs[i], wide = !mobile && innerWidth >= 900, asp = innerWidth / innerHeight, tn = Math.tan((cam.fov * Math.PI) / 360) * 2;
    const fh = wide ? 0.66 : 0.32, fw = wide ? 0.48 : 0.66;
    const D = Math.min(HALF_W * 1.32, Math.max(o.h / (fh * tn), (o.w + 0.2) / (fw * asp * tn)));
    outPos.copy(o.center).addScaledVector(o.normal, D);
    mtx.lookAt(outPos, o.center, UP); outQ.setFromRotationMatrix(mtx);
  }
  function applyOffset(k: number) {
    const W = innerWidth, H = innerHeight;
    if (k < 0.001) { cam.clearViewOffset(); return; }
    const wide = !mobile && W >= 900;
    cam.setViewOffset(W, H, wide ? W * 0.2 * k : 0, wide ? 0 : H * 0.25 * k, W, H);
  }
  function start(next: typeof mode, i: number) {
    fromPos.copy(cam.position); fromQ.copy(cam.quaternion);
    if (next === "to") focusPose(i, toPos, toQ); else railPose(u, toPos, toQ);
    ctrl.copy(fromPos).lerp(toPos, 0.5); ctrl.y += 0.12;
    // keep the arc inside the corridor: pull the control point toward the centre line
    curve.getPointAt(clamp(next === "to" ? objs[i].u : u), tmp); ctrl.x = (ctrl.x + tmp.x) / 2; ctrl.z = (ctrl.z + tmp.z) / 2;
    offFrom = offK; offTo = next === "to" ? 1 : 0; dur = reduced ? 0.01 : next === "to" ? 2.1 : 1.7;
    t0 = performance.now(); mode = next; focusI = i;
  }

  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.fov = w / h < 0.8 ? 70 : w / h < 1.2 ? 60 : 52; cam.updateProjectionMatrix(); applyOffset(offK);
  }
  resize(); addEventListener("resize", resize);

  railPose(u, cam.position, cam.quaternion);
  const ray = new Raycaster(), ndc = new Vector2();
  let raf = 0, last = performance.now(), dead = false, lastStream = 0;
  /** Full-resolution textures only live near the camera; far ones fall back to their small version. */
  function stream() {
    for (let i = 0; i < N; i++) {
      const o = objs[i], w = works[i]; if (!w.imgT || !w.img) continue;
      const d = Math.abs(o.u - u) / K, want = d < 0.17 || (focusI >= 0 && Math.abs(i - focusI) <= 1);
      if (want && !o.hi && !o.busy) {
        o.busy = true;
        loader.load(mobile && w.imgM ? w.imgM : w.img, (t) => {
          o.busy = false; if (dead) { t.dispose(); return; }
          t.colorSpace = SRGBColorSpace; t.anisotropy = maxAniso; o.hi = t; o.mat.map = t; o.mat.color.set(0xffffff); o.mat.needsUpdate = true;
        }, undefined, () => { o.busy = false; });
      } else if (!want && o.hi && d > 0.3 && o.lo) { o.mat.map = o.lo; o.mat.needsUpdate = true; o.hi.dispose(); o.hi = null; }
    }
  }
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (now - lastStream > 400) { lastStream = now; stream(); }
    ptrS.lerp(ptr, 1 - Math.exp(-dt * 2.2));
    if (mode === "rail") {
      if (reduced) { uMid = u = uTarget; } else { uMid += (uTarget - uMid) * (1 - Math.exp(-dt * 3.4)); u += (uMid - u) * (1 - Math.exp(-dt * 3.4)); }
      railPose(u, pos, q);
      if (!qInit || reduced) { qS.copy(q); qInit = true; } else qS.slerp(q, 1 - Math.exp(-dt * 3.2));
      q.copy(qS);
      if (!reduced) { eul.set(ptrS.y * 0.035, -ptrS.x * 0.07, 0, "YXZ"); sway.setFromEuler(eul); q.multiply(sway); }
      cam.position.copy(pos); cam.quaternion.copy(q);
    } else if (mode === "to" || mode === "back") {
      const t = clamp((now - t0) / (dur * 1000)), e = easeIO(t);
      if (mode === "back") { railPose(u, toPos, toQ); qS.copy(toQ); }
      const a = 1 - e; cam.position.set(0, 0, 0).addScaledVector(fromPos, a * a).addScaledVector(ctrl, 2 * a * e).addScaledVector(toPos, e * e);
      cam.quaternion.slerpQuaternions(fromQ, toQ, e);
      offK = offFrom + (offTo - offFrom) * e; applyOffset(offK);
      if (t >= 1) { if (mode === "to") { mode = "focus"; onFocused(focusI); } else { mode = "rail"; focusI = -1; onReleased(); } }
    } else if (mode === "focus" && !reduced) {
      focusPose(focusI, pos, q); eul.set(ptrS.y * 0.012, -ptrS.x * 0.02, 0, "YXZ"); sway.setFromEuler(eul); q.multiply(sway);
      cam.position.lerp(pos, 1 - Math.exp(-dt * 3)); cam.quaternion.slerp(q, 1 - Math.exp(-dt * 3));
    }
    // hover lift + light pools
    for (let i = 0; i < N; i++) {
      const target = (hover === i && mode === "rail") || focusI === i ? 1 : 0;
      hov[i] += (target - hov[i]) * (1 - Math.exp(-dt * 4)); uniforms.uHov.value[i] = hov[i];
      const o = objs[i]; tmp2.copy(o.base).addScaledVector(o.normal, hov[i] * 0.07); o.g.position.copy(tmp2); o.m.position.copy(tmp2);
      const s = 1 + hov[i] * 0.025; o.g.scale.setScalar(s); o.m.scale.setScalar(s);
    }
    uniforms.uCam.value.copy(cam.position);
    tmp.set(0, 0, -1).applyQuaternion(cam.quaternion);
    uniforms.uGlow.value.copy(cam.position).addScaledVector(tmp, 3.2).add(tmp2.set(ptrS.x * 1.6, ptrS.y * 0.7, 0).applyQuaternion(cam.quaternion));
    uniforms.uTime.value = now / 1000;
    renderer.render(scene, cam);
    const yaw = Math.atan2(-tmp.x, -tmp.z);
    onFrame({ u, near: mode === "rail" ? near : focusI, k: mode === "rail" ? nearK : 1, x: cam.position.x, z: cam.position.z, yaw });
  };
  raf = requestAnimationFrame(loop);

  return {
    setProgress(p, immediate) { uTarget = railU(clamp(p)); if (immediate) { u = uMid = uTarget; qInit = false; } },
    setPointer(x, y) { ptr.set(x, y); },
    pick(cx, cy) {
      if (mode !== "rail") return null;
      ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
      const hit = ray.intersectObjects(objs.map((o) => o.canvas), false)[0];
      const i = hit && hit.distance < 22 ? (hit.object.userData.idx as number) : null;
      if (i !== hover) { hover = i; onHover(i); }
      return i;
    },
    focus(i) { if (i < 0 || i >= N) return; if (mode === "focus" || mode === "to") { u = uMid = approachU(i, N); uTarget = u; } start("to", i); },
    unfocus(uu) { if (uu !== undefined) { u = uMid = uu; uTarget = uu; } start("back", focusI); },
    resize,
    destroy() {
      dead = true; cancelAnimationFrame(raf); removeEventListener("resize", resize);
      scene.traverse((o) => { const m = o as Mesh; m.geometry?.dispose(); const mat = m.material as MeshBasicMaterial | undefined; mat?.map?.dispose(); mat?.dispose?.(); });
      renderer.dispose(); void dead;
    },
  };
}
