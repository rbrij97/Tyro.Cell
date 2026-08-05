# Exercise catalog

**45 exercises across 2 courses**, defined in the `EX` and `COURSES` objects in `app/index.html`. Counts verified against the running app.

By difficulty: **23 easy · 17 medium · 5 hard**
By answer type: **42 single-target · 2 fill-down range · 1 picklist**

Every exercise's stated solution is asserted to pass its own checker by `app/test.html` (45/45).

---

## Course 1 — Excel Formula Fundamentals
*Beginner / Intermediate · ~5 hours · No prerequisite · 39 exercises across 14 modules*

Organised **one module per formula**, so a learner drills a single function across many realistic contexts rather than meeting it once. `SUM`, `AVERAGE` and `MIN/MAX` have deep practice packs; the rest have 1–2 and are the obvious place for the next content push.

### Module: SUM (10)
Split into two blocks — five short drills, then five multi-column case studies where the hard part is deciding *what* to sum.

| id | Title | Level |
|---|---|---|
| `sum` | TCS — Weekly billing (₹ Cr) | easy |
| `sum_quarterly` | Amazon — Annual revenue FY23 (US$ B) | easy |
| `sum_weekly` | Zomato — Weekly orders (000s) | easy |
| `sum_regions_blank` | HDFC Bank — Regional deposits with a pending line | easy |
| `sum_per_month` | Reliance — Average monthly revenue FY24 | easy |
| `sum_case_opex` | Case: Reliance P&L — Total operating expenses | medium |
| `sum_case_portfolio_div` | Case: Equity portfolio — Total annual dividend income | medium |
| `sum_case_subtotal` | Case: HDFC deposits by zone — no double-counting | medium |
| `sum_case_netcash` | Case: Cash flow reconciliation — Net cash flow | medium |
| `sum_case_sector` | Case: Portfolio sector allocation — Financials weight | medium |

### Module: AVERAGE (8)
| id | Title | Level |
|---|---|---|
| `avg` | Infosys — 5-day closing average | easy |
| `avg_us_pe` | US Big Tech — Peer P/E (comps table) | easy |
| `avg_nifty_pe` | Nifty 50 — Blue-chip P/E | easy |
| `avg_ev_ebitda` | NBFC — Peer EV/EBITDA (M&A comps) | easy |
| `avg_target_price` | TCS — Sell-side consensus target | easy |
| `avg_jpm_eps` | JPMorgan — 4-quarter EPS smoothing | easy |
| `avg_reliance_growth` | Reliance — 5-yr revenue growth average | easy |
| `avg_sector_yield` | S&P 500 — Sector ETF dividend yields | easy |

### Module: MIN & MAX (8)
| id | Title | Level |
|---|---|---|
| `minmax` | TCS — Weekly high-low range | easy |
| `max_nifty_high` | Nifty 50 — 52-week high | easy |
| `min_sbi_low` | SBI — 52-week low | easy |
| `minmax_sensex` | SENSEX — Weekly range | easy |
| `max_yield_spread` | US Treasuries — Widest 10Y-2Y spread | easy |
| `max_broker` | HDFC Bank — Most bullish broker target | easy |
| `min_worst_eps` | Zomato — Worst-quarter EPS | easy |
| `minmax_sector` | S&P 500 — Sector YTD return dispersion | easy |

### Remaining modules (1–2 exercises each)
| Module | id | Title | Level |
|---|---|---|---|
| COUNT & COUNTA | `count` | COUNT vs COUNTA | easy |
| IF | `if` | Decision with IF | medium |
| IF | `nestedif` | Nested IF grading | hard |
| COUNTIF | `countif` | Conditional count: COUNTIF | medium |
| SUMIF & SUMIFS | `sumif` | Conditional sum: SUMIF | medium |
| SUMIF & SUMIFS | `sumifs2` | Two conditions: SUMIFS | hard |
| ROUND | `round` | Precision with ROUND | medium |
| Text join | `concat` | Join text with & | medium |
| Fill handle & relative refs | `rowfill` | Row totals & the fill handle *(fill-down)* | medium |
| Dates | `datediff` | Date arithmetic | medium |
| VLOOKUP | `vlookup` | Lookup with VLOOKUP | hard |
| INDEX + MATCH | `indexmatch` | INDEX + MATCH | hard |
| XLOOKUP | `xlookup1` | Modern lookup: XLOOKUP | hard |

---

## Course 2 — Financial Statements Fundamentals
*Beginner / Intermediate · ~2 hours · Recommended: Course 1 · 6 exercises*

Uses real Tesla FY2023 10-K figures ($ millions).

### Module: Income statement (4)
| id | Title | Level |
|---|---|---|
| `grossprofit` | Gross profit | easy |
| `grossmargin` | Gross margin % | medium |
| `expenseclass` | Classify the expenses *(picklist)* | medium |
| `segmentgp` | Gross profit by segment *(fill-down)* | medium |

### Module: Balance sheet & liquidity (2)
| id | Title | Level |
|---|---|---|
| `ncwc` | Non-cash working capital | medium |
| `currentratio` | Current ratio | medium |

---

## The public demo (separate)

`demo/index.html` carries its own three exercises, not part of `COURSES`:

| # | Exercise | Level | Tests |
|---|---|---|---|
| 1 | Regional sales total | easy | `SUMIFS`, one criterion |
| 2 | Bank receipts vs sales ledger | medium | Lookup on deliberately dirty data — padded IDs, a duplicate booking, a blank, a text date, mismatched row counts |
| 3 | Budget variance & materiality | hard | Lookup by name out of order, `ABS`, `IF`, fill-down |

Full detail in [`demo/README.md`](../demo/README.md).

---

