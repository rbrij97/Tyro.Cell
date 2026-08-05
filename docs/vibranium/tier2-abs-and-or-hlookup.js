/* ================================================================
   ABS, AND, OR, HLOOKUP — high-value, zero exercises today
   Every exercise is a mini finance case study.
   ================================================================ */

const ABS_CONCEPT = "<p><b class='term'>ABS</b> returns the absolute (positive) value of a number, stripping the sign.</p><span class='formula'>=ABS(number)</span><p>Finance use: budget variance analysis (actual vs budget — you want the SIZE of the miss, not the direction), tracking deviation from targets, computing absolute returns regardless of direction.</p>";

const AND_CONCEPT = "<p><b class='term'>AND</b> returns TRUE only if ALL conditions are TRUE. <b class='term'>OR</b> returns TRUE if ANY condition is TRUE. Typically used inside IF to test multiple criteria.</p><span class='formula'>=AND(condition1, condition2, ...)<br>=OR(condition1, condition2, ...)<br>=IF(AND(B2>0, C2>15), \"Pass\", \"Fail\")</span><p>Finance use: multi-criteria screening (PE < 20 AND ROE > 15), eligibility checks (revenue > threshold AND years > 3), alert flags (margin dropped OR growth negative).</p>";

const HLOOKUP_CONCEPT = "<p><b class='term'>HLOOKUP</b> searches for a value in the first <b>row</b> of a table and returns a value from a specified row below it. Like VLOOKUP rotated 90°.</p><span class='formula'>=HLOOKUP(lookup_value, table_array, row_index, [range_lookup])</span><p>Finance use: comps tables laid out horizontally (companies across columns, metrics down rows), quarterly data in wide format, cross-tab lookups.</p>";

// ===== ABS (3 exercises) =====

EX.abs_variance = {lvl:"easy", title:"Budget variance — how far off, regardless of direction",fn:"ABS",
  concept: ABS_CONCEPT,
  desc:"FP&A monthly review: compute the absolute variance between budget and actual for each line item. A negative variance (under budget) and positive (over budget) should both show as positive numbers. Write =ABS(C2-B2) in D2.",
  data:{A1:"Line item",B1:"Budget (₹ L)",C1:"Actual (₹ L)",D1:"Abs Variance",
    A2:"Revenue",B2:850,C2:920,
    A3:"COGS",B3:510,C3:480,
    A4:"Marketing",B4:120,C4:145,
    A5:"Rent",B5:50,C5:50},
  target:"D2",requires:["ABS("],solution:"=ABS(C2-B2)",
  hint:"=ABS(C2-B2) gives the size of the miss. Revenue: |920-850| = 70."};

EX.abs_tracking_error = {lvl:"medium", title:"Portfolio tracking error vs benchmark",fn:"ABS, AVERAGE",
  concept: ABS_CONCEPT,
  desc:"Your fund returned different amounts each quarter vs the Nifty benchmark. Compute the average absolute deviation — this is a simplified tracking error measure. Column D has the return gap (Fund - Benchmark). Take ABS of each, then AVERAGE them. Write the AVERAGE of ABS values in D7.",
  data:{A1:"Quarter",B1:"Fund %",C1:"Nifty %",D1:"Gap %",
    A2:"Q1",B2:3.2,C2:2.8,D2:0.4,
    A3:"Q2",B3:-1.5,C3:-0.8,D3:-0.7,
    A4:"Q3",B4:5.1,C4:4.2,D4:0.9,
    A5:"Q4",B5:2.0,C5:3.1,D5:-1.1,
    A7:"Avg abs deviation"},
  target:"B7",requires:["ABS(","ABS(","ABS(","ABS("],
  solution:"=AVERAGE(ABS(D2),ABS(D3),ABS(D4),ABS(D5))",
  hint:"AVERAGE the absolute values of each gap: =AVERAGE(ABS(D2),ABS(D3),ABS(D4),ABS(D5)). Can't use ABS on a range — do each cell."};

