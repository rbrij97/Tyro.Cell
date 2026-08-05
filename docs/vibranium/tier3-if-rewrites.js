/* ================================================================
   IF, Nested IF, COUNTIF, SUMIF, ROUND, CONCAT, COUNT/COUNTA
   Rewrites of existing non-finance exercises + new depth.
   These REPLACE the current generic exercises in the app.
   ================================================================ */

const IF_CONCEPT = "<p><b class='term'>IF</b> tests a condition and returns one of two values.</p><span class='formula'>=IF(test, value_if_true, value_if_false)</span><p>Text results must be in double quotes. Comparison operators: <code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code>.</p><p>Finance use: classify transactions (profit/loss), assign ratings (buy/sell), flag exceptions (over budget / within budget), apply conditional pricing.</p>";

const NESTEDIF_CONCEPT = "<p>An <b class='term'>IF</b> can contain another IF in its false branch, creating tiers. Test from strictest to loosest.</p><span class='formula'>=IF(t1,\"A\",IF(t2,\"B\",\"C\"))</span><p>Finance use: credit rating tiers, tax bracket assignment, commission slabs, risk categorization (Low/Medium/High).</p>";

const COUNTIF_CONCEPT = "<p><b class='term'>COUNTIF</b> counts cells in a range that satisfy a criterion.</p><span class='formula'>=COUNTIF(range, criteria)</span><p>Criteria with operators are quoted strings: <code>\">=50\"</code>, <code>\"&lt;&gt;Buy\"</code>. A bare value matches equality.</p><p>Finance use: count Buy ratings, count quarters with positive growth, tally stocks above a P/E threshold.</p>";

const SUMIF_CONCEPT = "<p><b class='term'>SUMIF</b> sums values where a parallel range meets a criterion.</p><span class='formula'>=SUMIF(criteria_range, criteria, sum_range)</span><p>The first range is tested; the third is summed. They must be the same size.</p><p>Finance use: sum revenue by region, total expenses by category, aggregate AUM by fund type.</p>";

const ROUND_CONCEPT = "<p><b class='term'>ROUND</b> rounds a number to a set number of decimal places.</p><span class='formula'>=ROUND(number, digits)</span><p>Finance use: round EPS to 2 decimals, margin % to 1 decimal, per-unit cost to nearest rupee, interest calculations to 2 places.</p>";

const CONCAT_CONCEPT = "<p>The <b class='term'>&amp;</b> operator joins text values. Literal text — including a single space — goes in double quotes.</p><span class='formula'>=A2&\" \"&B2</span><p>Finance use: build composite keys for lookups (Ticker&Year), create labels for charts, assemble report headers.</p>";

const COUNT_CONCEPT = "<p><b class='term'>COUNT</b> counts only numeric cells. <b class='term'>COUNTA</b> counts every non-empty cell, including text.</p><span class='formula'>=COUNT(range)  → numbers only<br>=COUNTA(range) → anything non-empty</span><p>Finance use: count how many quarters have reported (not 'pending'), how many prices are available vs 'N/A', data completeness checks.</p>";

// ===== IF — rewrites (replace existing: if, nestedif) =====

EX.if_profit_loss = {lvl:"easy", title:"IF — Classify quarter as Profit or Loss",fn:"IF",
  concept: IF_CONCEPT,
  desc:'Reliance quarterly net income is in B2. If net income ≥ 0, show "Profit", otherwise "Loss". Simple threshold classification — the most basic IF pattern in finance.',
  data:{A1:"Quarter",B1:"Net Income (₹ Cr)",C1:"Status",
    A2:"Q1 FY24",B2:19878,
    A3:"Q2 FY24",B3:17394,
    A4:"Q3 FY24",B4:-2100,
    A5:"Q4 FY24",B5:21243},
  target:"C2",requires:["IF("],solution:'=IF(B2>=0,"Profit","Loss")',
  hint:'=IF(B2>=0, "Profit", "Loss"). Net income of 19878 ≥ 0 → Profit.'};

