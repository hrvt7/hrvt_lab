/** Kiwi-folyadék: a small GPU fluid solver (velocity + dye) rendered as a lit, gooey liquid with a pool at the bottom. */
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
const H = `#version 300 es
precision highp float; precision highp sampler2D; in vec2 uv; out vec4 o;`;
const FS = {
  advect: `${H} uniform sampler2D uV,uS; uniform vec2 tx; uniform float dt,diss;
    void main(){ vec2 c = uv - dt*texture(uV,uv).xy*tx; o = texture(uS,c)/(1.+diss*dt); }`,
  div: `${H} uniform sampler2D uV; uniform vec2 tx;
    void main(){ float L=texture(uV,uv-vec2(tx.x,0.)).x, R=texture(uV,uv+vec2(tx.x,0.)).x, B=texture(uV,uv-vec2(0.,tx.y)).y, T=texture(uV,uv+vec2(0.,tx.y)).y;
      vec2 C=texture(uV,uv).xy; if(uv.x-tx.x<0.)L=-C.x; if(uv.x+tx.x>1.)R=-C.x; if(uv.y+tx.y>1.)T=-C.y; if(uv.y-tx.y<0.)B=-C.y; o=vec4(.5*(R-L+T-B),0.,0.,1.); }`,
  curl: `${H} uniform sampler2D uV; uniform vec2 tx;
    void main(){ float L=texture(uV,uv-vec2(tx.x,0.)).y, R=texture(uV,uv+vec2(tx.x,0.)).y, B=texture(uV,uv-vec2(0.,tx.y)).x, T=texture(uV,uv+vec2(0.,tx.y)).x; o=vec4(.5*(R-L-T+B),0.,0.,1.); }`,
  vort: `${H} uniform sampler2D uV,uC,uD; uniform vec2 tx; uniform float curl,dt,buoy,kick;
    void main(){ float L=texture(uC,uv-vec2(tx.x,0.)).x, R=texture(uC,uv+vec2(tx.x,0.)).x, B=texture(uC,uv-vec2(0.,tx.y)).x, T=texture(uC,uv+vec2(0.,tx.y)).x, C=texture(uC,uv).x;
      vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); f/=length(f)+1e-4; f*=curl*C; f.y*=-1.;
      float d=min(texture(uD,uv).x,1.5); vec2 v=texture(uV,uv).xy + f*dt + vec2(0.,(buoy*dt+kick)*d); o=vec4(clamp(v,-1000.,1000.),0.,1.); }`,
  pres: `${H} uniform sampler2D uP,uDv; uniform vec2 tx;
    void main(){ float L=texture(uP,uv-vec2(tx.x,0.)).x, R=texture(uP,uv+vec2(tx.x,0.)).x, B=texture(uP,uv-vec2(0.,tx.y)).x, T=texture(uP,uv+vec2(0.,tx.y)).x; o=vec4((L+R+B+T-texture(uDv,uv).x)*.25,0.,0.,1.); }`,
  grad: `${H} uniform sampler2D uP,uV; uniform vec2 tx;
    void main(){ float L=texture(uP,uv-vec2(tx.x,0.)).x, R=texture(uP,uv+vec2(tx.x,0.)).x, B=texture(uP,uv-vec2(0.,tx.y)).x, T=texture(uP,uv+vec2(0.,tx.y)).x; o=vec4(texture(uV,uv).xy-vec2(R-L,T-B),0.,1.); }`,
  splat: `${H} uniform sampler2D uT; uniform vec2 pt; uniform vec3 col; uniform float rad,asp;
    void main(){ vec2 d=uv-pt; d.x*=asp; o=vec4(texture(uT,uv).xyz+col*exp(-dot(d,d)/rad),1.); }`,
  clear: `${H} uniform sampler2D uT; uniform float k; void main(){ o=k*texture(uT,uv); }`,
  show: `${H} uniform sampler2D uD; uniform vec2 tx; uniform float t,level,amp,asp,cut;
    float fld(vec2 u){ float w = sin(u.x*asp*4.2+t*1.25)*.5 + sin(u.x*asp*8.3-t*1.9)*.28 + sin(u.x*asp*2.1+t*.6)*.7;
      float s = level + w*amp; float d = texture(uD,u).x*.4 + (texture(uD,u+vec2(tx.x,tx.y)*1.5).x+texture(uD,u-vec2(tx.x,tx.y)*1.5).x+texture(uD,u+vec2(tx.x,-tx.y)*1.5).x+texture(uD,u+vec2(-tx.x,tx.y)*1.5).x)*.15;
      return max(d,0.)*smoothstep(cut,cut-.07,u.y) + clamp((s-u.y)/.05+.5,0.,1.25); }
    void main(){ float f=fld(uv); float e=2.*max(tx.x,tx.y);
      vec2 g=vec2(fld(uv+vec2(e,0.))-fld(uv-vec2(e,0.)), fld(uv+vec2(0.,e))-fld(uv-vec2(0.,e)));
      float w=fwidth(f)*.9+.004, a=smoothstep(.5-w,.5+w,f);
      float edge=1.-smoothstep(.5,1.15,f); vec3 n=normalize(vec3(-g*1.6,1.)); vec3 L=normalize(vec3(-.45,.65,.6));
      float dif=dot(n,L); float sp=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),26.);
      vec3 kiwi=vec3(.537,.914,0.); vec3 c=kiwi*mix(1.,clamp(.66+.46*dif,.55,1.12),edge)+vec3(1.,1.,.85)*sp*edge*.7;
      o=vec4(clamp(c,0.,1.)*a,a); }`,
};

