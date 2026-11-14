"use strict";
/* account.js — optional Google sign-in (Supabase Auth) and progress sync.
   Classic script, loaded last (after app.js); shares the global scope.

   Guests keep working exactly as before: progress lives in the browser.
   Signing in adds an account copy of the same data and keeps devices in step:
     - first sign-in on a device: account and browser are merged (union, nothing is lost)
     - every later pass and practice day is written to the account in the background
     - each page load re-merges, so a missed write is picked up next time
   Tables and access rules: supabase/001_progress.sql — every user can read and
   write only their own rows (row-level security). The key below is Supabase's
   public "publishable" key, made to be used in browsers; it grants nothing the
   access rules don't allow. ?test (PERSIST off) switches all of this off. */
const SB_URL="https://mfttowlzaotuhgeryjqo.supabase.co";
const SB_KEY="sb_publishable_Gx7O0AXp--bUsMGS4pdjQQ_yLjX2j80";
const SB_LIB="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/dist/umd/supabase.js";
const SB_SRI="sha384-rwykjmWNwVxboyFmvK9OXN0wj9hnMHA2aAHtits54DuACyCq0M2PrSNxhRb+hvXT";   // the library must match this exact file
let sb=null, acctUser=null, syncState="idle";   // idle | syncing | ok | error

/* Sign-in uses Google's own "Sign in with Google" button (Google Identity
   Services). The student signs in on our page, so Google's screen names
   tyrocell.vercel.app, not the Supabase server. Google hands back a signed
   ID token, which Supabase checks (with a one-time nonce) before creating the
   session. If Google's script can't load, a plain button falls back to the
   redirect flow through Supabase. */
const GOOGLE_CLIENT_ID="142473364252-joqql7hspi5s92lalfr86g6ducvcjfku.apps.googleusercontent.com";
let gisReady=false, gisFailed=false, gisNonce=null;
function loadGis(){
  return new Promise((res,rej)=>{
    if(window.google&&google.accounts&&google.accounts.id) return res();
    const s=document.createElement("script");
    s.src="https://accounts.google.com/gsi/client"; s.async=true;
    s.onload=res; s.onerror=()=>rej(new Error("Google sign-in script failed to load"));
    document.head.appendChild(s);
  });
}
async function newNonce(){
  const raw=btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))));
  const h=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw)));
  return {raw, hashed:[...h].map(b=>b.toString(16).padStart(2,"0")).join("")};
}
// (re)arm Google's button with a fresh nonce; called on load and after signing out
async function armGis(){
  if(!gisReady||acctUser) return;
  gisNonce=await newNonce();
  google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID, callback:onGoogleCredential, nonce:gisNonce.hashed,
    ux_mode:"popup", auto_select:false, itp_support:true});   // classic popup: FedCM fails in some browsers (seen in embedded Chromium)
  renderAcct(true);
}
/* Google's button opens a popup. When a browser blocks it (popup blockers,
   automated or embedded browsers), nothing visible happens. A popup that opens
   takes focus from this page; if the page keeps focus for 1.2s after the click,
   fall back to the full-page Google sign-in, which can't be blocked. */
function watchPopup(){
  // (a click inside Google's button frame keeps document.hasFocus() true; an opened popup window makes it false)
  setTimeout(()=>{
    if(!acctUser&&document.hasFocus()){
      toast("Opening Google sign-in…");
      acctSignIn();
    }
  },1200);
}
async function onGoogleCredential(resp){
  if(!sb||!resp||!resp.credential||!gisNonce) return;
  const {error}=await sb.auth.signInWithIdToken({provider:"google", token:resp.credential, nonce:gisNonce.raw});
  gisNonce=null;
  if(error){ toast("Google sign-in didn't complete. Please try again."); armGis(); }
}

function loadSbLib(){
  return new Promise((res,rej)=>{
    if(window.supabase&&window.supabase.createClient) return res();
    const s=document.createElement("script");
    s.src=SB_LIB; s.integrity=SB_SRI; s.crossOrigin="anonymous";
    s.onload=res; s.onerror=()=>rej(new Error("sign-in library failed to load"));
    document.head.appendChild(s);
  });
}

