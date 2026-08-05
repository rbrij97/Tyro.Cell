/* ================================================================
   AVERAGEIFS — 3 new exercises (easy → medium → hard)
   Currently: 0 exercises. In engine, P0 priority.
   Multi-criteria average — the comps table workhorse.
   ================================================================ */

const AVERAGEIFS_CONCEPT = "<p><b class='term'>AVERAGEIFS</b> averages cells that meet <b>multiple criteria</b>. Like SUMIFS, the average range comes first.</p><span class='formula'>=AVERAGEIFS(average_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)</span><p>Finance uses: average P/E by sector, average return above a threshold, average salary by department and grade, sector-specific yield calculations.</p>";

// --- EASY 1: Single-criteria AVERAGEIFS ---
EX.avgifs_sector = {lvl:"easy", title:"AVERAGEIFS — Average P/E for IT sector",fn:"AVERAGEIFS",
  concept: AVERAGEIFS_CONCEPT,
  desc:'Compute the average P/E ratio for IT sector stocks only. One criterion: Sector = "IT". Even though AVERAGEIF (without the S) works for single criteria, practice the AVERAGEIFS syntax — it scales to multiple criteria.',
  data:{A1:"Ticker",B1:"Sector",C1:"P/E",
    A2:"RELIANCE",B2:"Energy",C2:25.3,
    A3:"TCS",B3:"IT",C3:28.7,
    A4:"HDFCBANK",B4:"Banks",C4:18.4,
    A5:"INFY",B5:"IT",C5:24.6,
    A6:"ICICIBANK",B6:"Banks",C6:17.9,
    A7:"ITC",B7:"FMCG",C7:26.1,
    A8:"WIPRO",B8:"IT",C8:22.3,
    A9:"TECHM",B9:"IT",C9:25.8,
    A11:"IT sector avg P/E"},
  target:"B11",requires:["AVERAGEIFS("],solution:'=AVERAGEIFS(C2:C9,B2:B9,"IT")',
  hint:'Average range first (C2:C9), then criteria pair (B2:B9, "IT").'};

// --- MEDIUM 1: Two criteria ---
EX.avgifs_bank_cheap = {lvl:"medium", title:"AVERAGEIFS — Avg yield for high-dividend banks",fn:"AVERAGEIFS",
  concept: AVERAGEIFS_CONCEPT,
  desc:'Compute the average dividend yield for Bank stocks with yield above 1%. Two criteria: Sector = "Banks" AND Div Yield > 1.',
  data:{A1:"Ticker",B1:"Sector",C1:"Div Yield %",
    A2:"RELIANCE",B2:"Energy",C2:0.4,
    A3:"TCS",B3:"IT",C3:1.3,
    A4:"HDFCBANK",B4:"Banks",C4:1.2,
    A5:"ITC",B5:"FMCG",C5:3.4,
    A6:"ICICIBANK",B6:"Banks",C6:0.9,
    A7:"SBIN",B7:"Banks",C7:1.8,
    A8:"KOTAKBANK",B8:"Banks",C8:0.1,
    A9:"AXISBANK",B9:"Banks",C9:0.7,
    A10:"BANKBARODA",B10:"Banks",C10:2.5,
    A12:"Bank high-div avg"},
  target:"B12",requires:["AVERAGEIFS("],solution:'=AVERAGEIFS(C2:C10,B2:B10,"Banks",C2:C10,">1")',
  hint:'Average range = C2:C10. Two criteria: sector = "Banks", yield > ">1". HDFCBANK(1.2), SBIN(1.8), BANKBARODA(2.5) qualify.'};

// --- HARD 1: Three criteria with numeric operators ---
EX.avgifs_quality = {lvl:"hard", title:"AVERAGEIFS — Avg P/E for quality screen",fn:"AVERAGEIFS",
  concept: AVERAGEIFS_CONCEPT,
  desc:'You run a quality screen: Sector NOT "Banks" (use "<>Banks"), ROE above 15%, and Market Cap above 500000 Cr. What is the average P/E of stocks passing this screen? Three criteria on three different columns.',
  data:{A1:"Ticker",B1:"Sector",C1:"P/E",D1:"ROE %",E1:"Mkt Cap (₹ Cr)",
    A2:"RELIANCE",B2:"Energy",C2:25.3,D2:9.8,E2:1658000,
    A3:"TCS",B3:"IT",C3:28.7,D3:48.2,E3:1520000,
    A4:"HDFCBANK",B4:"Banks",C4:18.4,D4:17.1,E4:1280000,
    A5:"INFY",B5:"IT",C5:24.6,D5:32.4,E5:630000,
    A6:"ICICIBANK",B6:"Banks",C6:17.9,D6:18.3,E6:810000,
    A7:"ITC",B7:"FMCG",C7:26.1,D7:28.9,E7:580000,
    A8:"HINDUNILVR",B8:"FMCG",C8:58.2,D8:18.5,E8:610000,
    A9:"BAJFINANCE",B9:"NBFC",C9:32.5,D9:22.1,E9:450000,
    A11:"Quality avg P/E"},
  target:"B11",requires:["AVERAGEIFS("],
  solution:'=AVERAGEIFS(C2:C9,B2:B9,"<>Banks",D2:D9,">15",E2:E9,">500000")',
  hint:'Three pairs after the avg range: sector<>"Banks", ROE>15, MktCap>500000. TCS, INFY, ITC, HINDUNILVR pass.'};
