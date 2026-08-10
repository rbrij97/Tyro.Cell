window.FORMULA_CONFIG = {
  title: 'TODAY',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Metric',cls:'col-a'}, {id:'b1',text:'Value'}]},
      {rh:'2', cells:[{id:'a2',text:"Today's Date",cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'Maturity Date',cls:'col-a'}, {id:'b3',text:'15-Mar-2027'}]},
      {rh:'4', cells:[{id:'a4',text:'Days Left',cls:'col-a'}, {id:'b4',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn TODAY — it returns the current date. It updates automatically every time the sheet recalculates.", speak:"Let's learn TODAY — it returns the current date. It updates automatically every time the sheet recalculates."},
    {cursor:'b2', formula:'<span class="f-fn">=TODAY()</span>', narrate:'TODAY takes no arguments — just empty brackets. It always returns the current date.', speak:'TODAY takes no arguments — just empty brackets. It always returns the current date.'},
    {clear:true, setCellText:{id:'b2',text:'06-Aug-2026',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:"B2 shows today's date. Open this sheet tomorrow and it'll automatically show the new date.", speak:"B2 shows today's date. Open this sheet tomorrow and it will automatically show the new date."},
    {formula:'<span class="f-ref">B3</span><span class="f-dim">-</span><span class="f-fn">TODAY()</span>', setCellText:{id:'b4',text:'221',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'600'}}, colHighlight:'b4', narrate:'Bonus: B3 - TODAY() gives you days until maturity — a live countdown!', speak:'Bonus: B3 minus TODAY gives you days until maturity — a live countdown!'},
    {hideCursor:true, formula:'<span class="f-fn">=TODAY()</span>', narrate:"That's TODAY! Essential for aging calculations, days-to-maturity, overdue tracking, and any time-sensitive formula.", speak:"That's TODAY! Essential for aging calculations, days to maturity, overdue tracking, and any time-sensitive formula."}
  ]
};
