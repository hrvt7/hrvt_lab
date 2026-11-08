import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type PergolaApi = {
  /** 0..1 scroll-driven choreography (camera orbit + louvre angle) */
  setProgress: (p: number) => void;
  setFinish: (hex: string) => void;
  setWidth: (m: number) => void;
  setAuto: (on: boolean) => void;
  onReadout: (cb: (r: { angle: number; width: number }) => void) => void;
  dispose: () => void;
};

const BG = new THREE.Color("#0e0e0c");

export function createPergola(canvas: HTMLCanvasElement, opts: { mobile: boolean }): PergolaApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(BG);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 14, 30);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60);

  // ---------- Lighting: low warm sun raking through the louvres ----------
  scene.add(new THREE.HemisphereLight("#e6dfd2", "#141210", 0.75));
  const sun = new THREE.DirectionalLight("#ffdcc0", 4.2);
  sun.position.set(5.5, 7.5, 3.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(opts.mobile ? 1024 : 2048, opts.mobile ? 1024 : 2048);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.PointLight("#ff5a1f", 7, 9, 1.8);
  rim.position.set(-3.2, 1.4, -2.4);
  scene.add(rim);

  // ---------- Materials ----------
  const frameMat = new THREE.MeshStandardMaterial({ color: "#2a2b2d", metalness: 0.55, roughness: 0.38 });
  const groundMat = new THREE.MeshStandardMaterial({ color: "#121210", roughness: 0.95 });
  const deckMat = new THREE.MeshStandardMaterial({ color: "#3a3129", roughness: 0.78 });
  const wallMat = new THREE.MeshStandardMaterial({ color: "#2b2824", roughness: 0.9 });

  // ---------- Static set ----------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.06, 4.4), deckMat);
  deck.position.set(0, 0.03, 0.15);
  deck.receiveShadow = true;
  scene.add(deck);
  // Deck boards: subtle grooves
  for (let i = -15; i <= 15; i++) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.004, 4.38), new THREE.MeshBasicMaterial({ color: "#14120f" }));
    g.position.set(i * 0.2, 0.062, 0.15);
    scene.add(g);
  }

  const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 3.6, 0.24), wallMat);
  wall.position.set(-0.4, 1.8, -2.05);
  wall.receiveShadow = true;
  wall.castShadow = true;
  scene.add(wall);

  // ---------- Parametric pergola ----------
  const H = 2.55;
  const D = 3.2;
  const P = 0.14; // post section
  const rig = new THREE.Group();
  scene.add(rig);

  const box = (w: number, h: number, d: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const posts = [box(P, H, P), box(P, H, P), box(P, H, P), box(P, H, P)];
  const beamF = box(1, 0.24, P);
  const beamB = box(1, 0.24, P);
  const beamL = box(P, 0.24, D);
  const beamR = box(P, 0.24, D);
  [...posts, beamF, beamB, beamL, beamR].forEach((m) => rig.add(m));

  const louvreGeo = new THREE.BoxGeometry(0.17, 0.028, D - 0.08);
  let louvres: THREE.Mesh[] = [];

  let width = 4.2;
  const build = (w: number) => {
    width = w;
    const hx = w / 2;
    const hz = D / 2;
    posts[0].position.set(-hx, H / 2, -hz);
    posts[1].position.set(hx, H / 2, -hz);
    posts[2].position.set(-hx, H / 2, hz);
    posts[3].position.set(hx, H / 2, hz);
    beamF.scale.x = w + P;
    beamB.scale.x = w + P;
    beamF.position.set(0, H - 0.12, hz);
    beamB.position.set(0, H - 0.12, -hz);
    beamL.position.set(-hx, H - 0.12, 0);
    beamR.position.set(hx, H - 0.12, 0);

    louvres.forEach((l) => rig.remove(l));
    const count = Math.round((w - 0.1) / 0.19);
    const step = (w - 0.12) / count;
    louvres = [];
    for (let i = 0; i < count; i++) {
      const l = new THREE.Mesh(louvreGeo, frameMat);
      l.castShadow = true;
      l.receiveShadow = true;
      l.position.set(-hx + 0.06 + step * (i + 0.5), H - 0.1, 0);
      rig.add(l);
      louvres.push(l);
    }
  };
  build(width);

  // ---------- State + loop ----------
  const s = {
    p: 0,
    target: 0,
    angle: 0,
    drag: 0,
    dragTarget: 0,
    auto: false,
    t: 0,
    w: width,
    wTarget: width,
  };
  let readout: ((r: { angle: number; width: number }) => void) | null = null;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 40 : 30;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Drag-to-orbit
  let down = false;
  let lastX = 0;
  const pd = (e: PointerEvent) => {
    down = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  };
  const pm = (e: PointerEvent) => {
    if (!down) return;
    s.dragTarget += (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
  };
  const pu = () => {
    down = false;
  };
  canvas.addEventListener("pointerdown", pd);
  canvas.addEventListener("pointermove", pm);
  canvas.addEventListener("pointerup", pu);
  canvas.addEventListener("pointercancel", pu);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
  io.observe(canvas);

  const clock = new THREE.Clock();
  let raf = 0;
  const look = new THREE.Vector3(0, 1.05, 0);
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) {
      clock.getDelta();
      return;
    }
    const dt = Math.min(clock.getDelta(), 0.05);
    s.t += dt;
    if (s.auto) s.target = 0.5 + Math.sin(s.t * 0.35) * 0.5;
    s.p += (s.target - s.p) * 0.08;
    s.drag += (s.dragTarget - s.drag) * 0.1;
    if (!down) s.dragTarget *= 0.985;

    // Rebuild only when width settles to a new louvre count step.
    s.w += (s.wTarget - s.w) * 0.12;
    if (Math.abs(s.w - width) > 0.02) build(s.w);

    // Louvres: closed (0) → open (~78°) → partly closed for shade at the end.
    const p = s.p;
    const open = p < 0.7 ? THREE.MathUtils.smoothstep(p, 0.08, 0.6) : 1 - THREE.MathUtils.smoothstep(p, 0.7, 1) * 0.45;
    s.angle = open * 1.36;
    louvres.forEach((l, i) => {
      const lag = Math.max(0, Math.min(1, open * 1.15 - (i / louvres.length) * 0.15));
      l.rotation.z = lag * 1.36;
    });

    // Camera: three-quarter → front-low → high three-quarter.
    const theta = -0.85 + p * 1.25 + s.drag;
    const radius = (opts.mobile ? 15 : 13.2) - p * 1.4;
    const y = 4.6 - Math.sin(p * Math.PI) * 1.6 + p * 1.6;
    camera.position.set(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
    camera.lookAt(look);

    sun.position.set(5.5 - p * 3, 7.5, 3.5 + p * 1.5);
    rim.intensity = 6 + Math.sin(s.t * 0.8) * 2;

    renderer.render(scene, camera);
    readout?.({ angle: Math.round((s.angle * 180) / Math.PI), width: s.wTarget });
  };
  loop();

  return {
    setProgress: (p) => {
      s.target = p;
    },
    setFinish: (hex) => {
      frameMat.color.set(hex);
      const light = new THREE.Color(hex).getHSL({ h: 0, s: 0, l: 0 }).l > 0.5;
      frameMat.metalness = light ? 0.25 : 0.55;
      frameMat.roughness = light ? 0.5 : 0.38;
    },
    setWidth: (m) => {
      s.wTarget = m;
    },
    setAuto: (on) => {
      s.auto = on;
    },
    onReadout: (cb) => {
      readout = cb;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", pd);
      canvas.removeEventListener("pointermove", pm);
      canvas.removeEventListener("pointerup", pu);
      canvas.removeEventListener("pointercancel", pu);
      env.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
    },
  };
}
