"use client";

import { useEffect } from "react";

const LAT = 47.2307; // Szombathely
const LON = 16.6218;
const rad = Math.PI / 180;

/** Sun altitude and azimuth (degrees; azimuth from north, clockwise) for a moment, accurate to about a degree. */
export function sunAt(date: Date) {
  const d = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const g = (357.528 + 0.9856003 * d) * rad;
  const L = 280.46 + 0.9856474 * d;
  const lam = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const eps = (23.439 - 0.0000004 * d) * rad;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
  const gmst = (280.46061837 + 360.98564736629 * d) % 360;
  const H = (gmst + LON) * rad - ra;
  const phi = LAT * rad;
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) + Math.PI;
  return { alt: alt / rad, az: ((az / rad) % 360 + 360) % 360 };
}

/** `?ido=17:30` shows the shadow as it falls at that Budapest time today (for checking the page at night). */
function now() {
  const q = new URLSearchParams(location.search).get("ido");
  const d = new Date();
  const m = q && /^(\d{1,2}):(\d{2})$/.exec(q);
  if (!m) return d;
  const wall = new Date(d.toLocaleString("en-US", { timeZone: "Europe/Budapest" }));
  const offset = wall.getTime() - d.getTime();
  wall.setHours(+m[1], +m[2], 0, 0);
  return new Date(wall.getTime() - offset);
}

const mix = (t: number) => {
  // From the page's yellow (no shadow) to yellow darkened by 16% graphite (full shadow).
  const a = [254, 220, 0], b = [220, 193, 8];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
};

/**
 * The hero headline casts a flat, long shadow where the real sun over Szombathely would throw it right now:
 * short and straight down at noon, long and sideways at dawn and dusk, none at night. Updates every minute.
 */
export function Sun() {
  useEffect(() => {
    const h1 = document.querySelector<HTMLElement>(".l-h1");
    const label = document.querySelector<HTMLElement>("[data-l-sun]");
    if (!h1) return;
    // The shadow lives on its own copy of the headline, behind it, so no line's shadow can cover another line's letters.
    const layer = document.createElement("span");
    layer.className = "l-h1-sh";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = h1.innerHTML;
    h1.appendChild(layer);
    const paint = () => {
      const { alt, az } = sunAt(now());
      if (label) label.textContent = alt > 0 ? `· napmagasság ${Math.round(alt)}°` : "· a nap lement";
      if (alt <= 0) { layer.style.textShadow = ""; layer.style.color = "transparent"; h1.removeAttribute("data-sun"); return; }
      const fs = parseFloat(getComputedStyle(h1).fontSize);
      const len = Math.min(innerWidth < 900 ? 0.5 : 0.8, Math.max(0.04, 0.1 / Math.tan(alt * rad))) * fs;
      // The sun stands in front of the page: in the east (morning) the shadow falls left, in the west it falls right.
      let dx = -Math.sin(az * rad), dy = 0.55;
      const n0 = Math.hypot(dx, dy);
      dx /= n0; dy /= n0;
      const n = Math.max(2, Math.min(48, Math.ceil(len / 1.5)));
      const c = mix(Math.min(1, alt / 4));
      const parts: string[] = [];
      for (let i = 1; i <= n; i++) parts.push(`${((dx * len * i) / n).toFixed(1)}px ${((dy * len * i) / n).toFixed(1)}px 0 ${c}`);
      layer.style.color = c;
      layer.style.textShadow = parts.join(",");
      h1.setAttribute("data-sun", `${Math.round(alt)}° · ${Math.round(az)}°`);
    };
    paint();
    const t = window.setInterval(paint, 60000);
    const ro = new ResizeObserver(paint);
    ro.observe(h1);
    return () => { clearInterval(t); ro.disconnect(); layer.remove(); };
  }, []);
  return null;
}
