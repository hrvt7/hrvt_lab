import { Site } from "@/components/motion/Site";
import { FAQ, PRICES, EMAIL, PHONE_TEL, INSTAGRAM, WORK, STEPS } from "@/components/motion/data";

const SITE = "https://hrvt.vercel.app";
const LD = [
  {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "HRVT — SaaS Motion Design", url: `${SITE}/`, email: EMAIL, telephone: PHONE_TEL, sameAs: [INSTAGRAM],
    description: "High-end motion design for SaaS products: 30–60 second product videos, feature explainers and UI animations.",
    areaServed: "Worldwide", image: `${SITE}/motion/orlo.webp`,
    makesOffer: PRICES.map((p) => ({ "@type": "Offer", name: p.name, priceCurrency: "USD", priceSpecification: { "@type": "PriceSpecification", minPrice: p.min, ...("max" in p ? { maxPrice: p.max } : {}), priceCurrency: "USD" } })),
  },
  { "@context": "https://schema.org", "@type": "WebSite", name: "HRVT", url: `${SITE}/`, inLanguage: "en" },
  ...WORK.map((w) => ({ "@context": "https://schema.org", "@type": "VideoObject", name: `${w.name} — ${w.len} ${w.what}`, description: `${w.name}: ${w.line} A ${w.len} ${w.what}, motion design by HRVT.`,
    thumbnailUrl: `${SITE}/motion/${w.id}.webp`, contentUrl: `${SITE}/motion/${w.id}.mp4`, uploadDate: "2026-11-21", duration: "PT30S", creator: { "@type": "Organization", name: "HRVT" } })),
  { "@context": "https://schema.org", "@type": "HowTo", name: "How a SaaS product video is made with HRVT", totalTime: "P18D", step: STEPS.map(([n, t]) => ({ "@type": "HowToStep", name: n, text: t })) },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Site />
    </>
  );
}