## Staged exercises — `docs/vibranium/` (not yet in the app)

**116 exercises across 13 files**, covering **38 functions**, all in the `EX.xxx` format used by `app/index.html`. When ready, copy the definitions into the `EX={}` block and add exercise IDs to the `COURSES` modules array. All exercises use Indian finance contexts (ticker masters, comps tables, tax slabs, FD maturity, receivable aging, etc.).

By difficulty: **35 easy · 39 medium · 42 hard** — significantly harder skew than the current app exercises (23E/17M/5H).

### Tier 1 — Lookups & multi-criteria aggregation (28 exercises)

| File | Functions | Count | Levels |
|---|---|---|---|
| `tier1-vlookup.js` | VLOOKUP | 6 | 2E, 2M, 2H |
| `tier1-xlookup.js` | XLOOKUP | 6 | 2E, 2M, 2H |
| `tier1-indexmatch.js` | INDEX + MATCH | 6 | 2E, 2M, 2H |
| `tier1-iferror.js` | IFERROR | 4 | 2E, 1M, 1H |
| `tier1-countifs.js` | COUNTIFS | 3 | 1E, 1M, 1H |
| `tier1-averageifs.js` | AVERAGEIFS | 3 | 1E, 1M, 1H |

### Tier 2 — Text cleanup, logic, horizontal lookup (24 exercises)

| File | Functions | Count | Levels |
|---|---|---|---|
| `tier2-text-cleanup.js` | TRIM, LEFT, RIGHT, MID, LEN, FIND, SUBSTITUTE | 14 | 5E, 5M, 4H |
| `tier2-abs-and-or-hlookup.js` | ABS, AND, OR, HLOOKUP | 10 | 3E, 4M, 3H |

### Tier 3 — Finance rewrites of generic exercises (16 exercises)

| File | Functions | Count | Levels |
|---|---|---|---|
| `tier3-if-rewrites.js` | IF, nested IF, COUNTIF, SUMIF, ROUND, CONCAT, COUNT, COUNTA | 16 | 5E, 5M, 6H |

### Tier 4 — Remaining engine-ready functions (48 exercises)

| File | Functions | Count | Levels |
|---|---|---|---|
| `tier4-power-cagr.js` | POWER (CAGR) | 4 | 1E, 2M, 1H |
| `tier4-rounding.js` | ROUNDUP, ROUNDDOWN | 4 | 2E, 2M |
| `tier4-case-textjoin.js` | UPPER, LOWER, PROPER, TEXTJOIN | 7 | 4E, 3M |
| `tier4-dates.js` | TODAY, YEAR, MONTH, DAY, DAYS, DATE, TEXT | 13 | 5E, 6M, 2H |
| `tier4-math.js` | MOD, INT, SQRT, PRODUCT | 7 | 2E, 2M, 3H |
| `tier4-stats.js` | MEDIAN, MIN, MAX, AVERAGEIF | 6 | 3E, 3M |
| `tier4-logic-types.js` | NOT, ISNUMBER, ISBLANK, COUNTBLANK | 7 | 3E, 3M, 1H |

### Functions covered by Vibranium but not the app

VLOOKUP (6 more), XLOOKUP (6 more), INDEX+MATCH (6 more), IFERROR, COUNTIFS, AVERAGEIFS, TRIM, LEFT, RIGHT, MID, LEN, FIND, SUBSTITUTE, ABS, AND, OR, HLOOKUP, ROUNDUP, ROUNDDOWN, UPPER, LOWER, PROPER, TEXTJOIN, POWER, MOD, INT, SQRT, PRODUCT, MEDIAN, AVERAGEIF, NOT, ISNUMBER, ISBLANK, COUNTBLANK, TODAY, YEAR, MONTH, DAY, DAYS, DATE, TEXT, COUNTA.

### Not covered by Vibranium (still no exercises anywhere)

Financial functions (NPV, IRR, XNPV, XIRR, PMT, PV, FV, NPER, RATE, IPMT, PPMT, EOMONTH, SLN, DB), PI, RAND, RANDBETWEEN, NOW, CONCATENATE, ISTEXT, SUMIFS.

---

## Content gaps

Honest assessment of what's thin:

1. **The long tail is one-deep.** `SUM`/`AVERAGE`/`MIN-MAX` have 8–10 exercises each; `VLOOKUP`, `XLOOKUP`, `INDEX+MATCH`, `COUNTIF`, `ROUND` and dates have exactly one. Lookups are the most interview-relevant family and the least practised.
2. **Only 5 hard exercises** out of 45, all in Course 1. There is no genuinely difficult financial-statement work.
3. **Course 2 is still Tesla-only.** The India wedge is the core positioning claim and the financial-statements course contradicts it. Course 1 is now heavily Indian (TCS, Reliance, HDFC, Infosys, Zomato, SBI, ICICI, Nifty, SENSEX) — Course 2 has not caught up.
4. **Financial functions now exist** (NPV, IRR, XNPV, XIRR, PMT, PV, FV, NPER, RATE, IPMT, PPMT, EOMONTH, SLN, DB) — DCF and loan-schedule exercises can now be written. No financial exercises exist in the app yet, but 116 new exercises covering 38 functions are staged in `docs/vibranium/`.
5. **No FP&A / analyst-craft course** — named in the pitch as a differentiator, not yet built.
6. **Only 2 fill-down and 1 picklist exercise.** Now that `Ctrl+D`/`Ctrl+R`/`Ctrl+Enter` exist, fill-down exercises are much cheaper for a learner to complete and are under-used.

---
> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[02-features]] · [[09-keyboard-and-functions]] · [[10-formulas]] · [[08-product-changes]] · [[vibranium-library]]
