/* Neuro 3D — scène : cerveau schématique (procédural), cervelet, tronc, noyaux, caméra, étiquettes */
(function(){
const T=THREE;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const TH=0.35, O=V(0,-0.5,-0.9);
const DIR=V(0,-Math.cos(TH),-Math.sin(TH)), ANT=V(0,-Math.sin(TH),Math.cos(TH));
function bs(x,t,a){return O.clone().add(V(x,0,0)).addScaledVector(DIR,t).addScaledVector(ANT,a)}
const N3=window.N3={T,V,bs,TH,O};

/* ---------- renderer, caméra, lumières ---------- */
const stage=document.getElementById("stage");
const renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.setClearColor(0x13213d);
renderer.localClippingEnabled=true;
stage.appendChild(renderer.domElement);
const scene=new T.Scene();
scene.fog=new T.Fog(0x13213d,38,90);
const camera=new T.PerspectiveCamera(38,1,0.1,200);
camera.position.set(-22,6,14);
const controls=new T.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.08;controls.target.set(0,-1,-1);controls.minDistance=5;controls.maxDistance=60;
scene.add(new T.HemisphereLight(0xdfe9ff,0x2a2f45,.9));
const dl=new T.DirectionalLight(0xffffff,.85);dl.position.set(-10,16,14);scene.add(dl);
const dl2=new T.DirectionalLight(0x9fb8ff,.35);dl2.position.set(12,-6,-10);scene.add(dl2);
N3.scene=scene;N3.camera=camera;N3.controls=controls;N3.renderer=renderer;N3.stage=stage;
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
window.addEventListener("resize",resize);N3.resize=resize;

/* ---------- utilitaires ---------- */
const clipPlane=new T.Plane(V(-1,0,0),9);N3.clip=clipPlane;
function mat(color,o){return new T.MeshStandardMaterial(Object.assign({color,roughness:.55,metalness:.04},o||{}))}
function tubeFrom(pts,r,color,o,seg){const c=new T.CatmullRomCurve3(pts.map(p=>p.isVector3?p:V(p[0],p[1],p[2])));
  const g=new T.TubeGeometry(c,seg||Math.max(30,pts.length*16),r,12,false);const m=new T.Mesh(g,mat(color,o));m.userData.curve=c;return m}
function ell(c,r,color,o){const m=new T.Mesh(new T.SphereGeometry(1,40,28),mat(color,o));m.scale.set(r[0],r[1],r[2]);m.position.set(c[0],c[1],c[2]);return m}
N3.mat=mat;N3.tubeFrom=tubeFrom;N3.ell=ell;
const hex=h=>new T.Color(h);

/* ---------- hémisphères ---------- */
const LOBE_COL=["#ea8672","#79b6e6","#8cd08a","#e8c45c"].map(hex);   // frontal, pariétal, temporal, occipital
const TERR_COL=["#ee7f9a","#f3b84c","#4fb8b1"].map(hex);            // ACA, ACM, ACP
const NEUTRAL=hex("#d09d97");
function hsh(i,j,k){let h=Math.imul(i,73856093)^Math.imul(j,19349663)^Math.imul(k,83492791);h=Math.imul(h^(h>>>15),0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return ((h>>>0)/4294967295)*2-1}
function vn(x,y,z){const i=Math.floor(x),j=Math.floor(y),k=Math.floor(z),fx=x-i,fy=y-j,fz=z-k,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);
  const L=(a,b,t)=>a+(b-a)*t;
  return L(L(L(hsh(i,j,k),hsh(i+1,j,k),u),L(hsh(i,j+1,k),hsh(i+1,j+1,k),u),v),L(L(hsh(i,j,k+1),hsh(i+1,j,k+1),u),L(hsh(i,j+1,k+1),hsh(i+1,j+1,k+1),u),v),w)}
const sst=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
function makeHemi(side){
  const g=new T.SphereGeometry(1,230,170),p=g.attributes.position,n=p.count;
  const lobe=new Uint8Array(n),terr=new Uint8Array(n),shade=new Float32Array(n);
  const off=side>0?0:31.7;
  for(let i=0;i<n;i++){
    const ux=p.getX(i),uy=p.getY(i),uz=p.getZ(i);
    const ul=ux<0?-Math.pow(-ux,.6):ux;
    const lx=ul>=0?ul*3.6:ul*3.0, nar=1-.2*Math.pow(Math.max(uz,0),2);
    let x=side*(3.1+lx*nar), y=.6+(uy>=0?uy*3.9:uy*4.3), z=uz*8.25;
    // base plus aplatie, pole frontal plus étroit, lobe occipital effilé
    {const dy=Math.max(0,-1.2-y);y+=.42*dy*Math.min(1,dy/1.6)}
    const lat=sst(-.1,.55,ux);                       // 0 face médiale, 1 face latérale
    // sillon latéral (Sylvius)
    const ysy=-.9-.3*z+.02*z*z, wsy=Math.exp(-Math.pow((y-ysy)/.32,2))*lat*sst(-6.3,-3.5,z)*(1-sst(3.2,4.6,z));
    // sillon central (Rolando)
    const zc=1.1-.32*(y-2.2), wce=Math.exp(-Math.pow((z-zc)/.2,2))*sst(1,2.6,y)*sst(-.1,.45,ux)*(1-sst(4.5,5.1,y));
    // réseau de sillons secondaires
    const X=x+off,nz=vn(X*.8,y*.8,z*.8)*.62+vn(X*1.6+9,y*1.6,z*1.6)*.3+vn(X*3.2,y*3.2+4,z*3.2)*.12;
    let gr=Math.exp(-nz*nz/.02)*(.25+.75*lat);
    gr=Math.max(gr*(1-.7*wsy),wsy*.9,wce);
    const d=-.3*gr+.09*(1-gr)-.22*wce;
    const dirx=side*ul,L=Math.hypot(dirx,uy,uz)||1;
    x+=dirx/L*d;y+=uy/L*d;z+=uz/L*d;
    // lèvre inférieure du lobe temporal un peu plus bombée
    if(uy<-.2&&lat>.3&&uz<.6&&uz>-.7){y-=.25*sst(-.2,-.6,uy)}
    p.setXYZ(i,x,y,z);
    const isT=uy<(-.14-.22*uz)&&uz<.62&&uz>-.62;
    lobe[i]=isT?2:(uz>.1?0:(uz>-.5?1:3));
    terr[i]=(lobe[i]===3||(uy<-.45&&uz<.1&&uz>-.6))?2:((ux<-.2||(uy>.55&&ux<.3))?0:1);
    shade[i]=1-.55*gr+.06*(1-gr);
  }
  g.computeVertexNormals();
  g.setAttribute("color",new T.BufferAttribute(new Float32Array(n*3),3));
  const m=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.62,metalness:0,side:T.DoubleSide,transparent:true,opacity:1,clippingPlanes:[clipPlane]}));
  m.userData={lobe,terr,side,n,shade};return m;
}
const hemiL=makeHemi(-1),hemiR=makeHemi(1);
hemiL.renderOrder=hemiR.renderOrder=5;
scene.add(hemiL,hemiR);
N3.hemis=[hemiL,hemiR];
const hemiState={mode:"neutral",lobeSel:-1,terrL:[0,0,0],terrR:[0,0,0],terrHi:-1,opacity:1};
function paintHemis(){
  for(const h of N3.hemis){
    const {lobe,terr,n,shade}=h.userData,c=h.geometry.attributes.color;
    for(let i=0;i<n;i++){
      let col;
      if(hemiState.mode==="lobes"){col=LOBE_COL[lobe[i]].clone();if(hemiState.lobeSel>=0&&lobe[i]!==hemiState.lobeSel)col.lerp(hex("#8a8f9c"),.7)}
      else if(hemiState.mode==="terr"){const k=terr[i];col=TERR_COL[k].clone();const lv=(h.userData.side<0?hemiState.terrL:hemiState.terrR)[k];if(lv>0)col.lerp(hex("#3a0f1f"),Math.min(1,lv)*.85);else if(hemiState.terrHi===k)col.lerp(hex("#ffffff"),.25)}
      else col=NEUTRAL.clone();
      {const sh=shade[i];c.setXYZ(i,col.r*sh,col.g*sh,col.b*sh)};
    }
    c.needsUpdate=true;
  }
}
N3.setHemiMode=(mode,opt)=>{hemiState.mode=mode;Object.assign(hemiState,opt||{});paintHemis()};
N3.hemiState=hemiState;N3.paintHemis=paintHemis;
N3.setHemiOpacity=o=>{hemiState.opacity=o;for(const h of N3.hemis){h.material.opacity=o;h.material.depthWrite=o>.97}};
N3.setCut=c=>{clipPlane.constant=c};

