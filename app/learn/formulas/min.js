window.FORMULA_CONFIG = {
  title: 'MIN',
  targetCell: 'b7',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Date',cls:'col-a'}, {id:'b1',text:'NAV (₹)'}]},
      {rh:'2', cells:[{id:'a2',text:'Jan',cls:'col-a'}, {id:'b2',text:'142.5'}]},
      {rh:'3', cells:[{id:'a3',text:'Feb',cls:'col-a'}, {id:'b3',text:'138.2'}]},
      {rh:'4', cells:[{id:'a4',text:'Mar',cls:'col-a'}, {id:'b4',text:'131.8'}]},
      {rh:'5', cells:[{id:'a5',text:'Apr',cls:'col-a'}, {id:'b5',text:'145.1'}]},
      {gap:true},
      {rh:'7', cells:[{id:'a7',text:'52W Low',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn MIN — it finds the smallest value in a range. Every fund factsheet shows the 52-week low — MIN finds it instantly.", speak:"Let's learn MIN — it finds the smallest value in a range. Every fund factsheet shows the 52-week low — MIN finds it instantly."},
    {cursor:'b7', formula:'<span class="f-fn">=MIN(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'MIN scans the entire range and returns the smallest number.', speak:'MIN scans the entire range and returns the smallest number.'},
    {clear:true, highlight:['b2','b3','b5'], found:'b4', narrate:'Scanning all NAVs: 142.5, 138.2, 131.8, 145.1 — the lowest is 131.8 in March.', speak:'Scanning all NAVs: 142.5, 138.2, 131.8, 145.1 — the lowest is 131.8 in March.'},
    {float:{from:'b4',to:'b7',text:'131.8'}, setCellText:{id:'b7',text:'131.8',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b7', cursor:'b7', narrate:'52-week low is ₹131.8. Combine with MAX to calculate the range or drawdown.', speak:'52-week low is 131.8 rupees. Combine with MAX to calculate the range or drawdown.'},
    {hideCursor:true, formula:'<span class="f-fn">=MIN(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 131.8</span>', narrate:"That's MIN! Use it for worst-case analysis, support levels, and risk metrics.", speak:"That's MIN! Use it for worst-case analysis, support levels, and risk metrics."}
  ]
};
