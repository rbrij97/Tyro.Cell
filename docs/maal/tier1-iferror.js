/* ================================================================
   IFERROR — 4 new exercises (easy → medium → hard)
   Currently: 0 exercises. In engine, P0 priority.
   Every lookup in real life needs IFERROR. This is the safety net.
   ================================================================ */

const IFERROR_CONCEPT = "<p><b class='term'>IFERROR</b> catches any error (#N/A, #DIV/0!, #VALUE!, #REF!) and returns a fallback value instead. It wraps around another formula.</p><span class='formula'>=IFERROR(formula, value_if_error)</span><p>Finance uses: wrap every VLOOKUP/INDEX+MATCH so missing tickers show 'N/A' instead of ugly #N/A errors. Wrap divisions so zero-revenue quarters don't blow up margin calculations.</p>";

// --- EASY 1: Wrap a VLOOKUP ---
EX.iferror_vlookup = {lvl:"easy", title:"IFERROR — Safe VLOOKUP with fallback",fn:"IFERROR",
  concept: IFERROR_CONCEPT,
  desc:'F2 has ticker "WIPRO" which is NOT in the price list A2:B7. A bare VLOOKUP would show #N/A. Wrap it in IFERROR to show "N/A" instead. The formula structure: =IFERROR(VLOOKUP(...), "N/A").',
  data:{A1:"Ticker",B1:"CMP (₹)",
    A2:"RELIANCE",B2:2450,
    A3:"TCS",B3:4180,
    A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:1520,
    A6:"ICICIBANK",B6:1150,
    A7:"SBIN",B7:820,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"WIPRO",F3:"CMP (₹)"},
  target:"F4",requires:["IFERROR(","VLOOKUP("],solution:'=IFERROR(VLOOKUP(F2,A2:B7,2,FALSE),"N/A")',
  hint:'Wrap the entire VLOOKUP inside IFERROR: =IFERROR(VLOOKUP(...), "N/A").'};

// --- EASY 2: Wrap a division ---
EX.iferror_div = {lvl:"easy", title:"IFERROR — Safe margin calculation",fn:"IFERROR",
  concept: IFERROR_CONCEPT,
  desc:"Compute gross margin % (Gross Profit / Revenue × 100) for each company. Row 4 (StartupCo) has zero revenue — the division would give #DIV/0!. Wrap in IFERROR to show 0 instead. Write the formula for D2 — it should work when filled down to D5 too.",
  data:{A1:"Company",B1:"Revenue (₹ Cr)",C1:"Gross Profit (₹ Cr)",D1:"Margin %",
    A2:"TCS",B2:240000,C2:96000,
    A3:"Infosys",B3:180000,C3:54000,
    A4:"StartupCo",B4:0,C4:0,
    A5:"Wipro",B5:90000,C5:22500},
  target:"D2",requires:["IFERROR(","ROUND("],solution:"=IFERROR(ROUND(C2/B2*100,1),0)",
  hint:"Wrap the ROUND(C2/B2*100,1) inside IFERROR(..., 0). If the division fails, return 0."};

// --- MEDIUM 1: IFERROR with INDEX+MATCH ---
EX.iferror_idxm = {lvl:"medium", title:"IFERROR — Safe INDEX+MATCH for analyst coverage",fn:"IFERROR",
  concept: IFERROR_CONCEPT,
  desc:'You have a coverage table with Ticker and Rating. Pull the rating for the ticker in F2 using INDEX+MATCH, wrapped in IFERROR. If the ticker has no coverage, show "Not rated". F2 has ADANIENT which is not in the table.',
  data:{A1:"Ticker",B1:"Rating",
    A2:"RELIANCE",B2:"Overweight",
    A3:"TCS",B3:"Neutral",
    A4:"HDFCBANK",B4:"Buy",
    A5:"INFY",B5:"Outperform",
    A6:"ICICIBANK",B6:"Buy",
    A7:"SBIN",B7:"Hold",
    E1:"Lookup",F1:"Ticker",F2:"ADANIENT",F3:"Rating"},
  target:"F4",requires:["IFERROR(","INDEX(","MATCH("],
  solution:'=IFERROR(INDEX(B2:B7,MATCH(F2,A2:A7,0)),"Not rated")',
  hint:'=IFERROR(INDEX+MATCH formula, "Not rated"). The whole INDEX+MATCH is the first argument.'};

// --- HARD 1: IFERROR chain for multi-source lookup ---
EX.iferror_chain = {lvl:"hard", title:"IFERROR — Cascade: try NSE price, then BSE price",fn:"IFERROR",
  concept: IFERROR_CONCEPT,
  desc:'Two price sources: NSE list (A2:B5) and BSE list (D2:E5). Some tickers are only on one exchange. Write a formula that tries VLOOKUP on the NSE list first; if #N/A, tries the BSE list; if still #N/A, shows "No price". This is a nested IFERROR — the fallback of the first IFERROR is another IFERROR+VLOOKUP.',
  data:{A1:"NSE Ticker",B1:"NSE CMP",
    A2:"RELIANCE",B2:2450,
    A3:"TCS",B3:4180,
    A4:"INFY",B4:1520,
    A5:"HDFCBANK",B5:1685,
    D1:"BSE Ticker",E1:"BSE CMP",
    D2:"SBIN",E2:820,
    D3:"ITC",E3:460,
    D4:"RELIANCE",E4:2448,
    D5:"BAJFINANCE",E5:7200,
    G1:"Ticker",H2:"BAJFINANCE",H3:"Price"},
  target:"H4",requires:["IFERROR(","IFERROR(","VLOOKUP("],
  solution:'=IFERROR(VLOOKUP(H2,A2:B5,2,FALSE),IFERROR(VLOOKUP(H2,D2:E5,2,FALSE),"No price"))',
  hint:'Nest two IFERRORs: =IFERROR(VLOOKUP(NSE), IFERROR(VLOOKUP(BSE), "No price")). BAJFINANCE is only on BSE.'};
