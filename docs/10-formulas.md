# Formula registry

**The master list.** Every formula the engine can compute, how much practice exists behind it, and what to build next. If you are deciding what content to write, start here.

Counts read directly off the running app on 2026-08-01.

---

## The headline

| | |
|---|---|
| | |
|---|---|
| Functions the engine supports | **74** (was 60; +14 financial functions added 2026-08-05) |
| Functions with at least one exercise (in app) | **16** |
| Functions with **no exercise in the app** | **58** |
| Exercises in app | 45 |
| Exercises staged in `docs/vibranium/` (not yet integrated) | **116** covering 38 functions |

**78% of the engine is untaught in the app.** The engine is far ahead of the content — but 116 new exercises exist in `docs/vibranium/` ready to integrate. Writing exercises for the ones that already work is the bottleneck; the Vibranium library addresses this for 38 of the 58 untaught functions.

---

## What was built first

The content was written formula-first, one module per formula, and the first three got deep practice packs while everything after got a single token exercise:

| Order | Formula | Exercises | Shape of the pack |
|---|---|---|---|
| 1st | `SUM` | **10** | 5 short drills + 5 multi-column case studies |
| 2nd | `AVERAGE` | **8** | comps tables, consensus targets, EPS smoothing |
| 3rd | `MIN` / `MAX` | **8** | 52-week highs/lows, ranges, dispersion |
| then | everything else | **1–3 each** | one exercise, one context |

That shape is the single biggest content problem. `SUM` — the easiest formula in Excel — has ten exercises. `XLOOKUP`, `VLOOKUP` and `INDEX`/`MATCH` — the ones interviews actually test — have **one each**.

---

## Coverage — the 16 formulas that have practice

| Formula | Exercises | Where |
|---|---:|---|
| `SUM` | 10 | SUM module |
| `AVERAGE` | 8 | AVERAGE module |
| `MAX` | 6 | MIN & MAX module |
| `MIN` | 5 | MIN & MAX module |
| `ROUND` | 3 | ROUND, gross margin, current ratio |
| `IF` | 2 | IF, nested IF |
| `COUNT` | 1 | COUNT vs COUNTA |
| `COUNTIF` | 1 | COUNTIF |
| `SUMIF` | 1 | SUMIF |
| `SUMIFS` | 1 | SUMIFS |
| `VLOOKUP` | 1 | VLOOKUP |
| `XLOOKUP` | 1 | XLOOKUP |
| `INDEX` | 1 | INDEX + MATCH |
| `MATCH` | 1 | INDEX + MATCH |
| `DATE` | 1 | Date arithmetic |
| `DAYS` | 1 | Date arithmetic |

Six exercises teach no function at all — `rowfill`, `grossprofit`, `ncwc`, `segmentgp`, `expenseclass` (cell arithmetic and classification) and `concat` (the `&` operator).

---

## The 58 formulas with no exercise in the app

Ordered by what to build first. **38 of these are already covered by the 116 staged exercises in `docs/vibranium/`** — marked with ✅ below. Integrating Vibranium into the app is the single highest-leverage content action.

### Priority 1 — high interview value, currently untaught in app
| Formula | Why it matters | Vibranium? |
|---|---|---|
| `IFERROR` | Every real model wraps lookups in it. Interviewers expect it. | ✅ 4 exercises |
| `TRIM` | The single most common data-cleaning fix; already the crux of a demo exercise | ✅ in text-cleanup |
| `COUNTIFS` | The counting counterpart to `SUMIFS`, which has an exercise | ✅ 3 exercises |
| `AVERAGEIFS` | Same — conditional averaging is standard FP&A | ✅ 3 exercises |
| `COUNTA` | Named in the COUNT exercise's title but never actually practised | ✅ in tier 3 |
| `HLOOKUP` | Completes the lookup family | ✅ in tier 2 |

### Priority 2 — everyday analyst craft
| Formula | Why it matters | Vibranium? |
|---|---|---|
| `LEFT` `RIGHT` `MID` `LEN` `FIND` `SUBSTITUTE` | Ticker parsing, ID cleanup, splitting exported fields | ✅ 14 exercises |
| `TEXTJOIN` | Only the `&` operator is taught today | ✅ in tier 4 |
| `ROUNDUP` `ROUNDDOWN` | Share counts, headcount, unit economics | ✅ 4 exercises |
| `ABS` | Variance analysis — already load-bearing in the demo | ✅ in tier 2 |
| `AND` `OR` `NOT` | Multi-condition logic inside `IF` | ✅ in tier 2/4 |
| `ISNUMBER` `ISBLANK` `COUNTBLANK` | Data-quality checks | ✅ 7 exercises |
| `TODAY` `YEAR` `MONTH` `DAY` `TEXT` | Ageing, period labels, maturity buckets | ✅ 13 exercises |
| `MEDIAN` | Comps tables use it as often as `AVERAGE` | ✅ in tier 4 |
| `UPPER` `LOWER` `PROPER` | Case normalization | ✅ in tier 4 |
| `POWER` | CAGR calculations | ✅ 4 exercises |

