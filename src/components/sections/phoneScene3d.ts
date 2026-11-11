import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * "Telefon a kézben": a 3D phone with a live website on its screen.
 * Scroll scrolls the page on the phone, the phone spins once, a finger taps the button,
 * then the phone flies into the camera and its screen becomes the kiwi page that follows.
 */

const C = { bg: "#1a1a1a", card: "#232323", line: "#2e2e2e", paper: "#f2f2ee", smoke: "#9a9a93", kiwi: "#89e900", night: "#222222" };
const DISP = '"Lexend Giga Variable", "Arial Black", sans-serif';
const SANS = '"Geist Variable", system-ui, sans-serif';
const MONO = '"Geist Mono Variable", ui-monospace, monospace';
type Ctx = CanvasRenderingContext2D;

// Phone and screen in world units (before scaling).
const BODY = { w: 7.1, h: 14.6, d: 0.78, r: 1.0 };
const SCR = { w: 6.5, h: 14.0, r: 0.9 };
// The page drawn on the screen, in logical px.
const PW = 600;
const PH = 3300;
const VIEW = (PW * SCR.h) / SCR.w; // visible screen height in px
const CH = 150; // browser chrome (status bar + address bar), fixed
const MAX_SCROLL = PH - (VIEW - CH);
const TAP_PAGE_Y = 2905; // centre of the page's last button
const TAP = new THREE.Vector2(0.5, 1 - (CH + TAP_PAGE_Y - MAX_SCROLL) / VIEW);

const rr = (g: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};
const fitFont = (g: Ctx, text: string, font: (px: number) => string, maxW: number, px: number) => {
  g.font = font(px);
  const m = g.measureText(text).width;
  if (m > maxW) px = (px * maxW) / m;
  g.font = font(px);
  return px;
};

function paintChrome(g: Ctx, w: number) {
  g.fillStyle = "#141414";
  g.fillRect(0, 0, w, CH);
  g.textBaseline = "middle";
  g.fillStyle = C.paper;
  g.font = `600 26px ${SANS}`;
  g.fillText("9:41", 46, 40);
  for (let i = 0; i < 4; i++) g.fillRect(w - 160 + i * 10, 50 - (i + 1) * 6, 7, (i + 1) * 6);
  rr(g, w - 96, 29, 46, 23, 7);
  g.strokeStyle = C.paper;
  g.lineWidth = 2.5;
  g.stroke();
  rr(g, w - 92, 33, 32, 15, 4);
  g.fill();
  rr(g, 30, 80, w - 60, 54, 27);
  g.fillStyle = "#262626";
  g.fill();
  g.fillStyle = C.smoke;
  g.font = `500 21px ${MONO}`;
  g.textAlign = "center";
  g.fillText("a-te-ceged.hu", w / 2, 108);
  g.textAlign = "left";
}

