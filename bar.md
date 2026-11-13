# bar.md — ellenőrizhető mechanizmusok (HRVT főoldal v4)

Források: a választott koncepció („Nyers jelből kész oldal"), DESIGN.md, A1 Gallery mért értékek (ügynökségi hero: címsor medián 56 px, p75 80 px; címsor:törzs arány medián 3,4, p75 5,1; tartalomszélesség p75 1348 px; árnyék 7%, gradiens 13%). A premium-weboldal 0. lépés hat referenciaoldala ebből a munkamenetből nem volt elérhető (hálózati tiltólista), ezért a minőségkritikus a mechanizmusokat egyenként ellenőrzi, nem A/B képen.

1. Két szín dolgozik: Night #222222 alap és Kiwi #89E900; minden képernyőn legfeljebb egy kiwi CTA-gomb látszik a tartalomban (a nav és az alsó sáv gombján kívül). Lila, kék, gradiens, üveg, árnyék nincs.
2. A hero első képernyőjén a HRVT felirat ASCII-karakterekből felismerhető, és a H1 a képernyő alsó 45%-ában, legfeljebb 4 sorban, zavaró háttér nélkül olvasható.
3. A címsor legalább 3× akkora, mint a törzsszöveg (asztali H2 ≥ 60 px, törzs 16–20 px), és egy címsor legfeljebb 3 sor.
4. Minden szekcióban van olyan kódból rajzolt elem, amely a raszter-nyelvet beszéli (ASCII-cella, Bayer-pont, pontmátrix betű), és két szekció elrendezése nem azonos (nincs ismétlődő kártyarács).
5. Night és kiwi szekciók váltják egymást, legalább két teljes kiwi szekcióval; a váltás éle raszteres, nem egyenes vonal.
6. Mobilon (390×844) semmi nem lóg ki, a rögzített elem a képernyő legfeljebb felét takarja, a fő gomb a hero első képernyőjén látszik, és minden érinthető cél ≥ 44 px.
7. Sarok mindenhol 0 px, kivéve a tárcsát; vonalvastagság 1,5–2 px; a törzsszöveg sorhossza legfeljebb 75 karakter.
