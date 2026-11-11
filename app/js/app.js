"use strict";
/* app.js — app shell: progress state, persistence, router, pages, workspace, answer checker, onboarding, test hooks, init.
   Classic script (not a module): its top-level const/let/function names are shared with the other app scripts. Load order is set in index.html. */
let currentCourse=null, currentEx=null, currentExId=null;
const doneEx=new Set();

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
const flatEx=course=>course.modules.flatMap(m=>m.ex);
const courseDone=course=>flatEx(course).filter(id=>doneEx.has(id)).length;
function moduleForEx(course,exId){
  if(!course) return null;
  return course.modules.find(m=>m.ex.includes(exId)) || null;
}
function updateStreak(){
  const el=document.getElementById("ws-streak");
  if(el) el.textContent = String(doneEx.size);
}

/* ================= PERSISTENCE (this browser only) =================
   Completed exercises and each exercise's in-progress sheet are kept in
   localStorage so a refresh never loses work. The test harness loads the
   app with ?test, which turns persistence off so test runs never touch a
   real user's saved progress. */
const PERSIST = !/[?&]test\b/.test(location.search);
const LS_DONE = "tyro_done_v1", LS_SHEET = "tyro_sheet_v1:";
function lsGet(k){ if(!PERSIST) return null; try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ if(!PERSIST) return; try{ localStorage.setItem(k,v); }catch(e){} }
function lsDel(k){ if(!PERSIST) return; try{ localStorage.removeItem(k); }catch(e){} }
function saveDone(){ lsSet(LS_DONE, JSON.stringify([...doneEx])); }
function loadDone(){
  try{ const a=JSON.parse(lsGet(LS_DONE)||"[]"); if(Array.isArray(a)) a.filter(id=>EX[id]).forEach(id=>doneEx.add(id)); }catch(e){}
}
let _sheetTimer=null, _sheetLast=null;
function saveSheetSoon(){
  if(!PERSIST || !currentExId) return;
  const id=currentExId;
  clearTimeout(_sheetTimer);
  _sheetTimer=setTimeout(()=>{
    if(id!==currentExId) return;
    const s=JSON.stringify(cells);
    if(s!==_sheetLast){ _sheetLast=s; lsSet(LS_SHEET+id, s); }
  },300);
}
function loadSheet(id){ try{ const s=lsGet(LS_SHEET+id); return s?JSON.parse(s):null; }catch(e){ return null; } }
function clearSheet(id){ lsDel(LS_SHEET+id); _sheetLast=null; }

/* ================= ROUTER =================
   Every screen has its own URL, so Back, Forward, Refresh, bookmarks and
   shared links all work. Hash URLs need no server config on Vercel.
     #/                     landing
     #/courses              course list
     #/course/<id>          course detail
     #/course/<id>/<n>      course detail with formula n expanded
     #/practice/<exId>      exercise workspace
     #/sandbox              blank sheet
   Screen functions (openCourse, openEx …) render synchronously and then
   record their URL with setRoute(). A hashchange we caused ourselves is
   ignored; one caused by Back/Forward or a typed URL is routed. */
