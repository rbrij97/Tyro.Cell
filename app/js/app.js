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
  if(typeof updateHeaderProgress==="function") updateHeaderProgress();
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
function closeOverlays(){ setPanel(); hideFnHelp(); }   // outline dropdown, shortcuts dialog, formula help
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

/* ================= LANDING: real numbers, scroll reveal, FAQ =================
   The demo window and highlighter animate in pure CSS (css/app.css, LANDING).
   This block only does what CSS can't: fill in live counts, reveal sections
   as they scroll into view (count the numbers up once), and open FAQ answers. */
(function(){
  const scroller=document.getElementById("landing-scroll");
  if(!scroller)return;
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Read the numbers from the app itself so the landing page never goes stale.
  const live=COURSES.find(c=>!c.upcoming)||COURSES[0];
  const counts={
    functions:Object.keys(FUNCS).length,
    exercises:COURSES.reduce((n,c)=>n+flatEx(c).length,0),
    formulas:live.modules.length
  };
  scroller.querySelectorAll("[data-count]").forEach(el=>{
    const v=counts[el.dataset.count]; if(v!=null) el.textContent=String(v);
  });

  function countUp(section){
    if(reduce) return;
    section.querySelectorAll(".lp-num[data-count]").forEach(el=>{
      const target=counts[el.dataset.count]; if(target==null) return;
      const start=performance.now(), dur=1300;
      const step=now=>{
        const p=Math.min(1,(now-start)/dur), e=1-Math.pow(1-p,3);
        el.textContent=String(Math.round(target*e));
        if(p<1) requestAnimationFrame(step);
      };
      el.textContent="0"; requestAnimationFrame(step);
    });
  }

  const sections=scroller.querySelectorAll(".lp-reveal");
  if(reduce||!("IntersectionObserver" in window)){
    sections.forEach(s=>s.classList.add("in"));
  } else {
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        e.target.classList.add("in");
        if(e.target.classList.contains("lp-stats")) countUp(e.target);
        io.unobserve(e.target);
      });
    },{root:scroller,threshold:0.15});
    sections.forEach(s=>io.observe(s));
  }

  scroller.querySelectorAll(".lp-faq-q").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const item=btn.closest(".lp-faq-item");
      const open=!item.classList.contains("open");
      item.classList.toggle("open",open);
      btn.setAttribute("aria-expanded",String(open));
    });
  });
})();

/* ================= PAGES ================= */
/* Header progress shown on every "desk" screen: exercises done across live courses. */
const liveCourses=()=>COURSES.filter(c=>!c.upcoming);
function updateHeaderProgress(){
  const total=liveCourses().reduce((n,c)=>n+flatEx(c).length,0);
  const done=liveCourses().reduce((n,c)=>n+courseDone(c),0);
  const pct=total?Math.round(done/total*100):0;
  document.querySelectorAll(".dk-progfill").forEach(el=>{ el.style.width=pct+"%"; });
  document.querySelectorAll(".dk-progtext").forEach(el=>{ el.innerHTML="<b>"+done+"</b> / "+total+" done"; });
}
const nextExOf=list=>list.find(x=>!doneEx.has(x))||list[0];
const courseNum=c=>"Course "+String(COURSES.indexOf(c)+1).padStart(2,"0");
// "Excel Formula Fundamentals" -> last word gets the highlighter stroke
const hlLastWord=t=>{ const i=String(t).lastIndexOf(" "); return i<0?'<span class="dk-hl">'+esc(t)+'</span>':esc(t.slice(0,i+1))+'<span class="dk-hl">'+esc(t.slice(i+1))+'</span>'; };
const miniSheet=meta=>'<div class="ms '+meta.anim+'" style="--ms-ink:'+meta.ink+'" aria-hidden="true"><div class="ms-g">'+"<i></i>".repeat(12)+'</div><span class="ms-s"></span><span class="ms-o"></span></div>';

