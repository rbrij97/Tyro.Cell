# Tyro.cell — Overview

> **Naming.** The product is **Tyro.cell**. Earlier material used *FinCell* (pitch deck) and *FormulaLab* (learn pages). As of 2026-08-08, `app/index.html`, `app/learn/`, and `demo/` all carry the Tyro.cell identity (logo, name, favicon, design tokens). Only `pitch/index.html` still uses the old FinCell name.

## What this is

A browser-based platform where finance and commerce students in India learn Excel and financial-modelling skills by **doing** — a live, working spreadsheet with a real formula engine, real company data, instant answer-checking, and Excel's own keyboard bindings. Positioned as "LeetCode for Excel," built for the Indian job market.

## What's in the repo

| File | Role | State |
|---|---|---|
| [`app/index.html`](../app/index.html) | **The product.** Single-file app: engine, grid, 158 exercises, 2 courses, 42 modules. Landing page with content sections, scroll animations, showcase. Tyro.cell branded. | Active build target |
| [`app/learn/`](../app/learn/) | **Learn modal content.** Interactive formula explainers (47 formulas), loaded as iframe inside the main app. Tyro.cell branded. | Active |
| [`app/test.html`](../app/test.html) | Regression harness for the product. 155 tests. | 155/155 passing |
| [`demo/index.html`](../demo/index.html) | Standalone 3-exercise public demo, Tyro.cell branded. | Complete, frozen |
| [`demo/demo-test.html`](../demo/demo-test.html) | Harness for the demo. 64 tests. | 64/64 passing |
| [`demo/logo.svg`](../demo/logo.svg) | The Tyro.cell mark. | — |
| [`pitch/index.html`](../pitch/index.html) | Pitch deck / idea analysis. Also exported to PDF + PPTX. | Stale name, stale claims |

## The problem

Indian commerce/finance/MBA graduates overwhelmingly learn Excel passively — video tutorials, downloaded templates. They can recognise `VLOOKUP` when they see it but can't write it from a blank cell under pressure. The gap shows up at two moments:

- **Interviews** — the "open Excel and build this" test filters out candidates who know the theory but lack reps.
- **Day one** — classrooms teach accounting theory; employers expect a working model.

## The solution

Reps, not replays. A live in-browser grid where the user opens a real spreadsheet, gets a task with real data, writes the formula themselves — using the same keys they'd use in Excel — and is graded instantly with a specific reason when they're wrong.

## Where the build actually is

**Working today:**
- Hand-written formula engine — **[74 functions](09-keyboard-and-functions.md)**, tokeniser → parser → evaluator, no libraries.
- **158 exercises** across 2 courses, 42 modules — lookup-heavy, Indian finance contexts throughout.
- **Tyro.cell design system** — monochrome brand (#0A0A0A), semantic-only color, Instrument Sans/Serif/JetBrains Mono type stack, DotField hero animation. Applied to main app and learn pages.
- **Landing page** — hero, showcase animation (scroll-triggered typing demo), persona section, comparison section, real-data callouts, FAQ, nav links with smooth scroll, scroll-reveal animations on all sections.
- **Learn modal** — 47 interactive formula explainers open as iframe popups inside the exercise workspace. Animated step-by-step formula walkthroughs with data tables, cell highlighting, and subtitle narration.
- **Result popup** — centered modal with pass/fail feedback, Next and Repeat buttons for exercise flow.
- Grid with selection, formula bar, point-mode reference picking, fill handle, clipboard with relative-reference shifting.
- **Excel keyboard layer** — fill, undo/redo, `F4`, edge jump, AutoSum. See [09-keyboard-and-functions.md](09-keyboard-and-functions.md).
- Answer checker with specific-cause diagnostics.
- Two regression harnesses, both green.

**Not built yet:**
- No backend, no accounts. Progress lives in memory; it survives only via manual JSON export/import.
- No persistence, streaks, certifications, or rankings (all need the backend first).
- No payments.

## Target market & positioning

- **Who**: Indian commerce/finance grads targeting FP&A, analyst, IB and equity-research roles, plus GCC hiring pipelines. A narrow, motivated niche — not "Excel for everyone."
- **Competitor**: Quantus Finance (US) already runs "LeetCode for financial modelling" with an in-browser sheet — which validates the format and means live practice alone is not a moat.
- **Wedge**: (1) India-specific — INR, Ind AS, Indian company data, Big4/GCC/IB-India recruiting context; (2) broader than IB — everyday analyst craft, not just LBOs; (3) student-friendly pricing.

## Business model & roadmap

Lean, validate-first, in three phases — see [04-roadmap-risks.md](04-roadmap-risks.md) and [07-monetization.md](07-monetization.md). Current stance: **product quality first, distribution deferred.** Posting to communities is deliberately on hold until the app feels right.

## Risks

- **Monetisation** — freemium conversion in India is typically 1–3%; needs an outcome-tied paid tier.
- **Build burden** — a reliable graded in-browser spreadsheet is real engineering.
- **Free alternatives** — Excel, YouTube and Copilot are free; the product must beat "just practise in Excel yourself."

**Score: 6.5/10 — Pursue, lean.** Real pain, validated concept, defensible India wedge; held back by freemium economics and build risk.

## See also
- [01-architecture.md](01-architecture.md) — how it's built
- [02-features.md](02-features.md) — feature walkthrough
- [03-exercise-catalog.md](03-exercise-catalog.md) — all exercises
- [04-roadmap-risks.md](04-roadmap-risks.md) — business model, competition, risks
- [05-design-language.md](05-design-language.md) — visual identity
- [06-gamification.md](06-gamification.md) — engagement mechanics (proposed)
- [07-monetization.md](07-monetization.md) — revenue channels (proposed)
- [08-product-changes.md](08-product-changes.md) — the build backlog
- [09-keyboard-and-functions.md](09-keyboard-and-functions.md) — every function and every key
- **[10-formulas.md](10-formulas.md) — the formula registry. Start here when deciding what content to write.**

> **Obsidian graph links**
> [[README]] · [[01-architecture]] · [[02-features]] · [[03-exercise-catalog]] · [[04-roadmap-risks]] · [[05-design-language]] · [[06-gamification]] · [[07-monetization]] · [[08-product-changes]] · [[09-keyboard-and-functions]] · [[10-formulas]] · [[vibranium-library]]
