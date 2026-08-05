# Design language

> ## Current direction: Tyro.cell (locked 2026-08-01)
>
> **The name is Tyro.cell.** The logo is a blocky **T** built on a cell grid, with a detached square that doubles as the dot in *Tyro.cell* — a hard-edged black tile, no rounded corners. Source: [`demo/logo.svg`](../demo/logo.svg), also inlined in each page and used as the favicon via a data URI so nothing external loads.
>
> **Because the mark is pure black and white, the brand is monochrome and colour only ever carries meaning:**
>
> | Colour | Reserved for |
> |---|---|
> | Black `#0A0A0A` | Every brand and interactive surface — primary buttons, cell selection, fill handle, active editor border |
> | Green `#0F7A48` | Correct answers only |
> | Red `#A4463C` | Wrong answers only |
> | Gold `#8A6B12` | "Your answer goes here" — target cells, hint rail, prototype banner |
> | Blue | One exception: point-mode range highlighting, which follows Excel's own convention |
>
> Type: **Instrument Sans** (UI), **Instrument Serif** (italic accents), **JetBrains Mono** (all data, formulas, cell refs, labels). Background is neutral white, not warm paper — cream fought the stark black mark. Corner radii are tight (5–8px) to sit with a hard-edged square logo. Difficulty badges read as **increasing ink density** (light grey → grey → solid black) rather than three unrelated hues.
>
> **Applied so far to `demo/` only.** `app/index.html` still uses the earlier Instrument Sans + `#16A05C` green scheme and the FormulaLab name; `pitch/index.html` still uses the ledger palette and the FinCell name. Neither has been migrated.

---

## Superseded proposal — "The Analyst's Ledger"

Status: **superseded.** Kept for the reasoning, which is still sound; the palette and type choices were not adopted. Both this and a later "Workbench" mockup were rejected before the Tyro.cell mark settled the question. Read the principles below as still-valid intent, and the specific colour/type values as historical.

## Why this exists

The pitch deck ([pitch/index.html](../pitch/index.html)) already has a distinctive visual identity — warm paper, ink/green ledger tones, monospace numerals, a formula bar used as navigation chrome. The actual product prototype ([app/index.html](../app/index.html)) doesn't share it — it clones Microsoft Excel's own green + Segoe UI, which is the most expected, generic choice available. This doc proposes carrying the pitch's identity into the product instead, so the product looks like *itself*, not like a copy of Excel.

## Principles

1. **Serious over cute.** The audience is adults prepping for real finance jobs. No mascots, no cartoon coins, no confetti bursts. Playfulness comes from precision and craft, not childishness.
2. **Earned, not given.** Feedback and progress markers should feel like a stamped, audited record — something you *earned* by getting the formula right — not a participation-trophy animation.
3. **Finance-native metaphors, not game metaphors.** Every gamification mechanic (see [06-gamification.md](06-gamification.md)) is reskinned in the vocabulary of the job the user is training for: ledgers, stamps, career ladders, desks — not XP bars, levels, and fire emoji.
4. **The grid is the stage.** Feedback happens inside the spreadsheet (a cell gets stamped, a row highlights) rather than in popups/toasts layered on top of it. The product should never let you forget you're looking at a working sheet.
5. **Numbers are always monospace.** Anything that is data, a formula, or an amount is set in `JetBrains Mono` so it reads like a real ledger/terminal, never proportional-font "app UI" numerals.

## Visual system

### Color tokens (extending the pitch deck's existing palette)
```
--ink:          #0d1b17   text, dark surfaces
--paper:        #f3f1e9   default background (warm, not white)
--grid:         #d9d6c8   cell borders / structural lines
--cell:         #ffffff   card / input surfaces
--green:        #0a6b4a   primary brand
--green-bright: #16a06e   success / active state
--formula:      #1452c9   links, formula syntax highlighting
--amber:        #c47a16   warnings, in-progress, "core" difficulty badge
--muted:        #5d6b63   secondary text
--line:         #c9c6b8   dividers
```
Do not introduce a purple/blue SaaS gradient, a bright cartoon palette, or Excel's own literal green (`#107C41`) — pick colors from this ledger palette instead so the product doesn't read as "Excel clone."

### Typography
- **Space Grotesk** — headings, career-ladder titles, big numbers (streak count, score).
- **Inter** — body copy, descriptions, UI labels.
- **JetBrains Mono** — anything that is a formula, a cell reference, an amount, a date, a stat. This is the single most important rule for making the product feel like a real analyst tool rather than a generic app.

### Two modes, one token system
- **Ledger mode** (default, light) — paper/ink/green, as above. Warm, analog, approachable.
- **Terminal mode** (optional, dark) — same token *roles* remapped to a dark trading-terminal feel (dark background, green/amber monospace text). Appeals to the "Bloomberg terminal" aesthetic finance students already recognize and respect. Both modes share the same semantic tokens so components don't need separate logic, only a different value set.

### Motifs to reuse deliberately
- The **formula bar** as a recurring chrome element (already used as top nav in the pitch) — reuse it as a structural motif elsewhere (e.g. a "record" of what you're viewing), not just once on the landing page.
- **Cell references and grid lines as decoration** — borders, dividers, and section markers drawn like spreadsheet gridlines instead of generic card shadows.
- **Stamps, not toasts** — a completed exercise/course gets a stamp-style mark (like an audit approval), not a floating success toast.

## Explicitly avoid
- Mascots, cartoon characters, emoji-driven UI (fire streaks, trophy emoji, coin icons).
- Confetti/particle-burst success animations.
- Generic SaaS visual cliché: purple-to-blue gradients, blob shapes, glassmorphism, oversized rounded corners on everything.
- Cloning Microsoft Excel's actual color scheme (`#107C41` green, Segoe UI, ribbon-style icons) — the goal is Excel-*compatible skills*, not an Excel *lookalike brand*.

## Resolved
- **Terminal (dark) mode** — not in V1. Light only.
- **Existing brand work** — resolved: the Tyro.cell mark is now the identity. See the block at the top of this file.
- **Open:** whether to migrate `app/index.html` and `pitch/index.html` onto the Tyro.cell name and palette, or leave them until the product settles.

---
> **Obsidian graph links**
> [[00-overview]] · [[02-features]] · [[06-gamification]] · [[08-product-changes]]