async function acctInit(){
  renderAcct();
  if(!PERSIST) return;
  try{ await loadSbLib(); }catch(e){ syncState="error"; renderAcct(); return; }
  sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{
    flowType:"pkce", persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, storageKey:"tyro_auth_v1" }});
  sb.auth.onAuthStateChange((event,session)=>{
    const u=session&&session.user||null, changed=(u&&u.id)!==(acctUser&&acctUser.id);
    acctUser=u;
    if(u&&changed) setTimeout(syncAll,0);
    if(event==="SIGNED_IN") backAfterLogin();
    if(u) hideSigninPrompt();
    renderAcct(changed);
    if(changed&&document.getElementById("view-home").classList.contains("on")) renderHome();   // refresh the save-status line
  });
  await sb.auth.getSession();   // restores a saved session before anything else
  cleanAuthUrl();
  if(AUTH_RETURN) await finishGoogleRedirect();
  try{ await loadGis(); gisReady=true; armGis(); }
  catch(e){ gisFailed=true; renderAcct(true); }
}
// Google returns to /app/?code=…: drop the code from the address bar
function cleanAuthUrl(){
  if(/[?&](code|error)=/.test(location.search)) history.replaceState(null,"",location.pathname+location.hash);
}
function backAfterLogin(){
  let to=null; try{ to=sessionStorage.getItem("tyro_after_login"); sessionStorage.removeItem("tyro_after_login"); }catch(e){}
  if(to&&to!==location.hash) location.hash=to;
}

/* Full-page sign-in, straight to Google (no Supabase hop, so Google's screen names
   this site). Used when the popup is blocked or Google's button script didn't load.
   Google returns an ID token in the address fragment; finishGoogleRedirect() checks
   the state value and hands the token + nonce to Supabase. */
async function acctSignIn(){
  if(!sb){ toast("Sign-in is still loading. Try again in a moment."); return; }
  const n=await newNonce(), state=[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,"0")).join("");
  try{
    sessionStorage.setItem("tyro_after_login", location.hash||"#/home");
    sessionStorage.setItem("tyro_g_state", state); sessionStorage.setItem("tyro_g_nonce", n.raw);
  }catch(e){ toast("Sign-in needs this browser's storage. Please allow it and try again."); return; }
  location.href="https://accounts.google.com/o/oauth2/v2/auth?"+new URLSearchParams({
    client_id:GOOGLE_CLIENT_ID, redirect_uri:location.origin+"/app/", response_type:"id_token",
    scope:"openid email profile", nonce:n.hashed, state, prompt:"select_account" });
}
async function finishGoogleRedirect(){
  const p=new URLSearchParams(AUTH_RETURN); let st=null, nonce=null;
  try{ st=sessionStorage.getItem("tyro_g_state"); nonce=sessionStorage.getItem("tyro_g_nonce");
       sessionStorage.removeItem("tyro_g_state"); sessionStorage.removeItem("tyro_g_nonce"); }catch(e){}
  if(p.get("error")){ if(p.get("error")!=="access_denied") toast("Google sign-in didn't complete. Please try again."); backAfterLogin(); return; }
  if(!p.get("id_token")||!st||p.get("state")!==st||!nonce){ toast("That sign-in link has expired. Please try again."); return; }
  const {error}=await sb.auth.signInWithIdToken({provider:"google", token:p.get("id_token"), nonce});
  if(error){ toast("Google sign-in didn't complete. Please try again."); backAfterLogin(); }
}
async function acctSignOut(){
  if(!sb) return;
  await sb.auth.signOut();
  acctUser=null; syncState="idle";
  if(gisReady){ google.accounts.id.disableAutoSelect(); armGis(); } else renderAcct(true);
  toast("Signed out. Your progress is still saved in this browser.");
}

