window.FORMULA_CONFIG = {
  title: 'TRIM',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Raw Data',cls:'col-a'}, {id:'b1',text:'Cleaned'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'  RELIANCE  ',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'  HDFC  BANK  ',cls:'col-a'}, {id:'b3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'TCS',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn TRIM — it removes extra spaces from text. Messy data from imports often has leading, trailing, or double spaces.",
      speak: "Let's learn TRIM — it removes extra spaces from text. Messy data from imports often has leading, trailing, or double spaces."
    },
    {
      cursor: 'a2', highlight: 'a2',
      narrate: 'Look at A2: "  RELIANCE  " has spaces before and after. This will cause VLOOKUP failures!',
      speak: 'Look at A2: Reliance has spaces before and after. This will cause V-Lookup failures!'
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=TRIM(</span><span class="f-ref">A2</span><span class="f-fn">)</span>',
      narrate: 'TRIM takes just one argument — the text to clean. It strips leading/trailing spaces and collapses double spaces to single.',
      speak: 'TRIM takes just one argument — the text to clean. It strips leading and trailing spaces and collapses double spaces to single.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'RELIANCE', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'B2 gets clean "RELIANCE" — no extra spaces. VLOOKUPs will now match correctly.',
      speak: 'B2 gets clean Reliance — no extra spaces. V-Lookups will now match correctly.'
    },
    {
      clear: true, cursor: 'a3', highlight: 'a3',
      narrate: 'A3 has "  HDFC  BANK  " — spaces everywhere, including a double space in the middle.',
      speak: 'A3 has HDFC Bank with spaces everywhere, including a double space in the middle.'
    },
    {
      setCellText: {id:'b3', text:'HDFC BANK', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b3', cursor: 'b3',
      narrate: 'TRIM returns "HDFC BANK" — single space between words, no leading or trailing spaces.',
      speak: 'TRIM returns HDFC BANK — single space between words, no leading or trailing spaces.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=TRIM(</span><span class="f-ref">A2</span><span class="f-fn">)</span>',
      narrate: "That's TRIM! One of the most underrated data-cleaning functions. Always TRIM imported data before using it in lookups.",
      speak: "That's TRIM! One of the most underrated data-cleaning functions. Always TRIM imported data before using it in lookups."
    }
  ]
};
