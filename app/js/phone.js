"use strict";
/* phone.js — the practice screen on a phone (screens up to 700px wide).
   Classic script, loaded after grid.js and before app.js (app.js runs the first route on load); shares the global scope.

   1. Formula keys: a strip above the phone keyboard with = ( ) : , " $ and
      the exercise's function, since phone keyboards hide those symbols.
   2. Editing: tap a cell to select it, tap it again (or the formula bar) to
      type. While a formula is open, tapping a cell adds its reference; tap
      ":" then another cell for a range. Leaving the formula bar saves it.
   3. Easy exercises work fully. Medium and hard ones (longer case studies)
      first show a "built for a bigger screen" card: Continue on laptop / Try anyway.
   4. After 3 passes in one sitting, a one-time-a-day note suggests the laptop.
   5. "Continue on laptop" makes a link that carries progress (#/sync/…), shared
      via the phone's share sheet or copied. Only exercise ids and practice
      days are in it; the part after # never reaches the server.
      Goes away once sign-in syncs progress (next stage). */

const phoneMQ=window.matchMedia("(max-width: 700px)");
function isPhone(){ return phoneMQ.matches; }

/* ---------- small toast ---------- */
function toast(msg,ms){
  let t=document.getElementById("tyToast");
  if(!t){ t=document.createElement("div"); t.id="tyToast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.textContent=msg; t.classList.add("on");
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove("on"),ms||3200);
}

/* ---------- progress link ---------- */
const SYNC_DAYS=60;
function progressLink(){
  const ids=[...doneEx].filter(id=>EX[id]).join(".");
  const days=loadDays().slice(-SYNC_DAYS).map(d=>d.replace(/-/g,"")).join(".");
  const last=lsGet(LS_LAST)||"";
  // the app's folder: "/app", "/app/" and "/app/index.html" all become "/app/"
  let dir=location.pathname;
  if(/\.[a-z0-9]+$/i.test(dir)) dir=dir.replace(/[^\/]*$/,""); else if(!dir.endsWith("/")) dir+="/";
  const base=location.origin+dir;
  return base+"#/sync/v1/"+(ids||"-")+"/"+(days||"-")+"/"+(EX[last]?last:"-");
}
async function continueOnLaptop(){
  const url=progressLink(), n=doneEx.size;
  const text=n?`My tyro.cell progress (${n} exercise${n>1?"s":""} done). Open on a laptop to continue:`:"Continue tyro.cell on a laptop:";
  if(navigator.share){
    try{ await navigator.share({title:"tyro.cell",text,url}); return; }
    catch(e){ if(e&&e.name==="AbortError") return; }
  }
  try{ await navigator.clipboard.writeText(url); toast("Link copied. Send it to yourself and open it on your laptop."); }
  catch(e){ window.prompt("Copy this link and open it on your laptop:",url); }
}
/* #/sync/v1/<ids>/<days>/<last> — merge, never remove */
function applySync(parts){
  if(parts[0]!=="v1") return showNotFound();
  const ids=(parts[1]&&parts[1]!=="-"?parts[1].split("."):[]).filter(id=>EX[id]);
  const before=doneEx.size;
  ids.forEach(id=>doneEx.add(id)); saveDone();
  const days=(parts[2]&&parts[2]!=="-"?parts[2].split("."):[]).filter(d=>/^\d{8}$/.test(d)).map(d=>d.slice(0,4)+"-"+d.slice(4,6)+"-"+d.slice(6));
  if(days.length){ const all=[...new Set(loadDays().concat(days))].sort(); lsSet(LS_DAYS,JSON.stringify(all.slice(-400))); }
  const last=parts[3]; if(last&&EX[last]&&!lsGet(LS_LAST)) lsSet(LS_LAST,last);
  const added=doneEx.size-before;
  showHome();   // replaces the sync URL, so Back and Refresh don't re-import
  toast(added?`Progress added: ${added} exercise${added>1?"s":""} from your phone.`:"You're up to date. Nothing new to add.",4200);
}

