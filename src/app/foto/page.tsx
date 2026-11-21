import { Foto } from "@/components/foto/Foto";
import { CENTER, PHOTOS } from "@/lib/photos";
import { EMAIL, PHONE_TEL } from "@/lib/content";

const SITE = "https://hrvt.vercel.app";
const LD = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "HRVT — fotók",
  url: `${SITE}/foto`,
  author: { "@type": "Organization", name: "HRVT", url: SITE, email: EMAIL, telephone: PHONE_TEL },
  image: [CENTER, ...PHOTOS].map((p) => ({ "@type": "ImageObject", contentUrl: `${SITE}/foto/f/${p.id}.webp`, description: p.alt, width: p.w, height: p.h })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <Foto />
    </>
  );
}