/* ---------- cervelet ---------- */
function cereb(c,r,color,folia){
  const g=new T.SphereGeometry(1,64,48),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i)*r[0],y=p.getY(i)*r[1],z=p.getZ(i)*r[2];
    const f=folia?.07*Math.sin(21*(y+z*.4)):0, L=Math.hypot(p.getX(i),p.getY(i),p.getZ(i))||1;
    p.setXYZ(i,x+p.getX(i)/L*f,y+p.getY(i)/L*f,z+p.getZ(i)/L*f)}
  g.computeVertexNormals();
  const m=new T.Mesh(g,mat(color,{roughness:.8}));m.position.set(c[0],c[1],c[2]);return m;
}
const cerebGroup=new T.Group();scene.add(cerebGroup);
const neoL=cereb([-2.5,-4.0,-5.8],[2.1,1.5,2.3],"#d5a46f",true),neoR=cereb([2.5,-4.0,-5.8],[2.1,1.5,2.3],"#d5a46f",true);
const vermis=cereb([0,-3.9,-6.1],[.9,1.45,2.2],"#c9824f",true);
const nodL=cereb([0,-4.95,-4.4],[.5,.45,.5],"#9b6bd1",false);
const floL=cereb([-2.65,-4.6,-3.6],[.62,.46,.62],"#9b6bd1",false),floR=cereb([2.65,-4.6,-3.6],[.62,.46,.62],"#9b6bd1",false);
cerebGroup.add(neoL,neoR,vermis,nodL,floL,floR);
const ped=[];
for(const s of [-1,1]){
  ped.push(tubeFrom([bs(s*.55,2.1,-.5),bs(s*.9,1.2,-1.4),V(s*1.5,-3.1,-4.4)],.26,"#e0a458"));
  ped.push(tubeFrom([bs(s*1.45,3.0,.1),V(s*2.2,-3.7,-3.4),V(s*2.5,-3.9,-4.3)],.55,"#58a6e0"));
  ped.push(tubeFrom([bs(s*.7,5.0,-.4),V(s*1.3,-5.2,-3.0),V(s*1.8,-4.9,-4.4)],.3,"#8fd18b"));
}
ped.forEach(m=>cerebGroup.add(m));
N3.cereb={group:cerebGroup,neo:[neoL,neoR],vermis,archeo:[nodL,floL,floR],ped};

