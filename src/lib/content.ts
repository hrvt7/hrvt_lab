export const EMAIL = "hrvtadam.7@icloud.com";

export const NAV = [
  { label: "Mit vállalok", href: "#szolgaltatasok" },
  { label: "Kulcsrakészen", href: "#weboldal" },
  { label: "Folyamat", href: "#folyamat" },
];

/** Words that roll in the hero: "Egyedi weboldalt építek, ami ___." */
export const HERO_WORDS = ["dolgozik", "elad", "megállít", "lenyűgöz"];

export const SERVICES = [
  {
    n: "01",
    title: "Egyedi design",
    lede: "Weboldal, ami megállítja a görgetést — és a te cégedről szól.",
    body: "Nincs sablon. Az arculat, az elrendezés és a mozgás a céged saját anyagaiból készül, telefonra tervezve. Olyan oldal, amit nem lehet összetéveszteni a szomszédéval.",
    tags: ["Egyedi arculat", "Animáció", "Mobilra tervezve", "Sablon nélkül"],
    viz: "web",
  },
  {
    n: "02",
    title: "Fejlesztés",
    lede: "Kézzel írt, gyors kód — nem oldalépítő, nem bővítményhalom.",
    body: "Az oldalt nulláról építem, ezért gyorsan tölt be, és nem kell hetente frissítgetni. Telefonon és laptopon is végigtesztelem, élesítés előtt mért sebességgel.",
    tags: ["Next.js", "Gyors betöltés", "Tesztelve", "Karbantartható"],
    viz: "code",
  },
  {
    n: "03",
    title: "Szöveg és keresők",
    lede: "Megírom, amit a vevő tudni akar — és úgy, hogy a kereső is megtalálja.",
    body: "Címsorok és leírások, amik a látogató kérdéseire válaszolnak. Keresőoptimalizálás, Google-cégprofil, strukturált adat, hogy a Google és az AI-keresők is értsék, mivel foglalkozol.",
    tags: ["Szövegírás", "SEO", "Google-cégprofil", "AI-keresők"],
    viz: "ai",
  },
  {
    n: "04",
    title: "Űrlap és foglalás",
    lede: "Az érdeklődő ne vesszen el: az ajánlatkérés rögtön hozzád fut be.",
    body: "Ajánlatkérő, időpontfoglaló vagy rendelési űrlap — ami a te üzletedhez kell. A beérkező kérésről azonnal értesítést kapsz, és mérjük, melyik gomb hoz érdeklődőt.",
    tags: ["Ajánlatkérés", "Időpontfoglalás", "Értesítés", "Mérés"],
    viz: "flow",
  },
] as const;

/** "Weboldal, kulcsrakészen" — everything a site needs, in the order it happens. */
export const TURNKEY = [
  ["Tervezés", "Egyedi arculat és elrendezés, a céged saját anyagaiból."],
  ["Szöveg", "Címsorok és leírások, amik a vevő kérdéseire válaszolnak."],
  ["Kép és mozgás", "A saját fotóidból, szükség esetén AI-val készített képpel és videóval."],
  ["Fejlesztés", "Gyors, kézzel írt kód. Telefonon ugyanolyan jó, mint laptopon."],
  ["Űrlap és foglalás", "Ajánlatkérés, időpontfoglalás, rendelés — ami a te üzletedhez kell."],
  ["Keresők", "SEO, Google-cégprofil, és hogy az AI-keresők is megtaláljanak."],
  ["Domain és tárhely", "Beállítom, élesítem, átköltöztetem a régit."],
  ["Mérés és karbantartás", "Látod, mi hoz érdeklődőt. Utána sem tűnök el."],
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Megértés",
    body: "Egy rövid hívás: mivel foglalkozol, kik a vevőid, és mit vársz az oldaltól. Ebből lesz egy egyoldalas terv, fix kerettel.",
  },
  {
    n: "02",
    title: "Terv",
    body: "Napokon belül kapsz valamit, amire kattintani lehet: az oldal szerkezetét, a szövegeket és a látvány irányát. A döntések gyorsabbak, ha kézzelfoghatók.",
  },
  {
    n: "03",
    title: "Építés",
    body: "Éles kód, tesztelés, sebesség. Amit nem látsz — a telefonos nézet, a keresők, a betöltési idő —, abba kerül a legtöbb figyelem.",
  },
  {
    n: "04",
    title: "Élesítés",
    body: "Domain, tárhely, indulás, mérés. Utána sem tűnök el: a valódi látogatók mindig tanítanak valami újat az oldalról.",
  },
] as const;
