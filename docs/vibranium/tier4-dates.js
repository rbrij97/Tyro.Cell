/* ================================================================
   DATE FUNCTIONS — TODAY, YEAR, MONTH, DAY, DAYS, DATE, TEXT
   Finance lives and dies by dates: maturity, settlement, aging,
   fiscal periods, report formatting.
   ================================================================ */

const TODAY_CONCEPT = "<p><b class='term'>TODAY()</b> returns today's date as a serial number. It takes no arguments and updates every time the sheet recalculates.</p><span class='formula'>=TODAY()</span><p>Finance use: days to maturity, bond holding period, receivable aging, option expiry countdown. Often used with DAYS or simple subtraction.</p>";

const YEARMONTHDAY_CONCEPT = "<p><b class='term'>YEAR</b>, <b class='term'>MONTH</b>, and <b class='term'>DAY</b> extract components from a date.</p><span class='formula'>=YEAR(date)  → 2024<br>=MONTH(date) → 8<br>=DAY(date)   → 15</span><p>Finance use: group transactions by fiscal year, compute quarters from months, extract payment due dates, identify financial year (April–March for India).</p>";

const DAYS_CONCEPT = "<p><b class='term'>DAYS</b> returns the number of days between two dates.</p><span class='formula'>=DAYS(end_date, start_date)</span><p>Note: end date comes FIRST. Finance use: settlement periods, receivable aging, holding period for STCG/LTCG classification, interest accrual days.</p>";

const DATE_CONCEPT = "<p><b class='term'>DATE</b> constructs a date from year, month, and day components.</p><span class='formula'>=DATE(year, month, day)</span><p>Finance use: build maturity dates from issue date + tenure, construct fiscal year start/end dates, create first-of-month dates for timelines. DATE handles overflow: DATE(2024,13,1) → Jan 1, 2025.</p>";

const TEXT_CONCEPT = "<p><b class='term'>TEXT</b> converts a number or date to text using a format code.</p><span class='formula'>=TEXT(value, format_text)</span><p>Common codes: <code>\"MMM-YYYY\"</code> → Aug-2024, <code>\"DD-MMM-YY\"</code> → 15-Aug-24, <code>\"#,##0\"</code> → 1,25,000 (Indian commas don't work — use standard), <code>\"0.00%\"</code> → 12.50%.</p><p>Finance use: format dates for report headers, create period labels, display numbers as text for concatenation.</p>";

// ===== TODAY (1 exercise) =====

EX.today_maturity = {lvl:"easy", title:"Days to FD maturity using TODAY",fn:"TODAY, DAYS",
  concept: TODAY_CONCEPT,
  desc:"A client's FD matures on 15-Mar-2027 (stored as a date in B2). Compute how many days remain from today using DAYS(maturity, TODAY()). This countdown appears on the wealth advisor's client dashboard every morning.",
  data:{A1:"Client",B1:"FD Maturity Date",C1:"Days Left",
    A2:"Mr. Sharma",B2:"2027-03-15"},
  target:"C2",requires:["TODAY(","DAYS("],solution:"=DAYS(B2,TODAY())",
  hint:"=DAYS(B2, TODAY()) — end date first, start date second. Result changes daily."};

// ===== YEAR (2 exercises) =====

EX.year_extract = {lvl:"easy", title:"Extract year from transaction dates for annual grouping",fn:"YEAR",
  concept: YEARMONTHDAY_CONCEPT,
  desc:"The accounts team needs to group dividend receipts by calendar year. Extract the year from each transaction date in B2. This year column becomes the row label in a pivot table.",
  data:{A1:"Scrip",B1:"Dividend Date",C1:"Amount (₹)",D1:"Year",
    A2:"TCS",B2:"2024-06-15",C2:45000,
    A3:"INFY",B3:"2023-11-20",C3:28000,
    A4:"ITC",B4:"2024-02-10",C4:15000,
    A5:"RELIANCE",B5:"2023-08-05",C5:35000},
  target:"D2",requires:["YEAR("],solution:"=YEAR(B2)",
  hint:"=YEAR(B2) returns 2024 from 15-Jun-2024."};

EX.year_fy = {lvl:"medium", title:"Determine Indian fiscal year from a transaction date",fn:"YEAR, MONTH, IF",
  concept: YEARMONTHDAY_CONCEPT,
  desc:'Indian fiscal year runs April–March. A transaction in Jan 2025 belongs to FY25 (starts Apr 2024), while Apr 2025 belongs to FY26. Rule: if MONTH ≤ 3 (Jan-Mar), fiscal year = YEAR; if MONTH ≥ 4, fiscal year = YEAR+1. Return just the 2-digit suffix as a label: "FY" & RIGHT(year,2). Write the FY label for the date in B2.',
  data:{A1:"Transaction",B1:"Date",C1:"FY",
    A2:"Dividend TCS",B2:"2025-01-15",
    A3:"Sale INFY",B3:"2025-04-22",
    A4:"Buy HDFC",B4:"2024-11-03",
    A5:"Interest SBI",B5:"2025-03-31"},
  target:"C2",requires:["IF(","MONTH(","YEAR("],
  solution:'=IF(MONTH(B2)<=3,"FY"&RIGHT(YEAR(B2),2),"FY"&RIGHT(YEAR(B2)+1,2))',
  hint:'Jan 2025: MONTH=1 ≤ 3, so FY = YEAR = 2025 → "FY25". Apr 2025: MONTH=4 > 3, so FY = 2026 → "FY26".'};