/* merge account ⇄ browser. "assisted" (solved with the solution open) loses to a clean pass on either side */
async function syncAll(){
  if(!sb||!acctUser) return;
  const uid=acctUser.id;
  syncState="syncing"; renderAcct();
  try{
    const [p,d]=await Promise.all([sb.from("progress").select("exercise_id,status"), sb.from("practice_days").select("day")]);
    if(p.error) throw p.error; if(d.error) throw d.error;
    const remote=new Map(p.data.map(r=>[r.exercise_id,r.status]));
    let pulled=0;
    remote.forEach((st,id)=>{
      // a completed formula (final test passed) is stored as "unit_<slug>"; the score itself stays on the device that took it
      if(/^unit_[a-z0-9_]+$/.test(id)){
        const t=testScores[id];
        if(!t||t.best<PASS_MARK){ testScores[id]={best:PASS_MARK,last:t?t.last:PASS_MARK,at:t?t.at:dayKey()}; pulled++; }
        return;
      }
      if(!EX[id]) return;
      if(!doneEx.has(id)){ doneEx.add(id); pulled++; if(st==="assisted") assistedEx.add(id); }
      else if(st==="done") assistedEx.delete(id);
    });
    const push=[...doneEx].filter(id=>EX[id]&&(!remote.has(id)||(remote.get(id)==="assisted"&&!assistedEx.has(id))))
      .map(id=>({user_id:uid,exercise_id:id,status:assistedEx.has(id)?"assisted":"done"}));
    Object.keys(testScores).filter(k=>/^unit_[a-z0-9_]+$/.test(k)&&testScores[k].best>=PASS_MARK&&!remote.has(k))
      .forEach(k=>push.push({user_id:uid,exercise_id:k,status:"done"}));
    const rdays=new Set(d.data.map(r=>String(r.day).slice(0,10))), ldays=loadDays();
    const allDays=[...new Set(ldays.concat([...rdays]))].sort();
    lsSet(LS_DAYS,JSON.stringify(allDays.slice(-400)));
    const pushDays=ldays.filter(x=>!rdays.has(x)).map(day=>({user_id:uid,day}));
    if(push.length){ const r=await sb.from("progress").upsert(push); if(r.error) throw r.error; }
    if(pushDays.length){ const r=await sb.from("practice_days").upsert(pushDays); if(r.error) throw r.error; }
    saveDone(); saveAssisted(); saveTests();
    await syncDrafts();
    await sendAttempts();   // answers checked as a guest are attached to the account now
    syncState="ok"; renderAcct(); refreshAfterSync();
    if(pulled) toast(`Synced: ${pulled} exercise${pulled>1?"s":""} added from your account.`);
  }catch(e){ syncState="error"; renderAcct(); }
}
/* ---- the one-time "keep your progress safe" card (spec P1-02) ----
   Shown once, under the result, after a guest's 3rd completed exercise.
   "Continue as guest" hides it for good on this browser. Never blocks anything. */
const LS_SIGNIN_PROMPT="tyro_signin_prompt_v1";
function signinPromptWanted(){
  return PERSIST&&!!sb&&!acctUser&&(gisReady||gisFailed)&&doneEx.size>=3&&lsGet(LS_SIGNIN_PROMPT)!=="done";
}
function showSigninPrompt(){
  const foot=document.getElementById("briefFoot"); if(!foot||foot.querySelector(".acct-card")) return;
  lsSet(LS_SIGNIN_PROMPT,"done");   // once per browser, whatever the student picks
  const n=doneEx.size, card=document.createElement("div");
  card.className="acct-card"; card.setAttribute("role","status");
  card.innerHTML=`<b>Keep your progress safe</b>
    <p>You've solved ${n} exercises. They're saved in this browser only. Sign in with Google to keep them on any device.</p>
    <div class="acct-card-row"><div class="acct-card-g"></div><button class="acct-card-no" type="button">No thanks, continue as guest</button></div>`;
  foot.appendChild(card);
  const g=card.querySelector(".acct-card-g");
  if(gisReady) google.accounts.id.renderButton(g,{type:"standard",theme:"filled_black",size:"large",text:"signin_with",shape:"pill",click_listener:watchPopup});
  else g.innerHTML=`<button class="acct-in" type="button">${G_ICON}<span>Sign in with Google</span></button>`, g.firstChild.onclick=acctSignIn;
  card.querySelector(".acct-card-no").onclick=()=>card.remove();
}
function hideSigninPrompt(){ document.querySelectorAll(".acct-card").forEach(c=>c.remove()); }
/* Home: where progress is saved */
function acctStatusHTML(){
  if(!PERSIST) return "";
  return acctUser
    ? `<p class="hm-save ok">Saved to your account <span aria-hidden="true">✓</span></p>`
    : `<p class="hm-save">Saved in this browser only · Sign in (top right) to keep it on every device</p>`;
}

