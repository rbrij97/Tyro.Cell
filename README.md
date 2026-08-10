# Tyro.cell

Practice Excel and financial-modelling by writing formulas in a real in-browser spreadsheet, graded instantly. Built for Indian finance and commerce students preparing for FP&A, analyst, IB and equity-research roles.

No build step, no dependencies, no backend. Every file below opens directly in a browser.

## Layout

```
app/                 THE PRODUCT
  index.html           the app — grid, 158 exercises, 2 courses, 42 modules
  engine.js            formula engine (shared by app and demo)
  test.html            regression harness · 283 tests
  learn/               interactive formula explainers (47 formulas)
    index.html           learn page shell (hash routing: learn/#sum)
    engine.js            explainer engine (animation, transport, TTS)
    formulas/            47 formula config files (sum.js, vlookup.js, etc.)

demo/                PUBLIC DEMO — standalone, 3 exercises, Tyro.cell branded
  index.html           the demo
  demo-test.html       its harness · 64 tests
  logo.svg             the mark
  README.md            exercises, solutions, seeded data problems

pitch/               PITCH DECK
  index.html           idea analysis & pitch (still under the old "FinCell" name)

docs/                DOCUMENTATION
  00-overview.md            what this is, where the build actually is
  01-architecture.md        how the app is built
  02-features.md            feature walkthrough
  03-exercise-catalog.md    all 158 exercises
  04-roadmap-risks.md       business model, competition, risks
  05-design-language.md     visual identity
  06-gamification.md        engagement mechanics (proposed)
  07-monetization.md        revenue channels (proposed)
  08-product-changes.md     the build backlog
  09-keyboard-and-functions.md   every key and every function
  10-formulas.md            ** the formula registry — start here for content **
  assets/                   pitch PDF/PPTX, decisions log
```

## Running it

Open `app/index.html` in a browser. That's it.

The **test harnesses** need to be served over HTTP, because browsers block cross-frame access on `file://`:

```bash
npx serve
```

| Page | URL |
|---|---|
| App | `http://localhost:3000/app/` |
| App tests | `http://localhost:3000/app/test.html` |
| Demo | `http://localhost:3000/demo/` |
| Demo tests | `http://localhost:3000/demo/demo-test.html` |
| Pitch | `http://localhost:3000/pitch/` |

Both suites should be green: **155/155** and **64/64**.

## Where things stand

**Working:** hand-written formula engine ([74 functions](docs/09-keyboard-and-functions.md), no libraries) · 158 exercises across 2 courses, 42 modules (Vibranium library integrated) · Tyro.cell design system (monochrome brand, semantic-only color) · full Excel keyboard layer, operable without a mouse · answer checking with specific-cause diagnostics · two green test suites · landing page with content sections, showcase animation, scroll-reveal animations · 47 interactive Learn explainers (iframe modal popup) · result popup with Next/Repeat flow · breadcrumb navigation · mobile responsive layout · 3-step onboarding walkthrough for first-time users.

**Not built:** no backend, no accounts, no persistence (progress is in memory, exported to JSON by hand) · no payments · no streaks, certifications or rankings.

**Next:** [`docs/10-formulas.md`](docs/10-formulas.md) has the content priority — remaining untaught functions are mostly financial (NPV, IRR, PMT) that need engine work before exercises can be written.

## Naming

The product is **Tyro.cell**. Earlier material used *FinCell* (pitch) and *FormulaLab* (learn pages). As of 2026-08-08, `app/`, `app/learn/`, and `demo/` all carry the Tyro.cell identity. Only `pitch/` still uses the old FinCell name.

---
> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[02-features]] · [[03-exercise-catalog]] · [[04-roadmap-risks]] · [[05-design-language]] · [[06-gamification]] · [[07-monetization]] · [[08-product-changes]] · [[09-keyboard-and-functions]] · [[10-formulas]] · [[vibranium-library]]
