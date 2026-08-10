window.FORMULA_CONFIG = {
  title: 'NOT',
  targetCell: 'c2',
  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Sector'}, {id:'c1',text:'Non-Banking?'}]},
      {rh:'2', cells:[{id:'a2',text:'TCS',cls:'col-a'}, {id:'b2',text:'IT'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'HDFCBANK',cls:'col-a'}, {id:'b3',text:'Banking'}, {id:'c3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn NOT — it flips TRUE to FALSE and vice versa. Want everything EXCEPT Banking? NOT is your filter.", speak:"Let's learn NOT — it flips true to false and vice versa. Want everything except Banking? NOT is your filter."},
    {cursor:'c2', formula:'<span class="f-fn">=NOT(</span><span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Banking"</span><span class="f-fn">)</span>', narrate:'NOT inverts the condition. B2="Banking" is FALSE for TCS, so NOT flips it to TRUE.', speak:'NOT inverts the condition. B2 equals Banking is false for T-C-S, so NOT flips it to true.'},
    {clear:true, found:'b2', setCellText:{id:'c2',text:'TRUE',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'c2', narrate:'TCS is NOT Banking → TRUE. It passes the non-banking filter.', speak:'T-C-S is not Banking, so true. It passes the non-banking filter.'},
    {clear:true, highlight:'b3', setCellText:{id:'c3',text:'FALSE',styles:{color:'var(--red)',fontStyle:'normal',fontWeight:'600'}}, colHighlight:'c3', narrate:'HDFCBANK IS Banking → NOT flips TRUE to FALSE. Excluded.', speak:'HDFC Bank is Banking, so NOT flips true to false. Excluded.'},
    {hideCursor:true, formula:'<span class="f-fn">=NOT(</span><span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Banking"</span><span class="f-fn">)</span>', narrate:"That's NOT! The logical inverter. Combine with AND/OR for complex exclusion filters.", speak:"That's NOT! The logical inverter. Combine with AND and OR for complex exclusion filters."}
  ]
};
