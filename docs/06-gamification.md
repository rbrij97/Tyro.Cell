# Gamification — engaging without being childish

Status: **proposed**, not yet applied to the product. Depends on the backend/auth work (per-user saved progress) discussed alongside this — these mechanics need a real account system to persist across sessions/devices.

## Design rule

Every mechanic below is a standard engagement-loop pattern (streaks, levels, badges, leaderboards) reskinned in finance-native vocabulary instead of generic game vocabulary, per [05-design-language.md](05-design-language.md). Same psychology, different costume — serious rather than cute, because the audience is adults training for real jobs, not children.

## Mechanics

### 1. Consecutive sessions (the "streak")
- Tracks days in a row the user has completed at least one exercise.
- Displayed as a **row of dated ledger stamps/tally marks**, not a fire emoji counter. Think "audit trail," not "Snapchat streak."
- Breaking a streak should read like a gap in a record (neutral, factual), not a guilt-trip ("you lost your streak!") — keep the tone matter-of-fact, consistent with "serious over cute."

### 2. Skill tiers (replaces XP/levels)
- **Locked (2026-07-21): Easy → Medium → Hard.** Three-tier progression.
- Advancement is driven by exercises/courses mastered (not time spent or arbitrary points) — ties the game mechanic directly to real skill, which also protects the product's credibility ("passed 40 exercises" earns a tier, rather than "logged in 40 days").
- Previous idea of Analyst I → Director career-ladder framing was rejected as too much — simpler tier vocabulary preferred. Option B (Basic/Skilled/Pro) also considered but not chosen.

### 3. Certifications (replaces badges)
- Completing a full course produces a **stamped certification mark** — styled like an approval/audit stamp, not a shiny badge icon.
- Shareable (e.g., downloadable image or LinkedIn-postable) — gives users a reason to publicize progress, which is also organic distribution (ties back to the pitch's Phase 3 organic-growth plan).

### 4. Desk rankings (replaces leaderboard) — opt-in only
- Same idea as a leaderboard, framed as a trading-floor performance board.
- **Decided (2026-07-21):** opt-in only. Off by default; the user actively toggles "show my name on desk rankings" to appear. When off, their row is shown as "Not listed" to themselves and their name is absent for everyone else.
- Data model: `rankings_opt_in (bool)` per user; queries that build the ranking list filter to `WHERE rankings_opt_in = true`.

### 5. In-grid feedback (replaces toasts/confetti)
- Passing an exercise stamps the target cell(s) directly — a green tick/stamp animation *inside the grid*, reinforcing "the sheet is the product," not a popup layered over it.
- Failing shows the existing specific-reason feedback (already implemented in `checkEx`/`diagnose`) — this part of the product already behaves well and isn't being changed, just visually restyled to match the ledger system.

## Data implications (for the backend discussion)
Whatever mechanic gets built needs the account/database work already being planned (Google auth + per-user progress) — none of this can be more than session-deep without it. Minimum fields to plan for per user: `current_streak, longest_streak, last_active_date, exercises_completed[], courses_certified[], skill_tier, rankings_opt_in (bool)`.

## Open questions still to resolve
- Tier naming: **Option A** (Easy / Normal / Hard) vs **Option B** (Basic / Skilled / Pro) — see the design mockup in the browser pane for how both feel side-by-side.
- Terminal (dark) mode: v1 or later?
- Any mechanic here that feels off-brand or unnecessary to cut before we go further?
