/**
 * "Két világ, egy szív": a brilliant-cut diamond rendered in WebGL sits on the edge between the two
 * brands. Each fragment is tinted by the side of the cut it falls on (pink for Diamond Rush, gold for
 * Golden Girls Club). At the end of the hero the stone bursts into its facets, the shards drift along
 * the page edges while you read, and they fly back together into one beating stone at the last section.
 */
import { BufferAttribute, BufferGeometry, Mesh, PerspectiveCamera, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer, DoubleSide } from "three";

export type Api = { destroy: () => void };
type Opts = {
  canvas: HTMLCanvasElement; hero: HTMLElement; end: HTMLElement; slot: HTMLElement;
  /** cut = share of the screen that belongs to Diamond Rush along the cut normal (0..1), angle in rad */
  onFrame: (s: { stage: number; p: number; cx: number; cy: number; nx: number; ny: number }) => void;
};

function brilliant() {
  const pos: number[] = [], cen: number[] = [], rnd: number[] = [];
  const tri = (a: Vector3, b: Vector3, c: Vector3) => {
    const m = new Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3), r = [Math.random(), Math.random(), Math.random()];
    for (const v of [a, b, c]) { pos.push(v.x, v.y, v.z); cen.push(m.x, m.y, m.z); rnd.push(r[0], r[1], r[2]); }
  };
  const ring = (n: number, rad: number, y: number, off = 0) => Array.from({ length: n }, (_, i) => { const a = ((i + off) / n) * Math.PI * 2; return new Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad); });
  const N = 8, T = ring(N, 0.56, 0.42), S = ring(N, 0.8, 0.27, 0.5), G = ring(N * 2, 1, 0.1), G2 = ring(N * 2, 1, 0.04), P = ring(N, 0.5, -0.5, 0.5), C = new Vector3(0, -0.98, 0), TC = new Vector3(0, 0.42, 0);
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, g0 = G[2 * i], g1 = G[2 * i + 1], g2 = G[(2 * i + 2) % (2 * N)];
    tri(TC, T[j], T[i]);                      // table
    tri(T[i], T[j], S[i]);                    // star facet
    tri(T[i], S[i], g0); tri(S[i], g1, g0);   // bezel kite, left half
    tri(T[j], g2, S[i]); tri(S[i], g2, g1);   // bezel kite, right half
    const h0 = G2[2 * i], h1 = G2[2 * i + 1], h2 = G2[(2 * i + 2) % (2 * N)];
    tri(g0, g1, h1); tri(g0, h1, h0); tri(g1, g2, h2); tri(g1, h2, h1); // girdle
    tri(h0, h1, P[i]); tri(h1, h2, P[i]);     // lower girdle facets
    tri(h2, P[j], P[i]);                      // pavilion main, upper part
    tri(P[i], P[j], C);                       // pavilion to the culet
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("aCen", new BufferAttribute(new Float32Array(cen), 3));
  g.setAttribute("aRnd", new BufferAttribute(new Float32Array(rnd), 3));
  return g;
}

