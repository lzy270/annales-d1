/* Neuro 3D — application (modules, interface, quiz) */
(function(){
"use strict";
const {T,V,bs}=N3,C=N3.C;
const $=s=>document.querySelector(s);
const P=p=>p.isVector3?p.clone():V(p[0],p[1],p[2]);
const panel=$("#panel"),ctrl=$("#ctrl"),viewsEl=$("#views"),tabsEl=$("#tabs");
const G=new T.Group();N3.scene.add(G);
const ACT={};
document.addEventListener("click",e=>{const t=e.target.closest("[data-a]");if(t&&ACT[t.dataset.a])ACT[t.dataset.a](t.dataset.v,t)});
const src=s=>`<b class="src">${s}</b>`;
const chip=(a,v,txt,on,cls)=>`<button class="chip ${cls||""}" data-a="${a}" data-v="${v}" aria-pressed="${!!on}">${txt}</button>`;
const short=t=>t.split(" (")[0];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- utilitaires scène ---------- */
const cer=N3.cereb;
cer.neo.forEach(m=>m.userData.sid="neo");cer.vermis.userData.sid="vermis";cer.archeo.forEach(m=>m.userData.sid="archeo");cer.ped.forEach(m=>m.userData.sid="ped");
const deepAll=()=>Object.values(N3.deep.items).flat();
const cerAll=()=>[...cer.neo,cer.vermis,...cer.archeo,...cer.ped];
const brainPick=()=>[...N3.hemis,N3.bstem.mesh,...cerAll(),...deepAll()];
function glow(list,on,col){list.forEach(m=>{const mt=m.material;if(!mt||!mt.emissive)return;mt.emissive.set(on?(col||"#4a6dff"):"#000000");mt.emissiveIntensity=on?.6:0})}
const center=m=>new T.Box3().setFromObject(m).getCenter(new T.Vector3());
let cur=null;
function reset(){
  while(G.children.length){const o=G.children[0];G.remove(o);o.traverse(m=>{if(m.geometry)m.geometry.dispose()})}
  N3.clearLabels();N3.labelsVisible=true;N3.auto=false;
  N3.setHemiMode("neutral",{lobeSel:-1,terrL:[0,0,0],terrR:[0,0,0],terrHi:-1});
  N3.setHemiOpacity(1);N3.setCut(9);N3.setBsOpacity(1);N3.deep.setOpacity(1);
  N3.deep.group.visible=true;cer.group.visible=true;
  glow(deepAll(),false);glow(cerAll(),false);glow([N3.bstem.mesh],false);
  N3.onPick=null;N3.pickables=()=>[];cur=null;
}
function ctrlBuild(o){
  ctrl.innerHTML=`<label>Cortex <input type="range" id="c_op" min="0" max="100" value="${Math.round(o.op*100)}"></label>
  <label>Coupe sagittale <input type="range" id="c_cut" min="0" max="9" step=".1" value="${o.cut==null?9:o.cut}"></label>
  <label><input type="checkbox" id="c_lb" checked> Étiquettes</label>
  <label><input type="checkbox" id="c_au"> Rotation</label>${o.extra||""}`;
  $("#c_op").oninput=e=>{N3.setHemiOpacity(e.target.value/100);if(cur&&cur.onOp)cur.onOp(e.target.value/100)};
  $("#c_cut").oninput=e=>N3.setCut(+e.target.value);
  $("#c_lb").onchange=e=>{N3.labelsVisible=e.target.checked};
  $("#c_au").onchange=e=>{N3.auto=e.target.checked};
}
function setOp(v){N3.setHemiOpacity(v);const s=$("#c_op");if(s)s.value=v*100;if(cur&&cur.onOp)cur.onOp(v)}
const VIEWS=[["lat","Gauche"],["right","Droite"],["front","Face"],["post","Arrière"],["top","Dessus"],["base","Dessous"],["trunk","Tronc"]];
viewsEl.innerHTML=VIEWS.map(v=>`<button class="vbtn" data-a="view" data-v="${v[0]}">${v[1]}</button>`).join("");
ACT.view=v=>N3.view(v);
N3.onFrame((dt,t)=>{if(cur&&cur.tick)cur.tick(dt,t)});

/* ---------- Route (tube + particules + coupure) ---------- */
function Route(pts,col,r,sp){this.pts=pts.map(P);this.col=col;this.r=r||.1;this.sp=sp||2.2;this.g=new T.Group();G.add(this.g);this.cut=null;this.build()}
Route.prototype.build=function(){
  const g=this.g;while(g.children.length){const o=g.children[0];g.remove(o);if(o.geometry)o.geometry.dispose()}
  this.parts=[];this.curve=null;
  const k=this.cut,live=k==null?this.pts:this.pts.slice(0,k+1),dead=k==null?null:this.pts.slice(k);
  if(live.length>1){
    g.add(N3.tubeFrom(live,this.r,this.col,{transparent:true,opacity:.85,emissive:this.col,emissiveIntensity:.35}));
    this.curve=new T.CatmullRomCurve3(live);this.len=this.curve.getLength();
    const n=Math.max(3,Math.round(this.len/1.5));
    for(let i=0;i<n;i++){const m=new T.Mesh(new T.SphereGeometry(this.r*1.7,10,8),new T.MeshBasicMaterial({color:"#ffffff"}));m.renderOrder=4;g.add(m);this.parts.push({m,u:i/n})}
  }
  if(dead&&dead.length>1)g.add(N3.tubeFrom(dead,this.r*.8,"#7b8494",{transparent:true,opacity:.35}));
};
Route.prototype.tick=function(dt){if(!this.curve)return;for(const p of this.parts){p.u=(p.u+dt*this.sp/this.len)%1;p.m.position.copy(this.curve.getPointAt(p.u))}};
function dot(pos,r,col,order){const m=new T.Mesh(new T.SphereGeometry(r,16,12),new T.MeshBasicMaterial({color:col,depthTest:false,transparent:true}));m.position.copy(P(pos));m.renderOrder=order||8;G.add(m);return m}

/* =========================================================
   1. ANATOMIE
   ========================================================= */
const GROUPS=[["Lobes",["lobe0","lobe1","lobe2","lobe3"]],["Cervelet",["neo","vermis","archeo","ped"]],["Tronc cérébral",["bs0","bs1","bs2","bs3"]],["Noyaux gris et substance blanche",["thalamus","caude","lenticulaire","pallidum","capsule","hippocampe","amygdale","calleux"]]];
const DEEPL=[["thalamus","Thalamus"],["caude","Noyau caudé"],["lenticulaire","Putamen"],["pallidum","Pallidum"],["capsule","Capsule interne"],["hippocampe","Hippocampe"],["amygdale","Amygdale"],["calleux","Corps calleux"]];
const VW={lobe0:"lat",lobe1:"top",lobe2:"lat",lobe3:"post",neo:"post",vermis:"post",archeo:"base",ped:"trunk",bs0:"trunk",bs1:"trunk",bs2:"trunk",bs3:"trunk"};
const posOf=id=>{const l=C.ANAT_LABELS.find(x=>x[0]===id);if(l)return l[2]();if(N3.deep.items[id])return center(N3.deep.items[id][0]);if(id==="vermis")return center(cer.vermis);if(id==="archeo")return center(cer.archeo[0]);if(id==="ped")return center(cer.ped[0]);return V(0,0,0)};
const ANAT={sel:null,dl:[],
enter(){
  reset();cur=ANAT;N3.setHemiMode("lobes",{lobeSel:-1});N3.setHemiOpacity(1);
  ctrlBuild({op:1,cut:9,extra:`<button class="vbtn" data-a="sagit">Coupe médiane</button>`});
  C.ANAT_LABELS.forEach(([id,t,pos])=>N3.addLabel(t,pos,"",()=>ANAT.pick(id)));
  ANAT.dl=DEEPL.map(([id,t])=>{const l=N3.addLabel(t,center(N3.deep.items[id][0]),"",()=>ANAT.pick(id));l.on=false;return l});
  N3.pickables=brainPick;N3.onPick=id=>{if(id&&C.INFO[id])ANAT.pick(id)};
  N3.view("lat");ANAT.sel=null;ANAT.render();
},
onOp(v){ANAT.dl.forEach(l=>l.on=v<.6)},
pick(id){
  ANAT.sel=id;glow(deepAll(),false);glow(cerAll(),false);
  const lob=/^lobe\d$/.test(id||"")?+id[4]:-1;
  N3.setHemiMode("lobes",{lobeSel:lob});
  if(id){
    const deep=!!N3.deep.items[id];
    if(lob>=0)setOp(1);else if(deep)setOp(.15);else setOp(.55);
    if(deep)glow(N3.deep.items[id],true);
    if(id==="neo")glow(cer.neo,true);if(id==="vermis")glow([cer.vermis],true);if(id==="archeo")glow(cer.archeo,true);if(id==="ped")glow(cer.ped,true);
    const c=$("#c_cut");N3.setCut(id==="calleux"?0:+c.value);
    N3.view(id==="calleux"?"right":(VW[id]||"lat"));
  }
  ANAT.render();
},
render(){
  const id=ANAT.sel,I=id&&C.INFO[id];
  let h=`<h2>Anatomie</h2><p class="sub">Clique sur une structure du cerveau, ou choisis-la dans la liste.</p>`;
  if(I){
    h+=`<div class="card" style="border-left:6px solid ${I.c}"><h3 style="margin:0 0 8px;color:var(--ink);text-transform:none;font-size:1.05rem;letter-spacing:0">${I.t}</h3>${I.d.map(x=>`<p>${x}</p>`).join("")}</div>`;
    h+=`<div class="card">${src("Vascularisation")}${I.v}</div>`;
    if(I.p)h+=`<div class="card tip">${src("À retenir")}${I.p}</div>`;
    h+=`<p class="hint">Source : ${I.s}</p>`;
  }
  for(const [g,ids] of GROUPS)h+=`<h3>${g}</h3><div class="pills">${ids.map(i=>chip("apick",i,short(C.INFO[i].t),i===id)).join("")}</div>`;
  h+=`<p class="hint" style="margin-top:16px">Astuce : baisse le curseur « Cortex » pour voir les noyaux gris, ou utilise la coupe médiane.</p>`;
  panel.innerHTML=h;
}};
ACT.apick=v=>ANAT.pick(v);
ACT.sagit=()=>{N3.setCut(0);$("#c_cut").value=0;N3.view("right")};

/* =========================================================
   2. VASCULARISATION
   ========================================================= */
const ART=id=>C.ART.find(a=>a.id===id);
const SHORT={ica:"Carotide int.",ophth:"Ophtalmique",aca:"ACA",acm:"ACM",acm_sup:"ACM sup.",lent:"Lenticulo-striées",achoa:"Choroïd. ant.",acomp:"Com. post.",acp:"ACP",sca:"SCA",aica:"AICA",pica:"PICA",vert:"Vertébrale",bas:"Tronc basilaire",acom:"Com. ant."};
const AG=[["Circulation antérieure (carotide interne)",["ica","ophth","aca","acm","acm_sup","lent","achoa"]],["Circulation postérieure (vertébro-basilaire)",["vert","bas","pica","aica","sca","acp"]],["Polygone de Willis (anastomoses)",["acom","acomp"]]];
const VASC={inst:[],occ:{"-1":new Set(),"0":new Set(),"1":new Set()},sel:null,side:-1,
enter(){
  reset();cur=VASC;N3.setHemiMode("terr");N3.setHemiOpacity(.3);N3.setBsOpacity(.6);N3.deep.setOpacity(.35);
  ctrlBuild({op:.3,cut:9});VASC.build(true);
  N3.pickables=()=>VASC.inst.flatMap(i=>i.meshes);
  N3.onPick=(id,h)=>{if(id==="art"){const u=h.object.userData;VASC.select(u.aid,u.side||VASC.side)}};
  N3.view("base");VASC.sel=null;VASC.refresh();
},
build(labels){
  VASC.inst=[];
  for(const a of C.ART){
    for(const s of (a.mid?[0]:[-1,1])){
      const f=s||1,sets=a.multi||[a.pts],inst={a,s,meshes:[],particles:[]};
      for(const pts of sets){
        const pp=pts.map(p=>[p[0]*f,p[1],p[2]]);
        const m=N3.tubeFrom(pp,a.r,a.col,{roughness:.4,transparent:true,opacity:1});
        m.userData={sid:"art",aid:a.id,side:s};G.add(m);inst.meshes.push(m);
        const cv=new T.CatmullRomCurve3(pp.map(P)),len=cv.getLength(),n=Math.max(2,Math.round(len/2.2));
        for(let i=0;i<n;i++){const pm=new T.Mesh(new T.SphereGeometry(Math.max(.05,a.r*.8),8,6),new T.MeshBasicMaterial({color:"#ffffff"}));pm.renderOrder=4;G.add(pm);inst.particles.push({m:pm,cv,len,u:i/n})}
        if(!inst.mid)inst.mid=cv.getPoint(.5);
      }
      inst.marker=dot(inst.mid,.32,"#e11d2e",9);inst.marker.visible=false;
      if(labels&&s!==1)N3.addLabel(SHORT[a.id],V(a.lab[0]*f,a.lab[1],a.lab[2]),"",()=>VASC.select(a.id,s||VASC.side));
      VASC.inst.push(inst);
    }
  }
},
stopped(s,id){return [...VASC.occ[s],...VASC.occ[0]].some(r=>ART(r).occ.down.includes(id))},
refresh(){
  const O=VASC.occ,sel=VASC.sel;
  for(const i of VASC.inst){
    const st=VASC.stopped(i.s,i.a.id);i.st=st;
    for(const m of i.meshes){m.material.color.set(st?"#6b7280":i.a.col);m.material.opacity=st?.5:1;
      m.material.emissive.set(sel===i.a.id?"#ffffff":"#000000");m.material.emissiveIntensity=sel===i.a.id?.45:0}
    i.marker.visible=O[i.s].has(i.a.id);
  }
  const lv={"-1":[0,0,0],"1":[0,0,0]},tint={cap:{"-1":0,"1":0},cer:{"-1":0,"1":0},tr:0};
  for(const s of [-1,1])for(const r of [...O[s],...O[0]]){const o=ART(r).occ;o.terr.forEach((v,k)=>lv[s][k]=Math.max(lv[s][k],v));
    if(o.tint==="capsule")tint.cap[s]=1;if(o.tint==="cereb")tint.cer[s]=1;if(o.tint==="tronc")tint.tr=1}
  N3.setHemiMode("terr",{terrL:lv["-1"],terrR:lv["1"]});
  const cp=N3.deep.items.capsule;glow(cp.slice(0,3),!!tint.cap["-1"],"#c1121f");glow(cp.slice(3),!!tint.cap["1"],"#c1121f");
  glow([cer.neo[0]],!!tint.cer["-1"],"#c1121f");glow([cer.neo[1]],!!tint.cer["1"],"#c1121f");glow([N3.bstem.mesh],!!tint.tr,"#c1121f");
  VASC.render();
},
select(id,s){VASC.sel=id;if(!ART(id).mid)VASC.side=s;
  const a=ART(id);if(a.mid)N3.flyTo([0,-9,3],[0,-3.5,-1]);else N3.flyTo([VASC.side*(-0)+(VASC.side<0?-10:10),-9,5],[VASC.side*1.5,-3,-1]);
  VASC.refresh()},
toggle(){const a=ART(VASC.sel),s=a.mid?0:VASC.side,S=VASC.occ[s];if(S.has(a.id))S.delete(a.id);else{S.add(a.id);if(a.occ.terr.some(x=>x>0)&&N3.hemiState.opacity<.55)setOp(.6)}VASC.refresh()},
tick(dt,t){
  for(const i of VASC.inst){
    if(i.marker.visible){const k=1+.25*Math.sin(t*6);i.marker.scale.set(k,k,k)}
    if(i.st)continue;
    for(const p of i.particles){p.u=(p.u+dt*1.5/p.len)%1;p.m.position.copy(p.cv.getPointAt(p.u));p.m.visible=true}
  }
  for(const i of VASC.inst)if(i.st)i.particles.forEach(p=>p.m.visible=false);
},
render(){
  const sel=VASC.sel,a=sel&&ART(sel),O=VASC.occ;
  let h=`<h2>Vascularisation</h2><p class="sub">Clique sur une artère : tu vois le flux, puis tu peux l'occlure pour voir le territoire et le syndrome.</p>`;
  if(a){
    const s=a.mid?0:VASC.side,isRoot=O[s].has(a.id),st=VASC.stopped(s||-1,a.id)&&!isRoot&&!a.mid;
    h+=`<div class="card" style="border-left:6px solid ${a.col}"><h3 style="margin:0 0 6px;color:var(--ink);text-transform:none;font-size:1.05rem;letter-spacing:0">${a.nom}</h3><p>${a.d}</p></div>`;
    if(!a.mid)h+=`<div class="pills">${chip("vside",-1,"Côté gauche",VASC.side<0)}${chip("vside",1,"Côté droit",VASC.side>0)}</div>`;
    h+=`<div class="row"><button class="btn primary" data-a="vocc">${isRoot?"Rétablir le flux":"Occlure cette artère"+(a.mid?"":(VASC.side<0?" (gauche)":" (droite)"))}</button></div>`;
    if(st)h+=`<div class="card warn">Cette artère est déjà privée de flux par une occlusion en amont.</div>`;
    if(isRoot){
      const side=VASC.side<0?"gauche":"droite",opp=VASC.side<0?"droite":"gauche",cort=a.occ.terr.some(x=>x>0);
      h+=`<div class="card bad">${src("Conséquence clinique · "+a.occ.s)}${a.occ.txt}</div>`;
      if(!a.mid&&cort)h+=`<div class="card tip">Lésion de l'hémisphère <b>${side}</b> : signes à <b>${opp}</b> (controlatéraux)${VASC.side<0?" ; hémisphère gauche = dominant (aphasie)":" ; hémisphère droit = mineur (négligence)"}.</div>`;
      else if(a.id==="ophth")h+=`<div class="card tip">Exception : atteinte de l'œil <b>${side}</b> (homolatérale).</div>`;
    }
  }else h+=`<div class="card tip">Choisis une artère dans la liste ou clique dessus dans la vue 3D (vue du dessous).</div>`;
  for(const [g,ids] of AG)h+=`<h3>${g}</h3><div class="pills">${ids.map(i=>chip("vsel",i,SHORT[i],i===sel,O[-1].has(i)||O[1].has(i)||O[0].has(i)?"red":"")).join("")}</div>`;
  h+=`<h3>Territoires corticaux</h3><div class="pills">${C.TERR.map((t,k)=>`<button class="chip" data-a="vterr" data-v="${k}" aria-pressed="${N3.hemiState.terrHi===k}" style="border-left:8px solid ${t[1]}">${t[0]}</button>`).join("")}</div>`;
  if(N3.hemiState.terrHi>=0)h+=`<p class="hint">${C.TERR[N3.hemiState.terrHi][2]}</p>`;
  h+=`<div class="row"><button class="btn" data-a="vreset">Tout réinitialiser</button></div>`;
  panel.innerHTML=h;
}};
ACT.vsel=v=>VASC.select(v,VASC.side);
ACT.vside=v=>{VASC.side=+v;VASC.select(VASC.sel,+v)};
ACT.vocc=()=>VASC.toggle();
ACT.vreset=()=>{for(const k in VASC.occ)VASC.occ[k].clear();VASC.refresh()};
ACT.vterr=v=>{const hs=N3.hemiState;N3.setHemiMode("terr",{terrHi:hs.terrHi===+v?-1:+v});VASC.render()};

/* =========================================================
   3. VOIES (moteur de lecture) + LCS
   ========================================================= */
const PM={p:null,R:null,sel:0,cut:-1,play:false,acc:0,mk:[],lcs:false,les:null,vent:null,
load(p,lcs){
  reset();cur=PM;PM.p=p;PM.lcs=!!lcs;PM.sel=0;PM.cut=-1;PM.play=false;PM.acc=0;PM.mk=[];PM.les=null;PM.vent=null;
  N3.setHemiOpacity(lcs?.2:.3);N3.setBsOpacity(lcs?.45:.5);N3.deep.setOpacity(.5);N3.setHemiMode("neutral");
  if(lcs){N3.deep.group.visible=false;PM.buildVent()}
  ctrlBuild({op:lcs?.2:.3,cut:9});
  PM.R=new Route(p.steps.map(s=>s.p),p.col,lcs?.12:.1,lcs?1.6:2.2);
  let n=0;p.steps.forEach((s,i)=>{if(!s.t)return;n++;
    const m=dot(s.p,.2,"#ffffff",8);m.userData={sid:"step",i};PM.mk[i]=m;
    N3.addLabel(String(n),()=>P(s.p),"",()=>PM.go(i))});
  PM.les=dot(V(0,0,0),.34,"#e11d2e",9);PM.les.visible=false;
  N3.pickables=()=>PM.mk.filter(Boolean);N3.onPick=(id,h)=>{if(id==="step")PM.go(h.object.userData.i)};
  N3.view(lcs?"lat":"lat");PM.go(0,true);
},
buildVent(){
  const mk=(m,pos)=>{m.geometry.computeBoundingBox();const c=new T.Vector3();m.geometry.boundingBox.getCenter(c);m.geometry.translate(-c.x,-c.y,-c.z);m.position.copy(c);G.add(m);return m};
  const o={transparent:true,opacity:.6,emissive:"#2aa7d8",emissiveIntensity:.5};
  const lat=[-1,1].map(s=>mk(N3.tubeFrom([V(s*1.1,2.6,4.0),V(s*1.5,3.0,1.0),V(s*2.2,2.8,-1.8),V(s*3.3,1.5,-3.2),V(s*4,-1.0,-2.2)],.32,"#6fd3ff",o)));
  const v3=mk(N3.ell([0,.4,.4],[.22,.9,.9],"#6fd3ff",o));
  const aq=mk(N3.tubeFrom([V(0,-.1,-.2),V(0,-1.3,-1.6),V(0,-2.5,-2.5)],.1,"#6fd3ff",o));
  const v4=mk(N3.ell([0,-3.4,-3.3],[.5,.7,.8],"#6fd3ff",o));
  PM.vent={lat,v3,v4,aq,tgt:{l0:1,l1:1,v3:1,v4:1}};
},
tick(dt,t){
  PM.R.tick(dt);
  if(PM.les.visible){const k=1+.25*Math.sin(t*6);PM.les.scale.set(k,k,k)}
  PM.mk.forEach((m,i)=>{if(m){const on=i===PM.sel,k=on?1.9:1;m.scale.lerp(V(k,k,k),.2);m.material.color.set(on?"#3b63d6":"#ffffff")}});
  if(PM.vent){const v=PM.vent,s=(m,k)=>{const x=m.scale.x+(k-m.scale.x)*Math.min(1,dt*2.5);m.scale.set(x,x,x)};s(v.lat[0],v.tgt.l0);s(v.lat[1],v.tgt.l1);s(v.v3,v.tgt.v3);s(v.v4,v.tgt.v4)}
  if(PM.play){PM.acc+=dt;if(PM.acc>2.6){PM.acc=0;PM.next()}}
},
titled(){return PM.p.steps.map((s,i)=>s.t?i:-1).filter(i=>i>=0)},
next(){const t=PM.titled(),k=t.indexOf(PM.sel),n=t[k+1];
  if(n===undefined||(PM.cut>=0&&PM.sel>=PM.cutIdx)){PM.play=false;PM.render();return}
  if(PM.cut>=0&&n>PM.cutIdx){PM.go(PM.cutIdx>PM.sel&&PM.p.steps[PM.cutIdx].t?PM.cutIdx:PM.sel);PM.play=false;PM.render();return}
  PM.go(n)},
go(i,noFly){PM.sel=i;if(!noFly){const p=P(PM.p.steps[i].p),d=N3.camera.position.clone().sub(N3.controls.target).normalize();N3.flyTo(p.clone().addScaledVector(d,11).toArray(),p.toArray(),.8)}PM.render()},
setLes(j){
  const L=PM.p.les;PM.cut=j;
  if(j<0){PM.R.cut=null;PM.cutIdx=null;PM.les.visible=false}
  else{const st=L[j].step,k=Array.isArray(st)?Math.floor((st[0]+st[1])/2):st;PM.cutIdx=k;PM.R.cut=k;PM.les.position.copy(PM.R.pts[k]);PM.les.visible=true}
  PM.R.build();
  if(PM.vent){const t=PM.vent.tgt;t.l0=t.l1=t.v3=t.v4=1;
    if(j===0)t.l0=1.9;if(j===1){t.l0=t.l1=1.8;t.v3=1.6}if(j===2||j===3){t.l0=t.l1=1.7;t.v3=1.5;t.v4=1.7}}
  if(j>=0){PM.go(PM.cutIdx,false)}else PM.render();
},
render(){
  const p=PM.p,L=p.les,st=p.steps[PM.sel],t=PM.titled();
  let h=`<h2>${p.nom}</h2><p class="sub">${p.cap}</p>`;
  if(!PM.lcs)h=`<div class="pills">${[["motrice","Motrice"],["lemn","Lemniscale"],["spino","Spino-thalamique"],["vis","Visuelle"]].map(x=>chip("vpath",x[0],x[1],x[0]===p.id)).join("")}</div>`+h;
  h+=`<div class="row"><button class="btn primary" data-a="pplay">${PM.play?"Pause":"▶ Lecture guidée"}</button><button class="btn" data-a="pprev">◀</button><button class="btn" data-a="pnext">▶</button></div>`;
  if(st.t)h+=`<div class="card tip">${src("Étape "+(t.indexOf(PM.sel)+1)+" / "+t.length)}<b>${st.t}</b><br>${st.d}</div>`;
  h+=`<h3>Où est la lésion ?</h3><div class="pills">${chip("ples",-1,"Voie intacte",PM.cut<0)}${L.map((l,j)=>chip("ples",j,l.l,j===PM.cut,"red")).join("")}</div>`;
  if(PM.cut>=0)h+=`<div class="card bad">${src("Conséquence · "+L[PM.cut].s)}${L[PM.cut].tx}</div>`;
  h+=`<h3>Étapes</h3>`;
  h+=`<ol class="steps">${t.map((i,n)=>`<li class="${i===PM.sel?"on":""} ${PM.cutIdx!=null&&i>PM.cutIdx?"cut":""}" data-a="pgo" data-v="${i}"><i>${n+1}</i><div><b>${p.steps[i].t}</b></div></li>`).join("")}</ol>`;
  panel.innerHTML=h;
}};
ACT.pgo=v=>PM.go(+v);
ACT.pplay=()=>{PM.play=!PM.play;PM.acc=2.6;if(PM.play&&PM.sel===PM.titled().slice(-1)[0])PM.go(PM.titled()[0]);PM.render()};
ACT.pnext=()=>{PM.play=false;const t=PM.titled(),n=t[t.indexOf(PM.sel)+1];if(n!==undefined)PM.go(n)};
ACT.pprev=()=>{PM.play=false;const t=PM.titled(),n=t[t.indexOf(PM.sel)-1];if(n!==undefined)PM.go(n)};
ACT.ples=v=>PM.setLes(+v);
ACT.vpath=v=>VOIES.set(v);

/* ---------- voies visuelles ---------- */
const VIS={bund:[],key:null,
enter(){
  reset();cur=VIS;N3.setHemiOpacity(.3);N3.setBsOpacity(.5);N3.deep.setOpacity(.4);N3.setHemiMode("neutral");
  ctrlBuild({op:.3,cut:9});VIS.key=null;
  const E=[[-1,"#3b82f6"],[1,"#f59e0b"]];
  VIS.bund=[];
  for(const [e,col] of E){
    const eye=new T.Mesh(new T.SphereGeometry(1,24,18),N3.mat("#f5f1ea"));eye.scale.set(1,1,1);eye.position.set(e*3,-4.2,9.4);G.add(eye);
    const pup=new T.Mesh(new T.SphereGeometry(.42,16,12),N3.mat(col));pup.position.set(e*3,-4.2,10.3);G.add(pup);
    for(const kind of ["temp","nasal"]){
      const t=kind==="temp"?e:-e,pts=[],stg=[];
      const add=(p,s)=>{pts.push(p);stg.push(s)};
      add([e*3,-4.2,9.0],"n");add([e*1.8,-3.7,6.3],"n");add([e*1.0,-3.2,3.6],"n");add([e*.45,-2.7,2.4],"n");
      if(kind==="temp")add([e*.35,-2.6,1.9],"c");else{add([e*.3,-2.6,2.0],"c");add([0,-2.6,1.9],"c");add([t*.3,-2.6,1.6],"c")}
      add([t*1.0,-2.5,.9],"t");add([t*1.8,-2.0,-.2],"t");
      add([t*2.3,-.6,-1.6],"g");
      add([t*4.6,.2,-3.4],"r");add([t*4.3,1.0,-5.6],"r");add([t*3.2,1.4,-7.4],"r");
      add([t*1.4,1.1,-9.0],"v");
      const R=new Route(pts,col,.07,2.4);R.g.children.forEach(o=>o);
      VIS.bund.push({e,t,kind,pts,stg,R});
    }
  }
  N3.addLabel("Œil gauche",V(-3,-4.2,10.6));N3.addLabel("Œil droit",V(3,-4.2,10.6));
  N3.addLabel("Chiasma",V(0,-2.6,2.0),"",()=>VIS.go(2));N3.addLabel("CGL",V(-2.3,-.6,-1.6),"",()=>VIS.go(4));N3.addLabel("V1",V(-1.4,1.1,-9.0),"",()=>VIS.go(6));
  N3.pickables=()=>[];N3.onPick=null;
  N3.flyTo([0,-27,14],[0,-3,3],.1);VIS.sel=0;VIS.render();
},
go(i){VIS.sel=i;const P0=[[0,-4.2,9.4],[0,-3.2,3.6],[0,-2.6,2.0],[-1.0,-2.5,.9],[-2.3,-.6,-1.6],[-4.5,.2,-3.4],[-1.4,1.1,-9]][i];
  N3.flyTo([-14,3,P0[2]+8],P0,.9);VIS.render()},
cutFor(b,key){
  const rule={nog:b.e===-1&&"n",nod:b.e===1&&"n",chi:b.kind==="nasal"&&"c",big:b.t===-1&&"t",bid:b.t===1&&"t",rtg:b.t===-1&&"r",v1g:b.t===-1&&"v"}[key];
  if(!rule)return null;const idx=b.stg.map((s,i)=>s===rule?i:-1).filter(i=>i>=0);return idx[Math.floor(idx.length/2)]},
setLes(key){
  VIS.key=key||null;
  for(const b of VIS.bund){b.R.cut=key?VIS.cutFor(b,key):null;b.R.build()}
  if(!VIS.lm)VIS.lm=dot([0,0,0],.34,"#e11d2e",9);
  const LP={nog:[-1.0,-3.2,3.6],nod:[1.0,-3.2,3.6],chi:[0,-2.6,1.9],big:[-1.0,-2.5,.9],bid:[1.0,-2.5,.9],rtg:[-4.6,.2,-3.4],v1g:[-1.4,1.1,-8.9]};
  VIS.lm.visible=!!key;if(key)VIS.lm.position.copy(P(LP[key]));
  VIS.render();
},
tick(dt,t){VIS.bund.forEach(b=>b.R.tick(dt));if(VIS.lm&&VIS.lm.visible){const k=1+.25*Math.sin(t*6);VIS.lm.scale.set(k,k,k)}},
field(){
  const L=C.VIS.les.find(l=>l.k===VIS.key),lost={nog:["all",null],nod:[null,"all"],chi:["left","right"],big:["right","right"],bid:["left","left"],rtg:["uright","uright"],v1g:["right","right"]}[VIS.key]||[null,null];
  const cv=$("#vf");if(!cv)return;const g=cv.getContext("2d");g.clearRect(0,0,340,170);
  [["Œil gauche",85,lost[0]],["Œil droit",255,lost[1]]].forEach(([nm,cx,ls])=>{
    const cy=88,r=62;g.save();g.beginPath();g.arc(cx,cy,r,0,7);g.clip();g.fillStyle="#fffdf0";g.fillRect(cx-r,cy-r,2*r,2*r);
    g.fillStyle="#2b2f3a";
    if(ls==="all")g.fillRect(cx-r,cy-r,2*r,2*r);
    if(ls==="left")g.fillRect(cx-r,cy-r,r,2*r);
    if(ls==="right")g.fillRect(cx,cy-r,r,2*r);
    if(ls==="uright")g.fillRect(cx,cy-r,r,r);
    if(VIS.key==="v1g"){g.fillStyle="#fffdf0";g.beginPath();g.arc(cx,cy,14,0,7);g.fill()}
    g.restore();g.strokeStyle="#9aa3b5";g.lineWidth=1.5;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
    g.beginPath();g.moveTo(cx-r,cy);g.lineTo(cx+r,cy);g.moveTo(cx,cy-r);g.lineTo(cx,cy+r);g.strokeStyle="#cfd5e2";g.stroke();
    g.fillStyle="#27303f";g.font="700 12px Nunito,sans-serif";g.textAlign="center";g.fillText(nm,cx,16);
    g.fillStyle="#d4382c";g.beginPath();g.arc(cx,cy,3,0,7);g.fill()});
},
render(){
  const V0=C.VIS;
  let h=`<div class="pills">${[["motrice","Motrice"],["lemn","Lemniscale"],["spino","Spino-thalamique"],["vis","Visuelle"]].map(x=>chip("vpath",x[0],x[1],x[0]==="vis")).join("")}</div>`;
  h+=`<h2>Voies visuelles</h2><p class="sub">Bleu : œil gauche · orange : œil droit. Les fibres nasales croisent au chiasma.</p>`;
  h+=`<canvas id="vf" class="field" width="340" height="170"></canvas><p class="hint" style="text-align:center;margin:0 0 6px">Champ visuel : zones sombres = déficit</p>`;
  h+=`<h3>Où est la lésion ?</h3><div class="pills">${chip("vlesx","",V0.les.length?"Voie intacte":"",!VIS.key)}${V0.les.map(l=>chip("vlesx",l.k,l.l,VIS.key===l.k,"red")).join("")}</div>`;
  if(VIS.key){const l=V0.les.find(x=>x.k===VIS.key);h+=`<div class="card bad">${src("Conséquence · "+l.s)}${l.tx}</div>`}
  h+=`<h3>Trajet</h3><ol class="steps">${V0.steps.map((s,i)=>`<li class="${i===VIS.sel?"on":""}" data-a="vgo" data-v="${i}"><i>${i+1}</i><div><b>${s.t}</b>${i===VIS.sel?`<span>${s.d}</span>`:""}</div></li>`).join("")}</ol>`;
  panel.innerHTML=h;VIS.field();
}};
ACT.vlesx=v=>VIS.setLes(v);ACT.vgo=v=>VIS.go(+v);
const VOIES={enter(){VOIES.set("motrice")},
set(id){if(id==="vis")VIS.enter();else PM.load(C.PATHS.find(p=>p.id===id),false);curId="voies";VOIES.cur=id}};
const LCSM={enter(){PM.load(C.LCS,true)}};

/* =========================================================
   4. NERFS CRÂNIENS
   ========================================================= */
const NC={sel:null,filt:"all",nuc:[],nerves:[],
enter(){
  reset();cur=NC;N3.setHemiOpacity(.35);N3.setBsOpacity(.5);N3.deep.group.visible=false;
  ctrlBuild({op:.35,cut:9,extra:`<label><input type="checkbox" id="c_nuc" checked> Noyaux</label>`});
  $("#c_nuc").onchange=e=>NC.nuc.forEach(n=>n.m.visible=e.target.checked);
  NC.nerves=[];NC.nuc=[];
  for(const n of C.NC){
    const col=C.NC_COL[n.type],ms=[];
    for(const s of [-1,1]){
      let m;
      if(n.n==="I"){m=N3.tubeFrom([V(s*.95,-2.35,4.0),V(s*.92,-2.4,5.4),V(s*.9,-2.4,6.6)],.12,col,{roughness:.4});
        const b=N3.ell([s*.9,-2.4,6.7],[.45,.32,.6],col);b.userData={sid:"nc",n:n.n};G.add(b);ms.push(b)}
      else if(n.pts){m=N3.tubeFrom(n.pts.map(p=>V(p[0]*s,p[1],p[2])),.11,col,{roughness:.4})}
      else{const S=bs(n.bsp[0]*s,n.bsp[1],n.bsp[2]),d=V(n.dir[0]*s,n.dir[1],n.dir[2]).normalize();
        const E=S.clone().addScaledVector(d,n.L);
        m=N3.tubeFrom([S,S.clone().addScaledVector(d,n.L*.5).add(V(0,-.15,0)),E],.075,col,{roughness:.4});n.end=n.end||[];n.end[s>0?1:0]=E}
      m.userData={sid:"nc",n:n.n};G.add(m);ms.push(m);
    }
    NC.nerves.push({n,ms,col});
    N3.addLabel(n.n,()=>{if(n.n==="I")return V(-.9,-2.4,6.9);if(n.pts)return V(-n.pts[3][0],n.pts[3][1],n.pts[3][2]);return n.end[0].clone()},"",()=>NC.pick(n.n));
  }
  for(const [nm,pos] of C.NC_NUC)for(const s of [-1,1]){
    const nn=C.NC.find(x=>x.n===nm),m=dot(bs(pos[0]*s,pos[1],pos[2]),.17,C.NC_COL[nn.type],5);
    NC.nuc.push({n:nm,m,s})}
  N3.pickables=()=>NC.nerves.flatMap(x=>x.ms);N3.onPick=(id,h)=>{if(id==="nc")NC.pick(h.object.userData.n)};
  N3.view("base");NC.sel=null;NC.render();
},
pick(n){
  NC.sel=n;
  for(const x of NC.nerves)for(const m of x.ms){const on=x.n.n===n;m.material.emissive.set(on?"#ffffff":"#000000");m.material.emissiveIntensity=on?.55:0;
    const vis=NC.filt==="all"||x.n.type===NC.filt;m.visible=vis||on}
  NC.nuc.forEach(u=>{const on=u.n===n||(n==="V"&&u.n==="V");u.m.scale.setScalar(on?2:1)});
  const o=NC.nerves.find(x=>x.n.n===n);if(o&&o.n.end)N3.flyTo([-11,-6,6],o.n.end[0].toArray(),.9);
  NC.render();
},
render(){
  const n=NC.sel&&C.NC.find(x=>x.n===NC.sel);
  let h=`<h2>Nerfs crâniens</h2><p class="sub">12 paires : clique sur un nerf (ou son numéro) dans la vue du dessous.</p>`;
  h+=`<div class="pills">${chip("nfilt","all","Tous",NC.filt==="all")}${["sens","mot","mixte"].map(t=>`<button class="chip" data-a="nfilt" data-v="${t}" aria-pressed="${NC.filt===t}" style="border-left:8px solid ${C.NC_COL[t]}">${C.NC_TYPE[t]}</button>`).join("")}</div>`;
  h+=`<div class="pills">${C.NC.map(x=>`<button class="chip" data-a="npick" data-v="${x.n}" aria-pressed="${NC.sel===x.n}" style="border-bottom:4px solid ${C.NC_COL[x.type]}">${x.n}</button>`).join("")}</div>`;
  if(n){
    h+=`<div class="card" style="border-left:6px solid ${C.NC_COL[n.type]}"><h3 style="margin:0 0 6px;color:var(--ink);text-transform:none;font-size:1.05rem;letter-spacing:0">${n.n} · ${n.nom}</h3><p><b>${C.NC_TYPE[n.type]}</b> · ${n.etage}</p><p><b>Origine apparente :</b> ${n.orig}</p>${n.noy?`<p><b>Noyau :</b> ${n.noy}</p>`:""}<p><b>Fonction :</b> ${n.fn}</p></div>`;
    h+=`<div class="card warn">${src("Clinique")}${n.cl}</div>`;
    if(n.n==="VII")h+=`<div class="card tip">${src("À retenir")}Paralysie faciale périphérique : tout l'hémivisage (front compris). Centrale : le front est épargné, car la partie haute du noyau reçoit une innervation corticale bilatérale.</div>`;
  }else h+=`<div class="card tip">Astuce : les noyaux (petites billes) sont dans le tronc cérébral ; ils s'agrandissent quand tu choisis le nerf.</div>`;
  panel.innerHTML=h;
}};
ACT.npick=v=>NC.pick(v);
ACT.nfilt=v=>{NC.filt=v;NC.pick(NC.sel)};

/* =========================================================
   5. QUIZ
   ========================================================= */
const QA=[["lobe0","le lobe frontal"],["lobe1","le lobe pariétal"],["lobe2","le lobe temporal"],["lobe3","le lobe occipital"],["neo","un hémisphère cérébelleux"],["vermis","le vermis du cervelet"],["bs0","le mésencéphale"],["bs1","le pont (protubérance)"],["bs2","le bulbe rachidien"],["bs3","la moelle épinière"],["thalamus","le thalamus"],["caude","le noyau caudé"],["lenticulaire","le putamen"],["capsule","la capsule interne"],["hippocampe","l'hippocampe"],["calleux","le corps calleux"]];
const QW=[["ica","la carotide interne"],["aca","l'artère cérébrale antérieure (ACA)"],["acm","le tronc de l'artère cérébrale moyenne (ACM)"],["acp","l'artère cérébrale postérieure (ACP)"],["bas","le tronc basilaire"],["vert","l'artère vertébrale"],["pica","la PICA"],["acomp","l'artère communicante postérieure"],["acom","l'artère communicante antérieure"],["ophth","l'artère ophtalmique"]];
const QZ={mode:null,i:0,score:0,list:[],ans:null,
best:store.get("n3best",{anat:0,art:0,cas:0}),
menu(){
  if(cur!==QZ){reset();cur=QZ}
  QZ.mode=null;ctrlBuild({op:1,cut:9});N3.setHemiMode("neutral");N3.setHemiOpacity(1);N3.view("lat");N3.pickables=()=>[];N3.onPick=null;
  panel.innerHTML=`<h2>Quiz</h2><p class="sub">Teste-toi sur le cerveau 3D et sur des cas cliniques.</p>
  <button class="opt" data-a="qstart" data-v="anat"><b>Structures 3D</b><br><span class="hint">10 questions : clique sur la bonne structure. Meilleur : ${QZ.best.anat}/10</span></button>
  <button class="opt" data-a="qstart" data-v="art"><b>Artères (Willis)</b><br><span class="hint">10 questions : retrouve l'artère dans la vue du dessous. Meilleur : ${QZ.best.art}/10</span></button>
  <button class="opt" data-a="qstart" data-v="cas"><b>Cas cliniques</b><br><span class="hint">${C.QZ.length} questions de type CEN, avec bouton « Voir en 3D ». Meilleur : ${QZ.best.cas}/${C.QZ.length}</span></button>`;
},
enter(){QZ.menu()},
start(mode){
  QZ.mode=mode;QZ.i=0;QZ.score=0;QZ.ans=null;
  if(mode==="anat")QZ.list=shuffle(QA).slice(0,10);
  else if(mode==="art")QZ.list=shuffle(QW);
  else QZ.list=shuffle(C.QZ).map(q=>{const idx=shuffle(q.o.map((t,k)=>k));return Object.assign({},q,{o:idx.map(k=>q.o[k]),a:idx.indexOf(q.a)})});
  QZ.ask();
},
ask(){
  QZ.ans=null;const q=QZ.list[QZ.i];N3.clearLabels();N3.labelsVisible=true;
  if(QZ.mode==="anat"){
    reset();cur=QZ;ctrlBuild({op:1,cut:9});
    N3.setHemiMode("neutral");N3.setHemiOpacity(/^lobe/.test(q[0])?1:.12);N3.pickables=brainPick;
    N3.onPick=id=>{if(id&&QZ.ans===null)QZ.check(id)};N3.view(/^lobe3|neo|vermis/.test(q[0])?"post":"lat");
  }else if(QZ.mode==="art"){
    if(QZ.i===0){reset();cur=QZ;N3.setHemiOpacity(.25);N3.setBsOpacity(.6);N3.deep.setOpacity(.3);ctrlBuild({op:.25,cut:9});VASC.occ["-1"].clear();VASC.occ["1"].clear();VASC.occ["0"].clear();VASC.build(false);N3.view("base")}
    N3.setHemiMode("terr");
    N3.pickables=()=>VASC.inst.flatMap(i=>i.meshes);
    N3.onPick=(id,h)=>{if(id==="art"&&QZ.ans===null)QZ.check(h.object.userData.aid)};
  }
  QZ.render();
},
check(id){
  const q=QZ.list[QZ.i];QZ.ans=id;const ok=id===q[0];if(ok)QZ.score++;
  if(!ok){const p=posOf(q[0]);
    if(QZ.mode==="anat"){if(/^lobe/.test(q[0]))N3.setHemiMode("lobes",{lobeSel:+q[0][4]});else{glow(N3.deep.items[q[0]]||[],true);if(q[0]==="neo")glow(cer.neo,true);if(q[0]==="vermis")glow([cer.vermis],true)}
      N3.addLabel("← "+q[1].replace(/^(le |la |l'|un )/,""),p,"red")}}
  QZ.render();
},
tick(dt,t){if(QZ.mode==="art")VASC.tick(dt,t)},
nameOf(id){const f=(QZ.mode==="anat"?QA:QW).find(x=>x[0]===id);return f?f[1]:id},
render(){
  if(!QZ.mode)return QZ.menu();
  const q=QZ.list[QZ.i],N=QZ.mode==="art"?10:QZ.list.length;
  if(QZ.i>=N)return QZ.end();
  let h=`<h2>Quiz</h2><p class="sub">Question ${QZ.i+1} / ${N} · score <span class="score">${QZ.score}</span></p>`;
  if(QZ.mode==="cas"){
    h+=`<div class="card"><b>${q.q}</b></div>`;
    q.o.forEach((t,k)=>{const st=QZ.ans===null?"":(k===q.a?"ok":(k===QZ.ans?"ko":""));h+=`<button class="opt ${st}" ${QZ.ans!==null?"disabled":""} data-a="qcas" data-v="${k}">${t}</button>`});
    if(QZ.ans!==null){h+=`<div class="card ${QZ.ans===q.a?"good":"bad"}">${src((QZ.ans===q.a?"Juste":"Faux")+" · "+q.src)}${q.e}</div>`;
      h+=`<div class="row"><button class="btn" data-a="q3d">Voir en 3D</button><button class="btn primary" data-a="qnext">Suivant</button></div>`}
  }else{
    h+=`<div class="card tip"><b>Clique sur ${q[1]}</b></div>`;
    if(QZ.ans!==null){const ok=QZ.ans===q[0];
      h+=`<div class="card ${ok?"good":"bad"}">${ok?"Bien vu !":"Raté : tu as cliqué sur "+QZ.nameOf(QZ.ans)+"."}${ok?"":" La bonne réponse est indiquée en 3D."}</div>`;
      h+=`<div class="row"><button class="btn primary" data-a="qnext">Suivant</button></div>`}
    else h+=`<div class="row"><button class="btn" data-a="qskip">Passer</button></div><p class="hint">${QZ.mode==="anat"?"Pour les structures profondes, le cortex devient transparent.":"Vue du dessous : fais tourner le cerveau si besoin."}</p>`;
  }
  panel.innerHTML=h;
},
end(){
  const N=QZ.mode==="art"?10:QZ.list.length;
  if(QZ.score>QZ.best[QZ.mode]){QZ.best[QZ.mode]=QZ.score;store.set("n3best",QZ.best)}
  panel.innerHTML=`<h2>Terminé</h2><div class="card ${QZ.score>=N*.7?"good":"warn"}"><b style="font-size:1.4rem">${QZ.score} / ${N}</b><br>${QZ.score>=N*.8?"Très solide.":QZ.score>=N*.5?"Pas mal, encore un peu de pratique.":"À retravailler : refais un tour dans les modules."}</div>
  <div class="row"><button class="btn primary" data-a="qstart" data-v="${QZ.mode}">Rejouer</button><button class="btn" data-a="qmenu">Menu</button></div>`;
}};
ACT.qstart=v=>QZ.start(v);ACT.qmenu=()=>QZ.menu();
ACT.qcas=v=>{const q=QZ.list[QZ.i];QZ.ans=+v;if(+v===q.a)QZ.score++;QZ.render()};
ACT.qnext=()=>{QZ.i++;if(QZ.mode==="cas"||QZ.i>=(QZ.mode==="art"?10:QZ.list.length))QZ.render();else QZ.ask()};
ACT.qskip=()=>{QZ.i++;QZ.ask()};
ACT.q3d=()=>{const g=QZ.list[QZ.i].go;if(!g)return;setMod(g.mod);
  if(g.mod==="vasc"){VASC.select(g.id,-1);if(!ART(g.id).mid){VASC.side=-1}VASC.occ["-1"].clear();VASC.occ["0"].clear();VASC.occ["1"].clear();const a=ART(g.id);(a.mid?VASC.occ["0"]:VASC.occ["-1"]).add(g.id);VASC.refresh()}
  else if(g.mod==="voies"){VOIES.set(g.path);if(g.path==="vis")VIS.setLes(g.les);else if(g.les!==undefined)PM.setLes(g.les)}
  else if(g.mod==="lcs"){PM.setLes(g.les)}};

/* ---------- onglets ---------- */
const MODS={anat:[ANAT,"Anatomie"],vasc:[VASC,"Vascularisation"],voies:[VOIES,"Voies"],nc:[NC,"Nerfs crâniens"],lcs:[LCSM,"LCS"],quiz:[QZ,"Quiz"]};
tabsEl.innerHTML=Object.entries(MODS).map(([k,v])=>`<button class="tab" data-a="mod" data-v="${k}" aria-pressed="false">${v[1]}</button>`).join("");
function setMod(k){
  if(!MODS[k])k="anat";
  tabsEl.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===k));
  try{history.replaceState(null,"","#"+k)}catch(e){}
  curId=k;MODS[k][0].enter();
}
let curId="";
ACT.mod=v=>setMod(v);
window.N3app={setMod,PM,VASC,VIS,NC,QZ,ANAT};
N3.start();
setTimeout(()=>{N3.resize();setMod((location.hash||"#anat").slice(1))},30);
})();
