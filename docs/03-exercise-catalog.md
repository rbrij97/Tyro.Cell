# Exercise catalog

**45 exercises across 2 courses**, defined in the `EX` and `COURSES` objects in `excel-practice (1).html`. Counts verified against the running app.

By difficulty: **23 easy · 17 medium · 5 hard**
By answer type: **42 single-target · 2 fill-down range · 1 picklist**

Every exercise's stated solution is asserted to pass its own checker by `test.html` (45/45).

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

## Content gaps

Honest assessment of what's thin:

1. **The long tail is one-deep.** `SUM`/`AVERAGE`/`MIN-MAX` have 8–10 exercises each; `VLOOKUP`, `XLOOKUP`, `INDEX+MATCH`, `COUNTIF`, `ROUND` and dates have exactly one. Lookups are the most interview-relevant family and the least practised.
2. **Only 5 hard exercises** out of 45, all in Course 1. There is no genuinely difficult financial-statement work.
3. **Course 2 is still Tesla-only.** The India wedge is the core positioning claim and the financial-statements course contradicts it. Course 1 is now heavily Indian (TCS, Reliance, HDFC, Infosys, Zomato, SBI, ICICI, Nifty, SENSEX) — Course 2 has not caught up.
4. **No financial functions exist**, so no DCF, LBO, NPV or IRR exercise can be written at all. See [09-keyboard-and-functions.md](09-keyboard-and-functions.md).
5. **No FP&A / analyst-craft course** — named in the pitch as a differentiator, not yet built.
6. **Only 2 fill-down and 1 picklist exercise.** Now that `Ctrl+D`/`Ctrl+R`/`Ctrl+Enter` exist, fill-down exercises are much cheaper for a learner to complete and are under-used.
