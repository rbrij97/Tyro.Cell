# Features — `app/index.html` walkthrough

## Landing page
- Hero pitch + CTA ("Start practising"), tagline: "No install · No licence · No video queue".
- **Showcase section** — scroll-triggered typing animation: empty cell → wrong formula with red error → correct SUMIFS formula → green checkmark. Loops continuously once scrolled into view.
- **Personas section** — "Who is this for?" — three cards: CA & CMA Students, MBA & B.Com Graduates, Working Analysts.
- **Comparison section** — "This is not another video course" — side-by-side contrasting video tutorials vs tyro.cell's hands-on approach.
- **FAQ section** — five expandable questions (free?, need Excel?, progress saved?, different from YouTube?, what formulas?).
- **Nav links** — Product, Who it's for, Why us, FAQ, Courses — with smooth scroll to sections.
- **Scroll-reveal animations** — all sections fade/slide in via IntersectionObserver: `.reveal` (translateY), `.reveal-scale` (scale), `.reveal-children` (staggered delay per child).
- **Mobile responsive** — full `@media(max-width:600px)` layout: collapsed nav, compact exercise bar/toolbar/grid, truncated breadcrumbs, hidden keyboard hints/status keys, smaller modals.

## Course catalog
- Page title "Courses" with subtitle explaining the format.
- Card per course: title, description, level, estimated hours, exercise count, formula tags (max 8 shown, "+N more" counter for the rest), and a progress bar (`done / total`).
- Upcoming courses marked with a "COMING SOON" badge and dimmed/locked styling.
- **Export/Import progress** — utility text links at the bottom. Export downloads a JSON of completed exercise ids; Import restores state from a previously exported file.

## Course detail
- Course stats: skill level, time to complete, number of practices, prerequisites.
- Modules, each listing its exercises with a completion tick and a level badge (`basic`/`core`/`adv`).
- **Learn ▶** button on modules that have an interactive explainer — opens the learn modal (see below).
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
- **Exercise bar**: badge (Easy/Med/Hard), formula name as primary title, scenario as secondary, then Previous / ▶Learn / Hint / Solution / Reset / **Check Answer** / Next. The Learn button appears only when the current module has an interactive explainer.
- **Learn modal** — opens an iframe overlay showing an interactive formula explainer (`app/learn/`). Animated step-by-step walkthrough: data table, cursor, cell highlighting, formula typing, and subtitle narration. 47 formulas covered. Play/pause, speed control, step counter. The modal can be dismissed (×, backdrop click, or Esc) and the exercise state is preserved underneath.
- **Result popup** — centered modal overlay on answer check. Pass: green checkmark + message + "Next →" and "Repeat" buttons. Fail: red ✗ + diagnostic message + "Try again" button. Replaces the old inline result div.
- **Breadcrumb bar** — workspace titlebar shows: tyro.cell (clickable, returns to landing) / Courses / [Course name] / [Exercise scenario]. Course name crumb only appears when inside a course. Breadcrumbs truncate with ellipsis on mobile.
- **Onboarding walkthrough** — 3-step tooltip tour on first exercise open: (1) concept panel — "read the task here", (2) gold target cell — "type your formula here", (3) Check Answer button — "check your answer". Spotlight cutout highlights each element with a dimmed backdrop. Tooltip auto-positions (right/below/above) with viewport-boundary clamping and scrolls the target into view. Skippable at any step. Fires once per device (`localStorage` flag).
- **Answer checking**: instant pass/fail with a **specific reason** on failure — wrong value with expected value shown, missing required function, hard-coded literal detected, off-by-one range, unquoted criteria operator, or a plain-English explanation of the Excel error code produced (`#DIV/0!`, `#N/A`, `#REF!`, `#NAME?` with "did you mean X?" suggestions).
- **Dropdown/classification exercises**: some tasks (e.g. "classify this expense line") replace formula entry with a picklist per cell.
- **Fill-down exercises**: some tasks require one correct formula plus dragging the fill handle down a range, and check every resulting cell independently.

## Removed: AI assistant

The floating AI chat drawer has been **cut and deleted from the code**. It called the Anthropic Messages API directly from the browser with no key handling, so it only ever worked inside an API-proxied sandbox and showed "Assistant unavailable" everywhere else. `app/test.html` now asserts it stays gone.

## The public demo

`demo/index.html` is a separate, self-contained three-exercise build used as a shop window: no signup, no backend, gated progression, a completion screen, and privacy-respecting funnel instrumentation (no third-party script, no personal data, the user's formula text is never recorded). It shows a "best on desktop" panel on small screens rather than a broken grid. See [`demo/README.md`](../demo/README.md).

## Sandbox mode
- A blank sheet with the full grid/engine/toolbar but no exercise, target cells, or checking — free-form practice or scratch modeling.
- Not linked in navigation (removed from landing nav during content redesign); still accessible programmatically.

## Learn pages (`app/learn/`)
- 47 interactive formula explainers, each a data-driven animation powered by `engine.js` (the Explainer Engine).
- Each formula config defines: data table, column headers, formula text with syntax coloring, step-by-step animation phases (cell highlights, cursor movement, value floats, subtitle narration).
- Transport controls: play/pause, progress bar, step counter, speed toggle (1×/2×/3×).
- Tyro.cell branded (monochrome logo, black controls). Brand link uses `target="_top"` to navigate the parent frame when embedded.
- Loaded via hash-based routing (`learn/#sum`) — hash params survive server redirects that strip query strings.

---
> **Obsidian graph links**
> [[00-overview]] · [[01-architecture]] · [[03-exercise-catalog]] · [[09-keyboard-and-functions]] · [[05-design-language]] · [[08-product-changes]]
