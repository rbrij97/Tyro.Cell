# Architecture — `excel-practice (1).html`

Single-file HTML/CSS/vanilla-JS application (no build step, no dependencies). ~1,500 lines. Everything — engine, UI, content — lives in one file.

## High-level structure

```
<style>            All CSS, scoped by view (landing/courses/course-detail/workspace)
<body>
  #view-landing     Marketing/landing page
  #view-courses     Course catalog (cards, progress bars, export/import)
  #view-course      Course detail (modules -> exercises list)
  #view-app         The actual spreadsheet workspace
  #aibtn/#aidrawer  Floating AI assistant widget (workspace only)
<script>            Grid model, formula engine, UI wiring, exercise data, router
```

Only one `.view` has class `on` at a time; `show(view)` toggles between them — this is a simple client-side SPA router with no history/URL state.

## Formula engine (the technical core)

A hand-written spreadsheet formula interpreter, in three stages:

1. **Tokenizer** (`tokenize`) — turns a formula string into tokens: numbers, strings, booleans, cell refs (`A1`), functions (`SUM(`), operators, and inline error literals (`#REF!`).
2. **Parser** (`parse`) — recursive-descent parser producing an AST. Precedence climbs through: primary → postfix (`%`) → unary (`-`/`+`) → power (`^`) → mul/div → add/sub → concat (`&`) → comparison (`= < > <= >= <>`).
3. **Evaluator** (`evalNode`) — walks the AST. Cell references are resolved lazily and recursively via `cellValue`, with a `visiting` set per evaluation to detect circular references (`#REF!`).

Values are plain JS `number | string | boolean | ""`, or a wrapped `{__range: [[...]]}` for ranges, or `{__err: code}` for errors (thrown as exceptions and caught at the display/check layer).

### Supported functions (`FUNCS`, ~45 total)
Math (`SUM, AVERAGE, MIN, MAX, MEDIAN, PRODUCT, ROUND(UP/DOWN), ABS, SQRT, POWER, MOD, INT, PI, RAND, RANDBETWEEN`), counting (`COUNT, COUNTA, COUNTBLANK`), conditional (`IF, IFERROR, COUNTIF(S), SUMIF(S), AVERAGEIF(S), AND, OR, NOT`), text (`LEN, UPPER, LOWER, PROPER, TRIM, LEFT, RIGHT, MID, CONCATENATE/CONCAT, TEXTJOIN, FIND, SUBSTITUTE`), lookup (`VLOOKUP, HLOOKUP, INDEX, MATCH, XLOOKUP`), date (`TODAY, NOW, DATE, YEAR, MONTH, DAY, DAYS, TEXT`), info (`ISNUMBER, ISTEXT, ISBLANK`).

`IF`, `IFERROR`, and `XLOOKUP` are in a `LAZY` set — their arguments are AST nodes, not pre-evaluated values, so short-circuiting and fallback-on-error work correctly (e.g. `IFERROR` must not evaluate its fallback unless the first expression throws).

## Grid model & UI

- `cells` — a sparse object keyed by ref (`"B7"`) → `{raw, b, i, u}` (raw formula/value text, bold/italic/underline flags).
- `sel` / `selEnd` define the active selection rectangle; `paintSelection()` re-renders selection highlight, row/col header highlight, the name box, and the formula bar on every change.
- **Point mode** (`point`, `movePoint`, `applyPoint`) — when editing a formula and the cursor is in an "insertable" position (right after an operator), arrow keys or mouse-drag select a cell/range and insert its reference into the formula — mirrors real Excel/Sheets behavior.
- **Relative-reference shifting** (`shiftFormula`) — when a formula is copied/filled to a new location, non-`$`-locked refs shift by the row/col delta; `$`-locked parts stay fixed. Used by both fill-handle and clipboard paste.
- **Fill handle** (`fillHandle`, `applyFill`, `fillTargetFor`) — drag the bottom-right handle of a selection to project the formula (with shifted refs) up/down/left/right, matching Excel's fill behavior.
- **Clipboard** (`copySelection`, `pasteClip`) — `Ctrl+C`/`Ctrl+V` copy a rectangular block including formulas (shifted) and formatting.
- **Diagnostics** (`diagnose`) — heuristic feedback generator for wrong answers: detects likely typos in function names (Levenshtein distance ≤2 suggests the closest real function), off-by-one range boundaries, hard-coded literals instead of formulas, missing quotes around criteria operators, common error codes (`#DIV/0!`, `#N/A`, `#REF!`) with plain-English explanations.

## Exercise / course system

- `EX` — a flat object of exercise definitions keyed by id (e.g. `sum`, `vlookup`, `grossprofit`). Each has: level (`basic|core|adv`), title, concept HTML, task description, seed `data` (cell → value), an answer spec (`target` single cell, `targetRange` for fill-down exercises, or `pick` for classification/dropdown exercises), required tokens/refs, `solution` formula, and a `hint`.
- `COURSES` — ordered list of `{id, title, level, hours, prereq, desc, modules: [{title, ex: [ids]}]}`. Currently two courses: **Excel Formula Fundamentals** (16 exercises, 4 modules) and **Financial Statements Fundamentals** (6 exercises, 2 modules, using real Tesla FY2023 figures).
- `doneEx` — a `Set` of completed exercise ids, held in memory only (no `localStorage`/backend) — hence the explicit **Export/Import progress** buttons that serialize `doneEx` to/from a downloaded JSON file.
- **Checker** (`checkEx`) — dispatches on answer type:
  - `pick` exercises: every dropdown must match the expected answer.
  - `targetRange` exercises: every cell in the range must be a formula (not a literal), reference the right cells, and evaluate to the value expected at that position (computed via `expectedAt`, which shifts the canonical `solution` formula to each cell's position rather than requiring an identical string).
  - single-`target` exercises: validates required function tokens/refs appear in the raw formula, then compares evaluated value against the value produced by silently substituting the canonical `solution` and evaluating it (`expectedValue`) — so multiple equivalent formulas can pass as long as they compute the same result, but hard-coded numbers or missing required functions still fail.

## AI assistant

A simple chat drawer (`#aidrawer`) that calls `https://api.anthropic.com/v1/messages` directly from the browser with the current exercise as context (instructed not to reveal the full solution). **This only works inside an environment that proxies/authorizes that fetch (e.g. a claude.ai artifact sandbox) — there is no API key handling in this file, so run standalone it will fail with a "network/API access required" message.** This is a known gap to close before shipping (see [04-roadmap-risks.md](04-roadmap-risks.md)).

## Notable design choices / constraints

- **No backend, no persistence layer** — everything is client-side and in-memory; progress survives only via manual export/import. A real "Phase 2" (per the pitch roadmap) needs accounts + server-side progress storage.
- **No build tooling** — plain HTML/CSS/JS in one file, easy to iterate on with Claude Code / any editor, but will need splitting into modules once it grows further.
- **Content and engine are interleaved** in the same script block — exercise data (`EX`, `COURSES`) is hard-coded JS, not loaded from a CMS/database.
