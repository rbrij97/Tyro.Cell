window.FORMULA_CONFIG = {
  title: 'AVERAGEIFS',
  targetCell: 'e2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'}, {id:'c1',text:'Return %'},
        {spacer:true}, {id:'e1',text:'Avg Return'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'Banking',cls:'col-a'}, {id:'b2',text:'HDFCBANK'}, {id:'c2',text:'15.2'},
        {spacer:true}, {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'IT',cls:'col-a'}, {id:'b3',text:'TCS'}, {id:'c3',text:'8.1'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'Banking',cls:'col-a'}, {id:'b4',text:'SBIN'}, {id:'c4',text:'22.4'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'Banking',cls:'col-a'}, {id:'b5',text:'KOTAKBANK'}, {id:'c5',text:'5.3'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: 'Let\'s learn AVERAGEIFS — average with multiple conditions. What\'s the average return of Banking stocks that returned above 10%?',
      speak: 'Let\'s learn AVERAGEIFS — average with multiple conditions. What\'s the average return of Banking stocks that returned above ten percent?'
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=AVERAGEIFS(</span><span class="typing-cursor"></span>',
      narrate: 'Key difference from SUMIFS/COUNTIFS: the average range comes FIRST, then the criteria pairs.',
      speak: 'Key difference from SUMIFS and COUNTIFS: the average range comes first, then the criteria pairs.'
    },
    {
      colHighlight: ['c2','c3','c4','c5'],
      formula: '<span class="f-fn">=AVERAGEIFS(</span><span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-ref">A2:A5</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-str">"&gt;10"</span><span class="f-fn">)</span>',
      narrate: 'Average C2:C5, where A2:A5 = "Banking" AND C2:C5 > 10.',
      speak: 'Average C2 to C5, where A2 to A5 equals Banking, and C2 to C5 is greater than 10.'
    },
    {
      clear: true, cursor: 'a2', found: 'a2', colHighlight: 'c2',
      narrate: 'Row 2: Banking ✓, 15.2 > 10 ✓ → include 15.2',
      speak: 'Row 2: Banking, check. 15.2 greater than 10, check. Include 15.2.', postDelay: 200
    },
    {
      cursor: 'a4', found: 'a4', colHighlight: 'c4',
      narrate: 'Row 4: Banking ✓, 22.4 > 10 ✓ → include 22.4',
      speak: 'Row 4: Banking, check. 22.4 greater than 10, check. Include 22.4.', postDelay: 200
    },
    {
      cursor: 'a5', highlight: 'a5',
      narrate: 'Row 5: Banking ✓, but 5.3 < 10 ✗ → excluded.',
      speak: 'Row 5: Banking, check, but 5.3 less than 10 — excluded.'
    },
    {
      clearState: {ids:'a5', state:'searching'},
      narrate: 'Average = (15.2 + 22.4) ÷ 2 = 18.8',
      speak: 'Average equals 15.2 plus 22.4, divided by 2, equals 18.8.', preDelay: 300
    },
    {
      float: {from:'c4', to:'e2', text:'18.8'},
      setCellText: {id:'e2', text:'18.8', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2', cursor: 'e2',
      narrate: 'AVERAGEIFS returns 18.8% — the mean return of qualifying Banking stocks.',
      speak: 'AVERAGEIFS returns 18.8 percent — the mean return of qualifying Banking stocks.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=AVERAGEIFS(</span><span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-ref">A2:A5</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C5</span><span class="f-dim">,</span> <span class="f-str">"&gt;10"</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 18.8</span>',
      narrate: "That's AVERAGEIFS! Remember: average range first, then criteria pairs. The S at the end means multiple conditions.",
      speak: "That's AVERAGEIFS! Remember: average range first, then criteria pairs. The S at the end means multiple conditions."
    }
  ]
};