function renderCourses(){
  updateHeaderProgress();
  const el=document.getElementById("coursecards");
  el.innerHTML=COURSES.map(c=>{
    const total=flatEx(c).length, done=courseDone(c), pct=Math.round(done/total*100);
    if(c.upcoming) return `<div class="dk-ccard soon">
      <div class="dk-ccard-main">
        <div class="dk-crumb"><span>${courseNum(c)} · ${esc(c.level)} · ${esc(c.hours)}</span></div>
        <h2>${esc(c.title)}<span class="dk-soonchip">Coming soon</span></h2>
        <p>${esc(c.desc)}</p>
      </div></div>`;
    const cats={}; c.modules.forEach(m=>{ const k=formulaMeta(m.title).cat; cats[k]=(cats[k]||0)+1; });
    const chips=Object.keys(FORMULA_CATS).filter(k=>cats[k]).map(k=>`<span class="dk-catchip" style="background:${FORMULA_CATS[k].fill};color:${FORMULA_CATS[k].ink}">${esc(k)} · ${cats[k]}</span>`).join("");
    const cta=done===0?"Start course →":done===total?"Review →":"Continue →";
    return `<a class="dk-ccard dk-lift" href="#/course/${c.id}">
      <div class="dk-ccard-main">
        <div class="dk-crumb"><span class="dk-tag">${courseNum(c)}</span><span>${esc(c.level)} · ${esc(c.hours)} · ${c.modules.length} formulas · ${total} exercises</span></div>
        <h2>${esc(c.title)}</h2>
        <p>${esc(c.desc)}</p>
        <div class="dk-catchips">${chips}</div>
      </div>
      <div class="dk-ccard-side">
        <div class="dk-bigpct"><b>${pct}%</b><span class="dk-mono">${done} / ${total} exercises</span></div>
        <div class="dk-bar"><div class="dk-fill" style="width:${pct}%"></div></div>
        <span class="dk-cta">${cta}</span>
      </div></a>`;
  }).join("");
}

/* Course page: formula cards with search, "unsolved only", sort and category filters.
   Filter state survives re-renders within a course and resets when you switch course. */
const courseUI={courseId:null,cat:"All",q:"",unsolved:false,sort:"course",gen:0};
function openCourse(id, soloMi){
  const c=COURSES.find(x=>x.id===id);
  if(!c) return showNotFound();
  if(courseUI.courseId!==id||soloMi!=null) Object.assign(courseUI,{courseId:id,cat:"All",q:"",unsolved:false,sort:"course"});
  currentCourse=c;
  updateHeaderProgress();
  const all=flatEx(c), total=all.length, done=courseDone(c), pct=Math.round(done/total*100);
  const nextId=nextExOf(all), nextMod=moduleForEx(c,nextId)||c.modules[0];
  const cta=done===0?"Start: "+nextMod.title
          :done===total?"Review the course"
          :"Continue: "+nextMod.title+" "+(nextMod.ex.indexOf(nextId)+1)+" of "+nextMod.ex.length;
  const detail=document.getElementById("coursedetail");
  detail.innerHTML=`
    <section class="dk-chead dk-enter">
      <div class="dk-chead-main">
        <div class="dk-crumb"><a href="#/courses">Courses</a><span aria-hidden="true">/</span><span class="dk-tag">${courseNum(c)}</span><span>${esc(c.level)} · ${esc(c.hours)}</span></div>
        <h1 class="dk-h1">${hlLastWord(c.title)}</h1>
        <p class="dk-sub">${esc(c.desc)}</p>
      </div>
      <div class="dk-chead-side">
        <div class="dk-bigpct"><b>${pct}%</b><span class="dk-mono">${done} / ${total} exercises</span></div>
        <div class="dk-bar"><div class="dk-fill" style="width:${pct}%"></div></div>
        <a class="dk-btn" id="courseStart" href="#/practice/${encodeURIComponent(nextId)}">${esc(cta)} →</a>
      </div>
    </section>
    <div class="dk-toolbar">
      <label class="dk-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#57524A" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="fq" aria-label="Search formulas" placeholder="Search formulas — try “lookup” or “CAGR”" autocomplete="off">
      </label>
      <button class="dk-toggle" id="funsolved" aria-pressed="false"><span class="box" aria-hidden="true"></span>Unsolved only</button>
      <label class="dk-sortlabel">Sort
        <select id="fsort">
          <option value="course">Course order</option>
          <option value="easy">Easiest first</option>
          <option value="hard">Hardest first</option>
          <option value="progress">Most progress</option>
        </select>
      </label>
    </div>
    <div class="dk-filters" id="ffilters" role="group" aria-label="Filter by category"></div>
    <div class="dk-mono" id="fcount" aria-live="polite"></div>
    <div class="dk-empty" id="fempty" hidden><b>No formula matches that.</b>Try a function name like SUMIF, or a use like “dates”.</div>
    <div class="dk-grid" id="fgrid"></div>
    <div class="dk-legend"><span>Each square is one exercise:</span><span><i style="background:#2FB36B"></i>Easy</span><span><i style="background:#F2A516"></i>Medium</span><span><i style="background:#E2483D"></i>Hard</span></div>`;

  const q=detail.querySelector("#fq"), un=detail.querySelector("#funsolved"), so=detail.querySelector("#fsort");
  q.value=courseUI.q; so.value=courseUI.sort; un.setAttribute("aria-pressed",String(courseUI.unsolved));
  un.querySelector(".box").textContent=courseUI.unsolved?"✓":"";
  q.addEventListener("input",()=>{ courseUI.q=q.value; renderFormulaCards(c); });
  so.addEventListener("change",()=>{ courseUI.sort=so.value; renderFormulaCards(c); });
  un.addEventListener("click",()=>{
    courseUI.unsolved=!courseUI.unsolved;
    un.setAttribute("aria-pressed",String(courseUI.unsolved));
    un.querySelector(".box").textContent=courseUI.unsolved?"✓":"";
    renderFormulaCards(c);
  });
  renderFormulaCards(c);

  show("course");
  detail.parentElement.scrollTop=0;
  // #/course/<id>/<n> points at formula n: bring its card into view and flash it.
  if(soloMi!=null){
    const card=detail.querySelector('.dk-fcard[data-mi="'+soloMi+'"]');
    if(card){ card.scrollIntoView({block:"center"}); card.classList.add("flash"); }
  }
  setRoute("/course/"+c.id+(soloMi!=null?"/"+(soloMi+1):""),
           soloMi!=null ? c.modules[soloMi].title+" · "+c.title : c.title);
}