const APP_NAME="tyro.cell";
let _routeKey=null;
function show(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("on"));
  document.getElementById("view-"+view).classList.add("on");
}
function setRoute(path,title){
  _routeKey=path;
  document.title = title ? title+" · "+APP_NAME : APP_NAME+" — Practice spreadsheet formulas";
  const cur=location.hash.replace(/^#/,"")||"/";
  if(cur===path) return;
  // While handling a URL, a different destination is a redirect (locked
  // course, bad link): replace the entry so Back doesn't bounce into it again.
  if(_routing) location.replace("#"+path); else location.hash=path;
}
let _routing=false;
function showLanding(){
  show("landing");
  setRoute("/",null);
}
function showCourses(){
  renderCourses(); show("courses");
  setRoute("/courses","Courses");
}
function showNotFound(){
  show("404");
  setRoute(location.hash.replace(/^#/,"")||"/","Page not found");
}
function courseOfEx(exId){ return COURSES.find(c=>flatEx(c).includes(exId))||null; }
function closeOverlays(){
  document.getElementById("resultOverlay").classList.remove("on");
}
function route(){
  const path=location.hash.replace(/^#/,"")||"/";
  if(path===_routeKey) return;
  _routing=true;
  try{ routeTo(path); } finally { _routing=false; }
}
function routeTo(path){
  closeOverlays();
  if(editing) commitEdit(true);
  const p=path.split("/").filter(Boolean).map(decodeURIComponent);
  if(p.length===0) return showLanding();
  if(p[0]==="courses" && p.length===1) return showCourses();
  if(p[0]==="sandbox" && p.length===1) return openSandbox();
  if(p[0]==="course" && p.length>=2 && p.length<=3){
    const c=COURSES.find(x=>x.id===p[1]);
    if(c && c.upcoming) return showCourses();
    if(c){
      const mi = p[2]!=null ? parseInt(p[2],10)-1 : null;
      if(mi==null || (mi>=0 && mi<c.modules.length)) return openCourse(c.id, mi);
    }
  }
  if(p[0]==="practice" && p.length===2 && EX[p[1]]){
    const c=courseOfEx(p[1]);
    if(c && c.upcoming) return showCourses();
    return openEx(p[1]);
  }
  showNotFound();
}
window.addEventListener("hashchange", route);
document.querySelectorAll("[data-go]").forEach(el=>{
  el.addEventListener("click",()=>{
    const t=el.dataset.go;
    if(t==="landing")showLanding();
    else if(t==="courses")showCourses();
    else if(t==="sandbox")openSandbox();
  });
});

/* Scrolled-nav border effect */
document.querySelectorAll(".pagescroll").forEach(sc=>{
  sc.addEventListener("scroll",()=>{
    const nav = sc.parentElement.querySelector(".pagenav");
    if(nav) nav.classList.toggle("scrolled", sc.scrollTop>4);
  });
});

/* Nav scroll links — scroll inside .pagescroll, not the page */
document.querySelectorAll(".nav-scroll").forEach(a=>{
  a.addEventListener("click",e=>{
    e.preventDefault();
    const id=a.getAttribute("href").slice(1);
    const target=document.getElementById(id);
    const scroller=document.getElementById("landing-scroll");
    if(target&&scroller){
      const top=target.offsetTop-scroller.offsetTop-60;
      scroller.scrollTo({top,behavior:"smooth"});
    }
  });
});

/* ================= SHOWCASE ANIMATION ================= */
(function(){
  const fw=document.getElementById("mock-formula");
  const cell=document.getElementById("mock-cell");
  const res=document.getElementById("mock-result");
  if(!fw||!cell||!res)return;

  const STEPS=[
    {phase:"empty",  delay:800},
    {phase:"typing", text:"=SUM(C2:C9)",          delay:1800},
    {phase:"wrong",  formula:"=SUM(C2:C9)", val:"7760", msg:"Result is 7,760 — that sums all regions, not just West. Use SUMIFS to filter by criteria.", delay:2500},
    {phase:"clear",  delay:600},
    {phase:"typing", text:'=SUMIFS(C2:C9,B2:B9,"West")', delay:2200},
    {phase:"correct",formula:'=SUMIFS(C2:C9,B2:B9,"West")', val:"3,850", msg:'<span class="checkmark">&#10003;</span> Correct — SUMIFS with the right criteria. Nice work!', delay:3000},
    {phase:"hold",   delay:2000}
  ];

  let running=false, timer=null;

  function typeText(el,text,cb){
    el.textContent="";
    el.classList.add("mock-typing");
    let i=0;
    const speed=Math.max(30,Math.min(60,1200/text.length));
    function tick(){
      if(i<text.length){el.textContent=text.slice(0,++i);timer=setTimeout(tick,speed);}
      else{el.classList.remove("mock-typing");cb();}
    }
    tick();
  }

  function runStep(idx){
    if(!running)return;
    const s=STEPS[idx%STEPS.length];
    const next=()=>{timer=setTimeout(()=>runStep(idx+1),s.delay);};

    if(s.phase==="empty"){
      fw.textContent="";
      cell.textContent="";
      cell.classList.add("mock-cell-empty");
      res.style.display="none";
      res.className="mock-result";
      next();
    }else if(s.phase==="typing"){
      cell.classList.add("mock-cell-empty");
      cell.textContent="";
      res.style.display="none";
      typeText(fw,s.text,next);
    }else if(s.phase==="wrong"){
      fw.textContent=s.formula;
      cell.classList.remove("mock-cell-empty");
      cell.textContent=s.val;
      res.className="mock-result bad";
      res.innerHTML=s.msg;
      res.style.display="flex";
      next();
    }else if(s.phase==="clear"){
      res.style.display="none";
      res.className="mock-result";
      fw.textContent="";
      cell.textContent="";
      cell.classList.add("mock-cell-empty");
      next();
    }else if(s.phase==="correct"){
      fw.textContent=s.formula;
      cell.classList.remove("mock-cell-empty");
      cell.textContent=s.val;
      res.className="mock-result";
      res.innerHTML=s.msg;
      res.style.display="flex";
      next();
    }else if(s.phase==="hold"){
      next();
    }
  }

  function startAnim(){
    if(running)return;
    running=true;
    runStep(0);
  }
  function stopAnim(){
    running=false;
    if(timer){clearTimeout(timer);timer=null;}
  }

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting)startAnim(); else stopAnim();
    });
  },{threshold:0.3});
  obs.observe(document.getElementById("mock-anim"));
})();

/* ================= SCROLL REVEAL ================= */
(function(){
  const scroller=document.getElementById("landing-scroll");
  if(!scroller)return;
  const targets=scroller.querySelectorAll(".reveal,.reveal-scale,.reveal-children");
  const revealObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting)e.target.classList.add("visible");
    });
  },{root:scroller,threshold:0.15});
  targets.forEach(t=>revealObs.observe(t));
})();

