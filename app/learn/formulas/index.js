window.FORMULA_CONFIG = {
  title: 'INDEX + MATCH',
  targetCell: 'e2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Ticker',cls:'col-a'}, {id:'b1',text:'Sector'}, {id:'c1',text:'CMP (₹)'},
        {spacer:true}, {id:'e1',text:'TCS Price'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Oil & Gas'}, {id:'c2',text:'2,450'},
        {spacer:true}, {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'IT'}, {id:'c3',text:'4,180'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'Banking'}, {id:'c4',text:'1,685'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'IT'}, {id:'c5',text:'1,520'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn INDEX+MATCH — the power combo that replaces VLOOKUP. MATCH finds the row, INDEX returns the value. More flexible and faster.",
      speak: "Let's learn INDEX plus MATCH — the power combo that replaces V-Lookup. MATCH finds the row, INDEX returns the value. More flexible and faster."
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=INDEX(</span><span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-fn">MATCH(</span><span class="f-str">"TCS"</span><span class="f-dim">,</span> <span class="f-ref">A2:A5</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">))</span>',
      narrate: 'The formula nests MATCH inside INDEX. Let\'s break it down — MATCH runs first.',
      speak: 'The formula nests MATCH inside INDEX. Let\'s break it down — MATCH runs first.'
    },
    {
      rangeHl: ['a2','a3','a4','a5'],
      narrate: 'MATCH("TCS", A2:A5, 0) — searches for "TCS" in column A. The 0 means exact match.',
      speak: 'MATCH of T-C-S in A2 to A5, zero — searches for T-C-S in column A. The zero means exact match.'
    },
    {
      clear: true, cursor: 'a2', highlight: 'a2',
      narrate: 'Row 1 of range: RELIANCE — not TCS.',
      speak: 'Row 1 of range: Reliance — not T-C-S.', postDelay: 200
    },
    {
      clearState: {ids:'a2', state:'searching'}, cursor: 'a3', found: 'a3',
      narrate: 'Row 2 of range: TCS — found! MATCH returns 2 (the position within the range).',
      speak: 'Row 2 of range: T-C-S — found! MATCH returns 2, the position within the range.'
    },
    {
      colHighlight: ['c2','c3','c4','c5'],
      formula: '<span class="f-fn">=INDEX(</span><span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-fn">)</span>',
      narrate: 'Now INDEX(C2:C5, 2) — go to the 2nd row of column C. That\'s C3 = 4,180.',
      speak: 'Now INDEX of C2 to C5, 2 — go to the second row of column C. That\'s C3: four thousand one hundred eighty.'
    },
    {
      clear: true, cursor: 'c3', resultGlow: 'c3', found: 'a3',
      narrate: 'INDEX picks C3: 4,180 — the CMP for TCS.',
      speak: 'INDEX picks C3: four thousand one hundred eighty — the C-M-P for T-C-S.'
    },
    {
      float: {from:'c3', to:'e2', text:'4,180'},
      setCellText: {id:'e2', text:'4,180', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2', cursor: 'e2',
      narrate: 'E2 gets 4,180 — TCS current price found!',
      speak: 'E2 gets four thousand one hundred eighty — T-C-S current price found!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=INDEX(</span><span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-fn">MATCH(</span><span class="f-str">"TCS"</span><span class="f-dim">,</span> <span class="f-ref">A2:A5</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">))</span> <span style="color:var(--green);font-weight:600">→ 4,180</span>',
      narrate: "That's INDEX+MATCH! MATCH finds the position, INDEX retrieves from that position. It can look left, right, any direction — VLOOKUP can't do that.",
      speak: "That's INDEX plus MATCH! MATCH finds the position, INDEX retrieves from that position. It can look left, right, any direction — V-Lookup can't do that."
    }
  ]
};
