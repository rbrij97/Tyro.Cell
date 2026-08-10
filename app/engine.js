"use strict";
/* =========================================================================
   ENGINE MODULE  —  formula engine, cell storage, coordinate system.
   Pure logic, no DOM. Loaded via <script src="engine.js"> before the UI.
   Exposes window.Engine for consumption by the grid UI and test harness.
   ========================================================================= */
(function(){
let COLS = 16, ROWS = 60;
const colName = i => { let s=""; i++; while(i>0){ s=String.fromCharCode(65+(i-1)%26)+s; i=Math.floor((i-1)/26);} return s; };
let COLNAMES = Array.from({length:COLS},(_,i)=>colName(i));
let cells = {};

const refOf=(r,c)=>COLNAMES[c]+r;
function parseRef(s){ const m=String(s).trim().toUpperCase().match(/^\$?([A-Z]{1,2})\$?(\d{1,3})$/); if(!m)return null;
  const c=COLNAMES.indexOf(m[1]); const r=+m[2]; if(c<0||r<1||r>ROWS)return null; return {r,c}; }
const getCell=ref=>cells[ref]||null;
function setRaw(ref,val){ if(val===""||val==null){ if(cells[ref]){delete cells[ref].raw; if(!cells[ref].b&&!cells[ref].i&&!cells[ref].u)delete cells[ref]; else cells[ref].raw="";} }
  else { (cells[ref]=cells[ref]||{}).raw=String(val); } }

/* ================= FORMULA ENGINE ================= */
const FErr = code => ({ __err: code });
const isErr = v => v && typeof v==="object" && v.__err;

function tokenize(src){
  const toks=[]; let i=0;
  while(i<src.length){
    const ch=src[i];
    if(ch===" "||ch==="\t"){i++;continue;}
    if(ch==='"'){ let j=i+1,s="";
      while(j<src.length){ if(src[j]==='"'){ if(src[j+1]==='"'){s+='"';j+=2;} else break; } else {s+=src[j];j++;} }
      if(j>=src.length) throw FErr("#VALUE!");
      toks.push({t:"str",v:s}); i=j+1; continue; }
    if(/[0-9]/.test(ch)||(ch==="."&&/[0-9]/.test(src[i+1]||""))){
      let j=i; while(j<src.length&&/[0-9.]/.test(src[j]))j++;
      if((src[j]==="e"||src[j]==="E")&&/[0-9+\-]/.test(src[j+1]||"")){ j++; if(/[+\-]/.test(src[j]))j++; while(/[0-9]/.test(src[j]||""))j++; }
      toks.push({t:"num",v:parseFloat(src.slice(i,j))}); i=j; continue; }
    if(/[A-Za-z_$]/.test(ch)){
      let j=i; while(j<src.length&&/[A-Za-z0-9_.$]/.test(src[j]))j++;
      const w=src.slice(i,j); i=j;
      if(src[i]==="("){ toks.push({t:"func",v:w.toUpperCase()}); continue; }
      if(/^(TRUE|FALSE)$/i.test(w)){ toks.push({t:"bool",v:/^t/i.test(w)}); continue; }
      if(/^\$?[A-Za-z]{1,2}\$?\d{1,3}$/.test(w)){ toks.push({t:"ref",v:w.replace(/\$/g,"").toUpperCase()}); continue; }
      throw FErr("#NAME?"); }
    if(ch==="<"&&src[i+1]==="="){toks.push({t:"op",v:"<="});i+=2;continue;}
    if(ch===">"&&src[i+1]==="="){toks.push({t:"op",v:">="});i+=2;continue;}
    if(ch==="<"&&src[i+1]===">"){toks.push({t:"op",v:"<>"});i+=2;continue;}
    if(src.startsWith("#REF!",i)){toks.push({t:"errtok",v:"#REF!"});i+=5;continue;}
    if("+-*/^&%(),:=<>".includes(ch)){toks.push({t:"op",v:ch});i++;continue;}
    throw FErr("#NAME?");
  }
  return toks;
}

function parse(toks){
  let p=0;
  const peek=()=>toks[p], eat=()=>toks[p++];
  const isOp=v=>peek()&&peek().t==="op"&&peek().v===v;
  function primary(){
    const t=peek(); if(!t) throw FErr("#VALUE!");
    if(t.t==="errtok"){eat();throw FErr(t.v);}
    if(t.t==="num"||t.t==="str"||t.t==="bool"){eat();return{k:t.t,v:t.v};}
    if(t.t==="ref"){ eat();
      if(isOp(":")){ eat(); const t2=eat(); if(!t2||t2.t!=="ref") throw FErr("#REF!"); return{k:"range",a:t.v,b:t2.v}; }
      return{k:"ref",v:t.v}; }
    if(t.t==="func"){ eat();
      if(!isOp("(")) throw FErr("#VALUE!"); eat();
      const args=[];
      if(!isOp(")")){ args.push(expr()); while(isOp(",")){eat();args.push(expr());} }
      if(!isOp(")")) throw FErr("#VALUE!"); eat();
      return{k:"call",fn:t.v,args}; }
    if(isOp("(")){ eat(); const e=expr(); if(!isOp(")")) throw FErr("#VALUE!"); eat(); return e; }
    throw FErr("#VALUE!");
  }
  function postfix(){ let e=primary(); while(isOp("%")){eat(); e={k:"pct",e};} return e; }
  function unary(){ if(isOp("-")){eat();return{k:"neg",e:unary()};} if(isOp("+")){eat();return unary();} return postfix(); }
  function power(){ let l=unary(); while(isOp("^")){eat(); l={k:"bin",op:"^",l,r:unary()};} return l; }
  function mul(){ let l=power(); while(isOp("*")||isOp("/")){const o=eat().v; l={k:"bin",op:o,l,r:power()};} return l; }
  function add(){ let l=mul(); while(isOp("+")||isOp("-")){const o=eat().v; l={k:"bin",op:o,l,r:mul()};} return l; }
  function concat(){ let l=add(); while(isOp("&")){eat(); l={k:"bin",op:"&",l,r:add()};} return l; }
  function expr(){ let l=concat();
    while(peek()&&peek().t==="op"&&["=","<",">","<=",">=","<>"].includes(peek().v)){
      const o=eat().v; l={k:"bin",op:o,l,r:concat()}; }
    return l; }
  const e=expr();
  if(p<toks.length) throw FErr("#VALUE!");
  return e;
}

function cellValue(ref, visiting){
  const c=getCell(ref);
  const raw=c&&c.raw!=null?String(c.raw):"";
  if(raw==="") return "";
  if(raw[0]==="="){
    if(visiting.has(ref)) throw FErr("#REF!");
    visiting.add(ref);
    try{ return evalStr(raw.slice(1),visiting); }
    finally{ visiting.delete(ref); }
  }
  if(/^-?(\d+\.?\d*|\.\d+)([eE][+\-]?\d+)?$/.test(raw.trim())) return parseFloat(raw);
  if(/^(true|false)$/i.test(raw.trim())) return /^t/i.test(raw.trim());
  return raw;
}
function evalStr(src,visiting){ return evalNode(parse(tokenize(src)),visiting); }

function rangeCells(a,b){
  const A=parseRef(a),B=parseRef(b); if(!A||!B) throw FErr("#REF!");
  const r1=Math.min(A.r,B.r),r2=Math.max(A.r,B.r),c1=Math.min(A.c,B.c),c2=Math.max(A.c,B.c);
  const out=[];
  for(let r=r1;r<=r2;r++){const row=[];for(let c=c1;c<=c2;c++)row.push(refOf(r,c));out.push(row);}
  return out;
}
function evalNode(n,visiting){
  switch(n.k){
    case "num": case "str": case "bool": return n.v;
    case "ref": { if(!parseRef(n.v)) throw FErr("#REF!"); return cellValue(n.v,visiting); }
    case "range": return { __range: rangeCells(n.a,n.b).map(row=>row.map(rf=>cellValue(rf,visiting))) };
    case "pct": return toNum(scalar(evalNode(n.e,visiting)))/100;
    case "neg": return -toNum(scalar(evalNode(n.e,visiting)));
    case "bin": {
      const L=scalar(evalNode(n.l,visiting)), R=scalar(evalNode(n.r,visiting));
      switch(n.op){
        case "+": return toNum(L)+toNum(R);
        case "-": return toNum(L)-toNum(R);
        case "*": return toNum(L)*toNum(R);
        case "/": { const d=toNum(R); if(d===0) throw FErr("#DIV/0!"); return toNum(L)/d; }
        case "^": return Math.pow(toNum(L),toNum(R));
        case "&": return toText(L)+toText(R);
        default: return compare(L,R,n.op);
      } }
    case "call": return callFn(n.fn,n.args,visiting);
  }
}
const isRange=v=>v&&typeof v==="object"&&v.__range;
function scalar(v){ if(isRange(v)){ const f=v.__range; if(f.length===1&&f[0].length===1) return f[0][0]; throw FErr("#VALUE!"); } return v; }
function toNum(v){
  if(typeof v==="number"){ if(!isFinite(v)) throw FErr("#NUM!"); return v; }
  if(typeof v==="boolean") return v?1:0;
  if(v==="") return 0;
  if(typeof v==="string"&&/^-?(\d+\.?\d*|\.\d+)([eE][+\-]?\d+)?$/.test(v.trim())) return parseFloat(v);
  throw FErr("#VALUE!");
}
function toText(v){ if(typeof v==="boolean")return v?"TRUE":"FALSE"; if(typeof v==="number")return fmtNum(v); return String(v); }
function toBool(v){ if(typeof v==="boolean")return v; if(typeof v==="number")return v!==0; if(v==="")return false;
  if(/^true$/i.test(v))return true; if(/^false$/i.test(v))return false; throw FErr("#VALUE!"); }
function compare(a,b,op){
  let res;
  if(typeof a==="string"||typeof b==="string"){
    if(typeof a==="string"&&typeof b==="string"){ const x=a.toLowerCase(),y=b.toLowerCase(); res=x<y?-1:x>y?1:0; }
    else res = typeof a==="string"?1:-1;
  } else res = toNum(a)<toNum(b)?-1:toNum(a)>toNum(b)?1:0;
  switch(op){case"=":return res===0;case"<>":return res!==0;case"<":return res<0;case">":return res>0;case"<=":return res<=0;case">=":return res>=0;}
}
function flat(args){ const out=[]; for(const a of args){ if(isRange(a)) a.__range.forEach(r=>r.forEach(v=>out.push(v))); else out.push(a);} return out; }
const numsOnly = vals => vals.filter(v=>typeof v==="number");
function criteriaTest(crit){
  if(typeof crit==="number"||typeof crit==="boolean") return v=>{try{return compare(v,crit,"=");}catch(e){return false;}};
  const s=String(crit); const m=s.match(/^(<=|>=|<>|=|<|>)(.*)$/);
  let op="=",rhs=s; if(m){op=m[1];rhs=m[2];}
  const rn=/^-?(\d+\.?\d*|\.\d+)$/.test(rhs.trim())?parseFloat(rhs):rhs;
  return v=>{ try{ return compare(v,rn,op); }catch(e){ return false; } };
}
function reqRange(a){ if(!isRange(a)) throw FErr("#VALUE!"); return a.__range; }
function _pmt(r,n,pv,fv,tp){if(r===0)return -(pv+fv)/n;const q=Math.pow(1+r,n);return -(r*(pv*q+fv))/(q-1)/(1+r*tp);}
function _fv(r,n,pmt,pv,tp){if(r===0)return -pv-pmt*n;const q=Math.pow(1+r,n);return -pv*q-pmt*(1+r*tp)*((q-1)/r);}

const FUNCS={
  SUM:a=>numsOnly(flat(a).map(v=>typeof v==="string"&&v!==""&&/^-?[\d.]+$/.test(v.trim())?parseFloat(v):v)).reduce((s,v)=>s+v,0),
  AVERAGE:a=>{const n=numsOnly(flat(a));if(!n.length)throw FErr("#DIV/0!");return n.reduce((s,v)=>s+v,0)/n.length;},
  MIN:a=>{const n=numsOnly(flat(a));return n.length?Math.min(...n):0;},
  MAX:a=>{const n=numsOnly(flat(a));return n.length?Math.max(...n):0;},
  COUNT:a=>flat(a).filter(v=>typeof v==="number").length,
  COUNTA:a=>flat(a).filter(v=>v!==""&&v!=null).length,
  COUNTBLANK:a=>flat(a).filter(v=>v===""||v==null).length,
  MEDIAN:a=>{const n=numsOnly(flat(a)).sort((x,y)=>x-y);if(!n.length)throw FErr("#NUM!");const m=n.length>>1;return n.length%2?n[m]:(n[m-1]+n[m])/2;},
  PRODUCT:a=>numsOnly(flat(a)).reduce((s,v)=>s*v,1),
  COUNTIF:a=>{const rng=flat([a[0]]);const t=criteriaTest(scalar(a[1]));return rng.filter(v=>v!==""&&t(v)).length;},
  SUMIF:a=>{const rng=reqRange(a[0]).flat();const t=criteriaTest(scalar(a[1]));
    const sums=a[2]?reqRange(a[2]).flat():rng;
    let s=0;rng.forEach((v,i)=>{if(v!==""&&t(v)&&typeof sums[i]==="number")s+=sums[i];});return s;},
  AVERAGEIF:a=>{const rng=reqRange(a[0]).flat();const t=criteriaTest(scalar(a[1]));
    const src=a[2]?reqRange(a[2]).flat():rng;let s=0,c=0;
    rng.forEach((v,i)=>{if(v!==""&&t(v)&&typeof src[i]==="number"){s+=src[i];c++;}});
    if(!c)throw FErr("#DIV/0!");return s/c;},
  IF:(a,vis,nodes)=>{const c=toBool(scalar(evalNode(nodes[0],vis)));
    if(c)return nodes[1]!=null?scalar(evalNode(nodes[1],vis)):true;
    return nodes[2]!=null?scalar(evalNode(nodes[2],vis)):false;},
  IFERROR:(a,vis,nodes)=>{try{return scalar(evalNode(nodes[0],vis));}catch(e){return scalar(evalNode(nodes[1],vis));}},
  AND:a=>flat(a).filter(v=>v!=="").every(v=>toBool(v)),
  OR:a=>flat(a).filter(v=>v!=="").some(v=>toBool(v)),
  NOT:a=>!toBool(scalar(a[0])),
  ROUND:a=>{const n=toNum(scalar(a[0])),d=Math.trunc(toNum(scalar(a[1]??0)));const f=Math.pow(10,d);return Math.round((n*f+(n>=0?1e-9:-1e-9)))/f;},
  ROUNDUP:a=>{const n=toNum(scalar(a[0])),d=Math.trunc(toNum(scalar(a[1]??0)));const f=Math.pow(10,d);return (n>=0?Math.ceil(n*f-1e-9):Math.floor(n*f+1e-9))/f;},
  ROUNDDOWN:a=>{const n=toNum(scalar(a[0])),d=Math.trunc(toNum(scalar(a[1]??0)));const f=Math.pow(10,d);return (n>=0?Math.floor(n*f+1e-9):Math.ceil(n*f-1e-9))/f;},
  ABS:a=>Math.abs(toNum(scalar(a[0]))),
  SQRT:a=>{const n=toNum(scalar(a[0]));if(n<0)throw FErr("#NUM!");return Math.sqrt(n);},
  POWER:a=>Math.pow(toNum(scalar(a[0])),toNum(scalar(a[1]))),
  MOD:a=>{const d=toNum(scalar(a[1]));if(d===0)throw FErr("#DIV/0!");const n=toNum(scalar(a[0]));return n-d*Math.floor(n/d);},
  INT:a=>Math.floor(toNum(scalar(a[0]))),
  PI:()=>Math.PI,
  RAND:()=>Math.random(),
  RANDBETWEEN:a=>{const lo=Math.ceil(toNum(scalar(a[0]))),hi=Math.floor(toNum(scalar(a[1])));return lo+Math.floor(Math.random()*(hi-lo+1));},
  LEN:a=>toText(scalar(a[0])).length,
  UPPER:a=>toText(scalar(a[0])).toUpperCase(),
  LOWER:a=>toText(scalar(a[0])).toLowerCase(),
  PROPER:a=>toText(scalar(a[0])).replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase()),
  TRIM:a=>toText(scalar(a[0])).replace(/\s+/g," ").trim(),
  LEFT:a=>toText(scalar(a[0])).slice(0,Math.max(0,Math.trunc(toNum(scalar(a[1]??1))))),
  RIGHT:a=>{const s=toText(scalar(a[0]));const n=Math.max(0,Math.trunc(toNum(scalar(a[1]??1))));return n?s.slice(-n):"";},
  MID:a=>{const s=toText(scalar(a[0]));const st=Math.trunc(toNum(scalar(a[1])));const n=Math.trunc(toNum(scalar(a[2])));if(st<1||n<0)throw FErr("#VALUE!");return s.slice(st-1,st-1+n);},
  CONCATENATE:a=>flat(a).map(toText).join(""),
  CONCAT:a=>flat(a).map(toText).join(""),
  TEXTJOIN:a=>{const d=toText(scalar(a[0]));const ig=toBool(scalar(a[1]));
    return flat(a.slice(2)).filter(v=>!ig||v!=="").map(toText).join(d);},
  FIND:a=>{const i=toText(scalar(a[1])).indexOf(toText(scalar(a[0])),Math.trunc(toNum(scalar(a[2]??1)))-1);if(i<0)throw FErr("#VALUE!");return i+1;},
  SUBSTITUTE:a=>toText(scalar(a[0])).split(toText(scalar(a[1]))).join(toText(scalar(a[2]))),
  TODAY:()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)+25569;},
  NOW:()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)+25569
           +(d.getHours()*3600+d.getMinutes()*60+d.getSeconds())/86400;},
  DATE:a=>{const y=Math.trunc(toNum(scalar(a[0]))),m=Math.trunc(toNum(scalar(a[1]))),d=Math.trunc(toNum(scalar(a[2])));
    return Math.floor(Date.UTC(y,m-1,d)/86400000)+25569;},
  YEAR:a=>new Date((toNum(scalar(a[0]))-25569)*86400000).getUTCFullYear(),
  MONTH:a=>new Date((toNum(scalar(a[0]))-25569)*86400000).getUTCMonth()+1,
  DAY:a=>new Date((toNum(scalar(a[0]))-25569)*86400000).getUTCDate(),
  DAYS:a=>Math.trunc(toNum(scalar(a[0])))-Math.trunc(toNum(scalar(a[1]))),
  TEXT:a=>{const v=toNum(scalar(a[0]));const f=toText(scalar(a[1])).toLowerCase();
    const dt=new Date((v-25569)*86400000);const p2=n=>String(n).padStart(2,"0");
    return f.replace(/yyyy/g,dt.getUTCFullYear()).replace(/mm/g,p2(dt.getUTCMonth()+1)).replace(/dd/g,p2(dt.getUTCDate()));},
  SUMIFS:a=>{const sums=reqRange(a[0]).flat();let mask=sums.map(()=>true);
    for(let i=1;i+1<a.length||i+1===a.length;i+=2){ if(a[i]==null)break;
      const rng=reqRange(a[i]).flat(); if(rng.length!==sums.length)throw FErr("#VALUE!");
      const t=criteriaTest(scalar(a[i+1])); mask=mask.map((m,j)=>m&&rng[j]!==""&&t(rng[j])); }
    let s=0;sums.forEach((v,j)=>{if(mask[j]&&typeof v==="number")s+=v;});return s;},
  COUNTIFS:a=>{const first=reqRange(a[0]).flat();let mask=first.map(()=>true);
    for(let i=0;i+1<a.length;i+=2){
      const rng=reqRange(a[i]).flat(); if(rng.length!==first.length)throw FErr("#VALUE!");
      const t=criteriaTest(scalar(a[i+1])); mask=mask.map((m,j)=>m&&rng[j]!==""&&t(rng[j])); }
    return mask.filter(Boolean).length;},
  AVERAGEIFS:a=>{const src=reqRange(a[0]).flat();let mask=src.map(()=>true);
    for(let i=1;i+1<a.length;i+=2){
      const rng=reqRange(a[i]).flat(); if(rng.length!==src.length)throw FErr("#VALUE!");
      const t=criteriaTest(scalar(a[i+1])); mask=mask.map((m,j)=>m&&rng[j]!==""&&t(rng[j])); }
    let s=0,c=0;src.forEach((v,j)=>{if(mask[j]&&typeof v==="number"){s+=v;c++;}});
    if(!c)throw FErr("#DIV/0!");return s/c;},
  XLOOKUP:(a,vis,nodes)=>{
    const key=scalar(evalNode(nodes[0],vis));
    const lr=reqRange(evalNode(nodes[1],vis)).flat();
    const rr=reqRange(evalNode(nodes[2],vis)).flat();
    if(lr.length!==rr.length)throw FErr("#VALUE!");
    for(let i=0;i<lr.length;i++){try{if(compare(lr[i],key,"="))return rr[i];}catch(e){}}
    if(nodes[3]!=null)return scalar(evalNode(nodes[3],vis));
    throw FErr("#N/A");},
  VLOOKUP:a=>{
    const key=scalar(a[0]); const tbl=reqRange(a[1]); const col=Math.trunc(toNum(scalar(a[2])));
    const exact = a.length>=4 ? !toBool(scalar(a[3])) : false;
    if(col<1||col>tbl[0].length) throw FErr("#REF!");
    if(exact){
      for(const row of tbl){ try{ if(compare(row[0],key,"=")) return row[col-1]; }catch(e){} }
      throw FErr("#N/A");
    } else {
      let best=null;
      for(const row of tbl){ try{ if(compare(row[0],key,"<=")) best=row; else break; }catch(e){} }
      if(!best) throw FErr("#N/A"); return best[col-1];
    } },
  HLOOKUP:a=>{
    const key=scalar(a[0]); const tbl=reqRange(a[1]); const rIdx=Math.trunc(toNum(scalar(a[2])));
    const exact = a.length>=4 ? !toBool(scalar(a[3])) : false;
    if(rIdx<1||rIdx>tbl.length) throw FErr("#REF!");
    const hdr=tbl[0];
    if(exact){ for(let c=0;c<hdr.length;c++){try{if(compare(hdr[c],key,"="))return tbl[rIdx-1][c];}catch(e){}} throw FErr("#N/A"); }
    let bc=-1; for(let c=0;c<hdr.length;c++){try{if(compare(hdr[c],key,"<="))bc=c;else break;}catch(e){}}
    if(bc<0)throw FErr("#N/A"); return tbl[rIdx-1][bc]; },
  INDEX:a=>{const tbl=reqRange(a[0]);const r=Math.trunc(toNum(scalar(a[1])));const c=a[2]!=null?Math.trunc(toNum(scalar(a[2]))):1;
    if(r<1||r>tbl.length||c<1||c>tbl[0].length)throw FErr("#REF!");return tbl[r-1][c-1];},
  MATCH:a=>{const key=scalar(a[0]);const arr=reqRange(a[1]).flat();
    const type=a[2]!=null?Math.trunc(toNum(scalar(a[2]))):1;
    if(type===0){for(let i=0;i<arr.length;i++){try{if(compare(arr[i],key,"="))return i+1;}catch(e){}}throw FErr("#N/A");}
    if(type===1){let b=-1;for(let i=0;i<arr.length;i++){try{if(compare(arr[i],key,"<="))b=i;else break;}catch(e){}}if(b<0)throw FErr("#N/A");return b+1;}
    let b=-1;for(let i=0;i<arr.length;i++){try{if(compare(arr[i],key,">="))b=i;else break;}catch(e){}}if(b<0)throw FErr("#N/A");return b+1;},
  ISNUMBER:a=>typeof scalar(a[0])==="number",
  ISTEXT:a=>typeof scalar(a[0])==="string"&&scalar(a[0])!=="",
  ISBLANK:a=>scalar(a[0])==="",

  NPV:a=>{const r=toNum(scalar(a[0]));const cfs=numsOnly(flat(a.slice(1)));
    let npv=0;for(let i=0;i<cfs.length;i++) npv+=cfs[i]/Math.pow(1+r,i+1);return npv;},
  PMT:a=>{const r=toNum(scalar(a[0])),n=toNum(scalar(a[1])),pv=toNum(scalar(a[2]));
    const fv=a[3]!=null?toNum(scalar(a[3])):0;const tp=a[4]!=null?(toBool(scalar(a[4]))?1:0):0;
    if(r===0)return -(pv+fv)/n;
    const pvif=Math.pow(1+r,n);return -(r*(pv*pvif+fv))/(pvif-1)/(1+r*tp);},
  PV:a=>{const r=toNum(scalar(a[0])),n=toNum(scalar(a[1])),pmt=toNum(scalar(a[2]));
    const fv=a[3]!=null?toNum(scalar(a[3])):0;const tp=a[4]!=null?(toBool(scalar(a[4]))?1:0):0;
    if(r===0)return -pmt*n-fv;
    const pvif=Math.pow(1+r,n);return (-(pmt*(1+r*tp)*((pvif-1)/r)+fv))/pvif;},
  FV:a=>{const r=toNum(scalar(a[0])),n=toNum(scalar(a[1])),pmt=toNum(scalar(a[2]));
    const pv=a[3]!=null?toNum(scalar(a[3])):0;const tp=a[4]!=null?(toBool(scalar(a[4]))?1:0):0;
    if(r===0)return -pv-pmt*n;
    const pvif=Math.pow(1+r,n);return -pv*pvif-pmt*(1+r*tp)*((pvif-1)/r);},
  NPER:a=>{const r=toNum(scalar(a[0])),pmt=toNum(scalar(a[1])),pv=toNum(scalar(a[2]));
    const fv=a[3]!=null?toNum(scalar(a[3])):0;const tp=a[4]!=null?(toBool(scalar(a[4]))?1:0):0;
    if(r===0){if(pmt===0)throw FErr("#NUM!");return -(pv+fv)/pmt;}
    const z=pmt*(1+r*tp)/r;const t=Math.log((-fv+z)/(pv+z));if(!isFinite(t))throw FErr("#NUM!");
    return t/Math.log(1+r);},
  IPMT:a=>{const r=toNum(scalar(a[0])),per=toNum(scalar(a[1])),n=toNum(scalar(a[2])),pv=toNum(scalar(a[3]));
    const fv=a[4]!=null?toNum(scalar(a[4])):0;const tp=a[5]!=null?(toBool(scalar(a[5]))?1:0):0;
    if(per<1||per>n)throw FErr("#NUM!");const pmt=_pmt(r,n,pv,fv,tp);
    if(tp&&per===1)return 0;
    const bal=tp?_fv(r,per-2,pmt,pv,1):_fv(r,per-1,pmt,pv,0);
    return tp?(bal+pmt)*r:bal*r;},
  PPMT:a=>{const r=toNum(scalar(a[0])),per=toNum(scalar(a[1])),n=toNum(scalar(a[2])),pv=toNum(scalar(a[3]));
    const fv=a[4]!=null?toNum(scalar(a[4])):0;const tp=a[5]!=null?(toBool(scalar(a[5]))?1:0):0;
    if(per<1||per>n)throw FErr("#NUM!");const pmt=_pmt(r,n,pv,fv,tp);
    const bal=tp?(per===1?0:(_fv(r,per-2,pmt,pv,1)+pmt)*r):_fv(r,per-1,pmt,pv,0)*r;
    return pmt-bal;},
  RATE:a=>{const n=toNum(scalar(a[0])),pmt=toNum(scalar(a[1])),pv=toNum(scalar(a[2]));
    const fv=a[3]!=null?toNum(scalar(a[3])):0;const tp=a[4]!=null?(toBool(scalar(a[4]))?1:0):0;
    let guess=a[5]!=null?toNum(scalar(a[5])):0.1;
    for(let i=0;i<100;i++){
      const pvif=Math.pow(1+guess,n);const z=pmt*(1+guess*tp);
      const f=pv*pvif+z*((pvif-1)/guess)+fv;
      const df=pv*n*Math.pow(1+guess,n-1)+z*(n*Math.pow(1+guess,n-1)*guess-(pvif-1))/(guess*guess)
               +pmt*tp*((pvif-1)/guess);
      if(Math.abs(df)<1e-20)break;const next=guess-f/df;
      if(Math.abs(next-guess)<1e-10)return next;guess=next;}
    throw FErr("#NUM!");},
  IRR:a=>{const vals=numsOnly(flat([a[0]]));
    if(vals.length<2)throw FErr("#NUM!");
    let guess=a[1]!=null?toNum(scalar(a[1])):0.1;
    for(let i=0;i<300;i++){
      let f=0,df=0;
      for(let t=0;t<vals.length;t++){const p=Math.pow(1+guess,t);f+=vals[t]/p;df-=t*vals[t]/Math.pow(1+guess,t+1);}
      if(Math.abs(df)<1e-20)break;const next=guess-f/df;
      if(Math.abs(next-guess)<1e-10)return next;guess=next;}
    throw FErr("#NUM!");},

  XNPV:a=>{const r=toNum(scalar(a[0]));const vals=reqRange(a[1]).flat();const dates=reqRange(a[2]).flat();
    if(vals.length!==dates.length)throw FErr("#NUM!");
    const d0=toNum(dates[0]);let npv=0;
    for(let i=0;i<vals.length;i++){const v=toNum(vals[i]);const di=toNum(dates[i]);
      npv+=v/Math.pow(1+r,(di-d0)/365);}return npv;},
  XIRR:a=>{const vals=reqRange(a[0]).flat().map(toNum);const dates=reqRange(a[1]).flat().map(toNum);
    if(vals.length!==dates.length)throw FErr("#NUM!");
    const d0=dates[0];let guess=a[2]!=null?toNum(scalar(a[2])):0.1;
    for(let i=0;i<300;i++){
      let f=0,df=0;
      for(let t=0;t<vals.length;t++){const yrs=(dates[t]-d0)/365;const p=Math.pow(1+guess,yrs);
        f+=vals[t]/p;df-=yrs*vals[t]/Math.pow(1+guess,yrs+1);}
      if(Math.abs(df)<1e-20)break;const next=guess-f/df;
      if(Math.abs(next-guess)<1e-10)return next;guess=next;}
    throw FErr("#NUM!");},
  EOMONTH:a=>{const serial=Math.trunc(toNum(scalar(a[0])));const months=Math.trunc(toNum(scalar(a[1])));
    const dt=new Date((serial-25569)*86400000);
    const y=dt.getUTCFullYear(),m=dt.getUTCMonth()+months;
    const last=new Date(Date.UTC(y,m+1,0));
    return Math.floor(last.getTime()/86400000)+25569;},

  SLN:a=>{const cost=toNum(scalar(a[0])),salvage=toNum(scalar(a[1])),life=toNum(scalar(a[2]));
    if(life===0)throw FErr("#DIV/0!");return (cost-salvage)/life;},
  DB:a=>{const cost=toNum(scalar(a[0])),salvage=toNum(scalar(a[1])),life=toNum(scalar(a[2]));
    const per=toNum(scalar(a[3]));const mo=a[4]!=null?toNum(scalar(a[4])):12;
    if(life===0)throw FErr("#DIV/0!");
    const rate=Math.round((1-Math.pow(salvage/cost,1/life))*1000)/1000;
    let total=0,dep=0;
    for(let i=1;i<=per;i++){
      if(i===1){dep=cost*rate*mo/12;}
      else if(i===life+1){dep=(cost-total)*rate*(12-mo)/12;}
      else{dep=(cost-total)*rate;}
      total+=dep;}
    return dep;},
};
const LAZY = new Set(["IF","IFERROR","XLOOKUP"]);
function callFn(name,argNodes,visiting){
  const fn=FUNCS[name]; if(!fn) throw FErr("#NAME?");
  if(LAZY.has(name)) return fn(null,visiting,argNodes);
  const args=argNodes.map(n=>evalNode(n,visiting));
  return fn(args);
}

