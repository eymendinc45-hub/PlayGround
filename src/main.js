import * as THREE from 'three';

const canvas=document.querySelector('#game'), scene=new THREE.Scene();
scene.background=new THREE.Color(0x83999d);scene.fog=new THREE.FogExp2(0x7e908f,.0018);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,700);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;

const hemi=new THREE.HemisphereLight(0xd1edf4,0x48422f,1.8);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffd7a1,3.5);sun.position.set(-90,130,-40);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-140;sun.shadow.camera.right=140;sun.shadow.camera.top=140;sun.shadow.camera.bottom=-140;sun.shadow.camera.near=1;sun.shadow.camera.far=300;scene.add(sun);

const mat=(c,r=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:r?0:.05});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(330,330),mat(0x424943));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

// Roads
const roadMat=mat(0x252a29,.92);
for(let i=-140;i<=140;i+=40){
 const r=new THREE.Mesh(new THREE.PlaneGeometry(330,15),roadMat);r.rotation.x=-Math.PI/2;r.position.set(0,i,.015);r.receiveShadow=true;scene.add(r);
 const r2=new THREE.Mesh(new THREE.PlaneGeometry(15,330),roadMat);r2.rotation.x=-Math.PI/2;r2.position.set(i,0,.02);r2.receiveShadow=true;scene.add(r2);
}
const lineMat=new THREE.MeshBasicMaterial({color:0xc7bd9b});
for(let i=-140;i<=140;i+=40){
 for(let x=-150;x<150;x+=12){
  let a=new THREE.Mesh(new THREE.PlaneGeometry(5,.12),lineMat);a.rotation.x=-Math.PI/2;a.position.set(x,i,.04);scene.add(a);
  let b=new THREE.Mesh(new THREE.PlaneGeometry(.12,5),lineMat);b.rotation.x=-Math.PI/2;b.position.set(i,x,.041);scene.add(b);
 }
}

// Crosswalks
for(let x=-140;x<=140;x+=40)for(let y=-140;y<=140;y+=40){
 for(let k=-5;k<=5;k+=2){let z=new THREE.Mesh(new THREE.PlaneGeometry(.8,5),lineMat);z.rotation.x=-Math.PI/2;z.position.set(x+k,y+7,.06);scene.add(z)}
}

function building(x,z,w,d,h,accent){
 const group=new THREE.Group();group.position.set(x,0,z);
 const base=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(accent,.78));base.position.y=h/2;base.castShadow=base.receiveShadow=true;group.add(base);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.92,.45,d*.92),mat(0x343936,.55));roof.position.y=h+.22;roof.castShadow=true;group.add(roof);
 const winMat=new THREE.MeshStandardMaterial({color:0x91aaa7,emissive:0x202b28,emissiveIntensity:.3,roughness:.25,metalness:.35});
 for(let yy=3;yy<h-1;yy+=4)for(let xx=-w/2+2;xx<w/2-1;xx+=3.2){
  let win=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.8),winMat);win.position.set(xx,yy,d/2+.012);group.add(win);
 }
 scene.add(group);return group;
}
for(let gx=-120;gx<=120;gx+=40)for(let gz=-120;gz<=120;gz+=40){
 if((Math.abs(gx)<12&&Math.abs(gz)<12)||(gx===0&&gz===40)||(gx===40&&gz===0))continue;
 const w=20+(Math.abs(gx*gz)%7),d=19+(Math.abs(gx+gz)%5);
 building(gx+(gx>0?-12:12),gz+(gz>0?-12:12),w,d,14+(Math.abs(gx-gz)%28)/1.5,[0x777a74,0x696b65,0x85877f,0x666e69][Math.abs(gx+gz)%4]);
}

// Central plaza + park
const plaza=new THREE.Mesh(new THREE.CircleGeometry(12,32),mat(0x7b8078,.9));plaza.rotation.x=-Math.PI/2;plaza.position.set(0,40,.08);plaza.receiveShadow=true;scene.add(plaza);
const safe=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.8,7,8),mat(0x8b8d82));safe.position.set(0,43.5,0);safe.castShadow=true;scene.add(safe);
const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,11,12),new THREE.MeshBasicMaterial({color:0xd39251}));beacon.position.set(0,48,0);scene.add(beacon);

function tree(x,z,s=1){
 const g=new THREE.Group();g.position.set(x,0,z);
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25*s,.38*s,3*s,7),mat(0x4c3a2b));trunk.position.y=1.5*s;trunk.castShadow=true;g.add(trunk);
 const crownMat=mat(0x263b2d,.9);for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry((2-i*.35)*s,1),crownMat);c.position.set((i-1)*.8*s,3.4*s+(i%2)*.7*s,(i%2)*.5*s);c.castShadow=true;c.scale.y=.8;g.add(c)}scene.add(g);
}
for(let i=0;i<34;i++){const a=i*.22,r=12+(i%5)*2.3;tree(Math.cos(a)*r+40,Math.sin(a)*r+40,.7+(i%3)*.12)}

