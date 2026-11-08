import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { Monogram } from "../Logo";

const STACK = ["TypeScript", "Next.js", "React", "Three.js", "WebGL", "Supabase", "n8n", "Make", "LLM API-k", "Python", "Vercel"];

export function About() {
  return (
    <section id="rolam" data-theme="night" className="relative overflow-hidden bg-night">
      <div className="wrap py-[var(--sec)]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Meta n="04">Rólam</Meta>
          </div>
          <div className="md:col-span-9">
            <Rise as="h2" className="t-xl" lines={[<>Épületeket</>, <>kábeleztem.</>, <span className="text-kiwi">Most rendszereket</span>, <span className="text-kiwi">kötök össze.</span>]} />
          </div>
        </div>

        <div className="mt-16 grid gap-[var(--g)] md:mt-24 md:grid-cols-12">
          <div className="relative hidden md:col-span-3 md:block" aria-hidden>
            <Monogram className="h-40 w-auto text-night-3" />
          </div>
          <div className="space-y-6 md:col-span-5">
            <p className="t-lead text-paper" data-fade="">
              Horváth Ádám vagyok, a HRVT mögött. Mielőtt szoftvert építettem, valódi rendszerekben dolgoztam: villamos
              kivitelezés, épület- és szállodaautomatizálás (KNX), chiptuning.
            </p>
            <p className="text-smoke" data-fade="0.1">
              Ebből jön, ahogy dolgozom: jelekben, terhelésben és hibalehetőségekben gondolkodom. Előre megtervezem, mi
              történik, ha a bemenet hiányos, a kapcsolat megszakad, vagy a felhasználó nem azt csinálja, amit vártunk.
            </p>
            <p className="text-smoke" data-fade="0.2">
              Egy kézben az egész, a tervezéstől az élesítésig — nincs projektmenedzser, nincs átadás-átvétel. Magyarul és
              angolul, Magyarországon, Ausztriában és azon túl.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <p className="t-meta mb-4 text-ash" data-fade="">
              Eszköztár
            </p>
            <ul className="flex flex-wrap gap-2" data-fade="0.1">
              {STACK.map((s) => (
                <li key={s} className="t-meta rounded-full bg-night-3 px-3 py-1.5 text-[0.62rem] text-smoke">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
