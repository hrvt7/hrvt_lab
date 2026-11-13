"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { mountResolve, type Palette, type Resolver, type Scene } from "./resolve";
import { sceneCode, sceneDesign, sceneForm, sceneName, sceneSearch, sceneSite } from "./scenes";

const NIGHT: Palette = { bg: "#222222", ink: "#f2f2ee", acc: "#89e900" };
const KIWI: Palette = { bg: "#89e900", ink: "#222222", acc: "#1a1a1a" };
const SCENES: Record<string, Scene> = { design: sceneDesign, code: sceneCode, search: sceneSearch, form: sceneForm };
const SPIN = ["[|]", "[/]", "[-]", "[\\]"];
const cellPx = (p: number) => Math.max(1, Math.round(20 * Math.pow(1 - p, 1.5) + 1 - 0.5 * p));

function track(name: string, props?: Record<string, string>) {
  const w = window as unknown as { va?: (e: string, p: object) => void; plausible?: (n: string, o?: object) => void; gtag?: (...a: unknown[]) => void };
  try {
    w.va?.("event", { name, ...props });
    w.plausible?.(name, { props });
    w.gtag?.("event", name, props);
  } catch {}
}

/** Orchestrates every interaction of the page. Renders nothing. */
export function Sig({ email, tel }: { email: string; tel: string }) {
  useEffect(() => {
    const w = window as unknown as { __hrvtReady?: boolean };
    if (!w.__hrvtReady) {
      w.__hrvtReady = true;
      window.dispatchEvent(new Event("hrvt:ready"));
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
    const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
    const resolvers: Resolver[] = [];
    const cleanups: (() => void)[] = [];

    // --- tracking: one delegated listener
    const onTrack = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (t) track(t.dataset.track!);
    };
    document.addEventListener("click", onTrack);
    cleanups.push(() => document.removeEventListener("click", onTrack));

    // --- device tilt (iOS asks for permission on a tap)
    const tiltBtn = $<HTMLButtonElement>("[data-sig-tilt]");
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    if (DOE?.requestPermission && matchMedia("(pointer: coarse)").matches && !reduced) {
      tiltBtn.hidden = false;
      tiltBtn.addEventListener("click", () => {
        DOE.requestPermission!()
          .then((r) => {
            if (r === "granted") window.dispatchEvent(new Event("sig:tilt"));
            tiltBtn.hidden = true;
          })
          .catch(() => (tiltBtn.hidden = true));
      });
    }

    // --- Pontmátrix-váltás: headings flip letter by letter from Doto to Funnel Display
    type Dot = { el: HTMLElement; chars: HTMLElement[]; n: number };
    const dots: Dot[] = [];
    const measure = (d: Dot) => {
      d.chars.forEach((c) => {
        c.classList.remove("is-raw");
        c.style.width = "";
      });
      const ws = d.chars.map((c) => c.getBoundingClientRect().width);
      d.chars.forEach((c, i) => {
        c.style.width = ws[i].toFixed(2) + "px";
        if (i >= d.n) c.classList.add("is-raw");
      });
    };
    if (!reduced) {
      $$("[data-dot]").forEach((el) => {
        const text = el.textContent!.trim().replace(/\s+/g, " ");
        el.setAttribute("aria-label", text);
        el.textContent = "";
        const chars: HTMLElement[] = [];
        text.split(" ").forEach((word, wi, arr) => {
          const ws = document.createElement("span");
          ws.className = "sig-w";
          ws.setAttribute("aria-hidden", "true");
          [...word].forEach((ch) => {
            const c = document.createElement("span");
            c.className = "sig-ch";
            c.textContent = ch;
            ws.appendChild(c);
            chars.push(c);
          });
          el.appendChild(ws);
          if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
        });
        dots.push({ el, chars, n: 0 });
      });
    }

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // --- hero: scroll sets the field's resolution
      const hero = $("[data-sig-hero]");
      const res = $("[data-sig-res]");
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          hero.dataset.sigP = s.progress.toFixed(4);
          const c0 = window.innerWidth < 760 ? 8 : 16;
          const px = Math.round(c0 - (c0 - 3) * Math.min(1, s.progress / 0.78));
          res.textContent = s.progress > 0.9 ? "éles" : `${px} px`;
        },
      });
      // mobile bar after the hero, hidden again over the contact form
      const bar = $("[data-sig-bar-m]");
      ScrollTrigger.create({
        trigger: "#szolgaltatasok",
        start: "top 60%",
        endTrigger: "#kapcsolat",
        end: "top 70%",
        onToggle: (s) => bar.classList.toggle("is-on", s.isActive),
      });

      // --- headings
      dots.forEach((d) => {
        ScrollTrigger.create({
          trigger: d.el,
          start: "top 88%",
          end: "top 42%",
          onUpdate: (s) => {
            const n = Math.round(s.progress * d.chars.length);
            if (n === d.n) return;
            const [a, b] = n > d.n ? [d.n, n] : [n, d.n];
            for (let i = a; i < b; i++) d.chars[i].classList.toggle("is-raw", n <= i);
            d.n = n;
          },
        });
      });

      // --- services: four code-drawn scenes
      const svcs = $$("[data-sig-svc]");
      const svcR = svcs.map((a) => {
        const cv = $<HTMLCanvasElement>("canvas", a);
        const r = mountResolve(cv, SCENES[cv.dataset.sigScene!], NIGHT, { animated: true });
        resolvers.push(r);
        return r;
      });
      let active = 0;
      const dial = $("[data-sig-dial]");
      const knob = $("[data-sig-dial-knob]");
      const dialVal = $("[data-sig-dial-val]");
      let scrollP = 0, manual: number | null = null, back: gsap.core.Tween | null = null;
      const showDial = (p: number) => {
        const px = cellPx(p);
        knob.style.transform = `rotate(${(-135 + p * 270).toFixed(1)}deg)`;
        dialVal.textContent = px <= 1 ? "éles" : `${px} px`;
        dial.setAttribute("aria-valuenow", String(px));
        dial.setAttribute("aria-valuetext", px <= 1 ? "éles kép" : `${px} képpontos cellák`);
      };
      const setManual = (v: number | null) => {
        manual = v;
        svcR[active].setManual(v);
        showDial(v ?? scrollP);
      };
      const release = () => {
        dial.dataset.state = "back";
        back?.kill();
        const o = { v: manual ?? scrollP };
        back = gsap.to(o, {
          v: scrollP,
          duration: 0.9,
          delay: 1.1,
          ease: "elastic.out(1,0.6)",
          onUpdate: () => setManual(Math.max(0, Math.min(1, o.v))),
          onComplete: () => {
            setManual(null);
            dial.dataset.state = "idle";
          },
        });
      };
      const dialAt = (e: PointerEvent) => {
        const r = dial.querySelector("svg")!.getBoundingClientRect();
        let a = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
        if (a > 180) a -= 360;
        setManual(Math.max(0, Math.min(1, (a + 135) / 270)));
      };
      dial.addEventListener("pointerdown", (e) => {
        back?.kill();
        dial.setPointerCapture(e.pointerId);
        dial.dataset.state = "held";
        dialAt(e);
      });
      dial.addEventListener("pointermove", (e) => dial.dataset.state === "held" && dialAt(e));
      dial.addEventListener("pointerup", release);
      dial.addEventListener("pointercancel", release);
      dial.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 0.08 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -0.08 : 0;
        if (!d) return;
        e.preventDefault();
        back?.kill();
        setManual(Math.max(0, Math.min(1, (manual ?? scrollP) + d)));
        release();
      });

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = $("[data-sig-stage]");
        const N = svcs.length;
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.95 * N}`,
          pin: true,
          onUpdate: (s) => {
            const f = Math.min(N - 0.0001, s.progress * N);
            const i = Math.floor(f);
            if (i !== active) {
              svcR[active].setManual(null);
              manual = null;
              back?.kill();
              dial.dataset.state = "idle";
              svcs[active].classList.remove("is-on");
              svcs[i].classList.add("is-on");
              active = i;
            }
            scrollP = Math.min(1, (f - i) / 0.62);
            svcR.forEach((r, k) => r.setP(k === i ? scrollP : k < i ? 1 : 0));
            if (manual == null) showDial(scrollP);
          },
        });
        return () => svcs.forEach((a, k) => a.classList.toggle("is-on", k === 0));
      });
      mm.add("(max-width: 899.98px) and (prefers-reduced-motion: no-preference)", () => {
        svcs.forEach((a, k) => {
          ScrollTrigger.create({
            trigger: a,
            start: "top 82%",
            end: "top 22%",
            onUpdate: (s) => svcR[k].setP(s.progress),
          });
        });
      });

      // --- kulcsrakészen: render queue + interlaced site
      const siteCv = $<HTMLCanvasElement>("[data-sig-site]");
      const site = mountResolve(siteCv, sceneSite, KIWI, { animated: true, state: { done: reduced ? 8 : 0 } });
      site.setP(1);
      resolvers.push(site);
      const jobs = $$("[data-sig-job]");
      const bars = jobs.map((j) => $("[data-sig-bar]", j));
      const spins = jobs.map((j) => $("[data-sig-spin]", j));
      let spinI = 0;
      const spinT = window.setInterval(() => {
        spinI = (spinI + 1) % 4;
        jobs.forEach((j, i) => j.dataset.state === "run" && (spins[i].textContent = SPIN[spinI]));
      }, 120);
      cleanups.push(() => clearInterval(spinT));
      const setJobs = (done: number) => {
        site.state.done = done;
        jobs.forEach((j, i) => {
          const k = Math.max(0, Math.min(1, done - i));
          const st = k >= 1 ? "done" : k > 0 ? "run" : "queued";
          if (j.dataset.state !== st) {
            j.dataset.state = st;
            if (st !== "run") spins[i].textContent = st === "done" ? "" : "[ ]";
          }
          const f = Math.round(k * 12);
          const bar = "█".repeat(f) + "░".repeat(12 - f);
          if (bars[i].textContent !== bar) bars[i].textContent = bar;
        });
      };
      if (reduced) setJobs(8);
      else
        ScrollTrigger.create({
          trigger: "[data-sig-jobs]",
          start: "top 72%",
          end: "bottom 62%",
          onUpdate: (s) => setJobs(s.progress * 8.02),
        });

      // --- folyamat: the signal line, noisy at the top, straight at the bottom
      const steps = $("[data-sig-steps]");
      const wave = $<HTMLCanvasElement>("[data-sig-wave]");
      const wx = wave.getContext("2d")!;
      const stepEls = $$("[data-sig-step]");
      let head = reduced ? 1 : 0, wW = 0, wH = 0, wVis = false;
      const wSize = () => {
        const r = wave.getBoundingClientRect();
        const d = Math.min(window.devicePixelRatio || 1, 2);
        wW = r.width;
        wH = r.height;
        wave.width = Math.round(wW * d);
        wave.height = Math.round(wH * d);
        wx.setTransform(d, 0, 0, d, 0, 0);
      };
      const wRo = new ResizeObserver(wSize);
      wRo.observe(wave);
      const wIo = new IntersectionObserver(([e]) => (wVis = e.isIntersecting));
      wIo.observe(wave);
      const n1 = (y: number, t: number) => Math.sin(y * 0.09 + t * 3.1) * 0.5 + Math.sin(y * 0.031 - t * 1.7) * 0.32 + Math.sin(y * 0.21 + t * 5.3) * 0.18;
      const wTick = (time: number) => {
        if (!wVis || !wW) return;
        const t = reduced ? 0 : time;
        const cx = wW / 2, hy = head * wH;
        wx.clearRect(0, 0, wW, wH);
        const xAt = (y: number) => {
          const amp = (wW / 2 - 6) * Math.pow(1 - y / wH, 1.7);
          return cx + n1(y, t) * amp;
        };
        // not yet reached: raster dots
        wx.fillStyle = "rgba(242,242,238,.42)";
        for (let y = Math.ceil(hy / 8) * 8; y < wH; y += 8) wx.fillRect(Math.round(xAt(y) / 4) * 4 - 1.5, y - 1.5, 3, 3);
        // reached: the clean kiwi line
        wx.strokeStyle = "#89e900";
        wx.lineWidth = 3;
        wx.beginPath();
        for (let y = 0; y <= hy; y += 3) (y ? wx.lineTo : wx.moveTo).call(wx, xAt(y), y);
        wx.stroke();
        wx.fillStyle = "#89e900";
        wx.fillRect(xAt(hy) - 6, hy - 6, 12, 12);
      };
      gsap.ticker.add(wTick);
      cleanups.push(() => {
        gsap.ticker.remove(wTick);
        wRo.disconnect();
        wIo.disconnect();
      });
      const markSteps = () => {
        const sr = steps.getBoundingClientRect();
        stepEls.forEach((li) => {
          const node = $(".sig-node", li).getBoundingClientRect();
          const at = (node.top + node.height / 2 - sr.top) / sr.height;
          li.dataset.state = head >= at ? "done" : head >= at - 0.08 ? "near" : "wait";
        });
      };
      if (reduced) markSteps();
      else
        ScrollTrigger.create({
          trigger: steps,
          start: "top 70%",
          end: "bottom 60%",
          onUpdate: (s) => {
            head = s.progress;
            markSteps();
          },
        });

      // --- kérdések: a noisy meter settles into a clean line while the answer decodes
      const meters = $$<HTMLCanvasElement>("[data-sig-meter]").map((cv, i) => ({ cv, x: cv.getContext("2d")!, p: reduced ? 1 : 0, shown: -1, seed: i * 7.3 }));
      const drawMeter = (m: (typeof meters)[number], t: number) => {
        const r = m.cv.getBoundingClientRect();
        if (!r.width) return;
        const d = Math.min(window.devicePixelRatio || 1, 2);
        if (m.cv.width !== Math.round(r.width * d)) {
          m.cv.width = Math.round(r.width * d);
          m.cv.height = Math.round(r.height * d);
        }
        m.x.setTransform(d, 0, 0, d, 0, 0);
        m.x.clearRect(0, 0, r.width, r.height);
        const n = Math.floor(r.width / 6), done = Math.floor(m.p * n), mid = r.height / 2;
        for (let k = 0; k < n; k++) {
          if (k < done) {
            m.x.fillStyle = "#89e900";
            m.x.fillRect(k * 6, mid - 2, 6, 4);
          } else {
            const a = Math.abs(Math.sin(k * 12.9898 + m.seed + Math.floor(t * 9) * 3.1)) * (mid - 2);
            m.x.fillStyle = "rgba(242,242,238,.6)";
            for (let y = -a; y <= a; y += 4) m.x.fillRect(k * 6 + 1, Math.round((mid + y) / 4) * 4, 3, 3);
          }
        }
      };
      const meterTick = (t: number) => meters.forEach((m) => { if (m.p < 1 || m.shown !== m.p) { drawMeter(m, m.p < 1 ? t : 0); m.shown = m.p; } });
      gsap.ticker.add(meterTick);
      cleanups.push(() => gsap.ticker.remove(meterTick));
      // the answer is always real text; a raster curtain slides off it as the row comes in
      if (!reduced)
        $$("[data-sig-decode]").forEach((dd, i) => {
          const row = dd.closest<HTMLElement>(".sig-qa-row")!;
          dd.style.setProperty("--k", "0");
          ScrollTrigger.create({
            trigger: row,
            start: "top 96%",
            end: "top 70%",
            onUpdate: (s) => {
              meters[i].p = s.progress;
              dd.style.setProperty("--k", s.progress.toFixed(3));
              row.toggleAttribute("data-done", s.progress > 0.98);
            },
          });
        });

      // --- kapcsolat: the typed business name becomes the background
      const nameCv = $<HTMLCanvasElement>("[data-sig-name]");
      const name = mountResolve(nameCv, sceneName, { bg: "#89e900", ink: "#222222", acc: "#222222" }, { state: { text: "A te céged" } });
      resolvers.push(name);
      const np = { v: 0.6 };
      name.setP(reduced ? 1 : np.v);
      const ins = { name: $<HTMLInputElement>('[data-sig-in="name"]'), biz: $<HTMLInputElement>('[data-sig-in="biz"]'), msg: $<HTMLTextAreaElement>('[data-sig-in="msg"]') };
      const mailA = $<HTMLAnchorElement>('[data-sig-send="mail"]'), smsA = $<HTMLAnchorElement>('[data-sig-send="sms"]');
      const note = $("[data-sig-note]");
      const compose = () => {
        const n = ins.name.value.trim(), b = ins.biz.value.trim(), m = ins.msg.value.trim();
        let body = "Szia!";
        if (n && b) body += ` ${n} vagyok, a vállalkozásom: ${b}.`;
        else if (n) body += ` ${n} vagyok.`;
        else if (b) body += ` A vállalkozásom: ${b}.`;
        body += m ? `\n\n${m}` : " Weboldalt szeretnék kérni.";
        mailA.href = `mailto:${email}?subject=${encodeURIComponent(b ? `Weboldal: ${b}` : "Weboldalt szeretnék")}&body=${encodeURIComponent(body)}`;
        smsA.href = `sms:${tel}?&body=${encodeURIComponent(body)}`;
      };
      const onBiz = () => {
        name.state.text = ins.biz.value.trim() || "A te céged";
        name.poke();
        if (reduced) return;
        gsap.killTweensOf(np);
        np.v = 0.08;
        gsap.to(np, { v: 0.6, duration: 0.7, ease: "power2.out", onUpdate: () => name.setP(np.v) });
      };
      Object.values(ins).forEach((i) => i.addEventListener("input", compose));
      ins.biz.addEventListener("input", onBiz);
      $("[data-sig-form]").addEventListener("submit", (e) => {
        e.preventDefault();
        mailA.click();
      });
      [mailA, smsA].forEach((a) =>
        a.addEventListener("click", () => {
          a.dataset.state = "sent";
          note.textContent = a === mailA ? "Megnyílt a leveleződ az előre megírt üzenettel. Ha nem, írj ide: " + email : "Megnyílt az üzenetküldőd az előre megírt szöveggel.";
          window.setTimeout(() => delete a.dataset.state, 2600);
        }),
      );
      compose();
    });

    // letter widths need the display face
    const fit = () => dots.forEach(measure);
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });
    let rz = 0, lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rz);
      rz = window.setTimeout(fit, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cleanups.forEach((f) => f());
      resolvers.forEach((r) => r.destroy());
      mm.revert();
      ctx.revert();
    };
  }, [email, tel]);

  return null;
}
