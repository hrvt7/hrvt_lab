"use client";

import { useEffect, useRef } from "react";
import { prefersReduced } from "@/lib/gsap";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Domain-warped fbm "molten light through smoke", lit from a point that drifts toward the pointer.
const FRAG = `
precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uFade;uniform float uIntro;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float asp=uRes.x/uRes.y;
  float t=uTime*.035;
  vec2 m=(uMouse-.5)*vec2(asp,1.);
  vec2 q=vec2(fbm(p*1.3+vec2(0.,t)),fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.5+3.4*q+vec2(1.7,9.2)+t*1.6+m*.22),fbm(p*1.5+3.4*q+vec2(8.3,2.8)-t*1.2));
  float f=fbm(p*1.15+3.1*r);
  vec2 L=vec2(asp*.24,.06)+m*.16;
  float d=length((p-L)*vec2(.8,1.15));
  float glow=exp(-d*(3.2-uIntro*1.55));
  float body=smoothstep(.2,.92,f)*glow*uIntro*1.25;
  vec3 col=vec3(.031,.031,.027);
  col+=vec3(.42,.11,.025)*body*1.5;
  col+=vec3(1.,.35,.11)*pow(body,2.4)*1.7;
  col+=vec3(1.,.87,.74)*pow(body,5.5)*1.5;
  float streak=exp(-abs(p.y-L.y)*34.)*exp(-abs(p.x-L.x)*1.1)*.2*uIntro;
  col+=vec3(1.,.42,.16)*streak;
  col*=smoothstep(1.55,.15,length(p*vec2(.75,1.)));
  col*=uFade;
  col+=(hash(gl_FragCoord.xy+fract(uTime*7.)*100.)-.5)*.04;
  gl_FragColor=vec4(col,1.);
}`;

export function HeroShader({ fadeRef }: { fadeRef?: React.MutableRefObject<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

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
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uFade = gl.getUniformLocation(prog, "uFade");
    const uIntro = gl.getUniformLocation(prog, "uIntro");

    const reduced = prefersReduced();
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const scale = mobile ? 0.45 : 0.55;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      c.width = Math.max(1, Math.floor(c.clientWidth * dpr * scale));
      c.height = Math.max(1, Math.floor(c.clientHeight * dpr * scale));
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const mouse = { x: 0.62, y: 0.5, tx: 0.62, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const start = performance.now();
    let intro = reduced ? 1 : 0;
    let readyAt = 0;
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const ready = (window as unknown as { __hrvtReady?: boolean }).__hrvtReady;
      if (ready && !reduced) {
        if (!readyAt) readyAt = now;
        const k = Math.min(1, (now - readyAt) / 2600);
        intro = 1 - Math.pow(1 - k, 3);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000 + 12);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFade, fadeRef ? fadeRef.current : 1);
      gl.uniform1f(uIntro, intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [fadeRef]);

  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />;
}
