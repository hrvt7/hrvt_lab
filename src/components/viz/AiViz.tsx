"use client";

import { useEffect, useRef, useState } from "react";
import { useVisible } from "./useVisible";

const PROMPT = "Ajánlat: 48 m² terasz, antracit, motoros lamella";
const ANSWER = [
  ["Méret felismerve", "6,0 × 8,0 m"],
  ["Termék", "Bioklimatikus pergola"],
  ["Anyagár", "4 280 000 Ft"],
  ["Szerelés", "640 000 Ft"],
  ["Összesen (bruttó)", "6 248 400 Ft"],
];

/** An assistant reading a request and streaming a priced answer. */
export function AiViz() {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useVisible(ref);
  const [typed, setTyped] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (!vis) return;
    let t = 0;
    const id = setInterval(() => {
      t++;
      const p = Math.min(PROMPT.length, t * 2);
      setTyped(p);
      const r = Math.max(0, Math.floor((t - PROMPT.length / 2 - 4) / 5));
      setRows(Math.min(ANSWER.length, r));
      if (t > PROMPT.length / 2 + 4 + ANSWER.length * 5 + 30) {
        t = 0;
      }
    }, 55);
    return () => clearInterval(id);
  }, [vis]);

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 p-5 font-mono text-[0.78rem] md:p-6">
      <div className="flex items-center gap-2 text-ash">
        <i className="h-2 w-2 rounded-full bg-kiwi" />
        hrvt-asszisztens · ajánlatkészítő
      </div>
      <div className="rounded-xl bg-night-3 p-3.5 text-paper">
        {PROMPT.slice(0, typed)}
        {typed < PROMPT.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-kiwi" />}
      </div>
      <div className="flex-1 space-y-1.5">
        {ANSWER.slice(0, rows).map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between border-b border-line pb-1.5 ${i === ANSWER.length - 1 ? "border-none pt-1 text-kiwi" : "text-smoke"}`}
          >
            <span>{k}</span>
            <span className={i === ANSWER.length - 1 ? "text-kiwi" : "text-paper"}>{v}</span>
          </div>
        ))}
        {rows > 0 && rows < ANSWER.length && <span className="inline-block h-3.5 w-1.5 animate-[blink_0.8s_steps(1)_infinite] bg-kiwi" />}
      </div>
      <div className="flex gap-2 text-[0.66rem] text-ash">
        <span className="rounded-full border border-line px-2.5 py-1">PDF kész</span>
        <span className="rounded-full border border-line px-2.5 py-1">CRM-be mentve</span>
      </div>
    </div>
  );
}
