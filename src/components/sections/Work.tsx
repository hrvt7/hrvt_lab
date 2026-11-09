import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { PixelReveal } from "../viz/PixelReveal";
import { StrainWave } from "../viz/StrainWave";
import { ArrowUpRight } from "../Icons";

function Facts({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-[0.92rem]" data-fade="">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="t-meta mb-1 text-[0.62rem] text-ash">{k}</dt>
          <dd className="text-smoke">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Work() {
  return (
    <section id="munkak" data-theme="night" className="relative bg-night">
      <div className="wrap pb-[var(--sec)] pt-[var(--sec)]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <Meta n="02">Munkák</Meta>
          </div>
          <div className="md:col-span-9">
            <Rise as="h2" className="t-xl" lines={[<>Válogatott</>, <span className="text-kiwi">munkák.</span>]} />
          </div>
        </div>

        {/* 01 — Lamelix */}
        <article className="mt-20 grid gap-8 md:mt-32 md:grid-cols-12 md:gap-[var(--g)]">
          <div className="flex flex-col justify-between gap-10 md:col-span-4">
            <div>
              <p className="t-meta mb-6 text-kiwi">01 — 3D konfigurátor</p>
              <Rise as="h3" className="t-l mb-6" lines={[<>Lamelix</>]} />
              <p className="max-w-[40ch] text-smoke" data-fade="">
                Fehércímkés 3D konfigurátor pergola-, veranda- és télikertgyártóknak. A vevő a gyártó oldalán, valós idejű
                3D-ben rakja össze a terméket, azonnali irányárat lát, a kész ajánlatkérés pedig egyenesen a gyártóhoz fut be.
              </p>
            </div>
            <div className="space-y-8">
              <Facts
                rows={[
                  ["Szerep", "Termék, design, 3D, fejlesztés"],
                  ["Státusz", "Béta — első gyártói partnerek"],
                  ["Technológia", "Three.js · React · TypeScript"],
                  ["Kimenet", "Élő ár, PDF, ajánlatkérés"],
                ]}
              />
              <a
                href="https://lamelix.vercel.app/konfigurator"
                target="_blank"
                rel="noreferrer"
                className="pill pill--ghost"
                data-cursor="Megnyitás"
              >
                Élő demó
                <span className="pill-dot">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </div>
          <a
            href="https://lamelix.vercel.app/konfigurator"
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-[22px] border border-line md:col-span-8 md:rounded-[30px]"
            data-cursor="Kipróbálom"
          >
            <PixelReveal
              src="/work/lamelix.webp"
              alt="A Lamelix konfigurátor: lépésenkénti beállítópanel, valós idejű 3D pergola és azonnali árkalkuláció."
            />
          </a>
        </article>

        {/* 02 — Strain wave teardown */}
        <article className="mt-24 grid gap-8 md:mt-40 md:grid-cols-12 md:gap-[var(--g)]">
          <div className="order-2 aspect-square overflow-hidden rounded-[22px] border border-line bg-night-2 md:order-1 md:col-span-8 md:aspect-[1.6] md:rounded-[30px]">
            <StrainWave />
          </div>
          <div className="order-1 flex flex-col justify-between gap-10 md:order-2 md:col-span-4">
            <div>
              <p className="t-meta mb-6 text-kiwi">02 — Interaktív 3D magyarázó</p>
              <Rise as="h3" className="t-l mb-6" lines={[<>Hullámhajtómű</>, <>teardown</>]} />
              <p className="max-w-[40ch] text-smoke" data-fade="">
                Böngészőben futó 3D termékmagyarázó egy ipari hullámhajtóműről, a gyártó nyilvános STEP-fájljaiból. A
                mozgás számolt, nem animált: a rugalmas fogaskerék élőben hajlik, 200 fog kapcsolódik 202-be, és a kimenet
                fordulatonként két fognyit lép. Metszet, szétszedés, katalógusadatok.
              </p>
            </div>
            <div className="space-y-6">
              <Facts
                rows={[
                  ["Típus", "Koncept demó"],
                  ["Alap", "Gyári CAD / STEP"],
                  ["Technológia", "OpenCascade · Three.js · shaderek"],
                  ["Áttétel", "100 : 1, valós geometria"],
                ]}
              />
              <p className="t-meta text-[0.62rem] leading-relaxed text-ash" data-fade="">
                ← A működési elv élő, egyszerűsített 2D modellje. Húzd körbe. A teljes 3D demót kérésre megmutatom.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
