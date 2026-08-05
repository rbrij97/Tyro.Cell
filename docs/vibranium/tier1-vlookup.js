/* ================================================================
   VLOOKUP — 6 new exercises (easy → medium → hard)
   All finance-contexted. Ready to paste into EX object.
   Existing: vlookup (1 exercise, fruit prices — needs rewrite)
   ================================================================ */

const VLOOKUP_CONCEPT = "<p><b class='term'>VLOOKUP</b> searches for a value in the <b>first column</b> of a table and returns a value from a specified column in the same row.</p><span class='formula'>=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])</span><p><code>FALSE</code> = exact match (use this almost always). <code>TRUE</code> or omitted = approximate match (requires sorted first column). Finance uses: pull CMP, P/E, market cap, or any metric from a master ticker list.</p>";

// --- EASY 1: Basic exact-match lookup ---
EX.vlookup_cmp = {lvl:"easy", title:"VLOOKUP — Pull CMP from ticker master",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"You have a 6-stock ticker master (A1:C7) with Ticker, CMP, and Market Cap. Pull the current market price (CMP) for HDFCBANK in F2 using VLOOKUP.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:2450,C2:1658000,
    A3:"TCS",B3:4180,C3:1520000,
    A4:"HDFCBANK",B4:1685,C4:1280000,
    A5:"INFY",B5:1520,C5:630000,
    A6:"ICICIBANK",B6:1150,C6:810000,
    A7:"SBIN",B7:820,C7:730000,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"HDFCBANK",F3:"CMP (₹)"},
  target:"F4",requires:["VLOOKUP("],solution:"=VLOOKUP(F2,A2:C7,2,FALSE)",
  hint:"Table is A2:C7, CMP is column 2, use FALSE for exact match."};

// --- EASY 2: Different column index ---
EX.vlookup_mcap = {lvl:"easy", title:"VLOOKUP — Pull market cap for a ticker",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"Same ticker master. This time pull the Market Cap (column 3) for INFY. Notice the only change from the CMP lookup is the column index number.",
  data:{A1:"Ticker",B1:"CMP (₹)",C1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:2450,C2:1658000,
    A3:"TCS",B3:4180,C3:1520000,
    A4:"HDFCBANK",B4:1685,C4:1280000,
    A5:"INFY",B5:1520,C5:630000,
    A6:"ICICIBANK",B6:1150,C6:810000,
    A7:"SBIN",B7:820,C7:730000,
    E1:"Lookup",F1:"Ticker",E2:"→",F2:"INFY",F3:"Mkt Cap (₹ Cr)"},
  target:"F4",requires:["VLOOKUP("],solution:"=VLOOKUP(F2,A2:C7,3,FALSE)",
  hint:"Column 3 = Market Cap. Everything else stays the same."};

// --- MEDIUM 1: Lookup from a larger table with more columns ---
EX.vlookup_pe = {lvl:"medium", title:"VLOOKUP — Pull P/E from comps table",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"An 8-stock comps table has Ticker, Sector, CMP, P/E, and EV/EBITDA. Pull the trailing P/E for BAJFINANCE. Count the columns carefully — P/E is the 4th column in the table.",
  data:{A1:"Ticker",B1:"Sector",C1:"CMP (₹)",D1:"P/E",E1:"EV/EBITDA",
    A2:"RELIANCE",B2:"Energy",C2:2450,D2:25.3,E2:12.1,
    A3:"TCS",B3:"IT",C3:4180,D3:28.7,E3:22.4,
    A4:"HDFCBANK",B4:"Banks",C4:1685,D4:18.4,E4:0,
    A5:"INFY",B5:"IT",C5:1520,D5:24.6,E5:18.2,
    A6:"BAJFINANCE",B6:"NBFC",C6:7200,D6:32.5,E6:0,
    A7:"ICICIBANK",B7:"Banks",C7:1150,D7:17.9,E7:0,
    A8:"ITC",B8:"FMCG",C8:460,D8:26.1,E8:17.8,
    A9:"MARUTI",B9:"Auto",C9:12400,D9:30.2,E9:20.5,
    G1:"Lookup",H1:"Ticker",G2:"→",H2:"BAJFINANCE",H3:"P/E"},
  target:"H4",requires:["VLOOKUP("],solution:"=VLOOKUP(H2,A2:E9,4,FALSE)",
  hint:"Count columns: A=1(Ticker), B=2(Sector), C=3(CMP), D=4(P/E). Table is A2:E9."};

