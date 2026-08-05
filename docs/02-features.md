# Features — `app/index.html` walkthrough

## Landing page
- Hero pitch + two CTAs: "Browse courses" and "Open blank sheet" (sandbox).
- Three feature callouts: real formula engine, verified practice (answer + function checking), structured courses.

## Course catalog
- Card per course: title, description, level, estimated hours, exercise count, and a progress bar (`done / total`).
- **Export progress** — downloads `formulalab-progress.json` (list of completed exercise ids).
- **Import progress** — restores completed-exercise state from a previously exported file.

## Course detail
- Course stats: skill level, time to complete, number of practices, prerequisites.
- Modules, each listing its exercises with a completion tick and a level badge (`basic`/`core`/`adv`).
- **START**/**CONTINUE** button jumps to the next incomplete exercise.

## Workspace (the spreadsheet)
- **Grid**: 16 columns × 60 rows, Excel-style, with sticky headers, cell selection (click/drag/shift-click/keyboard), row/column highlight on selection.
- **Formula bar**: name box (jump to a cell by typing its ref) + live formula/value editor.
- **Toolbar**: Bold/Italic/Underline (`Ctrl+B/I/U`), Clear cell, Clear sheet.
- **In-cell editing**: double-click or start typing to edit; `Enter` confirms and moves down, `Tab` confirms and moves right, `Esc` cancels, `F2` edits in place.
- **Point mode**: while editing a formula, arrow keys or mouse drag pick a cell/range and insert the reference — same UX as real Excel/Sheets.
- **Full keyboard operation** — the grid can be driven without a mouse: `Ctrl+D`/`Ctrl+R` fill, `Ctrl+Enter` commits into a whole selection, `F4` cycles `$` locks, `Ctrl`+arrow jumps to the edge of the data, `Alt+=` AutoSums, `Ctrl+Z`/`Ctrl+Y` undo and redo. Complete list in [09-keyboard-and-functions.md](09-keyboard-and-functions.md).
- **Fill handle**: drag to project a formula across a range with correctly shifted relative references (absolute refs with `$` stay locked). `Ctrl+D`/`Ctrl+R` do the same thing from the keyboard.
- **Copy/paste** (`Ctrl+C`/`Ctrl+V`): preserves formulas (shifted) and formatting across a rectangular block.
- **Status bar**: live Sum/Average/Count for the current multi-cell selection.
- **Concept panel** (left, exercise mode only): explains the concept being taught, states the task and the answer cell(s), and has a collapsible **Hint**.
- **Right panel**: three tabs — *Outline* (this course's exercise list with progress), *Functions* (reference for [all 74 functions](09-keyboard-and-functions.md) with syntax + example), and *Keys* (every keyboard shortcut, plus an explicit note naming the keys the browser reserves and why they can't work).
- **Exercise bar**: Previous / Reset / Hint / Solution / **Check Answer** / Next.
- **Answer checking**: instant pass/fail with a **specific reason** on failure — wrong value with expected value shown, missing required function, hard-coded literal detected, off-by-one range, unquoted criteria operator, or a plain-English explanation of the Excel error code produced (`#DIV/0!`, `#N/A`, `#REF!`, `#NAME?` with "did you mean X?" suggestions).
- **Dropdown/classification exercises**: some tasks (e.g. "classify this expense line") replace formula entry with a picklist per cell.
- **Fill-down exercises**: some tasks require one correct formula plus dragging the fill handle down a range, and check every resulting cell independently.

## Removed: AI assistant

The floating AI chat drawer has been **cut and deleted from the code**. It called the Anthropic Messages API directly from the browser with no key handling, so it only ever worked inside an API-proxied sandbox and showed "Assistant unavailable" everywhere else. `app/test.html` now asserts it stays gone.

## The public demo

`demo/index.html` is a separate, self-contained three-exercise build used as a shop window: no signup, no backend, gated progression, a completion screen, and privacy-respecting funnel instrumentation (no third-party script, no personal data, the user's formula text is never recorded). It shows a "best on desktop" panel on small screens rather than a broken grid. See [`demo/README.md`](../demo/README.md).

## Sandbox mode
- A blank sheet with the full grid/engine/toolbar but no exercise, target cells, or checking — free-form practice or scratch modeling.

---
> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[03-exercise-catalog]] · [[09-keyboard-and-functions]] · [[05-design-language]]
