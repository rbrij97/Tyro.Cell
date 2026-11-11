"use strict";
/* grid.js — spreadsheet grid UI: rendering, selection, editing, point mode, fill, clipboard, keyboard layer, side panel.
   Classic script (not a module): its top-level const/let/function names are shared with the other app scripts. Load order is set in index.html. */
const {COLS,ROWS,COLNAMES,refOf,parseRef,getCell,setRaw,cellValue,evalStr,
       tokenize,parse,evalNode,rangeCells,displayOf,fmtNum,toText,isErr,FErr,FUNCS,shiftFormula}=Engine;
let cells = Engine._cells;
let sel = {r:1,c:0};
let selEnd = null;
let editing = null;
let targetRefs = [];
let passedRefs = [];   // target cells that just passed: they show the green stamp until the sheet changes

function resetCells(obj){cells=obj;Engine._cells=obj;}
/* engine code now in engine.js */
/* =========================================================================
   GRID UI  —  consumes ENGINE via the public API. Owns DOM, selection,
   keyboard, mouse, formula bar, fill handle, clipboard, in-cell editing.
   ========================================================================= */
const grid=document.getElementById("grid");
const nameBox=document.getElementById("namebox");
const fInput=document.getElementById("formulainput");
const TD={};
function buildGrid(){
  const thead=document.createElement("thead");
  const hr=document.createElement("tr");
  const corner=document.createElement("th"); corner.className="corner"; hr.appendChild(corner);
  COLNAMES.forEach(cn=>{const th=document.createElement("th");th.textContent=cn;th.dataset.col=cn;hr.appendChild(th);});
  thead.appendChild(hr); grid.appendChild(thead);
  const tb=document.createElement("tbody");
  for(let r=1;r<=ROWS;r++){
    const tr=document.createElement("tr");
    const th=document.createElement("th"); th.textContent=r; th.dataset.row=r; tr.appendChild(th);
    for(let c=0;c<COLS;c++){
      const td=document.createElement("td"); const ref=refOf(r,c);
      td.dataset.ref=ref; TD[ref]=td; tr.appendChild(td);
    }
    tb.appendChild(tr);
  }
  grid.appendChild(tb);
}
function renderAll(){
  for(const ref in TD){
    const td=TD[ref], d=displayOf(ref), c=getCell(ref);
    td.textContent=d.text;
    td.className=d.cls+(c&&c.b?" b":"")+(c&&c.i?" i":"")+(c&&c.u?" u":"");
    if(targetRefs.includes(ref)) td.classList.add("target");
    if(passedRefs.includes(ref)) td.classList.add("passed");
  }
  paintSelection();
  saveSheetSoon();
}

/* Selection box: one element that glides between cells instead of a per-cell
   outline. Positioned from the selected range's on-screen rectangles. */
const selBox=document.getElementById("selbox");
function positionSelBox(){
  if(!selBox) return;
  const {r1,r2,c1,c2}=selRange();
  const a=TD[refOf(r1,c1)], b=TD[refOf(r2,c2)];
  const wrap=a.closest("#gridwrap"); if(!wrap){selBox.style.display="none";return;}
  const W=wrap.getBoundingClientRect(), A=a.getBoundingClientRect(), B=b.getBoundingClientRect();
  if(!A.width){ selBox.style.display="none"; return; }   // view hidden — repainted when shown
  selBox.style.display="block";
  selBox.style.left=(A.left-W.left+wrap.scrollLeft)+"px";
  selBox.style.top=(A.top-W.top+wrap.scrollTop)+"px";
  selBox.style.width=(B.right-A.left)+"px";
  selBox.style.height=(B.bottom-A.top)+"px";
  selBox.classList.toggle("editing",!!editing);
  // on a passed answer the box (and fill handle) turn green to match the cell
  let allPassed=passedRefs.length>0;
  for(let r=r1;r<=r2&&allPassed;r++)for(let c=c1;c<=c2;c++) if(!passedRefs.includes(refOf(r,c))){allPassed=false;break;}
  selBox.classList.toggle("ok",allPassed);
  fillHandle.classList.toggle("ok",allPassed);
}
window.addEventListener("resize",()=>{ positionSelBox(); positionFillHandle(); });

/* Excel-style coloured references: while a formula is being typed, every
   reference in it outlines its cells in its own colour (cycling through 6). */
function clearRefs(){ document.querySelectorAll("#grid td[data-rf]").forEach(td=>td.removeAttribute("data-rf")); }
function paintRefs(text){
  clearRefs();
  if(!text||text[0]!=="=") return;
  const s=text.replace(/"[^"]*"?/g,m=>" ".repeat(m.length));   // ignore refs inside quoted text
  const re=/(^|[^A-Za-z0-9_.$])(\$?[A-Za-z]{1,2}\$?\d{1,3})(?::(\$?[A-Za-z]{1,2}\$?\d{1,3}))?(?![A-Za-z0-9_(])/g;
  let m,i=0;
  while((m=re.exec(s))){
    const a=parseRef(m[2]), b=m[3]?parseRef(m[3]):a; if(!a||!b) continue;
    const k=String(i++%6);
    for(let r=Math.min(a.r,b.r);r<=Math.max(a.r,b.r);r++)
      for(let c=Math.min(a.c,b.c);c<=Math.max(a.c,b.c);c++) TD[refOf(r,c)].setAttribute("data-rf",k);
  }
}
function selRange(){
  const a=sel, b=selEnd||sel;
  return {r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r),c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c)};
}
function paintSelection(){
  document.querySelectorAll("#grid td.sel,#grid td.insel").forEach(td=>td.classList.remove("sel","insel"));
  document.querySelectorAll("#grid th.hl").forEach(th=>th.classList.remove("hl"));
  const {r1,r2,c1,c2}=selRange();
  for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++) TD[refOf(r,c)].classList.add("insel");
  const aref=refOf(sel.r,sel.c);
  TD[aref].classList.add("sel");
  for(let c=c1;c<=c2;c++) document.querySelector(`th[data-col="${COLNAMES[c]}"]`).classList.add("hl");
  for(let r=r1;r<=r2;r++) document.querySelector(`th[data-row="${r}"]`).classList.add("hl");
  nameBox.value=aref;
  const cc=getCell(aref); fInput.value=cc&&cc.raw!=null?cc.raw:"";
  updateAgg(); updateToolbar(); positionFillHandle(); positionSelBox();
}
function updateAgg(){
  const {r1,r2,c1,c2}=selRange(); const el=document.getElementById("st-agg");
  if(r1===r2&&c1===c2){el.textContent="";return;}
  let sum=0,cnt=0,n=0;
  for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++){
    try{const v=cellValue(refOf(r,c),new Set());
      if(v!==""&&v!=null)cnt++;
      if(typeof v==="number"){sum+=v;n++;}
    }catch(e){}
  }
  el.textContent=n?`Sum: ${fmtNum(sum)}   ·   Average: ${fmtNum(sum/n)}   ·   Count: ${cnt}`:`Count: ${cnt}`;
}
function updateToolbar(){
  const c=getCell(refOf(sel.r,sel.c))||{};
  document.getElementById("btnBold").classList.toggle("active",!!c.b);
  document.getElementById("btnItalic").classList.toggle("active",!!c.i);
  document.getElementById("btnUnder").classList.toggle("active",!!c.u);
}
function select(r,c,extend){
  r=Math.max(1,Math.min(ROWS,r)); c=Math.max(0,Math.min(COLS-1,c));
  if(extend){selEnd={r,c};} else {sel={r,c};selEnd=null;}
  paintSelection();
  const td=TD[refOf(extend?selEnd.r:sel.r,extend?selEnd.c:sel.c)];
  td.scrollIntoView({block:"nearest",inline:"nearest"});
}

