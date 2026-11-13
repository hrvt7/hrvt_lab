export const EMAIL = "hrvtadam.7@icloud.com";
export const PHONE = "+36 30 525 2336";
export const PHONE_TEL = "+36305252336";

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
    lede: "Olyan weboldal, ami megállítja a görgetést, és csak a te cégedről szól.",
    body: "Nem sablonból dolgozom. Az arculat, az elrendezés és a mozgás a céged saját anyagaiból születik, elsőként telefonra tervezve. Így az oldaladat senki sem téveszti össze a szomszédéval.",
    tags: ["Egyedi arculat", "Animáció", "Mobilra tervezve", "Sablon nélkül"],
    viz: "web",
  },
  {
    n: "02",
    title: "Fejlesztés",
    lede: "Kézzel írt, gyors kód, oldalépítő és bővítményhalom nélkül.",
    body: "Az oldalt az alapoktól építem fel, ezért gyorsan betölt, és nem kell hetente frissítgetni. Élesítés előtt telefonon és laptopon is végigtesztelem, a sebességét pedig megmérem.",
    tags: ["Next.js", "Gyors betöltés", "Tesztelve", "Karbantartható"],
    viz: "code",
  },
  {
    n: "03",
    title: "Szöveg és keresők",
    lede: "Megírom, amit a vevőd tudni szeretne, úgy, hogy a kereső is megtalálja.",
    body: "A címsorok és a leírások a látogató kérdéseire válaszolnak. A keresőoptimalizálás, a Google-cégprofil és a strukturált adatok gondoskodnak arról, hogy a Google és az AI-keresők is értsék, mivel foglalkozol.",
    tags: ["Szövegírás", "Keresőoptimalizálás", "Google-cégprofil", "AI-keresők"],
    viz: "ai",
  },
  {
    n: "04",
    title: "Űrlap és foglalás",
    lede: "Egy érdeklődő se vesszen el: az ajánlatkérés azonnal hozzád érkezik.",
    body: "Ajánlatkérő, időpontfoglaló vagy rendelési űrlap készül, amelyikre az üzletednek szüksége van. Minden beérkező kérésről azonnal értesítést kapsz, és mérjük, melyik gomb hozza az érdeklődőket.",
    tags: ["Ajánlatkérés", "Időpontfoglalás", "Értesítés", "Mérés"],
    viz: "flow",
  },
] as const;

/** "Weboldal, kulcsrakészen" — everything a site needs, in the order it happens. */
export const TURNKEY = [
  ["Tervezés", "Egyedi arculat és elrendezés a céged saját anyagaiból."],
  ["Szöveg", "Címsorok és leírások, amelyek a vevőid kérdéseire válaszolnak."],
  ["Kép és mozgás", "A saját fotóidból dolgozom; ha kell, AI-val készült kép és videó egészíti ki."],
  ["Fejlesztés", "Gyors, kézzel írt kód. Telefonon ugyanolyan jól működik, mint laptopon."],
  ["Űrlap és foglalás", "Ajánlatkérés, időpontfoglalás vagy rendelés: ami az üzletedhez kell."],
  ["Keresők", "Keresőoptimalizálás és Google-cégprofil, hogy az AI-keresők is megtaláljanak."],
  ["Domain és tárhely", "Beállítom, élesítem, és a régi oldaladat is átköltöztetem."],
  ["Mérés és karbantartás", "Látod, mi hoz érdeklődőt, és az indulás után sem tűnök el."],
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Megértés",
    body: "Egy rövid hívásban megbeszéljük, mivel foglalkozol, kik a vevőid, és mit vársz az oldaltól. Ebből egyoldalas terv készül, rögzített keretekkel.",
  },
  {
    n: "02",
    title: "Terv",
    body: "Néhány napon belül kapsz egy kattintható vázlatot: az oldal szerkezetét, a szövegeket és a látvány irányát. Könnyebb dönteni arról, ami már kézzelfogható.",
  },
  {
    n: "03",
    title: "Építés",
    body: "Megírom az éles kódot, tesztelek, és megmérem a sebességet. A legtöbb figyelem arra jut, amit nem látsz: a telefonos nézetre, a keresőkre és a betöltési időre.",
  },
  {
    n: "04",
    title: "Élesítés",
    body: "Beállítom a domaint és a tárhelyet, elindítjuk az oldalt, és bekapcsoljuk a mérést. Utána sem tűnök el: a valódi látogatókból mindig kiderül valami, amin érdemes javítani.",
  },
] as const;

/** Questions people ask before ordering; every answer restates something the page already promises. */
export const FAQ = [
  ["Sablonból vagy oldalépítőből dolgozol?", "Nem. Az oldalt az alapoktól, kézzel írt kóddal építem fel, ezért gyorsan betölt, és nem kell hetente frissítgetni."],
  ["Ki írja a szöveget, és honnan lesznek képek?", "A szöveget én írom meg abból, amit a cégedről elmondasz. A képekhez a saját fotóidból dolgozom; ha kell, AI-val készült kép és videó egészíti ki."],
  ["Mi lesz a régi oldalammal és a domainnel?", "A domaint és a tárhelyet beállítom, az új oldalt élesítem, és a régi oldaladat is átköltöztetem."],
  ["Mennyibe kerül, és mikorra lesz kész?", "Ez a feladattól függ. Az első hívás után egyoldalas tervet kapsz, rögzített keretekkel, így előre tudod, mire számíthatsz."],
  ["Mi történik az élesítés után?", "Bekapcsoljuk a mérést, így látod, melyik gomb hozza az érdeklődőket. Utána sem tűnök el: a valódi látogatókból mindig kiderül valami, amin érdemes javítani."],
] as const;
