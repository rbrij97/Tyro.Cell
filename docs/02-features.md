# Features — `excel-practice (1).html` walkthrough

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
- **Fill handle**: drag to project a formula across a range with correctly shifted relative references (absolute refs with `$` stay locked).
- **Copy/paste** (`Ctrl+C`/`Ctrl+V`): preserves formulas (shifted) and formatting across a rectangular block.
- **Status bar**: live Sum/Average/Count for the current multi-cell selection.
- **Concept panel** (left, exercise mode only): explains the concept being taught, states the task and the answer cell(s), and has a collapsible **Hint**.
- **Right panel**: tabs for *Outline* (this course's exercise list with progress) and *Functions* (searchable reference of all supported functions with syntax + example).
- **Exercise bar**: Previous / Reset / Hint / Solution / **Check Answer** / Next.
- **Answer checking**: instant pass/fail with a **specific reason** on failure — wrong value with expected value shown, missing required function, hard-coded literal detected, off-by-one range, unquoted criteria operator, or a plain-English explanation of the Excel error code produced (`#DIV/0!`, `#N/A`, `#REF!`, `#NAME?` with "did you mean X?" suggestions).
- **Dropdown/classification exercises**: some tasks (e.g. "classify this expense line") replace formula entry with a picklist per cell.
- **Fill-down exercises**: some tasks require one correct formula plus dragging the fill handle down a range, and check every resulting cell independently.

## AI Assistant drawer
- Floating button in the workspace; opens a small chat panel scoped to the current exercise (won't reveal the full solution, per its system context) or general sandbox use.
- **Requires the claude.ai artifact/API-proxied environment to function** — calls the Anthropic Messages API directly from the browser with no key management, so it will show "Assistant unavailable" outside that environment.

## Sandbox mode
- A blank sheet with the full grid/engine/toolbar but no exercise, target cells, or checking — free-form practice or scratch modeling.