const VERT = /* glsl */ `
attribute vec3 aCen; attribute vec3 aRnd;
uniform float uEx, uTime, uSpread, uAspect, uBeat;
varying vec3 vN, vV, vRnd; varying float vEx;
mat3 rot(vec3 ax, float a){ float s=sin(a), c=cos(a), o=1.0-c; return mat3(o*ax.x*ax.x+c, o*ax.x*ax.y-ax.z*s, o*ax.z*ax.x+ax.y*s, o*ax.x*ax.y+ax.z*s, o*ax.y*ax.y+c, o*ax.y*ax.z-ax.x*s, o*ax.z*ax.x-ax.y*s, o*ax.y*ax.z+ax.x*s, o*ax.z*ax.z+c); }
void main(){
  // each facet is a rigid shard: it spins around its own centre and leaves along its own direction
  vec3 ax = normalize(aRnd - 0.5 + 0.001);
  float ang = uEx * (2.0 + aRnd.x * 9.0) + uEx * uTime * (0.25 + aRnd.y * 0.5);
  mat3 R = rot(ax, ang);
  float keep = step(aRnd.y, 0.34);
  float e0 = uEx * uEx * (3.0 - 2.0 * uEx);
  vec3 local = R * (position - aCen) * mix(1.0, keep * (0.38 + aRnd.z * 0.3), smoothstep(0.55, 1.0, e0));
  vec3 cen = aCen * (1.0 + uBeat);
  vec4 mv = modelViewMatrix * vec4(cen + local * (1.0 + uBeat), 1.0);
  // exploded: every shard gets its own spot on a ring near the screen edge (view space), slowly drifting
  float a = aRnd.x * 6.2831 + uTime * 0.05 * (aRnd.y - 0.5);
  vec2 edge = vec2(cos(a) * uAspect, sin(a)) * uSpread * (1.0 + aRnd.z * 0.16);
  edge.y += sin(uTime * 0.4 + aRnd.y * 20.0) * 0.12;
  float e = uEx * uEx * (3.0 - 2.0 * uEx);
  mv.xy = mix(mv.xy, edge + (mv.xy - (modelViewMatrix * vec4(cen,1.0)).xy), e);
  vN = normalize(normalMatrix * (R * normal));
  vV = normalize(-mv.xyz); vRnd = aRnd; vEx = e;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes, uCutP, uCutN; uniform float uTime, uGlow;
varying vec3 vN, vV, vRnd; varying float vEx;
float bars(vec3 r, float t){ // a studio of thin light strips: this is what makes facets flash
  float a = atan(r.z, r.x) * 3.0 + r.y * 5.0 + t;
  return smoothstep(0.72, 1.0, sin(a) * 0.5 + 0.5) + 0.6 * smoothstep(0.9, 1.0, sin(a * 2.7 + 1.3) * 0.5 + 0.5);
}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 r = reflect(-v, n);
  // dispersion: the three channels look at slightly different places
  float t = uTime * 0.35;
  vec3 spec = vec3(bars(r + 0.03, t), bars(r, t), bars(r - 0.03, t));
  // inner light: every facet has its own brightness, like light bouncing inside the stone
  float inner = 0.25 + 0.75 * pow(fract(vRnd.x * 7.3 + dot(n, vec3(0.3, 0.9, 0.2)) * 1.7 + t * 0.15), 2.0);
  // which world does this pixel live in?
  vec2 px = gl_FragCoord.xy / uRes; px.y = 1.0 - px.y;
  float side = smoothstep(-0.004, 0.004, dot(px - uCutP, uCutN));
  vec3 pink = vec3(1.0, 0.18, 0.49), gold = vec3(0.93, 0.74, 0.32);
  vec3 tint = mix(pink, gold, side);
  vec3 deep = mix(vec3(0.22, 0.0, 0.1), vec3(0.3, 0.19, 0.03), side);
  vec3 col = mix(deep, tint, inner) + spec * mix(vec3(1.0, 0.85, 0.92), vec3(1.0, 0.95, 0.8), side) * 0.95 + fres * 0.55;
  col += uGlow * tint * 0.35;
  gl_FragColor = vec4(col, 1.0);
}`;

