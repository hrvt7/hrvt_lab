"use client";

import { useEffect } from "react";
import { prefersReduced, scrollToHash } from "@/lib/gsap";

type Tracker = { va?: (e: string, p: object) => void; gtag?: (...a: unknown[]) => void; plausible?: (n: string, o?: object) => void };

/** Sends a conversion event to whichever analytics tool is present; silent when none is. */
export function track(name: string, props: Record<string, string | number> = {}) {
  const w = window as unknown as Tracker;
  w.va?.("event", { name, ...props });
  w.gtag?.("event", name, props);
  w.plausible?.(name, { props });
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The page's quiet machinery: which service is on stage, how far the sideways walk has gone,
 * the reading-progress hairline, nav tone, the mobile bar and click tracking. No canvas.
 */
export function Stage() {
  useEffect(() => {
    const root = document.documentElement;
    const w = window as unknown as { __hrvtReady?: boolean; __ready?: boolean };
    if (!w.__hrvtReady) {
      w.__hrvtReady = true;
      window.dispatchEvent(new Event("hrvt:ready"));
    }
    const reduced = prefersReduced();
    const stage = document.querySelector<HTMLElement>("[data-l-stage]");
    const items = stage ? [...stage.querySelectorAll<HTMLElement>("[data-l-item]")] : [];
    const idx = stage ? [...stage.querySelectorAll<HTMLElement>("[data-l-idx]")] : [];
    const odo = stage?.querySelector<HTMLElement>("[data-l-odo]");
    const walk = document.querySelector<HTMLElement>("[data-l-walk]");
    const trackEl = walk?.querySelector<HTMLElement>("[data-l-track]");
    const bar = walk?.querySelector<HTMLElement>("[data-l-bar]");
    const progress = document.querySelector<HTMLElement>("[data-l-progress]");
    const slip = walk?.querySelector<HTMLElement>("[data-l-slip]");
    const steps = [...document.querySelectorAll<HTMLElement>("[data-l-step]")];
    let now = -1;

    // The rolling word in the hero: one word up every couple of seconds, looping through a clone of the first.
    const roll = document.querySelector<HTMLElement>("[data-l-roll]");
    let rollTimer = 0;
    if (roll && !reduced) {
      const n = roll.children.length;
      roll.appendChild(roll.children[0].cloneNode(true));
      let k = 0;
      rollTimer = window.setInterval(() => {
        if (window.scrollY > window.innerHeight) return;
        k++;
        roll.style.transition = "";
        roll.style.setProperty("--i", String(k));
        if (k === n) {
          setTimeout(() => { roll.style.transition = "none"; roll.style.setProperty("--i", "0"); k = 0; }, 1000);
        }
      }, 2300);
    }
    const secs = [...document.querySelectorAll<HTMLElement>("[data-l-sec]")];
    const contact = document.getElementById("kapcsolat")!;
    if (walk && !reduced) walk.setAttribute("data-live", "");

    const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let theme = "";

    // Local time in Szombathely, with a colon that ticks.
    const clock = document.querySelector<HTMLElement>("[data-l-clock]");
    const fmt = new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Budapest" });
    const tickClock = () => { if (clock) clock.textContent = `· ${fmt.format(new Date())}`; };
    tickClock();
    const clockTimer = window.setInterval(tickClock, 20000);

    // Leave the tab and the title waits for you.
    const title = document.title;
    const away = () => { document.title = document.hidden ? "Visszavárlak – HRVT" : title; };
    document.addEventListener("visibilitychange", away);

    console.log("%cHRVT%c  Kézzel írt kód, sablon nélkül. Ha ide benéztél, beszéljünk: #kapcsolat", "background:#fedc00;color:#323232;font-weight:700;padding:2px 8px", "color:inherit");

    let on = -1, lastY = window.scrollY, navHidden = false, barOn = false, tone = "", raf = 0, walkW = 0;
    const seen = new Set<number>();
    const sizeWalk = () => {
      if (!walk || !trackEl || reduced) return;
      walkW = Math.max(0, trackEl.scrollWidth - window.innerWidth);
      walk.style.height = `${walkW + window.innerHeight}px`;
    };
    sizeWalk();
    const ro = new ResizeObserver(sizeWalk);
    if (trackEl) ro.observe(trackEl);
    window.addEventListener("resize", sizeWalk);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const H = window.innerHeight, y = window.scrollY;
      if (stage) {
        const r = stage.getBoundingClientRect();
        const p = clamp01(-r.top / Math.max(1, r.height - H));
        const i = Math.min(items.length - 1, Math.floor(p * items.length));
        if (i !== on) {
          on = i;
          items.forEach((it, k) => it.toggleAttribute("data-on", k === i));
          idx.forEach((it, k) => it.toggleAttribute("data-on", k === i));
          odo?.style.setProperty("--i", String(i));
          window.dispatchEvent(new CustomEvent("l:stage", { detail: i }));
        }
      }
      if (walk && trackEl && !reduced) {
        const r = walk.getBoundingClientRect();
        const p = clamp01(-r.top / Math.max(1, r.height - H));
        trackEl.style.transform = `translate3d(${(-p * walkW).toFixed(1)}px,0,0)`;
        if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
        if (slip) slip.style.transform = `translate3d(${((p - 1) * 38).toFixed(2)}%,0,0)`;
      }
      // Folyamat: the dot of the step nearest the middle of the screen is the live one.
      let best = Infinity, near = -1;
      steps.forEach((s, k) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - H * 0.5);
        if (r.bottom > 0 && r.top < H && d < best) { best = d; near = k; }
      });
      if (near !== now) { now = near; steps.forEach((s, k) => s.toggleAttribute("data-now", k === near)); }
      if (progress) progress.style.transform = `scaleX(${clamp01(y / Math.max(1, document.documentElement.scrollHeight - H)).toFixed(4)})`;

      let cur = 0;
      secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= 40) cur = k; });
      // The bar sits at the bottom, the nav at the top: the tone follows whichever section is under the bar on phones.
      let low = 0;
      secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= H - 60) low = k; });
      const t = secs[window.innerWidth < 900 ? low : cur]?.dataset.lTone || "dark";
      if (t !== tone) { tone = t; root.setAttribute("data-l-nav", t); }
      // The browser's own bar takes the colour of the section under the nav.
      const top = secs[cur]?.dataset.lTone === "light" ? "#fedc00" : "#323232";
      if (top !== theme && themeMeta) { theme = top; themeMeta.content = top; }
      if (cur > 0 && !seen.has(cur)) { seen.add(cur); track("szekcio", { n: cur }); }

      if (Math.abs(y - lastY) > 2) {
        const hide = y > lastY && y > H * 0.5;
        if (hide !== navHidden) { navHidden = hide; root.classList.toggle("l-nav-off", hide); }
        lastY = y;
      }
      const b = y > H * 0.7 && contact.getBoundingClientRect().top > H * 0.55;
      if (b !== barOn) { barOn = b; root.classList.toggle("l-bar-on", b); }
    };
    raf = requestAnimationFrame(tick);
    w.__ready = true;

    const click = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const t = el.closest<HTMLElement>("[data-track]");
      if (t) track(t.dataset.track!);
      const cp = el.closest<HTMLElement>("[data-l-copy]");
      if (cp) {
        navigator.clipboard?.writeText(cp.dataset.lCopy!).then(() => {
          const was = cp.textContent;
          cp.textContent = "kimásolva ✓";
          cp.setAttribute("data-done", "");
          track("email_masolas");
          setTimeout(() => { cp.textContent = was; cp.removeAttribute("data-done"); }, 1800);
        }).catch(() => {});
      }
      const a = el.closest<HTMLAnchorElement>('a[href^="#"]');
      if (a && a.getAttribute("href")!.length > 1) {
        e.preventDefault();
        scrollToHash(a.getAttribute("href")!);
      }
    };
    document.addEventListener("click", click);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rollTimer);
      clearInterval(clockTimer);
      document.removeEventListener("visibilitychange", away);
      document.title = title;
      ro.disconnect();
      window.removeEventListener("resize", sizeWalk);
      document.removeEventListener("click", click);
      root.classList.remove("l-bar-on", "l-nav-off");
      root.removeAttribute("data-l-nav");
    };
  }, []);
  return null;
}
