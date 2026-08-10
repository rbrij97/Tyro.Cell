window.FORMULA_CONFIG = {
  title: 'INT',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Amount (₹)',cls:'col-a'}, {id:'b1',text:'Whole ₹'}]},
      {rh:'2', cells:[{id:'a2',text:'15847.63',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'-2450.80',cls:'col-a'}, {id:'b3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn INT — it rounds a number DOWN to the nearest integer. Different from ROUND(x,0) which rounds to the nearest.", speak:"Let's learn INT — it rounds a number down to the nearest integer. Different from ROUND of x comma zero, which rounds to the nearest."},
    {cursor:'b2', formula:'<span class="f-fn">=INT(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:'INT takes one argument — the number. It always rounds DOWN (toward negative infinity).', speak:'INT takes one argument — the number. It always rounds down toward negative infinity.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'15,847',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'15847.63 becomes 15,847 — the paise are dropped. Clean whole rupees.', speak:'15847.63 becomes 15,847 — the paise are dropped. Clean whole rupees.'},
    {clear:true, highlight:'a3', setCellText:{id:'b3',text:'-2,451',styles:{color:'var(--red)',fontStyle:'normal',fontWeight:'700'}}, colHighlight:'b3', narrate:'For negatives: INT(-2450.80) = -2451, not -2450! INT always rounds DOWN, meaning more negative.', speak:'For negatives: INT of minus 2450.80 equals minus 2451, not minus 2450! INT always rounds down, meaning more negative.'},
    {hideCursor:true, formula:'<span class="f-fn">=INT(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:"That's INT! It truncates toward negative infinity. For truncation toward zero instead, use ROUNDDOWN(x,0).", speak:"That's INT! It truncates toward negative infinity. For truncation toward zero instead, use ROUNDDOWN of x comma zero."}
  ]
};