/* ---------- the card over the sheet: case-study gate and the laptop nudge ---------- */
const triedAnyway=new Set();      // this sitting only
function phoneCard(kind){
  closePhoneCard();
  const ex=currentEx; if(!ex) return;
  const card=document.createElement("div");
  card.id="phoneCard"; card.className="ph-card-back";
  const LV={medium:"Medium",hard:"Hard"};
  card.innerHTML= kind==="gate" ? `
    <div class="ph-card" role="dialog" aria-modal="true" aria-labelledby="phCardTitle">
      <span class="ws-lvl ${ex.lvl}">${LV[ex.lvl]||ex.lvl}</span>
      <h2 id="phCardTitle">This one's built for a bigger screen.</h2>
      <p>${esc(shortTitle(ex.title))} has more data and a longer formula. It's much easier with a laptop keyboard.</p>
      <button class="ws-primary" data-ph="laptop">Continue on laptop</button>
      <button class="ws-secondary" data-ph="try">Try anyway</button>
      <a class="ph-link" data-ph="easy" href="#">Next easy exercise →</a>
    </div>` : `
    <div class="ph-card" role="dialog" aria-modal="true" aria-labelledby="phCardTitle">
      <span class="ph-emoji" aria-hidden="true">🔥</span>
      <h2 id="phCardTitle">Nice streak!</h2>
      <p>Practice is faster on a laptop with a real keyboard. Take your progress with you.</p>
      <button class="ws-primary" data-ph="laptop">Continue on laptop</button>
      <button class="ws-secondary" data-ph="close">Keep going here</button>
    </div>`;
  document.getElementById("view-app").appendChild(card);
  const nextEasy=nextEasyEx();
  const easyLink=card.querySelector('[data-ph="easy"]');
  if(easyLink){ if(nextEasy) easyLink.href="#/practice/"+encodeURIComponent(nextEasy); else easyLink.remove(); }
  card.addEventListener("click",e=>{
    const b=e.target.closest("[data-ph]"); if(!b) return;
    const a=b.dataset.ph;
    if(a==="laptop"){ continueOnLaptop(); }
    else if(a==="try"){ triedAnyway.add(currentExId); closePhoneCard(); }
    else if(a==="close"){ closePhoneCard(); }
    else if(a==="easy"){ closePhoneCard(); }
  });
  setTimeout(()=>{ const f=card.querySelector("button"); if(f) f.focus(); },50);
}
function closePhoneCard(){ const c=document.getElementById("phoneCard"); if(c) c.remove(); }
function nextEasyEx(){
  const c=currentCourse||courseOfEx(currentExId); if(!c) return null;
  const list=flatEx(c), i=list.indexOf(currentExId);
  const after=list.slice(i+1).concat(list.slice(0,i));
  return after.find(id=>EX[id].lvl==="easy"&&!doneEx.has(id))||after.find(id=>EX[id].lvl==="easy")||null;
}
function phoneAfterOpen(exId){
  closePhoneCard();
  const ex=EX[exId];
  if(isPhone()&&ex&&ex.lvl!=="easy"&&!triedAnyway.has(exId)) phoneCard("gate");
}
let passesThisSitting=0;
const LS_NUDGE="tyro_phone_nudge_v1";
function phoneAfterPass(newlyDone){
  if(!isPhone()||!newlyDone) return;
  passesThisSitting++;
  if(passesThisSitting>=3&&lsGet(LS_NUDGE)!==dayKey()){
    lsSet(LS_NUDGE,dayKey());
    setTimeout(()=>{ if(isPhone()) phoneCard("nudge"); },1400);   // after the pass stamp has played
  }
}

/* ---------- formula keys above the keyboard ---------- */
const KEYS=["=","(",")",":",",",'"',"$","+","-","*","/","&","<",">"];
const keyStrip=document.createElement("div");
keyStrip.id="phoneKeys"; keyStrip.setAttribute("role","toolbar"); keyStrip.setAttribute("aria-label","Formula keys");
document.body.appendChild(keyStrip);
function fnNamesFor(ex){
  const out=[];
  if(ex){
    String(ex.fn||"").split(/[^A-Z.]+/).forEach(n=>{ if(n&&FUNCS[n]&&!out.includes(n)) out.push(n); });
    (ex.requires||[]).forEach(r=>{ const m=/^([A-Z.]+)\($/.exec(r); if(m&&FUNCS[m[1]]&&!out.includes(m[1])) out.push(m[1]); });
  }
  return out.slice(0,3);
}
function renderKeys(){
  const fns=fnNamesFor(currentEx);
  keyStrip.innerHTML=
    fns.map(f=>`<button type="button" class="pk fn" data-ins="${f}(">${f}</button>`).join("")+
    KEYS.map(k=>`<button type="button" class="pk" data-ins="${k.replace(/"/g,"&quot;")}">${esc(k)}</button>`).join("")+
    `<button type="button" class="pk enter" data-enter="1" aria-label="Enter">Enter ↵</button>`;
}
function activeEditor(){
  const a=document.activeElement;
  if(a===fInput) return a;
  if(a&&a.tagName==="INPUT"&&a.closest&&a.closest("#grid")) return a;
  return null;
}
// mousedown/touchstart default would blur the input and close the keyboard
keyStrip.addEventListener("mousedown",e=>e.preventDefault());
keyStrip.addEventListener("touchstart",e=>{ if(e.target.closest(".pk")) e.preventDefault(); },{passive:false});
keyStrip.addEventListener("touchend",e=>{ const b=e.target.closest(".pk"); if(b){ e.preventDefault(); pressKey(b); } },{passive:false});
keyStrip.addEventListener("click",e=>{ const b=e.target.closest(".pk"); if(b) pressKey(b); });
function pressKey(b){
  const el=activeEditor(); if(!el) return;
  if(b.dataset.enter){
    el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}));
    return;
  }
  endPoint();
  let ins=b.dataset.ins;
  if(ins!=="="&&el.value===""&&/^[A-Z.]+\($/.test(ins)) ins="="+ins;   // tapping SUM on an empty cell starts the formula
  const s=el.selectionStart??el.value.length, t=el.selectionEnd??el.value.length;
  el.value=el.value.slice(0,s)+ins+el.value.slice(t);
  const p=s+ins.length; el.setSelectionRange(p,p);
  el.dispatchEvent(new Event("input",{bubbles:true}));
}
function placeKeys(){
  const vv=window.visualViewport;
  const bottom=vv?Math.max(0,window.innerHeight-(vv.height+vv.offsetTop)):0;
  keyStrip.style.bottom=bottom+"px";
}
function syncKeys(){
  const on=isPhone()&&!!activeEditor()&&document.getElementById("view-app").classList.contains("on");
  if(on&&!keyStrip.classList.contains("on")){ renderKeys(); placeKeys(); }
  keyStrip.classList.toggle("on",on);
  document.body.classList.toggle("ph-typing",on);
}
document.addEventListener("focusin",()=>setTimeout(syncKeys,0));
document.addEventListener("focusout",()=>setTimeout(syncKeys,60));
if(window.visualViewport){
  window.visualViewport.addEventListener("resize",placeKeys);
  window.visualViewport.addEventListener("scroll",placeKeys);
}

