# progress — HRVT főoldal redesign („Nyers jelből kész oldal")

- Ág: `redesign/nyers-jel` (felhő-klón, commit és push nincs, Ádám kérésére vár)
- [x] 1. Üzleti kutatás + BRIEF-UZLETI.md
- [x] 2. Betűpár (Doto + Funnel Display, ő/ű ellenőrizve), bar.md
- [x] 3. DESIGN.md + építés
- [x] 4. design-loop-hrvt: 3 kör (alapértelmezett plafon), lásd lent
- [x] 5. SEO, strukturált adat (ProfessionalService + FAQPage), llms.txt, követés (data-track)
- [x] 6. build, képernyőképek 1440×900 / 390×844 / 375×667, Lighthouse mobil 97 / 100 / 100 / 100

## Design loop

| Darab | Brief | Rendszer | Minőség | Kör |
|---|---|---|---|---|
| Hero (asztali) | PASS | FAIL → javítva | FAIL | 3 |
| Szekciók (asztali) | FAIL → javítva | FAIL → javítva | FAIL | 3 |
| Mobil | PASS | FAIL (téves mérés) | FAIL | 3 |

### Hiánytörténet
- r1: a raszter a nav és a felső címke alatt olvashatatlan (hero, mind a 3); a nav háttér nélkül ütközik a tartalommal; nincs hívás-gomb; GYIK-válaszok glifazajban; GYIK sima lista.
- r2: az első képernyőn nem olvasható a HRVT; a lencse lágy „gömb"; két szekció zsákutca (nincs CTA); GYIK még lista.
- r3: wordmark nincs a margón (javítva); GYIK páros sorai felcserélve (javítva); a cégnév-raszter túllóg a margón (javítva); hívólink tap-targete (Playwright-mérés szerint ≥ 44 px, a kritikus becslése téves).
- Nyitva maradt (minőség): a hero raszter-mezeje egyenes vízszintes éllel ér véget, alatta külön szövegblokk; mobilon a 4 szolgáltatás ugyanazt a vertikális elrendezést kapja; a GYIK-nak nincs saját nagy, kódból rajzolt eleme (csak sor-mérő + raszter-függöny).

## Nyitott kérdések (Ádámtól)
- Árak, átfutási idő, mutatható referenciák, Google-cégprofil link.
- Rugis kereskedelmi licenc a logóhoz.

## Kreditkönyv
- Higgsfield: 0.