// Street furniture
for(let i=-120;i<=120;i+=40)for(let j=-120;j<=120;j+=40){
 if((i===0&&j===0)||(i===40&&j===40))continue;
 const lamp=new THREE.Group();lamp.position.set(i+7,j+7,0);
 const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,5,8),mat(0x262b29,.3));p.position.y=2.5;p.castShadow=true;lamp.add(p);
 const bulb=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),new THREE.MeshBasicMaterial({color:0xffd09a}));bulb.position.y=5;lamp.add(bulb);scene.add(lamp);
}

// Player
const player=new THREE.Group();scene.add(player);
const skin=mat(0x9b7358),cloth=mat(0x303a3a),pants=mat(0x24282a),shoe=mat(0x161918);
function limb(w,h,d,m){const x=new THREE.Mesh(new THREE.CapsuleGeometry(w,h,4,8),m);x.castShadow=true;return x}
const torso=limb(.48,1.15,.42,cloth);torso.position.y=2.25;player.add(torso);
const head=limb(.38,.28,.38,skin);head.position.y=3.55;player.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.39,10,8,0,Math.PI*2,0,Math.PI*.48),mat(0x1a1917));hair.position.y=3.73;player.add(hair);
const legL=limb(.16,1,.3,pants),legR=legL.clone();legL.position.set(-.25,1.05,0);legR.position.set(.25,1.05,0);player.add(legL,legR);
const armL=limb(.12,.85,.24,cloth),armR=armL.clone();armL.position.set(-.72,2.25,0);armR.position.set(.72,2.25,0);player.add(armL,armR);
player.position.set(-18,0,-22);player.rotation.y=Math.PI;

const keys={};addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let touchDir={x:0,y:0},drag=false,lastX=0,lastY=0;
canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY});addEventListener('pointerup',()=>drag=false);
addEventListener('pointermove',e=>{if(drag){cameraAngle-= (e.clientX-lastX)*.004;cameraPitch+= (e.clientY-lastY)*.0025;cameraPitch=Math.max(.15,Math.min(.72,cameraPitch));lastX=e.clientX;lastY=e.clientY}});
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');
joy.addEventListener('pointerdown',e=>joy.setPointerCapture(e.pointerId));joy.addEventListener('pointermove',e=>{if(!joy.hasPointerCapture(e.pointerId))return;const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,x=e.clientX-cx,y=e.clientY-cy,l=Math.min(38,Math.hypot(x,y)),a=Math.atan2(y,x);touchDir={x:Math.cos(a)*(l/38),y:Math.sin(a)*(l/38)};stick.style.transform=`translate(${touchDir.x*38}px,${touchDir.y*38}px)`});joy.addEventListener('pointerup',()=>{touchDir={x:0,y:0};stick.style.transform=''});

// NPCs
const npcs=[];
function npc(){const g=new THREE.Group();const c=[0x777064,0x6b5750,0x4a5d66,0x555b4d][npcs.length%4];const b=limb(.35,.9,.32,mat(c));b.position.y=1.65;g.add(b);const h=limb(.28,.2,.28,skin);h.position.y=2.75;g.add(h);g.position.set((npcs.length%2?1:-1)*(25+(npcs.length%5)*18),0,(npcs.length-5)*20);g.userData={axis:npcs.length%2?'x':'z',dir:npcs.length%2?1:-1,phase:npcs.length*.7};scene.add(g);npcs.push(g)}
for(let i=0;i<14;i++)npc();

// Cars
const cars=[];
function car(color,x,z,axis,dir){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(axis==='x'?4.2:2.1,1,axis==='x'?2.1:4.2),mat(color,.35));body.position.y=.75;body.castShadow=true;g.add(body);const cab=new THREE.Mesh(new THREE.BoxGeometry(axis==='x'?2.1:1.8,.75,axis==='x'?1.9:2),new THREE.MeshStandardMaterial({color:0x1c2b2d,roughness:.15,metalness:.5}));cab.position.set(axis==='x'?-.3:0,1.55,axis==='x'?0:-.2);cab.castShadow=true;g.add(cab);g.position.set(x,0,z);g.userData={axis,dir,speed:.05+Math.random()*.04};scene.add(g);cars.push(g)}
car(0x7a241e,-130,-18,'x',1);car(0x253d55,90,22,'x',-1);car(0x6b6c62,-90,62,'x',1);car(0x4b2e23,18,-130,'z',1);car(0x31393a,-22,110,'z',-1);

// Rain
const rainGeo=new THREE.BufferGeometry();const rainCount=900;const rainPos=new Float32Array(rainCount*3);for(let i=0;i<rainCount;i++){rainPos[i*3]=(Math.random()-0.5)*180;rainPos[i*3+1]=Math.random()*70;rainPos[i*3+2]=(Math.random()-0.5)*180}rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:0xa8b7b8,size:.09,transparent:true,opacity:.55}));scene.add(rain);rain.visible=false;

