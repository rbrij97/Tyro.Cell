window.FORMULA_CONFIG = {
  title: 'LEFT',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'ISIN Code',cls:'col-a'}, {id:'b1',text:'Country'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'INE002A01018',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'US0378331005',cls:'col-a'}, {id:'b3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'GB0002162385',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn LEFT — it extracts characters from the start of text. ISIN codes start with a 2-letter country code we can extract.",
      speak: "Let's learn LEFT — it extracts characters from the start of text. I-S-I-N codes start with a 2-letter country code we can extract."
    },
    {
      cursor: 'a2', highlight: 'a2',
      narrate: 'A2 has "INE002A01018" — the first 2 characters "IN" tell us it\'s an Indian security.',
      speak: 'A2 has an I-S-I-N code. The first two characters I-N tell us it\'s an Indian security.'
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=LEFT(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-fn">)</span>',
      narrate: 'LEFT takes the text and how many characters to grab from the left side.',
      speak: 'LEFT takes the text and how many characters to grab from the left side.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'IN', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'B2 gets "IN" — India. LEFT grabbed the first 2 characters.',
      speak: 'B2 gets I-N — India. LEFT grabbed the first 2 characters.'
    },
    {
      clear: true,
      setCellText: {id:'b3', text:'US', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'600'}},
      setCellText: {id:'b4', text:'GB', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: ['b3','b4'],
      narrate: 'Same formula for all rows: US for Apple, GB for a UK security.',
      speak: 'Same formula for all rows: U-S for Apple, G-B for a U-K security.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=LEFT(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">2</span><span class="f-fn">)</span>',
      narrate: "That's LEFT! Great for extracting prefixes, codes, and identifiers. Its partner RIGHT grabs from the end instead.",
      speak: "That's LEFT! Great for extracting prefixes, codes, and identifiers. Its partner RIGHT grabs from the end instead."
    }
  ]
};
