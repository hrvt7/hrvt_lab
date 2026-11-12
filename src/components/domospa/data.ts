// Every price and fact below comes from domospa.hu (pages: /, /jakuzzik, /medencek, /szaunak, /kerti-grillek, /pergolak, /domofire), read on 2026-11-12.
export const PHONE = "+36 20 500 7559"; export const PHONE_TEL = "+36205007559";
export const PHONE2 = "+36 94 505 000"; export const PHONE2_TEL = "+3694505000";
export const EMAIL = "info@domospa.hu";
export const ADDRESS = "9700 Szombathely, Vépi út 8.";
export const MAP = "https://maps.google.com/?q=domoSPA%2C%20V%C3%A9pi%20%C3%BAt%208%2C%20Szombathely";
export const FB = "https://www.facebook.com/domospa.hu"; export const IG = "https://www.instagram.com/domospa.hu/";

export type P = { n: string; p: number; was?: number; note?: string; tag?: string; img?: string };
export const CATS: { id: string; name: string; unit: string; items: P[] }[] = [
  { id: "jakuzzi", name: "Jakuzzik", unit: "Wellis jakuzzi", items: [
    { n: "Firenze", note: "2 fekvő, 1 ülő hely", p: 2399000, was: 3025000, img: "/domospa/tub-firenze.webp" },
    { n: "Manhattan", note: "1 fekvő, 2 ülő hely", p: 2499000, was: 3225000, tag: "Raktáron", img: "/domospa/tub-manhattan.webp" },
    { n: "Budapest Life Deluxe", note: "2 fekvő, 3 ülő hely", p: 2499000, was: 3575000, tag: "Bemutató darab", img: "/domospa/tub-budapest.webp" },
    { n: "Budapest Deluxe Midnight Onyx", note: "2 fekvő, 3 ülő hely", p: 2599000, was: 3575000, tag: "Bemutató darab", img: "/domospa/tub-midnight.webp" },
    { n: "Moana Deluxe", note: "2 fekvő, 1 ülő hely", p: 2699000, was: 3450000 },
    { n: "Palermo Ice White", note: "2 fekvő, 3 ülő hely", p: 2899000, was: 4075000, tag: "Raktáron" },
    { n: "Matrix Deluxe", note: "2 fekvő, 3 ülő hely", p: 2990000, was: 4125000 },
    { n: "Palermo Sterling Silver", note: "2 fekvő, 3 ülő hely", p: 3099000, was: 4075000, tag: "Raktáron" },
    { n: "Atlas Life Deluxe", note: "1 fekvő, 5 ülő hely", p: 3799000, was: 5325000, tag: "Raktáron" },
    { n: "Everest Life Deluxe", note: "2 fekvő, 3 ülő hely", p: 5399000, was: 6925000 },
  ] },
  { id: "medence", name: "Medencék", unit: "Wellis medence", items: [
    { n: "Elba Deluxe swimspa", p: 6499000, was: 9350000, img: "/domospa/swimspa.webp" },
    { n: "Beach Club Deluxe úszómedence", p: 6599000, was: 8750000 },
    { n: "Danube Riverjet Life swimspa", note: "1 személyes úszótér, 2 ülőhely", p: 7199000, was: 9490000 },
    { n: "Amazonas Grand Prix swimspa", p: 10990000, was: 14290000 },
    { n: "Rio Grande W-Flow swimspa", p: 11990000, was: 15390000 },
  ] },
  { id: "szauna", name: "Szaunák", unit: "Wellis szauna", items: [
    { n: "Helios hemlock infraszauna", note: "1 személyes", p: 374900, was: 749900, tag: "Bemutató darab", img: "/domospa/sauna.webp" },
    { n: "Igneus hemlock finn szauna", p: 674900, tag: "Bemutató darab" },
  ] },
  { id: "grill", name: "Grillek, kemencék", unit: "Kerti sütés", items: [
    { n: "Cherokee Silver Quintet gázgrill", note: "5 égő", p: 139950, was: 279900, img: "/domospa/grill.webp" },
    { n: "Cherokee Silver Trio gázgrill", note: "3 égő", p: 149900, was: 229900 },
    { n: "Capri top kemence", p: 329900 },
    { n: "Capri kemence", p: 359900, was: 439900 },
    { n: "Capri grande kemence", p: 649900, was: 789900, img: "/domospa/oven.webp" },
  ] },
  { id: "pergola", name: "Pergolák", unit: "Wellis pergola", items: [
    { n: "MotionFlex 300 bioklimatikus pergola", note: "fehér LED világítással", p: 1549900, img: "/domospa/pergola.webp" },
    { n: "MotionFlex 400 bioklimatikus pergola", note: "fehér LED világítással", p: 1699900 },
    { n: "Oldalárnyékoló MotionFlex 300-hoz", p: 379900 },
    { n: "Oldalárnyékoló MotionFlex 400-hoz", p: 499900 },
    { n: "Motoros oldalárnyékoló MotionFlex 400-hoz", p: 599900 },
  ] },
];
export const FAQ: [string, string][] = [
  ["Meg tudom nézni élőben, mielőtt döntök?", "Igen. A 400 m²-es bemutatóteremben a jakuzzik, szaunák, grillek és kerti bútorok egy helyen láthatók, hétköznap 8:00 és 16:30 között."],
  ["Mi vihető el azonnal?", "Több jakuzzi raktáron van, a bemutató darabok pedig kedvezménnyel megvehetők. A pontos készletet telefonon tudjuk megmondani."],
  ["Mennyibe kerül a szauna kiszállítása és összeszerelése?", "A szaunák ára ezt nem tartalmazza. Vas megyében 80 000 Ft, Győr-Moson-Sopron, Veszprém és Zala megyében 120 000 Ft."],
  ["Van kedvezmény, ha jakuzzit és pergolát együtt veszek?", "Igen, jakuzzi és pergola együttes vásárlásánál 10% kedvezmény jár. A részleteket az ajánlatban írjuk meg."],
  ["Egyedi méretű szaunát is kérhetek?", "Igen. Finn, infra és kombinált szaunát is készítünk, típusméretben vagy egyedi kivitelben."],
  ["Kandalló és cserépkályha is van?", "Igen, ez a Domofire területe: épített cserépkályhák és kandallók, valamint mobil kandallók, kályhák és kemencék."],
];
