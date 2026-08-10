window.FORMULA_CONFIG = {
  title: 'VLOOKUP',
  targetCell: 'f2',

  table: {
    headers: [
      {label:'A'}, {label:'B'}, {label:'C'},
      {spacer:true},
      {label:'E'}, {label:'F'}
    ],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Ticker',cls:'col-a'}, {id:'b1',text:'CMP (₹)'}, {id:'c1',text:'P/E'},
        {spacer:true},
        {id:'e1',text:'Search',cls:'col-a'}, {id:'f1',text:'Result'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'2,450'}, {id:'c2',text:'25.3'},
        {spacer:true},
        {id:'e2',text:'HDFCBANK',cls:'col-a'}, {id:'f2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'4,180'}, {id:'c3',text:'28.7'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'1,685'}, {id:'c4',text:'18.4'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'1,520'}, {id:'c5',text:'24.6'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'SBIN',cls:'col-a'}, {id:'b6',text:'820'}, {id:'c6',text:'9.4'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}, {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    // 0: Intro
    {
      hideCursor: true,
      narrate: "Let's learn VLOOKUP — the most-used lookup function in Excel. You have a ticker master with stock prices, and you need to pull a specific stock's CMP.",
      speak: "Let's learn V-Lookup — the most used lookup function in Excel. You have a ticker master with stock prices, and you need to pull a specific stock's C-M-P."
    },
    // 1: Show the question
    {
      cursor: 'e2',
      lookupHl: 'e2',
      narrate: 'The task: look up "HDFCBANK" from cell E2 and find its current market price from the table on the left.',
      speak: 'The task: look up HDFC Bank from cell E2, and find its current market price from the table on the left.',
      preDelay: 600
    },
    // 2: Start formula — function name
    {
      cursor: 'f2',
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="typing-cursor"></span>',
      narrate: 'Click on cell F2 and start typing the formula. VLOOKUP takes 4 arguments.',
      speak: 'Click on cell F2 and start typing the formula. V-Lookup takes four arguments.'
    },
    // 3: Arg 1 — lookup value
    {
      cursor: 'e2',
      lookupHl: 'e2',
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First argument: the lookup value. Click cell E2 — that\'s "HDFCBANK", the ticker we\'re searching for.',
      speak: 'First argument: the lookup value. Click cell E2 — that\'s HDFC Bank, the ticker we\'re searching for.'
    },
    // 4: Arg 2 — table array
    {
      cursor: 'a2', cursorOx: 8, cursorOy: 8,
      rangeHl: ['a2','b2','c2','a3','b3','c3','a4','b4','c4','a5','b5','c5','a6','b6','c6'],
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span> <span class="f-ref">A2:C6</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'Second: the table array. Select A2 to C6 — the entire data table. The lookup column must be the FIRST column of this range.',
      speak: 'Second: the table array. Select A2 to C6 — the entire data table. The lookup column must always be the first column of this range.',
      preDelay: 400
    },
    // 5: Arg 3 — column index
    {
      cursor: 'b1',
      colHighlight: ['b2','b3','b4','b5','b6'],
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span> <span class="f-ref">A2:C6</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'Third: column index number. We want CMP, which is column B — the 2nd column in our range A to C. So we type 2.',
      speak: 'Third: column index number. We want C-M-P, which is column B — the second column in our range A to C. So we type 2.'
    },
    // 6: Arg 4 — FALSE
    {
      hideCursor: true,
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span> <span class="f-ref">A2:C6</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span> <span class="f-str">FALSE</span><span class="f-fn">)</span>',
      narrate: 'Fourth: FALSE for exact match. This tells Excel to find the EXACT ticker, not an approximate one. You\'ll use FALSE 99% of the time.',
      speak: 'Fourth: FALSE for exact match. This tells Excel to find the exact ticker, not an approximate one. You\'ll use FALSE ninety-nine percent of the time.'
    },
    // 7: Search begins
    {
      clear: true,
      lookupHl: 'e2',
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span> <span class="f-ref">A2:C6</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span> <span class="f-str">FALSE</span><span class="f-fn">)</span>',
      narrate: 'Now press Enter. Excel starts searching down column A, comparing each cell to "HDFCBANK"...',
      speak: 'Now press Enter. Excel starts searching down column A, comparing each cell to HDFC Bank.'
    },
    // 8: Row 2 — RELIANCE
    {
      cursor: 'a2',
      highlight: 'a2',
      narrate: 'Row 2: RELIANCE — not a match.',
      speak: 'Row 2: Reliance. Not a match.',
      postDelay: 300
    },
    // 9: Row 3 — TCS
    {
      clearState: {ids:'a2', state:'searching'},
      cursor: 'a3',
      highlight: 'a3',
      narrate: 'Row 3: TCS — not a match.',
      speak: 'Row 3: T-C-S. Not a match.',
      postDelay: 300
    },
    // 10: Row 4 — HDFCBANK — FOUND!
    {
      clearState: {ids:'a3', state:'searching'},
      cursor: 'a4',
      highlight: 'a4',
      narrate: 'Row 4: HDFCBANK — match found!',
      speak: 'Row 4: HDFC Bank — match found!',
      preDelay: 500
    },
    // 11: Move to column 2
    {
      clearState: {ids:'a4', state:'searching'},
      found: 'a4',
      cursor: 'b4',
      resultGlow: 'b4',
      narrate: 'Excel moves across to column 2 — the CMP column — and finds the value: 1,685.',
      speak: 'Excel moves across to column 2 — the C-M-P column — and finds the value: sixteen eighty-five.'
    },
    // 12: Float value to result
    {
      float: {from:'b4', to:'f2', text:'1,685'},
      setCellText: {id:'f2', text:'1,685', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'f2',
      cursor: 'f2',
      narrate: 'The value 1,685 flows back to cell F2. VLOOKUP returns the answer!',
      speak: 'The value sixteen eighty-five flows back to cell F2. V-Lookup returns the answer!'
    },
    // 13: Recap
    {
      hideCursor: true,
      formula: '<span class="f-fn">=VLOOKUP(</span><span class="f-ref">E2</span><span class="f-dim">,</span> <span class="f-ref">A2:C6</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span> <span class="f-str">FALSE</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 1,685</span>',
      narrate: 'That\'s VLOOKUP! Lookup value, table range (search column first), column number to return, and FALSE for exact match. Now go practice it!',
      speak: "That's V-Lookup! Lookup value, table range with the search column first, column number to return, and FALSE for exact match. Now go practice it!"
    }
  ]
};
