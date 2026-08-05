/* ================================================================
   MEDIAN, MIN, MAX, AVERAGEIF — Statistical functions
   Real portfolio and valuation scenarios.
   ================================================================ */

const MEDIAN_CONCEPT = "<p><b class='term'>MEDIAN</b> returns the middle value of a set of numbers. If the count is even, it averages the two middle values.</p><span class='formula'>=MEDIAN(number1, [number2], ...)</span><p>Finance use: median P/E for a peer group (less distorted by outliers than average), median salary for comp analysis, median deal size for investment banking league tables. Analysts prefer median over average when outliers exist.</p>";

const MINMAX_CONCEPT = "<p><b class='term'>MIN</b> returns the smallest value. <b class='term'>MAX</b> returns the largest.</p><span class='formula'>=MIN(range)  =MAX(range)</span><p>Finance use: find the cheapest stock in a screen, identify the highest-yield bond, 52-week high/low ranges, worst-case scenario analysis, spread calculations (MAX - MIN).</p>";

const AVERAGEIF_CONCEPT = "<p><b class='term'>AVERAGEIF</b> averages cells that meet a single criterion.</p><span class='formula'>=AVERAGEIF(criteria_range, criteria, [average_range])</span><p>Finance use: average P/E for a specific sector, average salary by department, mean return for a particular rating category. Unlike AVERAGEIFS, it handles only one condition — simpler and more common.</p>";

// ===== MEDIAN (2 exercises) =====

EX.median_pe = {lvl:"easy", title:"Median P/E for a sector peer group (better than average)",fn:"MEDIAN",
  concept: MEDIAN_CONCEPT,
  desc:"Your comps table has 6 IT services companies. One outlier (P/E of 85) skews the average. The MD wants the MEDIAN P/E — it's the standard metric in equity research because it's resistant to outliers. Compute MEDIAN of B2:B7.",
  data:{A1:"Company",B1:"P/E",
    A2:"TCS",B2:28.7,
    A3:"Infosys",B3:24.6,
    A4:"Wipro",B4:22.3,
    A5:"HCL Tech",B5:26.8,
    A6:"Tech Mahindra",B6:35.2,
    A7:"Persistent",B7:85.0,
    A9:"Median P/E"},
  target:"B9",requires:["MEDIAN("],solution:"=MEDIAN(B2:B7)",
  hint:"MEDIAN of {22.3, 24.6, 26.8, 28.7, 35.2, 85.0}. 6 values → average of 3rd and 4th: (26.8+28.7)/2 = 27.75."};

EX.median_deal = {lvl:"medium", title:"Median deal size for IB league table positioning",fn:"MEDIAN",
  concept: MEDIAN_CONCEPT,
  desc:"An investment bank's M&A team completed 7 deals this year. For the league table submission, they report median deal size (not average, which one mega-deal would distort). Compute the median of all deal values in B2:B8.",
  data:{A1:"Deal",B1:"Value (₹ Cr)",
    A2:"Tata-Target1",B2:450,
    A3:"Reliance-Target2",B3:12000,
    A4:"HDFC-Merger",B4:2800,
    A5:"Birla-Acq",B5:680,
    A6:"Infosys-BuyOut",B6:1200,
    A7:"Wipro-Target3",B7:350,
    A8:"Adani-Target4",B8:3500,
    A10:"Median deal size"},
  target:"B10",requires:["MEDIAN("],solution:"=MEDIAN(B2:B8)",
  hint:"Sort mentally: 350, 450, 680, 1200, 2800, 3500, 12000. Middle (4th of 7) = 1200."};

// ===== MIN / MAX in finance context (2 exercises) =====

