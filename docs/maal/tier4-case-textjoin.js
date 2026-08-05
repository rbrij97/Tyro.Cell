/* ================================================================
   UPPER, LOWER, PROPER, TEXTJOIN — Text case & joining
   Data presentation and cleanup for reports, filings, emails.
   ================================================================ */

const UPPER_CONCEPT = "<p><b class='term'>UPPER</b> converts all text to UPPERCASE.</p><span class='formula'>=UPPER(text)</span><p>Finance use: standardize ticker symbols, format regulatory filings (BSE/SEBI require uppercase), normalize data before VLOOKUP (case mismatch causes #N/A).</p>";

const LOWER_CONCEPT = "<p><b class='term'>LOWER</b> converts all text to lowercase.</p><span class='formula'>=LOWER(text)</span><p>Finance use: generate email addresses from employee names, create system usernames, normalize text for comparison where case shouldn't matter.</p>";

const PROPER_CONCEPT = "<p><b class='term'>PROPER</b> capitalizes the first letter of each word, lowercases the rest.</p><span class='formula'>=PROPER(text)</span><p>Finance use: clean client names from ALL-CAPS KYC forms, format company names for presentation, fix inconsistent capitalization in imported data.</p>";

const TEXTJOIN_CONCEPT = "<p><b class='term'>TEXTJOIN</b> joins text from multiple cells with a delimiter between them. The second argument (ignore_empty) skips blank cells when TRUE.</p><span class='formula'>=TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)</span><p>Finance use: build comma-separated watchlists, create compound descriptions, assemble multi-part reference codes. More powerful than & for joining many cells.</p>";

// ===== UPPER (2 exercises) =====

EX.upper_ticker = {lvl:"easy", title:"Standardize tickers to uppercase for VLOOKUP matching",fn:"UPPER",
  concept: UPPER_CONCEPT,
  desc:'Your intern entered tickers in mixed case: "Reliance", "tcs", "Hdfc". Your master list has them in uppercase. Before running VLOOKUPs, standardize each ticker to uppercase. Convert A2 to uppercase in B2.',
  data:{A1:"Raw Ticker",B1:"Standard Ticker",
    A2:"Reliance",A3:"tcs",A4:"Hdfc Bank",A5:"infy",A6:"Sbin"},
  target:"B2",requires:["UPPER("],solution:"=UPPER(A2)",
  hint:'=UPPER(A2) converts "Reliance" to "RELIANCE".'};

EX.upper_vlookup = {lvl:"medium", title:"Case-proof VLOOKUP — wrap lookup value in UPPER",fn:"UPPER, VLOOKUP",
  concept: UPPER_CONCEPT,
  desc:'Instead of cleaning data first, make your VLOOKUP case-insensitive by wrapping the lookup value in UPPER. The master list (A2:B7) has uppercase tickers. The search ticker in F2 might be any case. Pull the CMP using VLOOKUP with UPPER on the lookup value.',
  data:{A1:"Ticker",B1:"CMP (₹)",
    A2:"RELIANCE",B2:2450,A3:"TCS",B3:4180,A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:1520,A6:"SBIN",B6:820,A7:"ITC",B7:460,
    E1:"Search",F1:"Ticker",F2:"reliance",F3:"CMP (₹)"},
  target:"F4",requires:["UPPER(","VLOOKUP("],solution:"=VLOOKUP(UPPER(F2),A2:B7,2,FALSE)",
  hint:'UPPER("reliance") → "RELIANCE", then VLOOKUP finds it in the master list.'};

// ===== LOWER (1 exercise) =====

EX.lower_email = {lvl:"easy", title:"Generate employee email IDs from names",fn:"LOWER",
  concept: LOWER_CONCEPT,
  desc:'HR needs to create email addresses in the format firstname.lastname@company.com. Names are in mixed case. First step: convert the full name to lowercase. Write LOWER(A2) — the full email formula would be more complex, but this is the building block.',
  data:{A1:"Employee Name",B1:"Lowercase",
    A2:"Priya Sharma",A3:"Rahul Krishnamurthy",A4:"Meera Joshi",A5:"Arjun Patel"},
  target:"B2",requires:["LOWER("],solution:"=LOWER(A2)",
  hint:'=LOWER(A2) converts "Priya Sharma" to "priya sharma".'};

