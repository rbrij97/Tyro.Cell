window.FORMULA_CONFIG = {
  title: 'IF',
  targetCell: 'c2',

  table: {
    headers: [
      {label:'A'}, {label:'B'}, {label:'C'}
    ],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Return %'}, {id:'c1',text:'Verdict'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'18.5'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'7.2'}, {id:'c3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'-3.1'}, {id:'c4',text:''}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'12.8'}, {id:'c5',text:''}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'SBIN',cls:'col-a'}, {id:'b6',text:'22.4'}, {id:'c6',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn IF — Excel's decision-maker. You have stock returns and need to label each as \"Outperformer\" or \"Underperformer\" based on a 10% threshold.",
      speak: "Let's learn IF — Excel's decision-maker. You have stock returns and need to label each as Outperformer or Underperformer based on a ten percent threshold."
    },
    {
      cursor: 'b2',
      lookupHl: ['b2','b3','b4','b5','b6'],
      narrate: 'Column B has the annual return percentage for each stock. We need to check: is the return above 10% or not?',
      speak: 'Column B has the annual return percentage for each stock. We need to check: is the return above ten percent or not?'
    },
    {
      cursor: 'c2',
      formula: '<span class="f-fn">=IF(</span><span class="typing-cursor"></span>',
      narrate: 'Click cell C2 and start typing. IF takes 3 arguments: a test, value if true, value if false.',
      speak: 'Click cell C2 and start typing. IF takes three arguments: a test, value if true, value if false.'
    },
    {
      cursor: 'b2',
      highlight: 'b2',
      formula: '<span class="f-fn">=IF(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">10</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First: the logical test. B2>10 — is Reliance\'s return greater than 10%?',
      speak: 'First: the logical test. B2 greater than 10 — is Reliance\'s return greater than ten percent?'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=IF(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">10</span><span class="f-dim">,</span> <span class="f-str">"Outperformer"</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'Second: the value if TRUE. If the return IS above 10%, label it "Outperformer".',
      speak: 'Second: the value if true. If the return is above ten percent, label it Outperformer.'
    },
    {
      formula: '<span class="f-fn">=IF(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">10</span><span class="f-dim">,</span> <span class="f-str">"Outperformer"</span><span class="f-dim">,</span> <span class="f-str">"Underperformer"</span><span class="f-fn">)</span>',
      narrate: 'Third: the value if FALSE. If below or equal to 10%, label it "Underperformer". Close the bracket.',
      speak: 'Third: the value if false. If below or equal to ten percent, label it Underperformer. Close the bracket.'
    },
    {
      clear: true,
      cursor: 'b2',
      found: 'b2',
      narrate: 'Excel checks B2: 18.5. Is 18.5 > 10? YES — the condition is TRUE.',
      speak: 'Excel checks B2: eighteen point five. Is eighteen point five greater than ten? Yes — the condition is true.',
      preDelay: 300
    },
    {
      resultGlow: 'c2',
      setCellText: {id:'c2', text:'Outperformer', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      cursor: 'c2',
      narrate: 'Since TRUE, Excel returns "Outperformer" into C2. Reliance beat the benchmark!',
      speak: 'Since true, Excel returns Outperformer into C2. Reliance beat the benchmark!'
    },
    {
      clear: true,
      cursor: 'b4',
      highlight: 'b4',
      narrate: 'Now let\'s check HDFCBANK in B4: -3.1%. Is -3.1 > 10? NO — the condition is FALSE.',
      speak: 'Now let\'s check HDFC Bank in B4: minus three point one percent. Is minus three point one greater than ten? No — the condition is false.'
    },
    {
      setCellText: {id:'c4', text:'Underperformer', styles:{color:'var(--red)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: 'c4',
      cursor: 'c4',
      narrate: 'Since FALSE, Excel returns "Underperformer" into C4. HDFC Bank didn\'t meet the threshold.',
      speak: 'Since false, Excel returns Underperformer into C4. HDFC Bank didn\'t meet the threshold.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=IF(</span><span class="f-ref">B2</span><span class="f-dim">&gt;</span><span class="f-num">10</span><span class="f-dim">,</span> <span class="f-str">"Outperformer"</span><span class="f-dim">,</span> <span class="f-str">"Underperformer"</span><span class="f-fn">)</span>',
      narrate: "That's IF! A logical test, what to return when true, what to return when false. You can drag this formula down the column to classify all stocks at once.",
      speak: "That's IF! A logical test, what to return when true, what to return when false. You can drag this formula down the column to classify all stocks at once."
    }
  ]
};
