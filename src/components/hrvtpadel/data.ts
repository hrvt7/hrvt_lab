// HRVT PADEL is a fictional club made for HRVT concept demos. Every name, address, contact and event below is sample content;
// the price figures are sample values that show how the calculator and the passes work.
export const BOOK = "#kapcsolat";
export const PHONE = "+36 00 000 0000";
export const PHONE_TEL = "+36000000000";
export const EMAIL = "info@hrvtpadel.example";
export const ADDRESS = "Minta utca 1., 0000 Mintaváros";

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
  { name: "Főedző", note: "Kezdőktől a versenyzőkig" },
  { name: "Edző", note: "Gyerekek és felnőttek, több nyelven" },
];
export const EVENTS = [
  { d: "2027. január 16.", n: "Téli nyitó", t: "Kötetlen játék, első klubverseny" },
  { d: "2027. február 20.", n: "Páros Kupa", t: "Egész napos, szintek szerint" },
  { d: "2027. március 27.", n: "Klubranglista, 1. forduló", t: "Pontszerző torna" },
  { d: "2027. május 8.", n: "Közösségi est", t: "Játék, büfé, zene" },
  { d: "2027. június 12.", n: "Nyárnyitó Open", t: "Nyílt torna, díjazással" },
  { d: "2027. augusztus 21.", n: "Nyárzáró torna", t: "Páros torna, grill" },
  { d: "2027. szeptember 25–26.", n: "Születésnapi Open", t: "Kétnapos torna és parti" },
];
export const FAQ: [string, string][] = [
  ["Kell hozzá tudni teniszezni?", "Nem. A padel könnyen tanulható, már az első alkalommal lehet sikerélményed. Ha szeretnél, edzővel is kezdhetsz."],
  ["Nincs ütőm és labdám. Baj?", "Nem baj. Ütőt 1 300 Ft-ért bérelhetsz egy órára, három használt labdát 1 000 Ft-ért, három újat 3 000 Ft-ért vehetsz."],
  ["Csak hárman vagyunk. Mit tegyünk?", "Írj nekünk, és segítünk hasonló szintű játékostársat találni. Ez a szolgáltatás ingyenes."],
  ["Hogyan fizethetek?", "Online a foglaláskor, vagy a recepción készpénzzel és bankkártyával. A bérleteket a recepción lehet megvenni."],
  ["Mi van, ha le kell mondanom?", "A lemondás szabályait a foglalás előtt, a klub feltételeiben találod."],
  ["Van parkoló és öltöző?", "Igen. A parkolás ingyenes, az öltözőkben zuhanyzó is van, játék után pedig ott a büfé."],
];
