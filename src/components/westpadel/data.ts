// Every fact below comes from westpadel.hu (pages: /, /foglalas-arak, /padel-palyaink, /szolgaltatasok, /esemenyek, /kapcsolat).
export const BOOK = "https://foglalas.westpadel.hu/Customer/Reservation";
export const PHONE = "+36 70 720 0272";
export const PHONE_TEL = "+36707200272";
export const EMAIL = "info@westpadel.hu";
export const ADDRESS = "9700 Szombathely, Galamb József utca 6.";
export const MAP = "https://maps.google.com/?q=Galamb%20J%C3%B3zsef%20utca%206%2C%20Szombathely";
export const FB = "https://www.facebook.com/profile.php?id=61573070000076";
export const IG = "https://www.instagram.com/westpadelhungary/";
export const ASZF = "https://westpadel.hu/West%20Padel.pdf";

/** Ft / fő / óra */
export const PRICE = { dupla: { nappal: 3000, este: 3500, fo: 4 }, egyeni: { nappal: 4000, este: 4500, fo: 2 } } as const;
/** Pályabérlet edzővel, pályadíjjal együtt (Ft), 1–4 fő */
export const COACH = [15000, 17000, 18000, 19000];
export const EXTRA = { uto: 1300, labdaUj: 3000, labdaBerles: 1000 };
export const PASSES = [
  { name: "START", pay: 50000, get: 56000 },
  { name: "PRO", pay: 100000, get: 113000 },
  { name: "ELITE", pay: 150000, get: 172000 },
];
export const COACHES = [
  { name: "Tájmel Kristóf", img: "/westpadel/coach-b.webp", href: "https://westpadel.hu/edzok/4" },
  { name: "Németh Máté", img: "/westpadel/coach-a.webp", href: "https://westpadel.hu/edzok/2", langs: "Magyarul, angolul és németül" },
];
export const EVENTS = [
  { d: "2025. szeptember 20.", n: "Soft Opening", t: "Nyitónap, kötetlen játék" },
  { d: "2025. október 3.", n: "1. West Padel Verseny", t: "A klub első versenye" },
  { d: "2025. november 22.", n: "West Padel x The Print", t: "Padel Jamboree" },
  { d: "2026. február 21.", n: "I. West Padel HPT3 CUPRA", t: "Hungarian Padel Tour, MAPASZ ranglista-verseny" },
  { d: "2026. április 25.", n: "West Padel x Grund Pub", t: "1. klubranglistás verseny, egész nap" },
  { d: "2026. augusztus 21.", n: "AlpokDent Summer Closing Cup", t: "Nyárzáró torna" },
  { d: "2026. szeptember 26–27.", n: "1st Birthday Open & Party", t: "Születésnapi torna, több mint 1 300 000 Ft összdíjazás" },
];
export const FAQ: [string, string][] = [
  ["Kell hozzá tudni teniszezni?", "Nem. A padel könnyen tanulható, már az első alkalommal lehet sikerélményed. Ha szeretnél, edzővel is kezdhetsz."],
  ["Nincs ütőm és labdám. Baj?", "Nem baj. Ütőt 1 300 Ft-ért bérelhetsz egy órára, három használt labdát 1 000 Ft-ért, három újat 3 000 Ft-ért vehetsz."],
  ["Csak hárman vagyunk. Mit tegyünk?", "Írj nekünk, és segítünk hasonló szintű játékostársat találni. Ez a szolgáltatás ingyenes."],
  ["Hogyan fizethetek?", "Online a foglaláskor, vagy a recepción készpénzzel és bankkártyával. A bérleteket a recepción lehet megvenni."],
  ["Mi van, ha le kell mondanom?", "A foglalás előtti 24 órán belüli lemondásnál a pályadíj 50%-a fizetendő. A részletek az ÁSZF-ben vannak."],
  ["Van parkoló és öltöző?", "Igen. A parkolás ingyenes, az öltözőkben zuhanyzó is van, játék után pedig ott a büfé."],
];