function renderFormulaCards(c){
  const LV={easy:1,medium:2,hard:3};
  const rows=c.modules.map((m,mi)=>{
    const meta=formulaMeta(m.title), total=m.ex.length, done=m.ex.filter(x=>doneEx.has(x)).length;
    const lv=m.ex.map(x=>EX[x].lvl);
    return {m,mi,meta,total,done,lv,avg:lv.reduce((s,l)=>s+(LV[l]||2),0)/lv.length};
  });
  const q=courseUI.q.trim().toLowerCase();
  const base=rows.filter(r=>(!q||(r.m.title+" "+r.meta.cat+" "+r.meta.purpose).toLowerCase().includes(q))
                          &&(!courseUI.unsolved||r.done<r.total));
  const cats=["All",...Object.keys(FORMULA_CATS).filter(k=>rows.some(r=>r.meta.cat===k))];
  if(!cats.includes(courseUI.cat)) courseUI.cat="All";
  const f=document.getElementById("ffilters");
  f.innerHTML=cats.map(k=>{
    const n=k==="All"?base.length:base.filter(r=>r.meta.cat===k).length;
    const col=k==="All"?"background:#fff;color:#171512;border-color:#DDD5C5":`background:${FORMULA_CATS[k].fill};color:${FORMULA_CATS[k].ink}`;
    return `<button class="dk-filter" data-cat="${esc(k)}" aria-pressed="${k===courseUI.cat}" style="${col}">${esc(k)}<span class="n">${n}</span></button>`;
  }).join("");
  f.querySelectorAll(".dk-filter").forEach(b=>b.onclick=()=>{ courseUI.cat=b.dataset.cat; renderFormulaCards(c); });

  let list=base.filter(r=>courseUI.cat==="All"||r.meta.cat===courseUI.cat);
  if(courseUI.sort==="easy") list=list.slice().sort((a,b)=>a.avg-b.avg);
  if(courseUI.sort==="hard") list=list.slice().sort((a,b)=>b.avg-a.avg);
  if(courseUI.sort==="progress") list=list.slice().sort((a,b)=>b.done/b.total-a.done/a.total);

  document.getElementById("fcount").textContent="Showing "+list.length+" of "+rows.length+" formulas";
  document.getElementById("fempty").hidden=list.length>0;
  const g=document.getElementById("fgrid");
  courseUI.gen++;
  g.className="dk-grid "+(courseUI.gen%2?"ga":"gb");   // swapping restarts the card stagger
  g.innerHTML=list.map(r=>{
    const st=r.done===r.total?["done","Done"]:r.done>0?["prog","In progress"]:["new","New"];
    const counts={easy:0,medium:0,hard:0}; r.lv.forEach(l=>counts[l]=(counts[l]||0)+1);
    const mixLabel=r.total+" exercises: "+["easy","medium","hard"].filter(k=>counts[k]).map(k=>counts[k]+" "+k).join(", ");
    const barCol=st[0]==="done"?"#0A0A0A":r.meta.ink;
    return `<a class="dk-fcard dk-lift" data-mi="${r.mi}" href="#/practice/${encodeURIComponent(nextExOf(r.m.ex))}" aria-label="${esc(r.m.title)} — ${st[1]}, ${r.done} of ${r.total} done">
      <div class="dk-band" style="background:${r.meta.fill};color:${r.meta.ink}">
        <div class="col"><span class="nm">${esc(r.m.title)}</span><span class="dk-status ${st[0]}">${st[1]}</span></div>
        ${miniSheet(r.meta)}
      </div>
      <div class="dk-fbody">
        <span class="dk-fcat" style="color:${r.meta.ink}">${esc(r.meta.cat)}</span>
        <span class="dk-fpurpose">${esc(r.meta.purpose)}</span>
        <div class="dk-ffoot">
          <span class="dk-mix" role="img" aria-label="${mixLabel}">${r.lv.map(l=>'<i class="'+l+'"></i>').join("")}</span>
          <span class="dk-fcount">${r.done} / ${r.total}</span>
        </div>
        <div class="dk-fbar"><div class="dk-fill" style="width:${Math.round(r.done/r.total*100)}%;background:${barCol}"></div></div>
      </div></a>`;
  }).join("");
}

