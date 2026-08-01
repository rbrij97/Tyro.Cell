# Tyro.cell — public demo

A standalone, three-exercise demo built to answer one question: **of the people who start exercise 1, how many reach exercise 3?**

No build step, no backend, no signup, no dependencies:

| File | Role |
|---|---|
| `index.html` | The demo. Self-contained — engine, grading, diagnostics, UI, instrumentation. |
| `demo-test.html` | Regression harness. Runs against the real `index.html` in a hidden iframe. |
| `logo.svg` | The mark, as supplied. Also inlined in both pages (self-containment) and used as the favicon via a data URI. |

## Brand

The mark is a blocky **T** built on a cell grid, with a detached square that doubles as the dot in *Tyro.cell*. It keeps its own black field wherever it appears.

Because the mark is pure black-and-white, the UI is **monochrome by default and colour only ever means something**:

| Colour | Reserved for |
|---|---|
| Black (`--brand`) | Every brand and interactive surface — primary buttons, cell selection, fill handle, the active editor border |
| Green (`--ok`) | Correct answers only |
| Red (`--red`) | Wrong answers only |
| Gold (`--gold`) | "Your answer goes here" — target cells, the hint rail, the prototype banner |
| Blue | One exception: point-mode range highlighting, which follows Excel's own convention |

Difficulty badges read as increasing ink density (light grey → mid grey → solid black) rather than three unrelated hues.

The formula engine, `shiftFormula`, and `diagnose()` are **copied verbatim** from `app/index.html` (only the grid dimensions differ: 8×26 here vs 16×60 there). Neither the main app nor its test harness was modified. If the engine changes upstream, re-copy it rather than editing this one.

## Running it

Open `index.html` directly — it works as a static file.

The **tests** need to be served over HTTP, because browsers block cross-frame access on `file://`:

```bash
npx serve
```

Then open `http://localhost:3000/demo/demo-test.html` and click **Run tests**. Current status: **64/64 passing**.

## The three exercises

### 1 · Regional sales total — `easy`, ~60 seconds

Eight branches, one clean table. The point is a fast, unambiguous win so the user keeps going.

- **Tests:** `SUMIFS` with a single text criterion; sum-range-comes-first argument order.
- **Target:** `C11`
- **Solution:** `=SUMIFS(C2:C9,B2:B9,"West")` → **3850**
- **Guards:** `requires: ["SUMIFS("]`, `refsRequired: ["C2"]`. The grand total (7460) is the hardcode trap.

### 2 · Bank receipts vs sales ledger — `medium`

The exercise the demo exists for. 22 bank receipts (`A2:C23`) against 20 booked invoices (`E2:F21`) that do not tie.

- **Tests:** lookup under dirty data — `TRIM` on the key, `$`-locked lookup ranges for fill-down, and a not-found argument so unmatched rows don't poison the column.
- **Target:** `D2:D23` (one formula, filled down)
- **Solution:** `=C2-XLOOKUP(TRIM(A2),$E$2:$E$21,$F$2:$F$21,0)`
- **Guards:** `requiresAny: [XLOOKUP( VLOOKUP( INDEX( MATCH(]`, `refsRequired: ["C2"]`

**Result: six non-zero rows, ₹389,500 total unreconciled.**

| Cell | Invoice | Variance (₹) | Why |
|---|---|---:|---|
| `D6` | INV-1005 | −500 | Short receipt — ₹73,000 received against ₹73,500 booked |
| `D11` | INV-1010 | 89,000 | Received but never booked (blank ledger amount) |
| `D13` | INV-1012 | 40,000 | Booked twice; the lookup only sees the first ₹50,000 |
| `D18` | INV-1017 | 52,000 | No ledger entry at all |
| `D20` | INV-1019 | 121,000 | No ledger entry at all |
| `D22` | INV-1021 | 88,000 | No ledger entry at all |

Worth noting: `SUM(C2:C23) − SUM(F2:F21)` gives **349,500**, not 389,500. The ₹40,000 gap between the naive difference and the real one *is* the duplicate booking — which is the point of the closing screen.

### 3 · Budget variance & materiality — `hard`

Actual vs budget across six segments, listed in **different orders**, with a materiality threshold in `H2` (₹300L).

- **Tests:** lookup by name (positional matching fails), `ABS` for two-sided materiality, `IF` for the flag, and `$`-locking a single threshold cell.
- **Target:** `C2:C7` (one formula, filled down)
- **Solution:** `=IF(ABS(B2-XLOOKUP(A2,$E$2:$E$7,$F$2:$F$7))>$H$2,"Review","OK")`

| Segment | Actual | Budget | Variance | Flag |
|---|---:|---:|---:|---|
| Retail | 5200 | 5000 | +200 | OK |
| Wholesale | 3100 | 3080 | +20 | OK |
| Online | 2400 | 2000 | +400 | **Review** |
| Exports | 1850 | 2400 | −550 | **Review** |
| Institutional | 4380 | 4000 | +380 | **Review** |
| Franchise | 990 | 1100 | −110 | OK |

Exports makes `ABS` load-bearing: without it the −550 variance reads as "OK" and the answer fails at `C5`.

## Every data problem deliberately seeded into exercise 2

All eleven are asserted present by the test suite — if someone "cleans up" the data, the tests fail.

