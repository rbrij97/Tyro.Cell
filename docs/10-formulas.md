# Formula registry

**The master list.** Every formula the engine can compute, how much practice exists behind it, and what to build next. If you are deciding what content to write, start here.

Counts read directly off the running app on 2026-08-01.

---

## The headline

| | |
|---|---|
| Functions the engine supports | **60** |
| Functions with at least one exercise | **16** |
| Functions with **no exercise at all** | **44** |
| Exercises total | 45 |

**73% of the engine is untaught.** The engine is far ahead of the content — building more functions is not the bottleneck, writing exercises for the ones that already work is.

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

## The 44 formulas with zero exercises

Ordered by what to build first.

### Priority 1 — high interview value, currently untaught
| Formula | Why it matters |
|---|---|
| `IFERROR` | Every real model wraps lookups in it. Interviewers expect it. |
| `TRIM` | The single most common data-cleaning fix; already the crux of a demo exercise |
| `COUNTIFS` | The counting counterpart to `SUMIFS`, which has an exercise |
| `AVERAGEIFS` | Same — conditional averaging is standard FP&A |
| `COUNTA` | Named in the COUNT exercise's title but never actually practised |
| `HLOOKUP` | Completes the lookup family |

### Priority 2 — everyday analyst craft
| Formula | Why it matters |
|---|---|
| `LEFT` `RIGHT` `MID` `LEN` `FIND` `SUBSTITUTE` | Ticker parsing, ID cleanup, splitting exported fields |
| `CONCAT` `CONCATENATE` `TEXTJOIN` | Only the `&` operator is taught today |
| `ROUNDUP` `ROUNDDOWN` | Share counts, headcount, unit economics |
| `ABS` | Variance analysis — already load-bearing in the demo |
| `AND` `OR` `NOT` | Multi-condition logic inside `IF` |
| `ISNUMBER` `ISTEXT` `ISBLANK` | Data-quality checks; `ISNUMBER` is how you catch a text date |
| `TODAY` `YEAR` `MONTH` `DAY` `TEXT` | Ageing, period labels, maturity buckets |
| `MEDIAN` | Comps tables use it as often as `AVERAGE` |

### Priority 3 — real but lower frequency
`PRODUCT` · `POWER` · `SQRT` · `MOD` · `INT` · `AVERAGEIF` · `UPPER` · `LOWER` · `PROPER` · `NOW`

### Not worth teaching
`PI` · `RAND` · `RANDBETWEEN` — non-deterministic or irrelevant to finance practice. `RAND`/`RANDBETWEEN` also can't be graded, since the checker compares against a computed expected value.

---

## Formulas the engine does NOT have

These need engine work before any exercise can exist.

### Financial — the significant gap
`NPV` · `IRR` · `XNPV` · `XIRR` · `PMT` · `PV` · `FV` · `RATE` · `NPER`

**None of these exist.** The product targets FP&A, IB and equity-research candidates, and today it is impossible to write a DCF, an LBO, a loan schedule or any time-value-of-money exercise. This is the largest single gap between what the product claims and what it can teach.

### Lookup & array
`SUMPRODUCT` · `FILTER` · `UNIQUE` · `SORT` · `OFFSET` · `INDIRECT` · `ROWS` · `COLUMNS`

Note the engine has **no array semantics at all** — `TRIM(A2:A21)` throws `#VALUE!`. Adding `FILTER`/`UNIQUE`/`SORT` is not a function-by-function job; it needs the evaluator to handle spilled ranges. `SUMPRODUCT` is the cheapest useful one and does not need spilling.

### Logic & text
`IFS` · `IFNA` · `SWITCH` · `SEARCH` (only case-sensitive `FIND` exists) · `EXACT` · `VALUE` · `TEXTBEFORE` · `TEXTAFTER`

### Date
`EOMONTH` · `EDATE` · `NETWORKDAYS` · `WORKDAY` · `YEARFRAC` · `DATEVALUE`

`EOMONTH` and `YEARFRAC` are worth having — period-end logic and day-count conventions are everywhere in finance.

---

## Suggested build order

1. **Deepen the lookups.** `VLOOKUP`, `XLOOKUP`, `INDEX`/`MATCH` go from 1 exercise each to 5–6, with dirty data. Highest interview value, currently thinnest. No engine work needed.
2. **Add `IFERROR` and `TRIM` exercises.** Both already work; both are what separates a formula that survives real data from one that doesn't.
3. **Fill in `COUNTIFS` / `AVERAGEIFS` / `COUNTA`.** Cheap, and they complete families that are already half-taught.
4. **Text-cleanup module** — `LEFT`/`RIGHT`/`MID`/`FIND`/`SUBSTITUTE`/`TRIM` on messy exported data.
5. **Then** engine work: financial functions (`NPV`, `IRR`, `XIRR`, `PMT`), which unlock a genuine modelling course.

Steps 1–4 need **no engine changes at all** — only exercise data.

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
