window.FORMULA_CONFIG = {
  title: 'COUNTA',
  targetCell: 'b7',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Rating'}]},
      {rh:'2', cells:[{id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Buy'}]},
      {rh:'3', cells:[{id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'Hold'}]},
      {rh:'4', cells:[{id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'',style:'background:var(--line-3)'}]},
      {rh:'5', cells:[{id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'Sell'}]},
      {gap:true},
      {rh:'7', cells:[{id:'a7',text:'Rated stocks',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn COUNTA — it counts all non-empty cells, whether they contain numbers OR text. How many stocks have a rating?", speak:"Let's learn COUNTA — it counts all non-empty cells, whether they contain numbers or text. How many stocks have a rating?"},
    {cursor:'b7', formula:'<span class="f-fn">=COUNTA(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'COUNTA(B2:B5) — count every cell that has something in it.', speak:'COUNTA of B2 to B5 — count every cell that has something in it.'},
    {clear:true, found:['b2','b3','b5'], highlight:'b4', narrate:'B2 ("Buy"), B3 ("Hold"), B5 ("Sell") have text. B4 is empty — skipped.', speak:'B2 Buy, B3 Hold, B5 Sell have text. B4 is empty — skipped.'},
    {setCellText:{id:'b7',text:'3',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b7', cursor:'b7', narrate:'COUNTA returns 3 — all non-empty cells counted, including text values that COUNT would miss.', speak:'COUNTA returns 3 — all non-empty cells counted, including text values that COUNT would miss.'},
    {hideCursor:true, formula:'<span class="f-fn">=COUNTA(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 3</span>', narrate:"That's COUNTA! The 'A' stands for 'All' — it counts text, numbers, errors, anything that's not blank.", speak:"That's COUNTA! The A stands for All — it counts text, numbers, errors, anything that's not blank."}
  ]
};
