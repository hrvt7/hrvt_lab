import { Field } from "@/components/sig/Field";
import { Sig } from "@/components/sig/Sig";
import { Wordmark } from "@/components/Logo";
import { EMAIL, FAQ, NAV, PHONE, PHONE_TEL, SERVICES, STEPS, TURNKEY } from "@/lib/content";

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://hrvt.vercel.app/#hrvt",
      name: "HRVT",
      url: "https://hrvt.vercel.app",
      description:
        "Egyedi weboldal készítés és honlapkészítés Szombathelyen és Vas megyében: design, szöveg, fejlesztés, keresőoptimalizálás és élesítés egy kézben, sablon nélkül.",
      serviceType: ["Weboldal készítés", "Honlapkészítés", "Webfejlesztés", "Keresőoptimalizálás"],
      telephone: PHONE_TEL,
      email: EMAIL,
      address: { "@type": "PostalAddress", addressLocality: "Szombathely", addressRegion: "Vas", addressCountry: "HU" },
      areaServed: [{ "@type": "City", name: "Szombathely" }, { "@type": "AdministrativeArea", name: "Vas megye" }],
      knowsLanguage: "hu",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

const SCENES = ["design", "code", "search", "form"] as const;
const MAIL = `mailto:${EMAIL}?subject=${encodeURIComponent("Weboldalt szeretnék")}&body=${encodeURIComponent("Szia! Weboldalt szeretnék kérni.")}`;
const SMS = `sms:${PHONE_TEL}?&body=${encodeURIComponent("Szia! Weboldalt szeretnék kérni.")}`;