/* ================= WORKSPACE ================= */
function openSandbox(){
  currentEx=null; currentExId=null; currentCourse=null;
  resetCells({}); targetRefs=[]; passedRefs=[]; clearHistory();
  document.getElementById("concept").classList.remove("on");
  document.getElementById("ws-crumb").textContent="Sandbox";
  document.getElementById("ws-crumb").removeAttribute("style");
  document.getElementById("ws-sep2").style.display="none";
  document.getElementById("ws-course").style.display="none";
  document.getElementById("ws-sep3").style.display="none";
  document.getElementById("ws-pager").style.display="none";
  updateStreak();
  renderOutline(); renderAll(); select(1,0); show("app"); positionSelBox();
  setRoute("/sandbox","Sandbox");
}

/* Where an exercise sits: its module, its position in that module, and the
   next exercise in the whole course (Next crosses into the next formula). */
function exPlace(exId){
  const course=currentCourse, mod=course?moduleForEx(course,exId):null;
  const list=course?flatEx(course):[exId], i=list.indexOf(exId);
  return {course,mod,mi:course&&mod?course.modules.indexOf(mod):-1,
          pos:mod?mod.ex.indexOf(exId)+1:1, of:mod?mod.ex.length:1,
          prev:i>0?list[i-1]:null, next:i>=0&&i<list.length-1?list[i+1]:null};
}
// "VLOOKUP — Pull CMP from ticker master" -> "Pull CMP from ticker master" (the module name is shown separately)
const shortTitle=t=>String(t).replace(/^[A-Z][A-Z0-9 &+,()]*\s—\s/,"");

/* Opens an exercise. Restores the learner's saved sheet for it if there is
   one; pass {fresh:true} to start from the original data (Reset, Repeat). */