let cameraAngle=Math.PI*.1,cameraPitch=.38,running=false,missionIndex=0,score=250,started=false,clockTime=.5,walkPhase=0;
const objectives=[{title:'REACH THE SAFEHOUSE',text:'Follow the marked route to Central Plaza',pos:new THREE.Vector3(0,0,40),range:12},{title:'SURVEY THE DISTRICT',text:'Inspect the flickering street beacon',pos:new THREE.Vector3(40,0,40),range:8},{title:'RETURN TO COMMAND',text:'Report back at the evacuation square',pos:new THREE.Vector3(-18,0,-22),range:10}];
function toast(s){const t=document.querySelector('#toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}

function startGame(){started=true;document.querySelector('#menu').classList.add('hidden');document.body.classList.add('playing');document.querySelector('#fade').classList.add('on');setTimeout(()=>document.querySelector('#fade').classList.remove('on'),900);toast('MISSION STARTED')}
document.querySelector('#startBtn').onclick=startGame;document.querySelector('#continueBtn').onclick=startGame;document.querySelector('#touchAction').onpointerdown=()=>interact();
function interact(){const o=objectives[missionIndex];if(player.position.distanceTo(o.pos)<o.range+4){completeMission()}}
function completeMission(){score+=150;missionIndex=(missionIndex+1)%objectives.length;const o=objectives[missionIndex];document.querySelector('#objectiveTitle').textContent=o.title;document.querySelector('#objectiveText').textContent=o.text;document.querySelector('#score').textContent=String(score).padStart(6,'0');document.querySelector('#progressBar').style.width=((missionIndex+1)/objectives.length*100)+'%';toast(missionIndex===0?'SAFEHOUSE SECURED':missionIndex===1?'BEACON ANALYZED':'OBJECTIVE ADVANCED')}

// Main loop
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 clockTime=(clockTime+dt*.001)%1;const night=(Math.sin(clockTime*Math.PI*2-Math.PI*.5)+1)/2;
 sun.intensity=.5+night*2;hemi.intensity=.35+night*.9;scene.fog.color.setHex(night>.65?0x596c75:0x7e908f);renderer.toneMappingExposure=.5+night*.5;

 if(started){
  let mx=(keys.d?1:0)-(keys.a?1:0)+touchDir.x,my=(keys.w?1:0)-(keys.s?1:0)-touchDir.y;
  const len=Math.hypot(mx,my);running=len>.12;
  if(running){mx/=Math.max(1,len);my/=Math.max(1,len);const forward=new THREE.Vector3(-Math.sin(cameraAngle),0,-Math.cos(cameraAngle));const right=new THREE.Vector3(Math.cos(cameraAngle),0,-Math.sin(cameraAngle));const move=forward.multiplyScalar(-my).add(right.multiplyScalar(mx)).normalize();player.position.addScaledVector(move,dt*8);player.rotation.y=Math.atan2(move.x,move.z);walkPhase+=dt*9;legL.rotation.x=Math.sin(walkPhase)*.55;legR.rotation.x=-Math.sin(walkPhase)*.55;armL.rotation.x=-Math.sin(walkPhase)*.45;armR.rotation.x=Math.sin(walkPhase)*.45}
  else{legL.rotation.x*=.85;legR.rotation.x*=.85;armL.rotation.x*=.85;armR.rotation.x*=.85}
  player.position.x=THREE.MathUtils.clamp(player.position.x,-145,145);player.position.z=THREE.MathUtils.clamp(player.position.z,-145,145);
 }
 npcs.forEach(n=>{const u=n.userData;n.position[u.axis]+=u.dir*(.018+.005*Math.sin(t));if(Math.abs(n.position[u.axis])>145)u.dir*=-1;n.rotation.y=u.axis==='x'?(u.dir>0?Math.PI/2:-Math.PI/2):(u.dir>0?0:Math.PI)});
 cars.forEach(c=>{const u=c.userData;c.position[u.axis]+=u.dir*u.speed;if(c.position[u.axis]>150)c.position[u.axis]=-150;if(c.position[u.axis]<-150)c.position[u.axis]=150;c.rotation.y=u.axis==='x'?(u.dir>0?Math.PI/2:-Math.PI/2):(u.dir>0?0:Math.PI)});
 rain.visible=(Math.sin(t*.07)>-.72);if(rain.visible){const p=rain.geometry.attributes.position.array;for(let i=0;i<rainCount;i++){p[i*3+1]-=dt*28;if(p[i*3+1]<0)p[i*3+1]=70}rain.geometry.attributes.position.needsUpdate=true}

 const target=player.position.clone().add(new THREE.Vector3(0,2.5,0));const dist=11;camera.position.set(target.x+Math.sin(cameraAngle)*dist, target.y+4+cameraPitch*7,target.z+Math.cos(cameraAngle)*dist);camera.lookAt(target);
 const o=objectives[missionIndex];const near=player.position.distanceTo(o.pos)<o.range+4;document.querySelector('#prompt').classList.toggle('show',near&&started);if(near&&started){const pct=Math.max(5,100-player.position.distanceTo(o.pos)*4);document.querySelector('#progressBar').style.width=pct+'%'}
 renderer.render(scene,camera);
}
camera.position.set(-18,8,-36);camera.lookAt(player.position);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
