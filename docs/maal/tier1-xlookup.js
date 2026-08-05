/* ================================================================
   XLOOKUP — 6 new exercises (easy → medium → hard)
   Existing: xlookup1 (1 exercise, fruit prices — needs rewrite)
   ================================================================ */

const XLOOKUP_CONCEPT = "<p><b class='term'>XLOOKUP</b> is the modern replacement for VLOOKUP. It uses separate lookup and return ranges (no column counting), defaults to exact match, and has a built-in not-found fallback.</p><span class='formula'>=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])</span><p>Finance uses: any lookup where VLOOKUP works, plus left-side lookups, last-match searches, and clean error handling without wrapping in IFERROR.</p>";

// --- EASY 1: Basic XLOOKUP ---
EX.xlookup_cmp = {lvl:"easy", title:"XLOOKUP — Pull CMP from ticker list",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:"Pull the current market price for TCS from the ticker master. Unlike VLOOKUP, you specify the lookup column and return column separately — no counting needed.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:2450,C2:1658000,
    A3:"TCS",B3:4180,C3:1520000,
    A4:"HDFCBANK",B4:1685,C4:1280000,
    A5:"INFY",B5:1520,C5:630000,
    A6:"ICICIBANK",B6:1150,C6:810000,
    A7:"SBIN",B7:820,C7:730000,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"TCS",F3:"CMP (₹)"},
  target:"F4",requires:["XLOOKUP("],solution:"=XLOOKUP(F2,A2:A7,B2:B7)",
  hint:"Three arguments: what to find, where to look, what to return."};

// --- EASY 2: XLOOKUP with not-found fallback ---
EX.xlookup_notfound = {lvl:"easy", title:"XLOOKUP — Lookup with missing ticker fallback",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:'Pull the CMP for the ticker in F2. The ticker might not exist in the list — use the 4th argument to return "Not covered" if not found. Try it: F2 has ADANIENT which is not in the table.',
  data:{A1:"Ticker",B1:"CMP (₹)",
    A2:"RELIANCE",B2:2450,
    A3:"TCS",B3:4180,
    A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:1520,
    A6:"ICICIBANK",B6:1150,
    A7:"SBIN",B7:820,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"ADANIENT",F3:"CMP (₹)"},
  target:"F4",requires:["XLOOKUP("],solution:'=XLOOKUP(F2,A2:A7,B2:B7,"Not covered")',
  hint:'Four arguments — the 4th is the fallback text: "Not covered".'};

// --- MEDIUM 1: Return a different column (left-side return) ---
EX.xlookup_reverse = {lvl:"medium", title:"XLOOKUP — Reverse lookup: find ticker by CMP",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:"Given a CMP value in G2, find which ticker has that price. This is a reverse/left-side lookup — VLOOKUP can't do this because the lookup column must be first. XLOOKUP can look up in any column and return from any other.",
  data:{A1:"Ticker",B1:"Sector",C1:"CMP (₹)",
    A2:"RELIANCE",B2:"Energy",C2:2450,
    A3:"TCS",B3:"IT",C3:4180,
    A4:"HDFCBANK",B4:"Banks",C4:1685,
    A5:"INFY",B5:"IT",C5:1520,
    A6:"BAJFINANCE",B6:"NBFC",C6:7200,
    A7:"ITC",B7:"FMCG",C7:460,
    F1:"CMP to find",G1:"₹",G2:7200,G3:"Ticker"},
  target:"G4",requires:["XLOOKUP("],solution:"=XLOOKUP(G2,C2:C7,A2:A7)",
  hint:"Look up G2 in the CMP column (C2:C7), return from the Ticker column (A2:A7)."};

// --- MEDIUM 2: XLOOKUP returning from a different column in a wider table ---
EX.xlookup_target = {lvl:"medium", title:"XLOOKUP — Pull broker target price",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:'Your coverage table has Ticker, Rating, and Target Price. Pull the target price for ICICIBANK. If the ticker is not found, return "No coverage".',
  data:{A1:"Ticker",B1:"Rating",C1:"Target (₹)",
    A2:"RELIANCE",B2:"Buy",C2:2800,
    A3:"TCS",B3:"Hold",C3:4500,
    A4:"HDFCBANK",B4:"Buy",C4:1900,
    A5:"INFY",B5:"Buy",C5:1650,
    A6:"ICICIBANK",B6:"Buy",C6:1300,
    A7:"ITC",B7:"Hold",C7:500,
    A8:"SBIN",B8:"Hold",C8:900,
    E1:"Lookup",F1:"Ticker",F2:"ICICIBANK",F3:"Target (₹)"},
  target:"F4",requires:["XLOOKUP("],solution:'=XLOOKUP(F2,A2:A8,C2:C8,"No coverage")',
  hint:"Lookup in A column, return from C column, fallback as 4th argument."};

// --- HARD 1: XLOOKUP inside a larger formula ---
EX.xlookup_premium = {lvl:"hard", title:"XLOOKUP — CMP vs 52-week low premium %",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:"Two tables: ticker → CMP (A:B) and ticker → 52-week low (D:E). For the ticker in H2, compute how far CMP is above its 52-week low as a %. Formula: ROUND((CMP/Low - 1) * 100, 1). Use two XLOOKUPs — one for CMP, one for Low.",
  data:{A1:"Ticker",B1:"CMP (₹)",
    A2:"RELIANCE",B2:2450,
    A3:"TCS",B3:4180,
    A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:1520,
    A6:"SBIN",B6:820,
    D1:"Ticker",E1:"52W Low (₹)",
    D2:"RELIANCE",E2:2150,
    D3:"TCS",E3:3620,
    D4:"HDFCBANK",E4:1420,
    D5:"INFY",E5:1310,
    D6:"SBIN",E6:680,
    G1:"Ticker",H2:"INFY",H3:"Premium to 52W Low %"},
  target:"H4",requires:["XLOOKUP(","XLOOKUP(","ROUND("],
  solution:"=ROUND((XLOOKUP(H2,A2:A6,B2:B6)/XLOOKUP(H2,D2:D6,E2:E6)-1)*100,1)",
  hint:"(CMP/Low - 1) × 100. Two XLOOKUPs: one from A:B, one from D:E. INFY: (1520/1310 - 1) × 100."};

// --- HARD 2: XLOOKUP in a multi-step formula ---
EX.xlookup_upside = {lvl:"hard", title:"XLOOKUP — Calculate upside to target price",fn:"XLOOKUP",
  concept: XLOOKUP_CONCEPT,
  desc:"For the ticker in G2, compute the upside percentage: (Target Price / CMP - 1) × 100, rounded to 1 decimal. Use two XLOOKUPs in one formula — one to pull CMP (column B), one to pull Target (column C). The answer should be a single number representing % upside.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Target (₹)",
    A2:"RELIANCE",B2:2450,C2:2800,
    A3:"TCS",B3:4180,C3:4500,
    A4:"HDFCBANK",B4:1685,C4:1900,
    A5:"INFY",B5:1520,C5:1650,
    A6:"ICICIBANK",B6:1150,C6:1300,
    A7:"SBIN",B7:820,C7:900,
    F1:"Ticker",G2:"HDFCBANK",G3:"Upside %"},
  target:"G4",requires:["XLOOKUP(","XLOOKUP(","ROUND("],
  solution:"=ROUND((XLOOKUP(G2,A2:A7,C2:C7)/XLOOKUP(G2,A2:A7,B2:B7)-1)*100,1)",
  hint:"(Target/CMP - 1) × 100. Each XLOOKUP pulls one value. Wrap in ROUND(...,1)."};
