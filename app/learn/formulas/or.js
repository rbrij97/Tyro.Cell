window.FORMULA_CONFIG = {
  title: 'OR',
  targetCell: 'c2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'Sector'}, {id:'c1',text:'Cyclical?'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'Oil & Gas'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'IT'}, {id:'c3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'TATASTEEL',cls:'col-a'}, {id:'b4',text:'Metals'}, {id:'c4',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn OR — it checks if ANY condition is true. A stock is cyclical if its sector is Banking, Metals, or Oil & Gas.",
      speak: "Let's learn OR — it checks if any condition is true. A stock is cyclical if its sector is Banking, Metals, or Oil and Gas."
    },
    {
      cursor: 'c2',
      formula: '<span class="f-fn">=OR(</span><span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Metals"</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Oil & Gas"</span><span class="f-fn">)</span>',
      narrate: 'OR takes multiple conditions. If ANY one is true, OR returns TRUE.',
      speak: 'OR takes multiple conditions. If any one is true, OR returns true.'
    },
    {
      clear: true, cursor: 'b2', found: 'b2',
      narrate: 'RELIANCE sector = "Oil & Gas". That matches the third condition — one match is enough!',
      speak: 'Reliance sector is Oil and Gas. That matches the third condition — one match is enough!'
    },
    {
      setCellText: {id:'c2', text:'TRUE', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      resultGlow: 'c2',
      narrate: 'OR returns TRUE — Reliance is cyclical.',
      speak: 'OR returns true — Reliance is cyclical.'
    },
    {
      clear: true, cursor: 'b3', highlight: 'b3',
      setCellText: {id:'c3', text:'FALSE', styles:{color:'var(--red)', fontStyle:'normal', fontWeight:'600'}},
      colHighlight: 'c3',
      narrate: 'TCS sector = "IT". None of the conditions match → OR returns FALSE.',
      speak: 'T-C-S sector is I-T. None of the conditions match, so OR returns false.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=OR(</span><span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Banking"</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Metals"</span><span class="f-dim">,</span> <span class="f-ref">B2</span><span class="f-dim">=</span><span class="f-str">"Oil & Gas"</span><span class="f-fn">)</span>',
      narrate: "That's OR! Any condition can trigger it. AND needs all to be true; OR needs just one. Use them together inside IF for complex screening.",
      speak: "That's OR! Any condition can trigger it. AND needs all to be true; OR needs just one. Use them together inside IF for complex screening."
    }
  ]
};