EX.if_budget_flag = {lvl:"medium", title:"IF — Flag over-budget departments",fn:"IF",
  concept: IF_CONCEPT,
  desc:'CFO wants every department flagged if actual spend exceeds budget. Compare Actual (C2) vs Budget (B2). Show "Over" if actual > budget, "Within" otherwise. This drives the exception report.',
  data:{A1:"Department",B1:"Budget (₹ L)",C1:"Actual (₹ L)",D1:"Status",
    A2:"Sales",B2:450,C2:520,
    A3:"Marketing",B3:200,C3:185,
    A4:"Engineering",B4:800,C4:810,
    A5:"HR",B5:150,C5:130},
  target:"D2",requires:["IF("],solution:'=IF(C2>B2,"Over","Within")',
  hint:'=IF(C2>B2, "Over", "Within"). Sales: 520 > 450 → Over.'};

EX.nestedif_rating = {lvl:"hard", title:"Nested IF — Assign credit rating tier by interest coverage",fn:"IF (nested)",
  concept: NESTEDIF_CONCEPT,
  desc:'Credit analyst rule: Interest Coverage Ratio ≥ 5 → "AAA", ≥ 3 → "AA", ≥ 1.5 → "A", below 1.5 → "BBB". Write a nested IF testing from strictest down. ICR is in B2.',
  data:{A1:"Company",B1:"ICR",C1:"Rating",
    A2:"TCS",B2:45.2,
    A3:"Reliance",B3:4.8,
    A4:"Tata Motors",B4:2.1,
    A5:"Vodafone Idea",B5:0.3},
  target:"C2",requires:["IF(","IF(","IF("],
  solution:'=IF(B2>=5,"AAA",IF(B2>=3,"AA",IF(B2>=1.5,"A","BBB")))',
  hint:'Test strictest first: IF(B2>=5,"AAA",IF(B2>=3,"AA",IF(B2>=1.5,"A","BBB"))). TCS: 45.2≥5 → AAA.'};

EX.nestedif_commission = {lvl:"hard", title:"Nested IF — Sales commission slab",fn:"IF (nested)",
  concept: NESTEDIF_CONCEPT,
  desc:'Broker commission tiers: deal size ≥ ₹10 Cr → 0.5%, ≥ ₹5 Cr → 0.75%, ≥ ₹1 Cr → 1%, below ₹1 Cr → 1.5%. Compute the commission rate for the deal in B2. Return the percentage as a number (0.5, 0.75, etc.).',
  data:{A1:"Client",B1:"Deal (₹ Cr)",C1:"Commission %",
    A2:"Tata Steel",B2:12.5,
    A3:"Axis Bank",B3:7.2,
    A4:"Sun Pharma",B4:3.1,
    A5:"StartupCo",B5:0.4},
  target:"C2",requires:["IF(","IF(","IF("],
  solution:'=IF(B2>=10,0.5,IF(B2>=5,0.75,IF(B2>=1,1,1.5)))',
  hint:'Strictest first: ≥10→0.5, ≥5→0.75, ≥1→1, else 1.5. Deal of 12.5 ≥ 10 → 0.5.'};

// ===== COUNTIF — rewrite (replace existing: countif) =====

EX.countif_buy = {lvl:"easy", title:"COUNTIF — Count Buy ratings in coverage universe",fn:"COUNTIF",
  concept: COUNTIF_CONCEPT,
  desc:'Your research team covers 8 stocks with ratings (Buy/Hold/Sell). Count how many have a "Buy" rating — this goes into the weekly coverage summary.',
  data:{A1:"Ticker",B1:"Rating",
    A2:"RELIANCE",B2:"Buy",A3:"TCS",B3:"Hold",A4:"HDFCBANK",B4:"Buy",
    A5:"INFY",B5:"Buy",A6:"ITC",B6:"Hold",A7:"SBIN",B7:"Hold",
    A8:"MARUTI",B8:"Sell",A9:"BAJFINANCE",B9:"Buy",
    A11:"Buy count"},
  target:"B11",requires:["COUNTIF("],solution:'=COUNTIF(B2:B9,"Buy")',
  hint:'=COUNTIF(B2:B9, "Buy") — counts exact matches.'};

