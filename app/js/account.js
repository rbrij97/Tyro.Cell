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
    renderAcct(changed);
  });
  await sb.auth.getSession();   // finishes a Google return (?code=…) before anything else
  cleanAuthUrl();
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

async function acctSignIn(){
  if(!sb){ toast("Sign-in is still loading. Try again in a moment."); return; }
  try{ sessionStorage.setItem("tyro_after_login", location.hash||"#/home"); }catch(e){}
  const {error}=await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+"/app/"}});
  if(error) toast("Could not start Google sign-in. Please try again.");
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
      if(!EX[id]) return;
      if(!doneEx.has(id)){ doneEx.add(id); pulled++; if(st==="assisted") assistedEx.add(id); }
      else if(st==="done") assistedEx.delete(id);
    });
    const push=[...doneEx].filter(id=>EX[id]&&(!remote.has(id)||(remote.get(id)==="assisted"&&!assistedEx.has(id))))
      .map(id=>({user_id:uid,exercise_id:id,status:assistedEx.has(id)?"assisted":"done"}));
    const rdays=new Set(d.data.map(r=>String(r.day).slice(0,10))), ldays=loadDays();
    const allDays=[...new Set(ldays.concat([...rdays]))].sort();
    lsSet(LS_DAYS,JSON.stringify(allDays.slice(-400)));
    const pushDays=ldays.filter(x=>!rdays.has(x)).map(day=>({user_id:uid,day}));
    if(push.length){ const r=await sb.from("progress").upsert(push); if(r.error) throw r.error; }
    if(pushDays.length){ const r=await sb.from("practice_days").upsert(pushDays); if(r.error) throw r.error; }
    saveDone(); saveAssisted();
    syncState="ok"; renderAcct(); refreshAfterSync();
    if(pulled) toast(`Synced: ${pulled} exercise${pulled>1?"s":""} added from your account.`);
  }catch(e){ syncState="error"; renderAcct(); }
}
/* after each pass (called from pass() in app.js) */
async function accountAfterPass(exId){
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
function refreshAfterSync(){
  const on=v=>document.getElementById("view-"+v).classList.contains("on");
  if(on("home")) renderHome();
  if(on("courses")) renderCourses();
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
      if(want==="gis"){
        slot.innerHTML='<div class="acct-g"></div>';
        google.accounts.id.renderButton(slot.firstChild,{type:isPhone()?"icon":"standard",theme:"outline",size:"medium",
          text:"signin",shape:"pill",logo_alignment:"left"});
      } else if(want==="fallback"){
        slot.innerHTML=`<button class="acct-in" data-acct-act="in" title="Save your progress to your Google account">${G_ICON}<span>Sign in</span></button>`;
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
    else if(act==="menu") slot.dataset.open=slot.dataset.open==="1"?"0":"1";
  }
  renderAcct();
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&document.querySelector('[data-acct][data-open="1"]')){ document.querySelectorAll("[data-acct]").forEach(s=>s.dataset.open="0"); renderAcct(); } });

acctInit();
