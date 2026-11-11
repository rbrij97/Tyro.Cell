# Architecture — `app/index.html`

HTML/CSS/vanilla-JS application (no build step, no dependencies). Split into separate files (2026-11-11): markup, styles, engine, grid UI, exercise content and app shell.

## High-level structure

```
app/
├── index.html          Markup only: the views and overlays, plus two tiny loaders
├── css/app.css         All styles
├── engine.js           Formula engine (shared by app and demo)
├── js/grid.js          Grid UI: rendering, selection, editing, point mode, fill, clipboard, keyboard layer, side panel
├── js/exercises.js     Content only: concept text, EX (158 exercises), COURSES. No DOM
├── js/app.js           App shell: progress, persistence, router, pages, workspace, checker, onboarding, test hooks, init
├── test.html           Regression harness (290 tests) — loads index.html?test
└── learn/              Animated explainers — no longer linked from the app (Learn button removed 2026-11-11)
```

**Load order matters.** The four scripts are *classic* scripts, not ES modules: their top-level `const`/`let`/`function` names share one global scope, exactly as when they were one `<script>`. They load in this order: `engine.js → js/grid.js → js/exercises.js → js/app.js`, and code that runs at load time may only use names from files above it (handlers that run later can use anything).

**Why the loaders.** `index.html` writes its `<link>` and `<script>` tags with paths computed from `location.pathname`. Plain relative paths break when the page is opened as `/app` with no trailing slash (Vercel and `serve` both do this): `css/app.css` would resolve to `/css/app.css`.

### `app/engine.js` — formula engine module
```
(function(){                IIFE wrapper — keeps const/let declarations out of global scope
  cells = {}                Sparse cell storage (ref → {raw, b, i, u})
  tokenize / parse          Tokenizer + recursive-descent parser
  evalNode / cellValue      AST evaluator + lazy cell resolution with cycle detection
  FUNCS (74)                All spreadsheet functions (math, text, lookup, financial, date)
  shiftFormula              Relative-reference shifting for copy/fill/paste
  displayOf / fmtNum        Display helpers
  window.Engine = {...}     Public API — consumed by index.html and demo/index.html
})()
```

Both `app/index.html` and `demo/index.html` load `engine.js` via `<script>` and destructure from `window.Engine`. The demo calls `Engine.init(8, 26)` to configure its smaller grid; the app uses the default 16×60.

### `app/index.html` views
```
  #view-landing     Marketing/landing page (hero, showcase, personas, comparison, FAQ)
  #view-courses     Course catalog (cards, progress bars, export/import)
  #view-course      Course detail (modules -> exercises list)
  #view-404         "This page doesn't exist"
  #view-app         The spreadsheet workspace (right panel collapsed behind a rail)
  .result-overlay   Result popup (pass/fail with Next/Repeat)
```

The floating AI assistant and the Learn popup **have been removed**.

Only one `.view` has class `on` at a time. **Every screen has a URL** (hash routing, in `js/app.js`): `#/`, `#/courses`, `#/course/<id>`, `#/course/<id>/<n>` (formula n expanded), `#/practice/<exId>`, `#/sandbox`. Back, Forward, Refresh and shared links all work. Screen functions (`openCourse`, `openEx`, …) render and then record their URL with `setRoute()`; a `hashchange` the app caused itself is ignored, and redirects (locked course, bad link) replace the history entry instead of adding one.

**Persistence** (`localStorage`, this browser only): completed exercises (`tyro_done_v1`) and each exercise's in-progress sheet (`tyro_sheet_v1:<exId>`). Reset and Repeat start from the original data. The test harness loads `index.html?test`, which turns persistence off.

## Formula engine (`app/engine.js`)

A hand-written spreadsheet formula interpreter in `app/engine.js`, in three stages:

1. **Tokenizer** (`tokenize`) — turns a formula string into tokens: numbers, strings, booleans, cell refs (`A1`), functions (`SUM(`), operators, and inline error literals (`#REF!`).
2. **Parser** (`parse`) — recursive-descent parser producing an AST. Precedence climbs through: primary → postfix (`%`) → unary (`-`/`+`) → power (`^`) → mul/div → add/sub → concat (`&`) → comparison (`= < > <= >= <>`).
3. **Evaluator** (`evalNode`) — walks the AST. Cell references are resolved lazily and recursively via `cellValue`, with a `visiting` set per evaluation to detect circular references (`#REF!`).

