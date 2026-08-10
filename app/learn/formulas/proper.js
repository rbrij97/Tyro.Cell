window.FORMULA_CONFIG = {
  title: 'PROPER',
  targetCell: 'b2',
  table: {
    headers: [{label:'A'}, {label:'B'}],
    rows: [
      {rh:'1', cells:[{id:'a1',text:'Raw Name',cls:'col-a'}, {id:'b1',text:'Formatted'}]},
      {rh:'2', cells:[{id:'a2',text:'RAHUL SHARMA',cls:'col-a'}, {id:'b2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}]},
      {rh:'3', cells:[{id:'a3',text:'priya PATEL',cls:'col-a'}, {id:'b3',text:''}]}
    ]
  },
  steps: [
    {hideCursor:true, narrate:"Let's learn PROPER — it capitalizes the first letter of each word. Perfect for formatting client names from messy data.", speak:"Let's learn PROPER — it capitalizes the first letter of each word. Perfect for formatting client names from messy data."},
    {cursor:'b2', formula:'<span class="f-fn">=PROPER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:'PROPER takes one argument — converts "RAHUL SHARMA" to title case.', speak:'PROPER takes one argument — converts RAHUL SHARMA to title case.'},
    {clear:true, found:'a2', setCellText:{id:'b2',text:'Rahul Sharma',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'700'}}, resultGlow:'b2', cursor:'b2', narrate:'"RAHUL SHARMA" becomes "Rahul Sharma" — professional and readable.', speak:'RAHUL SHARMA becomes Rahul Sharma — professional and readable.'},
    {clear:true, setCellText:{id:'b3',text:'Priya Patel',styles:{color:'var(--green-dark)',fontStyle:'normal',fontWeight:'600'}}, colHighlight:'b3', narrate:'"priya PATEL" becomes "Priya Patel" — handles any mix of cases.', speak:'priya PATEL becomes Priya Patel — handles any mix of cases.'},
    {hideCursor:true, formula:'<span class="f-fn">=PROPER(</span><span class="f-ref">A2</span><span class="f-fn">)</span>', narrate:"That's PROPER! Great for names and titles. Note: it also capitalizes after apostrophes — \"o'brien\" becomes \"O'Brien\".", speak:"That's PROPER! Great for names and titles. Note: it also capitalizes after apostrophes."}
  ]
};
