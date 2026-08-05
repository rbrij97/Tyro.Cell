# Keyboard & function reference

Everything the engine can compute, and every key it responds to. Counts verified against the running app, not from memory.

---

# Part 1 · Keyboard

## The rule that decides what we can build

A web page can intercept **most** key combinations with `preventDefault()`. It can intercept **none** of the ones the browser reserves for its own window management. There is no workaround, no permission, no flag — those keys never reach the page.

So the design rule is: **bind everything that reaches us, and never bind anything that doesn't.** A shortcut that silently fails is worse than an absent one, because the user concludes the app is broken.

## Implemented — verified working

Tested by dispatching real key events into the running app.

### Moving
| Key | Action |
|---|---|
| `↑` `↓` `←` `→` | Move one cell |
| `Ctrl` + arrow | Jump to the edge of the data region |
| `Ctrl+Home` | Go to A1 |
| `Ctrl+End` | Go to the last used cell |
| `Tab` / `Shift+Tab` | Move right / left |
| `Enter` / `Shift+Enter` | Move down / up |

`Ctrl`+arrow follows Excel's real rule: if the next cell is filled, run to the last filled cell of the block; otherwise skip the gap and land on the next filled cell; if nothing is filled beyond, run to the sheet edge.

### Selecting
| Key | Action |
|---|---|
| `Shift` + arrow | Extend the selection |
| `Ctrl+Shift` + arrow | Extend to the edge of the data |
| `Ctrl+A` | Select the whole used range |
| `Ctrl+Space` | Select the column |
| `Shift+Space` | Select the row |

### Writing formulas
| Key | Action |
|---|---|
| `=` | Start a formula |
| `F2` | Edit the cell in place |
| arrows *(while typing)* | Point mode — pick a cell reference |
| `Shift` + arrows *(while typing)* | Extend the picked range |
| `F4` | Cycle `A1` → `$A$1` → `A$1` → `$A1` → `A1` |
| `Alt+=` | AutoSum the run of numbers above, else to the left |
| `Enter` / `Esc` | Confirm / cancel |
| `Ctrl+Enter` | Commit the entry into **every** selected cell |

### Filling & editing
| Key | Action |
|---|---|
| `Ctrl+D` | Fill down |
| `Ctrl+R` | Fill right |
| `Ctrl+C` / `Ctrl+V` | Copy / paste, with references shifted |
| `Ctrl+Z` / `Ctrl+Y` | Undo / redo (`Ctrl+Shift+Z` also redoes) |
| `Ctrl+B` / `Ctrl+I` / `Ctrl+U` | Bold / italic / underline |
| `Ctrl+;` | Insert today's date |
| `Delete` / `Backspace` | Clear the selected cells |

`Ctrl+D` and `Ctrl+R` follow Excel: on a single-cell selection they pull from the neighbouring cell; on a range they project the first row/column across the rest.

## Never available — do not bind

Reserved by the browser or the OS. `preventDefault()` has no effect; the page never sees them.

| Key | Taken by | Excel would use it for |
|---|---|---|
| `Ctrl+T` | New tab | Create table |
| `Ctrl+N` | New window | New workbook |
| `Ctrl+W` | Close tab | Close workbook |
| `Ctrl+Shift+T` | Reopen closed tab | — |
| `Ctrl+Tab` | Next tab | Next workbook |
| `Ctrl+1` … `Ctrl+9` | Switch to tab *n* | **`Ctrl+1` = Format Cells** |
| `F11` | Fullscreen | Create chart |
| `F12` | DevTools | Save As |
| `Ctrl+Shift+I/J/C` | DevTools | — |
| `Alt+F4` | Close window (OS) | Close Excel |