// --- MEDIUM 2: Lookup with cell reference as lookup value ---
EX.vlookup_rating = {lvl:"medium", title:"VLOOKUP — Pull analyst rating from coverage table",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"Your team maintains a coverage table with Ticker, Target Price, and Rating (Buy/Hold/Sell). The PM asks for the rating on the stock in G2. Pull it with VLOOKUP. Note: the table has only 3 columns.",
  data:{A1:"Ticker",B1:"Target (₹)",C1:"Rating",
    A2:"RELIANCE",B2:2800,C2:"Buy",
    A3:"TCS",B3:4500,C3:"Hold",
    A4:"HDFCBANK",B4:1900,C4:"Buy",
    A5:"INFY",B5:1650,C5:"Buy",
    A6:"ICICIBANK",B6:1300,C6:"Buy",
    A7:"ITC",B7:500,C7:"Hold",
    A8:"SBIN",B8:900,C8:"Hold",
    A9:"MARUTI",B9:13500,C9:"Sell",
    F1:"Stock to check",G1:"Ticker",G2:"MARUTI",G3:"Rating"},
  target:"G4",requires:["VLOOKUP("],solution:"=VLOOKUP(G2,A2:C9,3,FALSE)",
  hint:"Rating is column 3 in the table A2:C9."};

// --- HARD 1: Approximate match for tax slab ---
EX.vlookup_taxslab = {lvl:"hard", title:"VLOOKUP — Income tax slab lookup (approximate match)",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"India's new tax regime slabs are in A1:B7 (lower bound → rate). Given taxable income in E2, find the applicable tax rate using VLOOKUP with approximate match (TRUE or omit the 4th argument). The slab column is sorted ascending — VLOOKUP finds the largest value ≤ the lookup value.",
  data:{A1:"Slab (₹)",B1:"Rate %",
    A2:0,B2:0,
    A3:300000,B3:5,
    A4:700000,B4:10,
    A5:1000000,B5:15,
    A6:1200000,B6:20,
    A7:1500000,B7:30,
    D1:"Taxable income",E1:"₹",E2:950000,E3:"Tax rate %"},
  target:"E4",requires:["VLOOKUP("],solution:"=VLOOKUP(E2,A2:B7,2,TRUE)",
  hint:"TRUE (or omit) = approximate match. ₹9.5L falls in the 7L-10L slab → 10%. The sorted first column makes this work."};

// --- HARD 2: VLOOKUP across sheets / with mixed data ---
EX.vlookup_dividend = {lvl:"hard", title:"VLOOKUP — Build dividend income column",fn:"VLOOKUP",
  concept: VLOOKUP_CONCEPT,
  desc:"You hold 6 stocks (A2:B7, Ticker and Shares). A dividend-per-share master is in D2:E7 (Ticker and DPS). Use VLOOKUP to pull the DPS for each ticker into C2, then you can fill down C3:C7. Write the formula for C2 only — use the ticker in A2 to look up DPS from the D:E table.",
  data:{A1:"Ticker",B1:"Shares",C1:"DPS (₹)",
    A2:"TCS",B2:500,
    A3:"INFY",B3:1200,
    A4:"HDFCBANK",B4:800,
    A5:"ITC",B5:3000,
    A6:"RELIANCE",B6:400,
    A7:"SBIN",B7:1500,
    D1:"Ticker",E1:"DPS (₹)",
    D2:"HDFCBANK",E2:19.5,
    D3:"INFY",E3:18.0,
    D4:"ITC",E4:6.25,
    D5:"RELIANCE",E5:10.0,
    D6:"SBIN",E6:11.3,
    D7:"TCS",E7:55.0},
  target:"C2",requires:["VLOOKUP("],solution:"=VLOOKUP(A2,D2:E7,2,FALSE)",
  hint:"Look up A2 (TCS) in the D:E table. Column 2 = DPS. FALSE = exact match."};
