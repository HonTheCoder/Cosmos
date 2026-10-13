/* COSMOS EXPLORATION LAB: shared, dependency-free experience for React and offline builds. */
(()=>{
'use strict';
if(window.__cosmosLabInitialized)return;
window.__cosmosLabInitialized=true;
const P=[
 {id:'mercury',name:'Mercury',diameter:4879,color:'#bdafa3',orbit:0.39,year:0.24},
 {id:'venus',name:'Venus',diameter:12104,color:'#edc28d',orbit:0.72,year:0.62},
 {id:'earth',name:'Earth',diameter:12742,color:'#83c7ff',orbit:1,year:1},
 {id:'mars',name:'Mars',diameter:6779,color:'#df8669',orbit:1.52,year:1.88},
 {id:'jupiter',name:'Jupiter',diameter:139820,color:'#ddb994',orbit:5.2,year:11.86},
 {id:'saturn',name:'Saturn',diameter:116460,color:'#ead0a3',orbit:9.58,year:29.46},
 {id:'uranus',name:'Uranus',diameter:50724,color:'#a1dfdb',orbit:19.2,year:84.02},
 {id:'neptune',name:'Neptune',diameter:49244,color:'#7e9eff',orbit:30.1,year:164.8}
];
const M=[
 {id:'moon',name:'The Moon',host:'Earth',diameter:3475,orbital:'27.3 days',temp:'−20°C average',color:'#c4c7ce',type:'ROCKY SATELLITE',detail:'Our only natural satellite shapes tides and preserves a cratered record of the early solar system.',fact:'The same side of the Moon faces Earth because it is tidally locked.',url:'https://science.nasa.gov/moon/'},
 {id:'europa',name:'Europa',host:'Jupiter',diameter:3122,orbital:'3.55 days',temp:'About −160°C surface',color:'#cddff0',type:'ICY OCEAN WORLD',detail:'A fractured ice shell conceals a global salty ocean, making Europa a major target in the search for potentially habitable environments.',fact:'Europa may hold more liquid water beneath its ice than all of Earth’s oceans combined.',url:'https://science.nasa.gov/jupiter/moons/europa/'},
 {id:'titan',name:'Titan',host:'Saturn',diameter:5150,orbital:'15.95 days',temp:'−179°C surface',color:'#dbad7a',type:'HAZY ATMOSPHERE',detail:'Titan has a dense nitrogen atmosphere and methane rivers, lakes and seas — a world with an active hydrocarbon weather cycle.',fact:'Titan is the only moon known to have stable liquids on its surface.',url:'https://science.nasa.gov/saturn/moons/titan/'},
 {id:'enceladus',name:'Enceladus',host:'Saturn',diameter:504,orbital:'1.37 days',temp:'About −200°C surface',color:'#dcefff',type:'ACTIVE ICE MOON',detail:'An icy moon with plumes that erupt from south-polar fractures, supplying material from its subsurface ocean to space.',fact:'Cassini sampled water-rich plumes containing organic molecules from Enceladus.',url:'https://science.nasa.gov/saturn/moons/enceladus/'}
];
const path=(kind,id)=>{const embed=window.COSMOS_ASSETS;if(kind==='planet'&&embed?.planets?.[id])return embed.planets[id];if(kind==='moon'&&embed?.moons?.[id])return embed.moons[id];return kind==='planet'?`/assets/planets/${id}.webp`:`/assets/moons/${id}.webp`};
const ico=(id,n=18)=>{const paths={compare:'<circle cx="8" cy="12" r="5"/><circle cx="17" cy="12" r="3.5"/><path d="M3 3h10M13 21h8"/>',map:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)"/><circle cx="20" cy="8" r="1.5"/>',moon:'<path d="M20 15.5A8 8 0 0 1 8.5 4 8.1 8.1 0 1 0 20 15.5Z"/><path d="m16 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',volume:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',mute:'<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',arrow:'<path d="m5 12 14 0m-6-6 6 6-6 6"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',back:'<path d="m15 18-6-6 6-6"/>',play:'<path d="m8 5 12 7-12 7z"/>',spark:'<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>'};return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||paths.spark}</svg>`};
const fmt=x=>Number(x).toLocaleString('en-US');
let modal=null,cleanups=[],soundEnabled=readSoundPreference(),audioUnavailable=false,volume=.38,audio=null,audioFadeFrame=0,audioRequest=0,lastActive='',lastTone=0;
let compareLeft='earth',compareRight='jupiter',trueScale=true,moonId='moon';
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function close(){cleanups.forEach(fn=>{try{fn()}catch(e){}});cleanups=[];modal?.remove();modal=null;document.body.classList.remove('lab-open');document.getElementById('cosmos-lab-launch')?.focus({preventScroll:true})}
function shell(kicker,title,subtitle){close();modal=document.createElement('section');modal.className='cosmos-lab-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label',title);modal.innerHTML=`<button class="cl-scrim" data-cl-close aria-label="Close panel"></button><div class="cl-panel"><header class="cl-panel-head"><div><span class="cl-eyebrow">COSMOS / ${kicker}</span><h2>${title}</h2><p>${subtitle}</p></div><button class="cl-x" data-cl-close aria-label="Close panel">${ico('close',22)}</button></header><div class="cl-main" id="cl-main"></div></div>`;document.body.appendChild(modal);document.body.classList.add('lab-open');modal.querySelectorAll('[data-cl-close]').forEach(e=>e.addEventListener('click',close));return modal.querySelector('#cl-main')}
function button(text,handler){const b=document.createElement('button');b.className='cl-button';b.innerHTML=`${text} ${ico('arrow',16)}`;b.addEventListener('click',handler);return b}
function hub(){const el=shell('MISSION CONTROL','Exploration laboratory','Sixteen interactive instruments across planetary science, celestial mechanics, and cinematic exploration.');
 const old=[['compare','INSTRUMENT 01','Size comparison','Compare the relative diameters of two planets.'],['map','INSTRUMENT 02','Orbital navigator','Explore eight worlds from above.'],['moons','INSTRUMENT 03','Moon explorer','Discover four remarkable satellites.'],['sound','INSTRUMENT 04','Sound studio','Set the level of the COSMOS soundtrack.']];
 const newer=[['hotspots','INSTRUMENT 05','Planetary hotspots','Select key regions and focus the 3D planet.'],['day','INSTRUMENT 06','Day & night','Control simulated sunlight around Earth.'],['tour','INSTRUMENT 07','Guided spacecraft tour','Travel to six worlds with paced captions.'],['surface','INSTRUMENT 08','Surface explorer','Pan and zoom into global planet maps.']];
 const deep=[['interiors','INSTRUMENT 09','Planet interiors','Open layered cross sections and investigate the core.'],['time','INSTRUMENT 10','Time machine','Explore date-based planetary orbital motion.'],['missions','INSTRUMENT 11','Space missions','Follow real mission histories and discoveries.'],['eclipses','INSTRUMENT 12','Eclipse simulator','Adjust the Moon-Sun-Earth alignment.'],['gravity','INSTRUMENT 13','Gravity laboratory','Run side-by-side physics drop experiments.'],['photo','INSTRUMENT 14','Cinematic photo mode','Direct planet lighting and export a portrait.'],['exoplanets','INSTRUMENT 15','Exoplanet explorer','Study documented worlds beyond the Sun.']];
 const frontier=[['passport','INSTRUMENT 16','Exploration passport','Track planetary visits, moon explorations, mission records and discoveries.']];
 el.innerHTML=`<div class="cl-hub-grid">${[...old,...newer,...deep,...frontier].map(([id,num,title,description])=>`<button data-hub="${id}">${ico(({hotspots:'map',day:'spark',tour:'play',surface:'expand'})[id]||({compare:'compare',map:'map',moons:'moon',sound:'volume'})[id],26)}<small>${num}</small><strong>${title}</strong><span>${description}</span>${ico('arrow',18)}</button>`).join('')}</div><p class="cl-disclaimer">Planetary surface feature locations are approximate. Astronomical scaling and travel times are illustrative; your soundtrack preference remains under your control.</p>`;
 el.querySelectorAll('[data-hub]').forEach(b=>b.addEventListener('click',()=>{
  const action={interiors:()=>window.COSMOS_DEEP?.open('interiors'),time:()=>window.COSMOS_DEEP?.open('time'),missions:()=>window.COSMOS_DEEP?.open('missions'),eclipses:()=>window.COSMOS_DEEP?.open('eclipses'),gravity:()=>window.COSMOS_DEEP?.open('gravity'),photo:()=>window.COSMOS_DEEP?.open('photo'),exoplanets:()=>window.COSMOS_DEEP?.open('exoplanets'),passport:()=>window.COSMOS_FRONTIER?.open('passport'),compare,map,moons,sound:audioPanel,hotspots:()=>window.COSMOS_DISCOVERY?.openHotspots(),day:()=>window.COSMOS_DISCOVERY?.openDayNight(),tour:()=>window.COSMOS_DISCOVERY?.openTour(),surface:()=>window.COSMOS_DISCOVERY?.openSurface('mars')}[b.dataset.hub];if(action)action();
 }));}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
// A small, independently rendered WebGL sphere. Shared by both the HTML and React editions.
function sphere(canvas,source,opts={}){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:false});
 if(!gl){
  canvas.style.display='none';
  const fallback=document.createElement('div');fallback.className='cl-fallback-globe';fallback.setAttribute('role','img');fallback.setAttribute('aria-label','Illustrative interactive planet preview');
  fallback.style.width=`${Math.max(2,Math.min(92,(opts.size||.82)*94))}%`;
  fallback.style.backgroundImage=`radial-gradient(circle at 27% 25%,rgba(255,255,255,.15),transparent 33%),radial-gradient(circle at 29% 26%,transparent 25%,rgba(0,2,10,.85) 78%,#010307 100%),url(\"${source}\")`;
  let offset=48,drag=false,last=0,focusLon=0,focusLat=0;
  const down=e=>{drag=true;last=e.clientX;fallback.setPointerCapture(e.pointerId)};
  const move=e=>{if(!drag)return;offset=clamp(offset+(e.clientX-last)*.12,0,100);fallback.style.backgroundPosition=`center,center,${offset}% center`;last=e.clientX};
  const up=()=>drag=false;
  fallback.addEventListener('pointerdown',down);fallback.addEventListener('pointermove',move);fallback.addEventListener('pointerup',up);fallback.addEventListener('pointercancel',up);
  canvas.after(fallback);
  const dispose=()=>{canvas.style.display='';fallback.remove()};
  dispose.setOrientation=(angle,pitch=0)=>{focusLon=(Math.PI/2-angle)*180/Math.PI;focusLat=pitch*180/Math.PI;offset=((focusLon+180)/360*100+100)%100;fallback.style.backgroundPosition=`center,center,${offset}% center`};
  dispose.setLightAngle=(angle)=>{const x=Math.round(50+Math.cos(angle)*42);fallback.style.boxShadow=`inset ${x-50}px -12px 75px rgba(0,0,0,.75),0 0 50px rgba(112,165,220,.12)`};
  dispose.setNight=()=>{};
  dispose.project=(lon,lat)=>{const r=fallback.getBoundingClientRect();const rel=((lon-focusLon+540)%360)-180;return {x:r.left+r.width/2+rel/90*r.width*.42,y:r.top+r.height/2-(lat-focusLat)/90*r.height*.46,visible:Math.abs(rel)<80&&Math.abs(lat-focusLat)<85}};
  return dispose;
 }
 const vs=`attribute vec3 pos;attribute vec3 norm;attribute vec2 uv;uniform float aspect;uniform float size;uniform float yaw;uniform float pitch;varying vec3 vNormal;varying vec2 vUv;void main(){float c=cos(yaw),s=sin(yaw),p=cos(pitch),q=sin(pitch);vec3 v=vec3(pos.x*c+pos.z*s,pos.y,-pos.x*s+pos.z*c);vec3 r=vec3(v.x,v.y*p-v.z*q,v.y*q+v.z*p);vNormal=normalize(r);vUv=uv;gl_Position=vec4(r.x*size/aspect,r.y*size,-r.z*.25,1.);}`;
 const fs=`precision highp float;varying vec3 vNormal;varying vec2 vUv;uniform sampler2D map;uniform sampler2D nightMap;uniform vec3 tint;uniform float hasMap;uniform float sunAngle;uniform float useNight;void main(){vec3 n=normalize(vNormal);vec3 tex=texture2D(map,vUv).rgb;vec3 c1=texture2D(map,vUv+vec2(.001,0.)).rgb;vec3 c2=texture2D(map,vUv+vec2(0.,.002)).rgb;float dx=dot(c1-tex,vec3(.21,.72,.07));float dy=dot(c2-tex,vec3(.21,.72,.07));vec3 tangent=normalize(vec3(n.z,0.,-n.x)+vec3(.0001));vec3 bitangent=normalize(cross(n,tangent));n=normalize(n+tangent*dx*1.25+bitangent*dy*1.25);vec3 sun=normalize(vec3(cos(sunAngle)*1.45,.36,sin(sunAngle)*1.45));float solar=dot(n,sun);float light=max(solar,0.);float diffuse=.065+.98*pow(light,.84);float rim=pow(1.-max(n.z,0.),4.);vec3 color=mix(tint,tex,hasMap);vec3 lights=texture2D(nightMap,vUv).rgb;float night=1.0-smoothstep(-.05,.13,solar);gl_FragColor=vec4(color*diffuse+rim*tint*.15+useNight*night*lights*1.5,1.);}`;
 const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
 let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('shader link')}catch(err){console.warn('COSMOS viewer',err);return ()=>{}}
 const verts=[],indices=[],lat=80,lon=128;
 for(let j=0;j<=lat;j++){const th=j*Math.PI/lat;for(let i=0;i<=lon;i++){const ph=i*2*Math.PI/lon;const a=Math.sin(th)*Math.cos(ph),b=Math.cos(th),c=Math.sin(th)*Math.sin(ph);verts.push(a,b,c,a,b,c,1-i/lon,1-j/lat)}}
 for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const a=j*(lon+1)+i,b=a+lon+1;indices.push(a,b,a+1,b,b+1,a+1)}
 const vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([170,188,207,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 let alive=true,loaded=false,yaw=.3,pitch=.1,dragging=false,lastX=0,lastY=0,raf=0,lastFrame=0,targetYaw=null,targetPitch=null,sunAngle=opts.sunAngle??.8,showNight=!!opts.nightMap;
 const nightTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,nightTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 if(opts.nightMap){const nightImg=new Image();nightImg.onload=()=>{if(!alive)return;gl.bindTexture(gl.TEXTURE_2D,nightTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,nightImg)};nightImg.src=opts.nightMap}
 const img=new Image();img.onload=()=>{if(!alive)return;gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);if((img.width&(img.width-1))===0&&(img.height&(img.height-1))===0){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR)}loaded=true};img.onerror=()=>{};img.src=source;
 const attr=(name,count,offset)=>{const id=gl.getAttribLocation(program,name);if(id<0)return;gl.enableVertexAttribArray(id);gl.vertexAttribPointer(id,count,gl.FLOAT,false,32,offset)};
 const start=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)};
 const move=e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.012;pitch=clamp(pitch+(e.clientY-lastY)*.009,-1.1,1.1);lastX=e.clientX;lastY=e.clientY};const end=()=>dragging=false;
 canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 function tick(t){if(!alive)return;raf=requestAnimationFrame(tick);const sz=canvas.getBoundingClientRect();if(!sz.width||!sz.height||document.hidden)return;const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(sz.width*dpr)),h=Math.max(1,Math.round(sz.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}if(!dragging&&t-lastFrame<80)yaw+=.0013;lastFrame=t;
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);attr('pos',3,0);attr('norm',3,12);attr('uv',2,24);gl.uniform1f(gl.getUniformLocation(program,'aspect'),w/h);gl.uniform1f(gl.getUniformLocation(program,'size'),opts.size||.82);gl.uniform1f(gl.getUniformLocation(program,'yaw'),yaw);gl.uniform1f(gl.getUniformLocation(program,'pitch'),pitch);gl.uniform1f(gl.getUniformLocation(program,'hasMap'),loaded?1:0);const col=opts.color||'#a6bfd4';gl.uniform3f(gl.getUniformLocation(program,'tint'),parseInt(col.slice(1,3),16)/255,parseInt(col.slice(3,5),16)/255,parseInt(col.slice(5,7),16)/255);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(gl.getUniformLocation(program,'map'),0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,nightTex);gl.uniform1i(gl.getUniformLocation(program,'nightMap'),1);gl.uniform1f(gl.getUniformLocation(program,'useNight'),showNight?1:0);gl.uniform1f(gl.getUniformLocation(program,'sunAngle'),sunAngle);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0)}
 raf=requestAnimationFrame(tick);
 const dispose=()=>{alive=false;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);gl.deleteTexture(tex);gl.deleteTexture(nightTex);gl.deleteBuffer(vb);gl.deleteBuffer(ib);gl.deleteProgram(program)};
 dispose.setOrientation=(wantedYaw,wantedPitch=0)=>{targetYaw=wantedYaw;targetPitch=clamp(wantedPitch,-1.05,1.05)};
 dispose.setLightAngle=(a)=>{sunAngle=a};
 dispose.setNight=(val)=>{showNight=!!val};
 dispose.project=(lon,lat)=>{const a=lat*Math.PI/180,phi=Math.PI-lon*Math.PI/180;const x=Math.cos(a)*Math.cos(phi),y=Math.sin(a),z=Math.cos(a)*Math.sin(phi);const vx=x*Math.cos(yaw)+z*Math.sin(yaw),vz=-x*Math.sin(yaw)+z*Math.cos(yaw);const vy=y*Math.cos(pitch)-vz*Math.sin(pitch),vdepth=y*Math.sin(pitch)+vz*Math.cos(pitch);const r=canvas.getBoundingClientRect();const size=opts.size||.82;return {x:r.left+r.width/2+(vx*size)*r.height/2,y:r.top+r.height/2-(vy*size)*r.height/2,visible:vdepth>.12}};
 return dispose;
}
function compare(){const el=shell('INSTRUMENT 01','Planet size comparison','Select two worlds. Rotate each 3D globe to inspect its appearance.');
 el.innerHTML=`<div class="cl-compare-controls"><label>PLANET A<select id="cl-a">${P.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><div class="cl-vs">VS</div><label>PLANET B<select id="cl-b">${P.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><button id="cl-swap" class="cl-swap" aria-label="Swap selected planets">${ico('compare',18)}</button></div><div class="cl-mode" role="group" aria-label="Comparison scale"><button id="cl-true" aria-pressed="true">TRUE DIAMETER SCALE</button><button id="cl-detail" aria-pressed="false">DETAIL VIEW</button></div><div class="cl-compare-stage"><div class="cl-globe-cell"><canvas id="cl-canvas-a" aria-label="Rotatable 3D planet A"></canvas><span id="cl-name-a"></span></div><div class="cl-globe-cell"><canvas id="cl-canvas-b" aria-label="Rotatable 3D planet B"></canvas><span id="cl-name-b"></span></div></div><div class="cl-result" id="cl-result" aria-live="polite"></div><p class="cl-disclaimer">Real diameter ratio from approximate mean diameters. The original journey is not drawn to scale. In Detail View the globes are enlarged independently for inspection.</p>`;
 const a=el.querySelector('#cl-a'),b=el.querySelector('#cl-b');a.value=compareLeft;b.value=compareRight;let destroyA=null,destroyB=null;
 function redraw(){destroyA?.();destroyB?.();const A=P.find(p=>p.id===a.value),B=P.find(p=>p.id===b.value);compareLeft=A.id;compareRight=B.id;const mx=Math.max(A.diameter,B.diameter);const sA=trueScale?Math.max(.008,A.diameter/mx*.87):.80,sB=trueScale?Math.max(.008,B.diameter/mx*.87):.80;destroyA=sphere(el.querySelector('#cl-canvas-a'),path('planet',A.id),{size:sA,color:A.color});destroyB=sphere(el.querySelector('#cl-canvas-b'),path('planet',B.id),{size:sB,color:B.color});el.querySelector('#cl-name-a').textContent=`${A.name.toUpperCase()} / ${fmt(A.diameter)} KM`;el.querySelector('#cl-name-b').textContent=`${B.name.toUpperCase()} / ${fmt(B.diameter)} KM`;const ratio=Math.max(A.diameter,B.diameter)/Math.min(A.diameter,B.diameter);const big=A.diameter>=B.diameter?A:B,small=big===A?B:A;el.querySelector('#cl-result').innerHTML=`<div><small>RELATIVE DIAMETER</small><strong>${ratio.toFixed(2)}<span> ×</span></strong><p>${big.name} is ${ratio.toFixed(2)} times the diameter of ${small.name}.</p></div><div class="cl-bar-wrap"><div class="cl-bar-label">${safe(A.name.toUpperCase())}<span>${fmt(A.diameter)} KM</span></div><div class="cl-bar"><i style="width:${A.diameter/mx*100}%;background:${A.color}"></i></div><div class="cl-bar-label">${safe(B.name.toUpperCase())}<span>${fmt(B.diameter)} KM</span></div><div class="cl-bar"><i style="width:${B.diameter/mx*100}%;background:${B.color}"></i></div></div>`;el.querySelector('#cl-true').setAttribute('aria-pressed',String(trueScale));el.querySelector('#cl-detail').setAttribute('aria-pressed',String(!trueScale))}
 a.addEventListener('change',redraw);b.addEventListener('change',redraw);el.querySelector('#cl-swap').addEventListener('click',()=>{const x=a.value;a.value=b.value;b.value=x;redraw()});el.querySelector('#cl-true').addEventListener('click',()=>{trueScale=true;redraw()});el.querySelector('#cl-detail').addEventListener('click',()=>{trueScale=false;redraw()});cleanups.push(()=>{destroyA?.();destroyB?.()});redraw();}