/* ---- point mode ---- */
let point=null;
function lastMeaningful(s){let i=s.length-1;while(i>=0&&s[i]===" ")i--;return i>=0?s[i]:"";}
function refInsertable(s){return s[0]==="="&&"=+-*/^&(,:<>".includes(lastMeaningful(s));}
function pointText(){const a=point.base,b=point.cur;
  const r1=Math.min(a.r,b.r),r2=Math.max(a.r,b.r),c1=Math.min(a.c,b.c),c2=Math.max(a.c,b.c);
  return (r1===r2&&c1===c2)?refOf(r1,c1):refOf(r1,c1)+":"+refOf(r2,c2);}
function paintPoint(){document.querySelectorAll("#grid td.pt").forEach(t=>t.classList.remove("pt"));
  if(!point)return;const a=point.base,b=point.cur;
  for(let r=Math.min(a.r,b.r);r<=Math.max(a.r,b.r);r++)
    for(let c=Math.min(a.c,b.c);c<=Math.max(a.c,b.c);c++)TD[refOf(r,c)].classList.add("pt");}
function applyPoint(){const el=point.inputEl;
  el.value=el.value.slice(0,point.start)+pointText();
  el.setSelectionRange(el.value.length,el.value.length);
  if(el!==fInput)fInput.value=el.value;
  TD[pointText().split(":").pop()]?.scrollIntoView({block:"nearest",inline:"nearest"});
  paintPoint(); paintRefs(el.value);}
function movePoint(dr,dc,extend){
  point.cur={r:Math.max(1,Math.min(ROWS,point.cur.r+dr)),c:Math.max(0,Math.min(COLS-1,point.cur.c+dc))};
  if(!extend)point.base={...point.cur};
  applyPoint();}
function endPoint(){if(point){point=null;paintPoint();}}
function handleEditorArrow(e,inputEl,home){
  const dr=e.key==="ArrowDown"?1:e.key==="ArrowUp"?-1:0;
  const dc=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;
  if(point&&point.inputEl===inputEl){e.preventDefault();movePoint(dr,dc,e.shiftKey);return true;}
  const v=inputEl.value;
  const atEnd=inputEl.selectionStart===v.length&&inputEl.selectionEnd===v.length;
  if(atEnd&&refInsertable(v)){
    e.preventDefault();
    point={inputEl,start:v.length,base:{...home},cur:{...home}};
    movePoint(dr,dc,false);
    return true;
  }
  return false;
}
function pointFromMouse(inputEl,td){
  const p=parseRef(td.dataset.ref);
  if(!point||point.inputEl!==inputEl)point={inputEl,start:inputEl.value.length,base:p,cur:p};
  else {point.base={...p};point.cur={...p};}
  applyPoint();
  const move=ev=>{const t=ev.target.closest&&ev.target.closest("td");
    if(t){point.cur=parseRef(t.dataset.ref);applyPoint();}};
  const up=()=>{document.removeEventListener("mouseover",move);document.removeEventListener("mouseup",up);};
  document.addEventListener("mouseover",move);document.addEventListener("mouseup",up);
}