function paintPage(g: Ctx, w: number) {
  const m = 36;
  g.fillStyle = C.bg;
  g.fillRect(0, 0, w, PH);
  g.textBaseline = "middle";

  // Nav
  g.fillStyle = C.paper;
  g.font = `700 24px ${DISP}`;
  g.fillText("A TE CÉGED", m, 56);
  for (let i = 0; i < 3; i++) g.fillRect(w - m - 38, 44 + i * 12, 38, 4);

  // Hero
  g.textBaseline = "alphabetic";
  const big = (px: number) => `700 ${px}px ${DISP}`;
  const px = fitFont(g, "TELEFONON.", big, w - m * 2, 78);
  ["A TE", "CÉGED,", "TELEFONON."].forEach((l, i) => {
    g.fillStyle = i === 2 ? C.kiwi : C.paper;
    g.fillText(l, m, 240 + i * px * 1.12);
  });
  g.fillStyle = C.smoke;
  g.font = `400 27px ${SANS}`;
  g.fillText("Gyors, könnyen olvasható,", m, 520);
  g.fillText("és egy érintéssel hívható.", m, 558);
  g.textBaseline = "middle";
  rr(g, m, 610, 330, 84, 42);
  g.fillStyle = C.kiwi;
  g.fill();
  g.fillStyle = C.night;
  g.font = `600 27px ${SANS}`;
  g.fillText("Ajánlatot kérek  →", m + 34, 653);
  rr(g, m + 350, 612, w - m * 2 - 352, 80, 40);
  g.strokeStyle = "rgba(242,242,238,.35)";
  g.lineWidth = 2;
  g.stroke();
  g.fillStyle = C.paper;
  g.textAlign = "center";
  g.fillText("Hívás", m + 350 + (w - m * 2 - 352) / 2, 653);
  g.textAlign = "left";

  // Picture block (drawn, not a photo)
  g.save();
  rr(g, m, 760, w - m * 2, 400, 26);
  g.clip();
  const iw = w - m * 2;
  const sky = g.createLinearGradient(0, 760, 0, 1160);
  sky.addColorStop(0, "#101010");
  sky.addColorStop(1, "#2f3a14");
  g.fillStyle = sky;
  g.fillRect(m, 760, iw, 400);
  g.fillStyle = C.kiwi;
  g.beginPath();
  g.arc(m + iw * 0.68, 900, 92, 0, 7);
  g.fill();
  g.fillStyle = "#1c1c1c";
  g.beginPath();
  g.moveTo(m, 1160);
  g.lineTo(m, 1010);
  g.lineTo(m + iw * 0.24, 930);
  g.lineTo(m + iw * 0.47, 1040);
  g.lineTo(m + iw * 0.66, 970);
  g.lineTo(m + iw, 1080);
  g.lineTo(m + iw, 1160);
  g.fill();
  g.fillStyle = "#0e0e0e";
  g.beginPath();
  g.moveTo(m, 1160);
  g.lineTo(m, 1100);
  g.lineTo(m + iw * 0.32, 1050);
  g.lineTo(m + iw * 0.7, 1120);
  g.lineTo(m + iw, 1070);
  g.lineTo(m + iw, 1160);
  g.fill();
  g.restore();

  // Rows
  g.fillStyle = C.smoke;
  g.font = `500 19px ${MONO}`;
  g.fillText("MIT KÍNÁLUNK", m, 1240);
  ["Szolgáltatások", "Nyitvatartás", "Útvonal"].forEach((t, i) => {
    const y = 1280 + i * 110;
    g.fillStyle = C.line;
    g.fillRect(m, y, w - m * 2, 2);
    g.fillStyle = C.kiwi;
    g.font = `500 20px ${MONO}`;
    g.fillText(`0${i + 1}`, m, y + 56);
    g.fillStyle = C.paper;
    g.font = `600 32px ${SANS}`;
    g.fillText(t, m + 64, y + 56);
    g.fillStyle = C.smoke;
    g.fillText("→", w - m - 30, y + 56);
  });

  // Speed card
  rr(g, m, 1660, w - m * 2, 280, 26);
  g.fillStyle = C.card;
  g.fill();
  g.fillStyle = C.smoke;
  g.font = `500 19px ${MONO}`;
  g.fillText("BETÖLTÉS", m + 32, 1716);
  g.fillStyle = C.kiwi;
  g.fillText("KÉSZ", w - m - 82, 1716);
  rr(g, m + 32, 1760, w - m * 2 - 64, 14, 7);
  g.fillStyle = C.kiwi;
  g.fill();
  g.fillStyle = C.paper;
  g.font = `600 34px ${SANS}`;
  g.fillText("Mobilneten is gyors.", m + 32, 1850);
  g.fillStyle = C.smoke;
  g.font = `400 24px ${SANS}`;
  g.fillText("Nem kell várni rá.", m + 32, 1896);

  // Map
  g.save();
  rr(g, m, 2010, w - m * 2, 400, 26);
  g.clip();
  g.fillStyle = "#202020";
  g.fillRect(m, 2010, w, 400);
  g.strokeStyle = "#292929";
  g.lineWidth = 2;
  for (let x = m; x < w; x += 44) {
    g.beginPath();
    g.moveTo(x, 2010);
    g.lineTo(x, 2410);
    g.stroke();
  }
  for (let y = 2010; y < 2410; y += 44) {
    g.beginPath();
    g.moveTo(m, y);
    g.lineTo(w, y);
    g.stroke();
  }
  g.strokeStyle = "#383838";
  g.lineWidth = 18;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(m - 20, 2330);
  g.bezierCurveTo(200, 2280, 260, 2120, 620, 2090);
  g.moveTo(170, 2000);
  g.bezierCurveTo(220, 2200, 400, 2300, 420, 2430);
  g.stroke();
  g.fillStyle = C.kiwi;
  g.beginPath();
  g.arc(330, 2180, 26, Math.PI, 0);
  g.lineTo(330, 2236);
  g.closePath();
  g.fill();
  g.fillStyle = C.night;
  g.beginPath();
  g.arc(330, 2180, 10, 0, 7);
  g.fill();
  g.restore();
  g.fillStyle = C.paper;
  g.font = `600 26px ${SANS}`;
  g.fillText("Útvonaltervezés  →", m, 2450);

  // Closing call to action
  rr(g, m, 2490, w - m * 2, 510, 30);
  g.fillStyle = C.kiwi;
  g.fill();
  g.textBaseline = "alphabetic";
  g.fillStyle = C.night;
  const cpx = fitFont(g, "EGY ÉRINTÉSSEL.", big, w - m * 2 - 72, 50);
  ["KÉRJ", "AJÁNLATOT", "EGY ÉRINTÉSSEL."].forEach((l, i) => g.fillText(l, m + 36, 2600 + i * cpx * 1.18));
  g.textBaseline = "middle";
  rr(g, m + 36, TAP_PAGE_Y - 45, w - m * 2 - 72, 90, 45);
  g.fillStyle = C.night;
  g.fill();
  g.fillStyle = C.kiwi;
  g.font = `600 28px ${SANS}`;
  g.textAlign = "center";
  g.fillText("Ajánlatot kérek  →", w / 2, TAP_PAGE_Y);
  g.textAlign = "left";

  // Footer
  g.fillStyle = C.line;
  g.fillRect(m, 3060, w - m * 2, 2);
  g.fillStyle = C.smoke;
  g.font = `500 19px ${MONO}`;
  g.fillText("A-TE-CEGED.HU", m, 3110);
  g.fillText("© 2026", w - m - 80, 3110);
}

