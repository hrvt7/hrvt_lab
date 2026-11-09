export const EMAIL = "hrvtadam.7@icloud.com";

export const NAV = [
  { label: "Szolgáltatások", href: "#szolgaltatasok" },
  { label: "Munkák", href: "#munkak" },
  { label: "Folyamat", href: "#folyamat" },
];

/** Words that roll in the hero: "Szoftvert építek, ami ___." */
export const HERO_WORDS = ["dolgozik", "elad", "spórol", "lenyűgöz"];

export const SERVICES = [
  {
    n: "01",
    title: "AI-rendszerek",
    lede: "AI, ami a te adataidon dolgozik — nem egy újabb chatablak.",
    body: "Asszisztensek és ügynökök, amelyek dokumentumokat, terveket és e-maileket dolgoznak fel, ajánlatot készítenek, ügyfeleknek válaszolnak, vagy a céged tudásából keresnek. Ellenőrizhető válaszokkal, korlátokkal, éles használatra.",
    tags: ["AI-ügynökök", "Dokumentum- és tervfeldolgozás", "Belső tudásbázis", "Ügyfélszolgálat"],
    viz: "ai",
  },
  {
    n: "02",
    title: "Automatizálás",
    lede: "Ami ma kézzel megy, holnap magától fut.",
    body: "Ajánlatkérés → CRM → e-mail → számla. Összekötöm a rendszereidet, és kiveszem a folyamatból az ismétlődő munkát. Hibakezeléssel és értesítéssel, hogy semmi ne álljon le csendben.",
    tags: ["n8n / Make", "API-integráció", "Lead-folyamatok", "Riportok"],
    viz: "flow",
  },
  {
    n: "03",
    title: "Egyedi szoftver",
    lede: "Belső eszközök és SaaS — attól, ami a fejedben van, az élesig.",
    body: "Webes alkalmazások, adminfelületek, dashboardok, SaaS MVP. Gyors, kattintható prototípussal indulunk, és tiszta, karbantartható kóddal élesítünk.",
    tags: ["Webalkalmazás", "Dashboard", "SaaS MVP", "Supabase / Next.js"],
    viz: "code",
  },
  {
    n: "04",
    title: "Weboldalak",
    lede: "Prémium oldalak, amik megállítják a görgetést — és el is adnak.",
    body: "Egyedi design és mozgás, mérhető sebesség, konverzióra épített szerkezet. Landing oldaltól a teljes márkaoldalig, sablonok nélkül.",
    tags: ["Art direction", "Animáció", "Landing oldal", "SEO-alapok"],
    viz: "web",
  },
  {
    n: "05",
    title: "Interaktív 3D",
    lede: "A termékedet a vevő forgatja, szétszedi és beárazza.",
    body: "3D termékkonfigurátorok élő árazással és ajánlatkéréssel, valamint interaktív termékmagyarázók gyári CAD/STEP-fájlokból. Böngészőben, telepítés nélkül, mobilon is.",
    tags: ["Three.js / WebGL", "Konfigurátor", "CAD / STEP", "Ajánlatkérés"],
    viz: "gear",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Megértés",
    body: "Egy rövid hívás: mi a cél, hol megy el az idő és a pénz, és hogyan néz ki a siker számokban. Ebből lesz egy egyoldalas terv, fix kerettel.",
  },
  {
    n: "02",
    title: "Prototípus",
    body: "Napokon belül kapsz valamit, amire kattintani lehet. A döntések gyorsabbak, ha kézzelfoghatók.",
  },
  {
    n: "03",
    title: "Építés",
    body: "Éles kód, tesztelés, teljesítmény. Amit nem látsz — a hibakezelés, a biztonság, a sebesség —, abba kerül a legtöbb figyelem.",
  },
  {
    n: "04",
    title: "Élesítés",
    body: "Indulás, mérés, finomítás. Utána sem tűnök el: a valódi felhasználók mindig tanítanak valami újat a termékről.",
  },
] as const;
