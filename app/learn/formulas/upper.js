window.FORMULA_CONFIG = {
  title: 'UPPER',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Input',cls:'col-a'}, {id:'b1',text:'Result'}]},
      {rh:'2', cells:[{id:'a2',text:'reliance Industries',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'Hdfc Bank Ltd',cls:'col-a'}, {id:'b3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn UPPER — it converts text to ALL CAPS. Essential for standardizing ticker symbols and codes.", speak:"Let's learn UPPER — it converts text to all caps. Essential for standardizing ticker symbols and codes."},
    {cursor:'b2', formula:'<span class="f-fn">=UPPER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:'UPPER takes one argument — the text to capitalize.', speak:'UPPER takes one argument — the text to capitalize.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'RELIANCE INDUSTRIES',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'"reliance Industries" becomes "RELIANCE INDUSTRIES" — every letter uppercased.', speak:'reliance Industries becomes RELIANCE INDUSTRIES — every letter uppercased.'},
    {hideCursor:true, formula:'<span class="f-fn">=UPPER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:"That's UPPER! LOWER does the opposite (all lowercase), and PROPER capitalizes the first letter of each word.", speak:"That's UPPER! LOWER does the opposite, all lowercase, and PROPER capitalizes the first letter of each word."}
  ]
};
