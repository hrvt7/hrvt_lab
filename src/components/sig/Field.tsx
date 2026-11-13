"use client";

import { useEffect, useRef } from "react";
import { WORDMARK } from "@/lib/logo";

/**
 * Jel-mező: the hero's WebGL field. A flowing noise field is drawn through an ASCII glyph atlas
 * (coarse cells) and Bayer dithering (fine cells); the HRVT wordmark condenses out of it.
 * `data-sig-p` on the hero drives the resolution (0 raw → 1 finished). Pointer, touch and device
 * tilt move a lens that knocks the picture back to coarse cells.
 */
const RAMP = " .:-=+*x#%@";

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uP; uniform float uDpr;
uniform vec2 uLens; uniform float uLensK; uniform float uCell0; uniform vec4 uMark; uniform float uTextY;
uniform sampler2D uMarkTex; uniform sampler2D uGlyph; uniform float uN;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(7.1,3.7);a*=.5;}return v;}
float bayer(vec2 p){vec2 q=mod(floor(p),4.);float i=q.x+q.y*4.;
  float m=0.;
  if(i<.5)m=0.;else if(i<1.5)m=8.;else if(i<2.5)m=2.;else if(i<3.5)m=10.;
  else if(i<4.5)m=12.;else if(i<5.5)m=4.;else if(i<6.5)m=14.;else if(i<7.5)m=6.;
  else if(i<8.5)m=3.;else if(i<9.5)m=11.;else if(i<10.5)m=1.;else if(i<11.5)m=9.;
  else if(i<12.5)m=15.;else if(i<13.5)m=7.;else if(i<14.5)m=13.;else m=5.;
  return (m+.5)/16.;}
float mark(vec2 px){vec2 uv=(px-uMark.xy)/uMark.zw;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return 0.;
  return texture2D(uMarkTex,uv).r;}
