window.FORMULA_CONFIG = {
  title: 'MID',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Invoice #',cls:'col-a'}, {id:'b1',text:'Year'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'INV-2026-0847',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'INV-2025-1203',cls:'col-a'}, {id:'b3',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn MID — it extracts characters from the middle of text. We want the year from these invoice numbers.",
      speak: "Let's learn MID — it extracts characters from the middle of text. We want the year from these invoice numbers."
    },
    {
      cursor: 'a2', highlight: 'a2',
      narrate: 'A2: "INV-2026-0847" — the year "2026" starts at position 5 and is 4 characters long.',
      speak: 'A2: INV-2026-0847 — the year 2026 starts at position 5 and is 4 characters long.'
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=MID(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">5</span><span class="f-dim">,</span> <span class="f-num">4</span><span class="f-fn">)</span>',
      narrate: 'MID takes 3 arguments: text, start position, and number of characters to extract.',
      speak: 'MID takes three arguments: text, start position, and number of characters to extract.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'2026', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'B2 gets "2026" — extracted from the middle. Start at position 5, grab 4 characters.',
      speak: 'B2 gets 2026 — extracted from the middle. Start at position 5, grab 4 characters.'
    },
    {
      clear: true,
      setCellText: {id:'b3', text:'2025', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: 'b3',
      narrate: 'Same formula on A3 gives us "2025". MID is perfect for fixed-format codes.',
      speak: 'Same formula on A3 gives us 2025. MID is perfect for fixed-format codes.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=MID(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">5</span><span class="f-dim">,</span> <span class="f-num">4</span><span class="f-fn">)</span>',
      narrate: "That's MID! Text, start position, length. Use it when LEFT and RIGHT can't reach the part you need.",
      speak: "That's MID! Text, start position, length. Use it when LEFT and RIGHT can't reach the part you need."
    }
  ]
};