/* ---------- tronc cérébral + moelle ---------- */
const bsGroup=new T.Group();bsGroup.position.copy(O);bsGroup.rotation.x=TH;scene.add(bsGroup);
const prof=[[0.001,0],[.95,0],[.9,.6],[.85,1.2],[1.0,1.8],[1.4,2.3],[1.68,2.8],[1.7,3.3],[1.55,3.9],[1.1,4.3],[1.02,4.8],[1.0,5.3],[.82,6.0],[.62,6.8],[.52,8],[.5,14],[.001,14]];
const sp=new T.SplineCurve(prof.map(a=>new T.Vector2(a[0],-a[1])));
const pts2=sp.getPoints(150).map(v=>new T.Vector2(Math.max(v.x,0.001),v.y));
const lg=new T.LatheGeometry(pts2,56);lg.scale(1,1,.9);
const lc=new Float32Array(lg.attributes.position.count*3);
const REG=[["mésencéphale",1.8,"#f2a65a"],["pont",4.3,"#7aa7e8"],["bulbe",6.5,"#8fd18b"],["moelle",99,"#f0d98a"]];
const regOf=t=>{for(let i=0;i<REG.length;i++)if(t<REG[i][1])return i;return 3};
for(let i=0;i<lg.attributes.position.count;i++){const t=-lg.attributes.position.getY(i);const c=hex(REG[regOf(t)][2]);lc[i*3]=c.r;lc[i*3+1]=c.g;lc[i*3+2]=c.b}
lg.setAttribute("color",new T.BufferAttribute(lc,3));
const bsMesh=new T.Mesh(lg,new T.MeshStandardMaterial({vertexColors:true,roughness:.6,transparent:true,opacity:1,side:T.DoubleSide}));
bsMesh.userData.regOf=regOf;bsMesh.userData.REG=REG;
bsGroup.add(bsMesh);

