/**
 * HRVT TRADING hero: one instanced field of bars that re-forms four times as you scroll.
 *   0  price terrain   every row is an instrument, every bar a candle
 *   1  depth canyon    the order book as two walls you fly between
 *   2  the planet      sessions around the clock
 *   3  the mark        the bars assemble the HRVT wordmark
 * All four layouts live in instance attributes; the vertex shader blends between them, so the whole
 * scene is a single draw call.
 */
import { BoxGeometry, Color, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, PerspectiveCamera, Scene, ShaderMaterial, Vector3, WebGLRenderer } from "three";
import { WORDMARK } from "@/lib/logo";

export type Api = { destroy: () => void };
type Opts = { canvas: HTMLCanvasElement; hero: HTMLElement; host: HTMLElement; onStage: (s: number, p: number) => void };

const VERT = /* glsl */ `
attribute vec3 aP0, aP1, aP2, aP3, aS0, aS1, aS2, aS3; attribute vec4 aK; attribute float aR;
uniform float uStage, uTime;
varying vec3 vN, vW; varying float vSide, vH, vR;
void main(){
  float i = floor(uStage), f = uStage - i;
  // every bar leaves a little later than its neighbour, so a morph reads as a wave, not a cut
  float g = smoothstep(aR * 0.45, aR * 0.45 + 0.55, f), s = i + g;
  float w0 = max(0.0, 1.0 - abs(s - 0.0)), w1 = max(0.0, 1.0 - abs(s - 1.0)), w2 = max(0.0, 1.0 - abs(s - 2.0)), w3 = max(0.0, 1.0 - abs(s - 3.0));
  vec3 P = aP0 * w0 + aP1 * w1 + aP2 * w2 + aP3 * w3;
  vec3 S = aS0 * w0 + aS1 * w1 + aS2 * w2 + aS3 * w3;
  vSide = aK.x * w0 + aK.y * w1 + aK.z * w2 + aK.w * w3;
  // life in each state
  S.y *= 1.0 + w0 * 0.35 * sin(uTime * 1.3 + aP0.x * 0.55 + aP0.z * 0.35) + w1 * 0.22 * sin(uTime * 2.1 + aP1.z * 0.8 + aR * 6.0);
  P.y += w0 * 0.5 * sin(uTime * 0.6 + aP0.x * 0.25 + aP0.z * 0.2);
  P.z += w1 * mod(uTime * 1.6, 0.5);
  float a = uTime * 0.12 * w2; float ca = cos(a), sa = sin(a);
  vec3 c2 = vec3(0.0, 7.0, 0.0); vec3 d = P - c2; P = mix(P, c2 + vec3(d.x * ca - d.z * sa, d.y, d.x * sa + d.z * ca), w2);
  P.y += sin(g * 3.14159) * (1.5 + aR * 3.5);          // arc through the air while travelling
  float spin = (1.0 - abs(g * 2.0 - 1.0)) * (aR - 0.5) * 5.0;
  vec3 p = position * S; float cs = cos(spin), sn = sin(spin); p.xz = mat2(cs, -sn, sn, cs) * p.xz;
  vec3 n = normal; n.xz = mat2(cs, -sn, sn, cs) * n.xz;
  vec4 w = modelMatrix * vec4(P + p, 1.0);
  vN = n; vW = w.xyz; vH = position.y; vR = aR;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uBid, uAsk, uBone, uBg, uCam; uniform float uTime;
varying vec3 vN, vW; varying float vSide, vH, vR;
void main(){
  vec3 n = normalize(vN);
  vec3 base = mix(uBone * 0.34, uBid, clamp(vSide, 0.0, 1.0)); base = mix(base, uAsk, clamp(-vSide, 0.0, 1.0)); base = mix(base, uBone, clamp(vSide - 1.0, 0.0, 1.0));
  float l = 0.38 + 0.62 * max(dot(n, normalize(vec3(0.35, 0.9, 0.4))), 0.0);
  float top = smoothstep(0.75, 1.0, vH);                         // lit caps
  float rim = pow(1.0 - max(dot(n, normalize(uCam - vW)), 0.0), 2.5);
  vec3 col = base * l * (0.55 + 0.45 * vH) + base * top * 0.9 + rim * base * 0.6;
  col += base * 0.5 * smoothstep(0.96, 1.0, sin(uTime * 1.7 + vR * 40.0)); // random ticks flashing
  float bright = clamp(vSide - 1.0, 0.0, 1.0); col = mix(col, uBone * (0.5 + 0.5 * l), bright * 0.9);
  float fog = smoothstep(24.0, 60.0, distance(uCam, vW));
  gl_FragColor = vec4(mix(col, uBg, fog), 1.0);
}`;

