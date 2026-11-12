import { Stage } from "@/components/l/Stage";
import { Fx } from "@/components/l/Fx";
import { Composer } from "@/components/l/Composer";
import { Sun } from "@/components/l/Sun";
import { Speed } from "@/components/l/Speed";
import { Wordmark } from "@/components/Logo";
import { EMAIL, HERO_WORDS, NAV, PHONE, PHONE_TEL, SERVICES, STEPS, TURNKEY } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

const LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "HRVT",
  url: "https://hrvt.vercel.app",
  description: "Egyedi weboldal készítés és honlapkészítés Szombathelyen és Vas megyében: design, szöveg, fejlesztés, keresőoptimalizálás és élesítés egy kézben, sablon nélkül.",
  serviceType: ["Weboldal készítés", "Honlapkészítés", "Webfejlesztés", "Keresőoptimalizálás"],
  telephone: PHONE_TEL,
  email: EMAIL,
  areaServed: [{ "@type": "City", name: "Szombathely" }, { "@type": "AdministrativeArea", name: "Vas megye" }],
  knowsLanguage: "hu",
};

const SEAL = "Weboldal készítés · Szombathely · Sablon nélkül · ";

export default function Page() {
  return (
    <div className="l">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Stage />
      <Fx />
      <Sun />
      <Speed />
      <span className="l-progress" data-l-progress="" aria-hidden />

      <header className="l-nav">
        <a href="#top" aria-label="HRVT — a lap tetejére" className="l-nav-logo">
          <Wordmark className="l-nav-wm" />
        </a>
        <nav aria-label="Fő menü" className="l-nav-links">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#kapcsolat" className="l-nav-cta" data-track="ajanlatkeres">
          Kérek egy weboldalt
        </a>
      </header>

      <main>
        {/* Nyitókép */}
        <section id="top" className="l-hero l-inv" data-l-sec="" data-l-tone="light">
          <div className="l-wrap l-hero-in">
            <p className="l-label" data-l-hero="">
              <span>Weboldal készítés</span>
              <span>
                Szombathely <span className="l-clock" data-l-clock="" aria-hidden />
                <span className="l-sun" data-l-sun="" title="A cím árnyéka a nap valódi állását követi Szombathely fölött." />
              </span>
            </p>
            <h1 className="l-h1">
              <span>Egyedi </span>
              <span>weboldalt </span>
              <span>készítek. </span>
              <em>
                <span>Sablon </span>
                <span>nélkül.</span>
              </em>
            </h1>
            <div className="l-hero-foot">
              <div>
                <p className="l-roll" data-l-hero="">
                  <span className="l-sr">Weboldal, ami {HERO_WORDS.join(", ")}.</span>
                  <span aria-hidden>Weboldal, ami</span>
                  <span className="l-roll-w" aria-hidden>
                    <span data-l-roll="">
                      {HERO_WORDS.map((w) => (
                        <i key={w}>{w}.</i>
                      ))}
                    </span>
                  </span>
                </p>
                <p className="l-lead" data-l-hero="">
                  Design, szöveg, fejlesztés, keresőoptimalizálás és élesítés egy kézben. Azzal beszélsz, aki az oldaladat készíti.
                </p>
                <div className="l-cta" data-l-hero="">
                  <a href="#kapcsolat" className="l-btn l-btn--solid" data-track="ajanlatkeres" data-l-magnet="">
                    Kérek egy weboldalt
                  </a>
                  <a href={`tel:${PHONE_TEL}`} className="l-link" data-track="hivas">
                    {PHONE}
                  </a>
                </div>
              </div>
              <a href="#szolgaltatasok" className="l-seal" data-l-hero="">
                <span className="l-sr">Tovább a szolgáltatásokhoz</span>
                <svg viewBox="0 0 200 200" aria-hidden>
                  <defs>
                    <path id="l-seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text>
                    <textPath href="#l-seal-path" textLength="486">
                      {SEAL}
                    </textPath>
                  </text>
                </svg>
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </section>


        {/* Mit vállalok: one service on stage at a time */}
        <section id="szolgaltatasok" className="l-stage" data-l-stage="" data-l-sec="" style={{ ["--n" as string]: SERVICES.length }}>
          <div className="l-stage-pin">
            <div className="l-wrap l-stage-grid">
              <div className="l-stage-side">
                <h2 className="l-label l-label--h">Mit vállalok</h2>
                <p className="l-odo" aria-hidden>
                  <span data-l-odo="">
                    {SERVICES.map((s) => (
                      <i key={s.n}>{s.n}</i>
                    ))}
                  </span>
                  <small>/ {pad(SERVICES.length)}</small>
                </p>
                <ol className="l-index" aria-hidden>
                  {SERVICES.map((s, i) => (
                    <li key={s.n} data-l-idx="" data-on={i === 0 ? "" : undefined}>
                      {s.title}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="l-stage-main">
                {SERVICES.map((s, i) => (
                  <article key={s.n} data-l-item="" data-on={i === 0 ? "" : undefined}>
                    <h3>{s.title}</h3>
                    <p className="l-lede">{s.lede}</p>
                    <p className="l-body">{s.body}</p>
                    <ul className="l-tags">
                      {s.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    {i === 1 && (
                      <p className="l-speed" data-l-speed="" hidden>
                        Ez az oldal nálad <b data-l-speed-n="" /> alatt töltött be. <span>Mérve, nem ígérve.</span>
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kulcsrakészen: a slow sideways walk past eight columns */}
        <section id="weboldal" className="l-walk" data-l-walk="" data-l-sec="">
          <div className="l-walk-pin">
            <p className="l-slip" aria-hidden>
              <span data-l-slip="">{TURNKEY.map(([t]) => t).join(" · ")}</span>
            </p>
            <div className="l-walk-track" data-l-track="">
              <div className="l-walk-intro">
                <p className="l-label">Kulcsrakészen</p>
                <h2 className="l-h2" data-l-lines="">
                  Weboldal készítés Szombathelyen, <em>kulcsrakészen.</em>
                </h2>
                <p className="l-walk-hint" aria-hidden>
                  Nyolc tétel <span>→</span>
                </p>
              </div>
              {TURNKEY.map(([t, d], i) => (
                <article key={t} className="l-col">
                  <span className="l-col-n">{pad(i + 1)}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </article>
              ))}
            </div>
            <span className="l-walk-bar" aria-hidden>
              <i data-l-bar="" />
            </span>
          </div>
        </section>

        {/* Folyamat: the page turns to butter */}
        <section id="folyamat" className="l-proc l-inv" data-l-sec="" data-l-tone="light">
          <div className="l-wrap l-proc-grid">
            <div className="l-proc-side">
              <p className="l-label" data-l-in="">
                A honlapkészítés menete
              </p>
              <h2 className="l-h2" data-l-lines="">
                Négy lépés, és <em>él az oldalad.</em>
              </h2>
            </div>
            <ol className="l-steps">
              {STEPS.map((st) => (
                <li key={st.n} data-l-step="">
                  <span className="l-rule" data-l-rule="" aria-hidden />
                  <span className="l-dot" aria-hidden />
                  <span className="l-step-n" aria-hidden>
                    {st.n}
                  </span>
                  <div>
                    <h3>{st.title}</h3>
                    <p>{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Kapcsolat */}
        <footer id="kapcsolat" className="l-contact" data-l-sec="">
          <div className="l-wrap">
            <p className="l-label" data-l-in="">
              Kapcsolat
            </p>
            <h2 className="l-mega" data-l-lines="">
              Beszél<em>jünk.</em>
            </h2>
            <div className="l-contact-grid">
              <div>
                <p className="l-lede" data-l-in="">
                  Írd meg néhány mondatban, milyen weboldalt szeretnél. Egy munkanapon belül személyesen válaszolok.
                </p>
                <Composer />
              </div>
              <dl className="l-facts" data-l-in="">
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={`tel:${PHONE_TEL}`} data-track="hivas">
                      {PHONE}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>E-mail</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}?subject=Weboldal`} data-track="email">
                      {EMAIL}
                    </a>
                    <button type="button" className="l-copy" data-l-copy={EMAIL}>
                      másolás
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Helyszín</dt>
                  <dd>Szombathely, Vas megye</dd>
                </div>
                <div>
                  <dt>Válaszidő</dt>
                  <dd>1 munkanap</dd>
                </div>
              </dl>
            </div>
            <div className="l-foot">
              <nav aria-label="Lábléc">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href}>
                    {n.label}
                  </a>
                ))}
              </nav>
              <p>© 2026 HRVT · A vállalkozás bejegyzése folyamatban van.</p>
            </div>
            <div className="l-big" data-l-big-wrap="" aria-hidden>
              <div data-l-big="">
                <Wordmark className="l-big-wm" />
              </div>
            </div>
          </div>
        </footer>
      </main>

      <div className="l-bar">
        <a href="#kapcsolat" data-track="ajanlatkeres">
          Kérek egy weboldalt
        </a>
        <a href={`tel:${PHONE_TEL}`} data-track="hivas">
          Hívás
        </a>
      </div>
    </div>
  );
}
