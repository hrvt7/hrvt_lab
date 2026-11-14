import * as THREE from "three";
import type { Photo } from "@/lib/photos";

/**
 * Photo tunnel: the photos line the inside wall of a cylinder on a helix, all in black and white.
 * Scroll flies the camera down the tunnel towards the portrait standing at the far end.
 * Desktop: the photo under the mouse turns back to colour. Phone: the photo that is most visible
 * (largest on screen, in front of the camera) turns back to colour while scrolling.
 */

const R = 5; // tunnel radius
const PER_TURN = 5.3; // photos per full turn of the helix
const DZ = 1.9; // depth step between neighbours
const ARC = ((Math.PI * 2) / PER_TURN) * 0.9; // angular width of one photo
const Z0 = -4; // depth of the first photo

const VS = /* glsl */ `
varying vec2 vUv; varying float vDepth;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FS = /* glsl */ `
uniform sampler2D map; uniform float uColor, uLoad, uNear, uFar, uFrame;
varying vec2 vUv; varying float vDepth;
void main(){
  vec3 c = texture2D(map, vUv).rgb;
  float l = dot(c, vec3(.299, .587, .114));
  vec3 g = vec3(clamp((l - .5) * 1.12 + .5, 0., 1.));
  vec3 col = mix(g * .86, c, uColor);
  // Thin white frame on the chosen photo.
  vec2 e = min(vUv, 1. - vUv);
  float edge = step(min(e.x, e.y * 1.6), .012) * uFrame * uColor;
  col = mix(col, vec3(.96), edge);
  // Depth fade: far photos dissolve into the portrait behind the tunnel (no black fog).
  float a = (1. - smoothstep(uNear, uFar, vDepth)) * uLoad;
  gl_FragColor = vec4(col, a);
}`;

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** A curved panel on the inside of the cylinder: u runs around the wall, v runs into the depth (image top = far end). */
function panel(a0: number, zc: number, len: number) {
  const SU = 18;
  const SV = 2;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= SV; j++) {
    for (let i = 0; i <= SU; i++) {
      const u = i / SU;
      const v = j / SV;
      const a = a0 - ARC / 2 + u * ARC;
      pos.push(R * Math.cos(a), R * Math.sin(a), zc + len / 2 - v * len);
      uv.push(u, v);
    }
  }
  for (let j = 0; j < SV; j++)
    for (let i = 0; i < SU; i++) {
      const a = j * (SU + 1) + i;
      const b = a + SU + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

export function mount(opts: {
  host: HTMLElement;
  sec: HTMLElement;
  canvas: HTMLCanvasElement;
  photos: Photo[];
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
  onProgress: (p: number) => void;
}) {
  const { host, sec, canvas, photos } = opts;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  const touch = matchMedia("(pointer: coarse)").matches;
  const narrow = innerWidth < 768;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(narrow ? 74 : 56, 1, 0.1, 120);
  const tunnel = new THREE.Group();
  scene.add(tunnel);
  const keep: { dispose(): void }[] = [];
  const set = narrow ? "m" : "t";
  const loader = new THREE.TextureLoader();
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  type Item = { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; color: number; corners: THREE.Vector3[]; zc: number };
  const items: Item[] = [];
  const mkMat = () =>
    new THREE.ShaderMaterial({
      vertexShader: VS,
      fragmentShader: FS,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: { map: { value: null }, uColor: { value: 0 }, uLoad: { value: 0 }, uNear: { value: 14 }, uFar: { value: 40 }, uFrame: { value: 1 } },
    });
  const load = (id: string, mat: THREE.ShaderMaterial) =>
    loader.load(`/foto/${set}/${id}.webp`, (t) => {
      t.anisotropy = maxAniso;
      keep.push(t);
      mat.uniforms.map.value = t;
      mat.userData.loaded = true;
      dirty = true;
    });

  photos.forEach((ph, i) => {
    const a0 = -Math.PI / 2 + (i * Math.PI * 2) / PER_TURN;
    const len = R * ARC * (ph.h / ph.w);
    const zc = Z0 - i * DZ - len / 2;
    const geo = panel(a0, zc, len);
    const mat = mkMat();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.index = i;
    tunnel.add(mesh);
    keep.push(geo, mat);
    const corners = [-1, 1].flatMap((su) =>
      [-1, 1].map((sv) => {
        const a = a0 + (su * ARC) / 2;
        return new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), zc + (sv * len) / 2);
      }),
    );
    corners.push(new THREE.Vector3(R * Math.cos(a0), R * Math.sin(a0), zc));
    items.push({ mesh, mat, color: 0, corners, zc });
    load(ph.id, mat);
  });

  // The camera flies out of the far end of the tunnel, into the full-screen portrait behind it.
  const lastZ = Math.min(...items.map((it) => it.zc)) - 4;
  const CAM_END = lastZ - 2;

  const CAM_START = 3;
  cam.position.set(0, 0, CAM_START);

  // ---- Size (100lvh host: the phone's address bar never resizes the drawing buffer)
  let W = 0;
  let H = 0;
  let dpr = Math.min(devicePixelRatio || 1, soft ? 1 : narrow ? 2 : 1.75);
  let bufKey = "";
  let secTop = 0;
  let secH = 1;
  let dirty = true;
  const scrollPos = () => (window as unknown as { __lenis?: { scroll: number } }).__lenis?.scroll ?? scrollY;
  const size = () => {
    secTop = sec.getBoundingClientRect().top + scrollPos();
    secH = sec.offsetHeight;
    W = host.clientWidth;
    H = host.clientHeight;
    const key = `${W}x${H}@${dpr}`;
    if (key === bufKey) return;
    bufKey = key;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    cam.aspect = W / Math.max(1, H);
    cam.updateProjectionMatrix();
    dirty = true;
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(host);
  ro.observe(document.body);

  // ---- Pointer (desktop hover + click; touch tap opens)
  const ndc = new THREE.Vector2(9, 9);
  let hasPointer = false;
  const ray = new THREE.Raycaster();
  const meshes = items.map((it) => it.mesh);
  const pick = (x: number, y: number) => {
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), cam);
    const hit = ray.intersectObjects(meshes, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    hasPointer = true;
    dirty = true;
  };
  const onLeave = () => {
    hasPointer = false;
    dirty = true;
  };
  let down: { x: number; y: number; t: number } | null = null;
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY, t: performance.now() });
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.t < 450;
    down = null;
    if (moved > 8 || !quick) return;
    const i = pick(e.clientX, e.clientY);
    if (i >= 0) opts.onOpen(i);
  };
  canvas.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown, { passive: true });
  canvas.addEventListener("pointerup", onUp);

  // ---- Visibility of each photo on screen (phone selection): clipped screen area of its corners.
  const v = new THREE.Vector3();
  const visibleArea = (it: Item) => {
    let x0 = 1;
    let x1 = -1;
    let y0 = 1;
    let y1 = -1;
    let front = 0;
    for (const c of it.corners) {
      v.copy(c).applyMatrix4(tunnel.matrixWorld);
      const dz = cam.position.z - v.z;
      if (dz < 0.6) continue;
      front++;
      v.project(cam);
      x0 = Math.min(x0, v.x);
      x1 = Math.max(x1, v.x);
      y0 = Math.min(y0, v.y);
      y1 = Math.max(y1, v.y);
    }
    if (front < 4) return 0;
    const w = Math.max(0, Math.min(1, x1) - Math.max(-1, x0));
    const h = Math.max(0, Math.min(1, y1) - Math.max(-1, y0));
    return w * h;
  };

  // ---- Loop
  let raf = 0;
  let vis = true;
  let dead = false;
  let last = performance.now();
  let t = 0;
  let camZ = CAM_START;
  let selected = -1;
  let frame = 0;
  let lastP = -1;
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis && !raf && !dead) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  io.observe(host);

  const choose = (i: number) => {
    if (i === selected) return;
    selected = i;
    if (i >= 0) canvas.dataset.cursor = "Nagyítás";
    else delete canvas.dataset.cursor;
    opts.onSelect(i);
  };

  const loop = (now: number) => {
    raf = 0;
    if (!vis || dead) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const p = Math.min(1, Math.max(0, (scrollPos() - secTop) / Math.max(1, secH - H)));
    if (p !== lastP) {
      lastP = p;
      opts.onProgress(p);
      dirty = true;
    }
    const target = CAM_START + (CAM_END - CAM_START) * sm(0, 1, p);
    const k = 1 - Math.exp(-dt * (touch ? 10 : 14));
    const moving = Math.abs(target - camZ) > 0.002;
    camZ += (target - camZ) * k;
    const anim = items.some((it) => Math.abs(it.mat.uniforms.uColor.value - it.color) > 0.003 || it.mat.uniforms.uLoad.value < 1);
    if (soft && !dirty && !moving && !anim) return;
    dirty = false;
    if (!soft) t += dt;

    cam.position.z = camZ;
    tunnel.rotation.z = p * 1.6 + t * 0.035;
    tunnel.updateMatrixWorld();

    // Selection: hover on desktop, most visible photo on touch screens.
    if (!touch) {
      if (hasPointer) {
        ray.setFromCamera(ndc, cam);
        const hit = ray.intersectObjects(meshes, false)[0];
        choose(hit ? (hit.object.userData.index as number) : -1);
        canvas.style.cursor = hit ? "pointer" : "";
      } else choose(-1);
    } else if (frame++ % 3 === 0) {
      let best = -1;
      let bestA = 0;
      items.forEach((it, i) => {
        const a = visibleArea(it);
        if (a > bestA) {
          bestA = a;
          best = i;
        }
      });
      const cur = selected >= 0 ? visibleArea(items[selected]) : 0;
      if (best !== selected && bestA > cur * 1.18 && bestA > 0.04) choose(best);
      else if (selected >= 0 && cur < 0.02) choose(-1);
    }

    items.forEach((it, i) => {
      it.color = i === selected ? 1 : 0;
      const u = it.mat.uniforms;
      u.uColor.value += (it.color - u.uColor.value) * (1 - Math.exp(-dt * 7));
      if (it.mat.userData.loaded) u.uLoad.value = Math.min(1, u.uLoad.value + dt * 2.5);
    });
    renderer.render(scene, cam);
  };

  renderer
    .compileAsync(scene, cam)
    .catch(() => {})
    .then(() => {
      if (!dead) raf = requestAnimationFrame(loop);
    });

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointerup", onUp);
    keep.forEach((d) => d.dispose());
    renderer.dispose();
  };
}
