# Monetization strategy — how Tyro.cell makes money

Status: **proposed for pitch use**, not yet committed. Written 2026-07-21. Nothing here is built — there is no backend, no accounts and no payments.

> **Current stance (2026-08-01): distribution is deliberately paused.** The decision is to get the product right before chasing revenue or users, so the Phase 1 activities below are on hold rather than in progress. Meant to replace the single-sentence "freemium" line in the current pitch deck with something a mentor / potential investor / potential co-founder would actually find credible.

## The core framing

Indian B2C edtech has notoriously low conversion (typically 1–3% of active users convert to paid). B2B channels — colleges, corporates — are where sticky revenue actually lives in Indian edtech. Any monetization plan that leads with subscription revenue as the primary channel underestimates the Indian market. Lead with **B2C for validation**, plan for **B2B for scale**.

## Channels ranked by realism (for Phase 1 → Phase 4)

### Channel 1 · B2C freemium — validation channel, not primary revenue

- **Free tier**: 10–15 exercises, sandbox access, basic streak tracking, "look and feel" of the product.
- **Paid tier**: Full course library (~60+ exercises), verified certifications, interview-question bank, cross-device progress, no ads.
- **Pricing** (indicative): ₹399 / month, ₹2,499 / year, ₹499 for a single-course pass.
- **Reference points**: Zerodha Varsity is fully free; Coursera Plus ₹4,900+/mo; Skillshare-India ₹1,679/year. Our pricing sits deliberately below the international bar.
- **Realistic conversion**: 1–3% of active users. Assume the low end.
- **Role**: proves "will people pay for this?" Not the main revenue engine. If B2C alone had to carry the business, the business wouldn't work.

### Channel 2 · Verified certifications — the LinkedIn moment

- **Model**: one-time ₹499–999 per completed course, with a proctored final assessment and a shareable, verifiable certificate.
- **Why this works**: the outcome is concrete — something to put on a LinkedIn profile before an interview. Concrete outcomes convert better than "keep learning" subscriptions.
- **Precedent**: CFI's entire business is essentially this. The certificate-sale model is a proven Indian edtech revenue mechanic.
- **Positioning against CFI**: their FMVA certificate is $497 (~₹41,000). Ours at ₹499–999 makes the price the wedge.
- **Can be sold à la carte OR bundled into the annual subscription** — start à la carte for simplicity.

### Channel 3 · College & placement-cell licensing — the real revenue channel

- **Model**: annual licensing to colleges. ₹100–300 per enrolled student per semester, volume-tiered.
- **What the college gets**: student progress dashboard for the placement cell, cohort readiness reports, ability to bundle FormulaLab into their placement prep, custom course tracks.
- **Sales approach**: start with tier-2 and tier-3 colleges — these need placement-readiness tools most, CFI's US pricing puts it out of reach for them, and there's less procurement friction than tier-1.
- **Precedent**: InterviewBit, HackerRank, GeeksforGeeks all do college licensing heavily. This model is proven in Indian tech education.
- **Illustrative economics**: 10 colleges × 500 students × ₹200/semester = ₹10 lakh/semester = ~₹20 lakh ARR from one channel. Ten colleges is a realistic year-1 target if the product works.
- **Stickiness**: annual renewal cycles, procurement bundling, and college-to-college referrals make this much stickier than B2C subscription churn.

### Channel 4 · Corporate / GCC training — Phase 3+, high margin

- **Who**: Global Capability Centres of JPM, Goldman, Deloitte, Accenture, Big 4 firms — all onboard hundreds of fresh grads a year in India and all need to train Excel.
- **Model**: enterprise per-seat licensing, ₹800–2,500 per employee per year.
- **Requires**: SSO, admin dashboards, seat management, analytics — real product engineering work. **Do not chase this before Channel 3 is working.**
- **Why it matters later**: higher ACV, longer sales cycle, much higher margins once the channel opens. Also validates the product at a professional level, which feeds back into B2C credibility.