EX.countif_above_pe = {lvl:"medium", title:"COUNTIF — Count overvalued stocks (P/E > 30)",fn:"COUNTIF",
  concept: COUNTIF_CONCEPT,
  desc:'Portfolio risk check: how many holdings have trailing P/E above 30? High-P/E concentration is a risk factor the CIO reviews weekly.',
  data:{A1:"Ticker",B1:"P/E",
    A2:"RELIANCE",B2:25.3,A3:"TCS",B3:28.7,A4:"BAJFINANCE",B4:32.5,
    A5:"NVIDIA",B5:68.7,A6:"HDFCBANK",B6:18.4,A7:"INFY",B7:24.6,
    A8:"HINDUNILVR",B8:58.2,A9:"ITC",B9:26.1,
    A11:"P/E > 30 count"},
  target:"B11",requires:["COUNTIF("],solution:'=COUNTIF(B2:B9,">30")',
  hint:'Operator criterion is a quoted string: =COUNTIF(B2:B9, ">30").'};

// ===== SUMIF — rewrite (replace existing: sumif) =====

EX.sumif_sector_revenue = {lvl:"easy", title:"SUMIF — Total revenue by sector",fn:"SUMIF",
  concept: SUMIF_CONCEPT,
  desc:'A multi-sector portfolio has revenue forecasts. Sum the total revenue for the "IT" sector only. Sector labels are in column B, revenue in column C.',
  data:{A1:"Ticker",B1:"Sector",C1:"Revenue (₹ Cr)",
    A2:"TCS",B2:"IT",C2:240000,
    A3:"RELIANCE",B3:"Energy",C3:875000,
    A4:"INFY",B4:"IT",C4:180000,
    A5:"HDFCBANK",B5:"Banks",C5:210000,
    A6:"WIPRO",B6:"IT",C6:90000,
    A7:"ITC",B7:"FMCG",C7:70000,
    A9:"IT sector revenue"},
  target:"C9",requires:["SUMIF("],solution:'=SUMIF(B2:B7,"IT",C2:C7)',
  hint:'=SUMIF(B2:B7, "IT", C2:C7) — test sector column, sum revenue column.'};

EX.sumif_positive_cashflow = {lvl:"medium", title:"SUMIF — Sum only positive cash flows (inflows)",fn:"SUMIF",
  concept: SUMIF_CONCEPT,
  desc:'A simplified cash flow statement has mixed positive (inflows) and negative (outflows) values. Sum only the positive flows — the total inflows. Use criteria ">0".',
  data:{A1:"Item",B1:"Flow (₹ Cr)",
    A2:"Operating cash flow",B2:45000,
    A3:"Capital expenditure",B3:-18000,
    A4:"Sale of investments",B4:8000,
    A5:"Debt repayment",B5:-25000,
    A6:"Interest income",B6:3000,
    A7:"Dividends paid",B7:-5000,
    A9:"Total inflows"},
  target:"B9",requires:["SUMIF("],solution:'=SUMIF(B2:B7,">0")',
  hint:'=SUMIF(B2:B7, ">0") — when criteria range and sum range are the same, you can omit the third argument. Here the range IS the values.'};

// ===== ROUND — rewrite (replace existing: round) =====

EX.round_eps = {lvl:"easy", title:"ROUND — Compute and round EPS to 2 decimals",fn:"ROUND",
  concept: ROUND_CONCEPT,
  desc:"Compute EPS = Net Income / Shares Outstanding, rounded to 2 decimal places. Raw division gives many decimals — analysts always round EPS to 2.",
  data:{A1:"Metric",B1:"Value",
    A2:"Net Income (₹ Cr)",B2:19878,
    A3:"Shares (Cr)",B3:676.2,
    A4:"EPS (₹)"},
  target:"B4",requires:["ROUND("],solution:"=ROUND(B2/B3,2)",
  hint:"=ROUND(B2/B3, 2). Divide income by shares, round to 2 places."};