/* ---- clipboard (Ctrl+C / Ctrl+V) ---- */
let clip=null;
function copySelection(){
  const {r1,r2,c1,c2}=selRange();
  const g=[];
  for(let r=r1;r<=r2;r++){const row=[];
    for(let c=c1;c<=c2;c++){const cc=getCell(refOf(r,c))||{};row.push({raw:cc.raw||"",b:!!cc.b,i:!!cc.i,u:!!cc.u});}
    g.push(row);}
  clip={rows:r2-r1+1,cols:c2-c1+1,srcR:r1,srcC:c1,cells:g};
  document.getElementById("st-mode").textContent="Copied "+clip.rows+"×"+clip.cols;
}
function pasteClip(){
  if(!clip)return;
  pushUndo();
  for(let r=0;r<clip.rows;r++)for(let c=0;c<clip.cols;c++){
    const tr=sel.r+r,tc=sel.c+c; if(tr>ROWS||tc>=COLS)continue;
    const src=clip.cells[r][c]; const ref=refOf(tr,tc);
    setRaw(ref,shiftFormula(src.raw,(sel.r+r)-(clip.srcR+r),(sel.c+c)-(clip.srcC+c)));
    if(src.b||src.i||src.u){const cc=cells[ref]=cells[ref]||{raw:""};cc.b=src.b;cc.i=src.i;cc.u=src.u;}
  }
  selEnd={r:Math.min(ROWS,sel.r+clip.rows-1),c:Math.min(COLS-1,sel.c+clip.cols-1)};
  renderAll();
}
/* ---- fill handle ---- */
const fillHandle=document.getElementById("fillhandle");
let filling=null;
function positionFillHandle(){
  if(editing){fillHandle.style.display="none";return;}
  const {r2,c2}=selRange(); const td=TD[refOf(r2,c2)];
  fillHandle.style.display="block";
  fillHandle.style.left=(td.offsetLeft+td.offsetWidth-5)+"px";
  fillHandle.style.top=(td.offsetTop+td.offsetHeight-5)+"px";
}
function clearFillPrev(){document.querySelectorAll("#grid td.fillprev").forEach(t=>t.classList.remove("fillprev"));}
function fillTargetFor(p,src){
  if(p.r>src.r2&&p.c>=src.c1&&p.c<=src.c2) return {dir:"down",r1:src.r2+1,r2:p.r,c1:src.c1,c2:src.c2};
  if(p.r<src.r1&&p.c>=src.c1&&p.c<=src.c2) return {dir:"up",r1:p.r,r2:src.r1-1,c1:src.c1,c2:src.c2};
  if(p.c>src.c2&&p.r>=src.r1&&p.r<=src.r2) return {dir:"right",c1:src.c2+1,c2:p.c,r1:src.r1,r2:src.r2};
  if(p.c<src.c1&&p.r>=src.r1&&p.r<=src.r2) return {dir:"left",c1:p.c,c2:src.c1-1,r1:src.r1,r2:src.r2};
  return null;
}
fillHandle.addEventListener("mousedown",e=>{
  e.preventDefault();e.stopPropagation();
  filling={src:selRange(),tgt:null};
  const move=ev=>{
    const t=ev.target.closest&&ev.target.closest("td"); if(!t)return;
    const p=parseRef(t.dataset.ref);
    filling.tgt=fillTargetFor(p,filling.src);
    clearFillPrev();
    if(filling.tgt){const g=filling.tgt;
      for(let r=g.r1;r<=g.r2;r++)for(let c=g.c1;c<=g.c2;c++)TD[refOf(r,c)].classList.add("fillprev");}
  };
  const up=()=>{
    document.removeEventListener("mouseover",move);document.removeEventListener("mouseup",up);
    clearFillPrev();
    if(filling&&filling.tgt)applyFill(filling.src,filling.tgt);
    filling=null;
  };
  document.addEventListener("mouseover",move);document.addEventListener("mouseup",up);
});
function applyFill(src,tgt){
  pushUndo();
  const H=src.r2-src.r1+1, W=src.c2-src.c1+1;
  for(let r=tgt.r1;r<=tgt.r2;r++)for(let c=tgt.c1;c<=tgt.c2;c++){
    let sr,scol;
    if(tgt.dir==="down"){ sr=src.r1+((r-src.r1)%H); scol=c; }
    else if(tgt.dir==="up"){ sr=src.r2-((src.r2-r)%H); scol=c; }
    else if(tgt.dir==="right"){ scol=src.c1+((c-src.c1)%W); sr=r; }
    else { scol=src.c2-((src.c2-c)%W); sr=r; }
    const s=getCell(refOf(sr,scol))||{};
    const ref=refOf(r,c);
    setRaw(ref,shiftFormula(s.raw||"",r-sr,c-scol));
    if(s.b||s.i||s.u){const cc=cells[ref]=cells[ref]||{raw:""};cc.b=s.b;cc.i=s.i;cc.u=s.u;}
  }
  sel={r:src.r1,c:src.c1};
  selEnd={r:Math.max(src.r2,tgt.r2),c:Math.max(src.c2,tgt.c2)};
  if(tgt.dir==="up")sel={r:tgt.r1,c:src.c1},selEnd={r:src.r2,c:src.c2};
  if(tgt.dir==="left")sel={r:src.r1,c:tgt.c1},selEnd={r:src.r2,c:src.c2};
  renderAll();
}
/* ---- diagnostics for attempt-aware feedback ---- */
function lev(a,b){const m=[...Array(a.length+1)].map((_,i)=>[i,...Array(b.length)]);
  for(let j=0;j<=b.length;j++)m[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)
    m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return m[a.length][b.length];}
function collectRanges(node,out){out=out||[];if(!node||typeof node!=="object")return out;
  if(node.k==="range")out.push(node.a+":"+node.b);
  if(node.l)collectRanges(node.l,out);if(node.r)collectRanges(node.r,out);
  if(node.e)collectRanges(node.e,out);
  if(node.args)node.args.forEach(x=>collectRanges(x,out));
  return out;}
function nearRange(a,b){
  const pa=a.split(":").map(parseRef),pb=b.split(":").map(parseRef);
  if(pa.some(x=>!x)||pb.some(x=>!x))return false;
  const d=Math.abs(pa[0].r-pb[0].r)+Math.abs(pa[1].r-pb[1].r)+Math.abs(pa[0].c-pb[0].c)+Math.abs(pa[1].c-pb[1].c);
  return d>0&&d<=2;}
