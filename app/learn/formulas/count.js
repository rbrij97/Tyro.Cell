window.FORMULA_CONFIG = {
  title: 'COUNT',
  targetCell: 'b7',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'P/E'}]},
      {rh:'2', cells:[{id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'25.3'}]},
      {rh:'3', cells:[{id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'28.7'}]},
      {rh:'4', cells:[{id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'N/A',style:'color:var(--muted);font-style:italic'}]},
      {rh:'5', cells:[{id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'24.6'}]},
      {gap:true},
      {rh:'7', cells:[{id:'a7',text:'Numeric count',cls:'col-a'}, {id:'b7',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn COUNT — it counts cells that contain numbers. Text and blanks are ignored. How many stocks have a numeric P/E?", speak:"Let's learn COUNT — it counts cells that contain numbers. Text and blanks are ignored. How many stocks have a numeric P-E?"},
    {cursor:'b7', formula:'<span class="f-fn">=COUNT(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span>', narrate:'COUNT(B2:B5) — count how many cells in this range contain numbers.', speak:'COUNT of B2 to B5 — count how many cells in this range contain numbers.'},
    {clear:true, cursor:'b2', found:['b2','b3','b5'], highlight:'b4', narrate:'B2 (25.3), B3 (28.7), B5 (24.6) are numbers. B4 ("N/A") is text — skipped!', speak:'B2, B3, and B5 are numbers. B4 with N-A is text — skipped!'},
    {setCellText:{id:'b7',text:'3',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b7', cursor:'b7', narrate:'COUNT returns 3 — only numeric cells counted. Use COUNTA to count all non-empty cells.', speak:'COUNT returns 3 — only numeric cells counted. Use COUNTA to count all non-empty cells.'},
    {hideCursor:true, formula:'<span class="f-fn">=COUNT(</span><span class="f-ref">B2:B5</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 3</span>', narrate:"That's COUNT! Numbers only. Remember: COUNT for numbers, COUNTA for non-blanks, COUNTBLANK for empty cells.", speak:"That's COUNT! Numbers only. Remember: COUNT for numbers, COUNTA for non-blanks, COUNTBLANK for empty cells."}
  ]
};