/* ---- work in progress, saved to the account as you go ----
   Unfinished final tests ("test:unit_sum") and half-written sheets ("sheet:sum_weekly")
   are written to the drafts table shortly after each change (one write per key per
   0.6s), so another device can pick them up. null deletes (a finished test, a Reset). */
const draftTimers={}, draftPending={};
function accountSaveDraft(key,data){
  if(!sb||!acctUser||!/^(test|sheet):[a-z0-9_]{1,64}$/.test(key)) return;
  clearTimeout(draftTimers[key]); draftPending[key]=data;
  draftTimers[key]=setTimeout(()=>flushDraft(key), data==null?0:600);
}
async function flushDraft(key){
  if(!(key in draftPending)||!sb||!acctUser) return;
  const data=draftPending[key]; delete draftPending[key]; clearTimeout(draftTimers[key]);
  try{
    const r=data==null
      ? await sb.from("drafts").delete().eq("user_id",acctUser.id).eq("key",key)
      : await sb.from("drafts").upsert({user_id:acctUser.id,key,data,updated_at:new Date().toISOString()});
    if(r.error) throw r.error;
    syncState="ok";
  }catch(e){
    if(!(key in draftPending)) draftPending[key]=data;   // keep it for the retry (unless a newer one is already waiting)
    syncState="error";
  }
  renderAcct();
}
// back online (or back to the tab): retry anything that failed, and re-merge everything
addEventListener("online",()=>{ if(sb&&acctUser){ Object.keys(draftPending).forEach(flushDraft); syncAll(); } });
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"&&sb&&acctUser&&syncState==="error") syncAll(); });
// leaving or hiding the page: send anything still waiting
addEventListener("pagehide",()=>Object.keys(draftPending).forEach(flushDraft));
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") Object.keys(draftPending).forEach(flushDraft); });
/* on sign-in and each load: take the drafts this browser lacks, send the ones the account lacks */
async function syncDrafts(){
  const dr=await sb.from("drafts").select("key,data");
  if(dr.error) return;   // table not there yet: drafts stay in this browser
  const remote=new Set(), tdrafts=loadTestDrafts();
  let gotTests=false;
  for(const row of dr.data){
    remote.add(row.key);
    const i=row.key.indexOf(":"), kind=row.key.slice(0,i), id=row.key.slice(i+1);
    if(kind==="sheet"&&EX[id]&&!lsGet(LS_SHEET+id)) lsSet(LS_SHEET+id, JSON.stringify(row.data));
    if(kind==="test"&&!tdrafts[id]&&row.data&&Array.isArray(row.data.ids)){ tdrafts[id]=row.data; gotTests=true; }
  }
  if(gotTests) lsSet(LS_TESTDRAFT, JSON.stringify(tdrafts));
  Object.keys(tdrafts).forEach(k=>{ if(!remote.has("test:"+k)) accountSaveDraft("test:"+k, tdrafts[k]); });
  try{
    for(let n=0;n<localStorage.length;n++){
      const k=localStorage.key(n); if(!k||!k.startsWith(LS_SHEET)) continue;
      const id=k.slice(LS_SHEET.length);
      if(EX[id]&&!remote.has("sheet:"+id)) accountSaveDraft("sheet:"+id, JSON.parse(localStorage.getItem(k)));
    }
  }catch(e){}
}

/* ---- attempts: the browser's queue is sent in batches, then cleared ---- */
let attemptTimer=null, attemptsSending=false;
function accountSendAttempts(){ if(!sb||!acctUser) return; clearTimeout(attemptTimer); attemptTimer=setTimeout(sendAttempts,800); }
async function sendAttempts(){
  if(!sb||!acctUser||attemptsSending) return;
  const queue=loadAttempts(); if(!queue.length) return;
  attemptsSending=true;
  try{
    const r=await sb.from("attempts").insert(queue.map(a=>Object.assign({user_id:acctUser.id},a)));
    if(r.error) throw r.error;
    // keep anything logged while this batch was in flight
    lsSet(LS_ATTEMPTS, JSON.stringify(loadAttempts().slice(queue.length)));
  }catch(e){ syncState="error"; renderAcct(); }
  attemptsSending=false;
}