function diagnose(ex,raw,err,exp,solution){
  const tips=[]; const up=raw.toUpperCase();
  if(err){
    const code=isErr(err)?err.__err:"#VALUE!";
    if(code==="#NAME?"){
      (up.match(/([A-Z]+)\(/g)||[]).forEach(f=>{const name=f.slice(0,-1);
        if(!FUNCS[name]){const sug=Object.keys(FUNCS).find(k=>lev(k,name)<=2);
          tips.push("Unknown function <code>"+esc(name)+"</code>"+(sug?" — did you mean <code>"+sug+"</code>?":"."));}});
      if(!tips.length)tips.push("A name in the formula isn't recognized — check spelling and that text is quoted.");
    }
    if(code==="#VALUE!"&&/,\s*(<=|>=|<>|<|>)[^"=]/.test(raw))
      tips.push('Criteria with an operator must be a quoted string: <code>"&gt;=50"</code>.');
    if(code==="#DIV/0!")tips.push("A divisor evaluates to 0 or blank — check the denominator cell.");
    if(code==="#N/A")tips.push("Lookup value not found — check exact spelling; use FALSE (VLOOKUP) or 0 (MATCH) for exact match.");
    if(code==="#REF!")tips.push("A reference is invalid or circular — the formula may reference its own cell.");
  } else {
    try{
      const uR=collectRanges(parse(tokenize(raw.slice(1)))).sort();
      const sR=collectRanges(parse(tokenize(solution.slice(1)))).sort();
      if(sR.length&&uR.length===sR.length){
        for(let i=0;i<uR.length;i++)
          if(uR[i]!==sR[i]&&nearRange(uR[i],sR[i])){
            tips.push("Range <code>"+esc(uR[i])+"</code> looks off by one row or column — re-check the boundaries against the data.");break;}
      }
      if(sR.length&&!uR.length)tips.push("Expected a range argument (<code>start:end</code>), not individual cells.");
      if(typeof exp==="number"&&new RegExp("(^|[^0-9.A-Z$])"+String(exp).replace(".","\\.")+"([^0-9.]|$)").test(up))
        tips.push("The correct number appears typed literally — compute it from cell references instead.");
    }catch(e){}
  }
  return tips.length?"<br>• "+tips.join("<br>• "):"";
}

/* in-cell editing */
function startEdit(ref, initial){
  if(currentEx&&currentEx.pick&&currentEx.pick[ref]){ startPick(ref); return; }
  if(editing) commitEdit(true);
  editing=ref;
  const td=TD[ref];
  const inp=document.createElement("input");
  const c=getCell(ref);
  inp.value = initial!=null ? initial : (c&&c.raw!=null?c.raw:"");
  td.appendChild(inp); inp.focus();
  if(initial!=null) inp.setSelectionRange(inp.value.length,inp.value.length); else inp.select();
  const home=parseRef(ref);
  const typedStart = initial!=null;
  inp.addEventListener("input",()=>{fInput.value=inp.value; endPoint(); paintRefs(inp.value); updateSuggest(inp);});
  // the suggestion list gets first go at ↑/↓/Tab/Esc (capture runs before the editor's own keys)
  inp.addEventListener("keydown",e=>{ if(acKey(e)){ e.preventDefault(); e.stopImmediatePropagation(); } },true);
  inp.addEventListener("keyup",e=>{ if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) updateSuggest(inp); });
  inp.addEventListener("click",()=>updateSuggest(inp));
  paintRefs(inp.value); updateSuggest(inp);
  inp.addEventListener("keydown",e=>{
    const arrows=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
    if(arrows.includes(e.key)){
      if(handleEditorArrow(e,inp,home)){e.stopPropagation();return;}
      if(typedStart&&inp.value[0]!=="="){
        e.preventDefault();e.stopPropagation();
        const dr=e.key==="ArrowDown"?1:e.key==="ArrowUp"?-1:0;
        const dc=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;
        commitEdit(true);select(sel.r+dr,sel.c+dc);return;
      }
      e.stopPropagation();return;
    }
    if(e.key==="F4"){ e.preventDefault(); e.stopPropagation(); cycleRefAt(inp); return; }
    if(point&&e.key!=="Shift")endPoint();
    if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){
      /* Ctrl+Enter: commit this entry to the whole selection */
      e.preventDefault(); e.stopPropagation();
      const raw=inp.value; const anchor=ref;
      editing=null; inp.remove();
      pushUndo(); fillSelectionWith(anchor,raw); renderAll(); flash("Filled selection");
      return;
    }
    if(e.key==="Enter"){e.preventDefault();commitEdit(true);select(sel.r+(e.shiftKey?-1:1),sel.c);}
    else if(e.key==="Tab"){e.preventDefault();commitEdit(true);select(sel.r,sel.c+(e.shiftKey?-1:1));}
    else if(e.key==="Escape"){e.preventDefault();commitEdit(false);}
    e.stopPropagation();
  });
  inp.addEventListener("blur",()=>{ if(editing===ref) commitEdit(true); });
  fillHandle.style.display="none";
  positionSelBox();
  document.getElementById("st-mode").textContent="Edit";
}
function startPick(ref){
  if(editing) commitEdit(true);
  editing=ref;
  const td=TD[ref];
  const selEl=document.createElement("select");
  const cur=(getCell(ref)||{}).raw||"";
  const opts=[""].concat(currentEx.pick[ref].options);
  opts.forEach(o=>{const op=document.createElement("option");op.value=o;op.textContent=o||"— select —";if(o===cur)op.selected=true;selEl.appendChild(op);});
  td.textContent=""; td.appendChild(selEl); selEl.focus();
  const done=save=>{ if(editing!==ref)return; editing=null;
    if(save)setRaw(ref,selEl.value); selEl.remove(); renderAll();
    document.getElementById("st-mode").textContent="Ready"; };
  selEl.addEventListener("change",()=>done(true));
  selEl.addEventListener("blur",()=>done(true));
  selEl.addEventListener("keydown",e=>{ if(e.key==="Escape"){e.preventDefault();done(false);} e.stopPropagation(); });
  document.getElementById("st-mode").textContent="Pick";
}
function commitEdit(save){
  if(!editing) return;
  endPoint(); clearRefs(); hideFnHelp();
  const ref=editing; editing=null;
  const td=TD[ref]; const inp=td.querySelector("input,select");
  if(inp){
    if(save){
      const prev=(getCell(ref)||{}).raw||"";
      if(String(inp.value)!==String(prev)) pushUndo();
      setRaw(ref,inp.value);
    }
    inp.remove();
  }
  document.getElementById("st-mode").textContent="Ready";
  renderAll();
}

/* events */
grid.addEventListener("mousedown",e=>{
  const td=e.target.closest("td"); if(!td)return;
  const activeInp = editing ? TD[editing].querySelector("input")
                  : (document.activeElement===fInput ? fInput : null);
  if(activeInp&&activeInp.tagName==="INPUT"){
    const v=activeInp.value;
    if(v[0]==="="&&(refInsertable(v)||(point&&point.inputEl===activeInp))){
      e.preventDefault();
      pointFromMouse(activeInp,td);
      return;
    }
    if(editing)return;
  }
  const p=parseRef(td.dataset.ref);
  if(e.shiftKey) select(p.r,p.c,true); else select(p.r,p.c);
  if(currentEx&&currentEx.pick&&currentEx.pick[td.dataset.ref]){ startPick(td.dataset.ref); return; }
  const move=ev=>{const t=ev.target.closest&&ev.target.closest("td");if(t){const q=parseRef(t.dataset.ref);select(q.r,q.c,true);}};
  const up=()=>{document.removeEventListener("mouseover",move);document.removeEventListener("mouseup",up);};
  document.addEventListener("mouseover",move); document.addEventListener("mouseup",up);
});
grid.addEventListener("dblclick",e=>{
  const td=e.target.closest("td"); if(!td)return;
  const p=parseRef(td.dataset.ref); select(p.r,p.c); startEdit(td.dataset.ref);
});
/* =========================================================================
   KEYBOARD LAYER — everything below is reproducible in-browser. The keys the
   browser reserves for itself (Ctrl+T/N/W, Ctrl+Tab, Ctrl+1-9, F11, F12) are
   deliberately NOT bound: no web app can intercept them, so binding them
   would only create shortcuts that silently fail.
   ========================================================================= */

/* Undo/redo. `cells` holds a few dozen entries, so a JSON snapshot per
   mutation is cheaper to reason about than a command log — and it survives
   whole-sheet operations like Clear sheet, which a command log would not. */
const UNDO=[], REDO=[], UNDO_LIMIT=80;
const snap=()=>JSON.stringify(cells);
function pushUndo(){ UNDO.push(snap()); if(UNDO.length>UNDO_LIMIT)UNDO.shift(); REDO.length=0; passedRefs=[]; }
function clearHistory(){ UNDO.length=0; REDO.length=0; }
function applySnap(s){ resetCells(JSON.parse(s)); renderAll(); }
function flash(msg){ const el=document.getElementById("st-mode"); if(!el)return; el.textContent=msg;
  clearTimeout(flash._t); flash._t=setTimeout(()=>{ el.textContent="Ready"; },1500); }
function undo(){ if(!UNDO.length){flash("Nothing to undo");return;} REDO.push(snap()); applySnap(UNDO.pop()); flash("Undo"); }
function redo(){ if(!REDO.length){flash("Nothing to redo");return;} UNDO.push(snap()); applySnap(REDO.pop()); flash("Redo"); }

const hasVal=(r,c)=>{ const cc=getCell(refOf(r,c)); return !!(cc&&cc.raw!==""&&cc.raw!=null); };
function copyFmt(src,ref){ if(src&&(src.b||src.i||src.u)){ const cc=cells[ref]=cells[ref]||{raw:""}; cc.b=src.b;cc.i=src.i;cc.u=src.u; } }

/* Ctrl+arrow — jump to the edge of the data region, Excel's rules: if the
   next cell is filled, run to the last filled cell; otherwise skip the gap
   and land on the next filled one. */
function edgeJump(r,c,dr,dc){
  const inb=(rr,cc)=>rr>=1&&rr<=ROWS&&cc>=0&&cc<COLS;
  let nr=r+dr, nc=c+dc;
  if(!inb(nr,nc)) return {r,c};
  if(hasVal(r,c)&&hasVal(nr,nc)){
    while(inb(nr+dr,nc+dc)&&hasVal(nr+dr,nc+dc)){ nr+=dr; nc+=dc; }
  } else {
    while(inb(nr,nc)&&!hasVal(nr,nc)){ nr+=dr; nc+=dc; }
    if(!inb(nr,nc)){ nr-=dr; nc-=dc; }
  }
  return {r:nr,c:nc};
}
function lastUsedCell(){
  let mr=1,mc=0;
  for(const ref in cells){ const p=parseRef(ref); if(p&&hasVal(p.r,p.c)){ if(p.r>mr)mr=p.r; if(p.c>mc)mc=p.c; } }
  return {r:mr,c:mc};
}

/* Ctrl+D / Ctrl+R. On a single-cell selection they pull from the neighbour,
   exactly as Excel does; on a range they project the first row/column. */
function fillDown(){
  const {r1,r2,c1,c2}=selRange();
  if(r1===r2 && r1<=1) return;
  pushUndo();
  if(r1===r2){
    for(let c=c1;c<=c2;c++){ const src=getCell(refOf(r1-1,c))||{};
      setRaw(refOf(r1,c),shiftFormula(src.raw||"",1,0)); copyFmt(src,refOf(r1,c)); }
  } else {
    for(let r=r1+1;r<=r2;r++)for(let c=c1;c<=c2;c++){ const src=getCell(refOf(r1,c))||{};
      setRaw(refOf(r,c),shiftFormula(src.raw||"",r-r1,0)); copyFmt(src,refOf(r,c)); }
  }
  renderAll(); flash("Filled down");
}
function fillRight(){
  const {r1,r2,c1,c2}=selRange();
  if(c1===c2 && c1<=0) return;
  pushUndo();
  if(c1===c2){
    for(let r=r1;r<=r2;r++){ const src=getCell(refOf(r,c1-1))||{};
      setRaw(refOf(r,c1),shiftFormula(src.raw||"",0,1)); copyFmt(src,refOf(r,c1)); }
  } else {
    for(let r=r1;r<=r2;r++)for(let c=c1+1;c<=c2;c++){ const src=getCell(refOf(r,c1))||{};
      setRaw(refOf(r,c),shiftFormula(src.raw||"",0,c-c1)); copyFmt(src,refOf(r,c)); }
  }
  renderAll(); flash("Filled right");
}

/* Alt+= — AutoSum over the run of numbers above, else to the left. */
function numAt(r,c){ try{ const v=cellValue(refOf(r,c),new Set()); return typeof v==="number"?v:null; }catch(e){ return null; } }
function autoSumRange(r,c){
  let top=r; while(top-1>=1 && numAt(top-1,c)!==null) top--;
  if(top<r) return refOf(top,c)+":"+refOf(r-1,c);
  let left=c; while(left-1>=0 && numAt(r,left-1)!==null) left--;
  if(left<c) return refOf(r,left)+":"+refOf(r,c-1);
  return null;
}

/* F4 — cycle the reference at the caret: A1 -> $A$1 -> A$1 -> $A1 -> A1. */
function cycleRefAt(inp){
  const v=inp.value; if(!v||v[0]!=="=") return false;
  const pos=inp.selectionStart==null?v.length:inp.selectionStart;
  const re=/(\$?)([A-Za-z]{1,2})(\$?)(\d{1,3})/g;
  let m,hit=null;
  while((m=re.exec(v))){
    const s=m.index, e=s+m[0].length;
    if(/[A-Za-z0-9_.$]/.test(v[s-1]||"")) continue;   /* not a ref: inside a name */
    if(pos>=s&&pos<=e){ hit={s,e,m}; break; }
    if(e<=pos) hit={s,e,m};                            /* else the last one before the caret */
  }
  if(!hit) return false;
  const col=hit.m[2], row=hit.m[4];
  const state=(hit.m[1]==="$"?1:0)+(hit.m[3]==="$"?2:0);
  const next={0:3,3:2,2:1,1:0}[state];
  const out=((next&1)?"$":"")+col+((next&2)?"$":"")+row;
  inp.value=v.slice(0,hit.s)+out+v.slice(hit.e);
  const caret=hit.s+out.length;
  inp.setSelectionRange(caret,caret);
  if(inp!==fInput) fInput.value=inp.value;
  return true;
}

/* Ctrl+Enter — commit the entry to every cell in the selection. */
function fillSelectionWith(anchorRef,raw){
  const a=parseRef(anchorRef); const {r1,r2,c1,c2}=selRange();
  for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++) setRaw(refOf(r,c),shiftFormula(raw,r-a.r,c-a.c));
}
function todaySerial(){ const d=new Date(); return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)+25569; }

