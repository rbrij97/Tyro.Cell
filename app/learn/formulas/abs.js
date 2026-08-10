window.FORMULA_CONFIG = {
  title: 'ABS',
  targetCell: 'c2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'P&L (₹)'}, {id:'c1',text:'Magnitude'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'-4,200'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'6,800'}, {id:'c3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'SBIN',cls:'col-a'}, {id:'b4',text:'-1,500'}, {id:'c4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn ABS — it returns the absolute value, removing the sign. Useful when you care about the size of a gain or loss, not the direction.",
      speak: "Let's learn ABS — it returns the absolute value, removing the sign. Useful when you care about the size of a gain or loss, not the direction."
    },
    {
      cursor: 'b2', highlight: 'b2',
      narrate: 'B2 shows -4,200 — a loss of ₹4,200. We want the magnitude without the minus sign.',
      speak: 'B2 shows minus 4,200 — a loss of 4,200 rupees. We want the magnitude without the minus sign.'
    },
    {
      cursor: 'c2',
      formula: '<span class="f-fn">=ABS(</span><span class="f-ref">B2</span><span class="f-fn">)</span>',
      narrate: 'ABS takes one argument — the number. Negatives become positive, positives stay positive.',
      speak: 'ABS takes one argument — the number. Negatives become positive, positives stay positive.'
    },
    {
      clear: true, found: 'b2',
      setCellText: {id:'c2', text:'4,200', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'c2', cursor: 'c2',
      narrate: 'C2 gets 4,200 — the absolute value. The minus sign is gone.',
      speak: 'C2 gets 4,200 — the absolute value. The minus sign is gone.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=ABS(</span><span class="f-ref">B2</span><span class="f-fn">)</span>',
      narrate: "That's ABS! Essential for calculating deviation, tracking risk metrics, and sorting by trade magnitude regardless of direction.",
      speak: "That's ABS! Essential for calculating deviation, tracking risk metrics, and sorting by trade magnitude regardless of direction."
    }
  ]
};
