# Design language — "The Analyst's Ledger"

Status: **proposed**, not yet applied to the product. Written for discussion — react and redirect before this gets treated as final.

## Why this exists

The pitch deck ([FinCell-pitch.html](../FinCell-pitch.html)) already has a distinctive visual identity — warm paper, ink/green ledger tones, monospace numerals, a formula bar used as navigation chrome. The actual product prototype ([excel-practice (1).html](../excel-practice%20%281%29.html)) doesn't share it — it clones Microsoft Excel's own green + Segoe UI, which is the most expected, generic choice available. This doc proposes carrying the pitch's identity into the product instead, so the product looks like *itself*, not like a copy of Excel.

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

## Open questions for the user
- Terminal (dark) mode: nice-to-have later, or part of the v1 launch?
- Any existing brand color/logo work already done outside these two files that this should reconcile with?
