window.FORMULA_CONFIG = {
  title: 'COUNTIF',
  targetCell: 'e2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {spacer:true}, {label:'E'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'},
        {spacer:true},
        {id:'e1',text:'Banking Count'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'Banking',cls:'col-a'}, {id:'b2',text:'HDFCBANK'},
        {spacer:true},
        {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'IT',cls:'col-a'}, {id:'b3',text:'TCS'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'Banking',cls:'col-a'}, {id:'b4',text:'SBIN'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'Oil & Gas',cls:'col-a'}, {id:'b5',text:'RELIANCE'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'Banking',cls:'col-a'}, {id:'b6',text:'KOTAKBANK'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn COUNTIF — it counts cells that match a condition. How many Banking stocks are in this portfolio?",
      speak: "Let's learn COUNTIF — it counts cells that match a condition. How many Banking stocks are in this portfolio?"
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=COUNTIF(</span><span class="typing-cursor"></span>',
      narrate: 'COUNTIF takes 2 arguments: the range to search, and the criteria to match.',
      speak: 'COUNTIF takes two arguments: the range to search, and the criteria to match.'
    },
    {
      cursor: 'a2', cursorOx: 8, cursorOy: 8,
      rangeHl: ['a2','a3','a4','a5','a6'],
      formula: '<span class="f-fn">=COUNTIF(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First: the range — A2:A6, the Sector column.',
      speak: 'First: the range — A2 to A6, the Sector column.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=COUNTIF(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-fn">)</span>',
      narrate: 'Second: the criteria — "Banking". Count every cell that says Banking.',
      speak: 'Second: the criteria — Banking. Count every cell that says Banking.'
    },
    {
      clear: true, cursor: 'a2', found: 'a2',
      narrate: 'Row 2: Banking — match! Count = 1.',
      speak: 'Row 2: Banking — match! Count is 1.', postDelay: 200
    },
    {
      cursor: 'a3', highlight: 'a3',
      narrate: 'Row 3: IT — skip.', speak: 'Row 3: I-T — skip.', postDelay: 200
    },
    {
      clearState: {ids:'a3', state:'searching'}, cursor: 'a4', found: 'a4',
      narrate: 'Row 4: Banking — match! Count = 2.', speak: 'Row 4: Banking — match! Count is 2.', postDelay: 200
    },
    {
      cursor: 'a5', highlight: 'a5',
      narrate: 'Row 5: Oil & Gas — skip.', speak: 'Row 5: Oil and Gas — skip.', postDelay: 200
    },
    {
      clearState: {ids:'a5', state:'searching'}, cursor: 'a6', found: 'a6',
      narrate: 'Row 6: Banking — match! Count = 3.', speak: 'Row 6: Banking — match! Count is 3.'
    },
    {
      float: {from:'a6', to:'e2', text:'3'},
      setCellText: {id:'e2', text:'3', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2', cursor: 'e2',
      narrate: 'COUNTIF returns 3 — there are 3 Banking stocks in the portfolio.',
      speak: 'COUNTIF returns 3 — there are three Banking stocks in the portfolio.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=COUNTIF(</span><span class="f-ref">A2:A6</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 3</span>',
      narrate: "That's COUNTIF! Range and criteria — it counts matching cells. For multiple conditions, use COUNTIFS.",
      speak: "That's COUNTIF! Range and criteria — it counts matching cells. For multiple conditions, use COUNTIFS."
    }
  ]
};
