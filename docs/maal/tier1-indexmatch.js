/* ================================================================
   INDEX + MATCH — 6 new exercises (easy → medium → hard)
   Existing: indexmatch (1 exercise, fruit prices — needs rewrite)
   ================================================================ */

const INDEXMATCH_CONCEPT = "<p><b class='term'>MATCH</b> returns the position of a value in a range. <b class='term'>INDEX</b> returns the value at a given position in a range. Combined, they form the most flexible lookup in Excel — no left-column restriction, works in any direction.</p><span class='formula'>=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))</span><p><code>0</code> in MATCH = exact match. Finance uses: two-way lookups in comps tables, pulling data from any column, cross-referencing multiple datasets.</p>";

// --- EASY 1: Basic INDEX+MATCH ---
EX.idxm_cmp = {lvl:"easy", title:"INDEX+MATCH — Pull CMP from ticker list",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:"Pull the CMP for SBIN. MATCH finds SBIN's row position in A2:A7, INDEX returns the corresponding value from B2:B7. Think of it as: INDEX(what to return, MATCH(what to find, where to find it, 0)).",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:2450,C2:1658000,
    A3:"TCS",B3:4180,C3:1520000,
    A4:"HDFCBANK",B4:1685,C4:1280000,
    A5:"INFY",B5:1520,C5:630000,
    A6:"ICICIBANK",B6:1150,C6:810000,
    A7:"SBIN",B7:820,C7:730000,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"SBIN",F3:"CMP (₹)"},
  target:"F4",requires:["INDEX(","MATCH("],solution:"=INDEX(B2:B7,MATCH(F2,A2:A7,0))",
  hint:"INDEX(B2:B7, MATCH(F2, A2:A7, 0)) — MATCH finds the row, INDEX returns the value."};

// --- EASY 2: Return from a different column ---
EX.idxm_mcap = {lvl:"easy", title:"INDEX+MATCH — Pull market cap",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:"Same ticker list. Pull the Market Cap (column C) for ICICIBANK. The only change from the CMP lookup: INDEX now points at C2:C7 instead of B2:B7.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:2450,C2:1658000,
    A3:"TCS",B3:4180,C3:1520000,
    A4:"HDFCBANK",B4:1685,C4:1280000,
    A5:"INFY",B5:1520,C5:630000,
    A6:"ICICIBANK",B6:1150,C6:810000,
    A7:"SBIN",B7:820,C7:730000,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"ICICIBANK",F3:"Mkt Cap (₹ Cr)"},
  target:"F4",requires:["INDEX(","MATCH("],solution:"=INDEX(C2:C7,MATCH(F2,A2:A7,0))",
  hint:"Change INDEX range to C2:C7. MATCH stays the same — it only finds the row position."};

// --- MEDIUM 1: Left-side lookup (advantage over VLOOKUP) ---
EX.idxm_left = {lvl:"medium", title:"INDEX+MATCH — Left-side lookup: ticker from CMP",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:"Given a CMP value in G2, find which ticker has that price. VLOOKUP can't look left — INDEX+MATCH can. MATCH finds the CMP in B2:B7, INDEX returns the ticker from A2:A7.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Sector",
    A2:"RELIANCE",B2:2450,C2:"Energy",
    A3:"TCS",B3:4180,C3:"IT",
    A4:"HDFCBANK",B4:1685,C4:"Banks",
    A5:"INFY",B5:1520,C5:"IT",
    A6:"BAJFINANCE",B6:7200,C6:"NBFC",
    A7:"ITC",B7:460,C7:"FMCG",
    F1:"CMP to find",G1:"₹",G2:4180,G3:"Ticker"},
  target:"G4",requires:["INDEX(","MATCH("],solution:"=INDEX(A2:A7,MATCH(G2,B2:B7,0))",
  hint:"MATCH looks in B (CMP column), INDEX returns from A (Ticker column). The ranges can be in any order."};