/* ================= PAGES ================= */
function renderCourses(){
  const el=document.getElementById("coursecards");
  el.innerHTML=COURSES.map((c,ci)=>{
    const total=flatEx(c).length, done=courseDone(c), pct=Math.round(done/total*100);
    const num = "COURSE " + String(ci+1).padStart(2,"0");
    const MAX_TAGS=8;
    const allTags=c.modules.map(m=>m.title);
    const shown=allTags.slice(0,MAX_TAGS).map(t=>`<span class="tag">${esc(t)}</span>`).join("");
    const more=allTags.length>MAX_TAGS?`<span class="tag tag-more">+${allTags.length-MAX_TAGS} more</span>`:"";
    const cta = c.upcoming ? "" : done===0 ? "Start →" : done===total ? "Review →" : "Continue →";
    return `<div class="ccard${c.upcoming?" upcoming":""}" data-course="${c.id}">
      <div class="ccard-meta">${num} · ${esc(c.level)} · ${esc(c.hours)}</div>
      <h3>${esc(c.title)}${c.upcoming?'<span class="soon">Coming soon</span>':''}</h3>
      <div class="cdesc">${esc(c.desc)}</div>
      <div class="tags">${shown}${more}</div>
      <div class="ccard-foot">
        <div class="ccard-pbar"><div style="width:${pct}%"></div></div>
        <span class="ccard-pnote">${String(done).padStart(2,"0")} / ${String(total).padStart(2,"0")} done</span>
        <span class="ccard-cta">${cta}</span>
      </div>
    </div>`;}).join("");
  el.querySelectorAll(".ccard").forEach(cd=>cd.onclick=()=>openCourse(cd.dataset.course));
}
function openCourse(id, soloMi){
  currentCourse=COURSES.find(c=>c.id===id);
  if(!currentCourse) return showNotFound();
  const c=currentCourse, total=flatEx(c).length, done=courseDone(c), pct=Math.round(done/total*100);
  const nextId=flatEx(c).find(x=>!doneEx.has(x))||flatEx(c)[0];
  let runningIdx=0;
  document.getElementById("coursedetail").innerHTML=`
    <h2 class="pgtitle">${esc(c.title)}</h2>
    <p class="pgsub">${esc(c.desc)}</p>
    <div class="cstats">
      <div class="cstat"><div class="k">Level</div><div class="v">${esc(c.level)}</div></div>
      <div class="cstat"><div class="k">Time</div><div class="v">${esc(c.hours)}</div></div>
      <div class="cstat"><div class="k">Exercises</div><div class="v">${total}</div></div>
      <div class="cstat"><div class="k">Prerequisites</div><div class="v">${esc(c.prereq)}</div></div>
    </div>
    <div class="progress-row">
      <div class="ccard-pbar" style="flex:1"><div style="width:${pct}%"></div></div>
      <span class="ccard-pnote">${done} / ${total} done</span>
      <button class="btn primary" id="courseStart">${done===0?"Start course":done===total?"Review":"Continue"}</button>
    </div>
    <button class="back-to-all" id="btnBackToAll">← All formulas</button>
    ${c.modules.map((m,mi)=>{
      const md=m.ex.filter(x=>doneEx.has(x)).length;
      return `<div class="module collapsed" data-mi="${mi}">
        <div class="mhead">
          <span class="chev">▸</span>
          <span class="mtag">M${String(mi+1).padStart(2,"0")}</span>
          <span class="mtitle">${esc(m.title)}</span>
          <span class="mprog">${md} / ${m.ex.length}</span>
        </div>
        ${m.ex.map(xid=>{
          const x=EX[xid]; runningIdx++;
          return `<div class="exrow ${doneEx.has(xid)?"done":""}" data-ex="${xid}">
            <span class="tick">${doneEx.has(xid)?"✓":""}</span>
            <span class="exnum">${String(runningIdx).padStart(2,"0")}</span>
            <span class="exname">${esc(x.title)}</span>
            <span class="badge ${x.lvl}">${x.lvl}</span>
            <span class="exgo">${doneEx.has(xid)?'Redo →':'Practice →'}</span>
          </div>`;}).join("")}
      </div>`;}).join("")}`;
  document.getElementById("courseStart").onclick=()=>openEx(nextId);
  const detail=document.getElementById("coursedetail");
  detail.querySelectorAll(".exrow").forEach(r=>r.onclick=()=>openEx(r.dataset.ex));
  // Only one module can be expanded at a time; expanding one is its own URL,
  // so Back collapses it again.
  detail.querySelectorAll(".mhead").forEach(h=>{
    h.onclick=()=>{
      const mi=+h.parentElement.dataset.mi;
      openCourse(c.id, h.parentElement.classList.contains("collapsed") ? mi : null);
    };
  });
  detail.querySelector("#btnBackToAll").onclick=()=>openCourse(c.id, null);
  detail.classList.toggle("solo-mode", soloMi!=null);
  if(soloMi!=null){
    const mod=detail.querySelector('.module[data-mi="'+soloMi+'"]');
    if(mod) mod.classList.remove("collapsed");
  }
  show("course");
  detail.parentElement.scrollTop=0;
  setRoute("/course/"+c.id+(soloMi!=null?"/"+(soloMi+1):""),
           soloMi!=null ? c.modules[soloMi].title+" · "+c.title : c.title);
}

/* ================= WORKSPACE ================= */
function openSandbox(){
  currentEx=null; currentExId=null; currentCourse=null;
  resetCells({}); targetRefs=[]; clearHistory();
  document.getElementById("exbar").style.display="none";
  document.getElementById("concept").classList.remove("on");
  document.getElementById("ws-crumb").textContent="Sandbox";
  document.getElementById("ws-sep2").style.display="none";
  document.getElementById("ws-course").style.display="none";
  document.getElementById("ws-sep3").style.display="none";
  updateStreak();
  renderOutline(); renderAll(); select(1,0); show("app");
  setRoute("/sandbox","Sandbox");
}
/* Opens an exercise. Restores the learner's saved sheet for it if there is
   one; pass {fresh:true} to start from the original data (Reset, Repeat). */