EX.abs_flag = {lvl:"hard", title:"Flag any budget line with >10% absolute deviation",fn:"ABS, IF",
  concept: ABS_CONCEPT,
  desc:'FP&A rule: flag any line item where actual deviates from budget by more than 10%. Compute the % deviation as ABS((Actual-Budget)/Budget)*100 and IF it exceeds 10, show "FLAG", otherwise "OK". One formula combining IF + ABS + division.',
  data:{A1:"Line item",B1:"Budget (₹ L)",C1:"Actual (₹ L)",D1:"Status",
    A2:"Revenue",B2:850,C2:920,
    A3:"COGS",B3:510,C3:480,
    A4:"Marketing",B4:120,C4:145,
    A5:"Rent",B5:50,C5:50},
  target:"D2",requires:["IF(","ABS("],solution:'=IF(ABS((C2-B2)/B2)*100>10,"FLAG","OK")',
  hint:'ABS((C2-B2)/B2)*100 gives % deviation. Revenue: ABS(70/850)*100 = 8.2% → "OK".'};

// ===== AND (2 exercises) =====

EX.and_loan_eligible = {lvl:"easy", title:"Loan eligibility — salary AND credit score check",fn:"AND, IF",
  concept: AND_CONCEPT,
  desc:'Bank policy: approve a personal loan only if annual salary ≥ ₹5L AND credit score ≥ 700. Write an IF+AND formula that shows "Approve" or "Reject" for each applicant.',
  data:{A1:"Applicant",B1:"Salary (₹ L/yr)",C1:"Credit Score",D1:"Decision",
    A2:"Priya S",B2:8.5,C2:750,
    A3:"Rahul K",B3:4.2,C3:720,
    A4:"Meera J",B4:12.0,C4:680,
    A5:"Arjun P",B5:6.0,C5:710},
  target:"D2",requires:["IF(","AND("],solution:'=IF(AND(B2>=5,C2>=700),"Approve","Reject")',
  hint:'=IF(AND(B2>=5, C2>=700), "Approve", "Reject"). Priya: 8.5≥5 ✓ AND 750≥700 ✓ → Approve.'};

EX.and_quality_screen = {lvl:"medium", title:"Stock screener — P/E below 20 AND ROE above 15%",fn:"AND, IF",
  concept: AND_CONCEPT,
  desc:'Screen Nifty stocks: mark "BUY" if P/E < 20 AND ROE > 15, otherwise "PASS". This is a classic value+quality filter used by fundamental analysts.',
  data:{A1:"Ticker",B1:"P/E",C1:"ROE %",D1:"Signal",
    A2:"HDFCBANK",B2:18.4,C2:17.1,
    A3:"TCS",B3:28.7,C3:48.2,
    A4:"ICICIBANK",B4:17.9,C4:18.3,
    A5:"ITC",B5:26.1,C5:28.9,
    A6:"SBIN",B6:9.4,C6:20.5},
  target:"D2",requires:["IF(","AND("],solution:'=IF(AND(B2<20,C2>15),"BUY","PASS")',
  hint:'AND(B2<20, C2>15) checks both conditions. HDFCBANK: 18.4<20 ✓ AND 17.1>15 ✓ → BUY.'};

// ===== OR (2 exercises) =====

EX.or_alert = {lvl:"easy", title:"Portfolio alert — flag if ANY metric crosses threshold",fn:"OR, IF",
  concept: AND_CONCEPT,
  desc:'Risk management rule: flag a stock if P/E > 40 OR if the stock dropped > 10% in a month. Either condition alone triggers an alert. Write IF+OR to show "ALERT" or "OK".',
  data:{A1:"Ticker",B1:"P/E",C1:"1M Return %",D1:"Status",
    A2:"TCS",B2:28.7,C2:-3.2,
    A3:"PAYTM",B3:0,C3:-15.4,
    A4:"NVIDIA",B4:68.7,C4:12.1,
    A5:"HDFCBANK",B5:18.4,C5:-2.1},
  target:"D2",requires:["IF(","OR("],solution:'=IF(OR(B2>40,C2<-10),"ALERT","OK")',
  hint:'OR(B2>40, C2<-10) — either condition triggers. TCS: 28.7<40 and -3.2>-10 → both false → "OK".'};