**`Ctrl+1` is the only painful loss** — Format Cells is a genuinely common Excel reflex and the key is unreachable. If number formatting is built later it needs a different binding; `Ctrl+Shift+1`…`6` (Excel's own number-format shortcuts) *are* reachable and are the natural home for it.

## Reachable, but shared with a browser default

These work, but the browser also does something with them, so binding is a deliberate trade. All are bindable — Google Sheets binds every one of them.

| Key | Browser default | Excel meaning | Our call |
|---|---|---|---|
| `Ctrl+D` | Bookmark page | Fill down | **Bound** — verified no bookmark dialog |
| `Ctrl+R` | Reload page | Fill right | **Bound** — verified no reload |
| `Ctrl+A` | Select all | Select all | **Bound** |
| `Ctrl+S` | Save page | Save | Not bound — nothing to save yet |
| `Ctrl+P` | Print | Print | Not bound |
| `Ctrl+F` | Find bar | Find | Not bound — no find feature yet |

### How this was verified

Not from documentation — by pressing the keys. A capture-phase listener on the live app called `preventDefault()` and recorded whether the page kept focus and whether it survived. `Ctrl+R` is the strongest result: the page did **not** reload, which would have been unmistakable. `Ctrl+D` raised no bookmark dialog and kept focus.

Caveat worth keeping: this was tested in an embedded browser pane. A standalone Chrome window may behave differently for browser-chrome keys specifically (`Ctrl+T/N/W`, `Ctrl+1–9`) — those are listed as unavailable on the strength of documented browser behaviour, not on this test, because testing them destructively closes the tab.

## Platform notes

- **macOS** — `Cmd` substitutes for `Ctrl`. The handler already accepts `metaKey` everywhere it accepts `ctrlKey`. But `Cmd+1–9` still switches tabs, and `Ctrl`+arrow is captured by Mission Control at OS level, so edge-jump may need `Cmd`+arrow on Mac. **Untested on macOS.**
- **Windows** — pressing `Alt` alone focuses the browser menu bar in some builds. `Alt+=` works because the combination is consumed before release.

---

# Part 2 · Functions

**74 functions.** This is the canonical count — other docs reference this file. Everything below is implemented and covered by the test suite.

### Math & aggregation (17)
`SUM` `AVERAGE` `MIN` `MAX` `MEDIAN` `PRODUCT` `ABS` `SQRT` `POWER` `MOD` `INT` `ROUND` `ROUNDUP` `ROUNDDOWN` `PI` `RAND` `RANDBETWEEN`

### Counting (3)
`COUNT` `COUNTA` `COUNTBLANK`

### Conditional (8)
`IF` `IFERROR` `COUNTIF` `COUNTIFS` `SUMIF` `SUMIFS` `AVERAGEIF` `AVERAGEIFS`

### Logical (3)
`AND` `OR` `NOT`

### Text (13)
`LEN` `UPPER` `LOWER` `PROPER` `TRIM` `LEFT` `RIGHT` `MID` `CONCAT` `CONCATENATE` `TEXTJOIN` `FIND` `SUBSTITUTE`

### Lookup (5)
`VLOOKUP` `HLOOKUP` `XLOOKUP` `INDEX` `MATCH`

### Date (9)
`TODAY` `NOW` `DATE` `YEAR` `MONTH` `DAY` `DAYS` `TEXT` `EOMONTH`

### Financial (13)
`NPV` `IRR` `XNPV` `XIRR` `PMT` `PV` `FV` `NPER` `RATE` `IPMT` `PPMT` `SLN` `DB`

### Info (3)
`ISNUMBER` `ISTEXT` `ISBLANK`

## Engine behaviours worth knowing

These are real semantics that exercises can lean on — or trip over.

- **`IF`, `IFERROR` and `XLOOKUP` are lazy.** Their arguments are AST nodes, not pre-evaluated values, so short-circuiting and error-fallback work properly.
- **Text sorts above every number** in comparisons, as in Excel. A date stored as text therefore *passes* a `>= someSerial` filter instead of being excluded — a silent wrong answer, and the basis of a demo exercise.
- **No array semantics.** `TRIM(A2:A21)` throws `#VALUE!`. Functions taking a scalar cannot be handed a range, so array-style answers are impossible by construction.
- **Dates are serial numbers.** There is no date cell format; a date renders as a bare number unless the view formats it. The demo formats a flagged column as `dd-mm-yyyy` for display only.
- **`$` is stripped at tokenise time.** Absolute references matter only to `shiftFormula`, i.e. to filling and copying — never to evaluation.
- **Errors are thrown, not returned** — as `{__err: "#N/A"}` — and caught at the display and checker layers.

## Not implemented

Worth knowing before writing exercises that would need them:

`SUMPRODUCT` · `IFNA` · `IFS` · `VALUE` · `DATEVALUE` · `SEARCH` (only case-sensitive `FIND` exists) · `EXACT` · `FILTER` · `UNIQUE` · `SORT` · `ROWS` · `COLUMNS` · `OFFSET` · `INDIRECT` · `EDATE` · `NETWORKDAYS` · `YEARFRAC`

**Financial functions are now implemented** (NPV, IRR, XNPV, XIRR, PMT, PV, FV, NPER, RATE, IPMT, PPMT, EOMONTH, SLN, DB). DCF, loan schedule, and time-value-of-money exercises can now be written. `EOMONTH` has also been added to the date family.

---
> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[03-exercise-catalog]] · [[08-product-changes]] · [[10-formulas]]
