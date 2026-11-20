// HRVT GALÉRIA: Ádám's own motorsport photo portfolio. Titles and stories describe only what is visible in each photo.
export type Work = {
  id: string; title: string; artist: string; year?: number; medium: string; story: string;
  /** canvas size on the wall in metres */ w: number; h: number;
  /** sample base price, Ft (A3, budget paper, unframed); without it the panel shows links instead of a shop */ base?: number;
  palette: string[]; style: 0 | 1 | 2 | 3;
  /** full-size image; imgM = lighter version for phones, imgT = small version shown from afar */ img?: string; imgM?: string; imgT?: string;
  shop?: string; video?: string;
};
export type GalleryConfig = {
  cls?: string; works: Work[];
  /** logo shown large on the wall at the end of the corridor */ endLogo?: { src: string; aspect: number; w?: number; wMobile?: number; framed?: boolean };
  /** titles are set in a script face: never split or clip them */ script?: boolean;
  logo: { src: string; w: number; h: number; label?: string; alt: string };
  note: string; noteLink?: { href: string; label: string };
  title: [string, string]; sub: string;
  /** header button: the cart counter, or a link to an outside shop */ shop?: { href: string; label: string };
  /** no shop and no cart: a pure portfolio */ noCart?: boolean;
  /** lightmaps baked in Blender for this corridor */ baked?: { base: string; segs: number; lmax: number; expo?: number; ver?: number };
  theme?: { serif: string; sans: string; accent: string; titlePx?: number };
};


export const WORKS: Work[] = [
  {"id": "sisak", "title": "Várakozás", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy bukósisak pihen egy piros autó tetején, a mikrofonja ragasztószalaggal rögzítve. Alatta a piros fényezés tükrözi vissza, mögötte elmosódik a paddock.\nA pillanat a futam előtt, amikor a felszerelés már kész, a sofőr még nincs ott.", "w": 0.872, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/sisak.webp?v=3", "imgM": "/galeria/sisak-m.webp", "imgT": "/galeria/sisak-t.webp"},
  {"id": "fekete-m4", "title": "Szemtől szemben", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy fekete BMW M4 egyenesen a kamerába néz. Csak a fényszórók világítanak, minden más a sötétbe olvad.\nSzimmetria, egyetlen fényforrás, semmi más.", "w": 1.328, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/fekete-m4.webp?v=3", "imgM": "/galeria/fekete-m4-m.webp", "imgT": "/galeria/fekete-m4-t.webp"},
  {"id": "nyitott-ajto", "title": "Indulás előtt", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy versenyautó nyitott ajtaja mögött a kormány, a műszerfalon piros kesztyű, lent a sisak.\nAz ajtókeret szűk résén át látszik minden, ami egy kör előtt számít.", "w": 0.871, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/nyitott-ajto.webp?v=3", "imgM": "/galeria/nyitott-ajto-m.webp", "imgT": "/galeria/nyitott-ajto-t.webp"},
  {"id": "boxutca", "title": "Boxutca", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Három sportautó áll egymás mellett a beton boxutcában, felhős ég alatt.\nAlacsony nézőpont, ahonnan az autók szélesebbnek, az ég nagyobbnak látszik.", "w": 0.871, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/boxutca.webp?v=3", "imgM": "/galeria/boxutca-m.webp", "imgT": "/galeria/boxutca-t.webp"},
  {"id": "narancs-roadster", "title": "Narancs", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy narancssárga nyitott autó kormánya az üveg mögül, az előtérben életlen karosszéria.\nA szín a főszereplő, a kormány csak keretet ad neki.", "w": 0.872, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/narancs-roadster.webp?v=3", "imgM": "/galeria/narancs-roadster-m.webp", "imgT": "/galeria/narancs-roadster-t.webp"},
  {"id": "cimer", "title": "Címer", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy kormány közepe közelről, a kép többi része elmosódik körülötte.\nRészlet, amit vezetés közben senki nem néz, álló autóban viszont minden figyelmet megkap.", "w": 0.871, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/cimer.webp?v=3", "imgM": "/galeria/cimer-m.webp", "imgT": "/galeria/cimer-t.webp"},
  {"id": "kek-m2", "title": "Kék", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy kék BMW M2 eleje a boxutcában, mögötte a lelátó és a készülődő emberek.\nAz autó éles, a nyüzsgés körülötte csak háttérzaj.", "w": 1.033, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/kek-m2.webp?v=3", "imgM": "/galeria/kek-m2-m.webp", "imgT": "/galeria/kek-m2-t.webp"},
  {"id": "gt4rs", "title": "Hátsó szárny", "artist": "Horváth Ádám", "medium": "Fotó", "story": "Egy ezüst Porsche hátsó szárnya és narancs felirata, mellette egy narancs autó éle.\nKét szín, két autó, egyetlen keskeny képkivágás.", "w": 0.872, "h": 1.55, "palette": ["#111", "#111", "#111", "#111"], "style": 0, "img": "/galeria/gt4rs.webp?v=3", "imgM": "/galeria/gt4rs-m.webp", "imgT": "/galeria/gt4rs-t.webp"},
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
  Math.round((((w.base ?? 0) + PAPERS[paper].add) * SIZES[size].mult + FRAMES[frame].add * (0.7 + SIZES[size].mult * 0.3)) / 500) * 500;

export const HRVT_GALLERY: GalleryConfig = {
  cls: "hg", noCart: true, works: WORKS,
  logo: { src: "/galeria/hrvt.svg", w: 2541, h: 907, label: "Fotó", alt: "HRVT Fotó" },
  note: "", title: ["HRVT", "Fotó"], sub: "Nyolc fotó a pályáról és a boxutcából.",
  endLogo: { src: "/galeria/logo-wall.png", aspect: 2048 / 732, w: 1.6, wMobile: 1.05 },
  theme: { serif: "Gloock, Georgia, serif", sans: '"Schibsted Grotesk Variable", sans-serif', accent: "#F8DD4A" },
};
