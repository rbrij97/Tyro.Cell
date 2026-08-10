window.FORMULA_CONFIG = {
  title: 'ISBLANK',
  targetCell: 'c2',
  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Rating'}, {id:'c1',text:'Missing?'}]},
      {rh:'2', cells:[{id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Buy'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'',style:'background:var(--line-3)'}, {id:'c3',text:''}]},
      {rh:'4', cells:[{id:'a4',text:'SBIN',cls:'col-a'}, {id:'b4',text:'Hold'}, {id:'c4',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn ISBLANK — it checks if a cell is empty. Use it to flag missing data in your analysis.", speak:"Let's learn ISBLANK — it checks if a cell is empty. Use it to flag missing data in your analysis."},
    {cursor:'c2', formula:'<span class="f-fn">=ISBLANK(</span><span class="f-ref">B2</span><span class="f-fn">)</span>', narrate:'ISBLANK returns TRUE if the cell is completely empty, FALSE if it has anything in it.', speak:'ISBLANK returns true if the cell is completely empty, false if it has anything in it.'},
    {clear:true, found:'b2', setCellText:{id:'c2',text:'FALSE',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'c2', narrate:'B2 has "Buy" — not blank → FALSE. Good, this stock has a rating.', speak:'B2 has Buy — not blank, so false. Good, this stock has a rating.'},
    {clear:true, highlight:'b3', setCellText:{id:'c3',text:'TRUE',styles:{color:'var(--red)',fontStyle:'normal',fontWeight:'700'}}, colHighlight:'c3', cursor:'c3', narrate:'B3 is empty → TRUE! TCS is missing its analyst rating. Flag it for follow-up.', speak:'B3 is empty, so true! T-C-S is missing its analyst rating. Flag it for follow up.'},
    {hideCursor:true, formula:'<span class="f-fn">=ISBLANK(</span><span class="f-ref">B2</span><span class="f-fn">)</span>', narrate:"That's ISBLANK! Essential for data quality checks. Pair with COUNTBLANK to count all missing values in a range.", speak:"That's ISBLANK! Essential for data quality checks. Pair with COUNTBLANK to count all missing values in a range."}
  ]
};
