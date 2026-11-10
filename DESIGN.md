# HRVT — Design system v3 (Night & Kiwi, liquid)

**Concept:** bold color blocking and kinetic, condensed type. Night (#222222) is the base, Kiwi (#89E900) the single loud voice; whole sections flip to kiwi.

## Color
| Token | Hex | Use |
|---|---|---|
| night | #222222 | base background, text on kiwi |
| night-2 / 3 / 4 | #1a1a1a / #2c2c2c / #3a3a3a | deeper surfaces, cards, chips |
| kiwi | #89E900 | accent, CTAs, whole-section fields |
| paper | #F2F2EE | text on night |
| smoke / ash | #9A9A93 / #6A6A65 | secondary / tertiary text |

Ratio ≈ 60 night · 25 paper · 15 kiwi.

## Type
- **Rugis** — logo only, shipped as outlined SVG (`src/lib/logo.ts`), never as a webfont.
- **Big Shoulders Display (variable 100–900)** — all headlines, uppercase, line-height 0.98 (leaves room for Hungarian accents Á É Í Ó Ö Ő Ú Ü Ű).
- **Geist** — body. **Geist Mono** — labels, data, `[01]` indices.

## Motion vocabulary (all new)
1. **Kiwi curtain intro** — the Rugis wordmark draws itself, then the screen lifts away in 8 vertical strips.
2. **Weight lens** — hero letters thin out near the cursor (variable `wght` per letter); entrance animates weight 100 → 800.
3. **Slot word** — "Szoftvert építek, ami ___." rolls dolgozik / elad / spórol / lenyűgöz.
4. **Épül a szemed előtt (WebGL / three.js)** — the hero is a 520svh scroll scene with a sticky 3D canvas. Wireframe blocks float beside the headline; scrolling assembles them into an exploded page (01 Drótváz), fills them grey (02 Elrendezés), sweeps real textures in (03 Design), flattens the page to face the camera where a cursor clicks the CTA (04 Éles oldal), then the camera dives into the kiwi button and the screen becomes the kiwi Services section. Desktop builds a browser page, phones build a phone page. Collapses to a plain hero with reduced motion or no WebGL.
5. **Tube fill** — the "Weboldal, kulcsrakészen" rows fill with kiwi left to right as they cross the screen, text turning to ink. The contact section keeps the curved liquid rise.
6. **Stacked cards** — services stick and sink back (scale + dim) as the next one slides over.
7. **Live visualisations** — AI answer stream, automation graph with pulses, deploy log, self-assembling layout, 3D wireframe gear.
8. **Pixel resolve** — case images resolve from coarse kiwi-tinted pixels to full resolution.
9. **Strain-wave model** — computed 202/200-tooth harmonic gear, draggable.
10. **Odometer** — process step number rolls 01 → 04.
11. **Scramble** — mono labels decode from random glyphs on view and hover.
12. **Crosshair cursor** — with live page coordinates; becomes a kiwi tag on targets.
13. **Magnetic letters** — "Beszéljünk." leans toward the pointer.
14. **3D footer wordmark (WebGL)** — the Rugis wordmark extruded letter by letter; flips up on arrival, follows the pointer or the phone tilt with per-letter inertia, spins on tap. The flat SVG stays as fallback.

All of it respects `prefers-reduced-motion`.