Values are plain JS `number | string | boolean | ""`, or a wrapped `{__range: [[...]]}` for ranges, or `{__err: code}` for errors (thrown as exceptions and caught at the display/check layer).

### Supported functions (`FUNCS`, **74 total** — full list in [09-keyboard-and-functions.md](09-keyboard-and-functions.md))
Math (`SUM, AVERAGE, MIN, MAX, MEDIAN, PRODUCT, ROUND(UP/DOWN), ABS, SQRT, POWER, MOD, INT, PI, RAND, RANDBETWEEN`), counting (`COUNT, COUNTA, COUNTBLANK`), conditional (`IF, IFERROR, COUNTIF(S), SUMIF(S), AVERAGEIF(S), AND, OR, NOT`), text (`LEN, UPPER, LOWER, PROPER, TRIM, LEFT, RIGHT, MID, CONCATENATE/CONCAT, TEXTJOIN, FIND, SUBSTITUTE`), lookup (`VLOOKUP, HLOOKUP, INDEX, MATCH, XLOOKUP`), date (`TODAY, NOW, DATE, YEAR, MONTH, DAY, DAYS, TEXT, EOMONTH`), financial (`NPV, IRR, XNPV, XIRR, PMT, PV, FV, NPER, RATE, IPMT, PPMT, SLN, DB`), info (`ISNUMBER, ISTEXT, ISBLANK`).

`IF`, `IFERROR`, and `XLOOKUP` are in a `LAZY` set — their arguments are AST nodes, not pre-evaluated values, so short-circuiting and fallback-on-error work correctly (e.g. `IFERROR` must not evaluate its fallback unless the first expression throws).

## Grid model & UI

- `cells` — a sparse object keyed by ref (`"B7"`) → `{raw, b, i, u}` (raw formula/value text, bold/italic/underline flags).
- `sel` / `selEnd` define the active selection rectangle; `paintSelection()` re-renders selection highlight, row/col header highlight, the name box, and the formula bar on every change.
- **Point mode** (`point`, `movePoint`, `applyPoint`) — when editing a formula and the cursor is in an "insertable" position (right after an operator), arrow keys or mouse-drag select a cell/range and insert its reference into the formula — mirrors real Excel/Sheets behavior.
- **Relative-reference shifting** (`shiftFormula`) — when a formula is copied/filled to a new location, non-`$`-locked refs shift by the row/col delta; `$`-locked parts stay fixed. Used by both fill-handle and clipboard paste.
- **Fill handle** (`fillHandle`, `applyFill`, `fillTargetFor`) — drag the bottom-right handle of a selection to project the formula (with shifted refs) up/down/left/right, matching Excel's fill behavior.
- **Clipboard** (`copySelection`, `pasteClip`) — `Ctrl+C`/`Ctrl+V` copy a rectangular block including formulas (shifted) and formatting.
- **Diagnostics** (`diagnose`) — heuristic feedback generator for wrong answers: detects likely typos in function names (Levenshtein distance ≤2 suggests the closest real function), off-by-one range boundaries, hard-coded literals instead of formulas, missing quotes around criteria operators, common error codes (`#DIV/0!`, `#N/A`, `#REF!`) with plain-English explanations.

## Learn explainer system (`app/learn/`)

> **Not linked from the app any more (2026-11-11).** The Learn button, the course-page "Learn" links and the iframe popup were removed because the animated explainers loaded too much. The files below remain in the repo, unused. The `openLearn`/`LEARN_MAP` integration described here no longer exists.

Interactive formula explainers, previously loaded as an iframe modal inside the main app.

