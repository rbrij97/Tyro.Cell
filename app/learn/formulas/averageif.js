window.FORMULA_CONFIG = {
  title: 'AVERAGEIF',
  targetCell: 'e2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'}, {id:'c1',text:'P/E'},
        {spacer:true}, {id:'e1',text:'Avg IT P/E'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'IT',cls:'col-a'}, {id:'b2',text:'TCS'}, {id:'c2',text:'28.7'},
        {spacer:true}, {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'Banking',cls:'col-a'}, {id:'b3',text:'HDFCBANK'}, {id:'c3',text:'18.4'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'IT',cls:'col-a'}, {id:'b4',text:'INFY'}, {id:'c4',text:'24.6'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'Oil & Gas',cls:'col-a'}, {id:'b5',text:'RELIANCE'}, {id:'c5',text:'25.3'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'IT',cls:'col-a'}, {id:'b6',text:'WIPRO'}, {id:'c6',text:'22.1'},
        {spacer:true}, {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn AVERAGEIF — it averages cells that match a condition. What's the average P/E ratio for IT stocks?",
      speak: "Let's learn AVERAGEIF — it averages cells that match a condition. What's the average P-E ratio for I-T stocks?"
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=AVERAGEIF(</span><span class="typing-cursor"></span>',
      narrate: 'Same pattern as SUMIF: range, criteria, average_range.',
      speak: 'Same pattern as SUMIF: range, criteria, average range.'
    },
    {
      rangeHl: ['a2','a3','a4','a5','a6'],
      formula: '<span class="f-fn">=AVERAGEIF(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"IT"</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-fn">)</span>',
      narrate: 'Check A2:A6 for "IT", then average the matching values from C2:C6.',
      speak: 'Check A2 to A6 for I-T, then average the matching values from C2 to C6.'
    },
    {
      clear: true, cursor: 'a2', found: 'a2', colHighlight: 'c2',
      narrate: 'Row 2: IT ✓ → take C2 = 28.7', speak: 'Row 2: I-T, match. Take C2: 28.7.', postDelay: 200
    },
    {
      cursor: 'a3', highlight: 'a3',
      narrate: 'Row 3: Banking — skip.', speak: 'Row 3: Banking — skip.', postDelay: 200
    },
    {
      clearState: {ids:'a3', state:'searching'}, cursor: 'a4', found: 'a4', colHighlight: 'c4',
      narrate: 'Row 4: IT ✓ → take C4 = 24.6', speak: 'Row 4: I-T, match. Take C4: 24.6.', postDelay: 200
    },
    {
      cursor: 'a6', found: 'a6', colHighlight: 'c6',
      narrate: 'Row 6: IT ✓ → take C6 = 22.1. Three IT stocks found.',
      speak: 'Row 6: I-T, match. Take C6: 22.1. Three I-T stocks found.'
    },
    {
      narrate: 'Average = (28.7 + 24.6 + 22.1) ÷ 3 = 25.1',
      speak: 'Average equals 28.7 plus 24.6 plus 22.1, divided by 3, equals 25.1.', preDelay: 300
    },
    {
      float: {from:'c4', to:'e2', text:'25.1'},
      setCellText: {id:'e2', text:'25.1', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2', cursor: 'e2',
      narrate: 'The average IT sector P/E is 25.1!',
      speak: 'The average I-T sector P-E is 25.1!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=AVERAGEIF(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"IT"</span><span class="f-dim">,</span> <span class="f-ref">C2:C6</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 25.1</span>',
      narrate: "That's AVERAGEIF! Like SUMIF but divides by the count of matches. For multiple conditions, use AVERAGEIFS.",
      speak: "That's AVERAGEIF! Like SUMIF but divides by the count of matches. For multiple conditions, use AVERAGEIFS."
    }
  ]
};