function openEx(exId, opts){
  const ex=EX[exId]; if(!ex) return showNotFound();
  if(!currentCourse || !flatEx(currentCourse).includes(exId)) currentCourse=courseOfEx(exId);
  currentEx=ex; currentExId=exId;
  hintViewed = false; solutionClickCount = 0;
  clearTimeout(_sheetTimer);
  if(opts&&opts.fresh) clearSheet(exId);
  const saved = loadSheet(exId);
  clearHistory();
  if(saved){ resetCells(saved); _sheetLast=JSON.stringify(saved); }
  else {
    resetCells({}); _sheetLast=null;
    for(const ref in ex.data) setRaw(ref,ex.data[ref]);
    for(const ref in ex.data){const p=parseRef(ref);if(p&&(p.r===1))(cells[ref]=cells[ref]||{}).b=true;}
  }
  targetRefs = ex.pick ? Object.keys(ex.pick)
             : ex.targetRange ? rangeCells(...ex.targetRange.split(":")).flat()
             : [ex.target];
  const first=parseRef(targetRefs[0]); select(first.r,first.c);
  document.getElementById("exbar").style.display="flex";

  const badge = document.getElementById("ex-badge");
  badge.textContent = ex.lvl;
  badge.className = "badge " + ex.lvl;
  const mod = moduleForEx(currentCourse, exId);
  document.getElementById("ex-title").textContent = mod ? mod.title : ex.title;
  document.getElementById("ex-mod").textContent = mod ? ex.title : "";

  if(currentCourse){
    document.getElementById("ws-sep2").style.display = "inline";
    document.getElementById("ws-course").style.display = "inline";
    document.getElementById("ws-course").textContent = currentCourse.title;
    document.getElementById("ws-sep3").style.display = "inline";
    document.getElementById("ws-crumb").textContent = ex.title;
  } else {
    document.getElementById("ws-sep2").style.display = "none";
    document.getElementById("ws-course").style.display = "none";
    document.getElementById("ws-sep3").style.display = "none";
    document.getElementById("ws-crumb").textContent = ex.title;
  }

  const modOfEx = currentCourse ? currentCourse.modules.find(mm => mm.ex.includes(exId)) : null;
  const list = modOfEx ? modOfEx.ex : [exId];
  const idx=list.indexOf(exId);
  document.getElementById("btnPrev").disabled = idx<=0;
  document.getElementById("btnNext").disabled = idx>=list.length-1;
  updateStreak();
  renderConcept(ex);
  renderOutline();
  renderAll();
  show("app");
  setRoute("/practice/"+exId, (mod?mod.title+" — ":"")+ex.title);
  try{if(!localStorage.getItem("tyro_onboard"))setTimeout(startOnboard,600);}catch(e){}
}
function renderConcept(ex){
  const cp=document.getElementById("concept");
  cp.classList.add("on");
  const paras = String(ex.desc||"").split(/\n\n+/).map(p => `<p class="task">${esc(p.trim())}</p>`).join("");
  cp.innerHTML=`
    <div class="eyebrow">Concept</div>
    <h2>${esc(ex.title)}</h2>
    <div class="cbody">${ex.concept}</div>
    <div class="eyebrow">Task</div>
    ${paras}
    <div class="task-meta">
      <span class="lb">Answer${targetRefs.length>1?"s":""}:</span>
      ${targetRefs.map(r=>`<span class="tcell">${r}</span>`).join(" ")}
    </div>
    <div class="hintbox" id="hintBox">
      <div class="eyebrow">Hint</div>
      <p>${esc(ex.hint||"")}</p>
    </div>
    <div class="nudgebox" id="nudgeBox">
      <div class="eyebrow">Try the hint first</div>
      <p>Learning sticks when you struggle a little. Read the hint above, then take another swing at it. Click <b>Solution</b> again if you're still stuck.</p>
    </div>
    <div class="solutionbox" id="solutionBox">
      <div class="eyebrow">Solution</div>
      <p>${esc(ex.solution||"")}</p>
    </div>
    `;
}
function renderOutline(){
  const el=document.getElementById("tab-outline");
  if(!currentCourse){
    el.innerHTML=`<p style="font-size:13px;color:var(--muted)">No course active. <a href="#" id="ol-browse" style="color:var(--ink);text-decoration:underline">Browse courses</a> or use the sheet freely.</p>`;
    const a=el.querySelector("#ol-browse"); if(a)a.onclick=e=>{e.preventDefault();showCourses();};
    return;
  }
  const modIdx = currentCourse.modules.findIndex(m => m.ex.includes(currentExId));
  const mod = modIdx >= 0 ? currentCourse.modules[modIdx] : currentCourse.modules[0];
  const modDone = mod.ex.filter(x => doneEx.has(x)).length;
  const modTotal = mod.ex.length;
  const isComplete = modDone === modTotal;
  const nextMod = modIdx >= 0 && modIdx < currentCourse.modules.length - 1 ? currentCourse.modules[modIdx + 1] : null;

  el.innerHTML = `
    <div class="ol-back" id="ol-back-course">← All formulas</div>
    <div class="ol-modhead">
      <span class="omod">${esc(mod.title)}</span>
      <span class="ol-prog">${modDone} / ${modTotal}</span>
    </div>
    ${mod.ex.map(xid => `<div class="oex ${doneEx.has(xid)?"done":""} ${xid===currentExId?"cur":""}" data-ex="${xid}">
      <span class="tick"></span><span>${esc(EX[xid].title)}</span></div>`).join("")}
    ${isComplete && nextMod ? `
      <div class="ol-next" id="ol-next-mod">
        <small>Next section</small>
        <span>${esc(nextMod.title)} →</span>
      </div>` : ''}
    ${isComplete && !nextMod ? `
      <div class="ol-next" id="ol-back-course-done">
        <small>Course complete</small>
        <span>← All formulas</span>
      </div>` : ''}
  `;
  el.querySelector("#ol-back-course").onclick = () => openCourse(currentCourse.id);
  el.querySelectorAll(".oex").forEach(r => r.onclick = () => openEx(r.dataset.ex));
  const nextBtn = el.querySelector("#ol-next-mod");
  if (nextBtn && nextMod) nextBtn.onclick = () => openEx(nextMod.ex[0]);
  const doneBtn = el.querySelector("#ol-back-course-done");
  if (doneBtn) doneBtn.onclick = () => openCourse(currentCourse.id);
}

