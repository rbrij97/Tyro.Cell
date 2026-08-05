/* ================================================================
   TEXT CLEANUP — TRIM, LEFT, RIGHT, MID, LEN, FIND, SUBSTITUTE
   Currently: 0 exercises each. All in engine.
   Every exercise is a mini case study — a real analyst situation.
   ================================================================ */

const TRIM_CONCEPT = "<p><b class='term'>TRIM</b> removes extra spaces from text — leading, trailing, and double spaces between words collapse to single spaces.</p><span class='formula'>=TRIM(text)</span><p>Finance use: data pasted from Bloomberg, Capital IQ, or PDFs often has invisible spaces that break VLOOKUPs. TRIM is the first fix.</p>";

const LEFTRIGHT_CONCEPT = "<p><b class='term'>LEFT</b> extracts the first N characters. <b class='term'>RIGHT</b> extracts the last N. <b class='term'>MID</b> extracts from any position.</p><span class='formula'>=LEFT(text, num_chars)<br>=RIGHT(text, num_chars)<br>=MID(text, start_pos, num_chars)</span><p>Finance use: parse ISINs, split exchange:ticker codes, extract year from period labels, pull account codes from GL strings.</p>";

const LEN_CONCEPT = "<p><b class='term'>LEN</b> returns the number of characters in a text string, including spaces.</p><span class='formula'>=LEN(text)</span><p>Finance use: validate ISIN length (must be 12), detect hidden trailing spaces that break lookups, check PAN/GSTIN format.</p>";

const FIND_CONCEPT = "<p><b class='term'>FIND</b> returns the position of one text string inside another (case-sensitive). Returns #VALUE! if not found.</p><span class='formula'>=FIND(find_text, within_text, [start_num])</span><p>Finance use: locate delimiters in raw data to split fields — the colon in 'NSE:RELIANCE', the hyphen in account codes, the space in 'First Last'.</p>";

const SUBSTITUTE_CONCEPT = "<p><b class='term'>SUBSTITUTE</b> replaces all occurrences of one text string with another inside a cell.</p><span class='formula'>=SUBSTITUTE(text, old_text, new_text)</span><p>Finance use: remove commas from Indian number format ('1,25,000' → '125000'), strip currency symbols from pasted data, clean Bloomberg ticker suffixes (.NS, .BO).</p>";

// ===== TRIM (2 exercises) =====

EX.trim_broken_lookup = {lvl:"easy", title:"Bloomberg paste broke your VLOOKUP — fix with TRIM",fn:"TRIM",
  concept: TRIM_CONCEPT,
  desc:"You pasted tickers from Bloomberg into F2:F4 but they came with extra spaces. Your VLOOKUP in G2 returns #N/A because '  TCS ' doesn't match 'TCS' in the master list. Fix the lookup by wrapping the lookup value in TRIM.",
  data:{A1:"Ticker",B1:"CMP (₹)",
    A2:"RELIANCE",B2:2450,A3:"TCS",B3:4180,A4:"HDFCBANK",B4:1685,
    A5:"INFY",B5:1520,A6:"SBIN",B6:820,
    E1:"Portfolio",F1:"Ticker (raw)",G1:"CMP (₹)",
    F2:"  TCS "},
  target:"G2",requires:["TRIM(","VLOOKUP("],solution:"=VLOOKUP(TRIM(F2),A2:B6,2,FALSE)",
  hint:"Wrap TRIM around the lookup value: =VLOOKUP(TRIM(F2), table, 2, FALSE)."};

EX.trim_name_cleanup = {lvl:"medium", title:"Clean fund names from Capital IQ export for a pitch book",fn:"TRIM",
  concept: TRIM_CONCEPT,
  desc:"Your associate pulled mutual fund names from Capital IQ but they have messy spacing: '  HDFC   Top  100  Fund  '. The MD wants clean names for a pitch deck table. TRIM each name — it removes leading/trailing spaces AND collapses double spaces to single.",
  data:{A1:"Raw fund name",B1:"Clean name",
    A2:"  HDFC   Top  100  Fund  ",A3:" SBI   Blue Chip   Fund",A4:"  ICICI  Pru  Value  Discovery  "},
  target:"B2",requires:["TRIM("],solution:"=TRIM(A2)",
  hint:"TRIM handles all three problems: leading spaces, trailing spaces, and double spaces between words."};

// ===== LEFT + RIGHT (3 exercises) =====

