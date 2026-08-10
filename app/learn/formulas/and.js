window.FORMULA_CONFIG = {
  title: 'AND',
  targetCell: 'c2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'P/E'}, {id:'c1',text:'Value Pick?'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'SBIN',cls:'col-a'}, {id:'b2',text:'9.4'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'28.7'}, {id:'c3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'18.4'}, {id:'c4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn AND — it checks if ALL conditions are true. A \"value pick\" must have P/E below 15 AND above 0 (not loss-making).",
      speak: "Let's learn AND — it checks if all conditions are true. A value pick must have P-E below 15 and above zero."
    },
    {
      cursor: 'c2',
      formula: '<span class="f-fn">=AND(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">0</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">&lt;</span><span class="f-num">15</span><span class="f-fn">)</span>',
      narrate: 'AND takes multiple conditions separated by commas. ALL must be true for AND to return TRUE.',
      speak: 'AND takes multiple conditions separated by commas. All must be true for AND to return true.'
    },
    {
      clear: true, cursor: 'b2', found: 'b2',
      narrate: 'SBIN: P/E = 9.4. Is 9.4 > 0? Yes. Is 9.4 < 15? Yes. Both true!',
      speak: 'S-B-I-N: P-E is 9.4. Is 9.4 greater than zero? Yes. Is 9.4 less than 15? Yes. Both true!'
    },
    {
      setCellText: {id:'c2', text:'TRUE', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'c2', cursor: 'c2',
      narrate: 'AND returns TRUE — SBIN is a value pick!',
      speak: 'AND returns true — S-B-I-N is a value pick!'
    },
    {
      clear: true, cursor: 'b3', highlight: 'b3',
      setCellText: {id:'c3', text:'FALSE', styles:{color:'var(--red)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: 'c3',
      narrate: 'TCS: P/E = 28.7. 28.7 > 0? Yes. But 28.7 < 15? No! One false = AND returns FALSE.',
      speak: 'T-C-S: P-E is 28.7. Greater than zero? Yes. But less than 15? No! One false means AND returns false.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=AND(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">0</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">&lt;</span><span class="f-num">15</span><span class="f-fn">)</span>',
      narrate: "That's AND! All conditions must pass. Use inside IF for powerful filters: =IF(AND(B2>0,B2<15),\"Value\",\"Growth\").",
      speak: "That's AND! All conditions must pass. Use inside IF for powerful screening filters."
    }
  ]
};