function moons(){const el=shell('INSTRUMENT 03','Explore the moons','Select a satellite to view a rotatable 3D artistic reconstruction and its scientific profile.');el.innerHTML=`<div class="cl-moon-tabs" role="group" aria-label="Choose moon">${M.map(m=>`<button data-moon="${m.id}" ${m.id===moonId?'class="active"':''}><span>${m.host.toUpperCase()}</span>${m.name}</button>`).join('')}</div><div class="cl-moon-grid"><div class="cl-moon-stage"><canvas id="cl-moon-canvas" aria-label="Interactive 3D moon; drag to rotate"></canvas><span class="cl-gesture">DRAG TO ROTATE / THREE-DIMENSIONAL VIEW</span></div><div class="cl-moon-info" id="cl-moon-info"></div></div><p class="cl-disclaimer">The moon surfaces are detailed artistic interpretations, not spacecraft-derived cartographic maps. Scientific measurements are presented separately from the illustrative appearance.</p>`;let cleanup=null;function select(id){moonId=id;window.COSMOS_FRONTIER?.award('moons',id);const m=M.find(x=>x.id===id);cleanup?.();cleanup=sphere(el.querySelector('#cl-moon-canvas'),path('moon',id),{size:.83,color:m.color});el.querySelectorAll('[data-moon]').forEach(x=>x.classList.toggle('active',x.dataset.moon===id));el.querySelector('#cl-moon-info').innerHTML=`<span class="cl-eyebrow">${m.type} / ${m.host.toUpperCase()} SYSTEM</span><h3>${m.name}</h3><p>${m.detail}</p><div class="cl-moon-stats"><div><small>DIAMETER</small><strong>${fmt(m.diameter)} km</strong></div><div><small>ORBITAL PERIOD</small><strong>${m.orbital}</strong></div><div><small>TEMPERATURE</small><strong>${m.temp}</strong></div><div><small>PARENT PLANET</small><strong>${m.host}</strong></div></div><div class="cl-moon-fact"><small>FIELD NOTE</small><p>${m.fact}</p></div><a href="${m.url}" target="_blank" rel="noopener noreferrer" class="cl-source">READ NASA SCIENCE ${ico('arrow',16)}</a>`};el.querySelectorAll('[data-moon]').forEach(x=>x.addEventListener('click',()=>select(x.dataset.moon)));cleanups.push(()=>cleanup?.());select(moonId)}
function map(){const el=shell('INSTRUMENT 02','The orbital navigator','An animated overview of our eight planets. Select a world to travel there or open its profile.');let activeId='earth';try{activeId=window.COSMOS_ACTIVE_PLANET||'earth'}catch(e){}
 const rad=[43,61,81,105,132,159,188,215],cx=250,cy=250;el.innerHTML=`<div class="cl-map-layout"><div class="cl-orbit-map"><svg id="cl-map-svg" viewBox="0 0 500 500" role="img" aria-label="Diagram of eight orbital paths around the Sun"><defs><radialGradient id="cl-sun"><stop stop-color="#fff8dc"/><stop offset=".42" stop-color="#f6c46e"/><stop offset="1" stop-color="#a25b26"/></radialGradient></defs>${rad.map(r=>`<circle cx="${cx}" cy="${cy}" r="${r}" stroke="rgba(170,204,251,.16)" stroke-width=".9" fill="none"/>`).join('')}<circle cx="250" cy="250" r="16" fill="url(#cl-sun)"/><circle cx="250" cy="250" r="22" fill="none" stroke="#f6bb6e" stroke-opacity=".24"/>${P.map((p,i)=>`<g data-orbit="${p.id}" role="button" tabindex="0" aria-label="Navigate to ${p.name}" style="cursor:pointer"><circle class="cl-planet-halo" r="11" fill="none" stroke="${p.color}" stroke-width="1" opacity="0"/><circle r="${i===4||i===5?7.5:i===6||i===7?5.5:4.6}" fill="${p.color}" stroke="#08101d" stroke-width="1.5"/></g>`).join('')}</svg><div class="cl-map-caption">ILLUSTRATIVE ORBITAL DIAGRAM · NOT TO SCALE</div></div><div class="cl-map-side"><span class="cl-eyebrow">SELECT A DESTINATION</span><div class="cl-map-list">${P.map(p=>`<button data-planet-nav="${p.id}" class="${p.id===activeId?'active':''}"><i style="background:${p.color}"></i>${p.name}<span>${p.orbit} AU</span></button>`).join('')}</div><p>Planet distances shown in astronomical units (AU). Orbit radii and current positions are illustrative, not real-time tracking.</p><button id="cl-map-go" class="cl-button">EXPLORE SELECTED WORLD ${ico('arrow',16)}</button></div></div>`;
 let selected=activeId;function highlight(){el.querySelectorAll('[data-planet-nav]').forEach(b=>b.classList.toggle('active',b.dataset.planetNav===selected));el.querySelectorAll('[data-orbit]').forEach(b=>b.classList.toggle('active',b.dataset.orbit===selected))}
 function travel(id){close();window.dispatchEvent(new CustomEvent('cosmos:navigate',{detail:{id}}));}
 el.querySelectorAll('[data-planet-nav]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.planetNav;highlight()}));el.querySelectorAll('[data-orbit]').forEach(b=>{b.addEventListener('click',()=>{selected=b.dataset.orbit;highlight()});b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=b.dataset.orbit;highlight()}})});el.querySelector('#cl-map-go').addEventListener('click',()=>travel(selected));let raf=0;const groups=P.map(p=>el.querySelector(`[data-orbit="${p.id}"]`));const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function animate(){raf=requestAnimationFrame(animate);const t=reduced?0:performance.now()*.00006;P.forEach((p,i)=>{const angle=-1.3+i*.93+t/Math.sqrt(p.year);groups[i].setAttribute('transform',`translate(${cx+Math.cos(angle)*rad[i]} ${cy+Math.sin(angle)*rad[i]})`)});}animate();cleanups.push(()=>cancelAnimationFrame(raf))}
// Sound is enabled by default. Browser autoplay policy may defer playback until the first interaction.
function readSoundPreference(){
 try{const pref=localStorage.getItem('cosmos-sound-enabled');return pref===null?true:pref==='true'}
 catch(_){return true}
}
function saveSoundPreference(on){try{localStorage.setItem('cosmos-sound-enabled',String(on))}catch(_){}}
function initAudio(){
 if(audio)return true;
 try{
  audio=new Audio(window.COSMOS_ASSETS?.audio || '/assets/audio/cosmos-ambient.mp3');
  audio.loop=true;
  audio.preload='metadata';
  audio.volume=0;
  audio.addEventListener('error',()=>{cancelAnimationFrame(audioFadeFrame);audioUnavailable=true;syncSound()});
  return true;
 }catch(err){audioUnavailable=true;console.warn('COSMOS soundtrack unavailable',err);return false}
}
function fadeAudio(target,duration=900,done){
 if(!audio)return;
 cancelAnimationFrame(audioFadeFrame);
 const from=audio.volume,beginning=performance.now();
 function tick(now){
  const t=Math.min(1,(now-beginning)/Math.max(1,duration));
  const ease=t*t*(3-2*t);
  audio.volume=Math.max(0,Math.min(1,from+(target-from)*ease));
  if(t<1)audioFadeFrame=requestAnimationFrame(tick);
  else{audioFadeFrame=0;if(done)done()}
 }
 audioFadeFrame=requestAnimationFrame(tick);
}
async function setSound(on){
 const request=++audioRequest;
 soundEnabled=!!on;
 saveSoundPreference(soundEnabled);
 syncSound();
 if(!on){
  if(audio)fadeAudio(0,650,()=>{if(!soundEnabled){audio.pause();audio.currentTime=0;syncSound()}});
  return;
 }
 if(!initAudio()){syncSound();return}
 if(!audio.paused){fadeAudio(volume*.55,350);syncSound();return}
 try{
  // Autoplay is attempted, but browsers often require a user gesture.
  await audio.play();
  if(request!==audioRequest){if(!soundEnabled)audio.pause();return}
  fadeAudio(volume*.55,1400);
 }catch(err){
  if(request!==audioRequest)return;
  // Keep the selected ON state; a future pointer/keyboard gesture retries playback.
  if(err?.name!=='NotAllowedError')console.warn('COSMOS audio playback could not start',err);
 }
 syncSound();
}
function syncSound(){
 const playing=!!audio&&!audio.paused;
 const pending=soundEnabled&&!playing&&!audioUnavailable;
 document.querySelectorAll('[data-cl-sound]').forEach(b=>{
  b.innerHTML=`${ico(soundEnabled?'volume':'mute',18)}<span>${soundEnabled?'SOUND ON':'SOUND OFF'}</span>`;
  b.setAttribute('aria-pressed',String(soundEnabled));
  b.setAttribute('aria-label',!soundEnabled?'Turn on COSMOS soundtrack':playing?'Turn off COSMOS soundtrack':'COSMOS sound is on; playback starts on first interaction. Press to turn off.');
  b.title=!soundEnabled?'Turn on COSMOS music':playing?'Mute COSMOS music':'Sound is on; starts after your first interaction';
  b.dataset.soundPending=String(pending);
 });
 const st=document.getElementById('cl-sound-state');
 if(st)st.textContent=audioUnavailable?'AUDIO FILE UNAVAILABLE':!soundEnabled?'SOUND OFF':playing?'NOW PLAYING / COSMOS':'SOUND ON / AWAITING FIRST INTERACTION';
 const toggle=document.getElementById('cl-toggle-audio');
 if(toggle){toggle.textContent=soundEnabled?'TURN SOUND OFF':'TURN SOUND ON';toggle.setAttribute('aria-pressed',String(soundEnabled))}
}
// The soundtrack has no synthetic notification beeps during planetary transitions.
function chime(){}
function audioPanel(){
 const el=shell('AUDIO / ORIGINAL SCORE','Sound studio','Your COSMOS soundtrack follows you through the solar system.');
 el.innerHTML=`<div class="cl-audio-card"><div class="cl-audio-icon">${ico('volume',42)}</div><span class="cl-eyebrow" id="cl-sound-state"></span><h3>COSMOS / A journey through space.</h3><p>A piano-and-strings cinematic score with gentle atmospheric textures, prepared as a smooth 2½-minute loop. Designed to stay beneath the planet information and visual storytelling.</p><button class="cl-button" id="cl-toggle-audio">${soundEnabled?'TURN SOUND OFF':'TURN SOUND ON'}</button><label class="cl-volume">MUSIC VOLUME<input id="cl-volume" type="range" min="0" max="100" value="${Math.round(volume*100)}"/><output id="cl-volume-label">${Math.round(volume*100)}%</output></label><small>Sound is enabled by default. Your browser may wait for your first tap or click before starting playback. You can turn it off at any time from the header.</small></div>`;
 const b=el.querySelector('#cl-toggle-audio');
 b.addEventListener('click',()=>{void setSound(!soundEnabled)});
 el.querySelector('#cl-volume').addEventListener('input',e=>{
  volume=Number(e.target.value)/100;el.querySelector('#cl-volume-label').textContent=`${e.target.value}%`;
  if(audio&&soundEnabled&&!audio.paused)fadeAudio(volume*.55,160);
 });
 syncSound();
}
function boot(){const header=document.querySelector('.topbar-right');if(!header){setTimeout(boot,120);return}if(document.getElementById('cosmos-lab-launch'))return;
 const buttons=document.createElement('div');buttons.className='cl-header-actions';buttons.innerHTML=`<button id="cosmos-lab-launch" title="Open exploration lab" aria-label="Open exploration lab">${ico('spark',16)}<span>EXPLORATION LAB</span></button>`;const menu=header.querySelector('.mobile-menu');if(menu)header.insertBefore(buttons,menu);else header.appendChild(buttons);buttons.querySelector('button').addEventListener('click',hub);
 const sound=header.querySelector('[data-cl-sound]');
 if(sound)sound.addEventListener('click',()=>{void setSound(!soundEnabled)});
 // Respect the saved preference. When sound is ON, attempt playback on load; if
 // blocked by autoplay restrictions, the next meaningful user gesture unlocks it.
 syncSound();
 const tryStartAudio=e=>{
  if(!soundEnabled||audioUnavailable||(audio&&!audio.paused))return;
  if(e?.target instanceof Element && e.target.closest('[data-cl-sound],#cl-toggle-audio'))return;
  void setSound(true);
 };
 document.addEventListener('pointerdown',tryStartAudio,{capture:true,passive:true});
 document.addEventListener('keydown',tryStartAudio,{capture:true});
 if(soundEnabled)void setSound(true);
 const dock=document.createElement('button');dock.className='cl-orbital-dock';dock.innerHTML=`<span class="cl-dock-figure"><i></i><i></i><i></i><b></b></span><span><small>YOU ARE HERE</small><strong id="cl-dock-planet">EARTH</strong><em>OPEN ORBITAL MAP ${ico('arrow',13)}</em></span>`;dock.addEventListener('click',map);document.body.appendChild(dock);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal)close()});
 const update=()=>{let num=Math.floor(Math.max(0,Math.min(5,window.scrollY/(window.innerHeight*1.65)+.17)));const route=['earth','mars','jupiter','saturn','uranus','neptune'];const id=route[num];window.COSMOS_ACTIVE_PLANET=id;const p=P.find(p=>p.id===id);const h=document.getElementById('cl-dock-planet');if(h)h.textContent=p.name.toUpperCase();if(lastActive!==id){if(lastActive)chime();lastActive=id}};
 window.addEventListener('scroll',update,{passive:true});update();document.addEventListener('visibilitychange',()=>{
  if(!audio||!soundEnabled)return;
  if(document.hidden){cancelAnimationFrame(audioFadeFrame);audio.pause();syncSound()}
  else{audio.volume=0;void setSound(true)}
 });
 window.COSMOS_LAB={openHub:hub,openCompare:compare,openMap:map,openMoons:moons,openMoonOf:(host)=>{moonId=host==='earth'?'moon':host==='jupiter'?'europa':'titan';moons()},openSound:audioPanel,createSphere:sphere,close};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