### Priority 3 — real but lower frequency
| Formula | Vibranium? |
|---|---|
| `MOD` · `INT` · `SQRT` · `PRODUCT` | ✅ 7 exercises |
| `AVERAGEIF` | ✅ in tier 4 |
| `NOW` | — no exercise (near-identical to TODAY) |

### Financial functions — new, no exercises yet
`NPV` · `IRR` · `XNPV` · `XIRR` · `PMT` · `PV` · `FV` · `NPER` · `RATE` · `IPMT` · `PPMT` · `EOMONTH` · `SLN` · `DB` — engine work done, exercises need to be authored. Not in Vibranium.

### Not worth teaching
`PI` · `RAND` · `RANDBETWEEN` — non-deterministic or irrelevant to finance practice. `RAND`/`RANDBETWEEN` also can't be graded, since the checker compares against a computed expected value.

### Also without exercises (low priority)
`CONCATENATE` (covered by CONCAT/&) · `ISTEXT` (covered by ISNUMBER) · `SUMIFS` (covered by SUMIF + COUNTIFS pattern).

---

## Formulas the engine does NOT have

These need engine work before any exercise can exist.

### Financial — ~~the significant gap~~ CLOSED (2026-08-05)
The following are now **implemented and tested**: `NPV` · `IRR` · `XNPV` · `XIRR` · `PMT` · `PV` · `FV` · `NPER` · `RATE` · `IPMT` · `PPMT` · `EOMONTH` · `SLN` · `DB`

DCF, loan schedule, depreciation, and time-value-of-money exercises can now be written. No financial exercises exist in the app yet — this is the next content priority.

### Lookup & array
`SUMPRODUCT` · `FILTER` · `UNIQUE` · `SORT` · `OFFSET` · `INDIRECT` · `ROWS` · `COLUMNS`

Note the engine has **no array semantics at all** — `TRIM(A2:A21)` throws `#VALUE!`. Adding `FILTER`/`UNIQUE`/`SORT` is not a function-by-function job; it needs the evaluator to handle spilled ranges. `SUMPRODUCT` is the cheapest useful one and does not need spilling.

### Logic & text
`IFS` · `IFNA` · `SWITCH` · `SEARCH` (only case-sensitive `FIND` exists) · `EXACT` · `VALUE` · `TEXTBEFORE` · `TEXTAFTER`

### Date
`EDATE` · `NETWORKDAYS` · `WORKDAY` · `YEARFRAC` · `DATEVALUE`

`EOMONTH` is now implemented. `YEARFRAC` is worth having — day-count conventions are everywhere in finance.

---

## Suggested build order

1. **Deepen the lookups.** `VLOOKUP`, `XLOOKUP`, `INDEX`/`MATCH` go from 1 exercise each to 5–6, with dirty data. Highest interview value, currently thinnest. No engine work needed.
2. **Add `IFERROR` and `TRIM` exercises.** Both already work; both are what separates a formula that survives real data from one that doesn't.
3. **Fill in `COUNTIFS` / `AVERAGEIFS` / `COUNTA`.** Cheap, and they complete families that are already half-taught.
4. **Text-cleanup module** — `LEFT`/`RIGHT`/`MID`/`FIND`/`SUBSTITUTE`/`TRIM` on messy exported data.
5. **Write financial-function exercises** — the engine now has NPV, IRR, PMT, etc. DCF and loan-schedule exercises are ready to be authored.

Steps 1–4 need **no engine changes at all** — only exercise data. Step 5 also needs no engine work now that financial functions are implemented.

---

## Rules for adding a formula

Anything new has to satisfy all four, or the exercise will ship broken:

1. **The function must be in `FUNCS`.** Check [09-keyboard-and-functions.md](09-keyboard-and-functions.md) — solutions using a function the engine lacks fail with `#NAME?`.
2. **No array arguments.** Functions taking a scalar cannot be handed a range.
3. **The solution must be verified against the engine, not assumed.** `app/test.html` asserts every exercise's stated solution passes its own checker — that check exists because a wrong published answer is the worst failure this product can have.
4. **`requires` / `refsRequired` must force the intended method**, or a hard-coded number will pass.

## See also
- [09-keyboard-and-functions.md](09-keyboard-and-functions.md) — function syntax, engine semantics, keyboard shortcuts
- [03-exercise-catalog.md](03-exercise-catalog.md) — every exercise, by course and module

> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[03-exercise-catalog]] · [[08-product-changes]] · [[09-keyboard-and-functions]] · [[vibranium-library]]
