import * as THREE from "three";

THREE.ColorManagement.enabled = false;
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export type UI = { l: number[]; shut: number; heat: number };
export const ROOMS = [
  { name: "Nappali", x0: -6, x1: 1, y: 0 },
  { name: "Konyha", x0: 1, x1: 6, y: 0 },
  { name: "Hálószoba", x0: -6, x1: 0.5, y: 3 },
  { name: "Fürdő", x0: 0.5, x1: 6, y: 3 },
] as const;
const KIWI = 0xf0a35e, ZB = -3.5, ZF = 3.5, WZ = -3.38;

export function mount({ host, sec, canvas, labels, ui }: { host: HTMLElement; sec: HTMLElement; canvas: HTMLCanvasElement; labels: HTMLElement[]; ui: { current: UI } }) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { return null; }
  const gl = renderer.getContext(), dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 1, 400), house = new THREE.Group(); scene.add(house);
  scene.fog = new THREE.Fog(0x0b1220, 60, 150);
  const amb = new THREE.AmbientLight(0xffffff, 0.62); scene.add(amb);
  const sun = new THREE.DirectionalLight(0xbcd0ff, 0.6); sun.position.set(0.4, 1, 0.9); scene.add(sun);
  const D: { dispose(): void }[] = [];
  const std = (color: number, o: Partial<THREE.MeshStandardMaterialParameters> = {}) => { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o }); D.push(m); return m; };
  const slabM = std(0x26324a), furnM = std(0x4a5470, { roughness: 0.7 }), wallM = std(0x3a4866, { transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false });
  const edgeM = new THREE.LineBasicMaterial({ color: KIWI, transparent: true, opacity: 0.42 }), edgeDim = new THREE.LineBasicMaterial({ color: KIWI, transparent: true, opacity: 0.16 }); D.push(edgeM, edgeDim);
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, e: THREE.LineBasicMaterial | null = edgeDim, parent: THREE.Object3D = house) => {
    const g = new THREE.BoxGeometry(w, h, d), mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z); parent.add(mesh); D.push(g);
    if (e) { const eg = new THREE.EdgesGeometry(g), l = new THREE.LineSegments(eg, e); l.position.copy(mesh.position); parent.add(l); D.push(eg); }
    return mesh;
  };
  // shell
  box(12.4, 0.2, 7.4, 0, -0.1, 0, slabM, edgeM); box(12.2, 0.16, 7.2, 0, 3 - 0.08, 0, slabM, edgeM); box(12.2, 0.14, 7.2, 0, 6 - 0.07, 0, slabM, edgeM);
  box(12, 6, 0.08, 0, 3, ZB, wallM, edgeM); box(0.08, 6, 7, -6, 3, 0, wallM, edgeM); box(0.08, 6, 7, 6, 3, 0, wallM, edgeM);
  box(0.08, 2.84, 7, 1, 1.42, 0, wallM); box(0.08, 2.86, 7, 0.5, 4.5, 0, wallM);
  // roof + solar
  const SL = Math.hypot(3.9, 2.3), ang = Math.atan2(2.3, 3.9), roofM = std(0x33405c, { transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
  for (const s of [1, -1]) {
    const g = new THREE.PlaneGeometry(12.8, SL), m = new THREE.Mesh(g, roofM); m.position.set(0, 6 + 1.15, s * 1.95); m.rotation.x = s * (-Math.PI / 2 + ang); house.add(m); D.push(g);
    const eg = new THREE.EdgesGeometry(g), l = new THREE.LineSegments(eg, edgeM); l.position.copy(m.position); l.rotation.copy(m.rotation); house.add(l); D.push(eg);
    if (s === 1) { const pm = std(0x1d2a33, { roughness: 0.35, transparent: true, opacity: 0.8, side: THREE.DoubleSide }); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const pg = new THREE.PlaneGeometry(1.5, 1.05), p = new THREE.Mesh(pg, pm); p.position.set(-2.55 + i * 1.7, (j - 0.5) * 1.2, 0.03); m.add(p); const pe = new THREE.LineSegments(new THREE.EdgesGeometry(pg), edgeM); pe.position.copy(p.position); m.add(pe); D.push(pg, pe.geometry); } }
  }
  // furniture
  box(3.2, 0.8, 1.2, -3.4, 0.4, -2.7, furnM); box(3.2, 0.5, 0.35, -3.4, 1.05, -3.15, furnM); box(1.5, 0.28, 0.8, -3.4, 0.14, -0.9, furnM); box(0.12, 1.1, 2.2, -5.85, 1.5, 0.6, std(0x151515, { roughness: 0.3 }));
  box(4.2, 1, 0.85, 3.5, 0.5, -2.95, furnM); box(2.2, 1, 1, 3.4, 0.5, -0.5, furnM); box(0.8, 2.1, 0.8, 5.45, 1.05, -2.95, furnM);
  box(2.5, 0.55, 3.1, -3.1, 3.28, -1.85, furnM); box(2.5, 0.9, 0.2, -3.1, 3.6, -3.35, furnM); box(0.6, 0.5, 0.6, -5, 3.25, -3.05, furnM); box(0.6, 0.5, 0.6, -1.2, 3.25, -3.05, furnM);
  box(2.6, 0.7, 1.2, 4.2, 3.35, -2.8, std(0x8a8a8a, { roughness: 0.4 })); box(1.3, 0.9, 0.6, 1.6, 3.45, -3.1, furnM); box(1.1, 1, 0.06, 1.6, 4.7, -3.42, std(0x7f8c93, { roughness: 0.2 }));
  // per room: lamp, light, window + shutter, heating coil, wires
  const glowT = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!, r = g.createRadialGradient(64, 64, 2, 64, 64, 64); r.addColorStop(0, "rgba(255,236,196,1)"); r.addColorStop(0.3, "rgba(255,220,160,.45)"); r.addColorStop(1, "rgba(255,220,160,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); D.push(t); return t; })();
  const tubeM = new THREE.MeshBasicMaterial({ color: KIWI, depthTest: false }), pulseM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false }), pulseG = new THREE.SphereGeometry(0.11, 10, 8), heatM = new THREE.LineBasicMaterial({ color: 0xff5a36, transparent: true, opacity: 0 }); D.push(tubeM, pulseM, pulseG, heatM);
  const board = new THREE.Vector3(-5.55, 1.4, WZ); box(0.5, 0.8, 0.14, board.x, board.y, WZ + 0.02, std(0x1a1a1a), edgeM);
  type Wire = { geo: THREE.TubeGeometry; n: number; curve: THREE.CurvePath<THREE.Vector3>; pulse: THREE.Mesh; act: () => number; ph: number };
  const wires: Wire[] = [];
  const wire = (pts: THREE.Vector3[], act: () => number) => {
    const curve = new THREE.CurvePath<THREE.Vector3>(); for (let i = 0; i < pts.length - 1; i++) curve.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const geo = new THREE.TubeGeometry(curve, Math.round(curve.getLength() * 5), 0.045, 5, false), m = new THREE.Mesh(geo, tubeM); m.renderOrder = 20; geo.setDrawRange(0, 0); house.add(m); D.push(geo);
    const pulse = new THREE.Mesh(pulseG, pulseM.clone()); pulse.visible = false; pulse.renderOrder = 21; house.add(pulse); D.push(pulse.material as THREE.Material);
    wires.push({ geo, n: geo.index!.count, curve, pulse, act, ph: wires.length * 0.37 });
  };
  const st = { wires: 0, l: [0, 0, 0, 0], shut: 0, heat: 0 };
  const rooms = ROOMS.map((r, i) => {
    const cx = (r.x0 + r.x1) / 2, top = r.y + 2.84, lampY = r.y + 2.15;
    const cordG = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(cx, top, 0), new THREE.Vector3(cx, lampY + 0.16, 0)]); house.add(new THREE.Line(cordG, edgeM)); D.push(cordG);
    const bulbM = new THREE.MeshBasicMaterial({ color: 0x555555 }), bulbG = new THREE.SphereGeometry(0.19, 16, 12), bulb = new THREE.Mesh(bulbG, bulbM); bulb.position.set(cx, lampY, 0); house.add(bulb); D.push(bulbM, bulbG);
    const sprM = new THREE.SpriteMaterial({ map: glowT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }), spr = new THREE.Sprite(sprM); spr.position.copy(bulb.position); spr.scale.setScalar(3.4); house.add(spr); D.push(sprM);
    const light = new THREE.PointLight(0xffdfae, 0, 11, 1.4); light.position.set(cx, lampY - 0.1, 0.4); house.add(light);
    const wx = cx + (i === 1 ? 0.2 : 0), wy = r.y + 1.75, glassG = new THREE.PlaneGeometry(2.3, 1.35), glassM = new THREE.MeshBasicMaterial({ color: 0xbfd6ea, transparent: true, opacity: 0.5 }), glass = new THREE.Mesh(glassG, glassM); D.push(glassM); glass.position.set(wx, wy, ZB + 0.06); house.add(glass);
    const fe = new THREE.LineSegments(new THREE.EdgesGeometry(glassG), edgeM); fe.position.copy(glass.position); house.add(fe); D.push(glassG, fe.geometry);
    const slatM = std(0x2a2a2a, { roughness: 0.6 }), slats = Array.from({ length: 9 }, () => box(2.3, 0.13, 0.04, wx, wy, ZB + 0.12, slatM, null));
    const pts: THREE.Vector3[] = []; const rows = 7, x0 = r.x0 + 0.5, x1 = r.x1 - 0.5; for (let k = 0; k < rows; k++) { const z = lerp(ZB + 0.6, ZF - 0.6, k / (rows - 1)); pts.push(new THREE.Vector3(k % 2 ? x1 : x0, r.y + 0.04, z), new THREE.Vector3(k % 2 ? x0 : x1, r.y + 0.04, z)); }
    const coilG = new THREE.BufferGeometry().setFromPoints(pts); house.add(new THREE.Line(coilG, heatM)); D.push(coilG);
    const up = r.y > 0, trunk = [board, new THREE.Vector3(board.x, 2.86, WZ), ...(up ? [new THREE.Vector3(board.x, 5.86, WZ)] : [])], cy = r.y + 2.86;
    wire([...trunk, new THREE.Vector3(cx, cy, WZ), new THREE.Vector3(cx, cy, 0)], () => st.l[i]);
    wire([...trunk, new THREE.Vector3(wx + 1.3, cy, WZ), new THREE.Vector3(wx + 1.3, wy + 0.6, WZ)], () => Math.abs(shutV));
    const sx = r.x1 - 0.5; wire([...trunk, new THREE.Vector3(sx, cy, WZ), new THREE.Vector3(sx, r.y + 1.2, WZ)], () => st.l[i] * 0.6); box(0.22, 0.22, 0.06, sx, r.y + 1.2, WZ + 0.03, std(0x1a1a1a), edgeM);
    wire([...trunk, new THREE.Vector3(r.x0 + 1.2, cy, WZ), new THREE.Vector3(r.x0 + 1.2, r.y + 0.35, WZ), new THREE.Vector3(r.x0 + 2.6, r.y + 0.35, WZ)], () => st.heat * 0.5);
    return { cx, bulbM, sprM, light, slats, wy, y: r.y, temp: -1 };
  });
  const grid = new THREE.GridHelper(200, 50, KIWI, KIWI), gm = grid.material as THREE.LineBasicMaterial; gm.transparent = true; gm.opacity = 0.1; grid.position.y = -0.22; scene.add(grid); D.push(grid.geometry, gm);

  let W = 0, H = 0, raf = 0, vis = true, t0 = performance.now(), lastP = -1, shutV = 0, drag = 0, dragT = 0, stage = "", dirty = true, down = false, px = 0;
  const phone = () => W < 768, C = new THREE.Vector3(0, 3.7, 0), right = new THREE.Vector3(), upv = new THREE.Vector3(), tgt = new THREE.Vector3(), v = new THREE.Vector3(), tmp = new THREE.Vector3();
  const size = () => { W = host.clientWidth; H = host.clientHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, soft ? 1 : phone() ? 2 : 1.75)); renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); dirty = true; };
  size();
  const pd = (e: PointerEvent) => { down = true; px = e.clientX; }, pu = () => (down = false);
  const pmv = (e: PointerEvent) => { if (!down) return; dragT = Math.max(-0.9, Math.min(0.9, dragT + (e.clientX - px) * 0.006)); px = e.clientX; };
  canvas.addEventListener("pointerdown", pd); addEventListener("pointerup", pu); addEventListener("pointercancel", pu); addEventListener("pointermove", pmv, { passive: true });
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }); io.observe(host);
  const ro = new ResizeObserver(size); ro.observe(host);
  const frame = (now: number) => {
    raf = 0; if (!vis) return; raf = requestAnimationFrame(frame);
    const r = sec.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - H))), t = soft ? 0 : (now - t0) / 1000, live = p >= 0.86;
    const night = sm(0.73, 0.8, p), tw = sm(0.11, 0.27, p), u = ui.current;
    const tl = ROOMS.map((_, i) => (live ? u.l[i] : sm(0.29 + i * 0.03, 0.315 + i * 0.03, p) * (1 - night * (i === 3 ? 0.8 : 1)))), ts = live ? u.shut : Math.max(sm(0.45, 0.55, p) * (1 - sm(0.6, 0.66, p)), night), th = live ? u.heat : sm(0.59, 0.68, p);
    let moving = dirty || p !== lastP || Math.abs(dragT - drag) > 0.001; dirty = false; lastP = p;
    const k = soft ? 1 : 0.09; st.wires += (tw - st.wires) * (soft ? 1 : 0.2); const ps = st.shut; st.shut += (ts - st.shut) * (soft ? 1 : 0.06); shutV = Math.min(1, Math.abs(st.shut - ps) * 60); st.heat += (th - st.heat) * k;
    tl.forEach((x, i) => { if (Math.abs(x - st.l[i]) > 0.002) moving = true; st.l[i] += (x - st.l[i]) * (soft ? 1 : 0.14); });
    if (Math.abs(ts - st.shut) + Math.abs(th - st.heat) > 0.004) moving = true;
    drag += (dragT - drag) * 0.1;
    if (soft && !moving) return;
    // camera
    const ph = phone(), fill = ph ? 0.9 : lerp(0.44, 0.56, sm(0.1, 0.3, p)), R = 14 / (fill * 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect);
    const theta = lerp(0.62, -0.5, sm(0.08, 0.84, p)) + Math.sin(t * 0.3) * 0.05 + drag, hgt = lerp(5.5, 3.2, sm(0.1, 0.5, p));
    cam.position.set(C.x + Math.sin(theta) * R, C.y + hgt, C.z + Math.cos(theta) * R); cam.lookAt(C); cam.updateMatrixWorld();
    right.setFromMatrixColumn(cam.matrixWorld, 0); upv.setFromMatrixColumn(cam.matrixWorld, 1);
    const visH = 2 * Math.tan((cam.fov * Math.PI) / 360) * R, visW = visH * cam.aspect, dx = ph ? 0 : lerp(0.25, 0.17, sm(0.1, 0.3, p)), dy = ph ? lerp(0.2, 0.09, sm(0.1, 0.3, p)) : lerp(0.13, 0.03, sm(0.08, 0.28, p));
    tgt.copy(C).addScaledVector(right, -dx * visW).addScaledVector(upv, -dy * visH); cam.position.add(tmp.copy(tgt).sub(C)); cam.lookAt(tgt);
    // state → scene
    let sum = 0;
    rooms.forEach((rm, i) => {
      const on = st.l[i]; sum += on; rm.light.intensity = on * 17; rm.bulbM.color.setRGB(lerp(0.33, 1, on), lerp(0.33, 0.93, on), lerp(0.33, 0.78, on)); rm.sprM.opacity = on * 0.95;
      rm.slats.forEach((s, j) => { const top = rm.wy + 0.62; s.position.y = top - j * 0.155 * st.shut; s.scale.y = 0.35 + 0.65 * st.shut; s.visible = j === 0 || st.shut > 0.02; });
      const temp = Math.round(lerp(19, i === 3 ? 24 : 22, st.heat)); if (temp !== rm.temp) { rm.temp = temp; labels[i].querySelector("b")!.textContent = `${temp}°`; }
      v.set(rm.cx, rm.y + 0.02, ZF).project(cam); labels[i].style.transform = `translate3d(${((v.x + 1) / 2) * W}px,${((1 - v.y) / 2) * H}px,0) translate(-50%,6px)`;
    });
    amb.intensity = 0.62 - sum * 0.03; heatM.opacity = st.heat * (0.75 + Math.sin(t * 2.2) * 0.15);
    wires.forEach((w) => { w.geo.setDrawRange(0, Math.floor((w.n * st.wires) / 30) * 30); const a = st.wires > 0.98 ? Math.min(1, w.act()) : 0; w.pulse.visible = a > 0.03; if (w.pulse.visible) { w.pulse.position.copy(w.curve.getPointAt((t * 0.33 + w.ph) % 1)); (w.pulse.material as THREE.MeshBasicMaterial).opacity = a; } });
    edgeM.opacity = lerp(0.5, 0.3, Math.min(1, sum / 2));
    renderer.render(scene, cam);
    const s = p < 0.1 ? "-1" : p < 0.28 ? "0" : p < 0.44 ? "1" : p < 0.58 ? "2" : p < 0.72 ? "3" : p < 0.86 ? "4" : "5";
    if (s !== stage) host.dataset.stage = stage = s;
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); canvas.removeEventListener("pointerdown", pd); removeEventListener("pointerup", pu); removeEventListener("pointercancel", pu); removeEventListener("pointermove", pmv); D.forEach((d) => d.dispose()); renderer.dispose(); };
}
