window.FORMULA_CONFIG = {
  title: 'TEXTJOIN',
  targetCell: 'b5',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'}]},
      {rh:'2', cells:[{id:'a2',text:'Banking',cls:'col-a'}, {id:'b2',text:'HDFCBANK'}]},
      {rh:'3', cells:[{id:'a3',text:'IT',cls:'col-a'}, {id:'b3',text:'TCS'}]},
      {rh:'4', cells:[{id:'a4',text:'Banking',cls:'col-a'}, {id:'b4',text:'SBIN'}]},
      {gap:true},
      {rh:'6', cells:[{id:'a6',text:'All tickers',cls:'col-a'}, {id:'b5',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn TEXTJOIN — it joins multiple values with a delimiter. We want all tickers in one cell, separated by commas.", speak:"Let's learn TEXTJOIN — it joins multiple values with a delimiter. We want all tickers in one cell, separated by commas."},
    {cursor:'b5', formula:'<span class="f-fn">=TEXTJOIN(</span><span class="f-str">", "</span><span class="f-dim">,</span> <span class="f-str">TRUE</span><span class="f-dim">,</span> <span class="f-ref">B2:B4</span><span class="f-fn">)</span>', narrate:'TEXTJOIN takes: delimiter (", "), ignore_empty (TRUE), and the range of values to join.', speak:'TEXTJOIN takes: delimiter comma-space, ignore empty as true, and the range of values to join.'},
    {clear:true, found:['b2','b3','b4'], setCellText:{id:'b5',text:'HDFCBANK, TCS, SBIN',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b5', cursor:'b5', narrate:'All three tickers joined: "HDFCBANK, TCS, SBIN" — in one clean cell.', speak:'All three tickers joined: HDFC Bank, T-C-S, S-B-I-N — in one clean cell.'},
    {hideCursor:true, formula:'<span class="f-fn">=TEXTJOIN(</span><span class="f-str">", "</span><span class="f-dim">,</span> <span class="f-str">TRUE</span><span class="f-dim">,</span> <span class="f-ref">B2:B4</span><span class="f-fn">)</span>', narrate:"That's TEXTJOIN! Much better than chaining & operators. The TRUE argument skips blank cells automatically.", speak:"That's TEXTJOIN! Much better than chaining ampersand operators. The true argument skips blank cells automatically."}
  ]
};
