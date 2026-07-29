# Product changes — everything we need to build

Compiled 2026-07-21. This is the complete list of changes to `excel-practice (1).html` (and the future backend) that everything we've discussed this session implies. Organized by area, with priority and status per item.

**Legend:**
- **P0** — blocker or foundational; must happen before other work compounds on it
- **P1** — high value, ship in the first real build after P0
- **P2** — nice-to-have or later phase
- **Blocked** — waiting on a decision (referenced in the "Open questions" section)
- **Paused** — deliberately set aside pending future direction

---

## A · Architecture — foundational refactor

| # | Priority | Item | Notes |
|---|---|---|---|
| A1 | **P0** | **Extract the formula engine into its own module** (`engine.js` or similar). | Already DOM-free logically; just bundled in the same file as the UI. Extract cleanly with an API: `engine.setCell()`, `engine.getDisplay()`, `engine.recalc()`, `engine.onChange()`. Foundation for every downstream feature — do this first. |
| A2 | **P0** | **Extract the grid UI into its own module.** | Consumes the engine only through the public API — never touches `cells{}` directly. Every future exercise page mounts one instance of this. |
| A3 | **P1** | Convert exercises to pure data objects (already partly true — the `EX` object). | Each exercise = a config: seed data, target cell(s), required functions, solution. Course pages instantiate `<Engine + Grid + ExerciseChecker>` with one config. No exercise page ever redefines the engine. |
| A4 | **P2** | Add a build step (Vite / esbuild) once the file split is done. | Currently zero build tooling — fine for now, needed once the codebase grows past the single-file threshold. |

## B · Backend — new work (does not exist yet)

| # | Priority | Item | Notes |
|---|---|---|---|
| B1 | ✅ **Decided 2026-07-21** | **Backend stack: Supabase** (Postgres + Auth + Storage). | Locked. Firebase not chosen. |
| B2 | **P0** | Google OAuth sign-in. | Comes out of the box with either stack. First user-facing backend feature. |
| B3 | **P0** | Database schema: `users`, `courses`, `exercises`, `user_progress`, plus gamification fields (see D). | Replaces the current in-memory `doneEx` Set and manual JSON export/import. |
| B4 | **P0** | Progress persistence API — save/load per user, chapter/level-wise. | The thing Google auth enables. |
| B5 | **P1** | Server-side answer verification. | Same engine code, run in Node before recording "completed" — so a user can't just open devtools and fake a pass. This is why the engine has to be DOM-free (A1). |
| B6 | **P2** | Row Level Security (Supabase) or security rules (Firebase). | A user can only read/write their own progress at the database level, not just in app code. |

## C · Keyboard shortcuts — the "real Excel feel" backlog

Currently only `F2` is implemented from the below. Pitch deck already claims `Ctrl+Shift+→`, `F2`, `F4`, `Alt+=`, `Ctrl+D` — four of those are still marketing-ahead-of-implementation and need to be closed.

| # | Priority | Shortcut | Function |
|---|---|---|---|
| C1 | **P0** | `Ctrl+Z` / `Ctrl+Y` (or `Ctrl+Shift+Z`) | **Undo / redo.** Biggest gap — currently *completely missing*. Nobody practices Excel without undo; the absence is the single most jarring difference from real Excel. Engine needs a command-history layer to support this. |
| C2 | **P1** | `F4` | Toggle relative / absolute reference (`$`) while editing a formula. Constantly drilled in real analyst work. Claimed in the pitch. |
| C3 | **P1** | `Ctrl+D` / `Ctrl+R` | Fill down / fill right by keyboard (mouse fill-handle already exists). Claimed in the pitch. |
| C4 | **P1** | `Ctrl+Arrow` / `Ctrl+Shift+Arrow` | Jump to / select to edge of data region. Core Excel muscle memory. Partially claimed in the pitch (`Ctrl+Shift+→`). |
| C5 | **P1** | `Alt+=` | AutoSum. Claimed in the pitch. |
| C6 | **P2** | `Ctrl+Home` / `Ctrl+End` | Jump to A1 / last used cell. |
| C7 | **P2** | `Ctrl+Space` / `Shift+Space` | Select entire column / row. |
| C8 | **P2** | `Ctrl+;` | Insert today's date. |
| C9 | **P2** | `F9` | Manual recalculate. |
| C10 | **P2** | `Ctrl+1` | Format cells dialog. |

