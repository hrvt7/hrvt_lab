"use client";
import { useEffect, useRef } from "react";
import {
  Color, Group, LinearFilter, LinearSRGBColorSpace, Mesh, NoColorSpace, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial,
  TextureLoader, Vector2, Vector4, VideoTexture, WebGLRenderer, type Texture,
} from "three";
import { CALL, WORK, tc } from "./data";

const TOTAL = 90, CLIP = 30, FOV = 32, CAM_Z = 6;

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/** Living editor backdrop: slow warped noise, lit by the colours of the frame that is playing (an "ambilight"), with a light under the cursor. */
const BG_FRAG = `
precision highp float; varying vec2 vUv;
uniform sampler2D uTex; uniform float uTime, uOn, uAspect; uniform vec2 uMouse; uniform vec4 uSlot;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for(int i=0;i<4;i++){ s += a*n(p); p = p*2.03 + 7.1; a *= 0.5; } return s; }
void main(){
  vec2 p = vUv; p.x *= uAspect;
  vec2 c = uSlot.xy; c.x *= uAspect;
  float t = uTime * 0.05;
  vec2 w = p * 1.6 + vec2(fbm(p*1.3 + t), fbm(p*1.3 - t + 4.0)) * 1.3;
  float f = fbm(w + t);
  vec3 a = texture2D(uTex, vec2(0.22, 0.30)).rgb, b = texture2D(uTex, vec2(0.78, 0.34)).rgb;
  vec3 d = texture2D(uTex, vec2(0.30, 0.74)).rgb, e = texture2D(uTex, vec2(0.72, 0.70)).rgb;
  vec2 q = (p - c) / vec2(uSlot.z * uAspect, uSlot.w);
  vec3 amb = mix(mix(a, b, smoothstep(-0.9, 0.9, q.x + (f-0.5)*1.2)), mix(d, e, smoothstep(-0.9, 0.9, q.x - (f-0.5)*1.2)), smoothstep(-0.8, 0.8, -q.y + (f-0.5)));
  float halo = exp(-dot(q, q) * 0.62) * (0.55 + 0.6 * f);
  vec3 ink = vec3(0.046, 0.046, 0.058) + vec3(0.03, 0.03, 0.045) * f;
  vec3 col = ink + amb * halo * 0.5 * uOn;
  vec2 m = uMouse; m.x *= uAspect;
  col += vec3(0.97, 0.87, 0.29) * 0.055 * exp(-distance(p, m) * 5.0);
  vec2 g = abs(fract(vUv * vec2(uAspect, 1.0) * 14.0) - 0.5);
  col += 0.014 * smoothstep(0.485, 0.5, max(g.x, g.y)) * (1.0 - halo);
  col += (h(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;
  gl_FragColor = vec4(col, 1.0);
}`;

/** One fragment shader for the monitor and the ghost layers behind it: rounded card, optional video. */
const CARD_FRAG = `
precision highp float; varying vec2 vUv;
uniform sampler2D uTex; uniform vec2 uSize; uniform float uR, uMode, uA; uniform vec3 uCol;
float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uSize; float d = box(p, uSize * 0.5, uR), aa = fwidth(d) * 1.2;
  float inside = 1.0 - smoothstep(-aa, aa, d);
  if (uMode < 0.5) {
    vec3 c = texture2D(uTex, vUv).rgb;
    c += 0.05 * smoothstep(0.75, -0.3, vUv.x + (1.0 - vUv.y) * 0.7);
    c = mix(c, vec3(1.0), 0.16 * smoothstep(aa * 2.5, 0.0, abs(d + aa)));
    gl_FragColor = vec4(c, inside);
  } else if (uMode < 1.5) {
    float line = smoothstep(aa * 1.6, 0.0, abs(d + aa * 1.5));
    gl_FragColor = vec4(uCol, (line * 0.9 + inside * 0.05) * uA);
  } else {
    float s = exp(-max(box(p, uSize * 0.31, uR), 0.0) * 1.3);
    gl_FragColor = vec4(uCol, s * uA);
  }
}`;