- **Routing**: hash-based (`learn/#sum`). The learn shell (`learn/index.html`) reads `location.hash`, loads `formulas/{fn}.js`, and passes the config to `ExplainerEngine.init()`. Hash routing avoids query-param stripping by Vite's clean-URL redirects.
- **Engine** (`learn/engine.js`): a data-driven animation player. Each formula config (`FORMULA_CONFIG`) defines a data table, column headers, formula text with syntax-colorable tokens, and a step array. Steps can highlight cells, move a cursor, type formula text character-by-character, float values, and display subtitles. Transport: play/pause, speed (1×/2×/3×), step scrubbing via progress bar.
- **Integration**: `openLearn(fn, title)` in the main app constructs the iframe URL from `location.pathname` (resolving the base path for both `/app` and `/app/index.html` cases), sets the iframe src, and shows the `.learn-overlay`. `closeLearn()` hides the overlay and sets the iframe to `about:blank`. The `LEARN_MAP` object maps module titles to formula function names (or `null` for modules without explainers).
- **47 formula configs** in `learn/formulas/`: sum, average, min, max, if, vlookup, xlookup, countif, countifs, sumif, averageif, averageifs, trim, left, right, mid, len, find, substitute, abs, and, or, hlookup, index, round, roundup, rounddown, concat, count, counta, upper, lower, proper, textjoin, power, today, days, date, mod, int, sqrt, product, median, not, isnumber, isblank, countblank, iferror.

## Exercise / course system

