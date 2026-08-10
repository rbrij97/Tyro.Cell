window.FORMULA_CONFIG = {
  title: 'SQRT',
  targetCell: 'b4',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Metric',cls:'col-a'}, {id:'b1',text:'Value'}]},
      {rh:'2', cells:[{id:'a2',text:'Variance',cls:'col-a'}, {id:'b2',text:'0.0256'}]},
      {rh:'3', cells:[{id:'a3',text:'Trading Days',cls:'col-a'}, {id:'b3',text:'252'}]},
      {rh:'4', cells:[{id:'a4',text:'Daily Vol',cls:'col-a'}, {id:'b4',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn SQRT — square root. In finance, volatility (standard deviation) is the square root of variance.", speak:"Let's learn SQRT — square root. In finance, volatility or standard deviation is the square root of variance."},
    {cursor:'b4', formula:'<span class="f-fn">=SQRT(</span><span class="f-ref">B2</span><span class="f-fn">)</span>', narrate:'SQRT takes one argument — the number. Variance is 0.0256, so standard deviation = √0.0256.', speak:'SQRT takes one argument — the number. Variance is 0.0256, so standard deviation is the square root of 0.0256.'},
    {clear:true, found:'b2', setCellText:{id:'b4',text:'16.0%',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b4', cursor:'b4', narrate:'√0.0256 = 0.16 = 16% — this stock has 16% daily volatility.', speak:'Square root of 0.0256 equals 0.16 or 16 percent — this stock has 16 percent daily volatility.'},
    {hideCursor:true, formula:'<span class="f-fn">=SQRT(</span><span class="f-ref">B2</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 16%</span>', narrate:"That's SQRT! Key for volatility, standard deviation, and risk calculations. Annualize daily vol by multiplying by SQRT(252).", speak:"That's SQRT! Key for volatility, standard deviation, and risk calculations. Annualize daily vol by multiplying by SQRT of 252."}
  ]
};