const SCREEN_VS = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const SCREEN_FS = /* glsl */ `
uniform sampler2D page, chrome;
uniform float scroll, flood, tap, sheen, on;
uniform vec2 tapAt;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
const vec2 S = vec2(${SCR.w.toFixed(2)}, ${SCR.h.toFixed(2)});
const float R = ${SCR.r.toFixed(2)};
const float VIEW = ${VIEW.toFixed(2)}, CH = ${CH.toFixed(1)}, PH = ${PH.toFixed(1)};
float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main(){
  vec2 p = (vUv - .5) * S;
  float d = box(p, S * .5, R);
  if (d > 0.) discard;
  float py = (1. - vUv.y) * VIEW;
  vec3 c = py < CH
    ? texture2D(chrome, vec2(vUv.x, 1. - py / CH)).rgb
    : texture2D(page, vec2(vUv.x, 1. - (scroll + py - CH) / PH)).rgb;
  // Tap: a soft press under the fingertip and a ring that runs out from it.
  float td = length(p - (tapAt - .5) * S);
  float live = step(.001, tap) * step(tap, .999);
  c = mix(c, vec3(1.), smoothstep(.08, 0., abs(td - tap * 2.4)) * (1. - tap) * .7 * live);
  c = mix(c, vec3(.75), smoothstep(.5, .38, td) * sin(tap * 3.14159) * .45);
  // Dynamic island and home bar.
  c = mix(c, vec3(0.), smoothstep(.015, 0., box(p - vec2(0., S.y * .5 - .42), vec2(1., .25), .25)));
  c = mix(c, vec3(.85), smoothstep(.015, 0., box(p - vec2(0., -S.y * .5 + .22), vec2(1.1, .05), .05)) * (1. - flood));
  c = mix(c, vec3(.537, .914, 0.), flood);
  c *= on;
  // Glass: fresnel and a sheen band that slides as the phone turns.
  float fr = pow(1. - max(dot(normalize(vN), normalize(vV)), 0.), 3.);
  float band = smoothstep(.16, 0., abs(vUv.x * .7 + vUv.y * .3 - sheen)) * .07;
  c += vec3(fr * .25 + band) * (1. - flood);
  gl_FragColor = vec4(c, 1.);
}`;

const GLOW_FS = /* glsl */ `
uniform float a; varying vec2 vUv;
void main(){ float d = length(vUv - .5) * 2.; gl_FragColor = vec4(.537, .914, 0., pow(max(1. - d, 0.), 2.4) * a); }`;
const PLAIN_VS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Pose = { x: number; y: number; h: number; rx: number; ry: number; rz: number };

