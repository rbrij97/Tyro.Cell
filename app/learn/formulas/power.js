window.FORMULA_CONFIG = {
  title: 'POWER (CAGR)',
  targetCell: 'b5',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Metric',cls:'col-a'}, {id:'b1',text:'Value'}]},
      {rh:'2', cells:[{id:'a2',text:'Initial NAV',cls:'col-a'}, {id:'b2',text:'100'}]},
      {rh:'3', cells:[{id:'a3',text:'Final NAV',cls:'col-a'}, {id:'b3',text:'161.05'}]},
      {rh:'4', cells:[{id:'a4',text:'Years',cls:'col-a'}, {id:'b4',text:'5'}]},
      {gap:true},
      {rh:'6', cells:[{id:'a6',text:'CAGR',cls:'col-a'}, {id:'b5',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn POWER — it raises a number to a power. The classic finance use: calculating CAGR (Compound Annual Growth Rate).", speak:"Let's learn POWER — it raises a number to a power. The classic finance use: calculating CAGR, compound annual growth rate."},
    {cursor:'b5', narrate:'CAGR formula: (Final/Initial)^(1/Years) - 1. POWER handles the exponent part.', speak:'CAGR formula: Final divided by Initial, raised to the power of 1 over Years, minus 1. POWER handles the exponent part.'},
    {formula:'<span class="f-fn">=POWER(</span><span class="f-ref">B3</span><span class="f-dim">/</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-dim">/</span><span class="f-ref">B4</span><span class="f-fn">)</span><span class="f-dim">-1</span>', narrate:'POWER(B3/B2, 1/B4) - 1 → POWER(161.05/100, 1/5) - 1 → POWER(1.6105, 0.2) - 1', speak:'POWER of B3 over B2, 1 over B4, minus 1. That\'s POWER of 1.6105, 0.2, minus 1.'},
    {clear:true, found:['b2','b3','b4'], setCellText:{id:'b5',text:'10.0%',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b5', cursor:'b5', narrate:'The fund grew at 10% CAGR over 5 years. ₹100 became ₹161.05.', speak:'The fund grew at 10 percent CAGR over 5 years. 100 rupees became 161.05.'},
    {hideCursor:true, formula:'<span class="f-fn">=POWER(</span><span class="f-ref">B3</span><span class="f-dim">/</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-num">1</span><span class="f-dim">/</span><span class="f-ref">B4</span><span class="f-fn">)</span><span class="f-dim">-1</span> <span style="color:var(--green);font-weight:600">→ 10%</span>', narrate:"That's POWER! The workhorse behind CAGR, compound interest, and exponential growth models in finance.", speak:"That's POWER! The workhorse behind CAGR, compound interest, and exponential growth models in finance."}
  ]
};
