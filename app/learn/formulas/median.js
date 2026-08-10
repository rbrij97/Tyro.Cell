window.FORMULA_CONFIG = {
  title: 'MEDIAN',
  targetCell: 'b7',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'P/E'}]},
      {rh:'2', cells:[{id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'25.3'}]},
      {rh:'3', cells:[{id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'28.7'}]},
      {rh:'4', cells:[{id:'a4',text:'SBIN',cls:'col-a'}, {id:'b4',text:'9.4'}]},
      {rh:'5', cells:[{id:'a5',text:'HDFCBANK',cls:'col-a'}, {id:'b5',text:'18.4'}]},
      {gap:true},
      {rh:'7', cells:[{id:'a7',text:'Median P/E',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn MEDIAN — it finds the middle value. Unlike AVERAGE, MEDIAN isn't skewed by outliers — better for valuation analysis.", speak:"Let's learn MEDIAN — it finds the middle value. Unlike AVERAGE, MEDIAN isn't skewed by outliers — better for valuation analysis."},
    {cursor:'b7', formula:'<span class="f-fn">=MEDIAN(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'MEDIAN sorts the values and picks the middle one. With even count, it averages the two middle values.', speak:'MEDIAN sorts the values and picks the middle one. With an even count, it averages the two middle values.'},
    {clear:true, colHighlight:['b4','b5','b2','b3'], narrate:'Sorted: 9.4, 18.4, 25.3, 28.7. Four values → median = average of middle two (18.4 and 25.3).', speak:'Sorted: 9.4, 18.4, 25.3, 28.7. Four values, so median is the average of the middle two: 18.4 and 25.3.'},
    {found:['b5','b2'], setCellText:{id:'b7',text:'21.85',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b7', cursor:'b7', narrate:'Median P/E = 21.85. Notice: AVERAGE would be 20.45 — SBIN\'s low P/E pulls it down more.', speak:'Median P-E is 21.85. Notice: AVERAGE would be 20.45 — S-B-I-N\'s low P-E pulls it down more.'},
    {hideCursor:true, formula:'<span class="f-fn">=MEDIAN(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 21.85</span>', narrate:"That's MEDIAN! Use it over AVERAGE when you have outliers. Sector median P/E is a key valuation benchmark.", speak:"That's MEDIAN! Use it over AVERAGE when you have outliers. Sector median P-E is a key valuation benchmark."}
  ]
};