// --- MEDIUM 2: Two-way lookup in a comps matrix ---
EX.idxm_twoway = {lvl:"medium", title:"INDEX+MATCH — Two-way comps table lookup",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:"A comps table has tickers in column A and metrics (P/E, EV/EBITDA, P/B) across row 1. Pull the specific metric for a specific ticker using two MATCH functions — one for the row, one for the column. Ticker in G2, metric in G3.",
  data:{A1:"Ticker",B1:"P/E",C1:"EV/EBITDA",D1:"P/B",
    A2:"RELIANCE",B2:25.3,C2:12.1,D2:2.1,
    A3:"TCS",B3:28.7,C3:22.4,D3:14.2,
    A4:"HDFCBANK",B4:18.4,C4:0,D4:2.8,
    A5:"INFY",B5:24.6,C5:18.2,D5:8.5,
    A6:"BAJFINANCE",B6:32.5,C6:0,D6:6.2,
    A7:"ITC",B7:26.1,C7:17.8,D7:7.4,
    F1:"Ticker",G2:"INFY",F3:"Metric",G3:"EV/EBITDA",G4:"Value"},
  target:"G5",requires:["INDEX(","MATCH(","MATCH("],
  solution:"=INDEX(B2:D7,MATCH(G2,A2:A7,0),MATCH(G3,B1:D1,0))",
  hint:"INDEX takes two MATCH arguments: row from tickers (A2:A7), column from headers (B1:D1). INDEX range is the data block B2:D7."};

// --- HARD 1: INDEX+MATCH with helper column approach ---
EX.idxm_concat_key = {lvl:"hard", title:"INDEX+MATCH — Lookup by composite key (Sector+Rating)",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:'Find the P/E for the stock that is in the "IT" sector AND has a "Buy" rating. Column D has a pre-built composite key (Sector&Rating). Build the same composite key from G2&G3 to look it up. This is the real-world workaround for multi-criteria lookups — concatenate the criteria into a single lookup key.',
  data:{A1:"Ticker",B1:"Sector",C1:"Rating",D1:"Key",E1:"P/E",
    A2:"RELIANCE",B2:"Energy",C2:"Buy",D2:"EnergyBuy",E2:25.3,
    A3:"TCS",B3:"IT",C3:"Hold",D3:"ITHold",E3:28.7,
    A4:"HDFCBANK",B4:"Banks",C4:"Buy",D4:"BanksBuy",E4:18.4,
    A5:"INFY",B5:"IT",C5:"Buy",D5:"ITBuy",E5:24.6,
    A6:"BAJFINANCE",B6:"NBFC",C6:"Hold",D6:"NBFCHold",E6:32.5,
    A7:"ITC",B7:"FMCG",C7:"Hold",D7:"FMCGHold",E7:26.1,
    F1:"Sector",G2:"IT",F3:"Rating",G3:"Buy",G4:"P/E"},
  target:"G5",requires:["INDEX(","MATCH("],
  solution:'=INDEX(E2:E7,MATCH(G2&G3,D2:D7,0))',
  hint:'Concatenate G2&G3 to get "ITBuy", then MATCH it in the Key column D2:D7. INDEX returns the P/E from E2:E7.'};

// --- HARD 2: INDEX+MATCH to build a formula column ---
EX.idxm_fill = {lvl:"hard", title:"INDEX+MATCH — Build a portfolio value column",fn:"INDEX, MATCH",
  concept: INDEXMATCH_CONCEPT,
  desc:"You have a holdings list (A2:B7, Ticker and Shares) and a separate price master (D2:E7, Ticker and CMP). The tickers are in different order. Write a formula in C2 that looks up the CMP for A2 from the price master, then multiplies by shares in B2. This gives the position value. The formula should be fillable down C3:C7.",
  data:{A1:"Ticker",B1:"Shares",C1:"Value (₹)",
    A2:"ITC",B2:5000,
    A3:"TCS",B3:200,
    A4:"SBIN",B4:1500,
    A5:"INFY",B5:800,
    A6:"RELIANCE",B6:300,
    A7:"HDFCBANK",B7:600,
    D1:"Ticker",E1:"CMP (₹)",
    D2:"HDFCBANK",E2:1685,
    D3:"INFY",E3:1520,
    D4:"ITC",E4:460,
    D5:"RELIANCE",E5:2450,
    D6:"SBIN",E6:820,
    D7:"TCS",E7:4180},
  target:"C2",requires:["INDEX(","MATCH("],
  solution:"=INDEX(E2:E7,MATCH(A2,D2:D7,0))*B2",
  hint:"INDEX+MATCH pulls the CMP, then multiply by B2 (shares). The lookup uses A2 as the ticker to find in D2:D7."};
