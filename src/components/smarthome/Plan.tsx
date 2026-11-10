"use client";

/** Live floor plan of the visitor's house: the building type changes how it's drawn, every chosen feature appears on it. */
export function Plan({ kind, wants }: { kind: string; wants: string[] }) {
  const has = (w: string) => wants.includes(w);
  const mode = kind === "Új építés" ? "new" : kind === "Felújítás" ? "reno" : "lived";
  const rooms = [[40, 40, 220, 160, "Nappali"], [260, 40, 160, 160, "Konyha"], [40, 200, 200, 140, "Háló"], [240, 200, 180, 140, "Fürdő"]] as const;
  return (
    <svg viewBox="0 0 460 380" className="pl" data-mode={mode} role="img" aria-label={`Alaprajz: ${kind}, ${wants.join(", ") || "nincs kiválasztva"}`}>
      <defs><pattern id="pl-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v10" stroke="#ff5a36" strokeWidth="3" opacity=".55" /></pattern></defs>
      <g className="pl-heat" data-on={has("Fűtés")}>{rooms.map(([x, y, w, h], i) => <rect key={i} x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill="url(#pl-hatch)" />)}</g>
      <g className="pl-light" data-on={has("Világítás")}>{rooms.map(([x, y, w, h], i) => <circle key={i} cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * 0.42} />)}</g>
      <g className="pl-walls">
        <rect x="40" y="40" width="380" height="300" pathLength={1} />
        <path d="M260 40v100M260 170v30M40 200h80M150 200h270M240 200v60M240 300v40" pathLength={1} />
      </g>
      {mode === "reno" && <path className="pl-new" d="M330 200v140M40 270h120" pathLength={1} />}
      {mode === "lived" && <g className="pl-furn"><rect x="70" y="120" width="120" height="44" rx="6" /><rect x="60" y="250" width="110" height="70" rx="6" /><rect x="290" y="60" width="110" height="34" rx="4" /><rect x="350" y="290" width="54" height="36" rx="10" /></g>}
      <g className="pl-shut" data-on={has("Árnyékolás")}><path d="M90 40h100M300 40h90M40 240v70M420 230v80M120 340h90" /></g>
      <g className="pl-sec" data-on={has("Biztonság")}><path d="M412 52l-60 40 20 22z" /><circle cx="412" cy="52" r="7" /><path d="M48 332l60-30-8 30z" /><circle cx="48" cy="332" r="7" /></g>
      <g className="pl-sun" data-on={has("Energia")}><rect x="300" y="352" width="100" height="22" rx="3" /><path d="M325 352v22M350 352v22M375 352v22" /><rect x="430" y="150" width="20" height="44" rx="4" /><path d="M436 146h8" /></g>
      {rooms.map(([x, y, w, h, n]) => <text key={n} x={x + 14} y={y + 26} className="pl-label">{n}</text>)}
    </svg>
  );
}