const bsDeco=[];
(function(){
  const Mc=(c)=>new T.MeshStandardMaterial({color:c,roughness:.6,transparent:true,opacity:1});
  const put=(m)=>{bsGroup.add(m);bsDeco.push(m);return m};
  for(const sx of [-1,1]){
    const py=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(sx*.42,-4.4,.82),new T.Vector3(sx*.3,-5.4,.9),new T.Vector3(sx*.14,-6.7,.62)]),24,.2,10),Mc("#a6dca2"));put(py);
    const ol=new T.Mesh(new T.SphereGeometry(1,20,16),Mc("#7fc47c"));ol.scale.set(.32,.7,.3);ol.position.set(sx*.82,-5.2,.28);put(ol);
    const sc=new T.Mesh(new T.SphereGeometry(.3,16,12),Mc("#f2a65a"));sc.position.set(sx*.36,-.7,-.98);put(sc);
    const ic=new T.Mesh(new T.SphereGeometry(.27,16,12),Mc("#e8944a"));ic.position.set(sx*.34,-1.5,-.95);put(ic);
    const cp=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(sx*.55,-1.7,.55),new T.Vector3(sx*.95,-.6,.5),new T.Vector3(sx*1.6,.9,.2)]),20,.42,10),Mc("#f2a65a"));put(cp);
    const mb=new T.Mesh(new T.SphereGeometry(.2,12,10),Mc("#f3e3b0"));mb.position.set(sx*.28,-1.0,1.12);put(mb);
  }
})();
N3.bstem={group:bsGroup,mesh:bsMesh,REG};
N3.setBsOpacity=o=>{bsMesh.material.opacity=o;bsMesh.material.depthWrite=o>.97;bsDeco.forEach(m=>{m.material.opacity=o;m.material.depthWrite=o>.97})};

/* ---------- noyaux gris, corps calleux, capsule, hippocampe ---------- */
const deep=new T.Group();scene.add(deep);N3.deep={group:deep,items:{}};
function add(id,m,both){deep.add(m);(N3.deep.items[id]=N3.deep.items[id]||[]).push(m);m.userData.sid=id;return m}
for(const s of [-1,1]){
  add("thalamus",ell([s*1.25,.6,-.5],[1.0,.85,1.4],"#e6a77a"));
  add("caude",ell([s*1.95,2.3,1.9],[.8,.8,.95],"#7bc4a8"));
  add("caude",tubeFrom([V(s*2.2,2.6,.6),V(s*2.5,2.8,-1.4),V(s*3.2,1.6,-2.8),V(s*4.0,-.4,-2.2),V(s*4.2,-1.8,-.4)],.2,"#7bc4a8"));
  add("lenticulaire",ell([s*3.4,.6,.5],[.8,1.2,1.7],"#e58f9f"));
  add("pallidum",ell([s*2.75,.55,.45],[.5,.8,1.0],"#d1596f"));
  add("hippocampe",tubeFrom([V(s*3.6,-2.3,.9),V(s*4.3,-2.4,-.6),V(s*3.9,-1.9,-2.4),V(s*2.9,-.8,-3.7)],.24,"#a58bd6"));
  add("amygdale",ell([s*3.7,-2.4,1.2],[.55,.5,.55],"#a58bd6"));
  const cap=new T.Group();
  const post=new T.Mesh(new T.SphereGeometry(1,28,20),mat("#f2e2a0",{transparent:true,opacity:.85}));post.scale.set(.26,1.1,1.2);post.position.set(s*2.45,.9,-.55);post.rotation.y=s*.35;cap.add(post);
  const gen=new T.Mesh(new T.SphereGeometry(1,28,20),mat("#f2e2a0",{transparent:true,opacity:.85}));gen.scale.set(.26,.95,.5);gen.position.set(s*1.95,1.2,1.05);gen.rotation.y=-s*.4;cap.add(gen);
  const ant=new T.Mesh(new T.SphereGeometry(1,28,20),mat("#f2e2a0",{transparent:true,opacity:.85}));ant.scale.set(.26,.95,.8);ant.position.set(s*2.4,1.5,2.2);ant.rotation.y=s*.55;cap.add(ant);
  cap.traverse(o=>{if(o.isMesh)o.userData.sid="capsule"});deep.add(cap);(N3.deep.items.capsule=N3.deep.items.capsule||[]).push(post,gen,ant);
}
const cc=tubeFrom([V(0,1.4,-3.3),V(0,2.8,-2.0),V(0,3.4,.3),V(0,3.0,2.4),V(0,1.9,3.5)],.38,"#f4f0e6");cc.scale.x=9;
add("calleux",cc);
N3.deep.setOpacity=o=>{deep.traverse(m=>{if(m.isMesh){m.material.transparent=o<1||m.material.opacity<1;if(m.userData.baseOp===undefined)m.userData.baseOp=m.material.opacity;m.material.opacity=Math.min(1,m.userData.baseOp)*(o<1?o:1)}})};

