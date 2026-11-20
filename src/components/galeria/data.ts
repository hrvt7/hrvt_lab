// HRVT GALÉRIA: concept demo with Ádám's own motorsport photos. Titles and stories describe only what is visible; prices are samples.
export type Work = {
  id: string; room?: number; title: string; artist: string; year?: number; medium: string; story: string;
  /** canvas size on the wall in metres */ w: number; h: number;
  /** sample base price, Ft (A3, budget paper, unframed) */ base: number;
  palette: string[]; style: 0 | 1 | 2 | 3; img?: string;
};


export const WORKS: Work[] = [
  { id: "sisak", title: "Sisak a tetőn", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy bukósisak egy piros autó tetején, ragasztószalaggal megerősített mikrofonnal. A piros fényezés tükrözi vissza.", w: 0.872, h: 1.55, base: 24000, palette: ["#eaecec","#89060e","#1a1a1a","#d4d5d2"], style: 0, img: "/galeria/sisak.webp?v=2" },
  { id: "fekete-m4", title: "Szemből", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy fekete BMW M4 egyenesen a kamerába néz. Csak a fényszórók világítanak, minden más a sötétbe olvad.", w: 1.328, h: 1.55, base: 26000, palette: ["#a4abac","#040405","#8d8a7c","#3f3f3c"], style: 0, img: "/galeria/fekete-m4.webp?v=2" },
  { id: "nyitott-ajto", title: "Nyitott ajtó", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy versenyautó nyitott ajtaja mögött a kormány, a műszerfalon piros kesztyű, lent a sisak. Indulás előtti pillanat.", w: 0.872, h: 1.55, base: 24000, palette: ["#edede6","#241e1d","#aeb6ac","#c0272d"], style: 0, img: "/galeria/nyitott-ajto.webp?v=2" },
  { id: "boxutca", title: "Boxutca", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Három sportautó egymás mellett a beton boxutcában, felhős ég alatt.", w: 0.872, h: 1.55, base: 24000, palette: ["#c7c69a","#2d2d28","#767761","#2b4fb8"], style: 0, img: "/galeria/boxutca.webp?v=2" },
  { id: "narancs-roadster", title: "Narancs roadster", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy narancssárga nyitott autó kormánya az üveg mögül, előtérben életlen karosszéria.", w: 0.872, h: 1.55, base: 24000, palette: ["#c2916c","#110f0d","#e2592a","#57412c"], style: 0, img: "/galeria/narancs-roadster.webp?v=2" },
  { id: "cimer", title: "Címer", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy kormány közepe közelről, a kép többi része elmosódik körülötte.", w: 0.872, h: 1.55, base: 24000, palette: ["#a5a288","#0c0b08","#2f2c1e","#b8962e"], style: 0, img: "/galeria/cimer.webp?v=2" },
  { id: "kek-m2", title: "Kék M2", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy kék BMW M2 eleje a boxutcában, mögötte a lelátó és a készülődő pilóták.", w: 1.032, h: 1.55, base: 26000, palette: ["#9ea4aa","#1f5fd0","#13131b","#626c77"], style: 0, img: "/galeria/kek-m2.webp?v=2" },
  { id: "gt4rs", title: "GT4 RS", artist: "Horváth Ádám", medium: "Fotó, fine art nyomat", story: "Egy ezüst Porsche hátsó szárnya és narancs felirata, mellette egy narancs autó éle.", w: 0.872, h: 1.55, base: 24000, palette: ["#e9ecf1","#0e0d0f","#d2601e","#8892a5"], style: 0, img: "/galeria/gt4rs.webp?v=2" },
];

export const PAPERS = [
  { id: "alap", label: "Alap művészpapír", add: 0 },
  { id: "giclee", label: "Giclée fine art", add: 6000 },
  { id: "hahnemuhle", label: "Hahnemühle rézkarc", add: 14000 },
];
export const SIZES = [
  { id: "a3", label: "A3 · 30 × 42 cm", mult: 1 },
  { id: "a2", label: "A2 · 42 × 59 cm", mult: 1.6 },
  { id: "a1", label: "A1 · 59 × 84 cm", mult: 2.4 },
];
export const FRAMES = [
  { id: "nincs", label: "Keret nélkül", add: 0, color: null as string | null },
  { id: "fekete", label: "Fekete keret", add: 18000, color: "#1f1c18" },
  { id: "tolgy", label: "Tölgy keret", add: 22000, color: "#b88a57" },
];
export const priceOf = (w: Work, paper: number, size: number, frame: number) =>
  Math.round(((w.base + PAPERS[paper].add) * SIZES[size].mult + FRAMES[frame].add * (0.7 + SIZES[size].mult * 0.3)) / 500) * 500;
