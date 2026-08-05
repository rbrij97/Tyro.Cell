/* ================================================================
   POWER — CAGR, compound interest, geometric growth
   THE most important finance math function after basic arithmetic.
   ================================================================ */

const POWER_CONCEPT = "<p><b class='term'>POWER</b> raises a number to a given exponent.</p><span class='formula'>=POWER(base, exponent)</span><p>Finance use: CAGR = (End/Start)^(1/n) − 1. Also: compound interest (Principal × (1+r)^n), geometric mean returns, future value calculations. POWER(x, 0.5) = square root.</p>";

// ===== EASY: Simple compound interest =====

EX.power_fd = {lvl:"easy", title:"FD maturity — compound interest with POWER",fn:"POWER",
  concept: POWER_CONCEPT,
  desc:"Your client deposited ₹5,00,000 in an SBI FD at 7% annual interest, compounded annually for 3 years. Compute the maturity amount: Principal × (1 + rate)^years. Use POWER for the exponent part. Principal in B2, rate in B3, years in B4.",
  data:{A1:"Metric",B1:"Value",
    A2:"Principal (₹)",B2:500000,
    A3:"Rate (annual)",B3:0.07,
    A4:"Years",B4:3,
    A5:"Maturity (₹)"},
  target:"B5",requires:["POWER("],solution:"=B2*POWER(1+B3,B4)",
  hint:"=B2*POWER(1+B3, B4). Maturity = 5,00,000 × (1.07)^3 = ₹6,12,521.50."};

// ===== MEDIUM 1: Revenue CAGR =====

EX.power_cagr_revenue = {lvl:"medium", title:"Compute Reliance's 5-year revenue CAGR",fn:"POWER",
  concept: POWER_CONCEPT,
  desc:"Reliance's revenue grew from ₹3,39,159 Cr (FY19) to ₹8,75,000 Cr (FY24). Compute the CAGR: (End/Start)^(1/years) − 1. Multiply by 100 and ROUND to 1 decimal for a clean percentage. This is the single most-used growth metric in equity research.",
  data:{A1:"Metric",B1:"Value",
    A2:"FY19 Revenue (₹ Cr)",B2:339159,
    A3:"FY24 Revenue (₹ Cr)",B3:875000,
    A4:"Years",B4:5,
    A5:"CAGR %"},
  target:"B5",requires:["POWER(","ROUND("],solution:"=ROUND((POWER(B3/B2,1/B4)-1)*100,1)",
  hint:"CAGR = (End/Start)^(1/n) − 1. Then ×100 for %. (875000/339159)^(1/5) − 1 ≈ 20.9%."};

// ===== MEDIUM 2: Stock price CAGR =====

EX.power_cagr_stock = {lvl:"medium", title:"TCS stock price CAGR over 4 years",fn:"POWER",
  concept: POWER_CONCEPT,
  desc:"TCS traded at ₹2,050 in Aug 2020 and ₹4,180 in Aug 2024. What's the 4-year stock price CAGR? Analysts use this to compare stock performance across different holding periods. Return the CAGR as a percentage rounded to 1 decimal.",
  data:{A1:"Metric",B1:"Value",
    A2:"Price Aug 2020 (₹)",B2:2050,
    A3:"Price Aug 2024 (₹)",B3:4180,
    A4:"Years",B4:4,
    A5:"Price CAGR %"},
  target:"B5",requires:["POWER(","ROUND("],solution:"=ROUND((POWER(B3/B2,1/B4)-1)*100,1)",
  hint:"Same CAGR formula: (4180/2050)^(1/4) − 1, then ×100. Roughly 19.5%."};

// ===== HARD: AUM growth with target =====

EX.power_target_aum = {lvl:"hard", title:"Reverse CAGR — years to double AUM at 12% growth",fn:"POWER, IF",
  concept: POWER_CONCEPT,
  desc:'A mutual fund has ₹5,000 Cr AUM and targets ₹10,000 Cr. If it grows at 12% CAGR, how many years to reach the target? The formula rearranges CAGR: n = LOG(End/Start) / LOG(1+rate). But we don\'t have LOG in the engine — so instead, test how many integer years it takes by computing AUM × POWER(1.12, B4) for different year values. B4 has a test year — write the projected AUM. The fund manager will try different years to find when it crosses ₹10,000 Cr.',
  data:{A1:"Metric",B1:"Value",
    A2:"Current AUM (₹ Cr)",B2:5000,
    A3:"Growth rate",B3:0.12,
    A4:"Test years",B4:6,
    A5:"Projected AUM (₹ Cr)"},
  target:"B5",requires:["POWER(","ROUND("],solution:"=ROUND(B2*POWER(1+B3,B4),0)",
  hint:"=ROUND(B2*POWER(1+B3, B4), 0). At 12% for 6 years: 5000 × (1.12)^6 = ₹9,869 Cr — almost there, needs 7 years."};