### Channel 5 · Hiring marketplace — Phase 4+, only if PMF is real

- **Model**: once thousands of skilled users exist with proven scores, employers pay to hire from that pool. Naukri / Indeed-adjacent revenue.
- **Requires**: real user base at scale, credible skill verification, product-market fit already proven.
- **Do not pitch this early.** It's the fourth-year story, not the first-year story.

## Not recommended

- **Ads on the free tier** — Indian CPMs are low, ads degrade the product, contradicts the "serious professional tool" positioning we're aiming for. Not worth it.
- **Affiliate marketing of third-party finance courses** — off-brand, small revenue, distracts from the actual product.
- **Third-party course marketplace** (letting anyone publish courses) — dilutes brand and quality control. Wrong for the premium positioning.

## Recommended sequencing (matches the pitch's existing 3-phase roadmap)

| Phase | Focus | Revenue channels active |
|---|---|---|
| **Phase 1 · Month 0–2 (Validate)** | Free + à-la-carte Certifications | Channel 2 only. Simplest possible revenue mechanic — see if anyone will actually pay ₹499 for a certificate. |
| **Phase 2 · Month 2–6 (Build)** | Add annual subscription. Start college conversations. | Channels 1 + 2. Pilot 3–5 colleges at zero or nominal cost to prove the placement-cell dashboard is worth something. |
| **Phase 3 · Ongoing (Grow)** | Turn college pilots into paid contracts. First corporate pilot. | Channels 1 + 2 + 3. Channel 3 becomes the dominant revenue line. |
| **Phase 4 · Mature** | Enterprise / GCC scale. Hiring marketplace exploration. | All channels. |

## Rough unit economics (illustrative, honest — refine before raising)

| Metric | Estimate |
|---|---|
| Infrastructure cost / user / month (at 100 users) | ₹5–15, falling with scale |
| LTV — paid B2C user (single certificate) | ₹499–999 |
| LTV — annual subscriber | ₹2,499 × 1.5-year avg tenure ≈ ₹3,500 |
| LTV — college-licensed student | ₹200 × 4–6 semesters ≈ ₹1,000 |
| CAC — B2C organic (Phase 1) | ₹0–50 |
| CAC — B2C paid (later) | ₹100–500 |
| CAC — B2B college win | ₹5,000–20,000 sales cost, amortized over 500+ students → ₹10–40 per student |

These are directional. Real numbers require a Phase-1 pilot with paid conversion data.

## Honest risks to name in the pitch

1. **Indian B2C willingness to pay** is low outside massive brand names (Byju's, Unacademy, PhysicsWallah — mostly K-12 test prep, not adult upskilling). A ₹499 certificate might still be too expensive for a college student to buy without their parents' credit card. This is the single biggest revenue risk.
2. **College sales cycles are slow** — 3–9 months from first meeting to signed contract, requires in-person or serious virtual sales effort. Not a Phase-1 activity.
3. **CFI is actively targeting India** with an India-specific FMVA pricing offer (confirmed on their site — they detect Indian IPs and pop an India-pricing modal). The "prestige certificate" positioning is contested. Winning requires being *visibly better on hands-on practice*, not competing on certificate design.
4. **Revenue timing**: real recurring revenue is Phase 3, ~9–12 months out. Anyone funding this needs to be comfortable with that timeline.

## The pitch line (for verbal delivery, not the deck)

> "We start with certificate sales — cheap, one-time, proves willingness to pay. Then subscription for retention. Then college licensing, which is where Indian edtech actually makes money. Corporate and GCC training is the third-year story. Anyone who tells you they're going to make ₹5 crore ARR in year one from B2C subscription in Indian edtech is either lying or hasn't looked at Unacademy's numbers."

---
> **Obsidian graph links**
> [[00-overview]] · [[04-roadmap-risks]] · [[06-gamification]] · [[08-product-changes]]
