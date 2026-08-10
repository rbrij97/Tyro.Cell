window.FORMULA_CONFIG = {
  title: 'SUBSTITUTE',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Raw Ticker',cls:'col-a'}, {id:'b1',text:'Clean Ticker'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'NSE:RELIANCE',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'NSE:HDFCBANK',cls:'col-a'}, {id:'b3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'NSE:TCS',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn SUBSTITUTE — it replaces text within a string. These tickers have an \"NSE:\" prefix we need to remove.",
      speak: "Let's learn SUBSTITUTE — it replaces text within a string. These tickers have an N-S-E colon prefix we need to remove."
    },
    {
      cursor: 'a2', highlight: 'a2',
      narrate: 'A2: "NSE:RELIANCE" — we want just "RELIANCE" without the exchange prefix.',
      speak: 'A2: N-S-E colon Reliance — we want just Reliance without the exchange prefix.'
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=SUBSTITUTE(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-str">"NSE:"</span><span class="f-dim">,</span> <span class="f-str">""</span><span class="f-fn">)</span>',
      narrate: 'SUBSTITUTE takes: the text, what to find, what to replace it with. Empty string "" means delete it.',
      speak: 'SUBSTITUTE takes: the text, what to find, what to replace it with. Empty string means delete it.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'RELIANCE', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'B2 gets "RELIANCE" — the "NSE:" prefix is gone. Clean ticker ready for lookups.',
      speak: 'B2 gets Reliance — the prefix is gone. Clean ticker ready for lookups.'
    },
    {
      clear: true,
      setCellText: {id:'b3', text:'HDFCBANK', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'600'}},
      setCellText: {id:'b4', text:'TCS', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: ['b3','b4'],
      narrate: 'Same formula cleans all rows. SUBSTITUTE is case-sensitive and replaces ALL occurrences by default.',
      speak: 'Same formula cleans all rows. SUBSTITUTE is case-sensitive and replaces all occurrences by default.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=SUBSTITUTE(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-str">"NSE:"</span><span class="f-dim">,</span> <span class="f-str">""</span><span class="f-fn">)</span>',
      narrate: "That's SUBSTITUTE! Find and replace inside a formula. You can chain them: SUBSTITUTE(SUBSTITUTE(A2,\"NSE:\",\"\"),\"BSE:\",\"\") to handle multiple exchanges.",
      speak: "That's SUBSTITUTE! Find and replace inside a formula. You can chain them to handle multiple patterns at once."
    }
  ]
};