/** Software rasterisers (SwiftShader, llvmpipe) cannot run the solver in real time. */
export function isSoftGL(gl: WebGL2RenderingContext) {
  const e = gl.getExtension("WEBGL_debug_renderer_info");
  const r = String(e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  return /swiftshader|llvmpipe|software|basic render/i.test(r);
}

type FBO = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type DFBO = { read: FBO; write: FBO; swap(): void };

export type Fluid = {
  step(dt: number): void; render(t: number): void; resize(): void; destroy(): void;
  splat(x: number, y: number, dx: number, dy: number, amount: number, radius?: number): void;
  level: number; amp: number; kick: number; cut: number; soft: boolean;
};

export function createFluid(canvas: HTMLCanvasElement, lite: boolean, force = false): Fluid | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  if (isSoftGL(gl) && !force) return null; // no GPU: keep the plain hero, and skip the costly shader compile
  const SIM = lite ? 96 : 144, DYE = lite ? 224 : 320, ITER = lite ? 10 : 18;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader"); return s; };
  const vs = sh(gl.VERTEX_SHADER, VS);
  const prog = (fs: string) => {
    const p = gl.createProgram()!; gl.attachShader(p, vs); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p);
    const u: Record<string, WebGLUniformLocation> = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i)!.name; u[name] = gl.getUniformLocation(p, name)!; }
    return { p, u };
  };
  let P: Record<keyof typeof FS, ReturnType<typeof prog>>;
  try { P = Object.fromEntries(Object.entries(FS).map(([k, v]) => [k, prog(v)])) as typeof P; } catch { return null; }
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const fbo = (w: number, h: number, filter: number): FBO => {
    const tex = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const f = gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo: f, w, h };
  };
  const dbl = (w: number, h: number, filter: number): DFBO => { let a = fbo(w, h, filter), b = fbo(w, h, filter); return { get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; } }; };
  let vel: DFBO, dye: DFBO, pres: DFBO, dv: FBO, cu: FBO, asp = 1;
  const alloc = () => {
    asp = canvas.width / Math.max(1, canvas.height);
    const dims = (r: number): [number, number] => (asp >= 1 ? [Math.round(r * asp), r] : [r, Math.round(r / asp)]);
    const [sw, shh] = dims(SIM), [dw, dh] = dims(DYE);
    vel = dbl(sw, shh, gl.LINEAR); dye = dbl(dw, dh, gl.LINEAR); pres = dbl(sw, shh, gl.NEAREST); dv = fbo(sw, shh, gl.NEAREST); cu = fbo(sw, shh, gl.NEAREST);
  };
  alloc();
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
  const bind = (t: WebGLTexture, unit: number) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); return unit; };
  const draw = (target: FBO | null) => {
    if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.w, target.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  gl.disable(gl.BLEND);
  const api: Fluid = {
    level: 0.05, amp: 0.012, kick: 0, cut: 2, soft: isSoftGL(gl),
    splat(x, y, dx, dy, amount, radius = 0.0022) {
      const s = P.splat; gl.useProgram(s.p); gl.uniform1f(s.u.asp, asp); gl.uniform2f(s.u.pt, x, y);
      gl.uniform1i(s.u.uT, bind(vel.read.tex, 0)); gl.uniform3f(s.u.col, dx, dy, 0); gl.uniform1f(s.u.rad, radius); draw(vel.write); vel.swap();
      gl.uniform1i(s.u.uT, bind(dye.read.tex, 0)); gl.uniform3f(s.u.col, amount, 0, 0); gl.uniform1f(s.u.rad, radius * 0.9); draw(dye.write); dye.swap();
    },
    step(dt) {
      const tx = [1 / vel.read.w, 1 / vel.read.h] as const;
      let s = P.curl; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1i(s.u.uV, bind(vel.read.tex, 0)); draw(cu);
      s = P.vort; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1i(s.u.uV, bind(vel.read.tex, 0)); gl.uniform1i(s.u.uC, bind(cu.tex, 1)); gl.uniform1i(s.u.uD, bind(dye.read.tex, 2));
      gl.uniform1f(s.u.curl, 3); gl.uniform1f(s.u.dt, dt); gl.uniform1f(s.u.buoy, 26); gl.uniform1f(s.u.kick, api.kick); draw(vel.write); vel.swap(); api.kick = 0;
      s = P.div; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1i(s.u.uV, bind(vel.read.tex, 0)); draw(dv);
      s = P.clear; gl.useProgram(s.p); gl.uniform1i(s.u.uT, bind(pres.read.tex, 0)); gl.uniform1f(s.u.k, 0.8); draw(pres.write); pres.swap();
      s = P.pres; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1i(s.u.uDv, bind(dv.tex, 1));
      for (let i = 0; i < ITER; i++) { gl.uniform1i(s.u.uP, bind(pres.read.tex, 0)); draw(pres.write); pres.swap(); }
      s = P.grad; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1i(s.u.uP, bind(pres.read.tex, 0)); gl.uniform1i(s.u.uV, bind(vel.read.tex, 1)); draw(vel.write); vel.swap();
      s = P.advect; gl.useProgram(s.p); gl.uniform2f(s.u.tx, ...tx); gl.uniform1f(s.u.dt, dt);
      gl.uniform1i(s.u.uV, bind(vel.read.tex, 0)); gl.uniform1i(s.u.uS, 0); gl.uniform1f(s.u.diss, 1.1); draw(vel.write); vel.swap();
      gl.uniform1i(s.u.uV, bind(vel.read.tex, 0)); gl.uniform1i(s.u.uS, bind(dye.read.tex, 1)); gl.uniform1f(s.u.diss, 0.42); draw(dye.write); dye.swap();
    },
    render(t) {
      const s = P.show; gl.useProgram(s.p); gl.uniform1i(s.u.uD, bind(dye.read.tex, 0)); gl.uniform2f(s.u.tx, 1 / dye.read.w, 1 / dye.read.h);
      gl.uniform1f(s.u.t, t); gl.uniform1f(s.u.level, api.level); gl.uniform1f(s.u.amp, api.amp); gl.uniform1f(s.u.cut, api.cut); gl.uniform1f(s.u.asp, asp);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    resize() { alloc(); },
    destroy() { gl.getExtension("WEBGL_lose_context")?.loseContext(); },
  };
  return api;
}

/** Analytic liquid edge for section boundaries: "drip" hangs from the top, "surface" rises from the bottom. */
const EDGE = `#version 300 es
precision highp float; in vec2 uv; out vec4 o; uniform float t,asp,slosh,mode,px;
float h(float n){ return fract(sin(n*91.7)*4375.5); }
float fld(vec2 u){ float x=u.x*asp;
  if(mode<.5){ // drips hanging from the top edge
    float w=sin(x*3.1+t*.9)*.5+sin(x*6.7-t*1.4)*.3; float f=clamp((u.y-(.80-w*.035-slosh*.1))/.09+.5,0.,1.3);
    float n=floor(asp*3.2)+2.; for(float i=0.;i<12.;i++){ if(i>=n) break; float cx=(i+.5+ (h(i)-.5)*.7)/n*asp; float ph=fract(t*(.09+.07*h(i+7.))+h(i+3.));
      float len=.18+.5*smoothstep(0.,.7,ph)*(.5+.5*h(i+11.))+slosh*.25; float r=.035+.03*h(i+5.);
      float y=clamp(u.y,.82-len,1.); vec2 d=vec2(x-cx,(u.y-y)); float taper=mix(.55,1.,smoothstep(.82-len,.9,u.y)); f+=smoothstep(r*taper*1.9,r*taper*.35,length(d))*.9;
      float fall=max(ph-.7,0.)/.3; vec2 b=vec2(cx,.82-len-fall*fall*1.1); f+=smoothstep(r*1.5,r*.3,length(vec2(x,u.y)-b))*step(.7,ph)*(1.-fall*.5); }
    return f; }
  float w=sin(x*2.6+t*1.1)*.55+sin(x*5.9-t*1.7)*.3+sin(x*11.+t*2.3)*.12; float s=.34+w*(.05+slosh*.16);
  float f=clamp((s-u.y)/.09+.5,0.,1.3);
  for(float i=0.;i<5.;i++){ float ph=fract(t*(.16+.1*h(i))+h(i+2.)); float cx=h(i+9.+floor(t*(.16+.1*h(i))+h(i+2.)))*asp; float y=s-.05+sin(ph*3.1416)*(.3+.3*h(i+4.)+slosh*.4); float r=.05+.05*h(i+6.);
    f+=smoothstep(r*1.6,r*.25,length(vec2(x-cx,u.y-y))); }
  return f; }
void main(){ float f=fld(uv); float e=px*2.; vec2 g=vec2(fld(uv+vec2(e/asp,0.))-fld(uv-vec2(e/asp,0.)),fld(uv+vec2(0.,e))-fld(uv-vec2(0.,e)));
  float w=fwidth(f)*.9+.004,a=smoothstep(.5-w,.5+w,f); float edge=1.-smoothstep(.5,1.1,f); vec3 n=normalize(vec3(-g*1.3,1.)); vec3 L=normalize(vec3(-.45,.65,.6));
  float sp=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),26.); vec3 c=vec3(.537,.914,0.)*mix(1.,clamp(.66+.46*dot(n,L),.55,1.12),edge)+vec3(1.,1.,.85)*sp*edge*.7; o=vec4(clamp(c,0.,1.)*a,a); }`;

export function createEdge(canvas: HTMLCanvasElement, mode: "drip" | "surface", force = false) {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl || (isSoftGL(gl) && !force)) return null;
  const mk = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const p = gl.createProgram()!; gl.attachShader(p, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, EDGE)); gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(p, n);
  const ut = u("t"), ua = u("asp"), us = u("slosh"), um = u("mode"), up = u("px");
  return {
    soft: isSoftGL(gl),
    render(t: number, slosh: number) {
      gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform1f(ut, t); gl.uniform1f(ua, canvas.width / canvas.height); gl.uniform1f(us, slosh); gl.uniform1f(um, mode === "drip" ? 0 : 1); gl.uniform1f(up, 1 / canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() { gl.getExtension("WEBGL_lose_context")?.loseContext(); },
  };
}
