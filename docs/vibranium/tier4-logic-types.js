/* ================================================================
   NOT, ISNUMBER, ISTEXT, ISBLANK, COUNTBLANK — Logic & type checks
   Data quality, validation, and screening helpers.
   ================================================================ */

const NOT_CONCEPT = "<p><b class='term'>NOT</b> reverses a logical value: TRUE becomes FALSE, FALSE becomes TRUE.</p><span class='formula'>=NOT(logical)</span><p>Finance use: invert screening conditions ('show me everything that does NOT pass the filter'), flip eligibility flags, exclude specific categories. Often combined with IF, AND, OR.</p>";

const ISNUMBER_CONCEPT = "<p><b class='term'>ISNUMBER</b> returns TRUE if the cell contains a number. <b class='term'>ISTEXT</b> returns TRUE if it contains text. <b class='term'>ISBLANK</b> returns TRUE if the cell is empty.</p><span class='formula'>=ISNUMBER(value)  =ISTEXT(value)  =ISBLANK(value)</span><p>Finance use: validate data imports (is the price field actually numeric?), check for missing mandatory data, build data quality dashboards, audit spreadsheets before model submission.</p>";

const COUNTBLANK_CONCEPT = "<p><b class='term'>COUNTBLANK</b> counts empty cells in a range.</p><span class='formula'>=COUNTBLANK(range)</span><p>Finance use: data completeness audits ('how many prices are missing?'), coverage gap analysis, identify holes in a dataset before running models, compliance checks for mandatory fields.</p>";

// ===== NOT (2 exercises) =====

EX.not_exclude = {lvl:"easy", title:"Screen stocks that are NOT in the banking sector",fn:"NOT, IF",
  concept: NOT_CONCEPT,
  desc:'Your portfolio is overweight banks. The CIO says: flag every stock that is NOT a bank so we can consider adding to those positions. Write an IF+NOT formula: if the sector is NOT "Banks", show "Consider", else "Skip".',
  data:{A1:"Ticker",B1:"Sector",C1:"Action",
    A2:"TCS",B2:"IT",
    A3:"HDFCBANK",B3:"Banks",
    A4:"RELIANCE",B4:"Energy",
    A5:"ICICIBANK",B5:"Banks",
    A6:"ITC",B6:"FMCG",
    A7:"INFY",B7:"IT"},
  target:"C2",requires:["NOT(","IF("],solution:'=IF(NOT(B2="Banks"),"Consider","Skip")',
  hint:'NOT(B2="Banks") flips the test. IT ≠ Banks → NOT(FALSE)... wait: "IT"="Banks" is FALSE, NOT(FALSE)=TRUE → "Consider".'};

EX.not_invert_screen = {lvl:"medium", title:"Invert a multi-criteria screen — find stocks that FAIL the quality filter",fn:"NOT, AND, IF",
  concept: NOT_CONCEPT,
  desc:'Your quality screen passes stocks with P/E < 25 AND ROE > 15. The risk team wants the OPPOSITE — flag stocks that FAIL this screen (potential sell candidates). Use NOT(AND(...)) to invert the entire condition. Show "FAIL" or "PASS".',
  data:{A1:"Ticker",B1:"P/E",C1:"ROE %",D1:"Quality Screen",
    A2:"TCS",B2:28.7,C2:48.2,
    A3:"HDFCBANK",B3:18.4,C3:17.1,
    A4:"ITC",B4:26.1,C4:28.9,
    A5:"SBIN",B5:9.4,C5:20.5,
    A6:"BAJFINANCE",B6:32.5,C6:22.3},
  target:"D2",requires:["NOT(","AND(","IF("],
  solution:'=IF(NOT(AND(B2<25,C2>15)),"FAIL","PASS")',
  hint:'AND(28.7<25, 48.2>15) = AND(FALSE,TRUE) = FALSE. NOT(FALSE) = TRUE → "FAIL". TCS has high P/E so it fails the value screen.'};

// ===== ISNUMBER (1 exercise) =====

EX.isnumber_validate = {lvl:"easy", title:"Validate imported price data — is it actually a number?",fn:"ISNUMBER, IF",
  concept: ISNUMBER_CONCEPT,
  desc:'Your data import from the trading platform sometimes brings prices as text ("4180" instead of 4180). SUM and VLOOKUP break silently on text-numbers. Use ISNUMBER to check each price cell — flag "OK" if it\'s a real number, "FIX" if it\'s text masquerading as a number.',
  data:{A1:"Ticker",B1:"CMP",C1:"Data Type",
    A2:"RELIANCE",B2:2450,
    A3:"TCS",B3:"4180",
    A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:"1520"},
  target:"C2",requires:["ISNUMBER(","IF("],solution:'=IF(ISNUMBER(B2),"OK","FIX")',
  hint:'ISNUMBER(2450) = TRUE → "OK". ISNUMBER("4180") = FALSE → "FIX".'};

