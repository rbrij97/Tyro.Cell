window.FORMULA_CONFIG = {
  title: 'COUNTIFS',
  targetCell: 'e2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'}, {id:'c1',text:'Return %'},
        {spacer:true}, {id:'e1',text:'Count'}
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
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'IT',cls:'col-a'}, {id:'b6',text:'INFY'}, {id:'c6',text:'12.8'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: 'Let\'s learn COUNTIFS — COUNTIF with multiple conditions. How many Banking stocks returned above 10%?',
      speak: 'Let\'s learn COUNTIFS — COUNTIF with multiple conditions. How many Banking stocks returned above ten percent?'
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=COUNTIFS(</span><span class="typing-cursor"></span>',
      narrate: 'COUNTIFS takes pairs of arguments: range1, criteria1, range2, criteria2, and so on.',
      speak: 'COUNTIFS takes pairs of arguments: range 1, criteria 1, range 2, criteria 2, and so on.'
    },
    {
      rangeHl: ['a2','a3','a4','a5','a6'],
      formula: '<span class="f-fn">=COUNTIFS(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First pair: A2:A6 must equal "Banking" — filter by sector.',
      speak: 'First pair: A2 to A6 must equal Banking — filter by sector.'
    },
    {
      colHighlight: ['c2','c3','c4','c5','c6'],
      formula: '<span class="f-fn">=COUNTIFS(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-dim">,</span> <span class="f-str">"&gt;10"</span><span class="f-fn">)</span>',
      narrate: 'Second pair: C2:C6 must be >10 — filter by return. Both conditions must be true in the SAME row.',
      speak: 'Second pair: C2 to C6 must be greater than 10 — filter by return. Both conditions must be true in the same row.'
    },
    {
      clear: true, cursor: 'a2', found: 'a2', colHighlight: 'c2',
      narrate: 'Row 2: Banking ✓, 15.2 > 10 ✓ — both match! Count = 1.',
      speak: 'Row 2: Banking, check. 15.2 is greater than 10, check. Both match! Count is 1.', postDelay: 200
    },
    {
      cursor: 'a3', highlight: 'a3',
      narrate: 'Row 3: IT — first condition fails, skip.',
      speak: 'Row 3: I-T — first condition fails, skip.', postDelay: 200
    },
    {
      clearState: {ids:'a3', state:'searching'}, cursor: 'a4', found: 'a4', colHighlight: 'c4',
      narrate: 'Row 4: Banking ✓, 22.4 > 10 ✓ — both match! Count = 2.',
      speak: 'Row 4: Banking, check. 22.4 is greater than 10, check. Both match! Count is 2.', postDelay: 200
    },
    {
      cursor: 'a5', highlight: 'a5',
      narrate: 'Row 5: Banking ✓, but 5.3 < 10 ✗ — second condition fails.',
      speak: 'Row 5: Banking, check, but 5.3 is less than 10 — second condition fails.', postDelay: 200
    },
    {
      clearState: {ids:'a5', state:'searching'},
      float: {from:'a4', to:'e2', text:'2'},
      setCellText: {id:'e2', text:'2', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2', cursor: 'e2',
      narrate: 'COUNTIFS returns 2 — two Banking stocks beat the 10% threshold.',
      speak: 'COUNTIFS returns 2 — two Banking stocks beat the ten percent threshold.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=COUNTIFS(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-dim">,</span> <span class="f-str">"&gt;10"</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 2</span>',
      narrate: "That's COUNTIFS! Add as many range-criteria pairs as you need. Every condition must pass in the same row to count.",
      speak: "That's COUNTIFS! Add as many range-criteria pairs as you need. Every condition must pass in the same row to count."
    }
  ]
};
