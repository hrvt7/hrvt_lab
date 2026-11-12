"use client";

import { useEffect, useState } from "react";
import { track } from "./Stage";

const COLS = 12;

/**
 * A light/dark-style switch in the header. On, the page shows its own frame: the column grid with its
 * margins and gutters, a dashed outline round every text block, and the type spec of every heading.
 */
export function VazSwitch() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("l-vaz", on);
    if (!on) return;
    const spec = () => {
      document.querySelectorAll<HTMLElement>(".l main :is(h1, h2, h3)").forEach((h) => {
        const cs = getComputedStyle(h);
        const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").replace(" Variable", "");
        const fs = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === "normal" ? "normal" : (parseFloat(cs.lineHeight) / fs).toFixed(2).replace(".", ",");
        h.setAttribute("data-spec", `${h.tagName} · ${fam} · ${Math.round(fs)} px / ${lh}`);
      });
      const wrap = document.querySelector<HTMLElement>(".l-grid-in");
      const read = document.querySelector<HTMLElement>("[data-l-grid-read]");
      if (wrap && read) {
        const cs = getComputedStyle(wrap);
        const cols = getComputedStyle(wrap).gridTemplateColumns.split(" ").length;
        const m = Math.round(parseFloat(cs.paddingLeft)), g = Math.round(parseFloat(cs.columnGap));
        read.textContent = innerWidth < 600 ? `${cols} hasáb · margó ${m} · köz ${g}` : `Rács: ${cols} hasáb · margó ${m} px · hasábköz ${g} px · ${innerWidth} × ${innerHeight}`;
      }
    };
    spec();
    window.addEventListener("resize", spec);
    return () => window.removeEventListener("resize", spec);
  }, [on]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Mutasd a vázat"
      title="Mutasd a vázat"
      className="l-switch"
      onClick={() => {
        if (!on) track("vaz");
        setOn(!on);
      }}
    >
      <span className="l-switch-track" aria-hidden>
        <span className="l-switch-knob" />
      </span>
      <span className="l-switch-label" aria-hidden>
        Váz
      </span>
    </button>
  );
}

/** The column overlay itself; drawn only while the switch is on. */
export function VazGrid() {
  return (
    <>
    <p className="l-grid-read" data-l-grid-read="" aria-hidden />
    <div className="l-grid" aria-hidden>
      <div className="l-wrap l-grid-in">
        {Array.from({ length: COLS }, (_, k) => (
          <i key={k} style={{ ["--k" as string]: k }} />
        ))}
      </div>
    </div>
    </>
  );
}