/* ---- your data (spec P1-14): download it all, or delete the account ---- */
async function downloadMyData(){
  if(!sb||!acctUser) return;
  toast("Preparing your data…");
  const q=async t=>{ const r=await sb.from(t).select("*"); return r.error?{error:r.error.message}:r.data; };
  const out={
    exported_at:new Date().toISOString(), app:"tyro.cell",
    account:{email:acctUser.email, name:(acctUser.user_metadata||{}).full_name||null, created_at:acctUser.created_at},
    progress:await q("progress"), practice_days:await q("practice_days"), drafts:await q("drafts"), attempts:await q("attempts"),
    this_browser:{completed_exercises:[...doneEx], assisted:[...assistedEx], test_scores:testScores, practice_days:loadDays(), unsent_attempts:loadAttempts()}
  };
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:"application/json"}));
  a.download="tyrocell-my-data.json"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
function openDeleteDialog(){
  closeDeleteDialog();
  const back=document.createElement("div");
  back.className="acct-del-back"; back.id="acctDelete";
  back.innerHTML=`<div class="acct-del" role="dialog" aria-modal="true" aria-labelledby="acctDelTitle">
      <h2 id="acctDelTitle">Delete your account?</h2>
      <p>This permanently deletes your tyro.cell account and everything saved in it: progress, test results, work in progress and answer history. It can't be undone.</p>
      <label class="acct-del-check"><input type="checkbox" id="acctDelLocal" checked> Also clear the progress saved in this browser</label>
      <div class="acct-del-actions"><button type="button" class="acct-del-cancel">Cancel</button><button type="button" class="acct-del-go">Delete account</button></div>
    </div>`;
  document.body.appendChild(back);
  back.querySelector(".acct-del-cancel").focus();
  back.addEventListener("click",e=>{
    if(e.target===back||e.target.closest(".acct-del-cancel")) closeDeleteDialog();
    else if(e.target.closest(".acct-del-go")) deleteMyAccount(back.querySelector("#acctDelLocal").checked);
  });
}
function closeDeleteDialog(){ const d=document.getElementById("acctDelete"); if(d) d.remove(); }
async function deleteMyAccount(clearLocal){
  const btn=document.querySelector(".acct-del-go"); if(btn){ btn.disabled=true; btn.textContent="Deleting…"; }
  const r=await sb.rpc("delete_my_account");
  if(r.error){ if(btn){ btn.disabled=false; btn.textContent="Delete account"; } toast("Couldn't delete the account. Please try again."); return; }
  try{ await sb.auth.signOut({scope:"local"}); }catch(e){}
  acctUser=null; syncState="idle";
  if(clearLocal){
    try{ Object.keys(localStorage).filter(k=>k.startsWith("tyro_")&&k!=="tyro_onboard").forEach(k=>localStorage.removeItem(k)); }catch(e){}
    doneEx.clear(); assistedEx.clear(); testScores={};
  }
  closeDeleteDialog();
  if(gisReady) armGis(); else renderAcct(true);
  if(typeof refreshAfterSync==="function") refreshAfterSync();
  toast("Your account has been deleted.");
}
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeDeleteDialog(); });

/* after each pass (called from pass() in app.js) */
async function accountAfterPass(exId){
  if(!acctUser&&signinPromptWanted()){ setTimeout(()=>{ if(signinPromptWanted()) showSigninPrompt(); },500); return; }
  if(!sb||!acctUser||!EX[exId]) return;
  const uid=acctUser.id;
  syncState="syncing"; renderAcct();
  try{
    const r1=await sb.from("progress").upsert({user_id:uid,exercise_id:exId,status:assistedEx.has(exId)?"assisted":"done",updated_at:new Date().toISOString()});
    if(r1.error) throw r1.error;
    const r2=await sb.from("practice_days").upsert({user_id:uid,day:dayKey()});
    if(r2.error) throw r2.error;
    syncState="ok";
  }catch(e){ syncState="error"; }
  renderAcct();
}
/* after a passed final test (called from finishTest() in app.js) */
async function accountAfterTest(m){
  if(!sb||!acctUser||!unitDone(m)) return;
  syncState="syncing"; renderAcct();
  try{
    const r=await sb.from("progress").upsert({user_id:acctUser.id,exercise_id:unitKey(m),status:"done",updated_at:new Date().toISOString()});
    if(r.error) throw r.error;
    const r2=await sb.from("practice_days").upsert({user_id:acctUser.id,day:dayKey()}); if(r2.error) throw r2.error;
    syncState="ok";
  }catch(e){ syncState="error"; }
  renderAcct();
}
function refreshAfterSync(){
  const on=v=>document.getElementById("view-"+v).classList.contains("on");
  if(on("home")) renderHome();
  if(on("courses")) renderCourses();
  if(on("course")&&currentCourse) openCourse(currentCourse.id);
  if(typeof updateStreak==="function") updateStreak();
}

