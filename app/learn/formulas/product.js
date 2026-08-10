window.FORMULA_CONFIG = {
  title: 'PRODUCT',
  targetCell: 'b6',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Year',cls:'col-a'}, {id:'b1',text:'Growth Factor'}]},
      {rh:'2', cells:[{id:'a2',text:'Y1',cls:'col-a'}, {id:'b2',text:'1.12'}]},
      {rh:'3', cells:[{id:'a3',text:'Y2',cls:'col-a'}, {id:'b3',text:'1.08'}]},
      {rh:'4', cells:[{id:'a4',text:'Y3',cls:'col-a'}, {id:'b4',text:'0.95'}]},
      {gap:true},
      {rh:'6', cells:[{id:'a6',text:'Total Growth',cls:'col-a'}, {id:'b6',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn PRODUCT — it multiplies all numbers in a range. For compound returns, you multiply growth factors, not add them.", speak:"Let's learn PRODUCT — it multiplies all numbers in a range. For compound returns, you multiply growth factors, not add them."},
    {cursor:'b6', formula:'<span class="f-fn">=PRODUCT(</span><span class="f-ref">B2:B4</span><span class="f-fn">)</span>', narrate:'PRODUCT(B2:B4) = 1.12 × 1.08 × 0.95. Like SUM but with multiplication.', speak:'PRODUCT of B2 to B4 equals 1.12 times 1.08 times 0.95. Like SUM but with multiplication.'},
    {clear:true, found:['b2','b3','b4'], setCellText:{id:'b6',text:'1.1491',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b6', cursor:'b6', narrate:'Total growth factor: 1.1491 — that\'s a 14.91% total return over 3 years, even with a down year.', speak:'Total growth factor: 1.1491 — that\'s a 14.91 percent total return over 3 years, even with a down year.'},
    {hideCursor:true, formula:'<span class="f-fn">=PRODUCT(</span><span class="f-ref">B2:B4</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 1.1491</span>', narrate:"That's PRODUCT! Essential for compound return calculations. Subtract 1 to get the total return percentage.", speak:"That's PRODUCT! Essential for compound return calculations. Subtract 1 to get the total return percentage."}
  ]
};
