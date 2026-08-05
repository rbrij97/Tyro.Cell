/* ================================================================
   ROUNDUP, ROUNDDOWN — Conservative vs aggressive rounding
   Finance-critical: provisions round UP, conservative estimates DOWN.
   ================================================================ */

const ROUNDUP_CONCEPT = "<p><b class='term'>ROUNDUP</b> always rounds away from zero (makes the number larger in absolute terms).</p><span class='formula'>=ROUNDUP(number, digits)</span><p>Finance use: EMI calculations (bank charges full rupees), provision amounts (always round up for conservatism), tax liabilities (round up to be safe), ceiling estimates in budgets.</p>";

const ROUNDDOWN_CONCEPT = "<p><b class='term'>ROUNDDOWN</b> always rounds toward zero (truncates, makes the number smaller in absolute terms).</p><span class='formula'>=ROUNDDOWN(number, digits)</span><p>Finance use: NAV calculations (AMC convention rounds down), bonus/split share allocation (can't issue fractional shares), conservative revenue estimates, floor values.</p>";

// ===== ROUNDUP (2 exercises) =====

EX.roundup_emi = {lvl:"easy", title:"Round up EMI to next whole rupee — bank never charges less",fn:"ROUNDUP",
  concept: ROUNDUP_CONCEPT,
  desc:"A home loan EMI works out to ₹47,832.67 per month. The bank always rounds UP to the next whole rupee — they never charge less than the exact amount. Use ROUNDUP to 0 decimal places. The raw EMI is in B2.",
  data:{A1:"Metric",B1:"Value",
    A2:"Raw EMI (₹)",B2:47832.67,
    A3:"Actual EMI (₹)"},
  target:"B3",requires:["ROUNDUP("],solution:"=ROUNDUP(B2,0)",
  hint:"=ROUNDUP(B2, 0) rounds 47832.67 up to 47833. Bank charges ₹47,833."};

EX.roundup_provision = {lvl:"medium", title:"Round up bad debt provision to nearest lakh for conservatism",fn:"ROUNDUP",
  concept: ROUNDUP_CONCEPT,
  desc:"The CFO's rule: bad debt provisions are always rounded UP to the nearest lakh (₹1,00,000). A provision of ₹3,42,500 becomes ₹4,00,000. This ensures the company never under-provisions. ROUNDUP with digits = -5 rounds to the nearest lakh.",
  data:{A1:"Client",B1:"Outstanding (₹)",C1:"Prov % ",D1:"Raw Provision",E1:"Rounded Prov",
    A2:"Sunrise Steel",B2:2500000,C2:0.15,D2:375000,
    A3:"Moon Textiles",B3:1800000,C3:0.20,D3:360000,
    A4:"Star Pharma",B4:4200000,C4:0.10,D4:420000},
  target:"E2",requires:["ROUNDUP("],solution:"=ROUNDUP(D2,-5)",
  hint:"ROUNDUP(375000, -5) → 400000. The -5 rounds to the nearest 1,00,000 (lakh) upward."};

// ===== ROUNDDOWN (2 exercises) =====

EX.rounddown_nav = {lvl:"easy", title:"Round down mutual fund NAV to 2 decimals (SEBI convention)",fn:"ROUNDDOWN",
  concept: ROUNDDOWN_CONCEPT,
  desc:"SEBI guidelines: mutual fund NAVs are truncated to 2 decimal places, never rounded up. A calculated NAV of ₹45.6789 becomes ₹45.67, not ₹45.68. Use ROUNDDOWN to 2 decimal places.",
  data:{A1:"Fund",B1:"Calculated NAV",C1:"Published NAV",
    A2:"HDFC Flexi Cap",B2:45.6789,
    A3:"SBI Blue Chip",B3:72.3451,
    A4:"ICICI Value",B4:128.999},
  target:"C2",requires:["ROUNDDOWN("],solution:"=ROUNDDOWN(B2,2)",
  hint:"=ROUNDDOWN(B2, 2) truncates 45.6789 to 45.67. Never rounds up."};

EX.rounddown_bonus = {lvl:"medium", title:"Bonus shares — round down to whole shares (no fractions)",fn:"ROUNDDOWN",
  concept: ROUNDDOWN_CONCEPT,
  desc:"TCS declared a 1:1 bonus. Your client holds 150 shares through a fractional share platform showing 150.7 shares. Bonus is calculated on exact holding, but you can only receive WHOLE bonus shares — fractional shares are settled in cash. ROUNDDOWN the bonus entitlement (B2 × bonus ratio in C2) to 0 decimals.",
  data:{A1:"Client",B1:"Holdings",C1:"Bonus Ratio",D1:"Bonus Shares",
    A2:"Priya S",B2:150.7,C2:1,
    A3:"Rahul K",B3:85.3,C3:1,
    A4:"Meera J",B4:200.9,C4:1},
  target:"D2",requires:["ROUNDDOWN("],solution:"=ROUNDDOWN(B2*C2,0)",
  hint:"=ROUNDDOWN(B2*C2, 0). 150.7 × 1 = 150.7 → 150 whole bonus shares."};
