window.FORMULA_CONFIG = {
  title: 'DATE',
  targetCell: 'b4',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Component',cls:'col-a'}, {id:'b1',text:'Value'}]},
      {rh:'2', cells:[{id:'a2',text:'Year',cls:'col-a'}, {id:'b2',text:'2026'}]},
      {rh:'3', cells:[{id:'a3',text:'Month',cls:'col-a'}, {id:'b3',text:'4'}]},
      {rh:'4', cells:[{id:'a4',text:'FY Start',cls:'col-a'}, {id:'b4',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn DATE — it builds a date from year, month, and day components. We want to construct the start of financial year 2026.", speak:"Let's learn DATE — it builds a date from year, month, and day components. We want to construct the start of financial year 2026."},
    {cursor:'b4', formula:'<span class="f-fn">=DATE(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-ref">B3</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-fn">)</span>', narrate:'DATE(year, month, day) — DATE(2026, 4, 1) gives us 1st April 2026, the FY start.', speak:'DATE takes year, month, day. DATE of 2026, 4, 1 gives us 1st April 2026, the F-Y start.'},
    {clear:true, found:['b2','b3'], setCellText:{id:'b4',text:'01-Apr-2026',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b4', cursor:'b4', narrate:'B4 gets 1st April 2026 — a proper Excel date, not just text. You can do math with it.', speak:'B4 gets 1st April 2026 — a proper Excel date, not just text. You can do math with it.'},
    {hideCursor:true, formula:'<span class="f-fn">=DATE(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-ref">B3</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-fn">)</span>', narrate:"That's DATE! Build dates from components. Pro tip: DATE(YEAR(A1), MONTH(A1)+3, 0) gives you the last day of the quarter.", speak:"That's DATE! Build dates from components. Pro tip: combine with YEAR and MONTH to calculate quarter-end dates dynamically."}
  ]
};