export function mount({ canvas, hero, end, slot, onFrame }: Opts): Api {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene(), cam = new PerspectiveCamera(35, 1, 0.1, 50);
  cam.position.set(0, 0, 9);
  const geo = brilliant(); geo.computeVertexNormals();
  const uni = {
    uEx: { value: 0 }, uTime: { value: 0 }, uSpread: { value: 3 }, uAspect: { value: 1 }, uBeat: { value: 0 }, uGlow: { value: 0 },
    uRes: { value: new Vector2(1, 1) }, uCutP: { value: new Vector2(0.5, 0.5) }, uCutN: { value: new Vector2(1, 0) },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uni, side: DoubleSide });
  const gem = new Mesh(geo, mat); gem.frustumCulled = false; scene.add(gem);

  let W = 1, H = 1, mob = false, heroTop = 0, heroRange = 1, endTop = 1e9, raf = 0, ps = -1, sy = -1, tPrev = performance.now(), lastKey = "", px = 0, pxs = 0, vis = true;
  const measure = () => {
    W = innerWidth; H = innerHeight; mob = W < 768;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    uni.uRes.value.set(W * dpr, H * dpr); uni.uAspect.value = W / H;
    // half-height of the view at the gem's depth, so the shard ring hugs the screen edge
    uni.uSpread.value = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z * (mob ? 1.02 : 0.98);
    heroTop = hero.getBoundingClientRect().top + scrollY; heroRange = Math.max(1, hero.offsetHeight - H);
    endTop = end.getBoundingClientRect().top + scrollY;
    lastKey = "";
  };
  const ss = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const move = (e: PointerEvent) => { if (e.pointerType === "mouse") px = e.clientX / W - 0.5; };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!vis) return;
    const dt = Math.min(0.05, (now - tPrev) / 1000); tPrev = now;
    const t = now / 1000;
    const target = Math.max(0, (scrollY - heroTop) / heroRange);
    ps = ps < 0 || reduced ? target : ps + (target - ps) * (1 - Math.exp(-dt * 7));
    sy = sy < 0 || reduced ? scrollY : sy + (scrollY - sy) * (1 - Math.exp(-dt * 7));
    pxs += (px - pxs) * (1 - Math.exp(-dt * 5));
    const p = Math.min(1, ps);
    const key = reduced ? `${ps.toFixed(4)}|${sy | 0}` : `${(t * 60) | 0}`;
    if (key === lastKey) return; lastKey = key;

    // the cut: 0.5 → all Diamond Rush → all Golden Girls → back to the middle
    let cut = 0.5 + 0.62 * ss(0.1, 0.26, p) - 1.24 * ss(0.36, 0.56, p) + 0.62 * ss(0.68, 0.84, p);
    const stage = p < 0.1 ? 0 : p < 0.36 ? 1 : p < 0.68 ? 2 : 3;
    const mid = stage === 0 || stage === 3;
    if (mid && !reduced) cut += pxs * 0.1 + Math.sin(t * 0.6) * 0.012;
    const angle = mob ? 1.22 : 0.2; // portrait: the edge runs almost flat across the screen; landscape: almost upright
    const nx = Math.cos(angle), ny = Math.sin(angle);
    // the cut line passes through the screen centre shifted along its normal
    const span = Math.abs(nx) + Math.abs(ny);
    const cxp = 0.5 + nx * (cut - 0.5) * span, cyp = (mob ? 0.56 : 0.5) + ny * (cut - 0.5) * span;
    uni.uCutP.value.set(cxp, cyp); uni.uCutN.value.set(nx, ny);

    // hero → shards → reunion
    const out = ss(0.9, 1.0, p);
    const back = ss(endTop - H * 1.1, endTop - H * 0.15, sy);
    const ex = ps <= 1 ? out : 1 - back;
    uni.uEx.value = reduced && ps > 1 && back < 1 ? 1 : ex;
    uni.uTime.value = t;
    const beat = mid || back > 0.98 ? Math.pow(Math.max(0, Math.sin(t * 2.4)), 14) * 0.07 + Math.pow(Math.max(0, Math.sin(t * 2.4 - 0.5)), 14) * 0.045 : 0;
    uni.uBeat.value = stage === 3 || back > 0.98 ? beat : 0;
    uni.uGlow.value = stage === 3 ? 0.6 : back;

    const s = mob ? 0.62 : 0.95;

    // sit on the edge during the hero, to the side at the reunion
    const halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z, halfW = halfH * cam.aspect;
    const hx = mid ? (cxp - 0.5) * 2 * halfW : 0, hy = -(mob ? 0.3 : 0) * halfH;
    if (back > 0) {
      // the reunited stone lives in its slot on the page and scrolls with it
      const r = slot.getBoundingClientRect();
      gem.position.set(((r.left + r.width / 2) / W - 0.5) * 2 * halfW, -((r.top + r.height / 2) / H - 0.5) * 2 * halfH, 0);
      gem.scale.setScalar(Math.max(0.3, (r.height / H) * halfH * 0.8));
    } else { gem.position.set(hx, hy, 0); gem.scale.setScalar(s); }
    gem.rotation.set(0.42 + Math.sin(t * 0.5) * 0.06, t * 0.5 + p * 9 + sy * 0.0012, 0.12);
    onFrame({ stage, p, cx: cxp, cy: cyp, nx, ny });
    renderer.render(scene, cam);
  };

  const ro = new ResizeObserver(measure); ro.observe(document.body);
  const onVis = () => { vis = !document.hidden; tPrev = performance.now(); };
  addEventListener("resize", measure); addEventListener("pointermove", move, { passive: true }); document.addEventListener("visibilitychange", onVis);
  measure(); raf = requestAnimationFrame(frame);
  return { destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("resize", measure); removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", onVis); geo.dispose(); mat.dispose(); renderer.dispose(); } };
}
