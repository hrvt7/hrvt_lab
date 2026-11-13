# BRIEF-UZLETI — HRVT főoldal (hrvt.vercel.app), teljes redesign

## Választott irány (Ádám válaszai, 2026-11-13)
- **Feladat:** teljes redesign; a mostani hero lecserélhető.
- **Koncepció:** „Nyers jelből kész oldal" — az oldal durva ASCII- és pixelzajként indul, görgetésre éles, kész weboldallá tisztul; minden szekció a látogató szeme előtt „renderelődik ki", a kurzor visszabontja nyers jellé.
- **Merészség:** maximum (díjnyertes, kísérletező).
- **Technika (többszörös választás):** shader-háttér + generatív grafika (Canvas/SVG) + ASCII / pixel / dithering + kurzorra reagáló látvány + interaktív mikroanimációk.
  - HERO: shader-mező dithering/ASCII szűrőn át, a kurzor beletúr, ebből áll össze a HRVT felirat.
  - SZEKCIÓK: mindegyik saját generatív grafika, ugyanabban a dithering nyelvben.
  - MIKROINTERAKCIÓK: kódolt állapotgép (GSAP + SVG) Rive helyett, mert .riv fájl kódból nem készíthető.
- **Mobil:** külön mobil-elrendezés; a kurzort érintés + a telefon döntése (giroszkóp) helyettesíti. Az effekt nem marad el.
- **Szín:** Kiwi #89E900 + Night #222222 + Paper #F2F2EE (logó kit). A mostani sárga (#fedc00) megszűnik.
- **Munkahely:** felhőben, a repo klónján, `redesign/nyers-jel` ágon, push nélkül.

## Fő cél
- **Ajánlatkérés.** Fő gomb szövege: **„Kérek egy weboldalt"**.
- Másodlagos cél: **hívás** — „Hívj: +36 30 525 2336".

## 3 érv a versenytársakkal szemben (ellenőrizhető)
1. **Az oldal maga a bizonyíték.** A szombathelyi versenytársak (impulseDesign, Xsoft Media, Kanga Design, fkdev, Ghostlabs, FutureWeb, Pren Design) szövegben ígérnek „letisztult, modern, mobilbarát" oldalt; a HRVT oldalán a látogató saját kezével próbálja ki a kézzel írt grafikát.
2. **Kézzel írt kód, nem WordPress/saját CMS/sablon.** (FutureWeb: FutureCMS; Pressoft: jQuery/Bootstrap/Laravel; több versenytárs csomagalapú.) A HRVT Next.js-re épít, és a sebességet megméri.
3. **Egy ember, egy kézben:** design, szöveg, fejlesztés, keresők, élesítés — nincs ügynökségi átadogatás; válasz 1 munkanapon belül.

## Kulcsszavak
- `<title>`: „Weboldal készítés Szombathely – egyedi, sablon nélkül | HRVT"
- H1: kreatív, de érthető üzenet (nem szójáték): „Egyedi weboldalt készítek. Sablon nélkül."
- H2 (kötelező kulcsszó + település): „Weboldal készítés Szombathelyen, kulcsrakészen."
- További kifejezések: honlapkészítés Szombathely, webdesign Szombathely, egyedi weboldal, webfejlesztő Szombathely, weboldal készítés Vas megye, weboldal készítés árak, weboldal redesign, landing page készítés.

## Hangnem
Közvetlen, tegeződő, egyes szám első személy („készítek", „megírom"). Rövid mondatok, szakzsargon nélkül.

## GYIK / ellenvetések (a versenytársak oldalairól)
1. Mennyibe kerül egy weboldal? — **ár hiányzik, Ádámtól kérni** (a piacon: Kanga 299/599/799 ezer Ft csomagok; Xsoft csomagok; Ghostlabs egyedi ár).
2. Mennyi idő alatt készül el? — **hiányzik** (a jelenlegi szöveg: „néhány napon belül kattintható vázlat").
3. Később bővíthető? Tudom én szerkeszteni? — **válasz Ádámtól kell**.
4. Ki írja a szöveget, honnan lesznek a képek? — megvan (saját fotók, szövegírás része).
5. Mi lesz a régi oldalammal, domainnel? — megvan (átköltöztetés része).

## NAP
- Név: HRVT
- Cím: Szombathely, Vas megye (pontos cím nincs megadva)
- Telefon: +36 30 525 2336 · E-mail: hrvtadam.7@icloud.com
- Google-cégprofil: **nem találtam** — egyezés nem ellenőrizhető.

## Hiányzó adatok
- Árak vagy „-tól" ár; átfutási idő; GYIK 1–3. válasza.
- Referenciák: mely kész munkák mutathatók a főoldalon (a repo demói koncepciótervek).
- Vállalkozási forma, adószám (a lábléc szerint bejegyzés folyamatban).
- Google-cégprofil linkje.

## Kutatás forrásai
impulsedesign.hu/weboldal-keszites-honlaptervezes/szombathely · futureweb.hu/honlapkeszites-szombathely · prendesign.hu/referenciak/weboldal-keszites-szombathely · kangadesign.hu/vas-honlapkeszites.html · xsoft.hu/helyek/weboldal-keszites-szombathely · fkdev.hu · ghostlabs.hu · pressoft.hu (Szombathely) · kkaservices.com/hu/locatii/szombathely · hrvt.vercel.app (élő oldal)