- `EX` — a flat object of exercise definitions keyed by id (e.g. `sum`, `vlookup`, `grossprofit`). Each has: level (`basic|core|adv`), title, concept HTML, task description, seed `data` (cell → value), an answer spec (`target` single cell, `targetRange` for fill-down exercises, or `pick` for classification/dropdown exercises), required tokens/refs, `solution` formula, and a `hint`.
- `COURSES` — ordered list of `{id, title, level, hours, prereq, desc, upcoming, modules: [{title, ex: [ids]}]}`. `upcoming:true` marks courses as locked/coming-soon in the UI. Currently two courses: **Excel Formula Fundamentals** (152 exercises, 40 modules) and **Financial Statements Fundamentals** (6 exercises, 2 modules, upcoming/locked). Full list: [03-exercise-catalog.md](03-exercise-catalog.md).
- `doneEx` — a `Set` of completed exercise ids, saved to `localStorage` on every pass and loaded at start-up. **Export/Import progress** still serialises it to a JSON file for moving progress to another device.
- **Checker** (`checkEx`) — dispatches on answer type:
  - `pick` exercises: every dropdown must match the expected answer.
  - `targetRange` exercises: every cell in the range must be a formula (not a literal), reference the right cells, and evaluate to the value expected at that position (computed via `expectedAt`, which shifts the canonical `solution` formula to each cell's position rather than requiring an identical string).
  - single-`target` exercises: validates required function tokens/refs appear in the raw formula, then compares evaluated value against the value produced by silently substituting the canonical `solution` and evaluating it (`expectedValue`) — so multiple equivalent formulas can pass as long as they compute the same result, but hard-coded numbers or missing required functions still fail.

## Keyboard layer

Excel's own bindings, implemented on top of the grid. Full table in [09-keyboard-and-functions.md](09-keyboard-and-functions.md); the architecturally interesting parts:

- **Undo/redo** (`UNDO`/`REDO`) is **snapshot-based** — each mutation pushes `JSON.stringify(cells)` onto a stack capped at 80. `cells` holds a few dozen entries, so a snapshot is cheaper to reason about than a command log, and it survives whole-sheet operations (Clear sheet) that a command log would have to special-case. `pushUndo()` is called at every mutation site; `clearHistory()` fires on `openEx`/`openSandbox` so undo can't reach back into a previous exercise's data.
- **`F4` reference cycling** (`cycleRefAt`) walks the raw formula string for the reference token at or before the caret and rotates its `$` state `A1 → $A$1 → A$1 → $A1`. It operates on text, not the AST, because the tokeniser discards `$` entirely — locks only ever matter to `shiftFormula`.
- **`Ctrl+D`/`Ctrl+R`** reuse `shiftFormula`, so filling by keyboard and dragging the fill handle produce identical results.
- **Edge jump** (`edgeJump`) reproduces Excel's real rule, including gap-skipping and running to the sheet edge.
- **Deliberately unbound:** `Ctrl+T/N/W`, `Ctrl+Tab`, `Ctrl+1–9`, `F11`, `F12`. The browser reserves them and `preventDefault()` cannot reach them, so binding would create shortcuts that silently fail.

## Test hooks

Top-level `const`/`let` create global **lexical bindings**, which are *not* properties of `window`. `app/test.html` reaches the app through an iframe, so it could never see `Engine`, `EX`, `doneEx` or `isErr` and bailed out on every run with a misleading "cross-frame block" message — the suite had never executed.

A `TEST HOOKS` block near the end of the script exports them explicitly. Values that get **reassigned** (`cells`, `currentEx`, `currentExId`, `currentCourse`, `targetRefs`) are exported as accessors rather than copies, so the harness never reads a stale reference. Anything added later that the harness needs must be exported here too.

## Landing page & scroll animations

- **Showcase animation** (`#s-showcase`): IntersectionObserver-triggered. A multi-phase state machine: empty → typing wrong formula (`=SUM(C2:C9)`) → red error flash → clear → typing correct formula (`=SUMIFS(C2:C9,B2:B9,"West")`) → green checkmark → hold → loop. Uses character-by-character `typeText()` with a blinking CSS cursor. Resets and restarts on each loop.
- **Scroll reveal** (`.reveal`, `.reveal-scale`, `.reveal-children`): an IntersectionObserver with `root:` set to the `.pagescroll` container (not the viewport, since sections scroll inside a container). At `threshold:0.15`, adds `.visible` class which triggers CSS transitions (translateY, scale, or staggered-delay children).
- **Nav links** (`.nav-scroll`): smooth-scroll to section IDs via `scrollIntoView({behavior:'smooth'})` on the `.pagescroll` container.

## Onboarding walkthrough

A 3-step tooltip tour that fires on first exercise open (guarded by `localStorage` key `tyro_onboard`). Triggered from `openEx()` via `setTimeout(startOnboard, 600)`.

- **STEPS array**: each step defines a `target()` function (returns the DOM element to spotlight), instructional `text`, and a preferred `pos` ("right"/"below"/"above").
- **`positionStep(i)`**: scrolls the target into view (`scrollIntoView({block:"center"})`), measures its `getBoundingClientRect()`, positions a spotlight cutout (`box-shadow: 0 0 0 9999px rgba(0,0,0,.45)`) over it, and places the tooltip. Auto-flips position when there isn't enough room: right→below, below→above, above→below. Clamps horizontal position to keep the tooltip within the viewport.
- **`finishOnboard()`**: hides the overlay and sets `localStorage.setItem("tyro_onboard","1")`. Called by both the "Skip" link and the final "Got it" button.

## Notable design choices / constraints

- **No backend** — everything is client-side. Progress persists in this browser's `localStorage`; moving it between devices uses Export/Import. A Supabase login was built and then removed (2026-11-11) to get the MVP solid first.
- **No build tooling** — plain HTML/CSS/JS split across files, loaded as classic scripts in a fixed order (see High-level structure). A bundler can come later if needed.
- **Content is separate from UI** — exercise data (`EX`, `COURSES`) lives in `js/exercises.js` as hard-coded JS, not loaded from a CMS/database.
- **Shared engine** — `app/engine.js` is loaded by both `app/index.html` and `demo/index.html`. The loaders in `index.html` compute its path so it resolves correctly even under clean-URL redirects.

## Testing

| Harness | Covers | Status |
|---|---|---|
| [`app/test.html`](../app/test.html) | The main app — engine arithmetic, all 74 functions (including financial: PMT/PV/FV/NPV/IRR/XIRR etc.), error codes, `shiftFormula`, every exercise solution against its own checker, DOM structure, state transitions | **283/290** |
| [`demo/demo-test.html`](../demo/demo-test.html) | The demo — solutions, published expected values, seeded data problems, exercise gating, each diagnostic rule, instrumentation privacy | **63/64** |

Both load the real page in a hidden iframe rather than a copy, so they test what ships. Both need the folder served over HTTP (`npx serve`) — browsers block cross-frame access on `file://`.

---
> **Obsidian graph links**
> [[00-overview]] · [[02-features]] · [[03-exercise-catalog]] · [[08-product-changes]] · [[09-keyboard-and-functions]] · [[10-formulas]]