**Hard browser wall** (cannot ever be intercepted — for the pitch's honesty section): `Ctrl+T`, `Ctrl+N`, `Ctrl+W`, `Ctrl+Tab`, `Alt+F4`, `F11`, `F5`.

## D · Gamification features — all new, all backend-dependent

None of these exist today. All depend on backend (B) being live.

| # | Priority | Item | Notes |
|---|---|---|---|
| D1 | **P1** | Consecutive-sessions streak. | Ledger-tally UI (not fire emoji). DB fields: `current_streak`, `longest_streak`, `last_active_date`. |
| D2 | **P1** ✅ | Skill tiers — 3-tier progression. | **Locked: Easy / Medium / Hard.** Advancement driven by exercises/courses mastered, not time. DB field: `skill_tier` (enum: `easy`/`medium`/`hard`). |
| D3 | **P1** | Certifications per completed course. | Stamped mark, downloadable image / LinkedIn-postable. DB field: `courses_certified[]`. Also revenue channel 1 (see monetization). |
| D4 | **P1** | Desk rankings — opt-in only. | Off by default. Toggle in user settings: "Show my name on desk rankings." When off → user sees "Not listed", doesn't appear to others. DB field: `rankings_opt_in (bool)`; ranking queries filter `WHERE rankings_opt_in = true`. |
| D5 | **P1** | In-grid pass feedback. | Green tick/stamp animation on the target cell(s). No toast popups, no confetti. Fail feedback keeps the existing `checkEx`/`diagnose` system, just visually restyled. |

## E · Content additions — real Indian data & wider coverage

| # | Priority | Item | Notes |
|---|---|---|---|
| E1 | **P1** | India-specific company data across the Financial Statements course. | Currently uses Tesla FY23 data (US). Pitch's whole wedge is "made for India" — this contradicts it. Add Reliance / TCS / HDFC / Infosys / Zomato quarterly-report-based exercises. |
| E2 | **P1** | FP&A / analyst-craft dedicated course. | Named in the pitch's "Where we win" wedge as a differentiator. Not yet built. Should cover: variance analysis, forecasting formulas, KPI dashboards, pivot-table-style aggregations. |
| E3 | **P0** for Phase 1 launch | 5 free, share-friendly, India-flavoured challenge exercises. | This is the Phase 1 validation deliverable per both the pitch and the monetization plan. Frame as "Can you pass this Indian FP&A analyst test?" — postable to LinkedIn/Telegram. |
| E4 | **P2** | Interview-question exercise bank. | Named in the monetization plan as part of the paid tier. Curate 30–50 real interview-style tasks. |

## F · AI assistant — currently half-broken

| # | Priority | Item | Notes |
|---|---|---|---|
| F1 | ✅ **Decided — remove** | Cut the AI assistant from V1. | Delete `#aibtn`, `#aidrawer`, `askAI()` function, and related `#ailog` / `#aiform` / `#aiq` / `#aisend` / `#aiclose` DOM + JS from `excel-practice (1).html`. Also drop the AI assistant description from `docs/02-features.md` at some point. Frees ~40 lines of code and one whole floating-widget concern. |
| F2 | N/A | ~~Rate-limit assistant~~ | Not applicable — feature removed. |
| F3 | ✅ **Decided** | Cut from V1. | Confirmed. |

## G · Design language — currently paused

Direction is not settled. Both mockups (Ledger, Workbench) were rejected. Product still visually clones Microsoft Excel (Segoe UI + `#107C41` green) — the pitch counter-positions us against Excel/CFI so this is off-brand.

| # | Priority | Item | Notes |
|---|---|---|---|
| G1 | **Paused — user-directed** | Design direction — do not pre-decide. | User will direct UI/UX specifics as we build. V1 rule: **simple but unique.** Don't propose blind mockups. |
| G2 | **P2 for V1** | Product visual identity polish. | V1 is "for me" — functional over polished is fine. Real design pass happens when external users arrive. |
| G3 | ✅ **Decided — not V1** | Terminal (dark) mode. | Light mode only in V1. Add later. |

## H · Pitch/marketing alignment — close the reality gap

| # | Priority | Item | Notes |
|---|---|---|---|
| H1 | **P1** | Trim or fulfill the shortcut claims in `FinCell-pitch.html`. | Pitch names `Ctrl+Shift+→`, `F2`, `F4`, `Alt+=`, `Ctrl+D` as handled — only `F2` is real. Either build the rest (C1–C5) before showing the pitch, or edit the pitch to only claim what's built. Anyone technical will find this gap in 30 seconds. |
| H2 | **P2** | Update the "88% fidelity" number in the pitch. | Currently made up. Recompute honestly after C1–C10 are built. |
| H3 | **P2** | Refresh directional market numbers with sourced TAM/SAM/SOM. | The pitch already flags these as directional. Before any capital raise: replace. |

## I · Monetization — from strategy to shippable

Strategy in `07-monetization.md`. Sequenced sequentially per that plan.

| # | Priority | Item | Notes |
|---|---|---|---|
| I1 | **P0** for Phase 1 revenue test | Sell a single ₹499 course certificate. | Simplest possible revenue mechanic. If users won't pay this, nothing else in monetization matters. Requires backend (B), certifications feature (D3), and payments — Razorpay is the standard Indian option. |
| I2 | **P1** | Payments integration (Razorpay). | Needed for I1. Stripe won't work well for Indian consumer transactions. |
| I3 | **P2** | Annual subscription (`₹399 / mo, ₹2,499 / yr`). | Phase 2. Depends on I1 working. |
| I4 | **P2** | College-license SKU + placement-cell dashboard. | Phase 3, but the sales conversations can start earlier (during Phase 2). |

---

## Open questions — resolved 2026-07-21 evening

| # | Was blocking | Question | Answer |
|---|---|---|---|
| Q1 | D2 | Tier naming | **Easy / Medium / Hard** |
| Q2 | B1 → B2–B6 | Backend stack | **Supabase** |
| Q3 | G1 → G2 | Design direction | **Paused — user will direct UI/UX later.** V1 = "simple but unique, this is for me." Do not lock a design direction in advance. |
| Q4 | G3 | Terminal (dark) mode | **Not in V1** — later. Light mode only. |
| Q5 | F3 | AI assistant | **Cut from V1.** Remove `#aibtn`, `#aidrawer`, and `askAI()` from `excel-practice (1).html`. |

**Downstream implications of "V1 is for me":**
- Server-side answer re-verification (B5) drops from P1 to P2 — Brij isn't going to cheat himself. Still worth building later when external users arrive.
- Row Level Security (B6) drops to P2 for the same reason.
- Opt-in rankings toggle UI (D4) can be simplified for V1 — even skipped entirely if there's only one user. Full toggle needed when a second user shows up.
- Design polish (G) can be minimal — no marketing landing page work needed. Focus is functional.

---

## Suggested build order (if you want a single line to follow)

1. **A1 + A2** — split engine from frontend. Zero user-visible change, unlocks everything.
2. **C1** — undo/redo. Highest-value UX gap. Also validates the extracted engine has a working command-history layer.
3. **B1** decision → **B2 + B3 + B4** — Google auth + database + progress persistence. Foundation for gamification and monetization.
4. **D1 + D5** — streak + in-grid feedback stamp. Cheap dopamine wins that make the product feel alive without needing D2/D3/D4.
5. **E3** — the 5 Phase-1 exercises. Now you have something worth posting to communities.
6. **I1 + I2** — one paid certificate + Razorpay. First revenue.
7. **D3 + D4** — certifications + opt-in rankings. Only after I1 proves willingness to pay.
8. **C2–C5** — the remaining P1 shortcuts. Close the pitch/reality gap in H1.
9. **E1 + E2** — Indian company data + FP&A course. Deepens the wedge.
10. Everything else P2 → later phases.

---

## What's already done (so we don't re-do it)

- Formula engine — 45+ functions, tokenizer/parser/evaluator, hand-written from scratch (100% our code, 0 external libraries).
- 22 exercises across 2 courses.
- Grid UI with mouse selection, formula bar, point-mode formula editing, fill handle, clipboard with relative-reference shifting, basic keyboard nav, `F2` in-place edit.
- Answer checker with specific-reason diagnostics (`checkEx` / `diagnose`).
- Manual progress export/import (JSON download) — placeholder for real persistence.
- Complete pitch deck (HTML + PPTX + PDF).
- Full documentation set: overview → architecture → features → exercises → roadmap → design → gamification → monetization → this doc.