EX.left_exchange = {lvl:"easy", title:"Extract exchange code from BSE/NSE feed",fn:"LEFT",
  concept: LEFTRIGHT_CONCEPT,
  desc:"Your data feed formats tickers as 'NSE:RELIANCE', 'BSE:TCS'. The trading desk needs a pivot by exchange. Extract the exchange code (first 3 characters) from each cell in A2. This works because NSE and BSE are both exactly 3 letters.",
  data:{A1:"Feed ticker",B1:"Exchange",
    A2:"NSE:RELIANCE",A3:"BSE:TCS",A4:"NSE:INFY",A5:"BSE:SBIN",A6:"NSE:HDFCBANK"},
  target:"B2",requires:["LEFT("],solution:"=LEFT(A2,3)",
  hint:"Exchange code is always the first 3 characters: =LEFT(A2,3)."};

EX.right_quarter = {lvl:"easy", title:"Extract quarter label from reporting period codes",fn:"RIGHT",
  concept: LEFTRIGHT_CONCEPT,
  desc:"FP&A reports use period codes like 'FY24Q1', 'FY24Q2'. You need to group data by quarter (Q1, Q2, Q3, Q4) regardless of year. Extract the last 2 characters from each code.",
  data:{A1:"Period code",B1:"Quarter",
    A2:"FY24Q1",A3:"FY24Q2",A4:"FY25Q3",A5:"FY25Q4",A6:"FY24Q3"},
  target:"B2",requires:["RIGHT("],solution:"=RIGHT(A2,2)",
  hint:"Last 2 characters of 'FY24Q1' = 'Q1': =RIGHT(A2,2)."};

EX.left_fy_classify = {lvl:"medium", title:"Split period codes into year + quarter for a pivot",fn:"LEFT, RIGHT",
  concept: LEFTRIGHT_CONCEPT,
  desc:"Revenue data has period codes in A2:A5. The CFO wants a pivot table by fiscal year AND quarter. Extract the fiscal year (first 4 chars) into B2 using LEFT. The quarter column (RIGHT) is already done for reference — write B2 only.",
  data:{A1:"Period",B1:"Fiscal Year",C1:"Quarter",
    A2:"FY24Q1",C2:"Q1",A3:"FY24Q2",C3:"Q2",A4:"FY25Q1",C4:"Q1",A5:"FY25Q3",C5:"Q3"},
  target:"B2",requires:["LEFT("],solution:"=LEFT(A2,4)",
  hint:"First 4 characters of 'FY24Q1' = 'FY24': =LEFT(A2,4)."};

// ===== MID (2 exercises) =====

EX.mid_isin_country = {lvl:"medium", title:"Extract country code from ISIN for compliance tagging",fn:"MID",
  concept: LEFTRIGHT_CONCEPT,
  desc:"Compliance needs every holding tagged with its country of domicile. ISINs encode this: first 2 characters are the country code (IN=India, US=USA, GB=UK). But your data has 'ISIN:' prefix, so the actual ISIN starts at position 6. Use MID to extract 2 characters starting at position 6.",
  data:{A1:"ISIN field",B1:"Country",
    A2:"ISIN:INE002A01018",A3:"ISIN:US0378331005",A4:"ISIN:GB00B03MLX29",A5:"ISIN:INE009A01021"},
  target:"B2",requires:["MID("],solution:"=MID(A2,6,2)",
  hint:"MID(text, start, length). 'ISIN:' = 5 chars, so ISIN starts at 6. Country = 2 chars: =MID(A2,6,2)."};

EX.mid_find_ticker = {lvl:"hard", title:"Parse ticker from 'Exchange:Ticker' using MID+FIND",fn:"MID, FIND, LEN",
  concept: LEFTRIGHT_CONCEPT,
  desc:"Your data feed has 'NSE:RELIANCE', 'BSE:TCS' format. You need just the ticker for a VLOOKUP against your master list. The exchange prefix length varies (could be 3 or 4 chars for future exchanges). Use FIND to locate ':' dynamically, then MID to extract everything after it. Formula: =MID(A2, FIND(\":\",A2)+1, LEN(A2)-FIND(\":\",A2)).",
  data:{A1:"Feed code",B1:"Ticker",
    A2:"NSE:RELIANCE",A3:"BSE:TCS",A4:"NSE:HDFCBANK",A5:"BSE:INFY"},
  target:"B2",requires:["MID(","FIND("],solution:'=MID(A2,FIND(":",A2)+1,LEN(A2)-FIND(":",A2))',
  hint:'FIND(":",A2) = 4. Start at 5, take LEN(A2)-4 characters. This works for any prefix length.'};

// ===== LEN (2 exercises) =====

EX.len_isin_validate = {lvl:"easy", title:"Validate ISIN format — must be exactly 12 characters",fn:"LEN",
  concept: LEN_CONCEPT,
  desc:"Before submitting a trade file, compliance requires every ISIN to be exactly 12 characters. Check the length of each ISIN. Row 3 has an invalid one (11 chars) — your LEN formula should expose it.",
  data:{A1:"ISIN",B1:"Length",C1:"Valid?",
    A2:"INE002A01018",A3:"INE009A0102",A4:"US0378331005",A5:"INE154A01025"},
  target:"B2",requires:["LEN("],solution:"=LEN(A2)",
  hint:"=LEN(A2) counts every character. Valid ISINs show 12."};

