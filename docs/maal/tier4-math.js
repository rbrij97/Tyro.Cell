/* ================================================================
   MOD, INT, SQRT, PRODUCT — Numeric utilities
   Each wrapped in a real finance scenario.
   ================================================================ */

const MOD_CONCEPT = "<p><b class='term'>MOD</b> returns the remainder after division.</p><span class='formula'>=MOD(number, divisor)</span><p>Finance use: identify quarter-end months (MOD(month,3)=0), check if a year is a leap year, alternate row highlighting, EMI installment number tracking.</p>";

const INT_CONCEPT = "<p><b class='term'>INT</b> rounds DOWN to the nearest integer (toward negative infinity).</p><span class='formula'>=INT(number)</span><p>Finance use: compute whole lot sizes (can't buy 2.7 lots), extract completed years from months, truncate to whole shares for order placement, floor calculations.</p>";

const SQRT_CONCEPT = "<p><b class='term'>SQRT</b> returns the square root of a number.</p><span class='formula'>=SQRT(number)</span><p>Finance use: annualizing daily volatility (daily σ × √252), computing standard deviation components, distance metrics in quantitative screens.</p>";

const PRODUCT_CONCEPT = "<p><b class='term'>PRODUCT</b> multiplies all numbers in its arguments. Ignores text and blanks.</p><span class='formula'>=PRODUCT(number1, [number2], ...)</span><p>Finance use: chain compounding factors ((1+r1)×(1+r2)×...), multiply discount factors along a yield curve, compute cumulative probability, geometric linking of returns.</p>";

// ===== MOD (2 exercises) =====

EX.mod_quarter_end = {lvl:"easy", title:"Flag quarter-end months for quarterly reporting",fn:"MOD, IF",
  concept: MOD_CONCEPT,
  desc:'The FP&A team needs to flag which months are quarter-ends (March, June, September, December — months 3, 6, 9, 12). A month is a quarter-end if MOD(month, 3) = 0. Write an IF formula: if the month in B2 divides evenly by 3, show "Q-End", else "Mid-Q".',
  data:{A1:"Month Name",B1:"Month #",C1:"Type",
    A2:"January",B2:1,
    A3:"February",B3:2,
    A4:"March",B4:3,
    A5:"April",B5:4,
    A6:"May",B6:5,
    A7:"June",B7:6},
  target:"C2",requires:["MOD(","IF("],solution:'=IF(MOD(B2,3)=0,"Q-End","Mid-Q")',
  hint:'MOD(1,3)=1 (not 0) → "Mid-Q". MOD(3,3)=0 → "Q-End".'};

EX.mod_installment = {lvl:"medium", title:"Identify annual review months in an EMI schedule",fn:"MOD, IF",
  concept: MOD_CONCEPT,
  desc:'A loan EMI schedule has 60 installments (5 years). The bank reviews the loan every 12 months (installments 12, 24, 36, 48, 60). Flag review months using MOD: if MOD(installment_number, 12) = 0, show "REVIEW", else blank ("").',
  data:{A1:"Installment",B1:"EMI (₹)",C1:"Outstanding (₹ L)",D1:"Review",
    A2:11,B2:47833,C2:42.5,
    A3:12,B3:47833,C3:41.8,
    A4:13,B4:47833,C4:41.1,
    A5:24,B5:47833,C5:33.2,
    A6:25,B6:47833,C6:32.6},
  target:"D2",requires:["MOD(","IF("],solution:'=IF(MOD(A2,12)=0,"REVIEW","")',
  hint:'MOD(11,12)=11 → "". MOD(12,12)=0 → "REVIEW".'};

// ===== INT (2 exercises) =====

EX.int_lot_size = {lvl:"easy", title:"Compute whole lots you can buy with available capital",fn:"INT",
  concept: INT_CONCEPT,
  desc:"Nifty futures lot size is 25 units. If the Nifty is at 24,500 and your capital is ₹15,00,000, how many complete lots can you buy? Divide capital by (lot size × price) and take INT — you can't buy a fraction of a lot.",
  data:{A1:"Metric",B1:"Value",
    A2:"Capital (₹)",B2:1500000,
    A3:"Nifty Level",B3:24500,
    A4:"Lot Size",B4:25,
    A5:"Lots affordable"},
  target:"B5",requires:["INT("],solution:"=INT(B2/(B3*B4))",
  hint:"=INT(B2/(B3*B4)). 15,00,000 / (24,500 × 25) = 2.45 → INT gives 2 lots."};

