/**
 * "Folyékony HRVT": the footer wordmark as a liquid. A tiny velocity trail (painted on a 2D canvas,
 * fading every frame) displaces the wordmark in a fragment shader, so the letters smear and settle
 * like ink in water wherever the pointer or a finger passes. When idle, an invisible finger wanders.
 */
const VS = "attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}";
const FS = `precision highp float;
varying vec2 v;uniform sampler2D tM,tT;uniform float time,melt;uniform vec2 px;uniform vec3 inkC,hiC,edgeC;
float mk(vec2 u){ return (u.x<0.||u.x>1.||u.y<0.||u.y>1.)?0.:texture2D(tM,u).a; }
void main(){
  vec2 f=texture2D(tT,v).rg-.5;
  vec2 f2=texture2D(tT,v+f*.12).rg-.5;
  vec2 d=(f+f2*.6)*vec2(.26,.72);
  d.y+=sin(v.x*7.+time*.9)*.012+sin(v.x*17.-time*1.3)*.004;
  vec2 u=v-d;
  // melt: the letters run downwards in uneven drips and drain away
  u.y+=melt*melt*(.55+.45*sin(v.x*23.+1.7)*sin(v.x*7.))*.9;
  float a=mk(u)*(1.-smoothstep(.55,1.,melt));
  float hi=mk(u+vec2(-1.5,2.)*px+d*.25);
  float lo=mk(u+vec2(1.5,-2.)*px-d*.25);
  float sp=length(f);
  vec3 ink=inkC;
  vec3 col=mix(ink,edgeC,clamp(a-lo,0.,1.)*smoothstep(.01,.08,sp))+hiC*clamp(a-hi,0.,1.)*smoothstep(.02,.1,sp);
  gl_FragColor=vec4(col*a,a);
}`;