EX.or_coverage = {lvl:"medium", title:"Flag stocks needing analyst coverage update",fn:"OR, IF",
  concept: AND_CONCEPT,
  desc:'Research head rule: a stock needs a fresh note if rating is "Sell" OR if the target price is more than 20% below CMP (stale bullish target). Flag as "UPDATE" or "Current".',
  data:{A1:"Ticker",B1:"Rating",C1:"CMP (₹)",D1:"Target (₹)",E1:"Status",
    A2:"RELIANCE",B2:"Buy",C2:2450,D2:2800,
    A3:"MARUTI",B3:"Sell",C3:12400,D3:13500,
    A4:"TCS",B4:"Hold",C4:4180,D4:3200,
    A5:"INFY",B5:"Buy",C5:1520,D5:1650},
  target:"E2",requires:["IF(","OR("],solution:'=IF(OR(B2="Sell",D2<C2*0.8),"UPDATE","Current")',
  hint:'OR(B2="Sell", D2<C2*0.8) — second condition checks if target is <80% of CMP (stale). RELIANCE: Buy, 2800>1960 → Current.'};

// ===== HLOOKUP (3 exercises) =====

EX.hlookup_quarter = {lvl:"easy", title:"HLOOKUP — Pull quarterly revenue from a horizontal layout",fn:"HLOOKUP",
  concept: HLOOKUP_CONCEPT,
  desc:"Quarterly revenue is laid out horizontally: quarters across columns (B1:E1), companies down rows. Pull the Q3 revenue for the company in row 1 of the result area. HLOOKUP searches the first ROW and returns from a specified row below.",
  data:{A1:"Company",B1:"Q1",C1:"Q2",D1:"Q3",E1:"Q4",
    A2:"TCS",B2:59692,C2:62613,D2:64259,E2:63973,
    A3:"Infosys",B3:38994,C3:39820,D3:40986,E3:41764,
    A4:"Wipro",B4:22831,C4:21963,D4:22316,E4:22576,
    A6:"Quarter to pull",B6:"Q3",A7:"TCS revenue"},
  target:"B7",requires:["HLOOKUP("],solution:'=HLOOKUP(B6,B1:E2,2,FALSE)',
  hint:'HLOOKUP(B6, B1:E2, 2, FALSE) — find "Q3" in row 1, return row 2 (TCS data).'};

EX.hlookup_metric = {lvl:"medium", title:"HLOOKUP — Pull a metric from a horizontal comps table",fn:"HLOOKUP",
  concept: HLOOKUP_CONCEPT,
  desc:"This comps table has companies across the top and metrics down the side. Pull Infosys's EV/EBITDA. Companies are in row 1, metrics in column A. Find 'Infosys' in the header row, return from the EV/EBITDA row (row 3).",
  data:{A1:"Metric",B1:"TCS",C1:"Infosys",D1:"Wipro",E1:"HCL Tech",
    A2:"P/E",B2:28.7,C2:24.6,D2:22.3,E2:26.8,
    A3:"EV/EBITDA",B3:22.4,C3:18.2,D3:14.5,E3:19.1,
    A4:"P/B",B4:14.2,C4:8.5,D4:3.8,E4:6.2,
    A6:"Company",B6:"Infosys",A7:"EV/EBITDA"},
  target:"B7",requires:["HLOOKUP("],solution:'=HLOOKUP(B6,B1:E4,3,FALSE)',
  hint:'Find "Infosys" in row 1 (B1:E1), return row 3 (EV/EBITDA). Table is B1:E4, row index = 3.'};

EX.hlookup_dynamic = {lvl:"hard", title:"HLOOKUP + MATCH — Dynamic metric pull from comps",fn:"HLOOKUP, MATCH",
  concept: HLOOKUP_CONCEPT,
  desc:'Same comps table but now BOTH the company and the metric are dynamic (in B6 and B7). Use HLOOKUP for the company, but the row index needs to be dynamic too. Use MATCH to find which row the metric is in: MATCH(B7, A1:A4, 0). Combine them.',
  data:{A1:"Metric",B1:"TCS",C1:"Infosys",D1:"Wipro",E1:"HCL Tech",
    A2:"P/E",B2:28.7,C2:24.6,D2:22.3,E2:26.8,
    A3:"EV/EBITDA",B3:22.4,C3:18.2,D3:14.5,E3:19.1,
    A4:"P/B",B4:14.2,C4:8.5,D4:3.8,E4:6.2,
    A6:"Company",B6:"Wipro",A7:"Metric",B7:"P/B",A8:"Value"},
  target:"B8",requires:["HLOOKUP(","MATCH("],solution:'=HLOOKUP(B6,B1:E4,MATCH(B7,A1:A4,0),FALSE)',
  hint:'MATCH(B7,A1:A4,0) finds which row "P/B" is in (row 4). Pass that as the row_index to HLOOKUP.'};