export function Hero() {
  const root = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null), slot = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null), dock = useRef<HTMLDivElement>(null), ph = useRef<HTMLDivElement>(null);
  const flag = useRef<HTMLSpanElement>(null), hud = useRef<HTMLSpanElement>(null), hudT = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!, cv = canvas.current!, v = video.current!, dk = dock.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, mobile = matchMedia("(max-width: 820px)").matches;
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { el.classList.add("no-gl"); return; }
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));

    const raw = (t: Texture) => { t.colorSpace = NoColorSpace; t.minFilter = LinearFilter; t.magFilter = LinearFilter; t.generateMipmaps = false; return t; };
    const poster = raw(new TextureLoader().load("/motion/reel.webp"));
    const vt = raw(new VideoTexture(v));
    const tex = { value: poster as Texture };

    const scene = new Scene(), cam = new PerspectiveCamera(FOV, 1, 0.1, 50); cam.position.z = CAM_Z;
    const bgScene = new Scene(), bgCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgU = { uTex: tex, uTime: { value: 0 }, uOn: { value: 0 }, uAspect: { value: 1 }, uMouse: { value: new Vector2(0.7, 0.5) }, uSlot: { value: new Vector4(0.5, 0.5, 0.3, 0.3) } };
    bgScene.add(new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`, fragmentShader: BG_FRAG, uniforms: bgU, depthTest: false, depthWrite: false })));

    const rig = new Group(); scene.add(rig);
    const size = new Vector2(16, 9), geo = new PlaneGeometry(1, 1);
    const card = (mode: number, col: number, a: number, z: number, s: number) => {
      const m = new Mesh(geo, new ShaderMaterial({ vertexShader: VERT, fragmentShader: CARD_FRAG, transparent: true, depthWrite: false,
        uniforms: { uTex: tex, uSize: { value: size }, uR: { value: 0.42 }, uMode: { value: mode }, uA: { value: a }, uCol: { value: new Color(col) } } }));
      m.position.z = z; m.scale.setScalar(s); m.renderOrder = mode === 0 ? 5 : 1; rig.add(m); return m;
    };
    const glow = card(2, 0x000000, 0.55, -0.12, 1.5), g2 = card(1, 0xf8dd4a, mobile ? 0 : 0.5, -1.1, 1), g1 = card(1, 0xf1efe9, mobile ? 0 : 0.55, -0.55, 1), screen = card(0, 0, 1, 0, 1);

    // Layout: the monitor sits exactly where the DOM slot is, whatever the breakpoint.
    let W = 1, H = 1, base = 1, bx = 0, by = 0;
    const fit = () => {
      const r = el.getBoundingClientRect(), s = slot.current!.getBoundingClientRect();
      W = r.width; H = r.height; renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
      const vh = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z, vw = vh * cam.aspect;
      base = (s.width / W) * vw; bx = ((s.left - r.left + s.width / 2) / W - 0.5) * vw; by = -((s.top - r.top + s.height / 2) / H - 0.5) * vh;
      rig.position.set(bx, by, 0); rig.scale.set(base, (base * 9) / 16, base);
      size.set(16, 9); bgU.uAspect.value = W / H;
      bgU.uSlot.value.set((s.left - r.left + s.width / 2) / W, 1 - (s.top - r.top + s.height / 2) / H, (s.width / W) * 0.9, (s.height / H) * 0.9);
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el);

    // ---- transport: the reel plays; dragging the playhead scrubs it ----
    let playing = false, dragging = false, want = -1, vel = 0, last = 0, started = false;
    const start = () => { if (started) return; started = true; v.src = mobile ? "/motion/reel-m.mp4" : "/motion/reel.mp4"; v.load(); if (!reduced) v.play().catch(() => {}); };
    const onPlaying = () => { tex.value = vt; playing = true; el.classList.add("is-live"); };
    v.addEventListener("playing", onPlaying); v.addEventListener("seeked", () => { if (!playing && v.readyState >= 2) { tex.value = vt; } });
    const paint = (t: number) => {
      const p = (t / TOTAL) * 100;
      const px = (p / 100) * dk.clientWidth; ph.current!.style.transform = `translateX(${px}px)`; ph.current!.style.setProperty("--px", `${px}px`); ph.current!.style.setProperty("--dw", `${dk.clientWidth}px`);
      const i = Math.min(2, Math.floor(t / CLIP));
      flag.current!.textContent = tc(t); hudT.current!.textContent = tc(t % CLIP);
      if (hud.current!.textContent !== WORK[i].name) { hud.current!.textContent = WORK[i].name; el.dataset.clip = WORK[i].id; }
      ph.current!.setAttribute("aria-valuenow", String(Math.round(t)));
      ph.current!.setAttribute("aria-valuetext", `${WORK[i].name}, ${tc(t)}`);
    };
    const seek = (t: number) => { t = Math.max(0, Math.min(TOTAL - 0.05, t)); vel += (t - last) * 0.5; last = t; want = t; paint(t); };
    const at = (e: PointerEvent) => { const r = dk.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * TOTAL; };
    const down = (e: PointerEvent) => { if (e.button) return; start(); dragging = true; dk.setPointerCapture(e.pointerId); v.pause(); el.classList.add("is-scrub", "touched"); last = v.currentTime; seek(at(e)); };
    const move = (e: PointerEvent) => { if (dragging) seek(at(e)); };
    const up = () => { if (!dragging) return; dragging = false; el.classList.remove("is-scrub"); if (!reduced) v.play().catch(() => {}); };
    const key = (e: KeyboardEvent) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "PageDown" ? CLIP : e.key === "PageUp" ? -CLIP : 0;
      if (e.key === " ") { e.preventDefault(); start(); if (v.paused) v.play().catch(() => {}); else v.pause(); return; }
      if (!d) return; e.preventDefault(); start(); el.classList.add("touched"); last = v.currentTime; seek(v.currentTime + d); };
    dk.addEventListener("pointerdown", down); dk.addEventListener("pointermove", move); dk.addEventListener("pointerup", up); dk.addEventListener("pointercancel", up);
    ph.current!.addEventListener("keydown", key);

    const mouse = new Vector2(0.2, 0), mt = new Vector2(0.2, 0);
    const onMouse = (e: PointerEvent) => { if (e.pointerType === "touch") return; const r = el.getBoundingClientRect(); mt.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)); };
    el.addEventListener("pointermove", onMouse);

    let raf = 0, vis = true, t0 = performance.now(), seekBusy = 0;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (!started) { if (vis) start(); return; } if (!vis) v.pause(); else if (!dragging && !reduced) v.play().catch(() => {}); if (vis && !raf) raf = requestAnimationFrame(frame); }, { threshold: 0.05 });
    const frame = (now: number) => {
      raf = 0; if (!vis) return;
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
      if (want >= 0 && !v.seeking && now - seekBusy > 30 && v.readyState >= 1) { v.currentTime = want; want = -1; seekBusy = now; }
      if (!dragging && started && !v.paused) paint(v.currentTime);
      mouse.lerp(mt, 1 - Math.exp(-dt * 4)); vel *= Math.exp(-dt * 5);
      const k = Math.max(-1, Math.min(1, vel * 0.25)), tm = now / 1000, idle = reduced ? 0 : 1;
      const turn = mobile ? 0 : -0.2;
      rig.rotation.y = turn + mouse.x * 0.13 + Math.sin(tm * 0.5) * 0.035 * idle - k * 0.18;
      rig.rotation.x = -mouse.y * 0.09 + Math.cos(tm * 0.4) * 0.025 * idle;
      rig.rotation.z = k * 0.02;
      rig.position.y = by + Math.sin(tm * 0.7) * 0.02 * idle;
      const sp = (mobile ? 0.45 : 1) * (1 + Math.abs(k) * 1.4);
      const gy = mobile ? -1 : 1; g1.position.set(-0.035 * sp - mouse.x * 0.02, 0.05 * sp * gy, -0.55 * sp); g2.position.set(-0.07 * sp - mouse.x * 0.04, 0.1 * sp * gy, -1.1 * sp);
      bgU.uTime.value = tm; bgU.uOn.value += ((tex.value === vt ? 1 : 0.6) - bgU.uOn.value) * 0.05;
      bgU.uMouse.value.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
      renderer.autoClear = false; renderer.clear(); renderer.render(bgScene, bgCam); renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    };
    io.observe(el); raf = requestAnimationFrame(frame); paint(0);
    void glow; void screen;
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); v.pause(); v.removeAttribute("src"); v.load(); renderer.dispose(); geo.dispose(); vt.dispose(); poster.dispose();
      dk.removeEventListener("pointerdown", down); dk.removeEventListener("pointermove", move); dk.removeEventListener("pointerup", up); dk.removeEventListener("pointercancel", up); el.removeEventListener("pointermove", onMouse); };
  }, []);

  return (
    <header className="hero" id="top" ref={root} data-clip="orlo">
      <canvas ref={canvas} className="hero-gl" aria-hidden />
      <video ref={video} muted playsInline loop preload="none" className="hero-src" aria-hidden tabIndex={-1} />
      <div className="hero-in">
        <div className="hero-copy">
          <p className="tag"><i />SaaS motion design</p>
          <h1 className="h1 kin">High-end motion design for SaaS products that need to look <em>premium.</em></h1>
          <p className="lede">I create 30–60 second product videos, feature explainers, and UI animations that help SaaS companies explain complex products clearly — and convert better.</p>
          <div className="cta-row">
            <a className="btn btn-main" href={CALL} data-track="call_hero"><span>Book a free 15-min call</span><b aria-hidden>→</b></a>
            <a className="btn btn-ghost" href="#work"><span>View selected work</span></a>
          </div>
        </div>
        <div className="hero-view">
          <div className="hud"><b className="rec" aria-hidden /><span ref={hud}>Orlo</span><span ref={hudT} className="mono">00:00</span></div>
          <div className="slot" ref={slot}><img src="/motion/reel.webp" alt="Frame from the Orlo product video" width={960} height={540} /></div>
        </div>
      </div>
      <div className="dock">
        <div className="dock-side" aria-hidden><span>TC</span><span>V1</span><span>A1</span></div>
        <div className="dock-tl" ref={dock}>
          <div className="ruler" aria-hidden>{Array.from({ length: 10 }, (_, i) => <span key={i} style={{ left: `${(i / 9) * 100}%` }}>{tc(i * 10)}</span>)}</div>
          <div className="trk trk-v">
            {WORK.map((w) => (
              <div key={w.id} className="clip" style={{ ["--c" as string]: w.acc, backgroundImage: `url(/motion/${w.id}-strip.webp)` }}><span>{w.name}</span><i>{w.len}</i></div>
            ))}
          </div>
          <div className="trk trk-a" aria-hidden>
            {Array.from({ length: 150 }, (_, i) => { const a = 0.18 + 0.82 * Math.abs(Math.sin(i * 0.37) * Math.sin(i * 0.11 + 1) * Math.cos(i * 0.05)); return <i key={i} style={{ transform: `scaleY(${a.toFixed(2)})` }} />; })}
          </div>
          <div className="ph" ref={ph} role="slider" tabIndex={0} aria-label="Scrub the reel" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={0}>
            <span className="ph-flag mono" ref={flag}>00:00</span>
          </div>
        </div>
      </div>
    </header>
  );
}
