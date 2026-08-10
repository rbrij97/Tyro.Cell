window.FORMULA_CONFIG = {
  title: 'SUM',
  targetCell: 'b8',

  table: {
    headers: [
      {label:'A'}, {label:'B'}
    ],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Quarter',cls:'col-a'}, {id:'b1',text:'Revenue (₹ Cr)'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'Q1 FY26',cls:'col-a'}, {id:'b2',text:'12,450'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'Q2 FY26',cls:'col-a'}, {id:'b3',text:'14,200'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'Q3 FY26',cls:'col-a'}, {id:'b4',text:'13,680'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'Q4 FY26',cls:'col-a'}, {id:'b5',text:'15,900'}
      ]},
      {gap:true},
      {rh:'7', cells:[
        {id:'a7',text:'FY Total',cls:'col-a',style:'font-weight:700'}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'8', cells:[
        {id:'a8',text:'',style:'border:none;background:transparent'}, {id:'b8',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn SUM — the foundation of every financial model. You have quarterly revenue data and need to compute the full-year total.",
      speak: "Let's learn SUM — the foundation of every financial model. You have quarterly revenue data and need to compute the full-year total."
    },
    {
      cursor: 'b2',
      rangeHl: ['b2','b3','b4','b5'],
      narrate: 'Here are four quarters of revenue in cells B2 to B5. We want to add them all up.',
      speak: 'Here are four quarters of revenue in cells B2 to B5. We want to add them all up.'
    },
    {
      cursor: 'b8',
      formula: '<span class="f-fn">=SUM(</span><span class="typing-cursor"></span>',
      narrate: 'Click cell B8 and start typing. SUM takes a range of cells to add together.',
      speak: 'Click cell B8 and start typing. SUM takes a range of cells to add together.'
    },
    {
      cursor: 'b2', cursorOx: 8, cursorOy: 8,
      highlight: ['b2','b3','b4','b5'],
      formula: '<span class="f-fn">=SUM(</span><span class="f-ref">B2:B5</span><span class="typing-cursor"></span>',
      narrate: 'Select the range B2 to B5 — all four quarters. You can drag or type the range.',
      speak: 'Select the range B2 to B5 — all four quarters. You can drag or type the range.',
      preDelay: 400
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=SUM(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>',
      narrate: 'Close the bracket. That\'s it — SUM is the simplest function in Excel.',
      speak: 'Close the bracket. That\'s it — SUM is the simplest function in Excel.'
    },
    {
      clear: true,
      cursor: 'b2',
      found: 'b2',
      narrate: 'Excel reads each value: Q1 is 12,450...',
      speak: 'Excel reads each value. Q1 is twelve thousand four hundred fifty.',
      postDelay: 200
    },
    {
      found: ['b2','b3'],
      cursor: 'b3',
      narrate: 'Q2 is 14,200...',
      speak: 'Q2 is fourteen thousand two hundred.',
      postDelay: 200
    },
    {
      found: ['b2','b3','b4'],
      cursor: 'b4',
      narrate: 'Q3 is 13,680...',
      speak: 'Q3 is thirteen thousand six hundred eighty.',
      postDelay: 200
    },
    {
      found: ['b2','b3','b4','b5'],
      cursor: 'b5',
      narrate: 'And Q4 is 15,900. Now Excel adds them together.',
      speak: 'And Q4 is fifteen thousand nine hundred. Now Excel adds them together.',
      postDelay: 400
    },
    {
      float: {from:'b5', to:'b8', text:'56,230'},
      setCellText: {id:'b8', text:'56,230', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b8',
      cursor: 'b8',
      narrate: 'The total flows into B8: ₹56,230 crore — full-year revenue.',
      speak: 'The total flows into B8: fifty-six thousand two hundred thirty crore — full-year revenue.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=SUM(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 56,230</span>',
      narrate: 'That\'s SUM! Select your range, close the bracket. Pro tip: you can also press Alt+= for AutoSum, which inserts SUM for you automatically.',
      speak: "That's SUM! Select your range, close the bracket. Pro tip: you can also press Alt equals for AutoSum, which inserts SUM for you automatically."
    }
  ]
};