/* ---------- formula bar on a phone: remember the cell, save on leaving ---------- */
let fEditRef=null, fEditStart="";
fInput.addEventListener("focus",()=>{ fEditRef=refOf(sel.r,sel.c); fEditStart=fInput.value; });
// Enter and Escape in the formula bar already commit / cancel: forget the pending edit first
fInput.addEventListener("keydown",e=>{
  if(e.key==="Enter"||e.key==="Escape"){
    fEditRef=null;
    // on a phone, Enter also closes the keyboard so the result and the task come back
    if(isPhone()) setTimeout(()=>fInput.blur(),0);
  }
},true);
function commitFormulaBar(){
  if(!fEditRef) return;
  const ref=fEditRef; fEditRef=null;
  if(fInput.value===fEditStart) return;
  endPoint(); clearRefs(); hideFnHelp();
  pushUndo(); const n=commitRaw(ref,fInput.value); renderAll(); noteAutoClose(n);
}
fInput.addEventListener("blur",()=>{ if(isPhone()) commitFormulaBar(); else fEditRef=null; });

/* tap a cell that is already selected to start typing in the formula bar */
let _tapSel=null;
grid.addEventListener("mousedown",e=>{
  if(!isPhone()) return;
  const td=e.target.closest("td"); if(!td) return;
  // before grid.js moves the selection, save what was typed for the old cell
  // (unless this tap is adding a reference to the formula)
  if(document.activeElement===fInput){
    const v=fInput.value;
    // tapping the cell being edited keeps you typing (unless a formula wants that reference)
    if(td.dataset.ref===fEditRef&&!(v[0]==="="&&refInsertable(v))){ e.preventDefault(); e.stopImmediatePropagation(); _tapSel=null; return; }
    const pointing=v[0]==="="&&(refInsertable(v)||(point&&point.inputEl===fInput));
    if(!pointing){ commitFormulaBar(); fInput.blur(); }
    _tapSel=null; return;
  }
  _tapSel=(!selEnd&&refOf(sel.r,sel.c)===td.dataset.ref&&!editing)?td.dataset.ref:null;
},true);
grid.addEventListener("click",e=>{
  if(!isPhone()||!_tapSel) return;
  const td=e.target.closest("td");
  if(td&&td.dataset.ref===_tapSel&&!(currentEx&&currentEx.pick&&currentEx.pick[_tapSel])){
    fInput.focus(); const n=fInput.value.length; fInput.setSelectionRange(n,n);
  }
  _tapSel=null;
});

/* status bar on a phone: the laptop link replaces the keyboard hints */
(function(){
  const bar=document.getElementById("statusbar"); if(!bar) return;
  const b=document.createElement("button");
  b.id="btnLaptop"; b.className="ws-laptop"; b.type="button";
  b.innerHTML='<span aria-hidden="true">💻</span> Continue on laptop';
  b.addEventListener("click",continueOnLaptop);
  bar.appendChild(b);
})();
fInput.setAttribute("enterkeyhint","done");
phoneMQ.addEventListener?phoneMQ.addEventListener("change",syncKeys):phoneMQ.addListener(syncKeys);
