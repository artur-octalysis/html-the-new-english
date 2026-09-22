import {ideaCatalog,scoresReady,featuresReady,suggestedScores,listLines,PHASES,DRIVE_NAMES,SUGGESTIONS,initialState,readState,quadrant,radar,projectFiles,zipFiles,escapeHTML as e} from './workshop-model.js?v=planning-1';
const $=id=>document.getElementById(id),KEY='move-live-strategy-v1';
let state=initialState(),selected=0,opened=null,typingToken=0,selectedPhase=0,selectedDrive=0,imageToken=0;
try{const raw=localStorage.getItem(KEY);if(raw)state=readState(JSON.parse(raw));}catch{}
const metricFields=Array.from({length:4},(_,i)=>$('metric-'+i));
const axisFields=Object.fromEntries(['left','right','top','bottom'].map(k=>[k,$('axis-'+k)]));
function emit(){document.dispatchEvent(new CustomEvent('workshop-context',{detail:{metrics:state.metricsLocked?state.metrics:[],axes:state.axesLocked?state.axes:null,players:state.players.filter(p=>p.locked),feedback:state.feedback.locked?state.feedback:null,rewards:state.rewards.locked?state.rewards:null,ideas:ideaCatalog(state),features:state.featuresLocked?ideaCatalog(state).map(x=>({...x,...state.featureScores[x.id]})):[],desiredActions:state.actions.flatMap((p,i)=>p.locked?[{phase:PHASES[i],...p}]:[]),status:'Workshop hypotheses; custom narrative context requires review before changing executable rules'}}));}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{announce('Browser storage is unavailable or full. Download your files before leaving.');}emit();}
function announce(text){$('announcement').textContent=text;}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function openFile(path){opened=projectFiles(state).find(f=>f.path===path);if(!opened)return;$('file-dialog-title').textContent=opened.path;const html=opened.type==='text/html';$('file-content').hidden=html;$('file-html').hidden=!html;$('file-content').textContent=html?'':opened.content;$('file-html').srcdoc=html?opened.content:'';$('file-dialog').showModal();}
$('close-file').onclick=()=>$('file-dialog').close();
$('download-file').onclick=()=>{if(opened)download(opened.content,opened.path.split('/').pop(),opened.type);};
$('download-workshop').onclick=()=>{const files=projectFiles(state);if(files.length)download(zipFiles(files),'move-strategy-workshop.zip','application/zip');};
function schematic(){
 const chapter=document.body.dataset.chapter,players=state.players.filter(p=>p.locked).length;
 const node=(key,x,y,w,a,b,complete,current)=>'<g class="node '+(complete?'complete ':'')+'" data-node="'+key+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="40" rx="16"/><text x="'+(x+w/2)+'" y="'+(y+(b?17:24))+'" text-anchor="middle">'+a+(b?'<tspan x="'+(x+w/2)+'" dy="14">'+b+'</tspan>':'')+'</text></g>';
 $('strategy-schematic').innerHTML='<p>OUR STRATEGY, CONNECTED</p><svg viewBox="0 0 360 205" role="img" aria-label="Players commit desired actions that impact business metrics and result in a win-state. Players track feedback, which triggers actions and shows progress. Rewards are embedded in the win-state."><defs><marker id="map-arrow" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L6 3L0 6" fill="#a7c6dc"/></marker></defs><g class="link" marker-end="url(#map-arrow)"><path d="M73 100 C97 100 97 54 121 54"/><path d="M73 100 C97 100 97 147 121 147"/><path d="M162 127V74"/><path d="M204 54 C234 54 235 23 265 23"/><path d="M204 54 C234 54 235 98 265 98"/><path d="M204 147 C234 147 235 110 265 110"/><path d="M310 164V124"/></g><g class="edge-label"><text x="75" y="60">commits</text><text x="76" y="134">tracks</text><text x="166" y="109">triggers</text><text x="218" y="24">impact</text><text x="221" y="76">results</text><text x="220" y="141">progress</text><text x="260" y="157">embedded</text></g>'+node('player',1,80,72,'player','',players===4,['player-axes','player-types'].includes(chapter))+node('actions',121,34,83,'desired','actions',state.actions.every(p=>p.locked),['features','game-loop'].includes(chapter))+node('feedback',121,127,83,'feedback','mechanics',state.feedback.locked,chapter==='javascript')+node('metrics',265,3,94,'business','metrics',state.metricsLocked,chapter==='strategy')+node('win',265,84,94,'win-state','',state.actions.every(p=>p.locked),chapter==='closing')+node('rewards',265,164,94,'rewards','',state.rewards.locked,chapter==='balance')+'</svg>';
}
function folder(added=[]){
 document.body.dataset.repository=state.created?'open':'closed';
 const files=projectFiles(state);$('file-count').textContent=files.length+' file'+(files.length===1?'':'s');
 $('folder-files').replaceChildren();
 if(!files.length){const empty=document.createElement('div');empty.className='folder-empty';empty.innerHTML='<span aria-hidden="true">＋</span>Your first decision goes here.';$('folder-files').append(empty);}
 for(const file of files){const button=document.createElement('button');button.type='button';button.className='file-row'+(added.includes(file.path)?' just-added':'');button.innerHTML='<span class="file-badge">'+e(file.path.split('.').pop().toUpperCase())+'</span><span class="file-path">'+e(file.path)+'</span>';button.onclick=()=>openFile(file.path);$('folder-files').append(button);}
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
 $('player-tabs').innerHTML=state.players.map((p,i)=>'<button type="button" data-player="'+i+'" aria-pressed="'+(i===selected)+'">'+e(p.title||'Player '+(i+1))+'</button>').join('');
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
 $('player-status').textContent=!state.axesLocked?'Set the axes first. Then create all four profiles.':p.locked?'':'';
 paintRadar();portrait();
}
function render(){folder();gates();map();renderPlayer();renderActions();renderPlanning();}
function saveFields(){state.metrics=metricFields.map(f=>f.value);for(const [k,f] of Object.entries(axisFields))state.axes[k]=f.value;}
metricFields.forEach(f=>f.addEventListener('input',()=>{typingToken++;saveFields();persist();}));
Object.values(axisFields).forEach(f=>f.addEventListener('input',()=>{typingToken++;saveFields();map();persist();}));
$('player-title').oninput=()=>{typingToken++;state.players[selected].title=$('player-title').value;tabs();map();portrait();persist();};
$('player-description').oninput=()=>{typingToken++;state.players[selected].description=$('player-description').value;persist();};
async function writeExample(pairs,onChange){
 const token=++typingToken;
 for(const [field,text] of pairs){
  if(token!==typingToken)return;
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
 state.metricsLocked=true;persist();gates();renderActions();folder(['context/business-metrics.md']);
 $('metrics-status').textContent='Set → context/business-metrics.md. Four priorities, ready to discuss.';announce('Business metrics saved as Markdown.');
};
$('edit-metrics').onclick=()=>{state.metricsLocked=false;state.actions.forEach(p=>p.locked=false);gates();renderActions();folder();persist();$('metrics-status').textContent='Editing. Set again to update the Markdown file.';metricFields[0].focus();};
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
function actionTabs(){
 $('action-tabs').innerHTML=PHASES.map((name,i)=>'<button type="button" data-phase="'+i+'" aria-pressed="'+(i===selectedPhase)+'">'+name+'</button>').join('');
 $('action-tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{typingToken++;selectedPhase=Number(b.dataset.phase);persist();renderActions();});
}
function readActions(){const p=state.actions[selectedPhase];p.lines=$('action-list').value;p.winState=$('action-win').value;p.metricIds=[...$('action-metric-links').querySelectorAll('input:checked')].map(el=>Number(el.value));}
function renderActions(){
 const p=state.actions[selectedPhase];actionTabs();$('action-list').value=p.lines;$('action-win').value=p.winState;
 $('action-metric-links').innerHTML=state.metrics.map((text,i)=>'<label><input type="checkbox" value="'+(i+1)+'" '+(p.metricIds.includes(i+1)?'checked':'')+'><span>'+e(text||'Business metric '+(i+1))+'</span></label>').join('');
 $('action-metric-links').querySelectorAll('input').forEach(el=>el.onchange=()=>{typingToken++;readActions();persist();});
 $('action-fields').disabled=!state.metricsLocked||p.locked;$('suggest-actions').disabled=!state.metricsLocked||p.locked;$('set-actions').disabled=!state.metricsLocked||p.locked;
 $('edit-actions').hidden=!p.locked;$('set-actions').textContent=p.locked?'Actions set':'Set actions → folder';
 $('actions-status').textContent=!state.metricsLocked?'Set your business metrics first.':'';
}
for(const id of ['action-list','action-win'])$(id).oninput=()=>{typingToken++;readActions();persist();};
$('suggest-actions').onclick=()=>{
 const p=state.actions[selectedPhase],sample=SUGGESTIONS.actions[selectedPhase];
 p.metricIds=[...sample.metricIds];renderActions();
 writeExample([[$('action-list'),sample.lines.join('\n')],[$('action-win'),sample.winState]],readActions);
};
$('actions-form').onsubmit=event=>{
 event.preventDefault();const p=state.actions[selectedPhase];if(!state.metricsLocked||p.locked)return;typingToken++;readActions();
 if(!p.lines.trim()||!p.winState.trim()||!p.metricIds.length){$('actions-status').textContent='Add actions, a win-state, and at least one business metric.';return;}
 p.locked=true;persist();renderActions();folder(['context/desired-actions.json']);announce(PHASES[selectedPhase]+' actions saved.');
};
$('edit-actions').onclick=()=>{typingToken++;state.actions[selectedPhase].locked=false;persist();renderActions();folder();};
const DRIVE_SHORT=['Meaning','Accomplishment','Creativity','Ownership','Social influence','Scarcity','Curiosity','Avoidance'];
const BOARD_POSITIONS=[[2,1],[1,1],[3,1],[1,2],[3,2],[1,3],[3,3],[2,3]];
function renderLists(){
 for(const kind of ['feedback','rewards']){
  const data=state[kind];$(kind+'-fields').disabled=!state.created||data.locked;
  $('suggest-'+kind).disabled=!state.created||data.locked;$('set-'+kind).disabled=!state.created||data.locked;$('edit-'+kind).hidden=!data.locked;
  $(kind+'-status').textContent=state.created?'':'Create the repository first.';
 }
 $('feedback-mechanics').value=state.feedback.mechanics;$('feedback-vehicles').value=state.feedback.vehicles;$('reward-list').value=state.rewards.lines;
}
function saveLists(){state.feedback.mechanics=$('feedback-mechanics').value;state.feedback.vehicles=$('feedback-vehicles').value;state.rewards.lines=$('reward-list').value;}
for(const id of ['feedback-mechanics','feedback-vehicles','reward-list'])$(id).oninput=()=>{typingToken++;saveLists();persist();};
$('suggest-feedback').onclick=()=>writeExample([[$('feedback-mechanics'),SUGGESTIONS.feedback.mechanics.join('\n')],[$('feedback-vehicles'),SUGGESTIONS.feedback.vehicles.join('\n')]],saveLists);
$('suggest-rewards').onclick=()=>writeExample([[$('reward-list'),SUGGESTIONS.rewards.join('\n')]],saveLists);
for(const kind of ['feedback','rewards']){
 $(kind+'-form').onsubmit=event=>{event.preventDefault();if(!state.created||state[kind].locked)return;typingToken++;saveLists();
  if(kind==='feedback'?(!state.feedback.mechanics.trim()||!state.feedback.vehicles.trim()):!state.rewards.lines.trim())return;
  state[kind].locked=true;persist();renderLists();folder(['context/'+kind+'.md']);announce(kind+' saved.');
 };
 $('edit-'+kind).onclick=()=>{typingToken++;state[kind].locked=false;persist();renderLists();folder();};
}
function brainstormBoard(){
 $('brainstorm-board').innerHTML='<div class="brainstorm-center" aria-hidden="true"><span>MOVE</span><b>Our ideas</b></div>'+DRIVE_SHORT.map((name,i)=>{
  const ideas=listLines(state.brainstorm[i].lines);
  return '<button type="button" class="drive-cell" style="grid-column:'+BOARD_POSITIONS[i][0]+';grid-row:'+BOARD_POSITIONS[i][1]+'" data-drive="'+i+'" aria-label="Core Drive '+(i+1)+': '+e(DRIVE_NAMES[i])+'" aria-pressed="'+(selectedDrive===i)+'"><small>CD'+(i+1)+'</small><b>'+name+'</b><span>'+e(ideas[0]||'Add ideas')+'</span>'+(ideas.length>1?'<em>+'+(ideas.length-1)+' more</em>':'')+'</button>';
 }).join('');
 $('brainstorm-board').querySelectorAll('button').forEach(b=>b.onclick=()=>{typingToken++;selectedDrive=Number(b.dataset.drive);persist();renderBrainstorm();});
}
function renderBrainstorm(){
 const group=state.brainstorm[selectedDrive];brainstormBoard();$('brainstorm-label').textContent='CD'+(selectedDrive+1)+' · '+DRIVE_NAMES[selectedDrive];$('brainstorm-ideas').value=group.lines;
 $('brainstorm-fields').disabled=!state.created||group.locked;$('suggest-brainstorm').disabled=!state.created||group.locked;$('set-brainstorm').disabled=!state.created||group.locked;$('edit-brainstorm').hidden=!group.locked;
 $('brainstorm-status').textContent=state.created?'':'Create the repository first.';
}
$('brainstorm-ideas').oninput=()=>{typingToken++;state.brainstorm[selectedDrive].lines=$('brainstorm-ideas').value;state.featuresLocked=false;brainstormBoard();persist();};
$('suggest-brainstorm').onclick=()=>writeExample([[$('brainstorm-ideas'),SUGGESTIONS.ideas[selectedDrive].join('\n')]],()=>{state.brainstorm[selectedDrive].lines=$('brainstorm-ideas').value;state.featuresLocked=false;brainstormBoard();});
$('brainstorm-form').onsubmit=event=>{event.preventDefault();const group=state.brainstorm[selectedDrive];if(!state.created||group.locked)return;typingToken++;group.lines=$('brainstorm-ideas').value;group.locked=true;state.featuresLocked=false;persist();renderBrainstorm();renderFeatures();folder(['brainstorm/core-drives.json']);announce('Core Drive '+(selectedDrive+1)+' ideas saved.');};
$('edit-brainstorm').onclick=()=>{typingToken++;state.brainstorm[selectedDrive].locked=false;state.featuresLocked=false;persist();renderBrainstorm();renderFeatures();folder();};
function renderFeatures(){
 const ideas=ideaCatalog(state),scored=scoresReady(state);
 const options=(value,release=false)=>'<option value="">—</option>'+(release?['MVP','V1','V2']:[1,2,3,4,5]).map(n=>'<option value="'+n+'" '+(String(value)===String(n)?'selected':'')+'>'+n+'</option>').join('');
 $('live-feature-rows').innerHTML=ideas.length?ideas.map(idea=>{
  const score=state.featureScores[idea.id]||{};
  return '<tr><th scope="row"><small>CD'+idea.drive+' · '+e(DRIVE_SHORT[idea.drive-1])+'</small><span>'+e(idea.text)+'</span></th>'+['power','ease','release'].map(key=>'<td><select data-idea="'+idea.id+'" data-score="'+key+'" aria-label="'+key[0].toUpperCase()+key.slice(1)+' for '+e(idea.text)+'" '+(state.featuresLocked||(key==='release'&&!scored)?'disabled':'')+'>'+options(score[key],key==='release')+'</select></td>').join('')+'</tr>';
 }).join(''):'<tr><td colspan="4">Set brainstorm ideas to bring them into this table.</td></tr>';
 $('live-feature-rows').querySelectorAll('select').forEach(el=>el.onchange=()=>{
  const id=el.dataset.idea,key=el.dataset.score;
  state.featureScores[id]??={power:null,ease:null,release:''};state.featureScores[id][key]=key==='release'?el.value:(el.value?Number(el.value):null);state.featuresLocked=false;
  persist();renderFeatures();folder();
 });
 $('suggest-scores').disabled=!ideas.length||state.featuresLocked;$('suggest-releases').disabled=!scored||state.featuresLocked;
 $('set-features').disabled=!featuresReady(state)||state.featuresLocked;$('edit-features').hidden=!state.featuresLocked;
 $('features-status').textContent=!ideas.length?'':!scored?'Complete every Power and Ease score to unlock release planning.':!featuresReady(state)?'Choose MVP, V1, or V2 for each idea.':'';
}
$('suggest-scores').onclick=()=>{for(const idea of ideaCatalog(state)){const sample=suggestedScores(idea),score=state.featureScores[idea.id]??={power:null,ease:null,release:''};score.power??=sample.power;score.ease??=sample.ease;}state.featuresLocked=false;persist();renderFeatures();folder();};
$('suggest-releases').onclick=()=>{if(!scoresReady(state))return;for(const idea of ideaCatalog(state)){const score=state.featureScores[idea.id];if(!score.release)score.release=score.power>=4&&score.ease>=4?'MVP':score.power>=3?'V1':'V2';}persist();renderFeatures();};
$('set-features').onclick=()=>{if(!featuresReady(state)||state.featuresLocked)return;state.featuresLocked=true;persist();renderFeatures();folder(['planning/pe-features.json']);announce('Feature list saved.');};
$('edit-features').onclick=()=>{state.featuresLocked=false;persist();renderFeatures();folder();};
function renderPlanning(){renderLists();renderBrainstorm();renderFeatures();}
metricFields.forEach((f,i)=>f.value=state.metrics[i]);for(const [k,f] of Object.entries(axisFields))f.value=state.axes[k];
render();
if(state.created){$('create-repo').textContent='Repository restored';$('create-repo').disabled=true;$('repo-status').textContent='Repository ready.';document.dispatchEvent(new Event('repository-restored'));}
if(state.metricsLocked)$('metrics-status').textContent='Set → context/business-metrics.md. Choose Edit to revise.';
if(state.axesLocked)$('axes-status').textContent='Axes set. All four player types use these dimensions.';
emit();
