# HRVT — Design System

The site is the portfolio. Every token below exists to make it feel engineered, not decorated.

## 1. Atmosphere

Dark, warm, cinematic. Light is treated as a material. The base is warm ink, not cold black. One hot
accent ("ember") is used like a lighting cue: rarely, and always with intent. There are no purple
gradients, no glassmorphism soup, no stock 3D blobs.

References absorbed:

- **Layers.** A shader-driven hero where atmosphere carries the brand.
- **Refero styles.** Midnight palette with a single bright accent, and an editorial grid.
- **Its Hover.** Icons that come alive on intent rather than on a timer.
- **Prompt Motion.** Motion described as choreography: easing, stagger and hold.
- **performative-ui and ui.live.** Near-black surfaces, mono metadata and "instrument panel" details.

## 2. Color

| Token        | Value     | Use                                 |
|--------------|-----------|-------------------------------------|
| `ink-950`    | `#080807` | Page background                     |
| `ink-900`    | `#0e0e0c` | Raised surfaces                     |
| `ink-800`    | `#171715` | Cards, wells                        |
| `ink-700`    | `#22211e` | Strong borders, hover fills         |
| `line`       | `rgba(236,233,226,.09)` | Hairlines             |
| `bone`       | `#ece9e2` | Primary text                        |
| `bone-2`     | `#a9a59c` | Secondary text                      |
| `bone-3`     | `#6b6862` | Tertiary text and metadata          |
| `ember`      | `#ff5a1f` | Accent: one per viewport, at most   |
| `ember-deep` | `#7a2207` | Shader shadows, glows               |

## 3. Typography

- **Display.** Archivo Variable, weight 600–760, width 100–112, tracking −0.045em, leading 0.86. It is a grotesk
  with mass, so headlines feel like they have weight.
- **Accent.** Instrument Serif Italic. Use it for one word per headline, the word that carries emotion.
- **Body.** Geist Variable, 400 and 500, leading 1.55.
- **Meta.** Geist Mono, 11–12 px, uppercase, tracking 0.14em. Use it for labels, indices, coordinates and time.

Fluid scale (clamp, viewport-driven):

| Step         | Size                              |
|--------------|-----------------------------------|
| `display-xl` | `clamp(3.4rem, 11.2vw, 13.5rem)`  |
| `display-l`  | `clamp(2.8rem, 7.4vw, 8.5rem)`    |
| `h2`         | `clamp(2.2rem, 4.6vw, 4.6rem)`    |
| `h3`         | `clamp(1.45rem, 2.2vw, 2.1rem)`   |
| `body-l`     | `clamp(1.06rem, 1.25vw, 1.3rem)`  |
| `body`       | `1rem`                            |
| `meta`       | `0.72rem`                         |

## 4. Space and grid

- 4 px base unit.
- Page margin: `clamp(20px, 4vw, 64px)`.
- Grid: 12 columns, gutter `clamp(16px, 2vw, 32px)`.
- Section rhythm: `clamp(7rem, 14vw, 13rem)` vertical padding.
- Hairline dividers instead of boxes. Space does the grouping.

## 5. Motion

| Token        | Value                          | Use                                    |
|--------------|--------------------------------|----------------------------------------|
| `ease-out`   | `cubic-bezier(.16,1,.3,1)`     | Reveals and entrances (expo-out)       |
| `ease-inout` | `cubic-bezier(.76,0,.24,1)`    | Curtains, wipes, page-level moves      |
| `dur-1`      | 0.35 s                         | Hover and micro-interactions           |
| `dur-2`      | 0.9 s                          | Element reveals                        |
| `dur-3`      | 1.4 s                          | Hero choreography                      |
| `stagger`    | 0.07 s per line, 0.025 s per char |                                     |

Principles:

1. **Masked line reveals.** Text never fades in from nothing. It rises out of its own baseline.
2. **Scroll is a timeline.** Key moments are scrubbed: the manifesto, the pergola louvres and the approach rail.
3. **Inertia.** Lenis smooth scroll (lerp 0.1), a lerped cursor (0.18) and magnetic targets (strength 0.3).
4. **One hero moment per section.** Everything else stays still enough to read.
5. **`prefers-reduced-motion`.** Smooth scroll, the shader, scrubs and the preloader are all disabled. Content
   still reads perfectly.

## 6. Components

- Section label: `(02) — Selected work` in mono.
- Magnetic button: pill, hairline border, fill wipes up from the bottom on hover.
- Cursor: 8 px dot that blends by difference and grows into a labelled disc on `[data-cursor]`.
- Work frame: browser chrome with a clip-path reveal and slow parallax on the image.
- Capability row: index, title and an expanding detail drawer. The icon draws itself on hover.
- Grain: an SVG turbulence overlay at 6% opacity, stepped at 8 fps.