document.addEventListener("keydown",e=>{
  if(!document.getElementById("view-app").classList.contains("on"))return;
  if(editing||document.activeElement===fInput||document.activeElement===nameBox)return;
  const k=e.key, mod=e.ctrlKey||e.metaKey;

  if(k==="ArrowUp"||k==="ArrowDown"||k==="ArrowLeft"||k==="ArrowRight"){
    e.preventDefault();
    const dr=k==="ArrowDown"?1:k==="ArrowUp"?-1:0;
    const dc=k==="ArrowRight"?1:k==="ArrowLeft"?-1:0;
    const base=e.shiftKey?(selEnd||sel):sel;
    if(mod){ const t=edgeJump(base.r,base.c,dr,dc); select(t.r,t.c,e.shiftKey); }
    else select(base.r+dr,base.c+dc,e.shiftKey);
    return;
  }
  if(k==="Home"&&mod){e.preventDefault();select(1,0,e.shiftKey);return;}
  if(k==="End"&&mod){e.preventDefault();const t=lastUsedCell();select(t.r,t.c,e.shiftKey);return;}
  if(k==="Enter"&&!mod){e.preventDefault();select(sel.r+(e.shiftKey?-1:1),sel.c);return;}
  if(k==="Tab"){e.preventDefault();select(sel.r,sel.c+(e.shiftKey?-1:1));return;}
  if(k==="F2"){e.preventDefault();startEdit(refOf(sel.r,sel.c));return;}
  if(k==="Delete"||k==="Backspace"){e.preventDefault();
    pushUndo();
    const {r1,r2,c1,c2}=selRange();
    for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)setRaw(refOf(r,c),"");
    renderAll();return;}

  if(mod&&/^z$/i.test(k)){e.preventDefault(); e.shiftKey?redo():undo(); return;}
  if(mod&&/^y$/i.test(k)){e.preventDefault(); redo(); return;}
  if(mod&&/^d$/i.test(k)){e.preventDefault(); fillDown(); return;}
  if(mod&&/^r$/i.test(k)){e.preventDefault(); fillRight(); return;}
  if(mod&&/^c$/i.test(k)){e.preventDefault();copySelection();return;}
  if(mod&&/^v$/i.test(k)){e.preventDefault();pasteClip();return;}
  if(mod&&/^[biu]$/i.test(k)){e.preventDefault();toggleStyle(k.toLowerCase());return;}
  if(mod&&/^a$/i.test(k)){e.preventDefault(); const t=lastUsedCell(); sel={r:1,c:0}; selEnd={r:t.r,c:t.c}; paintSelection(); return;}
  if(mod&&k===";"){e.preventDefault(); pushUndo(); setRaw(refOf(sel.r,sel.c),String(todaySerial())); renderAll(); flash("Date inserted"); return;}
  if(mod&&k===" "){e.preventDefault(); const {c1,c2}=selRange(); sel={r:1,c:c1}; selEnd={r:ROWS,c:c2}; paintSelection(); return;}
  if(e.shiftKey&&k===" "&&!mod){e.preventDefault(); const {r1,r2}=selRange(); sel={r:r1,c:0}; selEnd={r:r2,c:COLS-1}; paintSelection(); return;}
  if(e.altKey&&(k==="="||k==="+")){e.preventDefault();
    const ref=refOf(sel.r,sel.c); const rng=autoSumRange(sel.r,sel.c);
    startEdit(ref, rng?"=SUM("+rng+")":"=SUM(");
    return;}

  if(!mod&&!e.altKey&&k.length===1){ startEdit(refOf(sel.r,sel.c),k); e.preventDefault(); }
});
fInput.addEventListener("keydown",e=>{
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
    if(handleEditorArrow(e,fInput,sel))return;
    return;
  }
  if(e.key==="F4"){ e.preventDefault(); cycleRefAt(fInput); return; }
  if(point&&point.inputEl===fInput&&e.key!=="Shift")endPoint();
  if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){
    e.preventDefault(); endPoint();
    pushUndo(); fillSelectionWith(refOf(sel.r,sel.c),fInput.value); renderAll(); flash("Filled selection");
    return;
  }
  if(e.key==="Enter"){e.preventDefault();endPoint();clearRefs();pushUndo();setRaw(refOf(sel.r,sel.c),fInput.value);renderAll();select(sel.r+1,sel.c);grid.focus();}
  if(e.key==="Escape"){e.preventDefault();endPoint();clearRefs();paintSelection();e.target.blur();}
});
fInput.addEventListener("input",()=>paintRefs(fInput.value));
fInput.addEventListener("focus",()=>paintRefs(fInput.value));
fInput.addEventListener("blur",()=>{ if(point&&point.inputEl===fInput)endPoint(); clearRefs(); });
nameBox.addEventListener("keydown",e=>{
  if(e.key==="Enter"){e.preventDefault();const p=parseRef(nameBox.value);if(p)select(p.r,p.c);e.target.blur();}
});
function toggleStyle(s){
  pushUndo();
  const {r1,r2,c1,c2}=selRange();
  const anchor=getCell(refOf(sel.r,sel.c))||{}; const on=!anchor[s];
  for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++){const ref=refOf(r,c);(cells[ref]=cells[ref]||{raw:cells[ref]?cells[ref].raw:""})[s]=on;}
  renderAll();
}
document.getElementById("btnBold").onclick=()=>toggleStyle("b");
document.getElementById("btnItalic").onclick=()=>toggleStyle("i");
document.getElementById("btnUnder").onclick=()=>toggleStyle("u");
document.getElementById("btnClear").onclick=()=>{pushUndo();const {r1,r2,c1,c2}=selRange();for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)delete cells[refOf(r,c)];renderAll();};
document.getElementById("btnClearAll").onclick=()=>{pushUndo();resetCells({});if(!currentEx)targetRefs=[];renderAll();};