EX.int_tenure_years = {lvl:"medium", title:"Extract completed years from months of employment",fn:"INT",
  concept: INT_CONCEPT,
  desc:"HR calculates gratuity eligibility based on completed years of service. An employee with 53 months of service has completed 4 full years (53÷12 = 4.42, but only whole years count). Use INT to extract completed years from months in B2.",
  data:{A1:"Employee",B1:"Months",C1:"Completed Years",D1:"Gratuity Eligible?",
    A2:"Priya S",B2:53,
    A3:"Rahul K",B3:72,
    A4:"Meera J",B4:59,
    A5:"Arjun P",B5:23},
  target:"C2",requires:["INT("],solution:"=INT(B2/12)",
  hint:"=INT(B2/12). 53/12 = 4.42, INT → 4 completed years."};

// ===== SQRT (1 exercise) =====

EX.sqrt_annualize = {lvl:"hard", title:"Annualize daily volatility using SQRT of trading days",fn:"SQRT",
  concept: SQRT_CONCEPT,
  desc:"A stock's daily return standard deviation is 1.8% (B2). To annualize: multiply by √252 (trading days in a year). This is the standard volatility annualization used by risk desks and option pricing. Compute annualized volatility = B2 × SQRT(252), rounded to 1 decimal.",
  data:{A1:"Metric",B1:"Value",
    A2:"Daily σ (%)",B2:1.8,
    A3:"Trading days/yr",B3:252,
    A4:"Annualized σ (%)"},
  target:"B4",requires:["SQRT(","ROUND("],solution:"=ROUND(B2*SQRT(B3),1)",
  hint:"=ROUND(B2*SQRT(B3), 1). 1.8 × √252 = 1.8 × 15.87 ≈ 28.6%."};

// ===== PRODUCT (2 exercises) =====

EX.product_compound = {lvl:"medium", title:"Chain 4 quarterly growth factors to get annual growth",fn:"PRODUCT",
  concept: PRODUCT_CONCEPT,
  desc:"A fund returned +3%, -1.5%, +5%, +2% across 4 quarters. The annual return is NOT the sum (that's wrong). It's the PRODUCT of (1+return) for each quarter, minus 1. Column B has the growth factors (1+return). Use PRODUCT to multiply them all, then subtract 1 and multiply by 100.",
  data:{A1:"Quarter",B1:"Growth Factor",
    A2:"Q1",B2:1.03,
    A3:"Q2",B3:0.985,
    A4:"Q3",B4:1.05,
    A5:"Q4",B5:1.02,
    A7:"Annual return %"},
  target:"B7",requires:["PRODUCT(","ROUND("],solution:"=ROUND((PRODUCT(B2:B5)-1)*100,2)",
  hint:"PRODUCT(1.03, 0.985, 1.05, 1.02) = 1.0866... Subtract 1, ×100 → 8.66%."};

EX.product_discount = {lvl:"hard", title:"Multiply discount factors along a yield curve for bond pricing",fn:"PRODUCT",
  concept: PRODUCT_CONCEPT,
  desc:"In bond pricing, the cumulative discount factor for year N is the product of all single-period discount factors from year 1 to N. Column B has annual discount factors (1/(1+spot rate)). Compute the 4-year cumulative discount factor by multiplying B2:B5. This gives the PV of ₹1 received in year 4.",
  data:{A1:"Year",B1:"Discount Factor",
    A2:1,B2:0.9346,
    A3:2,B3:0.9259,
    A4:3,B4:0.9174,
    A5:4,B5:0.9091,
    A7:"Cumulative DF (4yr)"},
  target:"B7",requires:["PRODUCT("],solution:"=ROUND(PRODUCT(B2:B5),4)",
  hint:"PRODUCT(0.9346, 0.9259, 0.9174, 0.9091) ≈ 0.7217. This is PV of ₹1 at year 4."};