/* the account control in the Home / Courses / course headers */
const G_ICON='<svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>';
const SYNC_TEXT={idle:"",syncing:"Syncing…",ok:"Progress synced",error:"Not synced yet. Will retry next visit."};
/* force=true redraws Google's button (new nonce); otherwise a signed-out slot is left alone */
function renderAcct(force){
  document.querySelectorAll("[data-acct]").forEach(slot=>{
    if(!PERSIST){ slot.hidden=true; return; }
    slot.hidden=false;
    if(!acctUser){
      const want=gisReady?"gis":gisFailed?"fallback":"loading";
      if(!force&&slot.dataset.state===want) return;
      slot.dataset.state=want;
      const note="";
      if(want==="gis"){
        slot.innerHTML=note+'<div class="acct-g"></div>';
        google.accounts.id.renderButton(slot.querySelector(".acct-g"),{type:isPhone()?"icon":"standard",theme:"outline",size:"medium",
          text:"signin",shape:"pill",logo_alignment:"left",click_listener:watchPopup});
      } else if(want==="fallback"){
        slot.innerHTML=note+`<button class="acct-in" data-acct-act="in" title="Save your progress to your Google account">${G_ICON}<span>Sign in</span></button>`;
      } else slot.innerHTML="";
      return;
    }
    slot.dataset.state="in";
    const m=acctUser.user_metadata||{}, name=m.full_name||m.name||acctUser.email||"Your account";
    const open=slot.dataset.open==="1";
    slot.innerHTML=`<button class="acct-me" data-acct-act="menu" aria-haspopup="true" aria-expanded="${open}" title="${esc(name)}"><span class="acct-av" aria-hidden="true">${esc(name.trim()[0]||"?").toUpperCase()}</span><span class="acct-dot ${syncState}" aria-hidden="true"></span><span class="ws-sr">Account</span></button>
      <div class="acct-pop" ${open?"":"hidden"}>
        <div class="acct-name">${esc(name)}</div>
        ${acctUser.email?`<div class="acct-mail">${esc(acctUser.email)}</div>`:""}
        <div class="acct-sync ${syncState}">${SYNC_TEXT[syncState]}</div>
        <div class="acct-links"><button class="acct-link" data-acct-act="download">Download my data</button><button class="acct-link danger" data-acct-act="delete">Delete account</button></div>
        <button class="acct-out" data-acct-act="out">Sign out</button>
      </div>`;
  });
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-acct-act]");
  let changed=false;
  // a click outside an open menu closes it
  document.querySelectorAll('[data-acct][data-open="1"]').forEach(s=>{ if(!s.contains(e.target)){ s.dataset.open="0"; changed=true; } });
  if(!b&&!changed) return;
  if(b){
    const act=b.dataset.acctAct, slot=b.closest("[data-acct]");
    if(act==="in") acctSignIn();
    else if(act==="out"){ slot.dataset.open="0"; acctSignOut(); return; }
    else if(act==="download"){ slot.dataset.open="0"; downloadMyData(); }
    else if(act==="delete"){ slot.dataset.open="0"; openDeleteDialog(); }
    else if(act==="menu") slot.dataset.open=slot.dataset.open==="1"?"0":"1";
  }
  renderAcct();
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&document.querySelector('[data-acct][data-open="1"]')){ document.querySelectorAll("[data-acct]").forEach(s=>s.dataset.open="0"); renderAcct(); } });

// Home was drawn before this file loaded: redraw it once so the save-status line appears
if(document.getElementById("view-home").classList.contains("on")) renderHome();
acctInit();
