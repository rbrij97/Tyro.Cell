window.FORMULA_CONFIG = {
  title: 'DAYS',
  targetCell: 'c2',
  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Bond',cls:'col-a'}, {id:'b1',text:'Maturity'}, {id:'c1',text:'Days Left'}]},
      {rh:'2', cells:[{id:'a2',text:'GOI 7.26%',cls:'col-a'}, {id:'b2',text:'15-Jan-2029'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'SBI FD',cls:'col-a'}, {id:'b3',text:'10-Mar-2027'}, {id:'c3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn DAYS — it calculates the number of days between two dates. How many days until this government bond matures?", speak:"Let's learn DAYS — it calculates the number of days between two dates. How many days until this government bond matures?"},
    {cursor:'c2', formula:'<span class="f-fn">=DAYS(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-fn">TODAY()</span><span class="f-fn">)</span>', narrate:'DAYS(end_date, start_date) — note the order! End date first, then start date.', speak:'DAYS takes end date, then start date — note the order! End date first, then start date.'},
    {clear:true, found:'b2', setCellText:{id:'c2',text:'893',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'c2', cursor:'c2', narrate:'893 days until maturity. This updates automatically because we used TODAY() as the start date.', speak:'893 days until maturity. This updates automatically because we used TODAY as the start date.'},
    {hideCursor:true, formula:'<span class="f-fn">=DAYS(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-fn">TODAY()</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 893</span>', narrate:"That's DAYS! Perfect for maturity tracking, aging analysis, and holding period calculations. You can also just subtract dates directly: B2 - TODAY().", speak:"That's DAYS! Perfect for maturity tracking, aging analysis, and holding period calculations. You can also just subtract dates directly."}
  ]
};
