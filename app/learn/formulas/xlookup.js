window.FORMULA_CONFIG = {
  title: 'XLOOKUP',
  targetCell: 'e2',

  table: {
    headers: [
      {label:'A'}, {label:'B'}, {label:'C'},
      {spacer:true},
      {label:'E'}
    ],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Ticker',cls:'col-a'}, {id:'b1',text:'Sector'}, {id:'c1',text:'CMP (₹)'},
        {spacer:true},
        {id:'e1',text:'INFY Price'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Oil & Gas'}, {id:'c2',text:'2,450'},
        {spacer:true},
        {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'IT'}, {id:'c3',text:'4,180'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'Banking'}, {id:'c4',text:'1,685'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'IT'}, {id:'c5',text:'1,520'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'SBIN',cls:'col-a'}, {id:'b6',text:'Banking'}, {id:'c6',text:'820'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn XLOOKUP — the modern replacement for VLOOKUP. It's simpler, more flexible, and doesn't require the lookup column to be first.",
      speak: "Let's learn X-Lookup — the modern replacement for V-Lookup. It's simpler, more flexible, and doesn't require the lookup column to be first."
    },
    {
      cursor: 'e1',
      lookupHl: 'e1',
      narrate: 'The task: find the current market price for "INFY" (Infosys). Let\'s write the formula in E2.',
      speak: 'The task: find the current market price for Infosys. Let\'s write the formula in E2.'
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=XLOOKUP(</span><span class="typing-cursor"></span>',
      narrate: 'XLOOKUP takes 3 required arguments: lookup value, lookup array, and return array. Much cleaner than VLOOKUP!',
      speak: 'X-Lookup takes three required arguments: lookup value, lookup array, and return array. Much cleaner than V-Lookup!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=XLOOKUP(</span><span class="f-str">"INFY"</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First: the lookup value — "INFY". What are we searching for?',
      speak: 'First: the lookup value — Infosys. What are we searching for?'
    },
    {
      cursor: 'a2', cursorOx: 8, cursorOy: 8,
      rangeHl: ['a2','a3','a4','a5','a6'],
      formula: '<span class="f-fn">=XLOOKUP(</span><span class="f-str">"INFY"</span><span class="f-dim">,</span> <span class="f-ref">A2:A6</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'Second: the lookup array — A2:A6. This is the column to search through. Unlike VLOOKUP, it\'s just the single column, not the whole table.',
      speak: 'Second: the lookup array — A2 to A6. This is the column to search through. Unlike V-Lookup, it\'s just the single column, not the whole table.',
      preDelay: 400
    },
    {
      cursor: 'c2', cursorOx: 8, cursorOy: 8,
      colHighlight: ['c2','c3','c4','c5','c6'],
      formula: '<span class="f-fn">=XLOOKUP(</span><span class="f-str">"INFY"</span><span class="f-dim">,</span> <span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-fn">)</span>',
      narrate: 'Third: the return array — C2:C6. When a match is found in column A, return the value from the same row in column C. That\'s it — close the bracket!',
      speak: 'Third: the return array — C2 to C6. When a match is found in column A, return the value from the same row in column C. That\'s it — close the bracket!'
    },
    {
      clear: true,
      cursor: 'a2',
      highlight: 'a2',
      narrate: 'Excel searches the lookup array. Row 2: RELIANCE — not INFY.',
      speak: 'Excel searches the lookup array. Row 2: Reliance — not Infosys.',
      postDelay: 200
    },
    {
      clearState: {ids:'a2', state:'searching'},
      cursor: 'a3',
      highlight: 'a3',
      narrate: 'Row 3: TCS — not a match.',
      speak: 'Row 3: T-C-S — not a match.',
      postDelay: 200
    },
    {
      clearState: {ids:'a3', state:'searching'},
      cursor: 'a4',
      highlight: 'a4',
      narrate: 'Row 4: HDFCBANK — not a match.',
      speak: 'Row 4: HDFC Bank — not a match.',
      postDelay: 200
    },
    {
      clearState: {ids:'a4', state:'searching'},
      cursor: 'a5',
      highlight: 'a5',
      narrate: 'Row 5: INFY — match found!',
      speak: 'Row 5: Infosys — match found!',
      preDelay: 400
    },
    {
      clearState: {ids:'a5', state:'searching'},
      found: 'a5',
      cursor: 'c5',
      resultGlow: 'c5',
      narrate: 'Excel goes to the same row in the return array (column C) and finds: 1,520.',
      speak: 'Excel goes to the same row in the return array, column C, and finds: fifteen twenty.'
    },
    {
      float: {from:'c5', to:'e2', text:'1,520'},
      setCellText: {id:'e2', text:'1,520', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2',
      cursor: 'e2',
      narrate: 'The value 1,520 flows into E2. XLOOKUP delivers the result!',
      speak: 'The value fifteen twenty flows into E2. X-Lookup delivers the result!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=XLOOKUP(</span><span class="f-str">"INFY"</span><span class="f-dim">,</span> <span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 1,520</span>',
      narrate: "That's XLOOKUP! Three arguments: what to find, where to search, what to return. It's the modern way — no column counting, no table array, and exact match by default.",
      speak: "That's X-Lookup! Three arguments: what to find, where to search, what to return. It's the modern way — no column counting, no table array, and exact match by default."
    }
  ]
};
