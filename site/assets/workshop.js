import {DRIVE_NAMES,SUGGESTIONS,initialState,readState,quadrant,radar,projectFiles,zipFiles,escapeHTML as e} from './workshop-model.js';
const $=id=>document.getElementById(id),KEY='move-live-strategy-v1';
let state=initialState(),selected=0,opened=null,typingToken=0,resetArmed=false,imageToken=0;
try{const raw=localStorage.getItem(KEY);if(raw)state=readState(JSON.parse(raw));}catch{}
const metricFields=Array.from({length:4},(_,i)=>$('metric-'+i));
const axisFields=Object.fromEntries(['left','right','top','bottom'].map(k=>[k,$('axis-'+k)]));
function emit(){document.dispatchEvent(new CustomEvent('workshop-context',{detail:{metrics:state.metricsLocked?state.metrics:[],axes:state.axesLocked?state.axes:null,players:state.players.filter(p=>p.locked),status:'Workshop hypotheses; custom narrative context requires review before changing executable rules'}}));}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));$('workshop-storage').textContent='Saved in this browser · download files for GitHub';}catch{$('workshop-storage').textContent='Browser storage is unavailable or full. Download your files before leaving.';}emit();}
function announce(text){$('announcement').textContent=text;}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function openFile(path){opened=projectFiles(state).find(f=>f.path===path);if(!opened)return;$('file-dialog-title').textContent=opened.path;const html=opened.type==='text/html';$('file-content').hidden=html;$('file-html').hidden=!html;$('file-content').textContent=html?'':opened.content;$('file-html').srcdoc=html?opened.content:'';$('file-dialog').showModal();}
$('close-file').onclick=()=>$('file-dialog').close();
$('download-file').onclick=()=>{if(opened)download(opened.content,opened.path.split('/').pop(),opened.type);};
$('download-workshop').onclick=()=>{const files=projectFiles(state);if(files.length)download(zipFiles(files),'move-strategy-workshop.zip','application/zip');};
function schematic(){
 const chapter=document.body.dataset.chapter,players=state.players.filter(p=>p.locked).length;
 const node=(key,x,y,w,a,b,complete,current)=>'<g class="node '+(complete?'complete ':'')+(current?'current':'')+'" data-node="'+key+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="40" rx="16"/><text x="'+(x+w/2)+'" y="'+(y+(b?17:24))+'" text-anchor="middle">'+a+(b?'<tspan x="'+(x+w/2)+'" dy="14">'+b+'</tspan>':'')+'</text></g>';
 $('strategy-schematic').innerHTML='<p>OUR STRATEGY, CONNECTED</p><svg viewBox="0 0 360 205" role="img" aria-label="Players commit desired actions that impact business metrics and result in a win-state. Players track feedback, which triggers actions and shows progress. Rewards are embedded in the win-state."><defs><marker id="map-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L6 3L0 6" fill="#a7c6dc"/></marker></defs><g class="link" marker-end="url(#map-arrow)"><path d="M72 100 Q95 100 121 54"/><path d="M72 100 Q95 100 121 143"/><path d="M162 127V76"/><path d="M204 54Q239 54 265 26"/><path d="M204 54Q239 54 265 99"/><path d="M204 147Q235 147 265 105"/><path d="M310 164V124"/></g><g class="edge-label"><text x="75" y="60">commits</text><text x="76" y="134">tracks</text><text x="166" y="109">triggers</text><text x="218" y="24">impact</text><text x="221" y="76">results</text><text x="220" y="141">progress</text><text x="260" y="157">embedded</text></g>'+node('player',1,80,72,'player','',players===4,['player-axes','player-types'].includes(chapter))+node('actions',121,34,83,'desired','actions',false,['features','game-loop'].includes(chapter))+node('feedback',121,127,83,'feedback','mechanics',false,chapter==='javascript')+node('metrics',265,3,94,'business','metrics',state.metricsLocked,chapter==='strategy')+node('win',265,84,94,'win-state','',false,chapter==='closing')+node('rewards',265,164,94,'rewards','',false,chapter==='balance')+'</svg><p class="map-legend">Filled = set · outlined = discussing'+(players&&players<4?' · players '+players+'/4':'')+'</p>';
}
function folder(added=[]){
 document.body.dataset.repository=state.created?'open':'closed';
 const files=projectFiles(state);$('file-count').textContent=files.length+' file'+(files.length===1?'':'s');
 $('folder-files').replaceChildren();
 if(!files.length){const empty=document.createElement('div');empty.className='folder-empty';empty.innerHTML='<span aria-hidden="true">＋</span>Your first decision goes here.';$('folder-files').append(empty);}
 for(const file of files){const button=document.createElement('button');button.type='button';button.className='file-row'+(added.includes(file.path)?' just-added':'');button.innerHTML='<span class="file-badge">'+e(file.path.split('.').pop().toUpperCase())+'</span><span class="file-path">'+e(file.path)+'</span><small>↗</small>';button.onclick=()=>openFile(file.path);$('folder-files').append(button);}
 $('download-workshop').disabled=!files.length;schematic();
}
function gates(){
 $('set-metrics').disabled=!state.created||state.metricsLocked;
 $('suggest-metrics').disabled=!state.created||state.metricsLocked;
 $('edit-metrics').hidden=!state.metricsLocked;
 metricFields.forEach(f=>f.disabled=!state.created||state.metricsLocked);
 $('set-axes').disabled=!state.created||state.axesLocked;
 $('suggest-axes').disabled=!state.created||state.axesLocked;
 $('edit-axes').hidden=!state.axesLocked;
 Object.values(axisFields).forEach(f=>f.disabled=!state.created||state.axesLocked);
 if(!state.created){$('metrics-status').textContent='Create the repository above to start writing.';$('axes-status').textContent='Create the repository above to start writing.';}
}
function map(){
 $('axes-map').innerHTML=state.players.map((p,i)=>'<div class="axis-quadrant"><small>'+e(quadrant(state.axes,i)||'Define the two axes above')+'</small><b>'+e(p.title||'Player type '+(i+1))+(p.locked?' ✓':'')+'</b></div>').join('');
}
function paintRadar(){const p=state.players[selected];$('drive-chart').innerHTML=radar(p.drives);p.drives.forEach((v,i)=>{$('drive-value-'+i).value=v;$('drive-'+i).value=v;});}
function portrait(){const p=state.players[selected];$('portrait-preview').innerHTML=p.image?'<img src="'+p.image+'" alt="Selected player image">':(p.title?'<span>'+e(p.title.split(/\s+/).map(x=>x[0]).slice(0,2).join(''))+'</span><small>Add an image</small>':'＋<small>Add an image</small>');}
function tabs(){
 $('player-tabs').innerHTML=state.players.map((p,i)=>'<button type="button" data-player="'+i+'" aria-pressed="'+(i===selected)+'">'+e(p.title||'Player '+(i+1))+'<small>'+(p.locked?'Set ✓':'Draft · '+(i+1)+'/4')+'</small></button>').join('');
 $('player-tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{typingToken++;imageToken++;selected=Number(b.dataset.player);persist();renderPlayer();});
}
function renderPlayer(){
 const p=state.players[selected];tabs();$('player-quadrant').textContent=quadrant(state.axes,selected)||'Set the axes first.';
 $('player-title').value=p.title;$('player-description').value=p.description;$('player-image').value='';
 $('drive-controls').innerHTML=DRIVE_NAMES.map((name,i)=>'<label for="drive-'+i+'"><span>CD'+(i+1)+' · '+e(name)+'</span><output id="drive-value-'+i+'">'+p.drives[i]+'</output><input type="range" id="drive-'+i+'" min="0" max="10" step="1" value="'+p.drives[i]+'"></label>').join('');
 DRIVE_NAMES.forEach((_,i)=>$('drive-'+i).oninput=event=>{typingToken++;p.drives[i]=Number(event.target.value);paintRadar();persist();});
 $('player-fields').disabled=!state.axesLocked||p.locked;
 $('suggest-player').disabled=!state.axesLocked||p.locked;$('set-player').disabled=!state.axesLocked||p.locked;
 $('edit-player').hidden=!p.locked;$('set-player').textContent=p.locked?'Player set ✓':'Set player → folder';
 $('player-status').textContent=!state.axesLocked?'Set the axes first. Then create all four profiles.':p.locked?'Locked in the folder. Choose Edit to revise this profile.':state.players.filter(x=>x.locked).length+'/4 profiles set. Write together, then set this player.';
 paintRadar();portrait();
}
function render(){folder();gates();map();renderPlayer();}
function saveFields(){state.metrics=metricFields.map(f=>f.value);for(const [k,f] of Object.entries(axisFields))state.axes[k]=f.value;}
metricFields.forEach(f=>f.addEventListener('input',()=>{typingToken++;saveFields();persist();}));
Object.values(axisFields).forEach(f=>f.addEventListener('input',()=>{typingToken++;saveFields();map();persist();}));
$('player-title').oninput=()=>{typingToken++;state.players[selected].title=$('player-title').value;tabs();map();portrait();persist();};
$('player-description').oninput=()=>{typingToken++;state.players[selected].description=$('player-description').value;persist();};
async function writeExample(pairs,onChange){
 const token=++typingToken;
 for(const [field,text] of pairs){
  field.value='';
  for(let n=0;n<text.length;n+=8){
   if(token!==typingToken)return;
   if(document.documentElement.classList.contains('paused')||matchMedia('(prefers-reduced-motion: reduce)').matches){field.value=text;onChange();break;}
   field.value=text.slice(0,n+8);onChange();await new Promise(resolve=>setTimeout(resolve,16));
  }
 }
 if(token===typingToken){onChange();persist();announce('Example written. Edit it in your own words, then choose Set.');}
}
$('suggest-metrics').onclick=()=>writeExample(metricFields.map((f,i)=>[f,SUGGESTIONS.metrics[i]]),saveFields);
$('suggest-axes').onclick=()=>writeExample(Object.entries(axisFields).map(([k,f])=>[f,SUGGESTIONS.axes[k]]),()=>{saveFields();map();});
$('suggest-player').onclick=()=>{
 const i=selected,p=state.players[i],sample=SUGGESTIONS.players[i];
 p.drives=[...sample.drives];paintRadar();
 $('player-status').textContent='A prepared fitness hypothesis. Adapt it to the axes and the team’s words.';
 writeExample([[$('player-title'),sample.title],[$('player-description'),sample.description]],()=>{p.title=$('player-title').value;p.description=$('player-description').value;tabs();map();portrait();});
};
function readyRepo(){if(state.created)return true;announce('Create the repository first.');return false;}
$('metrics-form').onsubmit=event=>{
 event.preventDefault();if(!readyRepo()||state.metricsLocked)return;typingToken++;saveFields();
 if(!state.metrics.every(x=>x.trim())){announce('Write all four metrics first.');return;}
 state.metricsLocked=true;persist();gates();folder(['context/business-metrics.md']);
 $('metrics-status').textContent='Set → context/business-metrics.md. Four priorities, ready to discuss.';announce('Business metrics saved as Markdown.');
};
$('edit-metrics').onclick=()=>{state.metricsLocked=false;gates();folder();persist();$('metrics-status').textContent='Editing. Set again to update the Markdown file.';metricFields[0].focus();};
$('axes-form').onsubmit=event=>{
 event.preventDefault();if(!readyRepo()||state.axesLocked)return;typingToken++;saveFields();
 if(!Object.values(state.axes).every(x=>x.trim())){announce('Name both ends of both axes.');return;}
 if(state.axes.left.trim().toLowerCase()===state.axes.right.trim().toLowerCase()||state.axes.top.trim().toLowerCase()===state.axes.bottom.trim().toLowerCase()){$('axes-status').textContent='Use two different ends for each axis.';return;}
 state.axesLocked=true;persist();gates();map();renderPlayer();folder(['context/player-axes.json']);$('axes-status').textContent='Axes set. Now give the four quadrants their player types.';announce('Player axes saved.');
};
$('edit-axes').onclick=()=>{typingToken++;state.axesLocked=false;state.players.forEach(p=>p.locked=false);persist();render();$('axes-status').textContent='Editing axes unlocks all four profiles for review. Set the axes, then set each profile again.';};
$('player-form').onsubmit=event=>{
 event.preventDefault();const p=state.players[selected];if(!state.axesLocked||p.locked)return;
 typingToken++;p.title=$('player-title').value.trim();p.description=$('player-description').value.trim();
 if(!p.title||!p.description)return;p.locked=true;persist();renderPlayer();map();folder(['context/player-types.json','players/player-'+(selected+1)+'.html']);announce(p.title+' saved as an HTML profile.');
};
$('edit-player').onclick=()=>{typingToken++;state.players[selected].locked=false;persist();renderPlayer();folder();map();};
$('player-image').onchange=async event=>{
 const file=event.target.files[0],i=selected,token=++imageToken;if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>1200000){$('player-status').textContent='Choose a PNG, JPEG, or WebP image smaller than 1.2 MB.';event.target.value='';return;}
 try{
 const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
 const valid=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=url;});
 if(token!==imageToken||i!==selected||state.players[i].locked)return;
 if(!valid)throw Error('Invalid image');state.players[i].image=url;portrait();persist();$('player-status').textContent='Image added locally. Set the player to include it in the HTML file.';
 }catch{$('player-status').textContent='This image could not be read. Choose another PNG, JPEG, or WebP.';}
};
$('remove-image').onclick=()=>{imageToken++;state.players[selected].image='';$('player-image').value='';portrait();persist();};
document.addEventListener('repository-created',()=>{
 state.created=true;persist();render();$('metrics-status').textContent='Four outcomes, in priority order. Suggestions are workshop hypotheses.';$('axes-status').textContent='Define the axes before setting the four player types.';
 $('repository-panel').classList.add('arriving');setTimeout(()=>$('repository-panel').classList.remove('arriving'),900);announce('Empty repository created. Add your first decision.');
});
document.addEventListener('chapter-change',schematic);
document.addEventListener('project-change',emit);
$('reset-workshop').onclick=()=>{
 if(!resetArmed){resetArmed=true;$('reset-workshop').textContent='Confirm reset';setTimeout(()=>{resetArmed=false;$('reset-workshop').textContent='Start over';},4000);return;}
 try{localStorage.removeItem(KEY);}catch{}
 location.href=location.pathname+'?fresh='+Date.now()+'#opening';
};
metricFields.forEach((f,i)=>f.value=state.metrics[i]);for(const [k,f] of Object.entries(axisFields))f.value=state.axes[k];
render();
if(state.created){$('create-repo').textContent='Repository restored';$('create-repo').disabled=true;$('repo-status').textContent='Your workshop draft was restored from this browser.';document.dispatchEvent(new Event('repository-restored'));}
if(state.metricsLocked)$('metrics-status').textContent='Set → context/business-metrics.md. Choose Edit to revise.';
if(state.axesLocked)$('axes-status').textContent='Axes set. All four player types use these dimensions.';
emit();