EX.minmax_spread = {lvl:"easy", title:"P/E range spread — cheapest to most expensive in peer group",fn:"MIN, MAX",
  concept: MINMAX_CONCEPT,
  desc:"For a comps summary slide, compute the P/E range spread: MAX P/E minus MIN P/E. This tells the investor how wide the valuation dispersion is within the sector. A large spread suggests the market values these companies very differently.",
  data:{A1:"Company",B1:"P/E",
    A2:"TCS",B2:28.7,A3:"Infosys",B3:24.6,A4:"Wipro",B4:22.3,
    A5:"HCL Tech",B5:26.8,A6:"Tech Mahindra",B6:35.2,
    A8:"Cheapest P/E",A9:"Most expensive P/E",A10:"Spread"},
  target:"B8",requires:["MIN("],solution:"=MIN(B2:B6)",
  hint:"=MIN(B2:B6) finds the lowest P/E: 22.3 (Wipro)."};

EX.minmax_drawdown = {lvl:"medium", title:"Maximum drawdown — worst monthly return this year",fn:"MIN, ABS",
  concept: MINMAX_CONCEPT,
  desc:"Risk report: find the worst (most negative) monthly return and express it as a positive drawdown percentage. MIN finds the most negative return, ABS converts it to positive. This is a simplified max-drawdown metric shown on every fund factsheet.",
  data:{A1:"Month",B1:"Return %",
    A2:"Jan",B2:3.2,A3:"Feb",B3:-1.8,A4:"Mar",B4:-5.4,
    A5:"Apr",B5:2.1,A6:"May",B6:-0.9,A7:"Jun",B7:4.5,
    A8:"Jul",B8:-3.2,A9:"Aug",B9:1.7,
    A11:"Max drawdown %"},
  target:"B11",requires:["MIN(","ABS("],solution:"=ABS(MIN(B2:B9))",
  hint:"MIN(B2:B9) = -5.4 (worst month). ABS(-5.4) = 5.4% drawdown."};

// ===== AVERAGEIF (2 exercises) =====

EX.avgif_sector = {lvl:"easy", title:"Average P/E for IT sector stocks only",fn:"AVERAGEIF",
  concept: AVERAGEIF_CONCEPT,
  desc:'A multi-sector watchlist has P/E ratios. Compute the average P/E for only the "IT" sector stocks. AVERAGEIF is like SUMIF but averages instead of summing — same syntax pattern.',
  data:{A1:"Ticker",B1:"Sector",C1:"P/E",
    A2:"TCS",B2:"IT",C2:28.7,
    A3:"RELIANCE",B3:"Energy",C3:25.3,
    A4:"INFY",B4:"IT",C4:24.6,
    A5:"HDFCBANK",B5:"Banks",C5:18.4,
    A6:"WIPRO",B6:"IT",C6:22.3,
    A7:"ITC",B7:"FMCG",C7:26.1,
    A9:"IT sector avg P/E"},
  target:"C9",requires:["AVERAGEIF("],solution:'=AVERAGEIF(B2:B7,"IT",C2:C7)',
  hint:'=AVERAGEIF(B2:B7, "IT", C2:C7). Averages P/E for TCS, INFY, WIPRO: (28.7+24.6+22.3)/3.'};

EX.avgif_positive = {lvl:"medium", title:"Average of only positive monthly returns (win rate analysis)",fn:"AVERAGEIF",
  concept: AVERAGEIF_CONCEPT,
  desc:'A fund manager wants to know the average return on winning months (positive returns only). This is part of the win/loss analysis in the monthly performance attribution. Use AVERAGEIF with criteria ">0" on the returns column.',
  data:{A1:"Month",B1:"Return %",
    A2:"Jan",B2:3.2,A3:"Feb",B3:-1.8,A4:"Mar",B4:5.1,
    A5:"Apr",B5:-2.4,A6:"May",B6:1.9,A7:"Jun",B7:4.5,
    A8:"Jul",B8:-0.7,A9:"Aug",B9:2.8,
    A11:"Avg winning month %"},
  target:"B11",requires:["AVERAGEIF("],solution:'=AVERAGEIF(B2:B9,">0")',
  hint:'=AVERAGEIF(B2:B9, ">0"). Averages only positive values: (3.2+5.1+1.9+4.5+2.8)/5.'};