// ===== PROPER (2 exercises) =====

EX.proper_kyc = {lvl:"easy", title:"Fix ALL-CAPS client names from KYC system for relationship reports",fn:"PROPER",
  concept: PROPER_CONCEPT,
  desc:'The KYC database stores names in ALL CAPS: "PRIYA SHARMA", "RAHUL KRISHNAMURTHY". For the quarterly relationship review letter, the wealth manager needs them in proper case: "Priya Sharma". Convert each name using PROPER.',
  data:{A1:"KYC Name",B1:"Letter Name",
    A2:"PRIYA SHARMA",A3:"RAHUL KRISHNAMURTHY",A4:"MEERA JOSHI",A5:"ARJUN PATEL GUPTA"},
  target:"B2",requires:["PROPER("],solution:"=PROPER(A2)",
  hint:'=PROPER(A2) converts "PRIYA SHARMA" to "Priya Sharma".'};

EX.proper_company = {lvl:"medium", title:"Clean inconsistent company names for a pitch book",fn:"PROPER, UPPER, IF, LEN",
  concept: PROPER_CONCEPT,
  desc:'Your data has company names in random case: "tata steel", "BAJAJ FINANCE", "hdfc Bank". For the investment banking pitch book, all names should be in Proper Case. Apply PROPER to A2.',
  data:{A1:"Raw Name",B1:"Pitch Book Name",
    A2:"tata steel",A3:"BAJAJ FINANCE",A4:"hdfc Bank",A5:"INDIAN OIL CORP"},
  target:"B2",requires:["PROPER("],solution:"=PROPER(A2)",
  hint:'=PROPER(A2) converts "tata steel" to "Tata Steel" — first letter of each word capitalized.'};

// ===== TEXTJOIN (2 exercises) =====

EX.textjoin_watchlist = {lvl:"easy", title:"Build a comma-separated ticker watchlist for trading terminal",fn:"TEXTJOIN",
  concept: TEXTJOIN_CONCEPT,
  desc:'The dealer needs a single comma-separated string of tickers to paste into the Bloomberg terminal watchlist. Join all tickers in A2:A6 with ", " as separator. TEXTJOIN does this in one formula instead of chaining A2&", "&A3&....',
  data:{A1:"Ticker",
    A2:"RELIANCE",A3:"TCS",A4:"HDFCBANK",A5:"INFY",A6:"SBIN",
    A8:"Watchlist string"},
  target:"B8",requires:["TEXTJOIN("],solution:'=TEXTJOIN(", ",TRUE,A2:A6)',
  hint:'=TEXTJOIN(", ", TRUE, A2:A6) → "RELIANCE, TCS, HDFCBANK, INFY, SBIN".'};

EX.textjoin_skip_blanks = {lvl:"medium", title:"Build sector summary skipping empty cells",fn:"TEXTJOIN",
  concept: TEXTJOIN_CONCEPT,
  desc:'A portfolio has some stocks with sector tags and others blank (pending classification). Build a unique sector list separated by " | " using TEXTJOIN, skipping blanks. Set ignore_empty to TRUE so blank cells don\'t create ugly double separators.',
  data:{A1:"Ticker",B1:"Sector",
    A2:"RELIANCE",B2:"Energy",A3:"TCS",B3:"IT",A4:"HDFCBANK",B4:"Banks",
    A5:"STARTUP1",B5:"",A6:"INFY",B6:"IT",A7:"NEWCO",B7:"",
    A9:"Sectors covered"},
  target:"B9",requires:["TEXTJOIN("],solution:'=TEXTJOIN(" | ",TRUE,B2:B7)',
  hint:'=TEXTJOIN(" | ", TRUE, B2:B7) — TRUE skips the empty cells. Result: "Energy | IT | Banks | IT".'};