void main(){
  vec2 frag=gl_FragCoord.xy;
  vec3 night=vec3(.1333),kiwi=vec3(.537,.914,0.),paper=vec3(.949,.949,.933);
  // the lens is a hard-edged, grid-aligned block of coarse ASCII cells: no blur, no soft falloff
  float big=20.*uDpr;
  vec2 bid=floor(frag/big);
  vec2 bc=bid*big+big*.5;
  float inText=step(uTextY+.03,bc.y/uRes.y);
  float lens=step(distance(bc,uLens),170.*uDpr*uLensK)*step(.05,uLensK)*inText;
  float cell=mix(uCell0,3.,smoothstep(0.,.78,uP))*uDpr;
  cell=floor(cell+.5);
  cell=max(cell,2.);
  cell=mix(cell,big,lens);
  vec2 id=floor(frag/cell);
  vec2 c=id*cell+cell*.5;
  vec2 s=c;
  vec2 q=s/uRes.y;
  float t=uTime*.07;
  float f=fbm(q*2.6+vec2(t,-t*.6)+fbm(q*1.4-vec2(t*.5,t))*1.6);
  float fade=1.-smoothstep(.55,.98,uP);
  float calm=mix(0.,1.,smoothstep(uTextY,uTextY+.07,c.y/uRes.y));
  calm*=mix(1.,0.,smoothstep(uRes.y-46.*uDpr,uRes.y-30.*uDpr,c.y));
  // supersample the mark so thin strokes survive coarse cells
  float o=cell*.25;
  float m=(mark(s+vec2(o,o))+mark(s+vec2(-o,o))+mark(s+vec2(o,-o))+mark(s+vec2(-o,-o)))*.25;
  m=smoothstep(.18,.5,m);
  float reveal=1.;
  float lum=clamp(f*1.25-.3,0.,1.)*.5*fade*calm;
  lum=mix(lum,.9+.1*f,m);
  lum=clamp(lum,0.,1.);
  // ASCII for coarse cells
  vec2 l=fract(frag/cell);
  float gi=floor(lum*(uN-.001));
  float ga=texture2D(uGlyph,vec2((gi+l.x)/uN,l.y)).r;
  // Bayer dither for fine cells
  float da=step(bayer(id),lum*1.06);
  float asciiK=smoothstep(5.5,7.5,cell/uDpr);
  float a=mix(da,ga,asciiK);
  vec3 col=mix(paper*.55,kiwi,smoothstep(.35,.6,m));
  vec3 outc=mix(night,col,a);
  // the finished state: the crisp mark itself
  float crisp=smoothstep(.84,1.,uP)*(1.-lens);
  outc=mix(outc,mix(night,kiwi,smoothstep(.4,.6,mark(frag))),crisp);
  gl_FragColor=vec4(outc,1.);
}`;

export function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const hero = cv.closest<HTMLElement>("[data-sig-hero]")!;
    const params = new URLSearchParams(location.search);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (params.get("gl") === "0") return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;
    // Software rendering (no GPU) would burn the main thread: keep the crisp SVG mark instead. `?gl=1` forces the field.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer) && params.get("gl") !== "1") return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), time: U("uTime"), p: U("uP"), dpr: U("uDpr"), lens: U("uLens"), lensK: U("uLensK"),
      mark: U("uMark"), cell0: U("uCell0"), textY: U("uTextY"), markTex: U("uMarkTex"), glyph: U("uGlyph"), n: U("uN"),
    };

    const tex = (unit: number, src: HTMLCanvasElement, linear: boolean) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Wordmark mask, drawn from the kit's outlined path.
    const [vx, vy, vw, vh] = WORDMARK.viewBox.split(/\s+/).map(Number);
    const mc = document.createElement("canvas");
    mc.width = 1536;
    mc.height = Math.round((1536 * vh) / vw);
    const mx = mc.getContext("2d")!;
    mx.fillStyle = "#000";
    mx.fillRect(0, 0, mc.width, mc.height);
    mx.scale(mc.width / vw, mc.height / vh);
    mx.translate(-vx, -vy);
    mx.fillStyle = "#fff";
    mx.fill(new Path2D(WORDMARK.d));
    tex(0, mc, true);
    gl.uniform1i(u.markTex, 0);
    const ratio = vw / vh;

    // Glyph atlas (rebuilt once the mono face is in).
    const atlas = () => {
      const g = document.createElement("canvas");
      const S = 64;
      g.width = S * RAMP.length;
      g.height = S;
      const x = g.getContext("2d")!;
      x.fillStyle = "#000";
      x.fillRect(0, 0, g.width, S);
      x.fillStyle = "#fff";
      x.font = `700 ${S * 0.92}px "Geist Mono Variable", ui-monospace, monospace`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      [...RAMP].forEach((ch, i) => x.fillText(ch, i * S + S / 2, S / 2 + 2));
      tex(1, g, true);
      gl.uniform1i(u.glyph, 1);
      gl.uniform1f(u.n, RAMP.length);
    };
    atlas();
    document.fonts?.load('700 48px "Geist Mono Variable"').then(atlas).catch(() => {});

    let W = 0, H = 0, dpr = 1;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      W = Math.max(2, Math.round(r.width * dpr));
      H = Math.max(2, Math.round(r.height * dpr));
      cv.width = W;
      cv.height = H;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(u.res, W, H);
      gl.uniform1f(u.dpr, dpr);
      // mark rectangle (px, origin bottom-left), laid out differently on phones
      const phone = r.width < 760;
      // the mark sits between the top label and the copy block; the field calms down behind the copy
      const copy = hero.querySelector<HTMLElement>(".sig-hero-copy")!.getBoundingClientRect();
      const copyTop = Math.max(r.height * 0.3, copy.top - r.top);
      const free0 = 44, free1 = copyTop - (phone ? 14 : 28);
      const mw = Math.min(W * (phone ? 0.88 : 0.8), (free1 - free0) * 0.9 * ratio * dpr);
      const mh = mw / ratio;
      const cy = H - ((free0 + free1) / 2) * dpr;
      // the wordmark starts on the page margin, like the logo and the headline
      const margin = Math.min(56, Math.max(18, r.width * 0.034)) * dpr;
      const mw2 = Math.min(mw, W - 2 * margin);
      gl.uniform4f(u.mark, margin, cy - (mw2 / ratio) / 2, mw2, mw2 / ratio);
      gl.uniform1f(u.textY, 1 - (copyTop - 8) / r.height);
      gl.uniform1f(u.cell0, phone ? 8 : 16);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    // Lens: pointer, touch, or device tilt.
    let lx = W / 2, ly = H * 0.6, tx = lx, ty = ly, k = 0, tk = 0;
    let lastInput = 0;
    const at = (cx: number, cy: number) => {
      const r = cv.getBoundingClientRect();
      tx = (cx - r.left) * dpr;
      ty = (r.height - (cy - r.top)) * dpr;
      tk = 1;
      lastInput = performance.now();
    };
    const pm = (e: PointerEvent) => at(e.clientX, e.clientY);
    const leave = () => (tk = 0);
    window.addEventListener("pointermove", pm, { passive: true });
    window.addEventListener("pointerdown", pm, { passive: true });
    document.addEventListener("pointerleave", leave);
    let tilt = false;
    const orient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt = true;
      if (performance.now() - lastInput < 1400) return; // a finger wins over tilt
      const gx = Math.max(-1, Math.min(1, e.gamma / 28));
      const gy = Math.max(-1, Math.min(1, (e.beta - 42) / 28));
      tx = W / 2 + gx * W * 0.42;
      ty = H * 0.62 - gy * H * 0.3;
      tk = 0.85;
    };
    window.addEventListener("deviceorientation", orient, { passive: true });
    const onTilt = () => window.addEventListener("deviceorientation", orient, { passive: true });
    window.addEventListener("sig:tilt", onTilt);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);

    let raf = 0;
    const t0 = performance.now();
    let drawn = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible && drawn) return;
      const p = reduced ? 1 : Number(hero.dataset.sigP || 0);
      if (coarse && !tilt && now - lastInput > 1600) tk = 0;
      lx += (tx - lx) * 0.14;
      ly += (ty - ly) * 0.14;
      k += (tk - k) * 0.08;
      gl.uniform1f(u.time, reduced ? 0 : (now - t0) / 1000);
      gl.uniform1f(u.p, p);
      gl.uniform2f(u.lens, lx, ly);
      gl.uniform1f(u.lensK, reduced ? 0 : k);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawn) {
        drawn = true;
        hero.classList.add("is-gl");
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerdown", pm);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("deviceorientation", orient);
      window.removeEventListener("sig:tilt", onTilt);
    };
  }, []);

  return <canvas ref={ref} className="sig-field" aria-hidden />;
}
