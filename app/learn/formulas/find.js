window.FORMULA_CONFIG = {
  title: 'FIND',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Transaction',cls:'col-a'}, {id:'b1',text:'Dash Position'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'TXN-20260805-001',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TXN-20250312-099',cls:'col-a'}, {id:'b3',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn FIND — it locates the position of text within another text. We want to find where the first dash is in these transaction codes.",
      speak: "Let's learn FIND — it locates the position of text within another text. We want to find where the first dash is in these transaction codes."
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=FIND(</span><span class="f-str">"-"</span><span class="f-dim">,</span> <span class="f-ref">A2</span><span class="f-fn">)</span>',
      narrate: 'FIND takes 2 main arguments: what to search for, and the text to search within. It\'s case-sensitive.',
      speak: 'FIND takes two main arguments: what to search for, and the text to search within. It\'s case-sensitive.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'4', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'The first dash is at position 4 — "TXN-". Now you can use this with MID to extract parts of the code.',
      speak: 'The first dash is at position 4 — T-X-N dash. Now you can use this with MID to extract parts of the code.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=FIND(</span><span class="f-str">"-"</span><span class="f-dim">,</span> <span class="f-ref">A2</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 4</span>',
      narrate: "That's FIND! It returns the position number. If the text isn't found, it returns #VALUE! — wrap with IFERROR to handle that. SEARCH is the case-insensitive version.",
      speak: "That's FIND! It returns the position number. If the text isn't found, it returns a value error — wrap with IFERROR to handle that. SEARCH is the case-insensitive version."
    }
  ]
};