/* ================= DISPLAY ================= */
function fmtNum(n){
  if(Number.isInteger(n)&&Math.abs(n)<1e15) return String(n);
  let s=n.toPrecision(10); if(s.includes(".")) s=s.replace(/0+$/,"").replace(/\.$/,"");
  return s;
}
function displayOf(ref){
  try{
    const v=cellValue(ref,new Set());
    if(v==="") return {text:"",cls:""};
    if(typeof v==="number") return {text:fmtNum(v),cls:"num"};
    if(typeof v==="boolean") return {text:v?"TRUE":"FALSE",cls:"bool"};
    return {text:String(v),cls:""};
  }catch(e){ return {text:isErr(e)?e.__err:"#VALUE!",cls:"err"}; }
}

/* ---- relative-reference formula shifting ---- */
function shiftFormula(raw,dr,dc){
  if(!raw||raw[0]!=="=")return raw;
  const s=raw; let out="="; let i=1; let inStr=false;
  while(i<s.length){
    const ch=s[i];
    if(inStr){ out+=ch; if(ch==='"'){ if(s[i+1]==='"'){out+='"';i+=2;continue;} inStr=false;} i++; continue; }
    if(ch==='"'){inStr=true;out+=ch;i++;continue;}
    const m=/^(\$?)([A-Za-z]{1,2})(\$?)(\d{1,3})/.exec(s.slice(i));
    const prevOK=!/[A-Za-z0-9_.$]/.test(s[i-1]||"");
    if(m&&prevOK){
      const after=s[i+m[0].length]||"";
      if(!/[A-Za-z0-9_(]/.test(after)){
        const cAbs=m[1]==="$", rAbs=m[3]==="$";
        let c=COLNAMES.indexOf(m[2].toUpperCase()), r=+m[4];
        if(c>=0){
          if(!cAbs)c+=dc; if(!rAbs)r+=dr;
          if(c<0||c>=COLS||r<1||r>ROWS) out+="#REF!";
          else out+=(cAbs?"$":"")+COLNAMES[c]+(rAbs?"$":"")+r;
          i+=m[0].length; continue;
        }
      }
    }
    out+=ch;i++;
  }
  return out;
}

/* ========================= ENGINE PUBLIC API ========================= */
const Engine = {
  get COLS(){return COLS;}, get ROWS(){return ROWS;}, get COLNAMES(){return COLNAMES;},
  refOf, parseRef,
  getCell, setRaw,
  cellValue, evalStr,
  tokenize, parse, evalNode,
  rangeCells, displayOf, fmtNum, toText,
  isErr, FErr,
  shiftFormula,
  get FUNCS(){return FUNCS;},
  get _cells(){return cells;},
  set _cells(v){cells=v;},
  init(cols,rows){
    COLS=cols; ROWS=rows;
    COLNAMES=Array.from({length:COLS},(_,i)=>colName(i));
  }
};
window.Engine = Engine;
})();
