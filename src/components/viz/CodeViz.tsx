"use client";

const LINES: [string, string][] = [
  ["$", "hrvt deploy --prod"],
  ["›", "Típusellenőrzés ......... rendben"],
  ["›", "Tesztek 128/128 ......... rendben"],
  ["›", "Build ................... 6,2 s"],
  ["›", "Telefonos nézet ......... rendben"],
  ["›", "Lighthouse .............. 99 / 100"],
  ["✓", "Élesítve — ugyfeled.hu"],
];

/** A deploy log that types itself out on a loop (CSS only). */
export function CodeViz() {
  return (
    <div className="flex h-full flex-col p-5 font-mono text-[0.76rem] md:p-6">
      <div className="mb-4 flex items-center gap-1.5">
        <i className="h-2.5 w-2.5 rounded-full bg-night-4" />
        <i className="h-2.5 w-2.5 rounded-full bg-night-4" />
        <i className="h-2.5 w-2.5 rounded-full bg-night-4" />
        <span className="ml-3 text-ash">terminal — ugyfel-portal</span>
      </div>
      <div className="space-y-2">
        {LINES.map(([p, l], i) => (
          <div
            key={i}
            className={`flex gap-3 whitespace-pre ${i === LINES.length - 1 ? "text-kiwi" : i === 0 ? "text-paper" : "text-smoke"}`}
            style={{ animation: `codeline 8s ${i * 0.55}s infinite both` }}
          >
            <span className={i === 0 ? "text-kiwi" : "text-ash"}>{p}</span>
            <span className="truncate">{l}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes codeline{0%{opacity:0;transform:translateX(-6px)}4%{opacity:1;transform:none}88%{opacity:1}96%,100%{opacity:0}}`}</style>
    </div>
  );
}