/* ---------- étiquettes (DOM) ---------- */
const labelLayer=document.getElementById("labels");
const labels=[];
N3.clearLabels=()=>{labels.forEach(l=>l.el.remove());labels.length=0};
N3.addLabel=(text,getPos,cls,onclick)=>{
  const el=document.createElement("div");el.className="lbl"+(cls?" "+cls:"");el.textContent=text;labelLayer.appendChild(el);
  if(onclick){el.classList.add("click");el.addEventListener("click",ev=>{ev.stopPropagation();onclick()})}
  const l={el,getPos:typeof getPos==="function"?getPos:()=>getPos,on:true};labels.push(l);return l};
N3.labelsVisible=true;
const tmp=V(0,0,0);
function updateLabels(){
  const w=stage.clientWidth,h=stage.clientHeight;
  for(const l of labels){
    if(!N3.labelsVisible||!l.on){l.el.style.display="none";continue}
    tmp.copy(l.getPos()).project(camera);
    if(tmp.z>1||tmp.z<-1){l.el.style.display="none";continue}
    l.el.style.display="";l.el.style.transform=`translate(-50%,-120%) translate(${(tmp.x*.5+.5)*w}px,${(-tmp.y*.5+.5)*h}px)`;
  }
}

/* ---------- caméra : transitions ---------- */
let tw=null;
N3.flyTo=(pos,tgt,dur)=>{tw={t:0,dur:dur||.9,p0:camera.position.clone(),t0:controls.target.clone(),p1:V(...pos),t1:V(...tgt)}};
N3.view=(name)=>{const v={
  lat:[[-24,5,8],[0,-1,-1]],front:[[0,3,26],[0,-1,-1]],base:[[0,-26,6],[0,-3,-1]],top:[[0,28,.5],[0,0,-1]],
  post:[[0,2,-26],[0,-2,-3]],trunk:[[-9,-5,9],[0,-4,-2]],right:[[24,5,8],[0,-1,-1]]}[name];if(v)N3.flyTo(v[0],v[1])};

/* ---------- boucle ---------- */
const hooks=[];N3.onFrame=f=>hooks.push(f);
let last=performance.now();N3.auto=false;
function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(tw){tw.t+=dt/tw.dur;const k=Math.min(1,tw.t),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    camera.position.lerpVectors(tw.p0,tw.p1,e);controls.target.lerpVectors(tw.t0,tw.t1,e);if(k>=1)tw=null}
  if(N3.auto){const a=dt*.25,x=camera.position.x-controls.target.x,z=camera.position.z-controls.target.z;
    camera.position.x=controls.target.x+x*Math.cos(a)-z*Math.sin(a);camera.position.z=controls.target.z+x*Math.sin(a)+z*Math.cos(a)}
  hooks.forEach(f=>f(dt,now/1000));
  controls.update();renderer.render(scene,camera);updateLabels();requestAnimationFrame(loop);
}
N3.start=()=>{resize();paintHemis();requestAnimationFrame(loop)};
renderer.domElement.addEventListener("pointerdown",()=>{tw=null;N3.auto=false;if(N3.onUserMove)N3.onUserMove()});

/* ---------- sélection par clic ---------- */
const ray=new T.Raycaster(),mouse=new T.Vector2();
N3.pickables=()=>[];N3.onPick=null;
let down=null;
renderer.domElement.addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY}});
renderer.domElement.addEventListener("pointerup",e=>{
  if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;
  const r=renderer.domElement.getBoundingClientRect();
  mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(mouse,camera);
  const hits=ray.intersectObjects(N3.pickables(),false);
  for(const h of hits){ // ignorer les points coupés par le plan
    if(h.object.userData.lobe&&hemiState.opacity<.15)continue;
    let id=h.object.userData.sid,extra={};
    if(h.object.userData.lobe){const lb=h.object.userData.lobe[h.face.a];id="lobe"+lb;extra={terr:h.object.userData.terr[h.face.a]}}
    else if(h.object===bsMesh){const p=bsMesh.worldToLocal(h.point.clone());id="bs"+regOf(-p.y)}
    if(id!==undefined&&N3.onPick){N3.onPick(id,h,extra);return}
  }
  if(N3.onPick)N3.onPick(null);
});
})();
