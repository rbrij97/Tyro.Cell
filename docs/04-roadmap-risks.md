# Roadmap, competition & risks (from `FinCell-pitch.html`)

## Competitive landscape

| Player | Format | Live practice | India-specific | Beyond IB modeling |
|---|---|---|---|---|
| YouTube / Udemy | Video | No | Some | Yes |
| WallStreetMojo / CFI | Video + templates | No | No | Partial |
| Quantus (US) | Interactive sheet | Yes | No | No (IB-heavy) |
| **FinCell** | Interactive sheet | Yes | **Yes** | **Yes — FP&A + analyst craft** |

**Where we win:**
1. **Made for India** — Indian listed companies, INR, Ind AS, prep framed around Big4/GCC/Indian IB/FP&A recruiting.
2. **Beyond banking** — most India finance jobs need broad Excel craft (lookups, pivots, dashboards, reporting), not just LBOs.
3. **Priced for students** — US subscription pricing doesn't fit the Indian student market; freemium is an opening Quantus is unlikely to chase soon.

## Roadmap

### Phase 1 · Month 0–2 · Validate
- Build a demo with a free in-browser spreadsheet engine (this is what `excel-practice (1).html` already is).
- 5 free interactive exercises, posted in Indian finance-prep communities (LinkedIn, Telegram).
- Measure: completion rate, requests for more, willingness to pay.
- Est. cost: ≈ ₹3,000–8,000, mostly tooling.

### Phase 2 · Month 2–6 · Build
- Only if Phase 1 converts.
- Expand the exercise library, add real accounts, server-side progress tracking, and a paid tier.
- Est. cost: self-build ≈ ₹5–10k/month, or a hired-dev MVP at ₹1.5–6L.

### Phase 3 · Ongoing · Grow
- Organic-first growth: shareable free challenges as the marketing engine, SEO on interview questions, YouTube teasers, college placement-cell tie-ups.
- Paid ads only after the product already converts. Target: ₹0 ad spend to start, scale from revenue.

## Cheapest test this week (from the pitch's closing call-to-action)
1. Build one interactive exercise (already done — the prototype in this repo).
2. Post it: "Can you pass this Indian FP&A analyst test?"
3. Share in 3–4 LinkedIn & Telegram finance-prep groups.
4. Measure completions, requests for more, willingness to pay.

## Known constraint: browser keyboard shortcuts
Some shortcuts (`Ctrl+T`, `Ctrl+W`, `Ctrl+N`, `Ctrl+Tab`, `F5`, `F11`) are reserved by the browser/OS and cannot be overridden by any web app. These aren't real Excel skills, but they do break perfect fidelity.

**Mitigation already designed in:** when a cell is focused, intercept and reproduce the shortcuts that matter for analyst work (`Ctrl+Shift+→`, `F2`, `F4`, `Alt+=`, `Ctrl+D`) — same approach as Google Sheets / Excel-for-web. Free engines like Univer and Handsontable already ship this keyboard layer.

**Reframe:** grade modeling logic and formula correctness (the higher-value, hire-worthy skill); treat raw shortcut speed as a transfer benefit, not the core claim. Estimated ~88% of analyst-relevant shortcuts reproduce in-browser.

## Risks
1. **Monetisation** — freemium conversion in India is often only 1–3%. Without a compelling, outcome-tied paid tier, revenue starves the business.
2. **Build burden** — a reliable in-browser spreadsheet that grades formulas is real engineering. Mitigate by using/adapting existing free engines rather than rebuilding what Quantus already built.
3. **Free alternatives** — real Excel, YouTube, and Microsoft Copilot are free. The product must clearly beat "just practice in Excel yourself."

## Verdict
**Score: 6.5 / 10 — Pursue, lean.**
Real pain, validated concept (Quantus proves the format works), and a defensible India-specific wedge. Held back by freemium economics and build risk. The directive is explicit: **prove demand before spending** — hence Phase 1 being nearly zero-cost and using the already-built prototype as the validation artifact.

> Figures throughout the pitch are directional, not researched market sizing — a real fundraising pitch should replace them with sourced TAM/SAM/SOM numbers.
