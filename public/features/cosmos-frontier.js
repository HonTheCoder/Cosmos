/* COSMOS — Exploration Passport (sixteen-instrument edition). */
(()=>{
'use strict';
if(window.COSMOS_FRONTIER)return;
const STORE='cosmos-field-science-v1';
const WORLDS=[['mercury','Mercury'],['venus','Venus'],['earth','Earth'],['mars','Mars'],['jupiter','Jupiter'],['saturn','Saturn'],['uranus','Uranus'],['neptune','Neptune']];
const MOONS=['moon','europa','titan','enceladus'];
const iso=()=>new Date().toISOString();
const EMPTY={visited:['earth'],moons:[],missions:[],discoveries:[],updated:iso()};
function read(){try{const raw=JSON.parse(localStorage.getItem(STORE)||'null');if(!raw||typeof raw!=='object')return {...EMPTY};return {
 visited: Array.isArray(raw.visited)?raw.visited.filter(x=>WORLDS.some(p=>p[0]===x)):['earth'],
 moons:Array.isArray(raw.moons)?raw.moons.filter(x=>MOONS.includes(x)):[],
 missions:Array.isArray(raw.missions)?raw.missions.filter(x=>typeof x==='string'&&!x.startsWith('rover-')):[],
 discoveries:Array.isArray(raw.discoveries)?raw.discoveries.filter(x=>typeof x==='string'&&!['instrument-landing','instrument-nasaphoto','instrument-rover','instrument-samples','instrument-weather'].includes(x)&&!x.startsWith('nasa-photo-')&&!x.startsWith('weather-')&&!x.startsWith('rover-')):[],
 updated: typeof raw.updated==='string'?raw.updated:iso()
}}catch(e){return {...EMPTY}}}
let progress=read(),dialog=null;
function persist(){progress.updated=iso();try{localStorage.setItem(STORE,JSON.stringify(progress))}catch(e){}window.dispatchEvent(new Event('cosmos:passport-update'))}
function award(kind,id){if(!Object.hasOwn(progress,kind)||!Array.isArray(progress[kind])||typeof id!=='string')return;if(!progress[kind].includes(id)){progress[kind].push(id);persist()}}
function close(){dialog?.remove();dialog=null;document.body.classList.remove('cf-open')}
function esc(v){return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function open(){window.COSMOS_LAB?.close?.();window.COSMOS_DEEP?.close?.();window.COSMOS_DISCOVERY?.close?.();close();
 dialog=document.createElement('section');dialog.className='cf-modal';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Exploration passport');
 dialog.innerHTML=`<button class="cf-backdrop" data-cf-close aria-label="Close exploration passport"></button><div class="cf-panel"><header class="cf-header"><div><small>COSMOS / INSTRUMENT 16</small><h2>Exploration passport</h2><p>Keep a private record of the planets, moons, missions, and discoveries you explore.</p></div><button class="cf-x" data-cf-close aria-label="Close">×</button></header><div class="cf-body" id="cf-body"></div></div>`;
 document.body.appendChild(dialog);document.body.classList.add('cf-open');dialog.querySelectorAll('[data-cf-close]').forEach(b=>b.addEventListener('click',close));render();
}
function render(){if(!dialog)return;const body=dialog.querySelector('#cf-body');const done=progress.visited.length;
 const stamps=WORLDS.map(([id,name])=>`<button type="button" class="cf-stamp ${progress.visited.includes(id)?'earned':''}" data-visit="${id}"><span>${progress.visited.includes(id)?'✓':'+'}</span><strong>${name.toUpperCase()}</strong><small>${progress.visited.includes(id)?'VISITED':'OPEN PLANET'}</small></button>`).join('');
 const discovered=progress.discoveries.length;
 body.innerHTML=`<div class="cf-passport-hero"><div><small>MISSION CREDENTIAL / COSMOS</small><h3>THE UNIVERSE<br><em>IS YOURS TO EXPLORE.</em></h3><p>Your journey is tracked locally on this device. Explore worlds, discover moons, and study space missions to fill your passport.</p></div><div class="cf-passport-counter"><strong>${done}<span>/8</span></strong><small>PLANETS VISITED</small><div class="cf-passport-meter"><b style="width:${done/8*100}%"></b></div></div></div><div class="cf-passport-label">PLANETARY PASSPORT / 08 DESTINATIONS</div><div class="cf-stamp-grid">${stamps}</div><div class="cf-passport-label">EXPLORATION RECORD</div><div class="cf-badge-row"><div><strong>${progress.moons.length}/${MOONS.length}</strong><span>MOONS EXPLORED</span></div><div><strong>${progress.missions.length}</strong><span>MISSION PROFILES</span></div><div><strong>${discovered}</strong><span>DISCOVERIES</span></div></div><div class="cf-journal-log">${discovered?`<strong>${discovered} discovery ${discovered===1?'entry':'entries'} logged</strong><p>Your explorations are recorded on this device.</p>`:'<p>Explore planetary hotspots, moon dossiers, or space missions to start your discovery record.</p>'}</div><div class="cf-passport-controls"><button class="cf-button cf-button-primary" id="cf-export-journal">EXPORT PASSPORT ↓</button><button class="cf-button cf-danger" id="cf-reset-journal">RESET PROGRESS</button></div><p class="cf-caveat">Your passport is stored only in this browser. This is an independent educational experience and is not an official NASA credential. The download contains your saved planet, moon, mission, and discovery records.</p>`;
 body.querySelectorAll('[data-visit]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.visit;close();window.dispatchEvent(new CustomEvent('cosmos:navigate',{detail:{id}}));award('visited',id)}));
 body.querySelector('#cf-export-journal').addEventListener('click',()=>{const data={application:'COSMOS EXPLORATION PASSPORT',exported:iso(),...progress};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='COSMOS-exploration-passport.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)});
 body.querySelector('#cf-reset-journal').addEventListener('click',()=>{if(confirm('Reset your saved COSMOS planet, moon, mission, and discovery progress?')){progress={...EMPTY,visited:[]};persist();render()}});
}
function observe(){const chapters=[...document.querySelectorAll('[data-planet]')];if(!chapters.length)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>.55){const id=entry.target.dataset.planet;if(id)award('visited',id)}})},{threshold:[.55,.8]});chapters.forEach(el=>observer.observe(el))}
window.addEventListener('cosmos:navigate',e=>{const id=e.detail?.id;if(WORLDS.some(p=>p[0]===id))award('visited',id)});
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-hub="moons"], [data-hub="missions"], [data-hub="tour"], [data-hub="exoplanets"], [data-hub="hotspots"]');if(b)award('discoveries','instrument-'+b.dataset.hub)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(observe,700));else setTimeout(observe,700);
window.COSMOS_FRONTIER={open:id=>{if(id==='passport')open()},close,award,progress:()=>structuredClone(progress),features:['passport']};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog)close()});
})();
