/** Ádám's own photographs. Number plates are masked in every exported file. w/h = original aspect. */
export type Photo = { id: string; w: number; h: number; tag: string; alt: string };

export const CENTER: Photo = { id: "00", w: 1600, h: 2000, tag: "Portré", alt: "Fekete-fehér portré: férfi baseballsapkában egy mezei földúton, a telefonját nézi." };

/** Tunnel order: mixed on purpose, so neighbouring photos differ in colour and subject. */
export const PHOTOS: Photo[] = [
  { id: "03", w: 1125, h: 2000, tag: "Autó", alt: "Ezüst BMW kombi szemből, égő fényszórókkal, ipari acélhíd alatt, borús ég alatt." },
  { id: "01", w: 1600, h: 2000, tag: "Természet", alt: "Mohával benőtt zsindelytető egy sötétzöld fakunyhón, mögötte sötét lombok." },
  { id: "08", w: 1125, h: 2000, tag: "Pálya", alt: "Kék BMW M2 hátulja egy boxutcai garázs kapujában, a háttérben nézők a korlátnál." },
  { id: "06", w: 1125, h: 2000, tag: "Építészet", alt: "Állványzattal körbevett templomtorony vörös cseréptetők fölött, kék ég, fehér felhők." },
  { id: "10", w: 1713, h: 2000, tag: "Autó", alt: "Fekete BMW M4 szemből, világító fényszórókkal, egy parkolóház tetején." },
  { id: "05", w: 1125, h: 2000, tag: "Részlet", alt: "Narancs-fekete mintás objektív-napellenző egy fa asztalon, zöld, elmosódott háttér előtt." },
  { id: "14", w: 1125, h: 2000, tag: "Pálya", alt: "Ezüst Porsche GT4 RS hátulja szárnnyal, mellette egy narancssárga autó." },
  { id: "02", w: 1125, h: 2000, tag: "Természet", alt: "Zöld fakunyhó az erdő szélén egy út mellett, előtte két útjelző karó." },
  { id: "11", w: 1125, h: 2000, tag: "Pálya", alt: "Fehér versenysisak mikrofonnal egy piros autó tetején." },
  { id: "07", w: 1333, h: 2000, tag: "Építészet", alt: "Épülethomlokzat narancs lamellákkal és Melea felirattal, előtérben lombok." },
  { id: "15", w: 1333, h: 2000, tag: "Pálya", alt: "Kék BMW M2 eleje közelről a boxutcában, mögötte emberek és autók." },
  { id: "09", w: 1125, h: 2000, tag: "Részlet", alt: "Porsche kormány közelről, a középen a címerrel, elmosódott keretben." },
  { id: "04", w: 1125, h: 2000, tag: "Autó", alt: "Ezüst BMW kombi ipari csőhidak és kémény előtt, nedves aszfalton." },
  { id: "12", w: 1125, h: 2000, tag: "Részlet", alt: "Narancssárga Mazda MX-5 kormánya a nyitott tető felől nézve." },
  { id: "13", w: 1125, h: 2000, tag: "Pálya", alt: "Versenyautó belseje a nyitott ajtón át: kormány, bukócső, piros kesztyű a műszerfalon." },
  { id: "16", w: 909, h: 1616, tag: "Részlet", alt: "Fehér-piros-kék sportcipők az aszfalt fölött, egy pálya mellett." },
];
