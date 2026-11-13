# HRVT — Design system v4 („Nyers jelből kész oldal")

## Brief
Egyedi weboldal készítés, Szombathely. A látogató egy helyi vállalkozó, aki 10 másodperc alatt azt akarja látni: ez más, mint a sablonoldalak, és hogyan kérhet ajánlatot. Világ: jel, raszter, képpont. Az egy dolog: az oldal a szeme előtt renderelődik ki nyers ASCII-zajból éles weboldallá, és a keze (kurzor, ujj, a telefon döntése) visszabontja.

**Kerülendő (a sablon, amit nem készítünk):** kártyarács ikonokkal, harmonika-GYIK, lila gradiens, üveghatás, „Get started" gomb, stockfotó.

## Szín (logó kit, rögzített)
| Token | Hex | Szerep |
|---|---|---|
| night | #222222 | alap |
| night-2 / 3 | #1a1a1a / #2c2c2c | mélyebb felület, keret |
| kiwi | #89E900 | az egyetlen hangos hang: jel, CTA, egész szekciók |
| paper | #F2F2EE | szöveg nighton |
| smoke | #A8A8A0 | másodlagos szöveg (kontraszt nighton 6.6:1) |

Arány ≈ 60 night · 25 paper · 15 kiwi. Kiwi szekción a szöveg night (kontraszt 10.6:1).

## Betű (új pár ehhez az oldalhoz)
- **Doto** (variable, OFL, `@fontsource-variable/doto`) — a NYERS állapot: pontmátrix. Címsorok kiinduló alakja, számok, állapotjelzők. ő/ű/Ő/Ű ellenőrizve (fontTools).
- **Funnel Display** (variable 300–800, OFL, `@fontsource-variable/funnel-display`) — a KÉSZ állapot: éles címsor. ő/ű/Ő/Ű ellenőrizve.
- **Geist** törzsszöveg, **Geist Mono** címkék és ASCII-rámpa (kit).
- Logó: Rugis-ból körvonalazott SVG (`src/lib/logo.ts`), webfontként soha. A Rugis ingyenes változata csak személyes használatra szól: kereskedelmi licenc Ádámnál ellenőrizendő.
- Display line-height 1.02, ékezetnek hely.

## Rács és arányok
Tartalom max 1320 px, margó `clamp(18px, 3.4vw, 56px)`. Sarok: 0 (éles, raszteres világ); csak a tárcsa és a csomópontok kerekek. Árnyék nincs.

## Mozgás-szókincs (13, mind a koncepcióból)
1. **Jel-mező** — a hero WebGL fragment shadere: áramló zajmező Bayer-ditheringgel és ASCII-glifatlasszal, ebből áll össze a HRVT felirat.
2. **Felbontás-görgetés** — a hero görgetésre 22 px-es ASCII-cellákból 3 px-es raszteren át éles feliratig tisztul.
3. **Visszabontó lencse** — a kurzor körül a kép visszaesik durva cellákra és kitér; mobilon az ujj és a telefon döntése (giroszkóp) mozgatja a lencsét.
4. **Felbontás-tárcsa** — húzható tárcsa (állapotgép: nyugvó → fogva → visszarugózik), kézzel állítja a jelenet felbontását; billentyűvel is.
5. **Kirajzolódó jelenetek** — a négy vállalás kódból rajzolt képe (oldalterv, forráskód, találat, űrlap) görgetésre renderelődik ki.
6. **Pontmátrix-váltás** — a címsorok betűnként váltanak Doto-ról Funnel Displayre, elrendezés-ugrás nélkül.
7. **Render-sor** — a „kulcsrakészen" tételei munkafolyamatként futnak: várólistán → renderelés (ASCII-pörgő, blokk-sáv) → kész (kirajzolódó pipa).
8. **Váltottsoros összeállás** — a tételekkel együtt egy minioldal sávonként épül fel.
9. **Zajból tiszta jel** — a folyamat függőleges jelvonala fent zajos, lent egyenes; a görgetés húzza végig, a csomópontok állapotot váltanak.
10. **Dekódolt válasz** — a kérdésekre adott válaszok glifazajból fejtődnek ki, ahogy a képernyőre érnek.
11. **Neved a mezőben** — a kapcsolat-szekcióban a beírt cégnév óriás raszterként jelenik meg a háttérben.
12. **Raszteres átfordulás** — a night és kiwi szekciók közti él 75 / 50 / 25%-os raszter-sávokon vált.
13. **Gomb-állapotgép** — CTA: nyugvó → rámutatva menetelő képpont-keret → megnyomva „elküldve" visszajelzés.

Mind tiszteli a `prefers-reduced-motion` beállítást (álló, kész állapot). WebGL nélkül a hero éles SVG-feliratra esik vissza; tesztkapcsoló: `?gl=0`.

## Mobil
Külön elrendezés: a hero felirata 86vw, a szöveg alatta; a vállalások nem tűzöttek, blokkonként renderelődnek; a lencse érintésre és döntésre él; alul rögzített sáv (Ajánlatkérés · Hívás) a hero után.
