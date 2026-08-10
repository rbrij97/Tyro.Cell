window.FORMULA_CONFIG = {
  title: 'ISNUMBER',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Cell Value',cls:'col-a'}, {id:'b1',text:'Is Number?'}]},
      {rh:'2', cells:[{id:'a2',text:'2450',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'₹2,450',cls:'col-a'}, {id:'b3',text:''}]},
      {rh:'4', cells:[{id:'a4',text:'N/A',cls:'col-a',style:'color:var(--muted);font-style:italic'}, {id:'b4',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn ISNUMBER — it checks if a cell contains a number. Critical for data validation — text that looks like a number will break your formulas.", speak:"Let's learn ISNUMBER — it checks if a cell contains a number. Critical for data validation — text that looks like a number will break your formulas."},
    {cursor:'b2', formula:'<span class="f-fn">=ISNUMBER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:'ISNUMBER returns TRUE if the cell contains a numeric value, FALSE otherwise.', speak:'ISNUMBER returns true if the cell contains a numeric value, false otherwise.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'TRUE',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', narrate:'A2 = 2450. That\'s a real number → TRUE.', speak:'A2 is 2450. That\'s a real number, so true.'},
    {clear:true, highlight:'a3', setCellText:{id:'b3',text:'FALSE',styles:{color:'var(--red)',fontStyle:'normal',fontWeight:'600'}}, colHighlight:'b3', narrate:'A3 = "₹2,450" looks numeric but it\'s TEXT (has ₹ and comma). ISNUMBER catches this — FALSE!', speak:'A3 shows rupees 2,450. It looks numeric but it\'s text because of the rupee sign and comma. ISNUMBER catches this — false!'},
    {hideCursor:true, formula:'<span class="f-fn">=ISNUMBER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:"That's ISNUMBER! Use it to validate imported data. Combine with IF: =IF(ISNUMBER(A2), A2, \"Fix this cell\").", speak:"That's ISNUMBER! Use it to validate imported data. Combine with IF to flag cells that need fixing."}
  ]
};
