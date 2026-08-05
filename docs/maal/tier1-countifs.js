/* ================================================================
   COUNTIFS — 3 new exercises (easy → medium → hard)
   Currently: 0 exercises. In engine, P0 priority.
   COUNTIF exists (1 exercise, needs rewrite). COUNTIFS is multi-criteria.
   ================================================================ */

const COUNTIFS_CONCEPT = "<p><b class='term'>COUNTIFS</b> counts cells that meet <b>multiple criteria</b> simultaneously. Each pair of arguments is a (range, criterion).</p><span class='formula'>=COUNTIFS(range1, criteria1, range2, criteria2, ...)</span><p>All ranges must be the same size. A cell is counted only if it passes every criterion. Finance uses: count stocks by sector + rating, filter portfolio by multiple screens, count trades above threshold in a date range.</p>";

// --- EASY 1: Two-criteria count ---
EX.countifs_sector = {lvl:"easy", title:"COUNTIFS — Count stocks by sector and rating",fn:"COUNTIFS",
  concept: COUNTIFS_CONCEPT,
  desc:'Count how many stocks are in the "IT" sector AND have a "Buy" rating. Two criteria: sector = IT, rating = Buy.',
  data:{A1:"Ticker",B1:"Sector",C1:"Rating",
    A2:"RELIANCE",B2:"Energy",C2:"Buy",
    A3:"TCS",B3:"IT",C3:"Hold",
    A4:"HDFCBANK",B4:"Banks",C4:"Buy",
    A5:"INFY",B5:"IT",C5:"Buy",
    A6:"ICICIBANK",B6:"Banks",C6:"Buy",
    A7:"ITC",B7:"FMCG",C7:"Hold",
    A8:"WIPRO",B8:"IT",C8:"Buy",
    A9:"SBIN",B9:"Banks",C9:"Hold",
    A10:"TECHM",B10:"IT",C10:"Sell",
    A12:"IT + Buy count"},
  target:"B12",requires:["COUNTIFS("],solution:'=COUNTIFS(B2:B10,"IT",C2:C10,"Buy")',
  hint:'Two pairs: (B2:B10, "IT", C2:C10, "Buy"). Only rows matching BOTH are counted.'};

// --- MEDIUM 1: Numeric criteria with operators ---
EX.countifs_screen = {lvl:"medium", title:"COUNTIFS — Stock screener: P/E < 25 and Div Yield > 2%",fn:"COUNTIFS",
  concept: COUNTIFS_CONCEPT,
  desc:'Screen for value stocks: count those with P/E below 25 AND dividend yield above 2%. Use operator criteria: "<25" and ">2".',
  data:{A1:"Ticker",B1:"P/E",C1:"Div Yield %",
    A2:"RELIANCE",B2:25.3,C2:0.4,
    A3:"TCS",B3:28.7,C3:1.3,
    A4:"HDFCBANK",B4:18.4,C4:1.2,
    A5:"ITC",B5:26.1,C5:3.4,
    A6:"ICICIBANK",B6:17.9,C6:0.9,
    A7:"COALINDIA",B7:8.2,C7:5.1,
    A8:"POWERGRID",B8:12.5,C8:4.2,
    A9:"NTPC",B9:14.8,C9:2.8,
    A10:"ONGC",B10:7.6,C10:3.9,
    A11:"SBIN",B11:9.4,C11:1.8,
    A13:"Value screen count"},
  target:"B13",requires:["COUNTIFS("],solution:'=COUNTIFS(B2:B11,"<25",C2:C11,">2")',
  hint:'Operator criteria are strings: "<25" and ">2". Both must be true for a row to be counted.'};

// --- HARD 1: Three criteria ---
EX.countifs_triple = {lvl:"hard", title:"COUNTIFS — Triple screen: sector + P/E + market cap",fn:"COUNTIFS",
  concept: COUNTIFS_CONCEPT,
  desc:'Count large-cap bank stocks trading cheap: Sector = "Banks", P/E < 20, Market Cap > 500000 Cr. Three criteria pairs.',
  data:{A1:"Ticker",B1:"Sector",C1:"P/E",D1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:"Energy",C2:25.3,D2:1658000,
    A3:"TCS",B3:"IT",C3:28.7,D3:1520000,
    A4:"HDFCBANK",B4:"Banks",C4:18.4,D4:1280000,
    A5:"INFY",B5:"IT",C5:24.6,D5:630000,
    A6:"ICICIBANK",B6:"Banks",C6:17.9,D6:810000,
    A7:"SBIN",B7:"Banks",C7:9.4,D7:730000,
    A8:"KOTAKBANK",B8:"Banks",C8:22.1,D8:380000,
    A9:"BAJFINANCE",B9:"NBFC",C9:32.5,D9:450000,
    A10:"AXISBANK",B10:"Banks",C10:13.2,D10:340000,
    A12:"Cheap large banks"},
  target:"B12",requires:["COUNTIFS("],
  solution:'=COUNTIFS(B2:B10,"Banks",C2:C10,"<20",D2:D10,">500000")',
  hint:'Three pairs: (sector="Banks"), (P/E<"20"), (Mkt Cap>">500000"). Only HDFCBANK, ICICIBANK, SBIN pass all three.'};
