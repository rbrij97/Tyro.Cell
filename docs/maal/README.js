/* ================================================================
   MAAL — Formula Drill Library
   ================================================================

   This folder contains all new exercise definitions in the exact
   EX object format used by app/index.html. When ready to add to
   the app, copy the EX.xxx definitions into the EX={} block and
   add the exercise IDs to the COURSES modules array.

   FORMAT REFERENCE (from app/index.html):
   -----------------------------------------------
   EX.exercise_id = {
     lvl:     "easy" | "medium" | "hard",
     title:   "Display title",
     fn:      "FUNCTION_NAME",
     concept: CONCEPT_CONSTANT,           // HTML string for concept panel
     desc:    "Task description for user",
     data:    {A1:"Header", B1:"Value", ...},  // cell → value map
     target:  "B10",                       // cell user writes formula in
     requires:["VLOOKUP("],               // substrings formula must contain
     solution:"=VLOOKUP(F2,A2:B7,2,FALSE)", // canonical correct answer
     hint:    "One-line hint"
   };

   NAMING CONVENTION:
   - exercise IDs: functionname_descriptor (e.g. vlookup_cmp, iferror_div)
   - files: tier{N}-{function}.js

   ================================================================
   COMPLETE FILE INDEX
   ================================================================

   TIER 1 — Lookups & multi-criteria aggregation (28 exercises)
   ─────────────────────────────────────────────────────────────
   tier1-vlookup.js          VLOOKUP           6   (2E, 2M, 2H)
   tier1-xlookup.js          XLOOKUP           6   (2E, 2M, 2H)
   tier1-indexmatch.js       INDEX+MATCH       6   (2E, 2M, 2H)
   tier1-iferror.js          IFERROR           4   (2E, 1M, 1H)
   tier1-countifs.js         COUNTIFS          3   (1E, 1M, 1H)
   tier1-averageifs.js       AVERAGEIFS        3   (1E, 1M, 1H)

   TIER 2 — Text cleanup, logic, horizontal lookup (24 exercises)
   ─────────────────────────────────────────────────────────────
   tier2-text-cleanup.js     TRIM, LEFT, RIGHT,
                             MID, LEN, FIND,
                             SUBSTITUTE       14   (5E, 5M, 4H)
   tier2-abs-and-or-hlookup.js  ABS, AND, OR,
                             HLOOKUP          10   (3E, 4M, 3H)

   TIER 3 — Finance rewrites of generic exercises (16 exercises)
   ─────────────────────────────────────────────────────────────
   tier3-if-rewrites.js      IF, nested IF,
                             COUNTIF, SUMIF,
                             ROUND, CONCAT,
                             COUNT, COUNTA    16   (5E, 5M, 6H)

   TIER 4 — Remaining engine-ready functions (48 exercises)
   ─────────────────────────────────────────────────────────────
   tier4-power-cagr.js       POWER (CAGR)      4   (1E, 2M, 1H)
   tier4-rounding.js         ROUNDUP, ROUNDDOWN 4  (2E, 2M)
   tier4-case-textjoin.js    UPPER, LOWER,
                             PROPER, TEXTJOIN  7   (4E, 3M)
   tier4-dates.js            TODAY, YEAR, MONTH,
                             DAY, DAYS, DATE,
                             TEXT             13   (5E, 6M, 2H)
   tier4-math.js             MOD, INT, SQRT,
                             PRODUCT           7   (2E, 2M, 3H)
   tier4-stats.js            MEDIAN, MIN, MAX,
                             AVERAGEIF         6   (3E, 3M)
   tier4-logic-types.js      NOT, ISNUMBER,
                             ISBLANK,
                             COUNTBLANK        7   (3E, 3M, 1H)

   ════════════════════════════════════════════════════════════
   GRAND TOTAL: 116 exercises across 13 files
   ════════════════════════════════════════════════════════════

   FUNCTIONS COVERED (38 unique):
   VLOOKUP, XLOOKUP, INDEX, MATCH, IFERROR, COUNTIFS, AVERAGEIFS,
   TRIM, LEFT, RIGHT, MID, LEN, FIND, SUBSTITUTE,
   ABS, AND, OR, HLOOKUP,
   IF (incl. nested), COUNTIF, SUMIF, ROUND, CONCAT/&, COUNT, COUNTA,
   POWER, ROUNDUP, ROUNDDOWN, UPPER, LOWER, PROPER, TEXTJOIN,
   TODAY, YEAR, MONTH, DAY, DAYS, DATE, TEXT,
   MOD, INT, SQRT, PRODUCT, MEDIAN, MIN, MAX, AVERAGEIF,
   NOT, ISNUMBER, ISBLANK, COUNTBLANK

   ENGINE FUNCTIONS WITHOUT EXERCISES (intentionally skipped):
   - SUM, AVERAGE: existing generic exercises in app are sufficient
   - PI, RAND, RANDBETWEEN: no clear finance scenario
   - NOW: near-identical to TODAY
   - CONCATENATE: covered by CONCAT/& exercises
   - ISTEXT: covered indirectly via ISNUMBER
   - SUMIFS: covered by SUMIF + COUNTIFS pattern (similar syntax)

   ================================================================ */
