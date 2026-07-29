# Exercise catalog — current content in `excel-practice (1).html`

Two courses, 22 exercises total, defined in the `EX` / `COURSES` objects in the script.

## Course 1 — Excel Formula Fundamentals
*Beginner/Intermediate · ~4 hours · No prerequisite · 16 exercises*

### Module: Aggregation basics
| id | Title | Function(s) | Level |
|---|---|---|---|
| `sum` | Total with SUM | SUM | basic |
| `avg` | Mean with AVERAGE | AVERAGE | basic |
| `minmax` | Range spread: MAX − MIN | MAX, MIN | basic |
| `count` | COUNT vs COUNTA | COUNT, COUNTA | basic |

### Module: Conditions & text
| id | Title | Function(s) | Level |
|---|---|---|---|
| `if` | Decision with IF | IF | core |
| `countif` | Conditional count: COUNTIF | COUNTIF | core |
| `sumif` | Conditional sum: SUMIF | SUMIF | core |
| `round` | Precision with ROUND | ROUND | core |
| `concat` | Join text with & | & / CONCAT | core |

### Module: References, filling & dates
| id | Title | Function(s) | Level |
|---|---|---|---|
| `rowfill` | Row totals & the fill handle | relative references | core |
| `datediff` | Date arithmetic | DATE, DAYS | core |

### Module: Advanced logic & lookups
| id | Title | Function(s) | Level |
|---|---|---|---|
| `nestedif` | Nested IF grading | IF (nested) | adv |
| `vlookup` | Lookup with VLOOKUP | VLOOKUP | adv |
| `indexmatch` | INDEX + MATCH | INDEX, MATCH | adv |
| `xlookup1` | Modern lookup: XLOOKUP | XLOOKUP | adv |
| `sumifs2` | Two conditions: SUMIFS | SUMIFS | adv |

## Course 2 — Financial Statements Fundamentals
*Beginner/Intermediate · ~2 hours · Recommended: Course 1 · 6 exercises*
Uses real Tesla FY2023 10-K figures ($ millions).

### Module: Income statement
| id | Title | Function(s) | Level |
|---|---|---|---|
| `grossprofit` | Gross profit | cell arithmetic | basic |
| `grossmargin` | Gross margin % | ROUND, division | core |
| `expenseclass` | Classify the expenses | picklist (COGS vs Opex) | core |
| `segmentgp` | Gross profit by segment (fill down) | relative refs | core |

### Module: Balance sheet & liquidity
| id | Title | Function(s) | Level |
|---|---|---|---|
| `ncwc` | Non-cash working capital | cell arithmetic | core |
| `currentratio` | Current ratio | ROUND, division | core |

## Answer-type distribution
- **Single target cell** (`target`): most exercises — one formula, one answer cell.
- **Fill-down range** (`targetRange`): `rowfill`, `segmentgp` — one formula written once, then dragged/filled across a range; every resulting cell is checked independently.
- **Picklist/classification** (`pick`): `expenseclass` — dropdown selection per cell instead of a formula.

## Content gaps / obvious next additions
(For future course planning — not yet built)
- Pivot-table-style exercises (aggregation/reporting), since the pitch explicitly claims "beyond IB" coverage (dashboards, reporting) as a differentiator.
- More Indian-company-flavored data (the pitch's core wedge is "Made for India"); current financial-statements course uses Tesla (US) data only.
- A dedicated FP&A/analyst-craft course (mentioned in the pitch's "Where we win" section) — not yet represented in `COURSES`.
