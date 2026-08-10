window.FORMULA_CONFIG = {
  title: 'CONCAT / &',
  targetCell: 'c2',
  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Exchange',cls:'col-a'}, {id:'b1',text:'Ticker'}, {id:'c1',text:'Full Code'}]},
      {rh:'2', cells:[{id:'a2',text:'NSE',cls:'col-a'}, {id:'b2',text:'RELIANCE'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'BSE',cls:'col-a'}, {id:'b3',text:'TCS'}, {id:'c3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn CONCAT and the & operator — they join text together. We want to combine the exchange and ticker into one code.", speak:"Let's learn CONCAT and the ampersand operator — they join text together. We want to combine the exchange and ticker into one code."},
    {cursor:'c2', formula:'<span class="f-ref">A2</span> <span class="f-dim">&</span> <span class="f-str">":"</span> <span class="f-dim">&</span> <span class="f-ref">B2</span>', narrate:'The & operator joins values. A2 & ":" & B2 combines exchange, colon, and ticker.', speak:'The ampersand operator joins values. A2 ampersand colon ampersand B2 combines exchange, colon, and ticker.'},
    {clear:true, found:['a2','b2'], setCellText:{id:'c2',text:'NSE:RELIANCE',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'c2', cursor:'c2', narrate:'C2 gets "NSE:RELIANCE" — both cells joined with a colon separator.', speak:'C2 gets N-S-E colon Reliance — both cells joined with a colon separator.'},
    {clear:true, formula:'<span class="f-fn">=CONCAT(</span><span class="f-ref">A3</span><span class="f-dim">,</span> <span class="f-str">":"</span><span class="f-dim">,</span> <span class="f-ref">B3</span><span class="f-fn">)</span>', setCellText:{id:'c3',text:'BSE:TCS',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'600'}}, colHighlight:'c3', narrate:'CONCAT(A3,":",B3) does the same thing with function syntax. Both approaches are equivalent.', speak:'CONCAT of A3, colon, B3 does the same thing with function syntax. Both approaches are equivalent.'},
    {hideCursor:true, formula:'<span class="f-ref">A2</span> <span class="f-dim">&</span> <span class="f-str">":"</span> <span class="f-dim">&</span> <span class="f-ref">B2</span>', narrate:"That's CONCAT! Use & for quick joins, CONCAT for readability, and TEXTJOIN when you need a delimiter between many values.", speak:"That's CONCAT! Use ampersand for quick joins, CONCAT for readability, and TEXTJOIN when you need a delimiter between many values."}
  ]
};
