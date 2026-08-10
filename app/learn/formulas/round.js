window.FORMULA_CONFIG = {
  title: 'ROUND',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Raw P/E',cls:'col-a'}, {id:'b1',text:'Rounded'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'25.3478',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'18.4291',cls:'col-a'}, {id:'b3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'9876.543',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn ROUND — it rounds a number to a specified number of decimal places. Financial reports need clean numbers, not raw calculations.",
      speak: "Let's learn ROUND — it rounds a number to a specified number of decimal places. Financial reports need clean numbers, not raw calculations."
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=ROUND(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-fn">)</span>',
      narrate: 'ROUND takes the number and how many decimal places. 1 means round to one decimal.',
      speak: 'ROUND takes the number and how many decimal places. 1 means round to one decimal.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'25.3', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: '25.3478 rounds to 25.3 — clean for a report.',
      speak: '25.3478 rounds to 25.3 — clean for a report.'
    },
    {
      clear: true,
      formula: '<span class="f-fn">=ROUND(</span><span class="f-ref">A4</span><span class="f-dim">,</span> <span class="f-num">-2</span><span class="f-fn">)</span>',
      cursor: 'a4', highlight: 'a4',
      narrate: 'Negative decimals round to tens, hundreds, etc. ROUND(9876.543, -2) rounds to the nearest hundred.',
      speak: 'Negative decimals round to tens, hundreds, et cetera. ROUND of 9876.543 with minus 2 rounds to the nearest hundred.'
    },
    {
      setCellText: {id:'b4', text:'9,900', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b4', cursor: 'b4',
      narrate: '9876.543 rounds to 9,900. Useful for presenting large numbers in thousands or crores.',
      speak: '9876.543 rounds to 9,900. Useful for presenting large numbers in thousands or crores.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=ROUND(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-fn">)</span>',
      narrate: "That's ROUND! Positive decimals for precision, 0 for whole numbers, negative for rounding to tens/hundreds. ROUNDUP and ROUNDDOWN always go one direction.",
      speak: "That's ROUND! Positive decimals for precision, zero for whole numbers, negative for rounding to tens or hundreds. ROUNDUP and ROUNDDOWN always go one direction."
    }
  ]
};
