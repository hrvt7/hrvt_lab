"use client";

const BLOCKS = [
  { c: "col-span-12 h-3", k: "line" },
  { c: "col-span-8 h-16", k: "head" },
  { c: "col-span-4 row-span-2 h-full", k: "kiwi" },
  { c: "col-span-5 h-3", k: "line" },
  { c: "col-span-3 h-7", k: "btn" },
  { c: "col-span-4 h-20", k: "card" },
  { c: "col-span-4 h-20", k: "card" },
  { c: "col-span-4 h-20", k: "card" },
];

/** A landing page assembling itself, block by block. */
export function WebViz() {
  return (
    <div className="flex h-full flex-col p-5 md:p-6">
      <p className="mb-3 font-mono text-[0.72rem] text-ash">layout · 12 hasábos rács</p>
      <div className="grid flex-1 auto-rows-min grid-cols-12 gap-2 rounded-xl border border-line p-3">
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            className={`${b.c} origin-left rounded-md ${
              b.k === "kiwi" ? "bg-kiwi" : b.k === "head" ? "bg-paper" : b.k === "btn" ? "rounded-full bg-kiwi/80" : b.k === "card" ? "bg-night-3" : "bg-night-4"
            }`}
            style={{ animation: `block 6s ${i * 0.22}s infinite both` }}
          />
        ))}
      </div>
      <style>{`@keyframes block{0%{transform:scaleX(0);opacity:0}6%{transform:scaleX(1);opacity:1}86%{transform:scaleX(1);opacity:1}94%,100%{transform:scaleX(0);opacity:0}}`}</style>
    </div>
  );
}
