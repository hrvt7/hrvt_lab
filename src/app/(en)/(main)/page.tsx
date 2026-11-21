import { Site } from "@/components/motion/Site";
import { FAQ, PRICES, EMAIL, PHONE_TEL, INSTAGRAM, WORK, VERT, STEPS } from "@/components/motion/data";

const SITE = "https://hrvtmotion.com";
const BIZ = `${SITE}/#business`;
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService", "@id": BIZ, name: "HRVT — SaaS Motion Design", url: `${SITE}/`, email: EMAIL, telephone: PHONE_TEL, sameAs: [INSTAGRAM],
      description: "High-end motion design for SaaS products: 15–60 second product videos, feature explainers and UI animations.",
      areaServed: "Worldwide", address: { "@type": "PostalAddress", addressCountry: "HU" }, image: `${SITE}/motion/orlo.webp`, founder: { "@id": `${SITE}/#founder` },
      makesOffer: PRICES.map((p) => ({ "@type": "Offer", name: p.name, priceSpecification: { "@type": "PriceSpecification", minPrice: p.min, ...("max" in p ? { maxPrice: p.max } : {}), priceCurrency: "USD" } })),
    },
    { "@type": "Person", "@id": `${SITE}/#founder`, name: "Ádám", jobTitle: "SaaS Motion Designer", worksFor: { "@id": BIZ }, sameAs: [INSTAGRAM] },
    { "@type": "WebSite", "@id": `${SITE}/#website`, name: "HRVT", url: `${SITE}/`, inLanguage: "en", publisher: { "@id": BIZ } },
    ...WORK.map((w) => ({ "@type": "VideoObject", name: `${w.name} — ${w.len} ${w.what}`, description: `${w.name}: ${w.line} A ${w.len} ${w.what}, motion design by HRVT.`,
      thumbnailUrl: `${SITE}/motion/${w.id}.webp`, contentUrl: `${SITE}/motion/${w.id}.mp4`, uploadDate: "2026-11-21", duration: "PT30S", creator: { "@id": BIZ } })),
    ...VERT.map((v) => ({ "@type": "VideoObject", name: `${v.name} — 15s vertical video for an ${v.what}`, description: `${v.name}: ${v.line} A 15-second 9:16 product video, motion design by HRVT.`,
      thumbnailUrl: `${SITE}/motion/${v.id}.webp`, contentUrl: `${SITE}/motion/${v.id}.mp4`, uploadDate: "2026-11-21", duration: "PT15S", creator: { "@id": BIZ } })),
    { "@type": "HowTo", name: "How a SaaS product video is made with HRVT", totalTime: "P18D", step: STEPS.map(([n, t]) => ({ "@type": "HowToStep", name: n, text: t })) },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Site />
    </>
  );
}
