"use client";

const NODES = [
  { x: 30, y: 120, l: "Űrlap" },
  { x: 150, y: 120, l: "AI-szűrés" },
  { x: 275, y: 55, l: "CRM" },
  { x: 275, y: 185, l: "Értesítés" },
  { x: 395, y: 55, l: "Ajánlat" },
  { x: 395, y: 185, l: "Naptár" },
];
const EDGES = [
  "M70 120 H110",
  "M190 120 C230 120 220 55 245 55",
  "M190 120 C230 120 220 185 245 185",
  "M305 55 H365",
  "M305 185 H365",
];

/** A workflow graph with data pulses travelling its edges (pure CSS motion). */
export function FlowViz() {
  return (
    <div className="flex h-full flex-col p-5 md:p-6">
      <p className="mb-2 font-mono text-[0.72rem] text-ash">automatizmus · ajánlatkérés → ügyfél</p>
      <svg viewBox="0 0 440 240" className="w-full flex-1" aria-hidden>
        {EDGES.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(242,242,238,.14)" strokeWidth="1.5" />
            <path d={d} fill="none" stroke="#89e900" strokeWidth="1.5" strokeDasharray="4 16" style={{ animation: `dash 1.2s linear infinite` }} />
            <circle r="3.5" fill="#89e900" style={{ offsetPath: `path("${d}")`, animation: `flowdot 2.4s ${i * 0.35}s cubic-bezier(.7,0,.2,1) infinite` }} />
          </g>
        ))}
        {NODES.map((n, i) => (
          <g key={n.l} transform={`translate(${n.x} ${n.y})`}>
            <rect x="-40" y="-17" width="80" height="34" rx="17" fill={i === 1 ? "#89e900" : "#2c2c2c"} stroke="rgba(242,242,238,.16)" />
            <text textAnchor="middle" dy="4" fontSize="11" fontFamily="var(--font-mono)" fill={i === 1 ? "#222" : "#f2f2ee"}>
              {n.l}
            </text>
          </g>
        ))}
      </svg>
      <style>{`@keyframes flowdot{0%{offset-distance:0%;opacity:0}15%{opacity:1}85%{opacity:1}100%{offset-distance:100%;opacity:0}}`}</style>
      <div className="mt-2 flex justify-between font-mono text-[0.66rem] text-ash">
        <span>142 futás / nap</span>
        <span className="text-kiwi">0 kézi lépés</span>
      </div>
    </div>
  );
}
