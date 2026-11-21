"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, onReady, prefersReduced } from "@/lib/gsap";
import { Hero } from "./Hero";
import { CALL, DISCOVERY, EMAIL, INSTAGRAM, PHONE, PHONE_TEL, WHATSAPP, FAQ, GET, PRICES, SECTIONS, SERVICES, STEPS, WHO, WHY, WORK, tc } from "./data";

const KF = [150, 450, 750, 1050], KY = [300, 220, 128, 60];
const CURVE = "M0 318C60 318 90 300 150 300C260 300 330 232 450 220C570 208 640 140 750 128C870 115 930 60 1050 60C1110 60 1150 48 1200 40";

/** Splits a heading into words that sit in fixed-width boxes, so the width axis can animate without re-wrapping the line. */
function splitKin(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = "1";
  const walk = (n: Node) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      (n.textContent || "").split(/(\s+)/).forEach((p) => {
        if (!p.trim()) return void f.appendChild(document.createTextNode(p));
        const o = document.createElement("span"), i = document.createElement("span");
        o.className = "kw"; i.className = "kwi"; i.textContent = p; o.appendChild(i); f.appendChild(o);
      });
      n.parentNode!.replaceChild(f, n);
    } else if (n.nodeType === 1) [...n.childNodes].forEach(walk);
  };
  [...el.childNodes].forEach(walk);
}
function sizeKin(root: HTMLElement) {
  const ws = [...root.querySelectorAll<HTMLElement>(".kw")];
  ws.forEach((w) => { w.style.width = ""; w.classList.add("m"); });
  const m = ws.map((w) => w.getBoundingClientRect().width);
  ws.forEach((w, i) => { w.style.width = `${Math.ceil(m[i] + 0.5)}px`; w.classList.remove("m"); });
}