/* panel tabs */
/* Right panel is closed by default so the grid gets the room. A rail on the
   right edge opens it on a tab; clicking the open tab again (or ×) closes it.
   The last choice is remembered in this browser (applied at INIT). */
const PANEL_TITLES={outline:"Outline",funcs:"Functions",keys:"Keys"};
let panelTab=null;
function setPanel(tab){
  if(!PANEL_TITLES[tab]) tab=null;
  panelTab=tab;
  document.getElementById("panel").classList.toggle("closed",!tab);
  document.querySelectorAll("#rail button").forEach(b=>{
    b.classList.toggle("on",b.dataset.tab===tab); b.setAttribute("aria-selected",String(b.dataset.tab===tab)); });
  document.querySelectorAll(".pbody").forEach(x=>x.classList.toggle("on",x.id==="tab-"+tab));
  if(tab) document.getElementById("panelTitle").textContent=PANEL_TITLES[tab];
  lsSet("tyro_panel",tab||"");
  paintSelection();   // grid width changed: re-place the fill handle
}
document.querySelectorAll("#rail button").forEach(b=>{
  b.onclick=()=>setPanel(panelTab===b.dataset.tab?null:b.dataset.tab);
});
document.getElementById("panelClose").onclick=()=>setPanel(null);


/* =========================================================================
   FORMULA AUTOCOMPLETE — Excel-style. Typing "=aver" lists matching functions
   under the cell; ↑/↓ choose, Tab inserts "AVERAGE(", Esc closes the list.
   Inside a function's brackets a hint shows its arguments, current one bold.
   ========================================================================= */