EX.round_margin = {lvl:"medium", title:"ROUND — Compute gross margin % for a comps table",fn:"ROUND",
  concept: ROUND_CONCEPT,
  desc:"Build a comps row: compute gross margin (Gross Profit / Revenue × 100) for TCS, rounded to 1 decimal. This is how every comps table presents margins.",
  data:{A1:"Company",B1:"Revenue (₹ Cr)",C1:"Gross Profit (₹ Cr)",D1:"Margin %",
    A2:"TCS",B2:240000,C2:96000,
    A3:"Infosys",B3:180000,C3:54000},
  target:"D2",requires:["ROUND("],solution:"=ROUND(C2/B2*100,1)",
  hint:"=ROUND(C2/B2*100, 1). Divide, multiply by 100, round to 1 decimal."};

// ===== CONCAT / & — rewrite (replace existing: concat) =====

EX.concat_lookup_key = {lvl:"easy", title:"& — Build a composite lookup key (Ticker + Year)",fn:"& / CONCAT",
  concept: CONCAT_CONCEPT,
  desc:'Your model needs to look up data by ticker AND year. Build a composite key by joining Ticker (A2) and Year (B2) with no separator. "RELIANCE" & "FY24" → "RELIANCEFY24". This key is used for INDEX+MATCH lookups in larger models.',
  data:{A1:"Ticker",B1:"Year",C1:"Key",
    A2:"RELIANCE",B2:"FY24",
    A3:"TCS",B3:"FY24",
    A4:"RELIANCE",B4:"FY25"},
  target:"C2",requiresAny:["&","CONCAT"],solution:'=A2&B2',
  hint:'=A2&B2 joins "RELIANCE" and "FY24" into "RELIANCEFY24".'};

EX.concat_label = {lvl:"medium", title:"& — Build chart axis labels from quarter + year",fn:"& / CONCAT",
  concept: CONCAT_CONCEPT,
  desc:'Build display labels for a revenue chart: combine Quarter (A2) with a space and Fiscal Year (B2). "Q1" & " " & "FY24" → "Q1 FY24". These become the x-axis labels.',
  data:{A1:"Quarter",B1:"FY",C1:"Label",
    A2:"Q1",B2:"FY24",A3:"Q2",B3:"FY24",A4:"Q3",B4:"FY25",A5:"Q4",B5:"FY25"},
  target:"C2",requiresAny:["&","CONCAT"],solution:'=A2&" "&B2',
  hint:'=A2&" "&B2 — the literal space " " goes between them.'};

// ===== COUNT / COUNTA — rewrite (replace existing: count) =====

EX.count_reported = {lvl:"easy", title:"COUNT — How many quarters have actual results (not pending)?",fn:"COUNT, COUNTA",
  concept: COUNT_CONCEPT,
  desc:'A revenue tracker has numbers for reported quarters and "pending" text for unreported ones. COUNT tells you how many quarters have actual numbers. COUNTA would count both — but you want only the numeric ones.',
  data:{A1:"Quarter",B1:"Revenue (₹ Cr)",
    A2:"Q1 FY24",B2:231132,
    A3:"Q2 FY24",B3:231886,
    A4:"Q3 FY24",B4:227853,
    A5:"Q4 FY24",B5:"pending",
    A6:"Q1 FY25",B6:"pending",
    A8:"Reported quarters"},
  target:"B8",requires:["COUNT("],solution:"=COUNT(B2:B6)",
  hint:"COUNT(B2:B6) counts only numeric cells — 'pending' is text and gets skipped."};

EX.counta_coverage = {lvl:"medium", title:"COUNTA — How many stocks have ANY rating (including text)?",fn:"COUNTA",
  concept: COUNT_CONCEPT,
  desc:'Coverage universe: some stocks have ratings ("Buy", "Hold"), others are blank (not yet covered). Count how many have any rating — including text ratings. COUNTA counts every non-empty cell.',
  data:{A1:"Ticker",B1:"Rating",
    A2:"RELIANCE",B2:"Buy",A3:"TCS",B3:"Hold",A4:"HDFCBANK",B4:"Buy",
    A5:"INFY",B5:"",A6:"ITC",B6:"Hold",A7:"SBIN",B7:"",
    A8:"BAJFINANCE",B8:"Buy",
    A10:"Covered stocks"},
  target:"B10",requires:["COUNTA("],solution:"=COUNTA(B2:B8)",
  hint:"COUNTA(B2:B8) counts every non-empty cell — 5 stocks have ratings, 2 are blank."};
