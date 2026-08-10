window.FORMULA_CONFIG = {
  title: 'HLOOKUP',
  targetCell: 'e4',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}, {label:'D'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'',style:'border:none;background:transparent'}, {id:'b1',text:'Q1',cls:'col-a'}, {id:'c1',text:'Q2',cls:'col-a'}, {id:'d1',text:'Q3',cls:'col-a'},
        {spacer:true}, {id:'e1',text:'Lookup'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'Revenue',cls:'col-a'}, {id:'b2',text:'12,400'}, {id:'c2',text:'14,200'}, {id:'d2',text:'13,800'},
        {spacer:true}, {id:'e2',text:'Quarter:'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'COGS',cls:'col-a'}, {id:'b3',text:'7,800'}, {id:'c3',text:'8,900'}, {id:'d3',text:'8,200'},
        {spacer:true}, {id:'e3',text:'Q2',cls:'col-a'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'Margin',cls:'col-a'}, {id:'b4',text:'37%'}, {id:'c4',text:'37.3%'}, {id:'d4',text:'40.6%'},
        {spacer:true}, {id:'e4',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn HLOOKUP — the horizontal version of VLOOKUP. This data is laid out in rows instead of columns, so we search across the top row.",
      speak: "Let's learn H-Lookup — the horizontal version of V-Lookup. This data is laid out in rows instead of columns, so we search across the top row."
    },
    {
      cursor: 'e3', lookupHl: 'e3',
      narrate: 'The task: find the Revenue for Q2. The quarter labels run horizontally across row 1.',
      speak: 'The task: find the Revenue for Q2. The quarter labels run horizontally across row 1.'
    },
    {
      cursor: 'e4',
      formula: '<span class="f-fn">=HLOOKUP(</span><span class="f-ref">E3</span><span class="f-dim">,</span> <span class="f-ref">B1:D4</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span> <span class="f-str">FALSE</span><span class="f-fn">)</span>',
      narrate: 'Same 4 arguments as VLOOKUP: lookup value, table, ROW index (not column!), exact match.',
      speak: 'Same four arguments as V-Lookup: lookup value, table, row index instead of column, and exact match.'
    },
    {
      clear: true,
      cursor: 'b1', highlight: 'b1',
      narrate: 'Excel searches across row 1: B1 = "Q1" — not Q2.',
      speak: 'Excel searches across row 1. B1 is Q1 — not Q2.', postDelay: 300
    },
    {
      clearState: {ids:'b1', state:'searching'},
      cursor: 'c1', found: 'c1',
      narrate: 'C1 = "Q2" — match found!',
      speak: 'C1 is Q2 — match found!'
    },
    {
      cursor: 'c2', resultGlow: 'c2',
      narrate: 'Move down to row 2 (Revenue row) in the same column: 14,200.',
      speak: 'Move down to row 2, the Revenue row, in the same column: fourteen thousand two hundred.'
    },
    {
      float: {from:'c2', to:'e4', text:'14,200'},
      setCellText: {id:'e4', text:'14,200', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e4', cursor: 'e4',
      narrate: 'E4 gets 14,200 — Q2 Revenue found!',
      speak: 'E4 gets fourteen thousand two hundred — Q2 Revenue found!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=HLOOKUP(</span><span class="f-ref">E3</span><span class="f-dim">,</span> <span class="f-ref">B1:D4</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-dim">,</span> <span class="f-str">FALSE</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 14,200</span>',
      narrate: "That's HLOOKUP! Like VLOOKUP but searches horizontally. Use it when your data is arranged in rows — common in financial statements.",
      speak: "That's H-Lookup! Like V-Lookup but searches horizontally. Use it when your data is arranged in rows — common in financial statements."
    }
  ]
};
