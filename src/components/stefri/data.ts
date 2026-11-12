// Forrás: stefri.hu (2026. novemberi árlista-kép, Rólunk, Kapcsolat). Az árak tájékoztató jellegűek, kilogrammra értendők, az áfát tartalmazzák.
export const PHONE = "+36 20 450 9387";
export const PHONE_TEL = "+36204509387";
export const PHONE2 = "+36 20 338 4981";
export const PHONE2_TEL = "+36203384981";
export const EMAIL = "minosegifelvagottak@gmail.com";
export const FB = "https://www.facebook.com/felvagott";
export const MESSENGER = "https://m.me/felvagott";
export const CATALOG = "https://online.pubhtml5.com/oayu/txff/#p=1";
export const wa = (text: string) => `https://wa.me/36204509387?text=${encodeURIComponent(text)}`;

export type Item = { n: string; p: number; u?: "db" };
export type Cat = { id: string; name: string; note?: string; items: Item[] };
const k = (n: string, p: number): Item => ({ n, p });
const d = (n: string, p: number): Item => ({ n, p, u: "db" });

export const CATS: Cat[] = [
  { id: "virsli", name: "Virsli és kolbász", items: [k("Berner virsli", 4340), k("Bécsi virsli", 3950), k("Csemege kolbász", 8770), k("Debreceni (5 pár)", 4200), k("Debreceni HU (4 db)", 3640), k("Debreceni sajtos HU", 3970), k("Főző kolbász", 3340), k("Grillkolbász sajtos", 4340), k("Sütőkolbász – bajor", 3660), k("Szafaládé", 3510), k("Mini virsli, mini debreceni", 4240), k("Magyaros kolbász", 4400), k("Dürre", 3840)] },
  { id: "felvagott", name: "Felvágott és szalámi", items: [k("Párizsi", 3690), k("Párizsi szeletelt", 3690), k("Turista", 3910), k("Turista mini", 3910), k("Bécsi felvágott", 4440), k("Feketeerdő felvágott", 5110), k("Pinkataller szeletelt", 4880), k("Sajtos felvágott", 5035), k("Szalonnás felvágott", 3920), k("Favágó", 3985), k("Lengyel felvágott", 4660), k("Pikáns (tavaszi) felvágott", 4285), k("Uzsonna darabolt", 3840), k("Pizzaszalámi", 5520), k("Húskenyér", 3240), k("Húskenyér – sajtos", 3540), k("Húskenyér – pikáns", 3315), k("Disznósajt", 3540), d("Májkrém: tökmagos, almás-tormás", 1200)] },
  { id: "sonka", name: "Sonka és füstölt áru", items: [k("Prágai sonka", 5220), k("Krakkói sonka", 4510), k("Pizzasonka", 3880), k("Szauna sonka", 4955), k("Füstölt csülök", 2550), k("Füstölt tarja", 4590), k("Füstölt-főtt frikandó", 4560), k("Füstölt-főtt császárszalonna", 4120), k("Bacon szeletelt", 5430), k("Szalonnavég", 2200)] },
  { id: "fagyasztott", name: "Gyorsfagyasztott", items: [k("Csirkemellfilé", 4860), k("Csirkecsíkok (tökmagos)", 5970), k("Pulyka Cordon", 5680), k("Sertés Cordon", 4660), k("Sertés szelet (120 g/szelet)", 4500), k("Pulyka szelet (120 g/szelet)", 4550), k("Panírozott ementáli", 4730), k("Alaszkai tőkehal (panírozott)", 5250), k("Fasírtpogácsa", 4550), k("Hagymakarika", 6000), k("Karfiol", 3100), k("Brokkoli", 3300), k("Cukkíni", 3200), k("Gomba", 3650), k("Szilvás gombóc", 4280), k("Nugátos gombóc", 6000), d("Fűszervaj", 1510), d("Töltött lángos (5 db/csomag, több ízben)", 1250)] },
  { id: "egyeb", name: "Sajt és egyéb", items: [k("Szeletelt sajt: Gouda, Edami", 4800), k("Darabolt Edami", 4800), k("Olajos tonhal", 4000), k("Krumplisaláta", 2140), k("Sertészsír", 2100)] },
];

export const FAQ: [string, string][] = [
  ["Mikor jön az autó hozzánk?", "Minden héten ugyanazon a napon, ugyanabban az időpontban. A te településed pontos idejét telefonon vagy WhatsAppon mondjuk meg, a fenti keresővel egy koppintás megkérdezni."],
  ["Kiszállítjátok házhoz is?", "Igen: 15 000 Ft feletti vásárlásnál, 10 km-es körzetben házhoz visszük a rendelést. Telefonon vagy üzenetben kérheted."],
  ["Honnan van az áru?", "Közvetlenül az osztrák gyártótól, a burgenlandi Stefri Frischeteamtől. Hetente kétszer hozunk friss árut."],
  ["Hogyan rendelhetek előre?", "Telefonon, WhatsAppon vagy Messengeren. A kínálatnál összeírhatod a listádat, és egy gombbal elküldheted nekünk."],
  ["Az árak véglegesek?", "Az árak tájékoztató jellegűek, kilogrammra értendők és az áfát tartalmazzák. A heti akciókat a Facebook-oldalunkon találod."],
];