function openEx(exId, opts){
  const ex=EX[exId]; if(!ex) return showNotFound();
  if(!currentCourse || !flatEx(currentCourse).includes(exId)) currentCourse=courseOfEx(exId);
  currentEx=ex; currentExId=exId;
  hintViewed = false; solutionClickCount = 0; briefResult = null;
  clearTimeout(_sheetTimer);
  if(opts&&opts.fresh) clearSheet(exId);
  const saved = loadSheet(exId);
  clearHistory(); passedRefs=[];
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

  const P=exPlace(exId), mod=P.mod;
  const crumb=document.getElementById("ws-crumb");
  crumb.textContent = mod ? mod.title : shortTitle(ex.title);
  if(mod){ const m=formulaMeta(mod.title); crumb.style.background=m.fill; crumb.style.color=m.ink; } else crumb.removeAttribute("style");
  const showCourse=!!currentCourse;
  document.getElementById("ws-sep2").style.display = showCourse?"":"none";
  document.getElementById("ws-sep3").style.display = "";
  const wc=document.getElementById("ws-course");
  wc.style.display = showCourse?"":"none";
  if(showCourse){ wc.textContent=currentCourse.title; wc.setAttribute("href","#/course/"+currentCourse.id); }
  document.getElementById("ws-pager").style.display="";
  document.getElementById("ws-pos").innerHTML = P.pos+" of "+P.of+" <span class=\"ws-caret\" aria-hidden=\"true\">▾</span>";
  document.getElementById("btnPrev").disabled = !P.prev;
  document.getElementById("btnNext").disabled = !P.next;

  updateStreak();
  renderConcept(ex);
  renderOutline();
  renderAll();
  show("app");
  positionSelBox(); positionFillHandle();
  setRoute("/practice/"+exId, (mod?mod.title+" — ":"")+shortTitle(ex.title));
  try{if(!localStorage.getItem("tyro_onboard"))setTimeout(startOnboard,600);}catch(e){}
}

/* ---- the brief: task, concept, hint/solution, and the answer check at its foot ---- */
let conceptOpen = true;            // remembered while you move between exercises
let briefResult = null;            // {type:"ok"|"bad", msg, newlyDone, formulaDone}
const LEVEL_LABEL={easy:"Easy",medium:"Medium",hard:"Hard"};
function renderConcept(ex){
  const cp=document.getElementById("concept");
  cp.classList.add("on");
  const P=exPlace(currentExId), mod=P.mod;
  const paras = String(ex.desc||"").split(/\n\n+/).map(p => `<p class="ws-task">${esc(p.trim())}</p>`).join("");
  const answer = ex.targetRange ? ex.targetRange : targetRefs.length>3 ? targetRefs[0]+" … "+targetRefs[targetRefs.length-1] : targetRefs.join(", ");
  const conceptName = mod ? mod.title : "this formula";
  cp.innerHTML=`
    <div class="ws-brief-scroll">
      <div class="ws-meta"><span class="ws-lvl ${ex.lvl}">${LEVEL_LABEL[ex.lvl]||ex.lvl}</span><span class="dk-mono">Exercise ${P.pos} of ${P.of}</span></div>
      <h1 class="ws-title">${esc(shortTitle(ex.title))}</h1>
      ${paras}
      <div class="ws-answer">Answer${targetRefs.length>1?"s":""} in <span class="ws-answer-cell">${esc(answer)}</span></div>
      <div class="ws-concept ${conceptOpen?"open":""}">
        <button class="ws-concept-head" data-act="concept" aria-expanded="${conceptOpen}"><span>How ${esc(conceptName)} works</span><span class="ws-chev" aria-hidden="true">${conceptOpen?"−":"+"}</span></button>
        <div class="ws-concept-body"><div><div class="cbody">${ex.concept||""}</div></div></div>
      </div>
      <div class="ws-tools">
        <button class="ws-tool hint" id="btnHint" data-act="hint">Hint</button>
        <button class="ws-tool" id="btnSolution" data-act="solution">Solution</button>
        <button class="ws-tool" id="btnResetEx" data-act="reset">Reset</button>
      </div>
      <div class="hintbox" id="hintBox"><b>Hint</b><p>${esc(ex.hint||"")}</p></div>
      <div class="nudgebox" id="nudgeBox"><b>Try the hint first</b><p>Learning sticks when you struggle a little. Read the hint above, then take another swing at it. Click <b>Solution</b> again if you're still stuck.</p></div>
      <div class="solutionbox" id="solutionBox"><b>Solution</b><p>${esc(ex.solution||"")}</p></div>
    </div>
    <div class="ws-brief-foot" id="briefFoot"></div>`;
  renderBriefFoot();
}
function renderBriefFoot(){
  const foot=document.getElementById("briefFoot"); if(!foot) return;
  const R=briefResult, P=exPlace(currentExId);
  let html="";
  if(R&&R.type==="ok"&&R.formulaDone&&P.mod){
    const m=formulaMeta(P.mod.title), lv={easy:0,medium:0,hard:0};
    P.mod.ex.forEach(x=>{ lv[EX[x].lvl]=(lv[EX[x].lvl]||0)+1; });
    const nextMod=P.course.modules[P.mi+1];
    html+=`<div class="ws-cert" role="status">
      <div class="ws-cert-top"><span class="ws-cert-cat" style="background:${m.fill};color:${m.ink}">${esc(m.cat)}</span><span class="dk-mono">Formula ${P.mi+1} of ${P.course.modules.length}</span></div>
      <div class="ws-cert-title">${esc(P.mod.title)} <span class="ws-cert-hl">mastered</span></div>
      <div class="ws-cert-ticks" role="img" aria-label="All ${P.mod.ex.length} exercises passed">${P.mod.ex.map(()=>"<i>✓</i>").join("")}</div>
      <div class="ws-cert-sum">${P.mod.ex.length} exercises · ${["easy","medium","hard"].filter(k=>lv[k]).map(k=>lv[k]+" "+k).join(", ")}</div>
      <span class="ws-cert-stamp" aria-hidden="true">TYRO<br>CELL<br>✓</span>
    </div>
    ${R.autoNote||""}
    <div class="ws-actions">
      ${nextMod?`<a class="ws-primary" href="#/practice/${encodeURIComponent(nextExOf(nextMod.ex))}">Next: ${esc(nextMod.title)} →</a>`:`<a class="ws-primary" href="#/course/${P.course.id}">Back to the course →</a>`}
      <a class="ws-secondary" href="#/course/${P.course?P.course.id:""}">All formulas</a>
    </div>`;
  } else if(R&&R.type==="ok"){
    html+=`<div id="resultCard" class="result-card ok ws-res" role="status"><span class="ws-res-icon" aria-hidden="true">✓</span><div><b>Correct — nicely done.</b><div class="ws-res-msg">${R.msg}</div></div></div>
    <div class="ws-actions">
      ${P.next?`<a class="ws-primary" href="#/practice/${encodeURIComponent(P.next)}">Next exercise →</a>`:P.course?`<a class="ws-primary" href="#/course/${P.course.id}">Back to the course →</a>`:""}
      <button class="ws-secondary" data-act="repeat">Repeat</button>
    </div>`;
  } else {
    if(R&&R.type==="bad") html+=`<div id="resultCard" class="result-card bad ws-res" role="status"><span class="ws-res-icon" aria-hidden="true">✕</span><div><b>Not quite.</b><div class="ws-res-msg">${R.msg}</div></div></div>`;
    html+=`<button class="ws-check" id="btnCheck" data-act="check">${R&&R.type==="bad"?"Check again":"Check answer"}</button>`;
  }
  // when a formula is finished the certificate replaces the result card; keep #resultCard for the test harness
  if(R&&R.type==="ok"&&R.formulaDone) html+=`<div id="resultCard" class="result-card ok ws-sr">${R.msg}</div>`;
  foot.innerHTML=html;
}

