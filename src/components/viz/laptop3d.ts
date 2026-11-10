import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { MONOGRAM } from "@/lib/logo";

THREE.ColorManagement.enabled = false;
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const tex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; return t; };

export function mount(host: HTMLElement, canvas: HTMLCanvasElement, src: string, onReady: () => void) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const gl = renderer.getContext(), dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, 1, 300); cam.position.z = 46;
  scene.add(new THREE.AmbientLight(0xffffff, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-0.6, 1, 0.8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8ff66, 1.1); rim.position.set(1, 0.2, -0.6); scene.add(rim);
  const body = new THREE.MeshStandardMaterial({ color: 0x34353a, roughness: 0.42, metalness: 0.1 });
  const g = new THREE.Group(); scene.add(g);
  const W = 16, D = 10.8, disposables: { dispose(): void }[] = [body];
  const baseGeo = new RoundedBoxGeometry(W, 0.46, D, 4, 0.2), base = new THREE.Mesh(baseGeo, body); base.position.y = -0.23; g.add(base);
  const kbT = tex(1024, 680, (c) => {
    c.fillStyle = "#2b2c30"; c.fillRect(0, 0, 1024, 680); c.fillStyle = "#17171a";
    for (let r = 0; r < 6; r++) for (let k = 0; k < 15; k++) { const x = 44 + k * 62.6, y = 40 + r * 58; if (r === 5 && k > 3 && k < 10) { if (k === 4) { c.beginPath(); c.roundRect(x, y, 62.6 * 6 - 8, 50, 7); c.fill(); } continue; } c.beginPath(); c.roundRect(x, y, 54.6, 50, 7); c.fill(); }
    c.fillStyle = "#303136"; c.strokeStyle = "#1c1c1f"; c.lineWidth = 2; c.beginPath(); c.roundRect(332, 420, 360, 220, 14); c.fill(); c.stroke();
  });
  const kb = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, D - 0.5), new THREE.MeshBasicMaterial({ map: kbT })); kb.rotation.x = -Math.PI / 2; kb.position.y = 0.004; g.add(kb);
  const glowT = tex(256, 256, (c) => { const r = c.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, "rgba(190,255,120,.5)"); r.addColorStop(0.6, "rgba(190,255,120,0)"); c.fillStyle = r; c.fillRect(0, 0, 256, 256); });
  const glowM = new THREE.MeshBasicMaterial({ map: glowT, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }), glow = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, D - 0.5), glowM); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.01; g.add(glow);
  const shT = tex(256, 256, (c) => { const r = c.createRadialGradient(128, 128, 10, 128, 128, 128); r.addColorStop(0, "rgba(0,0,0,.6)"); r.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = r; c.fillRect(0, 0, 256, 256); });
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.3, D * 1.5), new THREE.MeshBasicMaterial({ map: shT, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.5; g.add(sh);
  const hinge = new THREE.Group(); hinge.position.set(0, 0.06, -D / 2 + 0.12); g.add(hinge);
  const lidGeo = new RoundedBoxGeometry(W, D, 0.3, 4, 0.14), lid = new THREE.Mesh(lidGeo, body); lid.position.set(0, D / 2, -0.15); hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.3, D - 0.3), new THREE.MeshBasicMaterial({ color: 0x0b0b0c })); bezel.position.set(0, D / 2, 0.004); hinge.add(bezel);
  const SW = W - 1, SH = SW / 1.6, scrM = new THREE.MeshBasicMaterial({ color: 0x000000 }), scr = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), scrM); scr.position.set(0, D / 2 + 0.1, 0.008); hinge.add(scr);
  const backT = tex(512, 346, (c) => { c.fillStyle = "#34353a"; c.fillRect(0, 0, 512, 346); const [x, y, w, h] = MONOGRAM.viewBox.split(" ").map(Number), s = 96 / h; c.translate(256 - (w * s) / 2, 173 - (h * s) / 2); c.scale(s, s); c.translate(-x, -y); c.fillStyle = "#89e900"; c.fill(new Path2D(MONOGRAM.d)); });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.6, D - 0.6), new THREE.MeshStandardMaterial({ map: backT, roughness: 0.42, metalness: 0.1 })); back.rotation.y = Math.PI; back.position.set(0, D / 2, -0.304); hinge.add(back);
  disposables.push(baseGeo, lidGeo, kbT, glowT, shT, backT);
  let shot: THREE.Texture | null = null, dirty = true;
  new THREE.TextureLoader().load(`${src}-1400.webp`, (t) => { t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; shot = t; scrM.map = t; scrM.needsUpdate = true; dirty = true; });

  let w = 0, h = 0, raf = 0, vis = false, shown = false, lastP = -1, t0 = performance.now(), visW = 1;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const size = () => { w = canvas.clientWidth; h = canvas.clientHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, soft ? 1 : 2)); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); visW = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z * cam.aspect; dirty = true; };
  size();
  const move = (e: PointerEvent) => { if (e.pointerType === "touch") return; const r = host.getBoundingClientRect(); ptr.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)); ptr.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)); };
  addEventListener("pointermove", move, { passive: true });
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: "200px" }); io.observe(host);
  const ro = new ResizeObserver(size); ro.observe(canvas);
  const frame = (now: number) => {
    raf = 0; if (!vis) return; raf = requestAnimationFrame(frame);
    const r = host.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.5 + r.height * 0.75)));
    ptr.x += (ptr.tx - ptr.x) * 0.07; ptr.y += (ptr.ty - ptr.y) * 0.07;
    const lit = sm(0.62, 0.86, p), still = p === lastP && Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) < 0.002 && !dirty;
    if (still && (soft || lit === 0) && shown) return; lastP = p; dirty = false;
    const t = soft ? 0 : (now - t0) / 1000, open = sm(0.12, 0.7, p), eo = 1 - Math.pow(1 - open, 2.2), arrive = sm(0, 0.5, p);
    hinge.rotation.x = lerp(Math.PI / 2, -0.24, eo);
    const s = ((visW * 0.64) / W) * lerp(0.74, 1, arrive); g.scale.setScalar(s);
    g.rotation.set(lerp(1.05, 0.2, eo) + ptr.y * 0.05, lerp(-0.85, -0.2, sm(0.1, 0.9, p)) + ptr.x * 0.12 + Math.sin(t * 0.4) * 0.015 * lit, lerp(0.12, 0, eo));
    g.position.set(0, lerp(-1.5, -4.4, eo) * s + (1 - arrive) * -6, 0);
    const flick = lit < 1 && lit > 0 ? 0.75 + 0.25 * Math.sin(p * 400) : 1, b = lit * flick; scrM.color.setRGB(b, b, b); glowM.opacity = lit * 0.55;
    if (shot) { const z = 1.1 + Math.sin(t * 0.22) * 0.08 * lit; shot.repeat.set(1 / z, 1 / z); shot.offset.set((1 - 1 / z) * (0.5 + Math.sin(t * 0.17) * 0.45), (1 - 1 / z) * (0.5 + Math.cos(t * 0.13) * 0.45)); }
    renderer.render(scene, cam);
    if (!shown && shot) { shown = true; onReady(); }
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener("pointermove", move); disposables.forEach((d) => d.dispose()); shot?.dispose(); renderer.dispose(); };
}