// ===== MONTH (2 exercises) =====

EX.month_extract = {lvl:"easy", title:"Extract month number for monthly revenue grouping",fn:"MONTH",
  concept: YEARMONTHDAY_CONCEPT,
  desc:"GST return data has invoice dates. Extract the month number from each date so you can group invoices by month. Month 1 = January, 12 = December.",
  data:{A1:"Invoice",B1:"Date",C1:"Amount (₹ L)",D1:"Month",
    A2:"INV-001",B2:"2024-08-15",C2:12.5,
    A3:"INV-002",B3:"2024-08-22",C3:8.3,
    A4:"INV-003",B4:"2024-09-01",C4:15.0,
    A5:"INV-004",B5:"2024-07-28",C5:6.7},
  target:"D2",requires:["MONTH("],solution:"=MONTH(B2)",
  hint:"=MONTH(B2) returns 8 for August."};

EX.month_quarter = {lvl:"medium", title:"Derive calendar quarter from invoice date",fn:"MONTH, ROUNDUP, IF",
  concept: YEARMONTHDAY_CONCEPT,
  desc:'Assign each invoice to its calendar quarter: months 1-3 → Q1, 4-6 → Q2, 7-9 → Q3, 10-12 → Q4. The trick: ROUNDUP(MONTH/3, 0) gives the quarter number directly. Build a label "Q" & that number.',
  data:{A1:"Invoice",B1:"Date",C1:"Amount (₹ L)",D1:"Quarter",
    A2:"INV-001",B2:"2024-08-15",C2:12.5,
    A3:"INV-002",B3:"2024-01-22",C3:8.3,
    A4:"INV-003",B4:"2024-04-01",C4:15.0,
    A5:"INV-004",B5:"2024-11-28",C5:6.7},
  target:"D2",requires:["MONTH(","ROUNDUP("],solution:'="Q"&ROUNDUP(MONTH(B2)/3,0)',
  hint:'MONTH(B2)=8. 8/3=2.67. ROUNDUP(2.67,0)=3. "Q"&3 = "Q3".'};

// ===== DAY (1 exercise) =====

EX.day_payment = {lvl:"easy", title:"Extract payment due day from vendor invoice dates",fn:"DAY",
  concept: YEARMONTHDAY_CONCEPT,
  desc:"AP team needs to check if vendor payments fall on the 1st or 15th (company's two payment run dates). Extract the day-of-month from each due date. If it's not 1 or 15, the payment needs manual scheduling.",
  data:{A1:"Vendor",B1:"Due Date",C1:"Amount (₹ L)",D1:"Day",
    A2:"ABC Supplies",B2:"2024-09-15",C2:8.5,
    A3:"XYZ Logistics",B3:"2024-09-01",C3:12.0,
    A4:"PQR Services",B4:"2024-09-22",C4:5.3,
    A5:"LMN Tech",B5:"2024-09-15",C5:18.7},
  target:"D2",requires:["DAY("],solution:"=DAY(B2)",
  hint:"=DAY(B2) returns 15 from 15-Sep-2024."};

// ===== DAYS (2 exercises) =====

EX.days_receivable = {lvl:"easy", title:"Receivable aging — days since invoice date",fn:"DAYS",
  concept: DAYS_CONCEPT,
  desc:"The collections team needs to flag overdue invoices. Compute how many days old each invoice is by calculating DAYS between today and the invoice date. Invoices over 90 days get escalated to the CFO.",
  data:{A1:"Client",B1:"Invoice Date",C1:"Amount (₹ L)",D1:"Days Old",
    A2:"Tata Motors",B2:"2024-05-10",C2:45.0,
    A3:"Bajaj Auto",B3:"2024-07-22",C3:28.5,
    A4:"M&M",B4:"2024-03-15",C4:12.0,
    A5:"Hero Moto",B5:"2024-08-01",C5:8.7},
  target:"D2",requires:["DAYS(","TODAY("],solution:"=DAYS(TODAY(),B2)",
  hint:"=DAYS(TODAY(), B2) — today minus invoice date. Older invoices have larger numbers."};

EX.days_holding = {lvl:"medium", title:"Stock holding period — STCG vs LTCG classification",fn:"DAYS, IF",
  concept: DAYS_CONCEPT,
  desc:'Indian tax rule: equity held ≥ 365 days qualifies for LTCG (12.5% tax), otherwise STCG (20%). Compute holding days (DAYS between sell date in C2 and buy date in B2), then classify as "LTCG" or "STCG". This determines which tax rate applies when filing ITR.',
  data:{A1:"Scrip",B1:"Buy Date",C1:"Sell Date",D1:"Days Held",E1:"Tax Type",
    A2:"RELIANCE",B2:"2023-03-15",C2:"2024-08-10",
    A3:"TCS",B3:"2024-06-01",C3:"2024-09-15",
    A4:"INFY",B4:"2022-12-20",C4:"2024-07-05",
    A5:"ITC",B5:"2024-04-10",C5:"2024-08-20"},
  target:"D2",requires:["DAYS("],solution:"=DAYS(C2,B2)",
  hint:"=DAYS(C2, B2) — sell date minus buy date. RELIANCE: Mar 2023 to Aug 2024 ≈ 514 days → LTCG."};