function logoPoints(n: number, width: number) {
  const [vx, vy, vw, vh] = WORDMARK.viewBox.split(" ").map(Number);
  const cw = 420, ch = Math.round((cw * vh) / vw), c = document.createElement("canvas"); c.width = cw; c.height = ch;
  const g = c.getContext("2d")!; const k = cw / vw; g.setTransform(k, 0, 0, k, -vx * k, -vy * k); g.fill(new Path2D(WORDMARK.d));
  const d = g.getImageData(0, 0, cw, ch).data, pts: [number, number][] = [];
  for (let step = 6; step >= 2 && pts.length < n * 0.5; step--) { pts.length = 0; for (let y = 0; y < ch; y += step) for (let x = 0; x < cw; x += step) if (d[(y * cw + x) * 4 + 3] > 128) pts.push([x, y]); }
  const s = width / cw; return { pts: pts.map(([x, y]) => [(x - cw / 2) * s, (ch / 2 - y) * s] as [number, number]), cell: s * 2.6 };
}

export function mount({ canvas, hero, host, onStage }: Opts): Api {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mob0 = innerWidth < 768;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  const BG = new Color(0x06070a); renderer.setClearColor(BG, 1);
  const scene = new Scene(), cam = new PerspectiveCamera(42, 1, 0.1, 120);
  const COLS = mob0 ? 60 : 84, ROWS = mob0 ? 40 : 50, N = COLS * ROWS;
  const A = (k: number) => new Float32Array(N * k);
  const P = [A(3), A(3), A(3), A(3)], S = [A(3), A(3), A(3), A(3)], K = A(4), R = A(1);
  const rnd = (s: number) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };
  const put = (arr: Float32Array, i: number, x: number, y: number, z: number) => { arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; };
  // 0: price terrain
  const dx = mob0 ? 0.36 : 0.42, dz = 0.52;
  for (let r = 0; r < ROWS; r++) { let price = 2 + rnd(r + 1) * 2, vel = 0;
    for (let c = 0; c < COLS; c++) { const i = r * COLS + c;
      vel = vel * 0.82 + (rnd(i * 1.7 + 3) - 0.5) * 0.5; const open = price; price = Math.max(0.3, price + vel + Math.sin(c * 0.13 + r * 0.31) * 0.12); const lo = Math.min(open, price), body = Math.max(0.06, Math.abs(price - open));
      const hill = 1.6 * Math.sin(c * 0.09 + r * 0.05) * Math.cos(r * 0.12) + 1.4;
      put(P[0], i, (c - COLS / 2) * dx, lo * 0.55 + hill, (r - ROWS / 2) * dz); put(S[0], i, dx * 0.62, body * 1.5 + 0.08, dx * 0.62); K[i * 4] = price >= open ? 1 : -1; R[i] = rnd(i + 0.5);
    } }
  // 1: depth canyon
  const half = COLS / 2;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const i = r * COLS + c, bid = c < half, l = bid ? half - 1 - c : c - half;
    const h = 0.15 + Math.pow(l, 1.25) * 0.085 * (0.75 + rnd(r * 9.1 + l) * 0.6) + (rnd(i * 3.3) > 0.985 ? 2.2 : 0);
    put(P[1], i, (bid ? -1 : 1) * (0.55 + l * dx), 0, (r - ROWS / 2) * 0.5 * 1.5 - 4); put(S[1], i, dx * 0.82, h, 0.42); K[i * 4 + 1] = bid ? 1 : -1; }
  // 2: planet
  const RAD = mob0 ? 4.6 : 6.2, ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = ga * i, hot = rnd(i * 5.7) > 0.93;
    // continents: a cheap band pattern so the sphere is not uniform
    const land = Math.sin(th * 3.0 + y * 4.0) + Math.cos(y * 7.0 + th) > 0.25;
    put(P[2], i, Math.cos(th) * rr * RAD, 7 + y * RAD, Math.sin(th) * rr * RAD); const s = land ? 0.15 : 0.06; put(S[2], i, s, hot ? 0.9 : s, s); K[i * 4 + 2] = hot ? (rnd(i) > 0.5 ? 1 : -1) : land ? 0.25 : 0; }
  // 3: the wordmark
  const { pts, cell } = logoPoints(N, mob0 ? 11 : 17);
  for (let i = 0; i < N; i++) { const [x, y] = pts[i % pts.length], layer = Math.floor(i / pts.length);
    put(P[3], i, x, 6.2 + y - cell * 0.5, -layer * cell * 1.15); put(S[3], i, cell * 0.86, cell * 0.86, cell * 0.86); K[i * 4 + 3] = layer === 0 ? 2.0 : x < 0 ? 0.9 : -0.9; }

  const box = new BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0);
  const geo = new InstancedBufferGeometry(); geo.index = box.index; geo.setAttribute("position", box.attributes.position); geo.setAttribute("normal", box.attributes.normal);
  P.forEach((a, k) => geo.setAttribute(`aP${k}`, new InstancedBufferAttribute(a, 3))); S.forEach((a, k) => geo.setAttribute(`aS${k}`, new InstancedBufferAttribute(a, 3)));
  geo.setAttribute("aK", new InstancedBufferAttribute(K, 4)); geo.setAttribute("aR", new InstancedBufferAttribute(R, 1)); geo.instanceCount = N;
  const uni = { uStage: { value: 0 }, uTime: { value: 0 }, uBid: { value: new Color(0x4ff0e0) }, uAsk: { value: new Color(0xff5a1f) }, uBone: { value: new Color(0xece8df) }, uBg: { value: BG }, uCam: { value: new Vector3() } };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uni });
  const mesh = new Mesh(geo, mat); mesh.frustumCulled = false; scene.add(mesh);

  const CAMS: [Vector3, Vector3][] = [
    [new Vector3(-6, 8.5, 17), new Vector3(0, 2, -1)], [new Vector3(0, 3.4, 13), new Vector3(0, 2.4, -6)],
    [new Vector3(0, 8.5, 21), new Vector3(0, 7, 0)], [new Vector3(0, 6.2, 22), new Vector3(0, 6.2, 0)],
  ];
  let W = 1, H = 1, mob = mob0, top = 0, range = 1, raf = 0, ps = -1, tPrev = performance.now(), vis = true, st = -1, mx = 0, my = 0, sx = 0, sy = 0;
  const pos = new Vector3(), tgt = new Vector3();
  const measure = () => { W = host.clientWidth; H = host.clientHeight; mob = W < 768; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(W, H, false); cam.aspect = W / H; cam.fov = mob ? 56 : 42;
    if (mob) cam.setViewOffset(W, H, 0, -H * 0.16, W, H); else cam.setViewOffset(W, H, -W * 0.13, H * 0.03, W, H); cam.updateProjectionMatrix(); top = hero.getBoundingClientRect().top + scrollY; range = Math.max(1, hero.offsetHeight - innerHeight); };
  const ease = (x: number) => x * x * (3 - 2 * x);
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame); if (!vis) return;
    const dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now; const t = now / 1000;
    const target = Math.min(1, Math.max(0, (scrollY - top) / range));
    ps = ps < 0 || reduced ? target : ps + (target - ps) * (1 - Math.exp(-dt * 6));
    const s = Math.min(2.9999, ps * 3.5), i = Math.floor(s), fr = s - i, f = fr < 0.4 ? 0 : fr > 0.9 ? 1 : (fr - 0.4) / 0.5; // hold, then morph
    uni.uStage.value = i + f; uni.uTime.value = reduced ? 0 : t;
    const stage = Math.min(3, Math.round(i + f)); if (stage !== st) st = stage; onStage(stage, ps);
    sx += (mx - sx) * (1 - Math.exp(-dt * 3)); sy += (my - sy) * (1 - Math.exp(-dt * 3));
    const e = ease(f), a = CAMS[i], b = CAMS[Math.min(3, i + 1)];
    pos.copy(a[0]).lerp(b[0], e); tgt.copy(a[1]).lerp(b[1], e);
    if (mob) { pos.sub(tgt).multiplyScalar(1.25).add(tgt); }
    pos.x += sx * 2.2 + Math.sin(t * 0.2) * 0.6; pos.y += -sy * 1.2 + Math.sin(t * 0.27) * 0.2;
    cam.position.copy(pos); cam.lookAt(tgt); uni.uCam.value.copy(pos);
    renderer.render(scene, cam);
  };
  const move = (ev: PointerEvent) => { if (ev.pointerType === "mouse") { mx = ev.clientX / innerWidth - 0.5; my = ev.clientY / innerHeight - 0.5; } };
  const ro = new ResizeObserver(measure); ro.observe(host);
  const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; tPrev = performance.now(); }); io.observe(host);
  addEventListener("resize", measure); addEventListener("pointermove", move, { passive: true }); measure(); raf = requestAnimationFrame(frame);
  return { destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("resize", measure); removeEventListener("pointermove", move); geo.dispose(); box.dispose(); mat.dispose(); renderer.dispose(); } };
}