/* exercise bar */
let hintViewed = false;
let solutionClickCount = 0;
document.getElementById("btnResetEx").onclick=()=>{ if(currentExId) openEx(currentExId,{fresh:true}); };
document.getElementById("btnHint").onclick=()=>{
  hintViewed = true;
  const h=document.getElementById("hintBox"); if(h) h.style.display="block";
};
document.getElementById("btnSolution").onclick=()=>{
  const s=document.getElementById("solutionBox");
  const n=document.getElementById("nudgeBox");
  if(!s || !n) return;
  if(!hintViewed && solutionClickCount === 0){
    // Soft nudge: show the hint + a friendly message, defer the solution
    hintViewed = true;
    document.getElementById("hintBox").style.display = "block";
    n.style.display = "block";
    solutionClickCount = 1;
    return;
  }
  n.style.display = "none";
  s.style.display = "block";
  solutionClickCount = 2;
};
document.getElementById("btnPrev").onclick=()=>stepEx(-1);
document.getElementById("btnNext").onclick=()=>stepEx(1);
function stepEx(d){
  if(!currentCourse||!currentExId)return;
  const mod = currentCourse.modules.find(m => m.ex.includes(currentExId));
  if(!mod) return;
  const list = mod.ex; const i = list.indexOf(currentExId) + d;
  if(i>=0 && i<list.length) openEx(list[i]);
}
document.getElementById("btnCheck").onclick=()=>{ if(currentEx) checkEx(currentEx); };
document.getElementById("ws-course").onclick=()=>{ if(currentCourse) openCourse(currentCourse.id); };
/* checker */
function expectedValue(ex){
  const saved=cells[ex.target]?{...cells[ex.target]}:null;
  setRaw(ex.target,ex.solution);
  let v; try{ v=cellValue(ex.target,new Set()); }catch(e){ v=null; }
  if(saved)cells[ex.target]=saved; else delete cells[ex.target];
  return v;
}
function expectedAt(ex,ref){
  const base=parseRef(ex.targetRange.split(":")[0]); const p=parseRef(ref);
  const sol=shiftFormula(ex.solution,p.r-base.r,p.c-base.c);
  const saved=cells[ref]?{...cells[ref]}:null;
  setRaw(ref,sol);
  let v; try{ v=cellValue(ref,new Set()); }catch(e){ v=null; }
  if(saved)cells[ref]=saved; else delete cells[ref];
  return {v,sol};
}
function checkEx(ex){
  if(editing)commitEdit(true);
  const fail=msg=>showResult("bad",msg);
  if(ex.pick){
    for(const ref in ex.pick){
      const raw=(getCell(ref)||{}).raw||"";
      if(raw==="") return fail("Cell "+ref+" is empty — select an option.");
      if(raw!==ex.pick[ref].answer) return fail("Cell "+ref+" is incorrect. Reconsider whether it is a direct production cost.");
    }
    return pass(ex,"All classifications correct.");
  }
  if(ex.targetRange){
    const rc=rangeCells(...ex.targetRange.split(":")).flat();
    for(const ref of rc){
      const raw=((getCell(ref)||{}).raw||"");
      if(!raw) return fail("Cell "+ref+" is empty. Fill the whole range "+ex.targetRange+" — write the first formula, then drag the fill handle.");
      if(raw[0]!=="=") return fail("Cell "+ref+" holds a plain value. Every cell must contain a formula.");
      if(!/[A-Z]{1,2}\d/.test(raw.toUpperCase())) return fail("Cell "+ref+" has no cell references — compute from the data, don't type numbers.");
      let actual; try{ actual=cellValue(ref,new Set()); }
      catch(e){ return fail("Cell "+ref+" error: <b>"+(isErr(e)?e.__err:"#VALUE!")+"</b>."+diagnose(ex,raw,e,null,ex.solution)); }
      const {v:exp,sol}=expectedAt(ex,ref);
      const eq=(typeof exp==="number"&&typeof actual==="number")?Math.abs(exp-actual)<1e-9:String(exp)===String(actual);
      if(!eq) return fail("Cell "+ref+" returns <b>"+esc(toText(actual))+"</b>, expected <b>"+esc(toText(exp))+"</b>."
        +(raw.includes("$")?" Check whether $ locks are preventing the reference from shifting.":" If you copied the formula, check that its references shifted to this row.")
        +diagnose(ex,raw,null,exp,sol));
    }
    const firstRef=rc[0]; const up=((getCell(firstRef)||{}).raw||"").toUpperCase();
    for(const r of (ex.refsRequired||[])) if(!up.includes(r)) return fail("Cell "+firstRef+" must reference <code>"+r+"</code>.");
    return pass(ex,"All "+rc.length+" cells correct.");
  }
  const c=getCell(ex.target); const raw=c&&c.raw?String(c.raw):"";
  if(!raw) return fail("Target cell "+ex.target+" is empty. Enter a formula starting with <code>=</code>.");
  if(raw[0]!=="=") return fail("That is a plain value, not a formula. Formulas must start with <code>=</code>.");
  const up=raw.toUpperCase();
  if(ex.requiresAny){ if(!ex.requiresAny.some(t=>up.includes(t))) return fail("Use one of: <code>"+ex.requiresAny.join("</code>, <code>")+"</code>."); }
  else if(ex.requires){
    const need={}; ex.requires.forEach(t=>need[t]=(need[t]||0)+1);
    for(const t in need){ const cnt=up.split(t).length-1; if(cnt<need[t]) return fail("This exercise requires "+(need[t]>1?need[t]+"× ":"")+"<code>"+esc(t.replace("(",""))+"</code> in the formula."); }
  }
  if(ex.refsRequired){
    for(const r of ex.refsRequired) if(!up.includes(r)) return fail("Reference cell <code>"+r+"</code> in the formula — do not hard-code numbers.");
  }
  let actual; try{ actual=cellValue(ex.target,new Set()); }
  catch(e){ return fail("Formula error: <b>"+(isErr(e)?e.__err:"#VALUE!")+"</b>."+diagnose(ex,raw,e,null,ex.solution)); }
  const exp=expectedValue(ex);
  const eq = (typeof exp==="number"&&typeof actual==="number") ? Math.abs(exp-actual)<1e-9 : String(exp)===String(actual);
  if(!eq) return fail("Result is <b>"+esc(toText(actual))+"</b>, expected <b>"+esc(toText(exp))+"</b>."+diagnose(ex,raw,null,exp,ex.solution));
  pass(ex,"<code>"+esc(raw)+"</code> returns "+esc(toText(exp))+".");
}
function pass(ex,msg){
  doneEx.add(currentExId);
  saveDone();
  showResult("ok","✓ Correct — "+msg);
  updateStreak(); renderOutline(); renderAll();
}
function showResult(type,msg){
  const ov=document.getElementById("resultOverlay");
  const card=document.getElementById("resultCard");
  const icon=document.getElementById("resultIcon");
  const msgEl=document.getElementById("resultMsg");
  const btns=document.getElementById("resultBtns");
  card.className="result-card "+type;
  icon.textContent=type==="ok"?"✓":"✗";
  msgEl.innerHTML=msg;
  const list=currentCourse?flatEx(currentCourse):[];
  const i=list.indexOf(currentExId);
  const hasNext=currentCourse&&i>=0&&i<list.length-1;
  let b='<button class="btn" onclick="closeResult();openEx(currentExId,{fresh:true})">Repeat</button>';
  if(type==="ok"&&hasNext) b+='<button class="btn primary" onclick="closeResult();stepEx(1)">Next →</button>';
  else if(type==="bad") b='<button class="btn primary" onclick="closeResult()">Try again</button>';
  btns.innerHTML=b;
  ov.classList.add("on");
}
function closeResult(){
  document.getElementById("resultOverlay").classList.remove("on");
}

