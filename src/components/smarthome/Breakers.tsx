"use client";
import { useState } from "react";

const FAQ = [
  ["Meglévő házba is beépíthető?", "Igen. Új építésnél vezetékes rendszert tervezünk, felújításnál és lakott házban vezeték nélküli megoldásokkal dolgozunk, vésés nélkül."],
  ["Mi történik, ha nincs internet?", "A ház ugyanúgy működik: a kapcsolók, a jelenetek és az időzítések helyben futnak. Internet csak a távoli eléréshez kell."],
  ["Mennyibe kerül?", "A ház méretétől és attól függ, mit szeretnél vezérelni. A felmérés után tételes, fix ajánlatot adunk."],
  ["Kell hozzá telefon?", "Nem. A fali kapcsolók megmaradnak, a telefon csak kényelmi plusz."],
] as const;

/** FAQ as a breaker panel: flip a breaker to power up its answer. */
export function Breakers() {
  const [on, setOn] = useState<boolean[]>(FAQ.map(() => false));
  const all = on.every(Boolean), flip = (i: number) => setOn((s) => s.map((v, k) => (k === i ? !v : v)));
  return (
    <section id="gyik" data-theme="night" className="relative bg-night">
      <div className="wrap grid gap-12 py-[var(--sec)] md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="t-meta flex items-center gap-3 text-smoke"><span className="text-kiwi">[03]</span>Kérdések</p>
          <h2 className="t-l mt-8">Kapcsold fel <em className="text-kiwi">a választ.</em></h2>
          <button className="bk-main mt-10" aria-pressed={all} onClick={() => setOn(FAQ.map(() => !all))}>
            <span className="bk-lever" aria-hidden><i /></span>
            <span className="t-meta">{all ? "Főkapcsoló · le" : "Főkapcsoló · mindet fel"}</span>
          </button>
        </div>
        <div className="bk-panel md:col-span-7 md:col-start-6">
          <div className="bk-rail" aria-hidden />
          {FAQ.map(([q, a], i) => (
            <div key={q} className="bk-row" data-on={on[i]}>
              <button className="bk-btn" aria-expanded={on[i]} aria-controls={`bk-${i}`} onClick={() => flip(i)}>
                <span className="bk-lever" aria-hidden><i /></span>
                <span className="bk-q">{q}</span>
                <span className="bk-led" aria-hidden />
              </button>
              <div id={`bk-${i}`} className="bk-a" role="region"><div><p>{a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