export function mount(host: HTMLElement, opt: { ink?: [number, number, number]; hi?: [number, number, number]; edge?: [number, number, number]; splash?: boolean; onEnergy?: (e: number) => void; onMelted?: () => void; onTap?: () => void } = {}) {
  const svgs = [...host.querySelectorAll<SVGSVGElement>("svg")];
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;left:0;top:-18%;width:100%;height:136%;pointer-events:none";
  const ctx = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!ctx) return null;
  const gl: WebGLRenderingContext = ctx;
  // Software GL (no GPU) would burn the main thread on a full-screen shader: keep the still wordmark there.
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  if (/swiftshader|llvmpipe|software/i.test(String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "")) && !location.search.includes("gl=1")) return null;
  const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const tex = (i: number) => {
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, t);
    [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR));
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
    return t;
  };
  const tM = tex(0), tT = tex(1);
  gl.uniform1i(gl.getUniformLocation(prog, "tM"), 0);
  gl.uniform1i(gl.getUniformLocation(prog, "tT"), 1);
  const uMelt = gl.getUniformLocation(prog, "melt"), uTime = gl.getUniformLocation(prog, "time"), uPx = gl.getUniformLocation(prog, "px");
  gl.uniform3fv(gl.getUniformLocation(prog, "inkC"), opt.ink ?? [0.133, 0.133, 0.133]);
  gl.uniform3fv(gl.getUniformLocation(prog, "edgeC"), opt.edge ?? [0.616, 0.956, 0.133]);
  gl.uniform3fv(gl.getUniformLocation(prog, "hiC"), opt.hi ?? [0.35, 0.35, 0.35]);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  host.style.position = "relative";
  host.appendChild(canvas);

  // wordmark → alpha texture (with the same 18% vertical bleed the canvas has, so smears have room)
  const mark = document.createElement("canvas");
  const mg = mark.getContext("2d")!;
  let W = 0, H = 0;
  const size = () => {
    const w = host.clientWidth, h = host.clientHeight * 1.36;
    if (!w || (w === W && Math.abs(h - H) < 2)) return;
    W = w; H = h;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    mark.width = canvas.width; mark.height = canvas.height;
    // Draw every visible wordmark svg where the layout put it (one row on desktop, two stacked halves on phones).
    const hb = host.getBoundingClientRect();
    mg.setTransform(1, 0, 0, 1, 0, 0);
    mg.clearRect(0, 0, mark.width, mark.height);
    mg.fillStyle = "#fff";
    svgs.forEach((svg) => {
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const [x0, y0, vw, vh] = (svg.getAttribute("viewBox") || "0 0 1 1").split(/\s+/).map(Number);
      const s = Math.min(r.width / vw, r.height / vh) * dpr;
      const ox = (r.left - hb.left + (r.width - (vw * s) / dpr) / 2) * dpr, oy = (r.top - hb.top + hb.height * 0.18 + (r.height - (vh * s) / dpr) / 2) * dpr;
      mg.setTransform(s, 0, 0, s, ox - x0 * s, oy - y0 * s);
      mg.fill(new Path2D(svg.querySelector("path")!.getAttribute("d")!));
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tM);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mark);
    gl.uniform2f(uPx, 1 / canvas.width, 1 / canvas.height);
  };

  // velocity trail: a small float field that decays every frame, written out as an RG image
  const TW = 160, TH = 64;
  const fx = new Float32Array(TW * TH), fy = new Float32Array(TW * TH);
  const img = new ImageData(TW, TH);
  for (let i = 0; i < TW * TH; i++) { img.data[i * 4] = 128; img.data[i * 4 + 1] = 128; img.data[i * 4 + 3] = 255; }
  const stamp = (x: number, y: number, vx: number, vy: number, r: number) => {
    const x0 = Math.max(0, Math.floor(x - r)), x1 = Math.min(TW - 1, Math.ceil(x + r)), y0 = Math.max(0, Math.floor(y - r)), y1 = Math.min(TH - 1, Math.ceil(y + r));
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) {
      const d = Math.hypot(xx - x, yy - y) / r;
      if (d >= 1) continue;
      const w = (1 - d * d) * (1 - d * d), k = yy * TW + xx;
      fx[k] = Math.max(-1, Math.min(1, fx[k] + vx * w));
      fy[k] = Math.max(-1, Math.min(1, fy[k] + vy * w));
    }
  };
  let lx = -1, ly = -1, lastIn = -1e9;
  // The footer game: real smearing (not the idle finger) charges it; when full, the wordmark melts away.
  let energy = 0, melt = 0, melted = false;
  const feed = (k: number) => {
    if (!opt.onEnergy || energy >= 1) return;
    energy = Math.min(1, energy + k);
    opt.onEnergy(energy);
  };
  const onTap = (e: PointerEvent) => {
    if (!opt.onEnergy) return;
    const b = canvas.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * TW, y = ((e.clientY - b.top) / b.height) * TH;
    for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.28; stamp(x + Math.cos(a) * 6, y + Math.sin(a) * 6, Math.cos(a) * 0.8, Math.sin(a) * 0.8, 14); }
    feed(0.2);
    opt.onTap?.();
    lastIn = performance.now();
  };
  host.addEventListener("pointerdown", onTap);
  const onMove = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    if (e.clientY < b.top - 40 || e.clientY > b.bottom + 40) { lx = -1; return; }
    const x = ((e.clientX - b.left) / b.width) * TW, y = ((e.clientY - b.top) / b.height) * TH;
    if (lx >= 0) {
      stamp(x, y, (x - lx) * 0.1, (y - ly) * 0.22, e.pointerType === "mouse" ? 13 : 17);
      if (y > -4 && y < TH + 4) feed(Math.hypot(x - lx, (y - ly) * 2.5) / 620);
    }
    lx = x; ly = y;
    lastIn = performance.now();
  };
  addEventListener("pointermove", onMove, { passive: true });

  // Intro hand-off: the wordmark starts splashed outwards and settles.
  if (opt.splash) for (let i = 0; i < 9; i++) { const a = i * 0.7; stamp(TW * (0.1 + 0.1 * i), TH * (0.5 + 0.25 * Math.sin(a * 2)), Math.cos(a) * 0.9, Math.sin(a) * 0.9, 20); }

  let raf = 0, vis = false, t0 = performance.now(), gx = 0, gy = 0;
  const frame = (now: number) => {
    raf = 0;
    if (!vis) return;
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    if (now - lastIn > 2200) {
      // the invisible finger
      const x = TW * (0.5 + 0.46 * Math.sin(t * 0.55)), y = TH * (0.5 + 0.3 * Math.sin(t * 1.3 + 1));
      if (gx) stamp(x, y, (x - gx) * 0.16, (y - gy) * 0.3, 15);
      gx = x; gy = y;
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tT);
    for (let i = 0; i < TW * TH; i++) {
      fx[i] *= 0.955; fy[i] *= 0.955;
      img.data[i * 4] = 128 + fx[i] * 127;
      img.data[i * 4 + 1] = 128 - fy[i] * 127;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.uniform1f(uTime, t);
    if (energy >= 1 && melt < 1) {
      melt = Math.min(1, melt + 0.011);
      if (melt > 0.7 && !melted) { melted = true; opt.onMelted?.(); }
    }
    gl.uniform1f(uMelt, melt);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: "60px" });
  io.observe(host);
  const ro = new ResizeObserver(size);
  ro.observe(host);
  size();
  svgs.forEach((s) => (s.style.opacity = "0"));

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerdown", onTap);
    svgs.forEach((s) => (s.style.opacity = ""));
    canvas.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