/* ================= PROGRESS EXPORT / IMPORT ================= */
document.getElementById("btnExportProg").onclick=()=>{
  const blob=new Blob([JSON.stringify({v:1,exported:new Date().toISOString(),done:[...doneEx]},null,1)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="tyrocell-progress.json"; a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById("btnImportProg").onclick=()=>document.getElementById("progFile").click();
document.getElementById("progFile").addEventListener("change",e=>{
  const f=e.target.files[0]; if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const d=JSON.parse(rd.result);
      if(!Array.isArray(d.done))throw 0;
      d.done.filter(id=>EX[id]).forEach(id=>doneEx.add(id));
      saveDone(); renderCourses(); updateStreak();
    }catch(err){ alert("Invalid progress file."); }
  };
  rd.readAsText(f); e.target.value="";
});

/* ================= FUNCTION REFERENCE ================= */
const FNDOCS=[
 ["Math","SUM(range, …)","Adds all numbers.","=SUM(A1:A10)"],
 ["Math","AVERAGE(range)","Arithmetic mean of numbers.","=AVERAGE(B2:B20)"],
 ["Math","MIN(range) / MAX(range)","Smallest / largest number.","=MAX(C1:C9)-MIN(C1:C9)"],
 ["Math","MEDIAN(range)","Middle value.","=MEDIAN(A1:A7)"],
 ["Math","ROUND(n, digits)","Round to given decimals. Also ROUNDUP / ROUNDDOWN.","=ROUND(B2/C2,2)"],
 ["Math","ABS · SQRT · POWER · MOD · INT","Absolute value, square root, exponent, remainder, floor.","=MOD(10,3) → 1"],
 ["Math","RANDBETWEEN(lo, hi)","Random integer in range (recalculates on edit).","=RANDBETWEEN(1,6)"],
 ["Counting","COUNT(range)","Counts numeric cells only.","=COUNT(B2:B9)"],
 ["Counting","COUNTA(range)","Counts non-empty cells.","=COUNTA(A1:A60)"],
 ["Counting","COUNTBLANK(range)","Counts empty cells.","=COUNTBLANK(B2:B9)"],
 ["Conditional","IF(test, if_true, if_false)","Branching logic; nest for tiers.","=IF(B2>=40,\"Pass\",\"Fail\")"],
 ["Conditional","IFERROR(value, fallback)","Fallback if the value errors.","=IFERROR(A1/B1,0)"],
 ["Conditional","COUNTIF(range, criteria)","Count matching cells.","=COUNTIF(B2:B9,\">=50\")"],
 ["Conditional","SUMIF(range, criteria, [sum_range])","Sum where criteria matches.","=SUMIF(B2:B7,\"East\",C2:C7)"],
 ["Conditional","SUMIFS(sum_range, cr1, c1, …)","Multi-criteria sum — sum range FIRST.","=SUMIFS(C2:C7,B2:B7,\"East\",C2:C7,\">100\")"],
 ["Conditional","COUNTIFS(cr1, c1, …)","Multi-criteria count.","=COUNTIFS(B2:B7,\"East\",C2:C7,\">100\")"],
 ["Conditional","AVERAGEIFS(avg_range, cr1, c1, …)","Multi-criteria average.","=AVERAGEIFS(C2:C7,B2:B7,\"East\")"],
 ["Conditional","AVERAGEIF(range, criteria, [avg_range])","Average where criteria matches.","=AVERAGEIF(B2:B7,\">100\")"],
 ["Logical","AND / OR / NOT","Combine boolean tests.","=IF(AND(B2>=40,C2>=40),\"Pass\",\"Fail\")"],
 ["Text","& operator / CONCAT(…)","Join text pieces.","=A2&\" \"&B2"],
 ["Text","LEFT / RIGHT / MID","Extract substrings.","=LEFT(A1,3)"],
 ["Text","LEN · UPPER · LOWER · PROPER · TRIM","Length and case/space cleanup.","=TRIM(A1)"],
 ["Text","FIND(find, within, [start])","Position of text (case-sensitive).","=FIND(\"@\",A2)"],
 ["Text","SUBSTITUTE(text, old, new)","Replace all occurrences.","=SUBSTITUTE(A1,\"-\",\"/\")"],
 ["Text","TEXTJOIN(delim, ignore_empty, …)","Join with a delimiter.","=TEXTJOIN(\", \",TRUE,A1:A5)"],
 ["Lookup","XLOOKUP(value, lookup_rng, return_rng, [if_not_found])","Modern exact-match lookup with fallback.","=XLOOKUP(E2,A2:A6,B2:B6,\"Missing\")"],
 ["Lookup","VLOOKUP(value, table, col, FALSE)","Find in first column, return column col.","=VLOOKUP(E2,A2:B6,2,FALSE)"],
 ["Lookup","HLOOKUP(value, table, row, FALSE)","Horizontal variant.","=HLOOKUP(\"Q2\",A1:E3,2,FALSE)"],
 ["Lookup","INDEX(range, row, [col])","Value at a position.","=INDEX(B2:B6,3)"],
 ["Lookup","MATCH(value, range, 0)","Position of value (0 = exact).","=MATCH(\"Cherry\",A2:A6,0)"],
 ["Info","ISNUMBER / ISTEXT / ISBLANK","Type tests for IF.","=IF(ISBLANK(A1),\"missing\",A1)"],
 ["Date","DATE(y, m, d)","Builds a date serial number (days since 1900). Dates subtract like numbers.","=DATE(2026,4,30)-DATE(2026,1,15)"],
 ["Date","TODAY() / NOW()","Current date / date-time as a serial number.","=TODAY()"],
 ["Date","YEAR / MONTH / DAY(serial)","Extract parts from a date serial.","=YEAR(TODAY())"],
 ["Date","DAYS(end, start)","Whole days between two dates.","=DAYS(DATE(2026,3,31),DATE(2026,1,1))"],
 ["Date","TEXT(serial, \"yyyy-mm-dd\")","Format a date serial as text (yyyy, mm, dd tokens).","=TEXT(TODAY(),\"dd/mm/yyyy\")"],
];
(function renderFns(){
  const el=document.getElementById("tab-funcs"); let cat=""; let html="";
  html+=`<p style="font-size:12px;color:var(--muted);margin-bottom:10px">Cell refs (A1), ranges (A1:B5), $-absolute refs, operators <code>+ - * / ^ &amp; %</code> and comparisons <code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code> are supported.</p>`;
  for(const [c,syn,desc,ex] of FNDOCS){
    if(c!==cat){ html+=`<div class="fncat">${c}</div>`; cat=c; }
    html+=`<details><summary>${esc(syn.split("(")[0])}</summary><div class="fd"><span class="syn">${esc(syn)}</span>${esc(desc)}<br>Example: <code>${esc(ex)}</code></div></details>`;
  }
  el.innerHTML=html;
})();

/* ================= KEYBOARD REFERENCE PANEL ================= */
const KEYDOCS=[
 ["Moving",[
  [["↑","↓","←","→"],"Move one cell"],
  [["Ctrl","↑↓←→"],"Jump to the edge of the data region"],
  [["Ctrl","Home"],"Go to A1"],
  [["Ctrl","End"],"Go to the last used cell"],
  [["Tab"],"Move right · Shift+Tab moves left"],
  [["Enter"],"Move down · Shift+Enter moves up"]]],
 ["Selecting",[
  [["Shift","↑↓←→"],"Extend the selection"],
  [["Ctrl","Shift","↑↓←→"],"Extend to the edge of the data"],
  [["Ctrl","A"],"Select the whole used range"],
  [["Ctrl","Space"],"Select the column"],
  [["Shift","Space"],"Select the row"]]],
 ["Writing formulas",[
  [["="],"Start a formula"],
  [["F2"],"Edit the cell in place"],
  [["↑↓←→"],"While typing a formula: pick a cell reference"],
  [["Shift","↑↓←→"],"While typing: extend the picked range"],
  [["F4"],"Cycle the reference: A1 → $A$1 → A$1 → $A1"],
  [["Alt","="],"AutoSum the numbers above or to the left"],
  [["Enter"],"Confirm · Esc cancels"],
  [["Ctrl","Enter"],"Confirm into every selected cell at once"]]],
 ["Filling & editing",[
  [["Ctrl","D"],"Fill down from the top of the selection"],
  [["Ctrl","R"],"Fill right from the left of the selection"],
  [["Ctrl","C"],"Copy · Ctrl+V pastes with references shifted"],
  [["Ctrl","Z"],"Undo · Ctrl+Y or Ctrl+Shift+Z redoes"],
  [["Ctrl","B"],"Bold · Ctrl+I italic · Ctrl+U underline"],
  [["Ctrl",";"],"Insert today's date"],
  [["Delete"],"Clear the selected cells"]]]
];
(function renderKeys(){
  const el=document.getElementById("tab-keys"); if(!el)return;
  let html="";
  for(const [cat,rows] of KEYDOCS){
    html+='<div class="fncat">'+cat+'</div>';
    for(const [keys,desc] of rows){
      html+='<div class="krow"><span class="keys">'+keys.map(k=>"<kbd>"+esc(k)+"</kbd>").join("")+
            '</span><span class="kdesc">'+esc(desc)+'</span></div>';
    }
  }
  html+='<div class="knote"><b>Not available in any browser.</b> <kbd>Ctrl+T</kbd> <kbd>Ctrl+N</kbd> <kbd>Ctrl+W</kbd> '+
        '<kbd>Ctrl+Tab</kbd> <kbd>Ctrl+1-9</kbd> <kbd>F11</kbd> <kbd>F12</kbd> are reserved by the browser itself and '+
        'cannot be intercepted by any web page. Everything listed above is the real Excel binding.</div>';
  el.innerHTML=html;
})();

/* ================= TEST HOOKS =================
   Top-level `const`/`let` create global *lexical* bindings, which are NOT
   properties of `window` — so `app/test.html` could never see Engine/EX/doneEx
   and bailed out with a misleading "cross-frame block" message. Exporting
   them explicitly is what makes the regression harness able to run at all.
   Values that get reassigned (cells, currentEx…) need accessors, not copies. */
window.Engine   = Engine;
window.isErr    = isErr;
window.FErr     = FErr;
window.getCell  = getCell;
window.setRaw   = setRaw;
window.refOf    = refOf;
window.evalStr  = evalStr;
window.cellValue= cellValue;
window.toText   = toText;
window.shiftFormula = shiftFormula;
window.rangeCells   = rangeCells;
window.parseRef     = parseRef;
window.EX       = EX;
window.COURSES  = COURSES;
window.doneEx   = doneEx;
window.COLS     = COLS;
window.ROWS     = ROWS;
window.openEx   = openEx;
window.checkEx  = checkEx;
Object.defineProperty(window,"_cells",      {get:()=>Engine._cells, configurable:true});
Object.defineProperty(window,"_cells_direct",    {value:ref=>Engine._cells[ref], configurable:true});
Object.defineProperty(window,"_cells_direct_set",{value:(ref,v)=>{Engine._cells[ref]=v;}, configurable:true});
Object.defineProperty(window,"targetRefs",  {get:()=>targetRefs, configurable:true});
Object.defineProperty(window,"currentEx",   {get:()=>currentEx,    set:v=>{currentEx=v;},    configurable:true});
Object.defineProperty(window,"currentExId", {get:()=>currentExId,  set:v=>{currentExId=v;},  configurable:true});
Object.defineProperty(window,"currentCourse",{get:()=>currentCourse,set:v=>{currentCourse=v;},configurable:true});

/* ================= INIT ================= */
buildGrid();
renderOutline();
renderAll();
select(1,0);
loadDone();
updateStreak();
setPanel(lsGet("tyro_panel"));

route();   // open whatever screen the URL points at (landing if none)

/* ================= ONBOARDING ================= */
(function(){
  let onboardStep=0;
  const STEPS=[
    {
      target:()=>document.getElementById("concept"),
      text:"<b>Read the task here.</b> It tells you which formula to write, which cell to put it in, and gives you the syntax.",
      arrow:"arrow-left",pos:"right"
    },
    {
      target:()=>{const t=targetRefs&&targetRefs[0];if(!t)return null;const td=document.querySelector('#grid td[data-ref="'+t+'"]');return td;},
      text:"<b>Type your formula in the gold cell.</b> Click it, press <b>=</b> to start, then write the formula — arrow keys pick references, just like Excel.",
      arrow:"arrow-top",pos:"below"
    },
    {
      target:()=>document.getElementById("btnCheck"),
      text:"<b>Check your answer.</b> You'll get instant feedback — a green pass or a specific reason why it's wrong.",
      arrow:"arrow-bottom",pos:"above"
    }
  ];

  function positionStep(i){
    const step=STEPS[i];
    const el=step.target();
    if(!el)return false;
    el.scrollIntoView({block:"center",behavior:"instant"});
    const r=el.getBoundingClientRect();
    const spot=document.getElementById("onboardSpot");
    const tip=document.getElementById("onboardTip");
    const pad=6;
    spot.style.top=(r.top-pad)+"px";
    spot.style.left=(r.left-pad)+"px";
    spot.style.width=(r.width+pad*2)+"px";
    spot.style.height=(r.height+pad*2)+"px";

    document.getElementById("onboardStep").textContent="Step "+(i+1)+" of "+STEPS.length;
    document.getElementById("onboardText").innerHTML=step.text;
    const btn=document.getElementById("onboardNext");
    btn.textContent=i<STEPS.length-1?"Next":"Got it";

    const vw=window.innerWidth;
    const vh=window.innerHeight;
    let pos=step.pos;
    if(pos==="right"&&(vw-r.right)<340) pos="below";
    if(pos==="below"&&(vh-r.bottom)<200) pos="above";
    if(pos==="above"&&r.top<200) pos="below";

    tip.style.top=tip.style.bottom=tip.style.left=tip.style.right="auto";
    if(pos==="right"){
      tip.className="onboard-tip arrow-left";
      tip.style.top=r.top+"px";
      tip.style.left=(r.right+16)+"px";
    }else if(pos==="below"){
      tip.className="onboard-tip arrow-top";
      tip.style.top=(r.bottom+16)+"px";
      tip.style.left=Math.max(12,Math.min(r.left,vw-340))+"px";
    }else if(pos==="above"){
      tip.className="onboard-tip arrow-bottom";
      tip.style.bottom=(vh-r.top+16)+"px";
      tip.style.left=Math.max(12,Math.min(r.left,vw-340))+"px";
    }
    return true;
  }

  window.startOnboard=function(){
    onboardStep=0;
    const ov=document.getElementById("onboardOverlay");
    ov.classList.add("on");
    positionStep(0);
  };
  window.finishOnboard=function(){
    document.getElementById("onboardOverlay").classList.remove("on");
    try{localStorage.setItem("tyro_onboard","1");}catch(e){}
  };
  document.getElementById("onboardNext").onclick=function(){
    onboardStep++;
    if(onboardStep>=STEPS.length){finishOnboard();return;}
    positionStep(onboardStep);
  };
})();
