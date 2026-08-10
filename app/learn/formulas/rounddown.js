window.FORMULA_CONFIG = {
  title: 'ROUNDDOWN',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Shares (Calc)',cls:'col-a'}, {id:'b1',text:'Shares (Whole)'}]},
      {rh:'2', cells:[{id:'a2',text:'47.83',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'125.99',cls:'col-a'}, {id:'b3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn ROUNDDOWN — it always rounds toward zero. When calculating whole shares to buy, you can't buy a fraction — always round DOWN.", speak:"Let's learn ROUNDDOWN — it always rounds toward zero. When calculating whole shares to buy, you can't buy a fraction — always round down."},
    {cursor:'b2', formula:'<span class="f-fn">=ROUNDDOWN(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">)</span>', narrate:'ROUNDDOWN(A2, 0) — round 47.83 down to the nearest whole number.', speak:'ROUNDDOWN of A2, zero — round 47.83 down to the nearest whole number.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'47',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'47.83 becomes 47 — always rounds DOWN. You can buy 47 whole shares.', speak:'47.83 becomes 47 — always rounds down. You can buy 47 whole shares.'},
    {hideCursor:true, formula:'<span class="f-fn">=ROUNDDOWN(</span><span class="f-ref">A2</span><span class="f-dim">,</span> <span class="f-num">0</span><span class="f-fn">)</span>', narrate:"That's ROUNDDOWN! Use it for share quantities, lot sizes, and any scenario where overshooting is worse than undershooting.", speak:"That's ROUNDDOWN! Use it for share quantities, lot sizes, and any scenario where overshooting is worse than undershooting."}
  ]
};
