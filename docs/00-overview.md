# FinCell / FormulaLab — Overview

## What this is

A browser-based platform where finance and commerce students in India learn Excel and financial-modeling skills by **doing**, not watching — a live, working spreadsheet with real formulas, real company data, and instant answer-checking. Positioned as "LeetCode for Excel," built specifically for the Indian job market.

Two artifacts live in this project:

| File | Role |
|---|---|
| [`FinCell-pitch.html`](../FinCell-pitch.html) | Pitch deck / idea analysis — problem, market, competition, business model, risks, verdict. |
| [`excel-practice (1).html`](../excel-practice%20%281%29.html) | Working prototype — the actual product: landing page, courses, and a live spreadsheet with a real formula engine. |

## The problem

Indian commerce/finance/MBA graduates overwhelmingly learn Excel passively — video tutorials, downloaded templates. They can recognize `VLOOKUP` when they see it but can't write it from a blank cell under pressure. This creates a gap at two points:
- **Interviews** — the "open Excel and build this" test filters out candidates who know the theory but lack reps.
- **Day one on the job** — classrooms teach accounting theory; employers expect a working 3-statement model.

## The solution

Reps, not replays. A live in-browser grid where the user:
1. Opens a real Excel-like spreadsheet (not a video).
2. Gets a task with real data (including real company filings, e.g. Tesla FY2023 10-K figures).
3. Writes the formula themselves.
4. Gets graded instantly — correct/incorrect, with targeted hints — and can retry.

## Target market & positioning

- **Who**: Indian commerce/finance grads targeting FP&A, analyst, IB, and equity-research roles, plus GCC (global capability centre) hiring pipelines. A narrow, motivated niche — not "Excel for everyone."
- **Competitor**: Quantus Finance (US) already runs "LeetCode for financial modeling" with an in-browser sheet — this validates the format but means live-practice-in-browser alone isn't a moat.
- **Wedge**: (1) India-specific — INR, Ind AS, Indian company data, Big4/GCC/IB-India recruiting context; (2) broader than IB — covers everyday analyst Excel craft (lookups, pivots, dashboards), not just LBOs; (3) student-friendly freemium pricing where US competitors price for a US market.

## Business model & roadmap (lean, validate-first)

1. **Phase 1 (Month 0–2, Validate)** — ship ~5 free interactive exercises, post in Indian finance-prep communities, measure completion/demand/willingness to pay. Est. cost ≈ ₹3,000–8,000.
2. **Phase 2 (Month 2–6, Build)** — only if Phase 1 converts: expand exercise library, add accounts/progress tracking/paid tier.
3. **Phase 3 (Ongoing, Grow)** — organic-first: shareable challenges, SEO on interview questions, placement-cell tie-ups; paid ads only after the product converts.

## Known constraint (named deliberately in the pitch)

Browsers reserve some keyboard shortcuts (`Ctrl+T`, `Ctrl+W`, `Ctrl+N`, `Ctrl+Tab`, `F5`, `F11`) that no web app can override. FinCell's answer: intercept and reproduce the shortcuts that actually matter for analyst work (`Ctrl+Shift+→`, `F2`, `F4`, `Alt+=`, `Ctrl+D`) — the same approach Google Sheets/Excel-for-web use — and reframe the product's core promise around **formula/logic correctness**, not raw keyboard-shortcut fidelity (~88% of analyst-relevant shortcuts reproduce in-browser).

## Risks & verdict (from the pitch)

- **Monetisation** — freemium conversion in India is typically low (1–3%); needs a compelling outcome-tied paid tier.
- **Build burden** — a reliable in-browser graded spreadsheet is real engineering; mitigated by using/adapting free engines rather than rebuilding from scratch.
- **Free alternatives** — real Excel, YouTube, and Copilot are free; the product must clearly beat "just practice in Excel yourself."

**Score: 6.5/10 — Verdict: Pursue, lean.** Real pain, validated concept, defensible India wedge; held back by freemium economics and build risk. Prove demand before spending.

## See also
- [01-architecture.md](01-architecture.md) — how the working prototype is built
- [02-features.md](02-features.md) — feature-by-feature walkthrough of the prototype
- [03-exercise-catalog.md](03-exercise-catalog.md) — full list of courses/exercises currently implemented
- [04-roadmap-risks.md](04-roadmap-risks.md) — expanded business model, competition, and risk detail
