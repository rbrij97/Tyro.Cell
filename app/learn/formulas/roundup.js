window.FORMULA_CONFIG = {
  title: 'ROUNDUP',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Tax Amount',cls:'col-a'}, {id:'b1',text:'Rounded Up'}]},
      {rh:'2', cells:[{id:'a2',text:'1847.23',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'523.01',cls:'col-a'}, {id:'b3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn ROUNDUP — it always rounds away from zero. When billing, you always round tax UP to avoid under-charging.", speak:"Let's learn ROUNDUP — it always rounds away from zero. When billing, you always round tax up to avoid under-charging."},
    {cursor:'b2', formula:'<span class="f-fn">=ROUNDUP(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">)</span>', narrate:'ROUNDUP(A2, 0) — round 1847.23 up to the nearest whole number.', speak:'ROUNDUP of A2, zero — round 1847.23 up to the nearest whole number.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'1,848',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'1847.23 becomes 1,848 — always rounds UP, never down.', speak:'1847.23 becomes 1,848 — always rounds up, never down.'},
    {hideCursor:true, formula:'<span class="f-fn">=ROUNDUP(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">)</span>', narrate:"That's ROUNDUP! Use it for billing, tax, and any scenario where rounding down would mean a shortfall. ROUNDDOWN does the opposite.", speak:"That's ROUNDUP! Use it for billing, tax, and any scenario where rounding down would mean a shortfall. ROUNDDOWN does the opposite."}
  ]
};