export function mount({ host, sec, canvas, flood, bar }: { host: HTMLElement; sec: HTMLElement; canvas: HTMLCanvasElement; flood: HTMLElement; bar: HTMLElement }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const gl = renderer.getContext();
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const soft = /swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1");
  renderer.setClearColor(0x000000, 0);

  const phoneUI = innerWidth < 768;
  const short = innerHeight / Math.max(1, innerWidth) < 1.9;
  const HERO: Pose = phoneUI ? (short ? { x: 0, y: 0.24, h: 0.28, rx: 0.16, ry: -0.5, rz: 0.07 } : { x: 0, y: 0.16, h: 0.36, rx: 0.16, ry: -0.5, rz: 0.07 }) : { x: 0.25, y: -0.01, h: 0.74, rx: 0.12, ry: -0.55, rz: 0.08 };
  const STAGE: Pose = phoneUI ? { x: 0, y: 0.15, h: 0.54, rx: 0.04, ry: -0.14, rz: 0 } : { x: 0.19, y: 0.02, h: 0.8, rx: 0.05, ry: -0.2, rz: 0 };

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  cam.position.z = 40;
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  // Matcaps instead of lights + environment: the look of studio-lit metal and glass for the price of one texture lookup.
  const matcap = (base: string, mid: string, rim: string, spec: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const body = g.createRadialGradient(96, 84, 6, 128, 128, 128);
    body.addColorStop(0, mid);
    body.addColorStop(0.55, base);
    body.addColorStop(1, "#050505");
    g.fillStyle = body;
    g.fillRect(0, 0, 256, 256);
    const kr = g.createRadialGradient(128, 128, 96, 128, 128, 128);
    kr.addColorStop(0, "rgba(0,0,0,0)");
    kr.addColorStop(1, rim);
    g.save();
    g.beginPath();
    g.arc(128, 128, 128, -0.9, 1.5);
    g.lineTo(128, 128);
    g.clip();
    g.fillStyle = kr;
    g.fillRect(0, 0, 256, 256);
    g.restore();
    g.fillStyle = `rgba(255,255,255,${spec})`;
    g.filter = "blur(6px)";
    g.beginPath();
    g.ellipse(84, 66, 34, 14, -0.6, 0, 7);
    g.fill();
    const t = keep(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const metalCap = matcap("#232323", "#7a7a76", "rgba(137,233,0,.75)", 0.55);
  const glassCap = matcap("#070707", "#3a3a3a", "rgba(137,233,0,.35)", 0.8);

  // ---- Phone
  const phone = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.add(phone);
  scene.add(pivot);
  const metal = keep(new THREE.MeshMatcapMaterial({ matcap: metalCap }));
  const body = new THREE.Mesh(keep(new RoundedBoxGeometry(BODY.w, BODY.h, BODY.d, 6, BODY.r)), metal);
  phone.add(body);

  const roundRect = (w: number, h: number, r: number) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return keep(new THREE.ShapeGeometry(s, 12));
  };
  const glass = keep(new THREE.MeshMatcapMaterial({ matcap: glassCap }));
  const front = new THREE.Mesh(roundRect(BODY.w - 0.16, BODY.h - 0.16, BODY.r - 0.08), glass);
  front.position.z = BODY.d / 2 + 0.002;
  phone.add(front);
  const back = new THREE.Mesh(roundRect(BODY.w - 0.16, BODY.h - 0.16, BODY.r - 0.08), keep(new THREE.MeshMatcapMaterial({ matcap: metalCap, color: 0xb8b8b8 })));
  back.position.z = -BODY.d / 2 - 0.002;
  back.rotation.y = Math.PI;
  phone.add(back);

  // Side buttons and camera.
  const btnGeo = keep(new RoundedBoxGeometry(0.16, 1, 0.34, 2, 0.07));
  ([[-1, 3.4, 0.55], [-1, 2.2, 0.95], [-1, 0.9, 0.95], [1, 2.6, 1.6]] as const).forEach(([side, y, len]) => {
    const b = new THREE.Mesh(btnGeo, metal);
    b.scale.y = len;
    b.position.set(side * (BODY.w / 2 + 0.02), y, 0);
    phone.add(b);
  });
  const bump = new THREE.Mesh(keep(new RoundedBoxGeometry(3.1, 3.1, 0.22, 4, 0.7)), glass);
  bump.position.set(-BODY.w / 2 + 2.05, BODY.h / 2 - 2.05, -BODY.d / 2 - 0.1);
  phone.add(bump);
  const lensGeo = keep(new THREE.CylinderGeometry(0.56, 0.56, 0.22, 32));
  const lensMat = keep(new THREE.MeshMatcapMaterial({ matcap: glassCap, color: 0x888888 }));
  [[-0.7, 0.7], [-0.7, -0.7], [0.7, 0]].forEach(([x, y]) => {
    const l = new THREE.Mesh(lensGeo, lensMat);
    l.rotation.x = Math.PI / 2;
    l.position.set(bump.position.x + x, bump.position.y + y, -BODY.d / 2 - 0.25);
    phone.add(l);
  });

  // ---- Screen
  const maxTex = renderer.capabilities.maxTextureSize;
  const K = soft || phoneUI ? 1 : maxTex >= 8192 ? 1.6 : 1.2;
  const mkCanvas = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * K);
    c.height = Math.min(maxTex, Math.round(h * K));
    return c;
  };
  const pageC = mkCanvas(PW, PH);
  const chromeC = mkCanvas(PW, CH);
  const pageT = keep(new THREE.CanvasTexture(pageC));
  const chromeT = keep(new THREE.CanvasTexture(chromeC));
  [pageT, chromeT].forEach((t) => (t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())));
  const paint = () => {
    const g = pageC.getContext("2d")!;
    g.setTransform(K, 0, 0, pageC.height / PH, 0, 0);
    paintPage(g, PW);
    const h = chromeC.getContext("2d")!;
    h.setTransform(K, 0, 0, K, 0, 0);
    paintChrome(h, PW);
    pageT.needsUpdate = chromeT.needsUpdate = true;
    dirty = true;
  };
  const screenMat = keep(
    new THREE.ShaderMaterial({
      vertexShader: SCREEN_VS,
      fragmentShader: SCREEN_FS,
      uniforms: {
        page: { value: pageT },
        chrome: { value: chromeT },
        scroll: { value: 0 },
        flood: { value: 0 },
        tap: { value: 0 },
        tapAt: { value: TAP },
        sheen: { value: 0 },
        on: { value: 1 },
      },
    }),
  );
  const screen = new THREE.Mesh(keep(new THREE.PlaneGeometry(SCR.w, SCR.h)), screenMat);
  screen.position.z = BODY.d / 2 + 0.006;
  phone.add(screen);

  // Kiwi glow behind the phone.
  const glowMat = keep(new THREE.ShaderMaterial({ vertexShader: PLAIN_VS, fragmentShader: GLOW_FS, uniforms: { a: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const glow = new THREE.Mesh(keep(new THREE.PlaneGeometry(1, 1)), glowMat);
  glow.renderOrder = -1;
  scene.add(glow);

  let W = 0;
  let H = 0;
  let vw = 1;
  let vh = 1;
  let dpr = Math.min(devicePixelRatio || 1, soft ? 1 : phoneUI ? 2 : 1.75);
  let dirty = true;
  let raf = 0;
  let vis = true;
  let dead = false;
  let lastP = -1;
  let stage = "-1";
  let lastFlood = "";
  let lastBar = "";
  let born = 0;
  const t0 = performance.now();
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  // Section geometry is measured on resize only; every frame works from the scroll value (no forced layout).
  let secTop = 0;
  let secH = 1;
  const measure = () => {
    const y = (window as unknown as { __lenis?: { scroll: number } }).__lenis?.scroll ?? scrollY;
    secTop = sec.getBoundingClientRect().top + y;
    secH = sec.offsetHeight;
  };
  const size = () => {
    measure();
    W = host.clientWidth;
    H = host.clientHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    cam.aspect = W / Math.max(1, H);
    cam.updateProjectionMatrix();
    vh = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
    vw = vh * cam.aspect;
    dirty = true;
  };
  size();

  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    ptr.tx = (e.clientX / innerWidth - 0.5) * 2;
    ptr.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  const tilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    ptr.tx = Math.max(-1, Math.min(1, e.gamma / 25));
    ptr.ty = Math.max(-1, Math.min(1, (e.beta - 50) / 25));
  };
  addEventListener("pointermove", move, { passive: true });
  if (phoneUI) addEventListener("deviceorientation", tilt, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis && !raf && !dead) raf = requestAnimationFrame(frame);
  });
  io.observe(host);
  const ro = new ResizeObserver(size);
  ro.observe(host);
  ro.observe(document.body);

  // Frame watch: if frames stay slow, drop the pixel ratio a step (down to 1).
  let acc = 0;
  let cnt = 0;
  let prev = performance.now();
  const watch = (now: number) => {
    acc += now - prev;
    prev = now;
    if (++cnt < 45) return;
    if (acc / cnt > 24 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25);
      size();
    }
    acc = 0;
    cnt = 0;
  };

  const posed = (a: Pose, b: Pose, k: number): Pose => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), h: lerp(a.h, b.h, k), rx: lerp(a.rx, b.rx, k), ry: lerp(a.ry, b.ry, k), rz: lerp(a.rz, b.rz, k) });

  const frame = (now: number) => {
    raf = 0;
    if (!vis || dead) return;
    raf = requestAnimationFrame(frame);
    if (!soft) watch(now);
    const top = secTop - ((window as unknown as { __lenis?: { scroll: number } }).__lenis?.scroll ?? scrollY);
    const r = { top, bottom: top + secH };
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, secH - H)));
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    const pm = Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 0.002;
    born = soft ? 1 : Math.min(1, born + 0.018);
    if (soft && p === lastP && !pm && !dirty) return;
    lastP = p;
    dirty = false;
    const t = soft ? 0 : (now - t0) / 1000;

    const A = sm(0.03, 0.24, p); // hero → stage
    const spin = sm(0.54, 0.69, p); // "Villámgyors": one full turn
    const tap = Math.min(1, Math.max(0, (p - 0.8) / 0.07));
    const E = sm(0.88, 1, p); // fly into the camera
    const Ez = Math.pow(E, 2.2);
    const free = 1 - E;

    const ps = posed(HERO, STAGE, A);
    const sStage = (ps.h * vh) / BODY.h;
    const sEnd = Math.max((vh * 1.12) / SCR.h, (vw * 1.12) / SCR.w);
    const sc = sStage * Math.pow(sEnd / sStage, Ez) * lerp(0.9, 1, born);
    pivot.scale.setScalar(sc);
    const bob = Math.sin(t * 0.9) * 0.012 * vh * free;
    pivot.position.set(lerp(ps.x * vw, 0, E), lerp(ps.y * vh, 0, E) + bob + (1 - born) * -0.04 * vh, 0);
    const ry = ps.ry + spin * Math.PI * 2 + (Math.sin(t * 0.6) * 0.07 + ptr.x * 0.28) * free;
    const rx = ps.rx + (Math.cos(t * 0.5) * 0.035 + ptr.y * 0.16) * free;
    pivot.rotation.set(lerp(rx, 0, E), lerp(ry, Math.round(ry / (Math.PI * 2)) * Math.PI * 2, E), lerp(ps.rz, 0, E));

    const u = screenMat.uniforms;
    u.scroll.value = sm(0.12, 0.79, p) * MAX_SCROLL;
    u.tap.value = tap;
    u.flood.value = sm(0.3, 0.85, E);
    u.sheen.value = 0.5 + (pivot.rotation.y % (Math.PI * 2)) * 0.35 - ptr.x * 0.15;
    u.on.value = lerp(0.35, 1, born);

    const gs = sStage * BODY.h * 1.9;
    glow.scale.set(gs, gs, 1);
    glow.position.set(pivot.position.x, pivot.position.y, -6);
    glowMat.uniforms.a.value = 0.16 * born * (1 - E);

    renderer.render(scene, cam);
    const fo = sm(0.75, 0.98, E).toFixed(3);
    if (fo !== lastFlood) flood.style.opacity = lastFlood = fo;
    const st = p < 0.13 || p >= 0.9 ? "-1" : p < 0.34 ? "0" : p < 0.53 ? "1" : p < 0.72 ? "2" : "3";
    if (st !== stage) host.dataset.stage = stage = st;
    const bt = `scaleX(${(sm(0.13, 0.88, p) * 0.999 + 0.001).toFixed(4)})`;
    if (bt !== lastBar) bar.style.transform = lastBar = bt;
    if (r.top <= 40 && r.bottom > 40) {
      const want = E > 0.8 ? "kiwi" : "night";
      const el = document.documentElement;
      if (el.dataset.nav !== want) el.dataset.nav = want;
    }
  };

  // Boot in small slices (paint, upload, compile), so no single task blocks the main thread for long.
  const idle = () =>
    new Promise<void>((r) => {
      const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback;
      if (ric) ric(() => r(), { timeout: 400 });
      else setTimeout(r, 60);
    });
  (async () => {
    await document.fonts.ready;
    await idle();
    if (dead) return;
    paint();
    await idle();
    if (dead) return;
    renderer.initTexture(chromeT);
    await idle();
    if (dead) return;
    renderer.initTexture(pageT);
    await idle();
    if (dead) return;
    await renderer.compileAsync(scene, cam).catch(() => {});
    await idle();
    if (!dead) raf = requestAnimationFrame(frame);
  })();
  (window as unknown as { __phone?: object }).__phone = { stats: () => ({ dpr, soft }) };

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    removeEventListener("pointermove", move);
    removeEventListener("deviceorientation", tilt);
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };
}