const FN_SIGS={
  SUM:["number1, [number2], …","Adds all the numbers."],
  AVERAGE:["number1, [number2], …","Average (arithmetic mean) of the numbers."],
  MIN:["number1, [number2], …","Smallest number."],
  MAX:["number1, [number2], …","Largest number."],
  MEDIAN:["number1, [number2], …","Middle value of the numbers."],
  PRODUCT:["number1, [number2], …","Multiplies all the numbers."],
  ABS:["number","Absolute value — drops the sign."],
  SQRT:["number","Square root."],
  POWER:["number, power","A number raised to a power."],
  MOD:["number, divisor","Remainder after division."],
  INT:["number","Rounds down to the nearest whole number."],
  ROUND:["number, num_digits","Rounds to a number of digits."],
  ROUNDUP:["number, num_digits","Rounds away from zero."],
  ROUNDDOWN:["number, num_digits","Rounds toward zero."],
  PI:["","The value of pi."],
  RAND:["","Random number between 0 and 1."],
  RANDBETWEEN:["bottom, top","Random whole number in a range."],
  COUNT:["value1, [value2], …","Counts cells that contain numbers."],
  COUNTA:["value1, [value2], …","Counts cells that are not empty."],
  COUNTBLANK:["range","Counts empty cells."],
  IF:["logical_test, [value_if_true], [value_if_false]","One value if a test is TRUE, another if FALSE."],
  IFERROR:["value, value_if_error","A fallback when a formula errors."],
  COUNTIF:["range, criteria","Counts cells that meet one condition."],
  COUNTIFS:["criteria_range1, criteria1, [criteria_range2, criteria2], …","Counts cells that meet several conditions."],
  SUMIF:["range, criteria, [sum_range]","Adds cells that meet one condition."],
  SUMIFS:["sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], …","Adds cells that meet several conditions."],
  AVERAGEIF:["range, criteria, [average_range]","Averages cells that meet one condition."],
  AVERAGEIFS:["average_range, criteria_range1, criteria1, [criteria_range2, criteria2], …","Averages cells that meet several conditions."],
  AND:["logical1, [logical2], …","TRUE if all arguments are TRUE."],
  OR:["logical1, [logical2], …","TRUE if any argument is TRUE."],
  NOT:["logical","Reverses TRUE and FALSE."],
  LEN:["text","Number of characters."],
  UPPER:["text","Converts to UPPERCASE."],
  LOWER:["text","Converts to lowercase."],
  PROPER:["text","Capitalises Each Word."],
  TRIM:["text","Removes extra spaces."],
  LEFT:["text, [num_chars]","Characters from the start."],
  RIGHT:["text, [num_chars]","Characters from the end."],
  MID:["text, start_num, num_chars","Characters from the middle."],
  CONCAT:["text1, [text2], …","Joins text."],
  CONCATENATE:["text1, [text2], …","Joins text (older name for CONCAT)."],
  TEXTJOIN:["delimiter, ignore_empty, text1, [text2], …","Joins text with a delimiter."],
  FIND:["find_text, within_text, [start_num]","Position of text inside text (case-sensitive)."],
  SUBSTITUTE:["text, old_text, new_text","Replaces text with new text."],
  VLOOKUP:["lookup_value, table_array, col_index_num, [range_lookup]","Looks down the first column and returns a value from the same row."],
  HLOOKUP:["lookup_value, table_array, row_index_num, [range_lookup]","Looks across the first row and returns a value from the same column."],
  XLOOKUP:["lookup_value, lookup_array, return_array, [if_not_found]","Looks up a value and returns the matching item."],
  INDEX:["array, row_num, [column_num]","The value at a row and column of a range."],
  MATCH:["lookup_value, lookup_array, [match_type]","Position of a value in a range."],
  TODAY:["","Today's date."],
  NOW:["","Current date and time."],
  DATE:["year, month, day","Builds a date."],
  YEAR:["serial_number","Year of a date."],
  MONTH:["serial_number","Month of a date."],
  DAY:["serial_number","Day of a date."],
  DAYS:["end_date, start_date","Days between two dates."],
  TEXT:["value, format_text","Formats a number or date as text."],
  EOMONTH:["start_date, months","Last day of the month, months away."],
  NPV:["rate, value1, [value2], …","Net present value of future cash flows."],
  IRR:["values, [guess]","Internal rate of return."],
  XNPV:["rate, values, dates","Net present value with dated cash flows."],
  XIRR:["values, dates, [guess]","Internal rate of return with dated cash flows."],
  PMT:["rate, nper, pv, [fv], [type]","Payment for a loan."],
  PV:["rate, nper, pmt, [fv], [type]","Present value."],
  FV:["rate, nper, pmt, [pv], [type]","Future value."],
  NPER:["rate, pmt, pv, [fv], [type]","Number of periods."],
  RATE:["nper, pmt, pv, [fv], [type], [guess]","Interest rate per period."],
  IPMT:["rate, per, nper, pv, [fv], [type]","Interest part of a payment."],
  PPMT:["rate, per, nper, pv, [fv], [type]","Principal part of a payment."],
  SLN:["cost, salvage, life","Straight-line depreciation."],
  DB:["cost, salvage, life, period, [month]","Declining-balance depreciation."],
  ISNUMBER:["value","TRUE if the value is a number."],
  ISTEXT:["value","TRUE if the value is text."],
  ISBLANK:["value","TRUE if the cell is empty."]
};
const acBox=document.createElement("div");
acBox.id="fnSuggest"; acBox.setAttribute("role","listbox"); acBox.setAttribute("aria-label","Function suggestions"); acBox.hidden=true;
const argTip=document.createElement("div");
argTip.id="fnArgTip"; argTip.setAttribute("role","tooltip"); argTip.hidden=true;
document.body.appendChild(acBox); document.body.appendChild(argTip);
let ac=null;   // {input, start, end, word, items, idx}

