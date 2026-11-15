/** SMASH car shoot. Photos by @sz_geri; the plates are SMASH vanity plates and stay visible (owner's brand). */
export type Shot = { id: string; tag: string; alt: string };

export const IG_SMASH = "https://www.instagram.com/1kocsis/";
export const IG_PHOTO = "https://www.instagram.com/sz_geri/";

/** Blurred backdrop behind the whole page; also appears in the gallery. */
export const HERO_ID = "11";

/** Gallery order: alternates wide pair shots with close details so neighbours differ. */
export const SHOTS: Shot[] = [
  { id: "05", tag: "Duó", alt: "A fekete Audi RS e-tron GT és a zöld Aston Martin Vantage hátulról egy parkolóház tetején, naplementés felhők alatt." },
  { id: "01", tag: "Audi", alt: "Az Audi hátsó lámpája közelről, világító piros nyílmintával, mögötte betonfal." },
  { id: "11", tag: "Vantage", alt: "Férfi napszemüvegben a zöld Aston Martin Vantage-nek dőlve, mögötte a fekete Audi." },
  { id: "04", tag: "Részlet", alt: "Arany kovácsolt felni piros féknyereggel a fekete Audin." },
  { id: "07", tag: "Duó", alt: "A fekete Audi szemből, égő fényszórókkal, mellette a zöld Vantage hátulról, narancs naplemente." },
  { id: "03", tag: "Belső", alt: "Az Audi kormánya és digitális műszerfala, lila hangulatvilágítással." },
  { id: "08", tag: "Este", alt: "A két autó hátulról este, piros lámpafénnyel, a parkolóház lehajtója előtt." },
  { id: "06", tag: "Audi", alt: "A fekete Audi RS e-tron GT szemből, égő fényszórókkal, betonfal előtt." },
  { id: "02", tag: "Részlet", alt: "Az Audi hátsó szárnya és lámpája, mögötte elmosódva a zöld Vantage." },
  { id: "10", tag: "Audi", alt: "A fekete Audi alacsony szögből, arany felnikkel, mögötte a zöld Vantage orra." },
  { id: "12", tag: "Részlet", alt: "Az Audi bal első fényszórója közelről, alkonyatkor." },
  { id: "09", tag: "Audi", alt: "A fekete Audi szemből, a szélvédőn tükröződő felhőkkel." },
];