export default function Page() {
  return (
    <div className="sig">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Sig email={EMAIL} tel={PHONE_TEL} />

      <header className="sig-nav">
        <a href="#top" aria-label="HRVT, a lap tetejére" className="sig-nav-logo">
          <Wordmark className="sig-nav-wm" />
        </a>
        <nav aria-label="Fő menü" className="sig-nav-links">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#kapcsolat" className="sig-btn sig-btn--sm" data-track="ajanlatkeres">
          <span>Kérek egy weboldalt</span>
        </a>
      </header>

      <main>
        {/* 1. Jel-mező */}
        <section id="top" className="sig-hero" data-sig-hero="" data-sig-p="0" data-theme="night">
          <div className="sig-hero-pin">
            <Field />
            <div className="sig-mark-fallback" aria-hidden>
              <Wordmark className="sig-mark-svg" />
            </div>
            <p className="sig-hero-top sig-mono">
              <span>Weboldal készítés, Szombathely</span>
              <span aria-hidden className="sig-res">
                felbontás <b data-sig-res="">nyers</b>
              </span>
            </p>
            <div className="sig-hero-copy">
              <h1 className="sig-h1">
                Egyedi weboldalt készítek. <em>Sablon nélkül.</em>
              </h1>
              <p className="sig-lead">
                Design, szöveg, fejlesztés, keresők és élesítés egy kézben, Szombathelyen és Vas megyében.
              </p>
              <div className="sig-cta">
                <a href="#kapcsolat" className="sig-btn" data-track="ajanlatkeres">
                  <span>Kérek egy weboldalt</span>
                </a>
                <a href={`tel:${PHONE_TEL}`} className="sig-link" data-track="hivas">
                  Hívj: {PHONE}
                </a>
              </div>
              <button type="button" className="sig-tilt sig-mono" data-sig-tilt="" hidden>
                Döntés bekapcsolása
              </button>
            </div>
          </div>
        </section>

        {/* 2. Mit vállalok */}
        <section id="szolgaltatasok" className="sig-sv" data-theme="night">
          <div className="sig-wrap sig-head">
            <p className="sig-mono sig-kicker">Mit vállalok</p>
            <h2 className="sig-h2" data-dot="">
              Négy dolog, amit kézzel készítek el.
            </h2>
          </div>
          <div className="sig-stage" data-sig-stage="">
            <div className="sig-stage-in sig-wrap">
              {SERVICES.map((s, i) => (
                <article key={s.n} className={`sig-svc${i === 0 ? " is-on" : ""}`} data-sig-svc="">
                  <div className="sig-svc-view">
                    <canvas data-sig-scene={SCENES[i]} role="img" aria-label={`${s.title}: kódból rajzolt ábra, amely görgetésre kitisztul`} />
                  </div>
                  <div className="sig-svc-text">
                    <p className="sig-num" aria-hidden>
                      {s.n}
                    </p>
                    <h3 className="sig-h3">{s.title}</h3>
                    <p className="sig-lede">{s.lede}</p>
                    <p className="sig-body">{s.body}</p>
                    <p className="sig-tags sig-mono">{s.tags.join(" / ")}</p>
                  </div>
                </article>
              ))}
              <div
                className="sig-dial"
                data-sig-dial=""
                role="slider"
                tabIndex={0}
                aria-label="Felbontás: húzd, vagy használd a nyílbillentyűket"
                aria-valuemin={1}
                aria-valuemax={21}
                aria-valuenow={21}
                aria-valuetext="21 képpontos cellák"
              >
                <svg viewBox="0 0 120 120" aria-hidden>
                  <g className="sig-dial-ticks">
                    {Array.from({ length: 21 }, (_, i) => {
                      const a = ((-225 + i * 13.5) * Math.PI) / 180;
                      const r0 = 50, r1 = i % 5 === 0 ? 40 : 44;
                      return (
                        <line
                          key={i}
                          x1={(60 + r0 * Math.cos(a)).toFixed(2)}
                          y1={(60 + r0 * Math.sin(a)).toFixed(2)}
                          x2={(60 + r1 * Math.cos(a)).toFixed(2)}
                          y2={(60 + r1 * Math.sin(a)).toFixed(2)}
                        />
                      );
                    })}
                  </g>
                  <g data-sig-dial-knob="">
                    <circle cx="60" cy="60" r="30" className="sig-dial-body" />
                    <rect x="58" y="32" width="4" height="14" className="sig-dial-mark" />
                  </g>
                </svg>
                <p className="sig-mono">
                  <b data-sig-dial-val="">21 px</b>
                  <span>húzd: felbontás</span>
                </p>
              </div>
            </div>
          </div>
          <div className="sig-wrap sig-go">
            <a href="#kapcsolat" className="sig-btn" data-track="ajanlatkeres">
              <span>Kérek egy weboldalt</span>
            </a>
            <a href={`tel:${PHONE_TEL}`} className="sig-link" data-track="hivas">
              Hívj: {PHONE}
            </a>
          </div>
        </section>

        <div className="sig-edge sig-edge--in" aria-hidden />

        {/* 3. Kulcsrakészen */}
        <section id="weboldal" className="sig-tk" data-theme="kiwi">
          <div className="sig-wrap">
            <div className="sig-head">
              <p className="sig-mono sig-kicker">Kulcsrakészen</p>
              <h2 className="sig-h2" data-dot="">
                Weboldal készítés Szombathelyen, kulcsrakészen.
              </h2>
            </div>
            <div className="sig-tk-grid">
              <div className="sig-tk-view">
                <canvas data-sig-site="" role="img" aria-label="Egy minioldal, amely a nyolc tétellel együtt sávonként épül fel" />
              </div>
              <ol className="sig-jobs" data-sig-jobs="">
                {TURNKEY.map(([t, d]) => (
                  <li key={t} className="sig-job" data-sig-job="" data-state="queued">
                    <span className="sig-job-state sig-mono" aria-hidden>
                      <i data-sig-spin="">[ ]</i>
                      <svg viewBox="0 0 24 24">
                        <path d="M4 12.5l5.2 5.2L20 6.5" pathLength={1} />
                      </svg>
                    </span>
                    <div>
                      <h3 className="sig-job-t">{t}</h3>
                      <p>{d}</p>
                      <span className="sig-job-bar sig-mono" data-sig-bar="" aria-hidden>
                        ░░░░░░░░░░░░
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <a href="#kapcsolat" className="sig-btn sig-btn--ink" data-track="ajanlatkeres">
              <span>Kérek egy weboldalt</span>
            </a>
          </div>
        </section>

        <div className="sig-edge sig-edge--out" aria-hidden />

        {/* 4. Folyamat */}
        <section id="folyamat" className="sig-pr" data-theme="night">
          <div className="sig-wrap">
            <div className="sig-head">
              <p className="sig-mono sig-kicker">Folyamat</p>
              <h2 className="sig-h2" data-dot="">
                Négy lépés, és él az oldalad.
              </h2>
            </div>
            <div className="sig-steps" data-sig-steps="">
              <canvas data-sig-wave="" aria-hidden />
              <ol>
                {STEPS.map((s) => (
                  <li key={s.n} className="sig-step" data-sig-step="">
                    <span className="sig-node" aria-hidden />
                    <div className="sig-step-c">
                      <p className="sig-step-n" aria-hidden>
                        {s.n}
                      </p>
                      <h3 className="sig-h3">{s.title}</h3>
                      <p className="sig-body">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="sig-wrap sig-go">
            <a href="#kapcsolat" className="sig-btn" data-track="ajanlatkeres">
              <span>Kérek egy weboldalt</span>
            </a>
            <a href={`tel:${PHONE_TEL}`} className="sig-link" data-track="hivas">
              Hívj: {PHONE}
            </a>
          </div>
        </section>

        {/* 5. Kérdések */}
        <section id="kerdesek" className="sig-faq" data-theme="night">
          <div className="sig-wrap">
            <div className="sig-head">
              <p className="sig-mono sig-kicker">Kérdések</p>
              <h2 className="sig-h2" data-dot="">
                Amit előre megkérdeznek.
              </h2>
            </div>
            <dl className="sig-qa">
              {FAQ.map(([q, a]) => (
                <div key={q} className="sig-qa-row">
                  <dt>{q}</dt>
                  <dd className="sig-qa-a">
                    <canvas data-sig-meter="" aria-hidden />
                    <span data-sig-decode="">{a}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <a href="#kapcsolat" className="sig-link sig-link--big" data-track="ajanlatkeres">
              Más kérdésed van? Írd meg.
            </a>
          </div>
        </section>

        <div className="sig-edge sig-edge--in" aria-hidden />

        {/* 6. Kapcsolat */}
        <section id="kapcsolat" className="sig-ct" data-theme="kiwi">
          <div className="sig-wrap sig-ct-in">
            <div className="sig-head">
              <p className="sig-mono sig-kicker">Kapcsolat</p>
              <h2 className="sig-h2 sig-h2--xl" data-dot="">
                Beszéljünk.
              </h2>
              <p className="sig-lead">Írd be a neved és a vállalkozásodat, a többit megbeszéljük. Egy munkanapon belül személyesen válaszolok.</p>
            </div>
            <div className="sig-ct-bg" aria-hidden>
              <canvas data-sig-name="" />
            </div>
            <form className="sig-form" data-sig-form="" action={MAIL} method="get">
              <label>
                <span className="sig-mono">Neved</span>
                <input name="nev" autoComplete="name" data-sig-in="name" />
              </label>
              <label>
                <span className="sig-mono">Vállalkozásod</span>
                <input name="ceg" autoComplete="organization" data-sig-in="biz" />
              </label>
              <label className="sig-form-wide">
                <span className="sig-mono">Mire van szükséged? (nem kötelező)</span>
                <textarea name="uzenet" rows={3} data-sig-in="msg" />
              </label>
              <div className="sig-form-go">
                <a href={MAIL} className="sig-btn sig-btn--ink" data-sig-send="mail" data-track="urlap_kuldes">
                  <span>Elküldöm e-mailben</span>
                </a>
                <a href={SMS} className="sig-btn sig-btn--line" data-sig-send="sms" data-track="sms">
                  <span>Inkább SMS-ben</span>
                </a>
                <a href={`tel:${PHONE_TEL}`} className="sig-btn sig-btn--line" data-track="hivas">
                  <span>Hívj: {PHONE}</span>
                </a>
                <p className="sig-form-note sig-mono" data-sig-note="" role="status" aria-live="polite" />
              </div>
            </form>
            <ul className="sig-nap">
              <li>
                <span className="sig-mono">Telefon</span>
                <a href={`tel:${PHONE_TEL}`} data-track="hivas">
                  {PHONE}
                </a>
              </li>
              <li>
                <span className="sig-mono">E-mail</span>
                <a href={`mailto:${EMAIL}`} data-track="email">
                  {EMAIL}
                </a>
              </li>
              <li>
                <span className="sig-mono">Hol</span>
                <span>Szombathely, Vas megye</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="sig-ft" data-theme="night">
        <div className="sig-wrap">
          <Wordmark className="sig-ft-wm" title="HRVT" />
          <div className="sig-ft-row">
            <p>
              Egyedi weboldal készítés Szombathelyen és Vas megyében. <br />A vállalkozás bejegyzése folyamatban van.
            </p>
            <p className="sig-mono">© 2026 HRVT</p>
          </div>
        </div>
      </footer>

      <div className="sig-bar" data-sig-bar-m="">
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
