window.FORMULA_CONFIG = {
  title: 'IFERROR',
  targetCell: 'c2',

  table: {
    headers: [{label:'A'}, {label:'B'}, {label:'C'}],
    rows: [
      {rh:'1', cells:[
        {id:'a1',text:'Stock',cls:'col-a'}, {id:'b1',text:'P/E Ratio'}, {id:'c1',text:'Safe P/E'}
      ]},
      {rh:'2', cells:[
        {id:'a2',text:'RELIANCE',cls:'col-a'}, {id:'b2',text:'25.3'}, {id:'c2',text:'?',cls:'target-cell',style:'color:var(--hint);font-style:italic'}
      ]},
      {rh:'3', cells:[
        {id:'a3',text:'TCS',cls:'col-a'}, {id:'b3',text:'#N/A',style:'color:var(--red)'}, {id:'c3',text:''}
      ]},
      {rh:'4', cells:[
        {id:'a4',text:'HDFCBANK',cls:'col-a'}, {id:'b4',text:'18.4'}, {id:'c4',text:''}
      ]},
      {rh:'5', cells:[
        {id:'a5',text:'INFY',cls:'col-a'}, {id:'b5',text:'#DIV/0!',style:'color:var(--red)'}, {id:'c5',text:''}
      ]}
    ]
  },

  steps: [
    {
      hideCursor: true,
      narrate: "Let's learn IFERROR — your safety net for formula errors. Some cells have errors like #N/A or #DIV/0! and we need to handle them gracefully.",
      speak: "Let's learn IFERROR — your safety net for formula errors. Some cells have errors like N-A or divide by zero, and we need to handle them gracefully."
    },
    {
      cursor: 'b3',
      highlight: ['b3','b5'],
      narrate: 'Look at B3 and B5 — they show errors. In a financial model, these errors break downstream calculations and look unprofessional.',
      speak: 'Look at B3 and B5 — they show errors. In a financial model, these errors break downstream calculations and look unprofessional.'
    },
    {
      cursor: 'c2',
      formula: '<span class="f-fn">=IFERROR(</span><span class="typing-cursor"></span>',
      narrate: 'IFERROR takes 2 arguments: the value to try, and what to return if it errors.',
      speak: 'IFERROR takes two arguments: the value to try, and what to return if it errors.'
    },
    {
      cursor: 'b2',
      highlight: 'b2',
      formula: '<span class="f-fn">=IFERROR(</span><span class="f-ref">B2</span><span class="f-dim">,</span><span class="typing-cursor"></span>',
      narrate: 'First: the value to check — B2. If this cell has a valid value, IFERROR just returns it as-is.',
      speak: 'First: the value to check — B2. If this cell has a valid value, IFERROR just returns it as is.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=IFERROR(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-str">"N/A"</span><span class="f-fn">)</span>',
      narrate: 'Second: the fallback — "N/A" as text. If B2 has an error, show this clean text instead of the ugly error code.',
      speak: 'Second: the fallback — N-A as text. If B2 has an error, show this clean text instead of the ugly error code.'
    },
    {
      clear: true,
      cursor: 'b2',
      found: 'b2',
      narrate: 'For RELIANCE (B2 = 25.3): no error → IFERROR returns 25.3 unchanged.',
      speak: 'For Reliance, B2 equals 25.3. No error, so IFERROR returns 25.3 unchanged.'
    },
    {
      resultGlow: 'c2',
      setCellText: {id:'c2', text:'25.3', styles:{color:'var(--green-dark)', fontStyle:'normal', fontWeight:'700'}},
      cursor: 'c2',
      narrate: 'C2 gets 25.3 — the original value passes through.',
      speak: 'C2 gets 25.3 — the original value passes through.'
    },
    {
      clear: true,
      cursor: 'b3',
      highlight: 'b3',
      narrate: 'For TCS (B3 = #N/A): that\'s an error! IFERROR catches it and returns our fallback.',
      speak: 'For T-C-S, B3 equals hash N-A. That\'s an error! IFERROR catches it and returns our fallback.'
    },
    {
      setCellText: {id:'c3', text:'N/A', styles:{color:'var(--muted)', fontStyle:'italic', fontWeight:'400'}},
      colHighlight: 'c3',
      cursor: 'c3',
      narrate: 'C3 shows clean "N/A" text instead of the error. Much better for reports and dashboards.',
      speak: 'C3 shows clean N-A text instead of the error. Much better for reports and dashboards.'
    },
    {
      hideCursor: true,
      formula: '<span class="f-fn">=IFERROR(</span><span class="f-ref">B2</span><span class="f-dim">,</span> <span class="f-str">"N/A"</span><span class="f-fn">)</span>',
      narrate: "That's IFERROR! Wrap any formula that might error, and provide a clean fallback. Essential for VLOOKUP results and division formulas.",
      speak: "That's IFERROR! Wrap any formula that might error, and provide a clean fallback. Essential for V-Lookup results and division formulas."
    }
  ]
};
