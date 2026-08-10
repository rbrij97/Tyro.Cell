/*  tyro.cell — Explainer Engine
    Data-driven animated formula tutorials.
    Each formula provides a config object; this engine renders & animates it. */

window.ExplainerEngine = (function () {
  'use strict';

  // --- TTS voice selection ---
  const synth = window.speechSynthesis;
  let bestVoice = null;
  function pickVoice() {
    const v = synth.getVoices();
    bestVoice =
      v.find(x => /Google.*Female/i.test(x.name) && x.lang.startsWith('en')) ||
      v.find(x => /Google/i.test(x.name) && x.lang.startsWith('en')) ||
      v.find(x => x.lang === 'en-IN' && !/Male/i.test(x.name)) ||
      v.find(x => x.lang === 'en-IN') ||
      v.find(x => x.lang.startsWith('en-GB') && !/Male/i.test(x.name)) ||
      v.find(x => x.lang.startsWith('en-US') && !/Male/i.test(x.name)) ||
      v.find(x => x.lang.startsWith('en')) ||
      null;
  }
  pickVoice();
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

  // --- State ---
  let speed = 1, playing = false, currentStep = -1;
  let cfg = null;    // current formula config
  let els = {};      // cached DOM elements
  let cellMap = {};  // id -> DOM element for data cells

  // --- DOM helpers ---
  const $ = id => document.getElementById(id);

  // --- Speak with fallback timeout ---
  function speak(text) {
    return new Promise(resolve => {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92 * speed;
      u.pitch = 1.08;
      u.lang = 'en-IN';
      if (bestVoice) u.voice = bestVoice;

      let done = false;
      const finish = () => { if (!done) { done = true; clearInterval(keepAlive); clearTimeout(fb); resolve(); } };
      u.onend = finish;
      u.onerror = finish;
      synth.speak(u);

      const keepAlive = setInterval(() => {
        if (!synth.speaking) { clearInterval(keepAlive); return; }
        synth.pause(); synth.resume();
      }, 10000);

      const wc = text.split(/\s+/).length;
      const ms = Math.max(2500, (wc / 2.5) * 1000) / speed;
      const fb = setTimeout(finish, ms + 500);
    });
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms / speed)); }

  // --- Cursor ---
  function moveCursor(targetEl, ox, oy) {
    if (!targetEl || !els.cursor) return;
    const area = els.sheetArea.getBoundingClientRect();
    const r = targetEl.getBoundingClientRect();
    const x = r.left - area.left + (ox ?? 10);
    const y = r.top - area.top + (oy ?? 10);
    els.cursor.style.transition = 'left .6s cubic-bezier(.25,.1,.25,1), top .6s cubic-bezier(.25,.1,.25,1)';
    els.cursor.style.left = x + 'px';
    els.cursor.style.top = y + 'px';
    els.cursor.classList.add('visible');
  }
  function hideCursor() { els.cursor && els.cursor.classList.remove('visible'); }

  // --- Cell state management ---
  const ALL_STATES = ['searching', 'not-match', 'found', 'col-highlight', 'result-glow', 'lookup-hl', 'range-hl', 'target-cell'];

  function clearCells() {
    Object.values(cellMap).forEach(el => ALL_STATES.forEach(s => el.classList.remove(s)));
  }

  function setCellState(ids, state) {
    if (!ids) return;
    (Array.isArray(ids) ? ids : [ids]).forEach(id => {
      const el = cellMap[id];
      if (el) el.classList.add(state);
    });
  }

  function removeCellState(ids, state) {
    if (!ids) return;
    (Array.isArray(ids) ? ids : [ids]).forEach(id => {
      const el = cellMap[id];
      if (el) el.classList.remove(state);
    });
  }

  // --- Subtitle ---
  function showSubtitle(text) {
    els.subtitle.classList.remove('visible');
    setTimeout(() => {
      els.subtitle.textContent = text;
      els.subtitle.classList.add('visible');
    }, 80);
  }

  // --- Formula bar ---
  function setFormula(html) { els.formulaText.innerHTML = html || ''; }

  // --- Float value animation ---
  function floatValue(fromId, toId, text) {
    return new Promise(resolve => {
      const fromEl = cellMap[fromId], toEl = cellMap[toId];
      if (!fromEl || !toEl) { resolve(); return; }
      const area = els.sheetArea.getBoundingClientRect();
      const from = fromEl.getBoundingClientRect();
      const to = toEl.getBoundingClientRect();

      const fl = document.createElement('div');
      fl.className = 'float-val';
      fl.textContent = text;
      fl.style.left = (from.left - area.left + from.width / 2) + 'px';
      fl.style.top = (from.top - area.top + from.height / 2 - 8) + 'px';
      els.sheetArea.appendChild(fl);

      requestAnimationFrame(() => {
        fl.classList.add('animating');
        const dx = (to.left - from.left) + (to.width - from.width) / 2;
        const dy = (to.top - from.top);
        fl.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      setTimeout(() => {
        fl.classList.remove('animating');
        fl.classList.add('fade-out');
        setTimeout(() => { fl.remove(); resolve(); }, 300);
      }, 900 / speed);
    });
  }

  // --- Set cell text/style ---
  function setCellText(id, text, styles) {
    const el = cellMap[id];
    if (!el) return;
    el.textContent = text;
    if (styles) Object.assign(el.style, styles);
  }

  // --- Step executor ---
  // Each step in config.steps is an object with these optional fields:
  //   narrate:    string  — subtitle text + spoken via TTS
  //   speak:      string  — override TTS text (different from subtitle, e.g. pronounce "CMP" as "C-M-P")
  //   formula:    string  — HTML for formula bar
  //   cursor:     string  — cell id to move cursor to  (or null to hide)
  //   cursorOx:   number  — cursor offset X (default 30)
  //   cursorOy:   number  — cursor offset Y (default 12)
  //   highlight:  string|string[]  — cell ids to add 'searching' state
  //   found:      string|string[]  — cell ids to add 'found' state
  //   colHighlight: string|string[] — cell ids to add 'col-highlight'
  //   resultGlow: string|string[]  — cell ids to add 'result-glow'
  //   lookupHl:   string|string[]  — cell ids to add 'lookup-hl'
  //   rangeHl:    string|string[]  — cell ids to add 'range-hl'
  //   clear:      boolean — clear all cell states before this step
  //   clearState: {ids, state} — remove a specific state from specific cells
  //   setCellText: {id, text, styles} — set text on a cell
  //   float:      {from, to, text} — animate value floating between cells
  //   hideCursor: boolean — hide cursor
  //   preDelay:   number  — ms to wait before narration (default 0)
  //   postDelay:  number  — extra ms after narration (default 0)

  async function executeStep(step) {
    if (step.clear) clearCells();
    if (step.formula !== undefined) setFormula(step.formula);
    if (step.hideCursor) hideCursor();
    if (step.cursor) moveCursor(cellMap[step.cursor], step.cursorOx ?? 30, step.cursorOy ?? 12);

    // Apply cell states
    if (step.highlight) setCellState(step.highlight, 'searching');
    if (step.found) setCellState(step.found, 'found');
    if (step.colHighlight) setCellState(step.colHighlight, 'col-highlight');
    if (step.resultGlow) setCellState(step.resultGlow, 'result-glow');
    if (step.lookupHl) setCellState(step.lookupHl, 'lookup-hl');
    if (step.rangeHl) setCellState(step.rangeHl, 'range-hl');
    if (step.clearState) removeCellState(step.clearState.ids, step.clearState.state);

    if (step.preDelay) await wait(step.preDelay);

    if (step.narrate) showSubtitle(step.narrate);

    if (step.float) await floatValue(step.float.from, step.float.to, step.float.text);

    if (step.setCellText) setCellText(step.setCellText.id, step.setCellText.text, step.setCellText.styles);

    if (step.narrate) await speak(step.speak || step.narrate);

    if (step.postDelay) await wait(step.postDelay);
  }

  // --- Progress ---
  function updateProgress() {
    if (!cfg) return;
    const total = cfg.steps.length;
    const pct = total > 0 ? ((currentStep + 1) / total) * 100 : 0;
    els.progressFill.style.width = pct + '%';
    els.stepLabel.textContent = `${Math.max(0, currentStep + 1)} / ${total}`;
  }

  // --- Reset ---
  function resetAll() {
    clearCells();
    if (cfg.targetCell) {
      const tc = cellMap[cfg.targetCell];
      if (tc) {
        tc.textContent = '?';
        tc.style.color = 'var(--hint)';
        tc.style.fontStyle = 'italic';
        tc.style.fontWeight = '';
        tc.classList.add('target-cell');
      }
    }
    setFormula('');
    els.subtitle.textContent = '';
    els.subtitle.classList.remove('visible');
    hideCursor();
    currentStep = -1;
    updateProgress();
  }

  // --- Run ---
  async function runStep(idx) {
    if (!cfg || idx >= cfg.steps.length || !playing) {
      playing = false;
      els.playIcon.innerHTML = '<polygon points="6,3 20,12 6,21"/>';
      return;
    }
    currentStep = idx;
    updateProgress();
    await executeStep(cfg.steps[idx]);
    await wait(600);
    if (playing) runStep(idx + 1);
  }

  function togglePlay() {
    if (playing) {
      playing = false;
      synth.cancel();
      els.playIcon.innerHTML = '<polygon points="6,3 20,12 6,21"/>';
    } else {
      playing = true;
      els.playIcon.innerHTML = '<rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/>';
      if (currentStep >= cfg.steps.length - 1) resetAll();
      runStep(currentStep + 1);
    }
  }

  // --- Build the sheet table from config ---
  function buildSheet(table) {
    // table: { headers: [{col:"A", label:"Ticker"}, ...], rows: [{rh:"2", cells:[{id:"a2",text:"RELIANCE",class:"col-a"}, ...]}, ...] }
    // Optional: table.gap (row index after which to insert a gap), table.extraCols (spacer columns)
    let html = '<thead><tr><th class="rh"></th>';
    table.headers.forEach(h => {
      if (h.spacer) { html += '<th style="border:none;background:transparent;width:16px"></th>'; return; }
      html += `<th>${h.label}</th>`;
    });
    html += '</tr></thead><tbody>';

    table.rows.forEach((row, ri) => {
      if (row.gap) { html += '<tr class="gap-row"><td colspan="99" style="border:none;background:transparent;padding:4px 0"></td></tr>'; return; }
      html += `<tr><th class="rh">${row.rh || ri + 1}</th>`;
      row.cells.forEach(c => {
        if (c.spacer) { html += '<td style="border:none;background:transparent"></td>'; return; }
        const cls = [c.cls || ''].filter(Boolean).join(' ');
        const id = c.id ? ` id="${c.id}"` : '';
        const style = c.style ? ` style="${c.style}"` : '';
        html += `<td${id} class="${cls}"${style}>${c.text ?? ''}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody>';
    return html;
  }

  // --- Init ---
  function init(config) {
    cfg = config;

    // Set title
    document.title = `${cfg.title} — tyro.cell Learn`;
    $('eyebrow').textContent = `Learn · ${cfg.title}`;

    // Build sheet
    const sheetEl = $('sheet');
    sheetEl.innerHTML = buildSheet(cfg.table);

    // Build cell map
    cellMap = {};
    sheetEl.querySelectorAll('td[id]').forEach(td => { cellMap[td.id] = td; });

    // Mark target cell
    if (cfg.targetCell && cellMap[cfg.targetCell]) {
      cellMap[cfg.targetCell].classList.add('target-cell');
    }

    // Cache DOM
    els = {
      formulaText: $('formulaText'),
      subtitle: $('subtitle'),
      playBtn: $('playBtn'),
      playIcon: $('playIcon'),
      progressFill: $('progressFill'),
      stepLabel: $('stepLabel'),
      cursor: $('cursor'),
      sheetArea: $('sheetArea'),
    };

    // Transport events
    els.playBtn.addEventListener('click', togglePlay);

    const speeds = [1, 1.5, 2, 0.75];
    let speedIdx = 0;
    $('speedBtn').addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      speed = speeds[speedIdx];
      $('speedBtn').innerHTML = speed + '&times;';
    });

    $('progressTrack').addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const target = Math.min(Math.floor(pct * cfg.steps.length), cfg.steps.length - 1);
      synth.cancel();
      playing = false;
      els.playIcon.innerHTML = '<polygon points="6,3 20,12 6,21"/>';
      resetAll();
      currentStep = target;
      updateProgress();
    });

    updateProgress();
  }

  return { init };
})();
