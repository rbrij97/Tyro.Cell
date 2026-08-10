window.FORMULA_CONFIG = {
  title: 'LEN',
  targetCell: 'b2',

  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'PAN Number',cls:'col-a'}, {id:'b1',text:'Length'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'ABCPD1234E',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'XYZPK5678',cls:'col-a'}, {id:'b3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'MNRPS9012FG',cls:'col-a'}, {id:'b4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn LEN — it counts the number of characters in text. PAN numbers must be exactly 10 characters — let's validate them.",
      speak: "Let's learn LEN — it counts the number of characters in text. PAN numbers must be exactly 10 characters — let's validate them."
    },
    {
      cursor: 'b2',
      formula: '<span class="f-fn">=LEN(</span><span class="f-ref">A2</span><span class="f-fn">)</span>',
      narrate: 'LEN takes just one argument — the text to measure.',
      speak: 'LEN takes just one argument — the text to measure.'
    },
    {
      clear: true, found: 'a2',
      setCellText: {id:'b2', text:'10', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'b2', cursor: 'b2',
      narrate: 'A2 has 10 characters — valid PAN!',
      speak: 'A2 has 10 characters — valid PAN!'
    },
    {
      clear: true, highlight: 'a3',
      setCellText: {id:'b3', text:'9', styles:{color:'var(--red)', fontStyle:'normal', fontWeight:'700'}},
      colHighlight: 'b3', cursor: 'b3',
      narrate: 'A3 has only 9 characters — invalid! One character is missing.',
      speak: 'A3 has only 9 characters — invalid! One character is missing.'
    },
    {
      clear: true, highlight: 'a4',
      setCellText: {id:'b4', text:'11', styles:{color:'var(--red)', fontStyle:'normal', fontWeight:'700'}},
      colHighlight: 'b4', cursor: 'b4',
      narrate: 'A4 has 11 characters — also invalid. LEN helps you catch data entry errors instantly.',
      speak: 'A4 has 11 characters — also invalid. LEN helps you catch data entry errors instantly.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=LEN(</span><span class="f-ref">A2</span><span class="f-fn">)</span>',
      narrate: "That's LEN! Simple but powerful for data validation. Combine with IF to flag invalid entries: =IF(LEN(A2)=10, \"Valid\", \"Invalid\").",
      speak: "That's LEN! Simple but powerful for data validation. Combine with IF to flag invalid entries."
    }
  ]
};