function placeUnder(el,input){
  const r=input.getBoundingClientRect();
  el.style.left=Math.max(8,Math.min(r.left,window.innerWidth-el.offsetWidth-8))+"px";
  el.style.top=(r.bottom+4)+"px";
}
// The function name being typed at the caret, if any (not inside quotes, not part of a longer word).
function fnTokenAt(input){
  const v=input.value, pos=input.selectionStart==null?v.length:input.selectionStart;
  if(v[0]!=="=") return null;
  const before=v.slice(0,pos);
  if(((before.match(/"/g)||[]).length)%2) return null;
  const m=/([A-Za-z][A-Za-z0-9.]*)$/.exec(before); if(!m) return null;
  const start=pos-m[1].length;
  if(/[A-Za-z0-9_$.]/.test(v[start-1]||"")) return null;
  if(v[pos]==="(") return null;
  return {start,end:pos,word:m[1].toUpperCase()};
}
function hideSuggest(){ if(ac&&ac.input) ac.input.removeAttribute("aria-activedescendant"); ac=null; acBox.hidden=true; }
function hideArgTip(){ argTip.hidden=true; }
function hideFnHelp(){ hideSuggest(); hideArgTip(); }
function renderSuggest(){
  acBox.innerHTML=ac.items.map((n,i)=>'<div class="fs-item'+(i===ac.idx?" on":"")+'" role="option" id="fs-'+i+'" aria-selected="'+(i===ac.idx)+'" data-i="'+i+'"><span class="fs-name">'+n+'</span></div>').join("")
    +'<div class="fs-foot"><span class="fs-desc">'+((FN_SIGS[ac.items[ac.idx]]||["",""])[1])+'</span><span class="fs-key">Tab ↹ to insert</span></div>';
  ac.input.setAttribute("aria-activedescendant","fs-"+ac.idx);
  acBox.hidden=false; placeUnder(acBox,ac.input);
}
function updateSuggest(input){
  const t=fnTokenAt(input);
  if(t){
    const items=Object.keys(FUNCS).filter(n=>n.startsWith(t.word)).sort();
    if(items.length){
      const keep=ac&&ac.input===input&&ac.word===t.word;
      ac={input,...t,items:items.slice(0,8),idx:keep?Math.min(ac.idx,Math.min(items.length,8)-1):0};
      hideArgTip(); renderSuggest(); return;
    }
  }
  hideSuggest(); updateArgTip(input);
}
function acceptSuggest(i){
  if(!ac) return;
  const input=ac.input, name=ac.items[i==null?ac.idx:i], v=input.value;
  input.value=v.slice(0,ac.start)+name+"("+v.slice(ac.end);
  const caret=ac.start+name.length+1;
  input.setSelectionRange(caret,caret);
  if(input!==fInput) fInput.value=input.value;
  hideSuggest(); paintRefs(input.value); updateArgTip(input);
  input.focus();
}
// Keys while the list is open. Returns true when it handled the key.
function acKey(e){
  if(!ac||acBox.hidden) return false;
  if(e.key==="ArrowDown"){ ac.idx=(ac.idx+1)%ac.items.length; renderSuggest(); return true; }
  if(e.key==="ArrowUp"){ ac.idx=(ac.idx-1+ac.items.length)%ac.items.length; renderSuggest(); return true; }
  if(e.key==="Tab"){ acceptSuggest(); return true; }
  if(e.key==="Escape"){ const inp=ac.input; hideSuggest(); updateArgTip(inp); return true; }
  return false;
}
acBox.addEventListener("mousedown",e=>{ e.preventDefault(); const it=e.target.closest(".fs-item"); if(it) acceptSuggest(+it.dataset.i); });
// Argument hint: the innermost unclosed function call before the caret.
function updateArgTip(input){
  const v=input.value, pos=input.selectionStart==null?v.length:input.selectionStart;
  if(v[0]!=="="){ hideArgTip(); return; }
  const stack=[]; let inStr=false;
  for(let i=1;i<pos;i++){
    const ch=v[i];
    if(ch==='"'){ inStr=!inStr; continue; }
    if(inStr) continue;
    if(ch==="("){ const m=/([A-Za-z][A-Za-z0-9.]*)$/.exec(v.slice(0,i)); stack.push({name:m?m[1].toUpperCase():"",arg:0}); }
    else if(ch===")") stack.pop();
    else if(ch===","&&stack.length) stack[stack.length-1].arg++;
  }
  const top=stack[stack.length-1];
  if(!top||!FN_SIGS[top.name]||!FN_SIGS[top.name][0]){ hideArgTip(); return; }
  const parts=FN_SIGS[top.name][0].split(", ");
  const cur=Math.min(top.arg,parts.length-1);
  argTip.innerHTML='<span class="fn">'+top.name+'</span>('+parts.map((p,i)=>i===cur?'<b>'+p+'</b>':p).join(", ")+')';
  argTip.hidden=false; placeUnder(argTip,input);
}
fInput.addEventListener("input",()=>updateSuggest(fInput));
fInput.addEventListener("keyup",e=>{ if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) updateSuggest(fInput); });
fInput.addEventListener("click",()=>updateSuggest(fInput));
fInput.addEventListener("keydown",e=>{ if(acKey(e)){ e.preventDefault(); e.stopImmediatePropagation(); } },true);
fInput.addEventListener("blur",hideFnHelp);
window.addEventListener("resize",hideFnHelp);
