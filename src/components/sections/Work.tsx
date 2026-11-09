import { Meta } from "../Scramble";
import { Rise } from "../Rise";
import { PixelReveal } from "../viz/PixelReveal";
import { DemoStage } from "../viz/DemoStage";
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
              src="/work/lamelix"
              alt="A Lamelix konfigurátor: lépésenkénti beállítópanel, valós idejű 3D pergola és azonnali árkalkuláció."
            />
          </a>
        </article>

        {/* 02 — Interactive 3D explainers */}
        <article className="mt-24 md:mt-40">
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="t-meta mb-6 text-kiwi">02 — Interaktív 3D termékmagyarázók</p>
              <Rise as="h3" className="t-l" lines={[<>Szétszedhető</>, <>termékek</>]} />
            </div>
            <p className="max-w-[46ch] self-end text-smoke md:col-span-5 md:col-start-8" data-fade="">
              Gyártói műszaki adatokból épített, böngészőben futó 3D bemutató. A mozgás számolt, nem animált — a
              látogató forgatja, elindítja, metszetben és szétszedve is megnézi a terméket. Koncept demó, nem
              megrendelésre készült.
            </p>
          </div>
          <DemoStage
            demos={[
              {
                id: "sb400",
                tab: "Bioklimatikus pergola — élő demó",
                title: "Bioklimatikus pergola — SB 400",
                src: "/demos/pergola-sb400.html",
                poster: "/work/teardown-sb400",
                alt: "Interaktív 3D lamellás pergola-szimulátor: terasz bútorokkal, nyitható lamellás tetővel, körülötte mechanika-, klíma- és nézetpanelek.",
                body: "Bioklimatikus lamellás pergola a gyártó nyilvános műszaki mellékletéből. Lineáris motor és hajtórúd, 19 lamella nyílik 0–110° között, napfény- és árnyékszimulációval, metszettel és szétszedett nézettel.",
                facts: [["Alap", "Műszaki melléklet"], ["Lamellák", "19 db, 0–110°"], ["Hajtás", "Lineáris motor"], ["Nézetek", "Metszet, szétszedés, LED"]],
              },
            ]}
          />
        </article>
      </div>
    </section>
  );
}