EX.len_hidden_spaces = {lvl:"medium", title:"Detect hidden spaces killing your VLOOKUP",fn:"LEN, TRIM",
  concept: LEN_CONCEPT,
  desc:"Your VLOOKUP returns #N/A but the ticker looks correct. Use LEN to check — 'TCS' should be 3 characters. If LEN shows more, there are hidden spaces. Write LEN(A2) in B2 to check, and LEN(TRIM(A2)) in C2 to compare. The difference reveals the invisible spaces.",
  data:{A1:"Ticker",B1:"Raw length",C1:"Trimmed length",
    A2:"TCS  ",A3:"RELIANCE",A4:" INFY "},
  target:"B2",requires:["LEN("],solution:"=LEN(A2)",
  hint:"=LEN(A2) — if this shows 5 instead of 3, you have hidden spaces. Compare with =LEN(TRIM(A2))."};

// ===== FIND (1 exercise) =====

EX.find_separator = {lvl:"medium", title:"Locate the delimiter position for a dynamic text split",fn:"FIND",
  concept: FIND_CONCEPT,
  desc:'Account codes from the ERP use format "DEPT-ACCT" (e.g., "FIN-4100", "MKT-5200"). To split department from account, first find the position of "-". FIND returns the character position — you\'ll use this number in LEFT and MID formulas next.',
  data:{A1:"GL code",B1:"Dash position",
    A2:"FIN-4100",A3:"MKT-5200",A4:"OPS-6300",A5:"HR-7100"},
  target:"B2",requires:["FIND("],solution:'=FIND("-",A2)',
  hint:'FIND("-", A2) returns 4 for "FIN-4100" — the dash is the 4th character.'};

// ===== SUBSTITUTE (3 exercises) =====

EX.sub_indian_number = {lvl:"easy", title:"Remove commas from Indian-format numbers for calculations",fn:"SUBSTITUTE",
  concept: SUBSTITUTE_CONCEPT,
  desc:"AR team pasted invoice amounts from Tally: '1,25,000', '45,00,000'. Excel treats these as text, not numbers — SUM won't work. Remove all commas with SUBSTITUTE so the values become calculable. Note: the result will still be text until you multiply by 1 or wrap in VALUE, but the commas are gone.",
  data:{A1:"Tally amount",B1:"Clean",
    A2:"1,25,000",A3:"45,00,000",A4:"8,50,000",A5:"12,75,000"},
  target:"B2",requires:["SUBSTITUTE("],solution:'=SUBSTITUTE(A2,",","")',
  hint:'=SUBSTITUTE(A2, ",", "") — replaces every comma with nothing.'};

EX.sub_bloomberg = {lvl:"medium", title:"Strip Bloomberg suffixes for cross-referencing",fn:"SUBSTITUTE",
  concept: SUBSTITUTE_CONCEPT,
  desc:'Bloomberg tickers have exchange suffixes: "RELIANCE.NS" (NSE), "TCS.NS". Your internal master list uses plain tickers ("RELIANCE", "TCS"). Strip ".NS" from each ticker so VLOOKUPs will match.',
  data:{A1:"Bloomberg ticker",B1:"Clean ticker",
    A2:"RELIANCE.NS",A3:"TCS.NS",A4:"HDFCBANK.NS",A5:"INFY.NS",A6:"SBIN.NS"},
  target:"B2",requires:["SUBSTITUTE("],solution:'=SUBSTITUTE(A2,".NS","")',
  hint:'=SUBSTITUTE(A2, ".NS", "") removes the suffix entirely.'};

EX.sub_double_clean = {lvl:"hard", title:"Double SUBSTITUTE — strip ₹ and commas from pasted report data",fn:"SUBSTITUTE",
  concept: SUBSTITUTE_CONCEPT,
  desc:'The annual report PDF paste gave you "₹2,450" in every cell. You need plain numbers for your model. Nest two SUBSTITUTEs: one to remove "₹", one to remove commas. Either order works — SUBSTITUTE is not destructive, it just replaces text.',
  data:{A1:"Report paste",B1:"Clean number",
    A2:"₹2,450",A3:"₹1,685",A4:"₹4,180",A5:"₹12,400"},
  target:"B2",requires:["SUBSTITUTE(","SUBSTITUTE("],solution:'=SUBSTITUTE(SUBSTITUTE(A2,"₹",""),",","")',
  hint:'Nest: =SUBSTITUTE(SUBSTITUTE(A2,"₹",""), ",", ""). Inner removes ₹, outer removes commas.'};
