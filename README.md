# Tyro.cell

Practice Excel and financial-modelling by writing formulas in a real in-browser spreadsheet, graded instantly. Built for Indian finance and commerce students preparing for FP&A, analyst, IB and equity-research roles.

No build step, no dependencies, no backend. Every file below opens directly in a browser.

## Layout

```
app/                 THE PRODUCT
  index.html           the app — engine, grid, 45 exercises, 2 courses
  test.html            regression harness · 155 tests

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
  03-exercise-catalog.md    all 45 exercises
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

**Working:** hand-written formula engine (60 functions, no libraries) · 45 exercises across 2 courses · full Excel keyboard layer, operable without a mouse · answer checking with specific-cause diagnostics · two green test suites.

**Not built:** no backend, no accounts, no persistence (progress is in memory, exported to JSON by hand) · no payments · no streaks, certifications or rankings.

**Next:** [`docs/10-formulas.md`](docs/10-formulas.md) has the content priority — 44 of the 60 supported functions still have no exercise, and the lookups that interviews actually test have one apiece.

## Naming

The product is **Tyro.cell**. Earlier material used *FinCell* (pitch) and *FormulaLab* (app UI). Only `demo/` carries the current name and mark; `app/` and `pitch/` have not been migrated yet.