// ===== ISBLANK (2 exercises) =====

EX.isblank_mandatory = {lvl:"easy", title:"Flag missing mandatory fields in a KYC form",fn:"ISBLANK, IF",
  concept: ISNUMBER_CONCEPT,
  desc:'Compliance rule: PAN number is mandatory for all demat accounts. Check if the PAN field (C2) is blank. Show "MISSING" if blank, "OK" if filled. This drives the compliance exception report.',
  data:{A1:"Client",B1:"Account #",C1:"PAN",D1:"Status",
    A2:"Priya S",B2:"DP001",C2:"ABCPS1234R",
    A3:"Rahul K",B3:"DP002",C3:"",
    A4:"Meera J",B4:"DP003",C4:"MNJPS5678T",
    A5:"Arjun P",B5:"DP004",C5:""},
  target:"D2",requires:["ISBLANK(","IF("],solution:'=IF(ISBLANK(C2),"MISSING","OK")',
  hint:'ISBLANK(C2) checks if PAN is empty. "ABCPS1234R" is not blank → "OK".'};

EX.isblank_default = {lvl:"medium", title:"Use default sector when classification is missing",fn:"ISBLANK, IF",
  concept: ISNUMBER_CONCEPT,
  desc:'Some stocks in your universe are missing sector classification (blank). For reporting, the risk team wants blanks defaulted to "Unclassified" so pivot tables don\'t break. If B2 is blank, show "Unclassified", else show the actual sector.',
  data:{A1:"Ticker",B1:"Sector",C1:"Report Sector",
    A2:"TCS",B2:"IT",
    A3:"NEWSTOCK1",B3:"",
    A4:"RELIANCE",B4:"Energy",
    A5:"STARTUP2",B5:"",
    A6:"HDFCBANK",B6:"Banks"},
  target:"C2",requires:["ISBLANK(","IF("],solution:'=IF(ISBLANK(B2),"Unclassified",B2)',
  hint:'IF(ISBLANK(B2), "Unclassified", B2). TCS has "IT" → not blank → returns "IT".'};

// ===== COUNTBLANK (2 exercises) =====

EX.countblank_coverage = {lvl:"easy", title:"Data quality audit — count missing analyst ratings",fn:"COUNTBLANK",
  concept: COUNTBLANK_CONCEPT,
  desc:"Your research universe has 8 stocks but not all have analyst ratings yet. COUNTBLANK tells you how many are missing — this number goes into the weekly coverage gap report for the head of research.",
  data:{A1:"Ticker",B1:"Rating",
    A2:"RELIANCE",B2:"Buy",A3:"TCS",B3:"Hold",A4:"HDFCBANK",B4:"Buy",
    A5:"INFY",B5:"",A6:"ITC",B6:"Hold",A7:"SBIN",B7:"",
    A8:"BAJFINANCE",B8:"Buy",A9:"MARUTI",B9:"",
    A11:"Missing ratings"},
  target:"B11",requires:["COUNTBLANK("],solution:"=COUNTBLANK(B2:B9)",
  hint:"COUNTBLANK(B2:B9) counts empty cells. 3 stocks have no rating."};

EX.countblank_completeness = {lvl:"medium", title:"Data completeness % — how much of the model is filled",fn:"COUNTBLANK, COUNT, ROUND",
  concept: COUNTBLANK_CONCEPT,
  desc:"A financial model has 10 input cells. Before sending to the MD, check what % is complete. Completeness = (total cells - blank cells) / total cells × 100. Use COUNTA to count filled cells out of B2:B11, or equivalently (10 - COUNTBLANK) / 10 × 100. Write the completeness % rounded to 0 decimals.",
  data:{A1:"Input",B1:"Value",
    A2:"Revenue",B2:875000,
    A3:"COGS",B3:612500,
    A4:"SGA",B4:"",
    A5:"D&A",B5:45000,
    A6:"Interest",B6:28000,
    A7:"Tax Rate",B7:"",
    A8:"CapEx",B8:55000,
    A9:"WC Change",B9:12000,
    A10:"Growth Rate",B10:0.12,
    A11:"Terminal",B11:"",
    A13:"Completeness %"},
  target:"B13",requires:["COUNTBLANK(","ROUND("],
  solution:"=ROUND((10-COUNTBLANK(B2:B11))/10*100,0)",
  hint:"COUNTBLANK = 3 (SGA, Tax Rate, Terminal). (10-3)/10 × 100 = 70%."};