// ===== DATE (2 exercises) =====

EX.date_maturity = {lvl:"easy", title:"Compute FD maturity date from issue date + tenure",fn:"DATE, YEAR, MONTH, DAY",
  concept: DATE_CONCEPT,
  desc:"A client opened a 2-year FD on 15-Aug-2024 (B2). Compute the maturity date by adding the tenure (B3 years) to the issue date. Use DATE(YEAR(B2)+B3, MONTH(B2), DAY(B2)) to construct the maturity date.",
  data:{A1:"Metric",B1:"Value",
    A2:"Issue Date",B2:"2024-08-15",
    A3:"Tenure (years)",B3:2,
    A4:"Maturity Date"},
  target:"B4",requires:["DATE(","YEAR(","MONTH(","DAY("],solution:"=DATE(YEAR(B2)+B3,MONTH(B2),DAY(B2))",
  hint:"=DATE(YEAR(B2)+B3, MONTH(B2), DAY(B2)) adds 2 years to 15-Aug-2024 → 15-Aug-2026."};

EX.date_fy_start = {lvl:"medium", title:"Build fiscal year start date from a transaction year",fn:"DATE",
  concept: DATE_CONCEPT,
  desc:'Indian fiscal year starts on April 1. Given a fiscal year label in B2 (e.g., 2024 meaning FY24-25), construct the start date (1-Apr-2024) using DATE. This is useful for DAYS calculations against fiscal year boundaries.',
  data:{A1:"FY Start Year",B1:"FY Start Date",
    A2:2024,A3:2023,A4:2025},
  target:"B2",requires:["DATE("],solution:"=DATE(A2,4,1)",
  hint:"=DATE(A2, 4, 1) — year from A2, month 4 (April), day 1. Gives 1-Apr-2024."};

// ===== TEXT (3 exercises) =====

EX.text_date_label = {lvl:"easy", title:"Format dates as 'MMM-YYYY' for report column headers",fn:"TEXT",
  concept: TEXT_CONCEPT,
  desc:'MIS reports show dates as "Aug-2024", not "2024-08-15". Format the date in B2 using TEXT with the code "MMM-YYYY". This creates clean column headers for monthly P&L reports.',
  data:{A1:"Raw Date",B1:"Report Label",
    A2:"2024-08-15",A3:"2024-09-01",A4:"2024-07-28",A5:"2024-10-05"},
  target:"B2",requires:["TEXT("],solution:'=TEXT(A2,"MMM-YYYY")',
  hint:'=TEXT(A2, "MMM-YYYY") formats the date as "Aug-2024".'};

EX.text_percentage = {lvl:"medium", title:"Format decimal returns as percentage text for a dashboard",fn:"TEXT",
  concept: TEXT_CONCEPT,
  desc:'Your portfolio tracker computes returns as decimals (0.125 = 12.5%). Format them as clean percentage strings like "12.5%" using TEXT with "0.0%". This is for concatenating into summary text — plain numbers can\'t be joined with & cleanly.',
  data:{A1:"Fund",B1:"Return",C1:"Display",
    A2:"HDFC Flexi Cap",B2:0.125,
    A3:"SBI Blue Chip",B3:-0.032,
    A4:"ICICI Pru Value",B4:0.187,
    A5:"Axis Long Term",B5:0.094},
  target:"C2",requires:["TEXT("],solution:'=TEXT(B2,"0.0%")',
  hint:'=TEXT(B2, "0.0%") → "12.5%". The format code handles the ×100 and adds the % sign.'};

EX.text_amount = {lvl:"medium", title:"Format large numbers in Crores for a board presentation",fn:"TEXT, ROUND",
  concept: TEXT_CONCEPT,
  desc:'Board slides show revenue as "₹ 8,750 Cr" not raw numbers. Format the revenue in B2: divide by 100 to get Crores (data is in Lakhs), ROUND to 0 decimals, then TEXT with "#,##0" for comma formatting. Concatenate "₹ " prefix and " Cr" suffix.',
  data:{A1:"Division",B1:"Revenue (₹ Lakhs)",C1:"Board Display",
    A2:"Oil & Gas",B2:875000,
    A3:"Retail",B3:245000,
    A4:"Telecom",B4:198000},
  target:"C2",requires:["TEXT("],
  solution:'="₹ "&TEXT(ROUND(B2/100,0),"#,##0")&" Cr"',
  hint:'Divide by 100 (Lakhs→Cr), ROUND, TEXT for commas, concatenate ₹ and Cr. "₹ 8,750 Cr".'};
