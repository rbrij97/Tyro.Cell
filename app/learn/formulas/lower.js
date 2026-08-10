window.FORMULA_CONFIG = {
  title: 'LOWER',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Email (Raw)',cls:'col-a'}, {id:'b1',text:'Email (Clean)'}]},
      {rh:'2', cells:[{id:'a2',text:'Rahul.SHARMA@NSE.co.in',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn LOWER — it converts text to all lowercase. Email addresses should be lowercase for consistency.", speak:"Let's learn LOWER — it converts text to all lowercase. Email addresses should be lowercase for consistency."},
    {cursor:'b2', formula:'<span class="f-fn">=LOWER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:'LOWER takes one argument — the text to convert.', speak:'LOWER takes one argument — the text to convert.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'rahul.sharma@nse.co.in',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'Clean lowercase email — ready for mail merge or database import.', speak:'Clean lowercase email — ready for mail merge or database import.'},
    {hideCursor:true, formula:'<span class="f-fn">=LOWER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:"That's LOWER! Simple but critical for data standardization. Combine with TRIM for the cleanest text.", speak:"That's LOWER! Simple but critical for data standardization. Combine with TRIM for the cleanest text."}
  ]
};
