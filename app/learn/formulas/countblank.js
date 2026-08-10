window.FORMULA_CONFIG = {
  title: 'COUNTBLANK',
  targetCell: 'b7',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Rating'}]},
      {rh:'2', cells:[{id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Buy'}]},
      {rh:'3', cells:[{id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'',style:'background:var(--line-3)'}]},
      {rh:'4', cells:[{id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'Hold'}]},
      {rh:'5', cells:[{id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'',style:'background:var(--line-3)'}]},
      {gap:true},
      {rh:'7', cells:[{id:'a7',text:'Missing',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn COUNTBLANK — it counts empty cells in a range. Quick way to check data completeness.", speak:"Let's learn COUNTBLANK — it counts empty cells in a range. Quick way to check data completeness."},
    {cursor:'b7', formula:'<span class="f-fn">=COUNTBLANK(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'COUNTBLANK scans the range and counts how many cells are empty.', speak:'COUNTBLANK scans the range and counts how many cells are empty.'},
    {clear:true, found:['b2','b4'], highlight:['b3','b5'], narrate:'B2 and B4 have ratings. B3 and B5 are blank — 2 missing values.', speak:'B2 and B4 have ratings. B3 and B5 are blank — two missing values.'},
    {setCellText:{id:'b7',text:'2',styles:{color:'var(--red)',fontStyle:'normal',fontWeight:'700'}}, colHighlight:'b7', cursor:'b7', narrate:'COUNTBLANK returns 2. That\'s 50% missing data — needs attention before analysis.', speak:'COUNTBLANK returns 2. That\'s 50 percent missing data — needs attention before analysis.'},
    {hideCursor:true, formula:'<span class="f-fn">=COUNTBLANK(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 2</span>', narrate:"That's COUNTBLANK! Use it for data quality dashboards. Completeness % = 1 - COUNTBLANK/COUNTA formula.", speak:"That's COUNTBLANK! Use it for data quality dashboards. Calculate completeness percentage with this formula."}
  ]
};
