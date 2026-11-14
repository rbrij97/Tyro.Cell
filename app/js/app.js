"use strict";
/* app.js — app shell: progress state, persistence, router, pages, workspace, answer checker, onboarding, test hooks, init.
   Classic script (not a module): its top-level const/let/function names are shared with the other app scripts. Load order is set in index.html. */
let currentCourse=null, currentEx=null, currentExId=null;
const doneEx=new Set();
const assistedEx=new Set();   // passed with the solution open (spec P0-14); a clean pass removes it

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
const flatEx=course=>course.modules.flatMap(m=>m.ex);
const courseDone=course=>flatEx(course).filter(id=>doneEx.has(id)).length;
const allEx=course=>course.modules.flatMap(m=>m.all||m.ex);
/* Each formula ("unit") has a readable slug for its URL (#/formula/countifs) and a key
   for saving its test score and syncing it ("unit_countifs"). */
const unitSlug=m=>m.title.toLowerCase().replace(/&/g," ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const unitKey=m=>"unit_"+unitSlug(m).replace(/-/g,"_").slice(0,58);
function findUnit(slug){
  for(const c of COURSES.filter(x=>!x.upcoming)){ const mi=c.modules.findIndex(m=>unitSlug(m)===slug); if(mi>=0) return {c,m:c.modules[mi],mi}; }
  return null;
}
/* Final tests: best score per unit; 80% or more = the formula is completed. */
const LS_TESTS="tyro_tests_v1", PASS_MARK=0.8;
let testScores={};
function loadTests(){ try{ const o=JSON.parse(lsGet(LS_TESTS)||"{}"); if(o&&typeof o==="object") testScores=o; }catch(e){} }
function saveTests(){ lsSet(LS_TESTS, JSON.stringify(testScores)); }
const unitDone=m=>!!(testScores[unitKey(m)]&&testScores[unitKey(m)].best>=PASS_MARK);
function unitState(m){
  const n=m.ex.length, d=m.ex.filter(x=>doneEx.has(x)).length, t=testScores[unitKey(m)];
  return {n,d,completed:unitDone(m),tried:!!t,best:t?t.best:null,practiceDone:d>=n};
}
const testSize=m=>Math.min(5,m.testPool.length);
/* The one next step in a course: the first unit not completed — its next practice, or its test. */
function nextStep(c){
  for(let mi=0;mi<c.modules.length;mi++){
    const m=c.modules[mi], s=unitState(m); if(s.completed) continue;
    if(!s.practiceDone){ const id=nextExOf(m.ex); return {type:"practice",m,mi,id,href:"#/practice/"+encodeURIComponent(id)}; }
    return {type:"test",m,mi,href:"#/formula/"+unitSlug(m)+"/test"};
  }
  return {type:"done",m:c.modules[0],mi:0,href:"#/practice/"+encodeURIComponent(c.modules[0].ex[0])};
}
// the unit an exercise belongs to, practice or test pool
function moduleForAny(course,exId){ return course?course.modules.find(m=>(m.all||m.ex).includes(exId))||null:null; }
function moduleForEx(course,exId){
  if(!course) return null;
  return course.modules.find(m=>m.ex.includes(exId)) || null;
}
const FLAME_SVG='<svg class="dk-flame" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 2c.5 3.2 3.6 4.9 3.6 9.1 0 .9-.2 1.7-.5 2.4.9-.5 1.6-1.4 1.9-2.6 1.1 1.4 1.7 3.1 1.7 4.8C18.7 19.6 15.7 22 12 22s-6.7-2.4-6.7-6.3c0-3.3 2.2-5.6 3.9-7.6.3 1.6 1 2.8 2.1 3.4C11.2 8.6 10.9 5 12 2z"/></svg>';
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
// No saving (and no account sync) under the test harness: ?test, or running inside a frame —
// only test.html frames the app (headers block other sites), and some local servers drop ?test on redirect.
const PERSIST = !/[?&]test\b/.test(location.search) && window.top===window;
/* Google's full-page sign-in returns to /app/#state=…&id_token=… (finished in js/account.js).
   Lift that out of the address before the router reads it, and drop it from history. */
const AUTH_RETURN = /(^#|&)(id_token|error)=/.test(location.hash) ? location.hash.slice(1) : null;
if(AUTH_RETURN) history.replaceState(null,"",location.pathname+location.search+"#/home");
const LS_DONE = "tyro_done_v1", LS_SHEET = "tyro_sheet_v1:";
function lsGet(k){ if(!PERSIST) return null; try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ if(!PERSIST) return; try{ localStorage.setItem(k,v); }catch(e){} }
function lsDel(k){ if(!PERSIST) return; try{ localStorage.removeItem(k); }catch(e){} }
function saveDone(){ lsSet(LS_DONE, JSON.stringify([...doneEx])); }
const LS_ASSIST="tyro_assist_v1";
function saveAssisted(){ lsSet(LS_ASSIST, JSON.stringify([...assistedEx])); }
function loadDone(){
  try{ const a=JSON.parse(lsGet(LS_ASSIST)||"[]"); if(Array.isArray(a)) a.filter(id=>EX[id]).forEach(id=>assistedEx.add(id)); }catch(e){}
  try{ const a=JSON.parse(lsGet(LS_DONE)||"[]"); if(Array.isArray(a)) a.filter(id=>EX[id]).forEach(id=>doneEx.add(id)); }catch(e){}
}
let _sheetTimer=null, _sheetLast=null;
function saveSheetSoon(){
  if(!PERSIST || !currentExId) return;
  if(testRun){   // in a test: the current question's sheet travels with the test draft
    clearTimeout(_sheetTimer);
    _sheetTimer=setTimeout(()=>{ if(!testRun||testRun.answered) return; testRun.cur={id:currentExId,cells:JSON.parse(JSON.stringify(cells))}; saveTestDraft(); },300);
    return;
  }
  const id=currentExId;
  clearTimeout(_sheetTimer);
  _sheetTimer=setTimeout(()=>{
    if(id!==currentExId) return;
    const s=JSON.stringify(cells);
    if(s!==_sheetLast){ _sheetLast=s; lsSet(LS_SHEET+id, s); if(typeof accountSaveDraft==="function") accountSaveDraft("sheet:"+id, JSON.parse(s)); }
  },300);
}
/* Home dashboard data: the exercise you last opened, and the days you practised
   (a day counts once you pass at least one exercise). Local dates, YYYY-MM-DD. */
const LS_LAST="tyro_last_v1", LS_DAYS="tyro_days_v1";
const dayKey=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function loadDays(){ try{ const a=JSON.parse(lsGet(LS_DAYS)||"[]"); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
function recordPracticeDay(){ const d=loadDays(), k=dayKey(); if(!d.includes(k)){ d.push(k); lsSet(LS_DAYS, JSON.stringify(d.slice(-400))); } }
function streakDays(){
  const set=new Set(loadDays()); let n=0; const d=new Date();
  if(!set.has(dayKey(d))) d.setDate(d.getDate()-1);   // today not done yet: the streak is still alive from yesterday
  while(set.has(dayKey(d))){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function loadSheet(id){ try{ const s=lsGet(LS_SHEET+id); return s?JSON.parse(s):null; }catch(e){ return null; } }
function clearSheet(id){ lsDel(LS_SHEET+id); _sheetLast=null; if(typeof accountSaveDraft==="function") accountSaveDraft("sheet:"+id, null); }

/* ================= ROUTER =================
   Every screen has its own URL, so Back, Forward, Refresh, bookmarks and
   shared links all work. Hash URLs need no server config on Vercel.
     #/                     landing
     #/courses              course list
     #/course/<id>          course detail
     #/course/<id>/<n>      course detail with formula n expanded
     #/practice/<exId>      exercise workspace
     #/sandbox              blank sheet
     #/sync/v1/<ids>/<days>/<last>   progress link made on a phone (js/phone.js)
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
function courseOfEx(exId){ return COURSES.find(c=>allEx(c).includes(exId))||null; }
function closeOverlays(){ setPanel(); hideFnHelp(); closePhoneCard(); }   // outline dropdown, shortcuts dialog, formula help
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
  if(!(p[0]==="formula"&&p[2]==="test")){ if(testRun) saveTestDraft(); testRun=null; document.getElementById("view-app").classList.remove("testing"); }
  if(p.length===0) return showLanding();
  if(p[0]==="formula" && p.length>=2 && p.length<=3){
    const u=findUnit(p[1]);
    if(u && p.length===2) return openCourse(u.c.id, u.mi, true);
    if(u && p[2]==="test") return startTest(u.mi);
    if(u && p[2]==="result") return showTestResult(u.mi);
  }
  if(p[0]==="courses" && p.length===1) return showCourses();
  if(p[0]==="home" && p.length===1) return showHome();
  if(p[0]==="sandbox" && p.length===1) return openSandbox();
  if(p[0]==="sync" && p.length===5) return applySync(p.slice(1));   // progress link from a phone (js/phone.js)
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
    else if(t==="home")showHome();
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
    exercises:allEx(live).length,   // open exercises only (locked courses excluded)
    formulas:live.modules.length
  };
  scroller.querySelectorAll("[data-count]").forEach(el=>{
    const v=counts[el.dataset.count]; if(v!=null) el.textContent=String(v);
  });

  const sections=scroller.querySelectorAll(".lp-reveal");
  if(reduce||!("IntersectionObserver" in window)){
    sections.forEach(s=>s.classList.add("in"));
  } else {
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        e.target.classList.add("in");
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

/* ================= LANDING: motion =================
   1. hero sheet starts tilted in 3D, leans toward the mouse, straightens as you scroll
   2. the story (Write it → Get it wrong → Get it right) plays on its own in a loop while on screen;
      the dots jump to a step
   3. the formula-family cards slide sideways endlessly (CSS); hover pauses them
   With "reduce motion" everything shows its finished state. The hero tilt is
   wide-screen only. (The word-by-word statement and the numbers row were cut
   on 2026-11-11 to shorten the page; the numbers now sit in the families heading.) */
(function(){
  const sc=document.getElementById("landing-scroll"); if(!sc) return;
  const view=document.getElementById("view-landing");
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wideMQ=window.matchMedia("(min-width: 900px)");
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  let pinned=false;
  view.classList.toggle("lp2-motion",!reduce);

  // ---- gallery cards: one per formula family, built from the course; the set is
  //      rendered twice so the endless slide can wrap without a gap ----
  const track=document.getElementById("lpTrack");
  const live=COURSES.find(c=>!c.upcoming)||COURSES[0];
  const CAT_COPY={
    "Aggregation":"Totals, averages, highs and lows — the first line of every model.",
    "Conditional":"Sum, count and average only the rows that match.",
    "Lookup":"Pull the right number from a master table, in any direction.",
    "Text":"Clean, split and join messy exported text.",
    "Maths":"Rounding, growth rates and the arithmetic behind them.",
    "Dates":"Build dates, count days, and label fiscal periods.",
    "Logic & checks":"Combine conditions and catch bad data before it spreads.",
    "Sheet skills":"Write one formula, fill it down, keep references right."
  };
  const cards=Object.keys(FORMULA_CATS).map((k,i)=>{
    const mods=live.modules.filter(m=>formulaMeta(m.title).cat===k); if(!mods.length) return "";
    const f=FORMULA_CATS[k], ex=mods.reduce((n,m)=>n+(m.all||m.ex).length,0);
    return `<article class="lp2-card">
      <div class="lp2-card-band" style="background:${f.fill};color:${f.ink}">
        <span class="lp2-card-n">${String(i+1).padStart(2,"0")}</span>
        <div class="ms ${f.anim} lp2-ms" style="--ms-ink:${f.ink}" aria-hidden="true"><div class="ms-g">${"<i></i>".repeat(12)}</div><span class="ms-s"></span><span class="ms-o"></span></div>
      </div>
      <div class="lp2-card-body">
        <h3>${esc(k)}</h3>
        <p>${esc(CAT_COPY[k]||"")}</p>
        <div class="lp2-card-chips">${mods.slice(0,5).map(m=>`<span style="background:${f.fill};color:${f.ink}">${esc(m.title)}</span>`).join("")}${mods.length>5?`<span class="more">+${mods.length-5}</span>`:""}</div>
        <span class="lp2-card-meta">${mods.length} formula${mods.length>1?"s":""} · ${ex} exercises</span>
      </div></article>`;
  }).join("");
  track.innerHTML=`<div class="lp2-set">${cards}</div>`+(reduce?"":`<div class="lp2-set" aria-hidden="true">${cards}</div>`);

  // ---- story: a timed loop ----
  const storySec=document.getElementById("s-showcase"), story=document.getElementById("lpStory"),
        fx=document.getElementById("lpStoryFx"), cell=document.getElementById("lpStoryCell"),
        res=document.getElementById("lpStoryRes"),
        steps=[...view.querySelectorAll(".lp2-step")], dots=[...view.querySelectorAll(".lp2-dots button")];
  const WRONG='=SUM(C2:C9)', RIGHT='=SUMIFS(C2:C9,B2:B9,"West")';
  const colour=s=>esc(s).replace(/C2:C9/g,'<span class="lp-ref-c">C2:C9</span>').replace(/B2:B9/g,'<span class="lp-ref-b">B2:B9</span>');
  let lastStep=-1, lastFx="";
  function setStory(step,typed){
    const text=step===2?RIGHT.slice(0,typed):WRONG.slice(0,step===0?typed:WRONG.length);
    if(text!==lastFx){ fx.innerHTML=colour(text); lastFx=text; }
    const showResult=step===1||(step===2&&typed>=RIGHT.length);
    story.dataset.step=String(step);
    story.classList.toggle("refs-c",text.includes("C2:C9"));
    story.classList.toggle("refs-b",text.includes("B2:B9"));
    story.classList.toggle("res-bad",step===1);
    story.classList.toggle("res-ok",step===2&&showResult);
    cell.textContent=step===1?"7760":(step===2&&showResult)?"2850":"";
    res.innerHTML=step===1?'<span class="lp-tick bad" aria-hidden="true">✕</span><span><b>Not quite.</b> Result is 7760, expected 2850.</span>'
                 :(step===2&&showResult)?'<span class="lp-tick" aria-hidden="true">✓</span><span><b>Correct.</b> =SUMIFS(C2:C9,B2:B9,"West") returns 2850.</span>':"";
    if(step!==lastStep){
      steps.forEach((s,i)=>s.classList.toggle("on",i===step));
      dots.forEach((d,i)=>{ d.classList.toggle("on",i===step); d.setAttribute("aria-pressed",String(i===step)); });
      if(step===1){ cell.classList.remove("shake"); void cell.offsetWidth; cell.classList.add("shake"); }
      lastStep=step;
    }
  }
  // one cycle (ms): type the wrong formula, show the error, type the right one, show the pass
  const T={type1:1400,hold1:900,wrong:2600,type2:1900,ok:2600};
  const START=[0,T.type1+T.hold1,T.type1+T.hold1+T.wrong];   // when each step begins
  const CYCLE=T.type1+T.hold1+T.wrong+T.type2+T.ok;
  let t0=0, timer=null;
  function tick(){
    const t=(performance.now()-t0)%CYCLE;
    if(t<START[1]) setStory(0,Math.round(clamp(t/T.type1)*WRONG.length));
    else if(t<START[2]) setStory(1,WRONG.length);
    else setStory(2,Math.round(clamp((t-START[2])/T.type2)*RIGHT.length));
  }
  const play=()=>{ if(timer||reduce) return; timer=setInterval(tick,70); };
  const pause=()=>{ clearInterval(timer); timer=null; };
  dots.forEach((d,i)=>d.addEventListener("click",()=>{ t0=performance.now()-START[i]-(i===0?0:i===2?T.type2:0); tick(); }));
  if(reduce) setStory(2,RIGHT.length);
  else{
    t0=performance.now(); tick();
    if("IntersectionObserver" in window){
      new IntersectionObserver(es=>es.forEach(e=>{ e.isIntersecting?play():pause(); }),{root:sc,threshold:0.25}).observe(storySec);
    } else play();
  }

  // ---- hero tilt: mouse lean + scroll straighten ----
  const tilt=document.getElementById("lpTilt");
  let mx=0,my=0;
  view.querySelector(".lp2-hero").addEventListener("mousemove",e=>{
    if(!pinned) return;
    const r=e.currentTarget.getBoundingClientRect();
    mx=(e.clientX-r.left)/r.width-.5; my=(e.clientY-r.top)/r.height-.5; queue();
  });


  function layout(){
    pinned=wideMQ.matches&&!reduce;
    view.classList.toggle("lp2-pinned",pinned);
    update();
  }
  function update(){
    raf=0;
    if(!pinned){ tilt.style.transform=""; return; }
    const t=clamp(sc.scrollTop/520);
    tilt.style.transform=`perspective(1600px) rotateX(${(1-t)*9-my*4}deg) rotateY(${(1-t)*-16+mx*6}deg) scale(${.93+.07*t}) translateY(${t*-14}px)`;
  }
  let raf=0; const queue=()=>{ if(!raf) raf=requestAnimationFrame(update); };
  sc.addEventListener("scroll",queue,{passive:true});
  window.addEventListener("resize",layout);
  wideMQ.addEventListener?wideMQ.addEventListener("change",layout):wideMQ.addListener(layout);
  new MutationObserver(()=>{ if(view.classList.contains("on")) layout(); }).observe(view,{attributes:true,attributeFilter:["class"]});
  layout();
})();

/* ================= PAGES ================= */
/* Header progress shown on every "desk" screen: exercises done across live courses. */
const liveCourses=()=>COURSES.filter(c=>!c.upcoming);
function updateHeaderProgress(){
  const total=liveCourses().reduce((n,c)=>n+c.modules.length,0);
  const done=liveCourses().reduce((n,c)=>n+c.modules.filter(unitDone).length,0);
  const pct=total?Math.round(done/total*100):0;
  document.querySelectorAll(".dk-progfill").forEach(el=>{ el.style.width=pct+"%"; });
  document.querySelectorAll(".dk-progtext").forEach(el=>{ el.innerHTML="<b>"+done+"</b><span class=\"dk-of\"> / "+total+"</span><span class=\"dk-done\"> completed</span>"; el.title=done+" of "+total+" formulas completed"; });
  const st=streakDays();
  document.querySelectorAll(".dk-streak").forEach(el=>{ el.hidden=!st; el.innerHTML=FLAME_SVG+"<span>"+st+(st===1?" day":" days")+"</span>"; el.title=st+"-day practice streak"; });
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

/* Course page: one obvious next step, the path through 3 stages, then each stage's
   formulas. Stage 1 in family cards (ring, state, badge); stages 2 and 3 as chips. */
const RING_C=94.2;
function unitView(m){
  const s=unitState(m), slug=unitSlug(m), pct=s.best!=null?Math.round(s.best*100):null;
  const practiceHref="#/practice/"+encodeURIComponent(nextExOf(m.ex)), testHref="#/formula/"+slug+"/test";
  if(s.completed) return {s,cls:"done",ring:1,line:"Completed · test "+pct+"%",badge:"Test "+pct+"% ✓",href:"#/practice/"+encodeURIComponent(m.ex[0])};
  if(s.practiceDone) return {s,cls:"test",ring:.9,line:s.tried?"Test "+pct+"% · 80% needed":"Practice done · test ready",badge:s.tried?"Retake test":"Take test",href:testHref};
  if(s.d>0) return {s,cls:"prog",ring:.9*s.d/s.n,line:"Practice "+(s.d+1)+" of "+s.n,badge:(s.n-s.d)+" left",href:practiceHref};
  return {s,cls:"new",ring:0,line:s.n+" practice + "+testSize(m)+"-question test",badge:"Start",href:practiceHref};
}
const ringSVG=(frac,cls,size)=>'<svg class="cs-ring '+cls+'" width="'+size+'" height="'+size+'" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="tr"/><circle cx="18" cy="18" r="15" class="fg" stroke-dasharray="'+RING_C+'" stroke-dashoffset="'+(RING_C*(1-frac)).toFixed(1)+'" transform="rotate(-90 18 18)"/></svg>';
function openCourse(id, soloMi, byFormula){
  const c=COURSES.find(x=>x.id===id);
  if(!c) return showNotFound();
  currentCourse=c;
  updateHeaderProgress();
  const units=c.modules, total=units.length, completed=units.filter(unitDone).length;
  const ns=nextStep(c), nsState=unitState(ns.m);
  const stages=c.stages||[{n:1,title:"Formulas",sub:""}];
  const stageOf=m=>m.stage||1;
  const curStage=ns.type==="done"?0:stageOf(ns.m);
  // up next card
  let upTitle, upSub, upKicker, upCta;
  if(ns.type==="practice"){ const e=EX[ns.id]; upKicker="Up next · practice"; upTitle=ns.m.title+" · Practice "+(ns.m.ex.indexOf(ns.id)+1)+" of "+ns.m.ex.length; upSub=shortTitle(e.title); upCta=completed||doneEx.size?"Continue →":"Start →"; }
  else if(ns.type==="test"){ upKicker="Up next · final test"; upTitle=ns.m.title+" · Final test"; upSub=testSize(ns.m)+" questions · 80% to pass · no hints"; upCta="Start the test →"; }
  else { upKicker="Course completed"; upTitle="Every formula completed"; upSub="Review any formula, or retake a test to beat your score."; upCta="Review →"; }
  const path=stages.map(st=>{
    const us=units.filter(m=>stageOf(m)===st.n), dn=us.filter(unitDone).length, here=st.n===curStage;
    return `<a class="cs-step${here?" here":""}${dn===us.length?" full":""}" href="#cs-stage-${st.n}">
      <span class="num">${dn===us.length?"✓":st.n}</span>
      <span class="txt"><b>${esc(st.title)}</b><span>${dn} of ${us.length} completed${here?" · you are here":""}</span></span></a>`;
  }).join("");
  const row=(m)=>{ const v=unitView(m), meta=formulaMeta(m.title);
    return `<a class="cs-row ${v.cls}" href="${v.href}" data-slug="${unitSlug(m)}" aria-label="${esc(m.title)}: ${esc(v.line)}">
      ${ringSVG(v.ring,v.cls,30)}
      <span class="cs-name"><b>${esc(m.title)}</b><span>${esc(v.line)}</span></span>
      <span class="cs-badge ${v.cls}">${esc(v.badge)}</span></a>`; };
  const chip=(m)=>{ const v=unitView(m);
    return `<a class="cs-chip ${v.cls}" href="${v.href}" data-slug="${unitSlug(m)}" title="${esc(m.title)}: ${esc(v.line)}">${v.cls==="done"?'<span class="tick" aria-hidden="true">✓</span>':v.cls==="new"?"":ringSVG(v.ring,v.cls,16)}${esc(m.title)}</a>`; };
  const stageHTML=stages.map(st=>{
    const us=units.filter(m=>stageOf(m)===st.n); if(!us.length) return "";
    let body;
    if(st.n===1){
      const fams=[...new Set(us.map(m=>m.family||"Formulas"))];
      body=`<div class="cs-fams">${fams.map(f=>{
        const fu=us.filter(m=>(m.family||"Formulas")===f), meta=formulaMeta(fu[0].title), dn=fu.filter(unitDone).length;
        return `<div class="cs-fam"><div class="cs-fam-head" style="background:${meta.fill};color:${meta.ink}"><b>${esc(f)}</b><span>${dn} of ${fu.length} completed</span></div>${fu.map(row).join("")}</div>`;
      }).join("")}</div>`;
    } else body=`<div class="cs-chips">${us.map(chip).join("")}</div>`;
    return `<section class="cs-stage" id="cs-stage-${st.n}">
      <div class="cs-stage-head"><h2>${st.n} · ${esc(st.title)}</h2><span>${esc(st.sub||"")}</span></div>${body}</section>`;
  }).join("");
  const detail=document.getElementById("coursedetail");
  detail.innerHTML=`
    <section class="cs-top dk-enter">
      <div class="cs-intro">
        <div class="dk-crumb"><a href="#/courses">Courses</a><span aria-hidden="true">/</span><span class="dk-tag">${courseNum(c)}</span><span>${esc(c.level)} · ${esc(c.hours)}</span></div>
        <h1 class="dk-h1">${hlLastWord(c.title)}</h1>
        <p class="dk-sub">${esc(c.desc)}</p>
        <div class="cs-overall"><span class="dk-bar"><span class="dk-fill" style="width:${Math.round(completed/total*100)}%"></span></span><b>${completed} of ${total} completed</b></div>
      </div>
      <a class="cs-up" href="${ns.href}" id="courseStart">
        <span class="k">${esc(upKicker)}</span>
        <span class="t">${esc(upTitle)}</span>
        <span class="s">${esc(upSub)}</span>
        <span class="b">${esc(upCta)}</span>
      </a>
    </section>
    <nav class="cs-path" aria-label="Your path">${path}</nav>
    ${stageHTML}`;
  show("course");
  detail.parentElement.scrollTop=0;
  if(soloMi!=null){
    const el=detail.querySelector('[data-slug="'+unitSlug(units[soloMi])+'"]');
    if(el){ el.scrollIntoView({block:"center"}); el.classList.add("flash"); }
  }
  setRoute(byFormula&&soloMi!=null?"/formula/"+unitSlug(units[soloMi]):"/course/"+c.id+(soloMi!=null?"/"+(soloMi+1):""),
           soloMi!=null ? units[soloMi].title+" · "+c.title : c.title);
}

/* ================= FINAL TEST =================
   #/formula/<slug>/test: up to 5 questions drawn from the unit's test pool, in a new
   order each attempt; no hints, one check per question. 80% or more completes the
   formula. The result lives at #/formula/<slug>/result. */
let testRun=null, lastTest=null;
function startTest(mi){
  const c=COURSES.find(x=>!x.upcoming), m=c&&c.modules[mi]; if(!m) return showNotFound();
  currentCourse=c;
  if(testRun&&testRun.m===m) return openTestQuestion();   // already in this test (e.g. tapping T again)
  const d=loadTestDraft(m);
  if(d){ testRun={mi,m,ids:d.ids,i:d.results.length,results:d.results,answered:null,cur:d.cur||null}; return openTestQuestion(); }
  const pool=m.testPool.slice();
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  testRun={mi,m,ids:pool.slice(0,5),i:0,results:[],answered:null};
  saveTestDraft();
  openTestQuestion();
}
/* An unfinished test is kept as a draft (questions, checked answers, position), so leaving
   it — a practice step, the course page, a refresh — and coming back resumes it. Finishing
   the test, or Retake from its result, starts fresh. */
const LS_TESTDRAFT="tyro_testdraft_v1";
function loadTestDrafts(){ try{ const o=JSON.parse(lsGet(LS_TESTDRAFT)||"{}"); return o&&typeof o==="object"?o:{}; }catch(e){ return {}; } }
function saveTestDraft(){
  if(!testRun) return;
  const all=loadTestDrafts();
  const key=unitKey(testRun.m);
  all[key]={ids:testRun.ids,results:testRun.results.map(r=>({id:r.id,ok:r.ok,msg:r.msg}))};
  if(testRun.cur&&!testRun.answered&&testRun.cur.id===testRun.ids[testRun.results.length]) all[key].cur=testRun.cur;
  lsSet(LS_TESTDRAFT,JSON.stringify(all));
  if(typeof accountSaveDraft==="function") accountSaveDraft("test:"+key, all[key]);   // signed in: saved to the account too
}
function clearTestDraft(m){ const all=loadTestDrafts(); delete all[unitKey(m)]; lsSet(LS_TESTDRAFT,JSON.stringify(all)); if(typeof accountSaveDraft==="function") accountSaveDraft("test:"+unitKey(m), null); }
function loadTestDraft(m){
  const d=loadTestDrafts()[unitKey(m)];
  if(!d||!Array.isArray(d.ids)||!Array.isArray(d.results)) return null;
  if(!d.ids.length||d.ids.some(id=>!m.testPool.includes(id))||d.results.length>=d.ids.length){ clearTestDraft(m); return null; }
  return d;
}
function openTestQuestion(){
  const id=testRun.ids[testRun.i];
  openEx(id,{fresh:true,test:true});
  // put back what was typed on this question before leaving
  if(testRun.cur&&testRun.cur.id===id&&testRun.cur.cells){ resetCells(JSON.parse(JSON.stringify(testRun.cur.cells))); renderAll(); }
  else testRun.cur=null;
  setRoute("/formula/"+unitSlug(testRun.m)+"/test", testRun.m.title+" · Final test");
}
function testAnswered(ok,msg){
  if(!testRun||testRun.answered) return;
  testRun.answered={ok,msg};
  testRun.results.push({id:currentExId,ok,msg});
  testRun.cur=null;
  saveTestDraft();
  if(ok){ passedRefs=targetRefs.slice(); renderAll(); }
  renderBriefFoot(); renderTestDots();
  setTimeout(()=>{ const n=document.querySelector("#briefFoot .ws-primary"); if(n&&!isPhone()) n.focus({preventScroll:true}); },0);
}
function nextTestQuestion(){
  if(!testRun) return;
  testRun.i++; testRun.answered=null;
  if(testRun.i>=testRun.ids.length) return finishTest();
  openTestQuestion();
}
function finishTest(){
  const r=testRun, ok=r.results.filter(x=>x.ok).length, score=ok/r.ids.length, key=unitKey(r.m), prev=testScores[key];
  testScores[key]={best:Math.max(score,prev?prev.best:0),last:score,at:dayKey()};
  saveTests(); recordPracticeDay(); clearTestDraft(r.m);
  lastTest={mi:r.mi,ok,n:r.ids.length,score,results:r.results,firstPass:score>=PASS_MARK&&!(prev&&prev.best>=PASS_MARK)};
  testRun=null;
  document.getElementById("view-app").classList.remove("testing");
  if(typeof accountAfterTest==="function") accountAfterTest(r.m);
  showTestResult(r.mi);
}
function renderTestDots(){
  const el=document.getElementById("ws-testdots"); if(!el) return;
  if(!testRun){ el.innerHTML=""; return; }
  el.innerHTML=testRun.ids.map((id,i)=>{
    const r=testRun.results[i], cls=r?(r.ok?"ok":"bad"):i===testRun.i?"cur":"";
    return `<span class="${cls}">${r?(r.ok?"✓":"✕"):i+1}</span>`;
  }).join("")+`<em>Pass: ${Math.ceil(PASS_MARK*testRun.ids.length)} of ${testRun.ids.length}</em>`;
}
function showTestResult(mi){
  const c=COURSES.find(x=>!x.upcoming), m=c&&c.modules[mi]; if(!m) return showNotFound();
  currentCourse=c;
  const slug=unitSlug(m), t=testScores[unitKey(m)], L=lastTest&&lastTest.mi===mi?lastTest:null;
  const score=L?L.score:t?t.last:null, passed=score!=null&&score>=PASS_MARK;
  const meta=formulaMeta(m.title), units=c.modules, completed=units.filter(unitDone).length;
  const ns=nextStep(c), streak=streakDays();
  const bars=L?L.results.map(r=>`<span class="${r.ok?"ok":"bad"}"></span>`).join(""):"";
  const missed=L?L.results.filter(r=>!r.ok):[];
  const missedHTML=missed.map(r=>`<div class="tr-miss"><span class="x" aria-hidden="true">✕</span><div><b>${esc(shortTitle(EX[r.id].title))}</b><div>${r.msg}</div></div></div>`).join("");
  const nextLabel=ns.type==="practice"?ns.m.title:ns.type==="test"?ns.m.title+" test":"Back to the course";
  document.getElementById("resultMain").innerHTML=`
    <a class="tr-brand" href="#/course/${c.id}">← ${esc(c.title)}</a>
    <div class="tr-card ${passed?"pass":"fail"}">
      <span class="tr-kicker" style="color:${meta.ink}">${esc(meta.cat)} · formula ${mi+1} of ${units.length}</span>
      <h1>${passed?`${esc(m.title)} <span class="dk-hl">completed</span>`:score==null?esc(m.title)+" test":`${esc(m.title)}: <span class="dk-hl">not yet</span>`}</h1>
      ${score!=null?`<div class="tr-score"><b>${L?L.ok+" / "+L.n:Math.round(score*100)+"%"}</b><span class="${passed?"ok":"bad"}">${Math.round(score*100)}% · ${passed?"passed":"80% needed"}</span></div>`:""}
      ${bars?`<div class="tr-bars" role="img" aria-label="${L.ok} of ${L.n} correct">${bars}</div>`:""}
      ${passed?`<div class="tr-stamp" aria-hidden="true">TYRO<br>CELL<br>✓ ${Math.round(score*100)}%</div>`:""}
    </div>
    ${missedHTML?`<div class="tr-misses"><h2>${missed.length===1?"One to look at again":"To look at again"}</h2>${missedHTML}</div>`:""}
    <div class="tr-actions">
      ${passed
        ?`<a class="tr-next" href="${ns.href}"><span>${ns.type==="done"?"All formulas completed":"Up next"}</span><b>${esc(nextLabel)} →</b></a>`
        :`<a class="tr-next" href="#/formula/${slug}/test"><span>Ready again?</span><b>Retake the test →</b></a>
          <a class="tr-alt" href="#/practice/${encodeURIComponent(m.ex[0])}">Practise again</a>`}
      <a class="tr-alt" href="#/course/${c.id}">Back to course</a>
    </div>
    <div class="tr-status">${FLAME_SVG}<b>${streak}-day streak</b><span>·</span><span><b>${completed} of ${units.length}</b> formulas completed</span></div>`;
  show("result");
  document.querySelector("#view-result .pagescroll").scrollTop=0;
  setRoute("/formula/"+slug+"/result", m.title+" · Test result");
}

/* ================= HOME DASHBOARD =================
   "Pick up where you left off": the exercise you last opened (or the next
   unsolved one), your streak and progress, three suggestions, and progress by
   category. Everything is read from what this browser has saved. */
function showHome(){
  renderHome(); show("home");
  document.querySelector("#view-home .pagescroll").scrollTop=0;
  setRoute("/home","Home");
}
function homeCourse(){ return liveCourses()[0]||COURSES[0]; }
// The exercise to resume: the one last opened if unfinished, else the next unsolved after it.
function continueTarget(c){
  const list=flatEx(c), last=lsGet(LS_LAST);
  if(last&&list.includes(last)){
    if(!doneEx.has(last)) return last;
    const after=list.slice(list.indexOf(last)+1).concat(list).find(x=>!doneEx.has(x));
    if(after) return after;
  }
  return nextExOf(list);
}
// A tiny read-only view of the exercise's sheet: first 5 rows × first 3 columns.
function sheetPreview(ex,savedRaw){
  const cols=["A","B","C"], rows=[1,2,3,4,5];
  const cell=ref=>{ const v=ex.data[ref]; return v==null?"":String(v); };
  const tgt=ex.target||"";
  const isNum=v=>/^-?[\d.]+$/.test(v);
  return `<div class="hm-sheet" aria-hidden="true">
    <div class="hm-sheet-fx"><span>${esc(tgt||"A1")}</span><span>${esc(savedRaw||"=")}</span></div>
    <div class="hm-sheet-grid">${rows.map(r=>`<span class="rh">${r}</span>`+cols.map(c=>{
      const v=cell(c+r), cls=(r===1?"h ":"")+(isNum(v)?"n ":"")+(c+r===tgt?"t":"");
      return `<span class="${cls.trim()}">${esc(v)}</span>`;}).join("")).join("")}</div>
  </div>`;
}
function renderHome(){
  updateHeaderProgress();
  const c=homeCourse(), all=flatEx(c), total=all.length, done=courseDone(c);
  const el=document.getElementById("homeMain");
  const LV={easy:["Easy","#DDF4E6","#0F6B3E"],medium:["Medium","#FFEBC7","#8A4D00"],hard:["Hard","#FDE3E0","#B42A20"]};
  const lvChip=l=>{ const x=LV[l]||LV.easy; return `<span class="hm-lvl" style="background:${x[1]};color:${x[2]}">${x[0]}</span>`; };

  // ---- continue card ----
  const allDone=done===total;
  const exId=continueTarget(c), ex=EX[exId], mod=moduleForEx(c,exId)||c.modules[0];
  const pos=mod.ex.indexOf(exId)+1;
  const saved=loadSheet(exId), savedRaw=saved&&ex.target&&saved[ex.target]&&saved[ex.target].raw;
  const firstPara=String(ex.desc||"").split(/\n\n+/)[0];
  const blurb=firstPara.length>170?firstPara.slice(0,167).replace(/\s+\S*$/,"")+"…":firstPara;
  const segs=mod.ex.map(x=>`<span class="${doneEx.has(x)?"d":x===exId?"c":""}"></span>`).join("");
  const started=done>0;
  const heading=allDone?`You've finished <span class="dk-hl">everything.</span>`
               :started?`Pick up where you <span class="dk-hl">left off.</span>`
               :`Start with your <span class="dk-hl">first formula.</span>`;
  const cta=allDone?"Review it →":saved?"Resume exercise →":started?"Continue →":"Start exercise →";

  // ---- progress tiles ----
  const streak=streakDays(), days=new Set(loadDays());
  const now=new Date(), monday=new Date(now); monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const week=["M","T","W","T","F","S","S"].map((lab,i)=>{
    const d=new Date(monday); d.setDate(monday.getDate()+i);
    const k=dayKey(d), today=k===dayKey(now), did=days.has(k), future=d>now&&!today;
    return `<span class="hm-day"><span class="box ${did?"did":today?"today":future?"future":""}">${did?"✓":""}</span><span class="lab">${lab}</span></span>`;
  }).join("");
  const mods=c.modules.map(m=>({m,meta:formulaMeta(m.title),done:m.ex.filter(x=>doneEx.has(x)).length,total:m.ex.length}));
  const mastered=mods.filter(x=>unitDone(x.m)), inprog=mods.filter(x=>x.done>0&&!unitDone(x.m));
  const chip=(x,label)=>`<span class="hm-chip" style="background:${x.meta.fill};color:${x.meta.ink}">${esc(label)}</span>`;
  const chipList=(arr,fmt)=>arr.slice(0,4).map(x=>chip(x,fmt(x))).join("")+(arr.length>4?`<span class="hm-more">+${arr.length-4} more</span>`:"");
  const pct=Math.round(done/total*100);

  // ---- up next: unfinished formulas you've started, then new ones, in course order ----
  const pick=[...inprog,...mods.filter(x=>x.done===0)].filter(x=>x.m!==mod).slice(0,3);
  const nextCards=pick.map(x=>{
    const id=nextExOf(x.m.ex), e=EX[id], p=x.m.ex.indexOf(id)+1;
    return `<a class="hm-next dk-lift" href="#/practice/${encodeURIComponent(id)}">
      <div class="hm-band" style="background:${x.meta.fill};color:${x.meta.ink}">
        <div class="col"><span class="nm">${esc(x.m.title)}</span><span class="cat">${esc(x.meta.cat)}</span></div>
        ${miniSheet(x.meta)}
      </div>
      <div class="hm-next-body">
        <span class="t">${esc(shortTitle(e.title))}</span>
        <span class="foot">${lvChip(e.lvl)}<span class="dk-mono">${x.done?p+" of "+x.total:"Not started"}</span><span class="go">${x.done?"Continue →":"Start →"}</span></span>
      </div></a>`;
  }).join("");

  // ---- by category ----
  const cats=Object.keys(FORMULA_CATS).map(k=>{
    const ms=mods.filter(x=>x.meta.cat===k); if(!ms.length) return "";
    const d=ms.reduce((n,x)=>n+x.done,0), t=ms.reduce((n,x)=>n+x.total,0), f=FORMULA_CATS[k];
    return `<a class="hm-cat dk-lift" href="#/course/${c.id}" data-cat="${esc(k)}">
      <span class="top"><span class="hm-chip" style="background:${f.fill};color:${f.ink}">${esc(k)}</span><span class="dk-mono">${d} / ${t}</span></span>
      <span class="hm-bar"><span class="dk-fill" style="width:${Math.round(d/t*100)}%;background:${f.ink}"></span></span></a>`;
  }).join("");

  const hs=nextStep(c);
  const testHero=hs.type==="test"?`<section class="hm-continue-wrap dk-enter">
      <h1 class="dk-h1">Ready for your <span class="dk-hl">${esc(hs.m.title)} test?</span></h1>
      <div class="hm-continue">
        <div class="hm-continue-main">
          <div class="hm-meta"><span class="hm-fn">${esc(hs.m.title)}</span><span class="dk-mono">Practice done</span></div>
          <h2>Final test · ${testSize(hs.m)} questions</h2>
          <p>No hints, one check per question. Score 80% or more to complete ${esc(hs.m.title)} and move on.</p>
          <div class="hm-cta"><a class="dk-btn" href="${hs.href}">Start the test →</a></div>
        </div>
        ${sheetPreview(EX[hs.m.ex[0]],null)}
      </div>
    </section>`:null;
  el.innerHTML=`
    ${testHero||`<section class="hm-continue-wrap dk-enter">
      <h1 class="dk-h1">${heading}</h1>
      <div class="hm-continue">
        <div class="hm-continue-main">
          <div class="hm-meta"><span class="hm-fn">${esc(mod.title)}</span>${lvChip(ex.lvl)}<span class="dk-mono">Exercise ${pos} of ${mod.ex.length}</span></div>
          <h2>${esc(shortTitle(ex.title))}</h2>
          <p>${esc(blurb)}</p>
          <div class="hm-segs" role="img" aria-label="${esc(mod.title)}: ${mods.find(x=>x.m===mod).done} of ${mod.ex.length} done">${segs}</div>
          <div class="hm-cta"><a class="dk-btn" href="#/practice/${encodeURIComponent(exId)}">${cta}</a>${savedRaw?`<span class="hm-saved">Your half-written formula is saved</span>`:""}</div>
        </div>
        ${sheetPreview(ex,savedRaw)}
      </div>
    </section>`}
    <section aria-labelledby="hm-prog">
      <h2 class="hm-h2" id="hm-prog">Your progress</h2>
      ${typeof acctStatusHTML==="function"?acctStatusHTML():""}
      <div class="hm-tiles">
        <div class="hm-tile"><span class="lbl">Practice streak</span><span class="big">${streak} <small>${streak===1?"day":"days"}</small></span>
          <div class="hm-week" role="img" aria-label="This week: practised on ${[...days].filter(k=>k>=dayKey(monday)).length} days">${week}</div></div>
        <div class="hm-tile"><span class="lbl">Exercises completed</span><span class="big">${done}<small> / ${total}</small></span>
          <span class="hm-bar"><span class="dk-fill" style="width:${pct}%;background:#0A0A0A"></span></span></div>
        <div class="hm-tile"><span class="lbl">Formulas completed</span><span class="big">${mastered.length}<small> / ${mods.length}</small></span>
          <span class="hm-chips">${mastered.length?chipList(mastered,x=>x.m.title):`<span class="hm-empty">Pass a formula's final test at 80% to complete it.</span>`}</span></div>
        <div class="hm-tile"><span class="lbl">In progress</span><span class="big">${inprog.length}</span>
          <span class="hm-chips">${inprog.length?chipList(inprog,x=>x.m.title+" "+x.done+"/"+x.total):`<span class="hm-empty">Nothing half-done.</span>`}</span></div>
      </div>
    </section>
    ${nextCards?`<section aria-labelledby="hm-next">
      <div class="hm-h2row"><h2 class="hm-h2" id="hm-next">Up next</h2><a href="#/course/${c.id}" class="hm-all">All ${c.modules.length} formulas →</a></div>
      <div class="hm-nexts">${nextCards}</div>
    </section>`:""}
    <section aria-labelledby="hm-cat">
      <h2 class="hm-h2" id="hm-cat">By category</h2>
      <div class="hm-cats">${cats}</div>
    </section>
    <footer class="dk-footer">Made with <span class="dk-heart">♥</span> in Amdavad · <a href="https://www.linkedin.com/in/rbrij97" target="_blank" rel="noopener">LinkedIn</a> · <a href="/app/privacy.html">Privacy</a> · <a href="/app/terms.html">Terms</a> · <span class="ft-tm">Not affiliated with Microsoft. Excel is a trademark of Microsoft Corporation.</span></footer>`;
  // a category tile opens the course page filtered to that category
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
// "VLOOKUP — Pull CMP from ticker master" -> "Pull CMP from ticker master" (the module name is shown
// separately). Only a function-name prefix is dropped: "TCS — Weekly billing" keeps its company.
const shortTitle=t=>{
  const s=String(t), m=/^([A-Z][A-Z0-9 &+,()]*)\s—\s/.exec(s); if(!m) return s;
  const words=m[1].split(/[^A-Z0-9]+/).filter(Boolean);
  return words.length&&words.every(w=>FUNCS[w]) ? s.slice(m[0].length) : s;
};

/* Opens an exercise. Restores the learner's saved sheet for it if there is
   one; pass {fresh:true} to start from the original data (Reset, Repeat). */
function openEx(exId, opts){
  const ex=EX[exId]; if(!ex) return showNotFound();
  const testing=!!(opts&&opts.test&&testRun);
  if(!currentCourse || !allEx(currentCourse).includes(exId)) currentCourse=courseOfEx(exId);
  currentEx=ex; currentExId=exId;
  if(!testing) lsSet(LS_LAST, exId);
  document.getElementById("view-app").classList.toggle("testing",testing);
  hintViewed = false; solutionClickCount = 0; checkAttempts = 0; briefResult = null;
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
  const umod=testing?testRun.m:(mod||moduleForAny(currentCourse,exId));
  crumb.textContent = testing ? "Final test · "+umod.title : umod ? umod.title : shortTitle(ex.title);
  if(umod){ const m=formulaMeta(umod.title); crumb.style.background=m.fill; crumb.style.color=m.ink; } else crumb.removeAttribute("style");
  const showCourse=!!currentCourse;
  document.getElementById("ws-sep2").style.display = showCourse?"":"none";
  document.getElementById("ws-sep3").style.display = "";
  const wc=document.getElementById("ws-course");
  wc.style.display = showCourse?"":"none";
  if(showCourse){ wc.textContent=currentCourse.title; wc.setAttribute("href","#/course/"+currentCourse.id); }
  document.getElementById("ws-pager").style.display=testing?"none":"";
  renderTestDots();
  document.getElementById("ws-pos").innerHTML = P.pos+" of "+P.of+" <span class=\"ws-caret\" aria-hidden=\"true\">▾</span>";
  document.getElementById("btnPrev").disabled = !P.prev;
  document.getElementById("btnNext").disabled = !P.next;

  if(!testing){ const um=moduleForAny(currentCourse,exId); conceptOpen=!um||um.ex[0]===exId; }
  updateStreak();
  renderConcept(ex);
  renderOutline();
  renderSide(exId);
  renderAll();
  show("app");
  positionSelBox(); positionFillHandle();
  if(testing){ closePhoneCard(); return; }   // the test sets its own address (#/formula/<slug>/test)
  setRoute("/practice/"+exId, (mod?mod.title+" — ":"")+shortTitle(ex.title));
  phoneAfterOpen(exId);   // phones: case studies first show the "bigger screen" card (js/phone.js)
  // the guided tour points at desktop controls, so phones skip it
  try{if(!isPhone()&&!localStorage.getItem("tyro_onboard"))setTimeout(startOnboard,600);}catch(e){}
}

/* ---- the brief: task, concept, hint/solution, and the answer check at its foot ---- */
let conceptOpen = true;            // remembered while you move between exercises
let briefMini = false;             // phones: task folded to its title line ("Hide task")
let briefResult = null;            // {type:"ok"|"bad", msg, newlyDone, formulaDone}
const LEVEL_LABEL={easy:"Easy",medium:"Medium",hard:"Hard"};
function renderConcept(ex){
  if(testRun) return renderTestBrief(ex);
  const cp=document.getElementById("concept");
  cp.classList.add("on"); cp.classList.toggle("mini",briefMini);
  const P=exPlace(currentExId), mod=P.mod;
  const paras = String(ex.desc||"").split(/\n\n+/).map(p => `<p class="ws-task">${esc(p.trim())}</p>`).join("");
  const answer = ex.targetRange ? ex.targetRange : targetRefs.length>3 ? targetRefs[0]+" … "+targetRefs[targetRefs.length-1] : targetRefs.join(", ");
  const conceptName = mod ? mod.title : "this formula";
  cp.innerHTML=`
    <div class="ws-brief-scroll">
      <div class="ws-meta"><span class="ws-lvl ${ex.lvl}">${LEVEL_LABEL[ex.lvl]||ex.lvl}</span><span class="dk-mono">Exercise ${P.pos} of ${P.of}</span><button class="ws-brief-tg" data-act="brief" aria-expanded="${!briefMini}">${briefMini?"Show task":"Hide task"}</button></div>
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
      <a class="ws-report" href="#" data-act="report">Something wrong with this exercise? Report it</a>
      <div class="hintbox" id="hintBox"><b>Hint</b><p>${esc(ex.hint||"")}</p></div>
      <div class="nudgebox" id="nudgeBox"><b>Try the hint first</b><p>Learning sticks when you struggle a little. Read the hint above, then take another swing at it. Click <b>Solution</b> again if you're still stuck.</p></div>
      <div class="solutionbox" id="solutionBox"><b>Solution</b><p>${esc(ex.solution||"")}</p></div>
    </div>
    <div class="ws-brief-foot" id="briefFoot"></div>`;
  renderBriefFoot();
}
function renderBriefFoot(){
  const foot=document.getElementById("briefFoot"); if(!foot) return;
  if(testRun) return renderTestFoot(foot);
  const R=briefResult, P=exPlace(currentExId);
  let html="";
  const unitReady=R&&R.type==="ok"&&P.mod&&unitState(P.mod).practiceDone&&!unitDone(P.mod);
  if(unitReady){
    html+=`<div class="ws-ready" role="status">
      <span class="ws-ready-k">Practice done</span>
      <b>Ready for the ${esc(P.mod.title)} test?</b>
      <span>${testSize(P.mod)} questions · no hints · 80% to pass</span>
    </div>
    ${R.autoNote||""}
    <div class="ws-actions">
      <a class="ws-primary" href="#/formula/${unitSlug(P.mod)}/test">Start the test →</a>
      <button class="ws-secondary" data-act="repeat">Repeat</button>
    </div>
    <div id="resultCard" class="result-card ok ws-sr">${R.msg}</div>`;
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
  const isComplete = unitDone(mod);
  const nextMod = modIdx >= 0 && modIdx < currentCourse.modules.length - 1 ? currentCourse.modules[modIdx + 1] : null;
  el.innerHTML = `
    <a class="ol-back" href="#/course/${currentCourse.id}">← All formulas</a>
    <div class="ol-modhead">
      <span class="omod">${esc(mod.title)}</span>
      <span class="ol-prog">${modDone} / ${modTotal}</span>
    </div>
    ${mod.ex.map(xid => `<a class="oex ${doneEx.has(xid)?"done":""} ${assistedEx.has(xid)?"assisted":""} ${xid===currentExId?"cur":""}" ${assistedEx.has(xid)?"title=\"Solved with the solution open\"":""} href="#/practice/${encodeURIComponent(xid)}">
      <span class="tick"></span><span>${esc(shortTitle(EX[xid].title))}</span></a>`).join("")}
    <a class="oex test ${unitDone(mod)?"done":""}" href="#/formula/${unitSlug(mod)}/test"><span class="tick"></span><span>Final test · ${testSize(mod)} questions</span></a>
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

/* "Report a problem" (spec P1-13): opens the student's email app with the exercise id
   and their current answer filled in. Address is temporary until a project inbox exists;
   it is joined at runtime so it does not sit in the page as plain text. */
const REPORT_TO=["moon.knight9797","gmail.com"];
function reportProblem(){
  if(!currentEx) return;
  const answer=targetRefs.slice(0,6).map(r=>r+": "+((getCell(r)||{}).raw||"(empty)")).join("\n");
  const body="Exercise: "+currentExId+" ("+currentEx.title+")\nLink: "+location.origin+location.pathname+"#/practice/"+currentExId+"\nMy answer:\n"+answer+"\n\nWhat went wrong:\n";
  location.href="mailto:"+REPORT_TO.join("@")+"?subject="+encodeURIComponent("tyro.cell problem: "+currentExId)+"&body="+encodeURIComponent(body);
}
/* ---- final test: the brief shows the question only (no concept, hint or solution) ---- */
function renderTestBrief(ex){
  const cp=document.getElementById("concept");
  cp.classList.add("on"); cp.classList.remove("mini");
  const r=testRun, paras=String(ex.desc||"").split(/\n\n+/).map(p=>`<p class="ws-task">${esc(p.trim())}</p>`).join("");
  const answer=ex.targetRange?ex.targetRange:targetRefs.length>3?targetRefs[0]+" … "+targetRefs[targetRefs.length-1]:targetRefs.join(", ");
  cp.innerHTML=`
    <div class="ws-brief-scroll">
      <div class="ws-meta"><span class="ws-testtag">Final test</span><span class="dk-mono">Question ${r.i+1} of ${r.ids.length}</span></div>
      <h1 class="ws-title">${esc(shortTitle(ex.title))}</h1>
      ${paras}
      <div class="ws-answer">Answer${targetRefs.length>1?"s":""} in <span class="ws-answer-cell">${esc(answer)}</span></div>
      <div class="ws-testnote">No hints in the test. One check per question.</div>
    </div>
    <div class="ws-brief-foot" id="briefFoot"></div>`;
  renderBriefFoot();
}
function renderTestFoot(foot){
  const r=testRun, a=r.answered, last=r.i>=r.ids.length-1;
  if(!a){ foot.innerHTML=`<button class="ws-check" id="btnCheck" data-act="check">Check answer</button>`; return; }
  foot.innerHTML=`<div id="resultCard" class="result-card ${a.ok?"ok":"bad"} ws-res" role="status"><span class="ws-res-icon" aria-hidden="true">${a.ok?"✓":"✕"}</span><div><b>${a.ok?"Correct.":"Not quite."}</b><div class="ws-res-msg">${a.ok?"Nicely done.":a.msg}</div></div></div>
    <div class="ws-actions"><button class="ws-primary" data-act="testnext">${last?"See your result →":"Next question →"}</button></div>`;
}

/* ---- course outline beside the practice screen (wide screens; the "2 of 7" menu covers small ones) ---- */
function renderSide(exId){
  const el=document.getElementById("ws-side"); if(!el) return;
  const c=currentCourse;
  if(!c||c.upcoming){ el.hidden=true; return; }
  el.hidden=false;
  const units=c.modules, completed=units.filter(unitDone).length, cur=testRun?testRun.m:moduleForAny(c,exId);
  const stages=c.stages||[{n:1,title:"Formulas"}];
  el.classList.remove("open");
  el.innerHTML=railHTML(units,cur)+`<div class="wsd-panel" role="dialog" aria-label="Course outline">
    <a class="wsd-course" href="#/course/${c.id}"><b>${esc(c.title)}</b>
      <span class="wsd-bar"><span style="width:${Math.round(completed/units.length*100)}%"></span></span>
      <span class="wsd-count">${completed} of ${units.length} completed</span></a>
    ${stages.map(st=>{
      const us=units.filter(m=>(m.stage||1)===st.n), open=us.includes(cur)||st.n===1;
      return `<div class="wsd-stage"><a class="wsd-stage-h" href="#cs-stage-${st.n}" data-course="${c.id}">${st.n} · ${esc(st.title)}<span>${us.filter(unitDone).length}/${us.length}</span></a>
        ${open?us.map(m=>{
          const s=unitState(m), here=m===cur, slug=unitSlug(m);
          const mark=s.completed?"✓":here?"▶":"";
          const score=s.completed?Math.round(s.best*100)+"%":"";
          let steps="";
          if(here){
            steps=`<div class="wsd-steps">${m.ex.map((id,i)=>{
              const now=!testRun&&id===exId, done=doneEx.has(id);
              return `<a class="wsd-step${now?" now":""}${done?" done":""}" href="#/practice/${encodeURIComponent(id)}"><i aria-hidden="true">${done?"✓":now?"▶":"○"}</i>Practice ${i+1}</a>`;
            }).join("")}<a class="wsd-step test${testRun?" now":""}${s.completed?" done":""}" href="#/formula/${slug}/test"><i aria-hidden="true">${s.completed?"✓":"★"}</i>Final test · ${testSize(m)} questions</a></div>`;
          }
          return `<div class="wsd-unit${here?" here":""}${s.completed?" done":""}"><a class="wsd-unit-h" href="${here?"#/formula/"+slug:unitView(m).href}"><span class="dot" aria-hidden="true">${mark}</span><span class="nm">${esc(m.title)}</span><span class="sc">${score}</span></a>${steps}</div>`;
        }).join(""):""}
      </div>`;
    }).join("")}</div>`;
  
}
/* The outline sits as a slim rail of progress rings (one per formula, stages split by a
   gap). A click on a ring opens that formula; the button on top slides the full
   outline out over the page; a click outside, Esc or opening an exercise closes it. */
function railHTML(units,cur){
  // the rail shows only this formula: its practice steps and its test, as small tiles
  const steps=cur?cur.ex.map((id,i)=>{
    const now=!testRun&&id===currentExId, done=doneEx.has(id);
    return `<a class="wsd-s${done?" done":""}${now?" now":""}" href="#/practice/${encodeURIComponent(id)}" title="Practice ${i+1}" aria-label="Practice ${i+1}${done?", done":""}">${done&&!now?"✓":i+1}</a>`;
  }).join("")+`<a class="wsd-s t${testRun?" now":""}${unitDone(cur)?" done":""}" href="#/formula/${unitSlug(cur)}/test" title="Final test" aria-label="Final test">${unitDone(cur)?"✓":"T"}</a>`:"";
  return `<div class="wsd-railwrap"><button type="button" class="wsd-toggle" aria-expanded="false" aria-controls="ws-side" title="Course outline" aria-label="Open course outline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg></button>${steps?`<div class="wsd-rail" aria-label="${esc(cur.title)} steps">${steps}</div>`:""}</div>`;
}
function setSide(open){
  const el=document.getElementById("ws-side"); if(!el) return;
  el.classList.toggle("open",open);
  const b=el.querySelector(".wsd-toggle"); if(b){ b.setAttribute("aria-expanded",String(open)); b.setAttribute("aria-label",open?"Close course outline":"Open course outline"); }
  if(open){ const h=el.querySelector(".wsd-unit.here"); if(h) h.scrollIntoView({block:"nearest"}); }
}
document.addEventListener("click",e=>{
  const side=document.getElementById("ws-side"); if(!side) return;
  if(e.target.closest&&e.target.closest(".wsd-toggle")){ setSide(!side.classList.contains("open")); return; }
  if(side.classList.contains("open")&&!side.contains(e.target)) setSide(false);
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ const side=document.getElementById("ws-side"); if(side&&side.classList.contains("open")) setSide(false); } });
// stage headers in the outline open the course page at that stage
document.addEventListener("click",e=>{
  const a=e.target.closest&&e.target.closest(".wsd-stage-h"); if(!a) return;
  e.preventDefault(); const id=a.dataset.course, sec=a.getAttribute("href");
  openCourse(id); const t=document.querySelector(sec); if(t) t.scrollIntoView({block:"start"});
});

/* exercise brief: one delegated click handler (the brief is re-rendered per exercise) */
let hintViewed = false;
let solutionClickCount = 0;
let checkAttempts = 0;
/* after a wrong answer, put the selection back on the answer cell (spec P0-05) */
function backToAnswer(msg){
  if(!currentEx||currentEx.pick) return;
  const m=/Cell ([A-Z]{1,2}d{1,3})/.exec(String(msg)), p=parseRef(m?m[1]:targetRefs[0]);
  if(p) select(p.r,p.c);
}
document.getElementById("concept").addEventListener("click",e=>{
  const b=e.target.closest("[data-act]"); if(!b) return;
  const act=b.dataset.act;
  if(act==="check"){ if(currentEx) checkEx(currentEx); }
  else if(act==="reset"||act==="repeat"){ if(currentExId) openEx(currentExId,{fresh:true}); }
  else if(act==="report"){ e.preventDefault(); reportProblem(); }
  else if(act==="testnext"){ nextTestQuestion(); }
  else if(act==="brief"){
    briefMini=!briefMini;
    document.getElementById("concept").classList.toggle("mini",briefMini);
    b.textContent=briefMini?"Show task":"Hide task"; b.setAttribute("aria-expanded",String(!briefMini));
    positionSelBox();
  }
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
/* ---- The answer must move with the data (spec ticket P0-03) ----
   A right number can still be typed in: =SUM(574.9) or =SUM(B2:B4)+170.
   So once the result is right, every number in the exercise data is nudged
   and the student's formula is recalculated beside the stored solution on
   the same nudged sheet, twice. A real formula moves with the data; a
   typed-in number does not. Structural numbers (MATCH …,0 · MOD …,3 ·
   ROUND …,2) behave the same in both, so they never trip it. */
function nudgeNum(v,i,seed){ return Number.isInteger(v) ? v+seed*((i%3)+1) : +(v+seed*0.37*((i%3)+1)).toFixed(6); }
function sameVal(a,b){
  if(isErr(a)||isErr(b)) return isErr(a)&&isErr(b)&&a.__err===b.__err;
  if(typeof a==="number"&&typeof b==="number") return Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b));
  return String(a)===String(b);
}
function evalOn(sheet,ref){ resetCells(sheet); try{ return cellValue(ref,new Set()); }catch(e){ return isErr(e)?e:{__err:"#VALUE!"}; } }
function hardcodeIssue(ex,ref,sol){
  const data=ex.data||{}, keys=Object.keys(data).filter(k=>typeof data[k]==="number");
  if(!keys.length||!sol) return null;
  const live=cells; let moved=true;
  try{
    for(const seed of [1,2]){
      const a=JSON.parse(JSON.stringify(live));
      keys.forEach((k,i)=>{ const c=a[k], v=c&&c.raw!=null&&c.raw!==""?Number(c.raw):NaN; if(isFinite(v)) c.raw=String(nudgeNum(v,i,seed)); });
      const b=JSON.parse(JSON.stringify(a)); b[ref]={raw:sol};
      if(!sameVal(evalOn(a,ref),evalOn(b,ref))){ moved=false; break; }
    }
  } finally { resetCells(live); }
  if(moved) return null;
  // name the typed number when it is one of the data values
  const raw=String((cells[ref]||{}).raw||"");
  try{
    for(const t of tokenize(raw.replace(/^=/,""))){
      if(t.t!=="num") continue;
      const hit=keys.find(k=>Number(data[k])===t.v);
      if(hit) return "Use the cells, not the numbers. Replace <b>"+esc(String(t.v))+"</b> with a reference to <b>"+hit+"</b>.";
    }
  }catch(e){}
  return "Right number, but it's typed in. Build it from the data cells so it updates when the data changes.";
}

function checkEx(ex){
  if(editing)commitEdit(true);
  if(testRun&&testRun.answered) return;
  checkAttempts++;
  const fail=msg=>{ if(testRun) return testAnswered(false,msg); showResult("bad",msg); backToAnswer(msg); };
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
      const hc=hardcodeIssue(ex,ref,sol); if(hc) return fail("Cell "+ref+": "+hc);
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
  const hc=hardcodeIssue(ex,ex.target,ex.solution); if(hc) return fail(hc);
  pass(ex,"<code>"+esc(raw)+"</code> returns "+esc(toText(exp))+".");
}
function pass(ex,msg){
  if(testRun){ testAnswered(true,msg); return; }
  const wasDone=doneEx.has(currentExId);
  const P=exPlace(currentExId);
  const modWasDone=!!P.mod&&P.mod.ex.every(x=>doneEx.has(x));
  doneEx.add(currentExId);
  saveDone();
  const formulaDone=!!P.mod&&!modWasDone&&P.mod.ex.every(x=>doneEx.has(x));
  passedRefs=targetRefs.slice();
  recordPracticeDay();
  // a bracket Excel-style auto-closed on Enter still passes, with a nudge to type it yourself
  const autoNote=targetRefs.some(r=>cells[r]&&cells[r].ac)
    ? '<div class="ws-note">Excel closed the bracket for you — get in the habit of typing <code>)</code> yourself.</div>' : "";
  const assisted=solutionClickCount===2;
  if(assisted) assistedEx.add(currentExId); else assistedEx.delete(currentExId);
  saveAssisted();
  const assistNote=assisted?"<div class=\"ws-note\">Solved with the solution open, so it is marked <b>assisted</b>. Come back later and do it on your own.</div>":"";
  showResult("ok",msg+autoNote+assistNote,{newlyDone:!wasDone,formulaDone,autoNote:autoNote+assistNote});
  updateStreak(); renderOutline(); renderAll();
  phoneAfterPass(!wasDone);
  if(typeof accountAfterPass==="function") accountAfterPass(currentExId);   // signed in: save to the account (js/account.js)
  // Enter continues: focus the Next button (laptop only; on a phone it would pop the keyboard state)
  if(!isPhone()) setTimeout(()=>{ const n=document.querySelector("#briefFoot .ws-primary"); if(n) n.focus({preventScroll:true}); },0);
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
document.getElementById("btnImportProg").onclick=()=>{ setProgMenu(false); document.getElementById("progFile").click(); };
/* Progress menu in the Courses header (spec C1) */
function setProgMenu(open){
  const pop=document.getElementById("progMenu"), btn=document.getElementById("btnProgMenu"); if(!pop) return;
  pop.hidden=!open; btn.setAttribute("aria-expanded",String(open));
}
document.getElementById("btnProgMenu").addEventListener("click",e=>{ e.stopPropagation(); setProgMenu(document.getElementById("progMenu").hidden); });
document.addEventListener("click",e=>{ if(!e.target.closest(".dk-pmenu")) setProgMenu(false); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") setProgMenu(false); });
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
  [["Enter"],"Move down · Shift+Enter moves up"],
  [["Ctrl","Enter"],"Check answer (when not typing)"]]],
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
window.commitRaw = commitRaw;
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
loadTests();
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
