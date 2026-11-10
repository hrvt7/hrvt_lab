import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { WORDMARK } from "@/lib/logo";

THREE.ColorManagement.enabled = false;
const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

export function mount(host: HTMLElement, canvas: HTMLCanvasElement, onReady: () => void) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const gl = renderer.getContext(), dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(22, 1, 10, 30000);
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-0.5, 0.9, 1); scene.add(key);
  const rim = new THREE.DirectionalLight(0xd8ff8a, 1.6); rim.position.set(0.9, -0.3, 0.4); scene.add(rim);
  const face = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
  const side = new THREE.MeshStandardMaterial({ color: 0x3d3d3d, roughness: 0.4, metalness: 0, side: THREE.DoubleSide });
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${WORDMARK.d}"/></svg>`);
  const buckets: THREE.Shape[][] = [[], [], [], []];
  for (const p of data.paths) for (const sh of SVGLoader.createShapes(p)) {
    const b = new THREE.Box2().setFromPoints(sh.getPoints(8)), cx = (b.min.x + b.max.x) / 2;
    buckets[cx < 660 ? 0 : cx < 1325 ? 1 : cx < 2000 ? 2 : 3].push(sh);
  }
  const [vx, vy, vw, vhh] = WORDMARK.viewBox.split(" ").map(Number), CX = vx + vw / 2, CY = vy + vhh / 2, DEPTH = 300;
  const root = new THREE.Group(); root.scale.setScalar(0.9); scene.add(root);
  const letters = buckets.map((shapes, i) => {
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: 16, bevelSize: 12, bevelSegments: 3, curveSegments: 14 });
    geo.scale(1, -1, 1); geo.computeBoundingBox(); const c = geo.boundingBox!.getCenter(new THREE.Vector3()); geo.translate(-c.x, -c.y, -c.z); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, [face, side]); m.position.set(c.x - CX, c.y + CY, 0); root.add(m);
    return { m, geo, home: m.position.clone(), rx: 0, ry: 0, k: 0.13 - i * 0.022, e: 0, spin: 0, spinT: 0, i };
  });
  let W = 0, H = 0, raf = 0, vis = false, shown = false, dirty = true, entered = false, lastY = scrollY, vel = 0, t0 = performance.now();
  const ptr = { x: 0, y: 0 };
  const size = () => {
    W = host.clientWidth; H = host.clientHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, soft ? 1 : 2)); renderer.setSize(W, H, false); cam.aspect = W / H;
    const m = parseFloat(getComputedStyle(host).getPropertyValue("--m")) || W * 0.034, wantW = vw * (W / (W - 2 * m)); // match the flat SVG's width
    cam.position.z = wantW / (2 * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect); cam.updateProjectionMatrix();
    const visH = wantW / cam.aspect, pad = H * 0.5 - (W * 0.05 + ((W - 2 * m) * vhh) / vw / 2); root.position.y = -(pad / H) * visH; dirty = true;
  };
  size();
  const move = (e: PointerEvent) => { const r = host.getBoundingClientRect(); ptr.x = clamp(((e.clientX - r.left) / r.width - 0.5) * 2); ptr.y = clamp(((e.clientY - r.top) / r.height - 0.5) * (e.pointerType === "touch" ? 2 : 1.2), -1.4, 1.4); };
  const gyro = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; ptr.x = clamp(e.gamma / 28); ptr.y = clamp((e.beta - 45) / 28); };
  const tap = () => {
    letters.forEach((l) => { l.spinT += Math.PI * 2; });
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof D?.requestPermission === "function") D.requestPermission().then((s) => s === "granted" && addEventListener("deviceorientation", gyro)).catch(() => {});
  };
  addEventListener("pointermove", move, { passive: true }); addEventListener("deviceorientation", gyro); canvas.addEventListener("click", tap);
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }); io.observe(host);
  const ro = new ResizeObserver(size); ro.observe(host);
  const frame = (now: number) => {
    raf = 0; if (!vis) return; raf = requestAnimationFrame(frame);
    const t = soft ? 0 : (now - t0) / 1000, r = host.getBoundingClientRect();
    if (!entered && r.top < innerHeight * 0.92) entered = true;
    vel += (clamp((scrollY - lastY) / 40) - vel) * 0.15; lastY = scrollY;
    let moving = dirty; dirty = false;
    for (const l of letters) {
      const tx = -ptr.y * 0.55 + vel * 0.5 + Math.sin(t * 0.7 + l.i) * 0.035, ty = ptr.x * 0.6 + Math.sin(t * 0.5 + l.i * 1.7) * 0.05;
      const e1 = entered ? Math.min(1, l.e + (soft ? 1 : 0.022 - l.i * 0.002)) : 0;
      if (Math.abs(tx - l.rx) + Math.abs(ty - l.ry) + Math.abs(l.spinT - l.spin) > 0.0015 || e1 !== l.e) moving = true;
      l.rx += (tx - l.rx) * l.k; l.ry += (ty - l.ry) * l.k; l.spin += (l.spinT - l.spin) * (0.07 - l.i * 0.008); l.e = e1;
      const d = Math.max(0, Math.min(1, (l.e - l.i * 0.12) / (1 - 0.36))), ee = 1 - Math.pow(1 - d, 4);
      l.m.rotation.set(l.rx - (1 - ee) * 1.9, l.ry + l.spin, 0); l.m.position.y = l.home.y - (1 - ee) * vhh * 1.5; l.m.position.z = Math.abs(l.ry) * -60;
    }
    if (!moving && shown) return;
    renderer.render(scene, cam);
    if (!shown) { shown = true; onReady(); }
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener("pointermove", move); removeEventListener("deviceorientation", gyro); canvas.removeEventListener("click", tap); letters.forEach((l) => l.geo.dispose()); face.dispose(); side.dispose(); renderer.dispose(); };
}