/* Outline dropdown (opened from "2 of 7"): this formula's exercises, with ticks. */
function renderOutline(){
  const el=document.getElementById("tab-outline");
  if(!currentCourse){
    el.innerHTML=`<p style="font-size:13px;color:var(--muted)">No course active. <a href="#/courses" style="color:var(--ink);text-decoration:underline">Browse courses</a> or use the sheet freely.</p>`;
    return;
  }
  const modIdx = currentCourse.modules.findIndex(m => m.ex.includes(currentExId));
  const mod = modIdx >= 0 ? currentCourse.modules[modIdx] : currentCourse.modules[0];
  const modDone = mod.ex.filter(x => doneEx.has(x)).length;
  const modTotal = mod.ex.length;
  const isComplete = modDone === modTotal;
  const nextMod = modIdx >= 0 && modIdx < currentCourse.modules.length - 1 ? currentCourse.modules[modIdx + 1] : null;
  el.innerHTML = `
    <a class="ol-back" href="#/course/${currentCourse.id}">← All formulas</a>
    <div class="ol-modhead">
      <span class="omod">${esc(mod.title)}</span>
      <span class="ol-prog">${modDone} / ${modTotal}</span>
    </div>
    ${mod.ex.map(xid => `<a class="oex ${doneEx.has(xid)?"done":""} ${xid===currentExId?"cur":""}" href="#/practice/${encodeURIComponent(xid)}">
      <span class="tick"></span><span>${esc(shortTitle(EX[xid].title))}</span></a>`).join("")}
    ${isComplete && nextMod ? `
      <a class="ol-next" href="#/practice/${encodeURIComponent(nextExOf(nextMod.ex))}">
        <small>Next formula</small>
        <span>${esc(nextMod.title)} →</span>
      </a>` : ''}
    ${isComplete && !nextMod ? `
      <a class="ol-next" href="#/course/${currentCourse.id}">
        <small>Course complete</small>
        <span>← All formulas</span>
      </a>` : ''}
  `;
}

