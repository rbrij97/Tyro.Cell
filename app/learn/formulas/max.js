window.FORMULA_CONFIG = {
  title: 'MAX',
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
      {rh:'7', cells:[{id:'a7',text:'52W High',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn MAX — it finds the largest value. The 52-week high is a key metric on every stock screener and fund factsheet.", speak:"Let's learn MAX — it finds the largest value. The 52-week high is a key metric on every stock screener and fund factsheet."},
    {cursor:'b7', formula:'<span class="f-fn">=MAX(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'MAX scans the range and returns the biggest number.', speak:'MAX scans the range and returns the biggest number.'},
    {clear:true, highlight:['b2','b3','b4'], found:'b5', narrate:'Scanning: 142.5, 138.2, 131.8, 145.1 — the highest is 145.1 in April.', speak:'Scanning: 142.5, 138.2, 131.8, 145.1 — the highest is 145.1 in April.'},
    {float:{from:'b5',to:'b7',text:'145.1'}, setCellText:{id:'b7',text:'145.1',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b7', cursor:'b7', narrate:'52-week high is ₹145.1. Drawdown from high = (Current - MAX) / MAX.', speak:'52-week high is 145.1 rupees. Drawdown from high equals current minus MAX, divided by MAX.'},
    {hideCursor:true, formula:'<span class="f-fn">=MAX(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 145.1</span>', narrate:"That's MAX! Use it for peak detection, resistance levels, and best-case analysis. MIN and MAX together give you the range.", speak:"That's MAX! Use it for peak detection, resistance levels, and best-case analysis. MIN and MAX together give you the range."}
  ]
};
