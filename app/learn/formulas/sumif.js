window.FORMULA_CONFIG = {
  title: 'SUMIF',
  targetCell: 'e2',

  table: {
    headers: [
      {label:'A'}, {label:'B'}, {label:'C'},
      {spacer:true},
      {label:'E'}
    ],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Sector',cls:'col-a'}, {id:'b1',text:'Stock'}, {id:'c1',text:'AUM (₹ Cr)'},
        {spacer:true},
        {id:'e1',text:'Banking Total'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'Banking',cls:'col-a'}, {id:'b2',text:'HDFCBANK'}, {id:'c2',text:'8,450'},
        {spacer:true},
        {id:'e2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'IT',cls:'col-a'}, {id:'b3',text:'TCS'}, {id:'c3',text:'5,200'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'Banking',cls:'col-a'}, {id:'b4',text:'SBIN'}, {id:'c4',text:'6,300'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'Oil & Gas',cls:'col-a'}, {id:'b5',text:'RELIANCE'}, {id:'c5',text:'12,100'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'6', cells:[
        {id:'a6',text:'IT',cls:'col-a'}, {id:'b6',text:'INFY'}, {id:'c6',text:'4,800'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]},
      {rh:'7', cells:[
        {id:'a7',text:'Banking',cls:'col-a'}, {id:'b7',text:'KOTAKBANK'}, {id:'c7',text:'7,250'},
        {spacer:true},
        {text:'',style:'border:none;background:transparent'}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn SUMIF — conditional summing. You have a fund's portfolio by sector, and need the total AUM allocated to Banking stocks only.",
      speak: "Let's learn SUMIF — conditional summing. You have a fund's portfolio by sector, and need the total A-U-M allocated to Banking stocks only."
    },
    {
      cursor: 'a2',
      lookupHl: ['a2','a4','a7'],
      narrate: 'Column A has sectors. Notice "Banking" appears three times — rows 2, 4, and 7. We want to sum only those rows.',
      speak: 'Column A has sectors. Notice Banking appears three times — rows 2, 4, and 7. We want to sum only those rows.'
    },
    {
      cursor: 'e2',
      formula: '<span class="f-fn">=SUMIF(</span><span class="typing-cursor"></span>',
      narrate: 'Click cell E2 and start typing. SUMIF takes 3 arguments: range to test, criteria, and range to sum.',
      speak: 'Click cell E2 and start typing. SUMIF takes three arguments: range to test, criteria, and range to sum.'
    },
    {
      clear: true,
      cursor: 'a2', cursorOx: 8, cursorOy: 8,
      rangeHl: ['a2','a3','a4','a5','a6','a7'],
      formula: '<span class="f-fn">=SUMIF(</span><span class="f-ref">A2:A7</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First: the range to check. A2:A7 is the Sector column — Excel will test each cell in this range.',
      speak: 'First: the range to check. A2 to A7 is the Sector column — Excel will test each cell in this range.',
      preDelay: 400
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=SUMIF(</span><span class="f-ref">A2:A7</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'Second: the criteria — "Banking". Only rows where column A equals "Banking" will be included in the sum.',
      speak: 'Second: the criteria — Banking. Only rows where column A equals Banking will be included in the sum.'
    },
    {
      cursor: 'c2', cursorOx: 8, cursorOy: 8,
      colHighlight: ['c2','c3','c4','c5','c6','c7'],
      formula: '<span class="f-fn">=SUMIF(</span><span class="f-ref">A2:A7</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C7</span><span class="f-fn">)</span>',
      narrate: 'Third: the sum range — C2:C7, the AUM column. Excel sums values from HERE, but only for matching rows. Close the bracket.',
      speak: 'Third: the sum range — C2 to C7, the A-U-M column. Excel sums values from here, but only for matching rows. Close the bracket.'
    },
    {
      clear: true,
      cursor: 'a2',
      highlight: 'a2',
      narrate: 'Excel scans column A. Row 2: "Banking" — match! It notes C2: 8,450.',
      speak: 'Excel scans column A. Row 2: Banking — match! It notes C2: eight thousand four hundred fifty.',
      postDelay: 200
    },
    {
      clearState: {ids:'a2', state:'searching'},
      found: 'a2',
      colHighlight: 'c2',
      cursor: 'a3',
      highlight: 'a3',
      narrate: 'Row 3: "IT" — no match. Skip.',
      speak: 'Row 3: I-T — no match. Skip.',
      postDelay: 200
    },
    {
      clearState: {ids:'a3', state:'searching'},
      cursor: 'a4',
      highlight: 'a4',
      narrate: 'Row 4: "Banking" — match! It notes C4: 6,300.',
      speak: 'Row 4: Banking — match! It notes C4: six thousand three hundred.',
      postDelay: 200
    },
    {
      clearState: {ids:'a4', state:'searching'},
      found: 'a4',
      colHighlight: 'c4',
      cursor: 'a5',
      highlight: 'a5',
      narrate: 'Row 5: "Oil & Gas" — no match. Row 6: "IT" — no match.',
      speak: 'Row 5: Oil and Gas — no match. Row 6: I-T — no match.',
      postDelay: 200
    },
    {
      clearState: {ids:'a5', state:'searching'},
      cursor: 'a7',
      highlight: 'a7',
      narrate: 'Row 7: "Banking" — match! It notes C7: 7,250.',
      speak: 'Row 7: Banking — match! It notes C7: seven thousand two hundred fifty.'
    },
    {
      clearState: {ids:'a7', state:'searching'},
      found: 'a7',
      colHighlight: 'c7',
      narrate: 'Three matches found. Excel now adds: 8,450 + 6,300 + 7,250 = 22,000.',
      speak: 'Three matches found. Excel now adds: eight thousand four hundred fifty plus six thousand three hundred plus seven thousand two hundred fifty equals twenty-two thousand.',
      preDelay: 300
    },
    {
      float: {from:'c4', to:'e2', text:'22,000'},
      setCellText: {id:'e2', text:'22,000', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'e2',
      cursor: 'e2',
      narrate: 'The total Banking AUM flows into E2: ₹22,000 crore!',
      speak: 'The total Banking A-U-M flows into E2: twenty-two thousand crore!'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=SUMIF(</span><span class="f-ref">A2:A7</span><span class="f-dim">,</span> <span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">C2:C7</span><span class="f-fn">)</span> <span style="color:var(--green);font-weight:600">→ 22,000</span>',
      narrate: "That's SUMIF! Test range, criteria, sum range. It's like SUM with a filter built in. For multiple conditions, upgrade to SUMIFS.",
      speak: "That's SUMIF! Test range, criteria, sum range. It's like SUM with a filter built in. For multiple conditions, upgrade to SUMIFS."
    }
  ]
};
