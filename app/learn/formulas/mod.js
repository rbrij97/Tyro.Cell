window.FORMULA_CONFIG = {
  title: 'MOD',
  targetCell: 'c2',
  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Month #',cls:'col-a'}, {id:'b1',text:'Payment'}, {id:'c1',text:'Quarter'}]},
      {rh:'2', cells:[{id:'a2',text:'1',cls:'col-a'}, {id:'b2',text:'25,000'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'2',cls:'col-a'}, {id:'b3',text:'25,000'}, {id:'c3',text:''}]},
      {rh:'4', cells:[{id:'a4',text:'3',cls:'col-a'}, {id:'b4',text:'25,000'}, {id:'c4',text:''}]},
      {rh:'5', cells:[{id:'a5',text:'4',cls:'col-a'}, {id:'b5',text:'25,000'}, {id:'c5',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn MOD — it returns the remainder after division. We can use it to assign months to quarters: every 3rd month ends a quarter.", speak:"Let's learn MOD — it returns the remainder after division. We can use it to assign months to quarters: every third month ends a quarter."},
    {cursor:'c2', formula:'<span class="f-fn">=IF(</span><span class="f-fn">MOD(</span><span class="f-ref">A2</span><span class="f-dim">,</span><span class="f-num">3</span><span class="f-fn">)</span><span class="f-dim">=0,</span><span class="f-str">"Q-End"</span><span class="f-dim">,</span><span class="f-str">""</span><span class="f-fn">)</span>', narrate:'MOD(A2,3) divides the month number by 3 and returns the remainder. If remainder = 0, it\'s a quarter-end.', speak:'MOD of A2 comma 3 divides the month number by 3 and returns the remainder. If remainder equals zero, it\'s a quarter end.'},
    {clear:true, cursor:'a2', highlight:'a2', narrate:'Month 1: MOD(1,3) = 1. Remainder is 1, not 0 — not a quarter-end.', speak:'Month 1: MOD of 1 comma 3 equals 1. Remainder is 1, not zero — not a quarter end.', postDelay:200},
    {cursor:'a3', highlight:'a3', narrate:'Month 2: MOD(2,3) = 2. Still not 0.', speak:'Month 2: MOD of 2 comma 3 equals 2. Still not zero.', postDelay:200},
    {clearState:{ids:['a2','a3'],state:'searching'}, cursor:'a4', found:'a4', setCellText:{id:'c4',text:'Q-End',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'c4', narrate:'Month 3: MOD(3,3) = 0. Quarter-end! The formula flags it.', speak:'Month 3: MOD of 3 comma 3 equals zero. Quarter end! The formula flags it.'},
    {hideCursor:true, narrate:"That's MOD! The remainder operator. Use it for alternating row colors, quarterly flags, lot size checks, and cyclical patterns.", speak:"That's MOD! The remainder operator. Use it for alternating row colors, quarterly flags, lot size checks, and cyclical patterns."}
  ]
};