export function Site() {
  const root = useRef<HTMLDivElement>(null);
  const [faq, setFaq] = useState(0);
  const [sound, setSound] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current!, reduced = prefersReduced(), mobile = matchMedia("(max-width: 820px)").matches;
    const kins = [...el.querySelectorAll<HTMLElement>(".kin")];
    kins.forEach(splitKin);
    const measure = () => sizeKin(el);
    measure(); document.fonts?.ready.then(measure);
    let rw = innerWidth; const onResize = () => { if (innerWidth !== rw) { rw = innerWidth; measure(); } };
    addEventListener("resize", onResize);

    // work videos: play only while on screen
    const vids = [...el.querySelectorAll<HTMLVideoElement>(".work video")];
    const vio = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) { if (!v.src) v.src = `/motion/${v.dataset.id}${mobile ? "-m" : ""}.mp4`; if (!reduced || !v.muted) v.play().catch(() => {}); }
      else { v.pause(); if (!v.muted) { v.muted = true; setSound(null); } }
    }), { threshold: 0.35 });
    vids.forEach((v) => vio.observe(v));

    let ctx: gsap.Context | null = null;
    const off = onReady(() => {
      ctx = gsap.context(() => {
        const tcEl = el.querySelector<HTMLElement>(".nav-tc")!, bar = el.querySelector<HTMLElement>(".scrub")!;
        const segs = [...el.querySelectorAll<HTMLElement>(".scrub a")];
        // the bottom strip is the page as a timeline: one clip per section, the playhead sits where you are inside it
        const secs = SECTIONS.map(([id]) => document.getElementById(id)!);
        let tops: number[] = [], now = -1;
        const readTops = () => { tops = secs.map((n) => n.getBoundingClientRect().top + scrollY); tops.push(document.documentElement.scrollHeight); };
        readTops(); ScrollTrigger.addEventListener("refresh", readTops);
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
          const y = s.scroll() + innerHeight * 0.45; let i = 0;
          while (i < secs.length - 1 && y >= tops[i + 1]) i++;
          const local = Math.max(0, Math.min(1, (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i])));
          tcEl.textContent = tc(s.progress * 60); bar.style.setProperty("--sp", (mobile ? s.progress : (i + local) / secs.length).toFixed(4));
          bar.classList.toggle("on", s.scroll() > innerHeight * 0.7);
          if (i !== now) { now = i; segs.forEach((a, k) => a.classList.toggle("now", k === i)); }
        } });

        // generic "this block is on stage" switch; the CSS of each section decides what that means
        gsap.utils.toArray<HTMLElement>("[data-in]").forEach((n) => ScrollTrigger.create({ trigger: n, start: "top 84%", once: true, onEnter: () => n.classList.add("in") }));

        // kinetic headings: every word opens from condensed to its real width
        kins.forEach((k) => {
          const ws = k.querySelectorAll(".kwi");
          if (reduced) return void gsap.set(ws, { "--wd": 1, opacity: 1 });
          const hero = !!k.closest(".hero");
          gsap.fromTo(ws, { "--wd": 0, opacity: 0 }, { "--wd": 1, opacity: 1, duration: 1.15, ease: "expo.out", stagger: hero ? 0.045 : 0.05, delay: hero ? 0.15 : 0,
            scrollTrigger: hero ? undefined : { trigger: k, start: "top 86%" } });
        });

        // who: each line you scroll past switches one more part of the flat screenshot on
        const who = el.querySelector<HTMLElement>(".who")!;
        gsap.utils.toArray<HTMLElement>(".who-li").forEach((li, i) => ScrollTrigger.create({ trigger: li, start: mobile ? "top 72%" : "top 62%",
          onEnter: () => { who.classList.add(`on${i + 1}`); li.classList.add("lit"); }, onLeaveBack: () => { who.classList.remove(`on${i + 1}`); li.classList.remove("lit"); } }));

        // work: the frame opens from a timeline clip to the full picture
        if (!reduced) gsap.utils.toArray<HTMLElement>(".work").forEach((w) => {
          gsap.fromTo(w.querySelector(".work-frame"), { clipPath: "inset(16% 12% 16% 12% round 22px)", scale: 0.94 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", scale: 1, ease: "none",
            scrollTrigger: { trigger: w, start: "top 92%", end: "top 28%", scrub: 0.5 } });
          gsap.fromTo(w.querySelector(".work-name"), { xPercent: -6 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: w, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });

        // process: the scroll draws the curve and carries the value across its keyframes
        const pr = el.querySelector<HTMLElement>(".process")!, path = pr.querySelector<SVGPathElement>(".curve")!, dot = pr.querySelector<HTMLElement>(".pdot")!, graph = pr.querySelector<SVGSVGElement>(".graph")!;
        const len = path.getTotalLength(), stepEls = [...pr.querySelectorAll<HTMLElement>(".step")], kfs = [...pr.querySelectorAll<HTMLElement>(".kfs i")];
        const mask = pr.querySelector<SVGRectElement>("#mo-curve-clip rect")!;
        const setP = (p: number) => {
          const pt = path.getPointAtLength(len * p); mask.setAttribute("width", String(pt.x)); dot.style.left = `${pt.x / 12}%`; dot.style.top = `${(pt.y / 360) * graph.clientHeight}px`;
          pr.style.setProperty("--pp", p.toFixed(4));
          KF.forEach((x, i) => { const on = pt.x >= x - 2; stepEls[i].classList.toggle("on", on); kfs[i].classList.toggle("on", on); });
        };
        if (reduced) setP(1); else { setP(0); ScrollTrigger.create({ trigger: pr.querySelector(".graph-wrap"), start: "top 78%", end: "bottom 45%", scrub: 0.6, onUpdate: (s) => setP(s.progress) }); }

        // why: the render queue
        gsap.utils.toArray<HTMLElement>(".job").forEach((j, i) => {
          const pct = j.querySelector<HTMLElement>(".job-pct")!, o = { v: 0 };
          const done = () => { j.classList.add("done"); pct.textContent = "Done"; };
          if (reduced) { j.style.setProperty("--jp", "1"); return done(); }
          ScrollTrigger.create({ trigger: j, start: "top 86%", once: true, onEnter: () => {
            j.classList.add("run");
            gsap.to(o, { v: 100, duration: 1.1 + i * 0.12, delay: i * 0.08, ease: "power2.inOut", onUpdate: () => { pct.textContent = `${Math.round(o.v)}%`; j.style.setProperty("--jp", (o.v / 100).toFixed(3)); }, onComplete: done });
          } });
        });
      }, el);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // pricing: a playhead follows the cursor across the three clips
    const pt = el.querySelector<HTMLElement>(".price-tl")!, ptc = pt.querySelector<HTMLElement>(".price-ph span")!;
    const pm = (e: PointerEvent) => { const r = pt.getBoundingClientRect(), x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); pt.style.setProperty("--mx", x.toFixed(4)); ptc.textContent = tc(x * 60).slice(0, 5); };
    pt.addEventListener("pointermove", pm);

    return () => { off(); ctx?.revert(); vio.disconnect(); removeEventListener("resize", onResize); pt.removeEventListener("pointermove", pm); };
  }, []);

  const toggleSound = (id: string) => {
    const vids = [...root.current!.querySelectorAll<HTMLVideoElement>(".work video")];
    vids.forEach((v) => { const me = v.dataset.id === id, on = me && sound !== id; v.muted = !on; if (on) { v.currentTime = 0; v.play().catch(() => {}); } });
    setSound(sound === id ? null : id);
  };

  return (
    <div className="mo" ref={root} lang="en">
      <nav className="nav" aria-label="Main">
        <a href="#top" className="nav-logo" aria-label="HRVT — SaaS motion design"><i aria-hidden /><span>Motion</span></a>
        <div className="nav-links">
          <a href="#work">Work</a><a href="#services">Services</a><a href="#process">Process</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
        </div>
        <span className="nav-tc mono" aria-hidden>00:00:00</span>
        <a href={CALL} className="nav-cta" data-track="call_nav">Book a call</a>
      </nav>

      <main>
        <Hero />

        {/* 02 — What I do: the services are layers in a comp, each with its own little loop */}
        <section className="sec services" id="services">
          <div className="sec-head">
            <p className="tag"><i />What I do</p>
            <h2 className="h2 kin">I specialize in polished, modern motion design for <em>SaaS.</em></h2>
          </div>
          <ol className="layers">
            {SERVICES.map((s, i) => (
              <li className="layer" key={s.k} data-in style={{ ["--i" as string]: i }}>
                <span className="layer-n mono">L{i + 1}</span>
                <h3 className="layer-name">{s.name}{"note" in s && <small> ({s.note})</small>}</h3>
                <div className="layer-bar" aria-hidden><div className={`loop loop-${s.k}`}><i /><i /><i /><i /></div></div>
              </li>
            ))}
          </ol>
          <div className="get" data-in>
            <p className="get-t mono">What you get</p>
            <ul>{GET.map((g, i) => <li key={i} style={{ ["--i" as string]: i }}><b aria-hidden />{g}</li>)}</ul>
          </div>
        </section>

        {/* 03 — Who this is for: a flat screenshot that comes alive line by line */}
        <section className="sec who" id="for">
          <div className="who-stage">
            <div className="shot" aria-hidden>
              <div className="shot-bar"><i /><i /><i /><span className="mono f-png">screenshot.png</span><span className="mono f-mp4">product-video.mp4</span></div>
              <div className="shot-body">
                <div className="shot-side"><i /><i /><i /><i /></div>
                <div className="shot-main">
                  <div className="tiles"><i /><i /><i /></div>
                  <div className="chart">{[0.35, 0.55, 0.42, 0.7, 0.62, 0.86, 1].map((h, i) => <i key={i} style={{ ["--h" as string]: h, ["--i" as string]: i }} />)}</div>
                  <div className="rows"><i /><i /><i /></div>
                </div>
                <div className="call mono">AI draft ready</div>
                <svg className="cur" viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l15 9-7 1.6L9.5 20z" fill="currentColor" /></svg>
              </div>
              <div className="shot-tl"><i /></div>
            </div>
          </div>
          <div className="who-copy">
            <p className="tag"><i />Who this is for</p>
            <h2 className="h2 kin">I work best <em>with:</em></h2>
            <ul className="who-list">{WHO.map((w, i) => <li className="who-li" key={i}><span className="mono">0{i + 1}</span>{w}</li>)}</ul>
            <p className="who-end" data-fade>If your product involves complex workflows, AI features, dashboards, or multi-step processes — <b>this is exactly what I do.</b></p>
          </div>
        </section>

        {/* 04 — Selected work: each piece takes over the page in its own colours */}
        <div id="work">
          <div className="sec work-head"><p className="tag"><i />Selected work</p><h2 className="h2 kin">Three products, thirty seconds <em>each.</em></h2></div>
          {WORK.map((w, i) => (
            <section className="work" key={w.id} style={{ ["--bg" as string]: w.bg, ["--ink" as string]: w.ink, ["--acc" as string]: w.acc }}>
              <p className="work-name" aria-hidden>{w.name}</p>
              <div className="work-frame">
                <video data-id={w.id} muted loop playsInline preload="none" poster={`/motion/${w.id}.webp`} aria-label={`${w.name} — ${w.len} ${w.what}`} />
              </div>
              <div className="work-meta">
                <span className="mono">0{i + 1} / 03</span>
                <h3>{w.name} <span>— {w.len} {w.what}</span></h3>
                <button type="button" className="snd" onClick={() => toggleSound(w.id)} aria-pressed={sound === w.id}>
                  <i aria-hidden />{sound === w.id ? "Mute" : "Play with sound"}
                </button>
              </div>
            </section>
          ))}
        </div>

        {/* 05 — How it works: four keyframes on one easing curve */}
        <section className="sec process" id="process">
          <div className="sec-head"><p className="tag"><i />How it works</p><h2 className="h2 kin">Four keyframes from first call to final <em>file.</em></h2></div>
          <div className="graph-wrap">
            <svg className="graph" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden>
              {[60, 128, 220, 300].map((y) => <line key={y} x1="0" x2="1200" y1={y} y2={y} className="gl" />)}
              {KF.map((x, i) => <line key={x} x1={x} x2={x} y1={KY[i]} y2="360" className="stem" />)}
              <clipPath id="mo-curve-clip"><rect x="0" y="0" width="0" height="360" /></clipPath>
              <path d={CURVE} className="curve-bg" /><path d={CURVE} className="curve" clipPath="url(#mo-curve-clip)" />
            </svg>
            <div className="kfs" aria-hidden>{KF.map((x, i) => <i key={x} style={{ left: `${x / 12}%`, top: `calc(${KY[i] / 360} * var(--gh))` }} />)}</div>
            <i className="pdot" aria-hidden />
            <ol className="steps">
              {STEPS.map(([t, d], i) => <li className="step" key={t}><span className="mono">{i + 1}. {["Day 0", "Concept", "Animation", "Final"][i]}</span><h3>{t}</h3><p>{d}</p></li>)}
            </ol>
          </div>
          <p className="turn" data-in><span className="mono">Duration</span><b>Typical turnaround: 10–18 days</b> depending on complexity.</p>
        </section>

        {/* 06 — Why work with me: a render queue */}
        <section className="sec why" id="why">
          <div className="sec-head"><p className="tag"><i />Why work with me</p><h2 className="h2 kin">Five reasons, rendered in <em>order.</em></h2></div>
          <ul className="queue">
            {WHY.map((w, i) => (
              <li className="job" key={i}><span className="job-n mono">{String(i + 1).padStart(2, "0")}</span><p>{w}</p><span className="job-pct mono">Queued</span><i className="job-bar" aria-hidden /></li>
            ))}
          </ul>
        </section>

        {/* 07 — Pricing: clips on a 60-second timeline, drawn to scale */}
        <section className="sec pricing" id="pricing">
          <div className="sec-head"><p className="tag"><i />Pricing</p><h2 className="h2 kin">Priced by the <em>second.</em> Quoted up front.</h2></div>
          <div className="price-tl">
            <div className="price-ruler mono" aria-hidden>{[0, 15, 30, 45, 60].map((s) => <span key={s} style={{ left: `${(s / 60) * 100}%` }}>{s}s</span>)}</div>
            <div className="price-ph" aria-hidden><span className="mono">00:00</span></div>
            {PRICES.map((p, i) => (
              <article className="price" key={p.name} data-in style={{ ["--w" as string]: `${(p.span / 60) * 100}%`, ["--i" as string]: i }}>
                <div className="price-clip" aria-hidden>{Array.from({ length: p.cuts }, (_, k) => <i key={k} />)}</div>
                <div className="price-txt">
                  <h3>{p.name}{"sub" in p && <small> ({p.sub})</small>}</h3>
                  <p><span>{p.from}</span> <b>{p.price}</b></p>
                </div>
              </article>
            ))}
          </div>
          <p className="price-note" data-fade>Final price depends on complexity, number of scenes, and revision rounds. <b>Every project starts with a clear fixed quote.</b></p>
        </section>

        {/* 08 — FAQ: markers on a strip; each one opens its note */}
        <section className="sec faq" id="faq">
          <div className="sec-head"><p className="tag"><i />FAQ</p><h2 className="h2 kin">Notes left on the <em>timeline.</em></h2></div>
          <div className="marks" role="tablist" aria-label="Questions" style={{ ["--f" as string]: faq }}>
            {FAQ.map(([q], i) => (
              <button key={q} role="tab" id={`fq${i}`} aria-selected={faq === i} aria-controls={`fa${i}`} tabIndex={faq === i ? 0 : -1} className="mark" onClick={() => setFaq(i)}
                onKeyDown={(e) => { const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return; e.preventDefault(); const n = (i + d + FAQ.length) % FAQ.length; setFaq(n); document.getElementById(`fq${n}`)?.focus(); }}>
                <i aria-hidden /><span className="mono">M{i + 1}</span><b>{q}</b>
              </button>
            ))}
          </div>
          {FAQ.map(([q, a], i) => (
            <div key={q} role="tabpanel" id={`fa${i}`} aria-labelledby={`fq${i}`} hidden={faq !== i} className="note">
              <span className="mono">Marker {i + 1} of {FAQ.length}</span><h3>{q}</h3><p>{a}</p>
            </div>
          ))}
        </section>

        {/* 09 — Final CTA: the end of the timeline */}
        <section className="sec end" id="contact">
          <p className="tag"><i />Out point</p>
          <h2 className="h-end kin">Ready to make your product easier to <em>understand?</em></h2>
          <p className="lede">Let’s create a video that clearly shows what your product does — and why it matters.</p>
          <a className="btn btn-main btn-big" href={DISCOVERY} data-track="call_end"><span>Book a free discovery call</span><b aria-hidden>→</b></a>
          <a className="btn btn-ghost btn-big" href={WHATSAPP} target="_blank" rel="noopener" data-track="whatsapp"><span>Message me on WhatsApp</span></a>
          <p className="end-mail">Or email me at <a href={`mailto:${EMAIL}`} data-track="email">{EMAIL}</a> · <a href={`tel:${PHONE_TEL}`} data-track="call_phone">{PHONE}</a></p>
        </section>
      </main>

      <footer className="foot">
        <p className="foot-name"><b>HRVT</b> — SaaS Motion Design</p>
        <p>High-quality product videos for modern software companies.</p>
        <p className="foot-links"><a href={INSTAGRAM} target="_blank" rel="noopener" data-track="instagram">Instagram</a><a href={WHATSAPP} target="_blank" rel="noopener" data-track="whatsapp">WhatsApp</a><a href={`mailto:${EMAIL}`} data-track="email">Email</a><a href={`tel:${PHONE_TEL}`}>{PHONE}</a><a href="/foto">Photography</a></p>
      </footer>

      <div className="scrub">
        <div className="scrub-tl">
          {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`}><span>{label}</span></a>)}
          <i className="scrub-ph" aria-hidden />
        </div>
        <a href={WHATSAPP} target="_blank" rel="noopener" className="scrub-wa" data-track="whatsapp_bar">WhatsApp</a>
        <a href={CALL} className="scrub-cta" data-track="call_bar">Book a free 15-min call</a>
      </div>
    </div>
  );
}
