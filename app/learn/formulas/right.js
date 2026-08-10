window.FORMULA_CONFIG = {
  title: 'RIGHT',
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
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'INV-2024-0091',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn RIGHT — it extracts characters from the end of text. These invoice numbers end with a 4-digit serial we want to isolate.",
      speak: "Let's learn RIGHT — it extracts characters from the end of text. These invoice numbers end with a 4-digit serial we want to isolate."
    },
    {
      cursor: 'a2', highlight: 'a2',
      narrate: 'A2: "INV-2026-0847" — the last 4 characters "0847" are the invoice serial number.',
      speak: 'A2: INV-2026-0847 — the last four characters 0847 are the invoice serial number.'
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=RIGHT(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">4</span><span class="f-fn">)</span>',
      narrate: 'RIGHT takes the text and how many characters to grab from the right side.',
      speak: 'RIGHT takes the text and how many characters to grab from the right side.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'0847', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'B2 gets "0847" — the serial number extracted from the end.',
      speak: 'B2 gets 0847 — the serial number extracted from the end.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=RIGHT(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">4</span><span class="f-fn">)</span>',
      narrate: "That's RIGHT! Mirror image of LEFT. Use it to extract suffixes, trailing codes, and serial numbers.",
      speak: "That's RIGHT! Mirror image of LEFT. Use it to extract suffixes, trailing codes, and serial numbers."
    }
  ]
};