/* exercise brief: one delegated click handler (the brief is re-rendered per exercise) */
let hintViewed = false;
let solutionClickCount = 0;
document.getElementById("concept").addEventListener("click",e=>{
  const b=e.target.closest("[data-act]"); if(!b) return;
  const act=b.dataset.act;
  if(act==="check"){ if(currentEx) checkEx(currentEx); }
  else if(act==="reset"||act==="repeat"){ if(currentExId) openEx(currentExId,{fresh:true}); }
  else if(act==="concept"){
    conceptOpen=!conceptOpen;
    const box=b.closest(".ws-concept"); box.classList.toggle("open",conceptOpen);
    b.setAttribute("aria-expanded",String(conceptOpen)); b.querySelector(".ws-chev").textContent=conceptOpen?"−":"+";
  }
  else if(act==="hint"){ hintViewed=true; document.getElementById("hintBox").style.display="block"; }
  else if(act==="solution"){
    const s=document.getElementById("solutionBox"), n=document.getElementById("nudgeBox");
    if(!hintViewed && solutionClickCount===0){
      // Soft nudge: show the hint + a friendly message, defer the solution
      hintViewed=true; document.getElementById("hintBox").style.display="block";
      n.style.display="block"; solutionClickCount=1; return;
    }
    n.style.display="none"; s.style.display="block"; solutionClickCount=2;
  }
});
document.getElementById("btnPrev").onclick=()=>stepEx(-1);
document.getElementById("btnNext").onclick=()=>stepEx(1);
function stepEx(d){
  if(!currentCourse||!currentExId) return;
  const list=flatEx(currentCourse), i=list.indexOf(currentExId)+d;
  if(i>=0 && i<list.length) openEx(list[i]);
}
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
  const wasDone=doneEx.has(currentExId);
  const P=exPlace(currentExId);
  const modWasDone=!!P.mod&&P.mod.ex.every(x=>doneEx.has(x));
  doneEx.add(currentExId);
  saveDone();
  const formulaDone=!!P.mod&&!modWasDone&&P.mod.ex.every(x=>doneEx.has(x));
  passedRefs=targetRefs.slice();
  // a bracket Excel-style auto-closed on Enter still passes, with a nudge to type it yourself
  const autoNote=targetRefs.some(r=>cells[r]&&cells[r].ac)
    ? '<div class="ws-note">Excel closed the bracket for you — get in the habit of typing <code>)</code> yourself.</div>' : "";
  showResult("ok",msg+autoNote,{newlyDone:!wasDone,formulaDone,autoNote});
  updateStreak(); renderOutline(); renderAll();
}
/* Feedback lives in the brief and on the sheet: no popup.
   Pass: the answer cells get a stamp and "+1" floats by the progress bar.
   Fail: the reason shows in the brief and the offending cell shakes. */
function showResult(type,msg,extra){
  briefResult={type,msg,...(extra||{})};
  renderBriefFoot();
  if(type==="ok"&&extra&&extra.newlyDone){
    const p=document.getElementById("wsPlus");
    if(p){ p.classList.remove("go"); void p.offsetWidth; p.classList.add("go"); }
  }
  if(type==="bad"){
    const m=/Cell ([A-Z]{1,2}\d{1,3})/.exec(String(msg));
    const td=TD[m?m[1]:targetRefs[0]];
    if(td){ td.classList.remove("shake"); void td.offsetWidth; td.classList.add("shake");
      td.addEventListener("animationend",()=>td.classList.remove("shake"),{once:true}); }
  }
}
function closeResult(){ briefResult=null; renderBriefFoot(); }

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
  [["Delete"],"Clear the selected cells"]]],
 ["Help",[
  [["Ctrl","/"],"Show these shortcuts"]]]
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