| # | Problem | Where | What it breaks |
|---|---|---|---|
| 1 | Trailing space in the ID | `A4` = `"INV-1003 "` | Lookup silently misses → first failure at `D4` |
| 2 | Trailing space in the ID | `A8` = `"INV-1007 "` | Same |
| 3 | **Leading** space in the ID | `A15` = `" INV-1014"` | Same, but easier to miss visually |
| 4 | Date stored as text | `B9` = `"08-03-2026"` | Not a serial. See note below. |
| 5 | Duplicate invoice | `INV-1012` at `E19` and `E20` (₹50,000 + ₹40,000) | Lookup returns only the first |
| 6 | Blank inside the range | `F11` (INV-1010) | Evaluates as 0, not as an error |
| 7 | Row-count mismatch | 22 bank rows vs 20 ledger rows | Guarantees unmatched receipts |
| 8 | Unmatched receipt | INV-1017 | Needs the not-found argument |
| 9 | Unmatched receipt | INV-1019 | Same |
| 10 | Unmatched receipt | INV-1021 | Same |
| 11 | **Ledgers sorted differently** | Ledger is by amount desc; bank is by date | Kills positional matching, *and* makes an unlocked lookup range genuinely fail |

Problem 11 is not decoration. In an earlier draft both ledgers shared an order, and a formula with no `$` locks and a range one row short **still passed** — a fragile answer scoring as correct. Re-sorting the ledger makes those two fail at `D5` and `D9` respectively.

**On the text date (`B9`):** date serials in column B are *displayed* as `dd-mm-yyyy`, so the text one looks identical to its neighbours — the only tell is that it left-aligns while real dates right-align, exactly as in Excel. It is a **latent** landmine: the model solution never touches column B, so a user can finish without meeting it. It bites, with a specific diagnostic, only if they try to filter or compare on date. Note the engine (like Excel) sorts text *above* every number, so the text date silently **passes** a `>=` filter rather than being excluded — a test asserts this.

## Diagnostics

No wrong answer ever produces a bare "incorrect". Every failure names the cell, what it returned, what was expected, and a specific cause. `diagnoseDemo()` runs first and falls back to the main app's `diagnose()`, then to a structural comparison that always yields something concrete.

| Rule | Fires when | Sample output |
|---|---|---|
| Whitespace / `TRIM` | Lookup key has padding and the formula has no `TRIM` | *"A4 holds `"INV-1003 "` — note the trailing space… Wrap the lookup value in `TRIM(...)`."* |
| `#N/A` triage | Lookup errors | Distinguishes a whitespace miss from a genuinely unmatched invoice |
| Wrong column | Formula uses a column the solution doesn't, and misses one it does | *"Column B (Date received) isn't the one this needs — the figures are in column C."* |
| Hardcoded literal | A numeric literal equals the expected value — **even when the answer is right** | *"Cell C11 has the answer `3850` typed into it literally."* |
| Text date | Formula references a text-typed cell in a date column | Names the cell, explains serial vs text, points at `ISNUMBER()` |
| Off-by-one range | Range shares a start but stops short | *"…stops one row short — it should reach `E21`. That leaves out INV-1008 (E21)."* |
| `$` locks (too many) | A ref the solution leaves relative is locked | *"…a locked row cannot move, so every filled cell keeps reading row 2."* |
| `$` locks (too few) | A lookup range the solution locks is relative | *"…slides down one row for every row you fill."* |
| `SUMIF` instead of lookup | Aggregation used where the exercise drills lookups | Credits it as the better instinct rather than calling it wrong |
| Missing `ABS` | Expected "Review", got "OK", variance is negative | *"…a negative number is never greater than the threshold."* |
| Positional assumption | Ex3 reads column F directly with no lookup | *"…assumes both tables list the segments in the same order. They don't."* |

## Instrumentation

In-memory only. **No third-party script, no network call, no personal data, and the user's formula text is never recorded** (a test asserts this).

Events: `demo_opened`, `exercise_started`, `attempt`, `hint_shown`, `exercise_passed`, `demo_completed`, `cta_clicked`.

```js
// Forward to a real endpoint later:
window.DEMO_ANALYTICS_SINK = e => navigator.sendBeacon("/collect", JSON.stringify(e));

// Or read the funnel directly in the console:
Demo.Analytics.funnel();
// [{exercise:1, id:"westsales", started:true, passed:true, attempts:2, elapsedMs:41230}, …]
```

Elapsed time per exercise is tracked but **never displayed** — there is no timer or countdown anywhere in the UI, and a test asserts no timer-like text is rendered.

## Points to have reviewed by someone in finance

1. **The duplicate, and which tool is "right".** `SUMIFS` is arguably the *better* reconciliation tool: on INV-1012 it adds both part-payments and ties to zero, while `XLOOKUP` reports a ₹40,000 variance that doesn't really exist. The exercise requires a lookup (that's what interviews drill), so a user who reaches for `SUMIF` is told the exercise wants a lookup — but the diagnostic credits the instinct, and the closing screen makes it the takeaway. **This is the sharpest judgement call in the demo.** If you'd rather the exercise accept either, drop `requiresAny` from exercise 2.
2. **Sign convention.** Variance is bank − books, so a positive number means received-but-not-booked. Conventional, but worth confirming against how you'd present it.
3. **The ₹500 short receipt (INV-1005)** is left unclassified. In practice you'd want to know whether it's a bank charge, TDS, or a genuine short payment.
4. **The blank ledger amount (INV-1010)** is treated as ₹0, producing a full ₹89,000 variance. Realistic for an unbooked receipt, but it is an assumption.
5. **Materiality in exercise 3 is an absolute ₹ threshold only.** Real FP&A often uses both an absolute floor *and* a percentage.

## Known limitations

- The fonts come from Google Fonts via a `<link>`, matching the main app. Every family has a local fallback, so the page renders correctly offline — delete the two `<link>` tags if you want zero external requests.
- `demo-test.html` must be served over HTTP; `file://` blocks cross-frame access.
- Engine code is duplicated from the main app rather than shared. That is deliberate (the demo must stay self-contained) but means engine fixes need copying in both directions.
