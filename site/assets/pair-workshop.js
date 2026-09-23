import {renderMarkdown} from './markdown-reader.js';
import {steps,terminalCommands} from './chat-build-model.js';
const $=id=>document.getElementById(id);
const repo='https://github.com/artur-octalysis/html-the-new-english';
const cloud='https://html-workshop-api.vercel.app/api/workshop';
let cloudToken=null,authPopup=null,authNonce=null;
function cloudURL(action,params={}){const url=new URL(cloud);url.searchParams.set('action',action);for(const [key,value] of Object.entries(params))url.searchParams.set(key,value);return url.href;}
function authHeaders(){return cloudToken?{Authorization:'Bearer '+cloudToken}:{};}
function endpoint(action,params={}){return realSession?.mode==='hosted'?cloudURL(action,params):'/api/'+action+(Object.keys(params).length?'?'+new URLSearchParams(params):'');}
let sources=null,stage=-1,records=[],selectedPair='dirk-chris',realSession=null;
let setupMode='ai',busy=false,draftURL=null,folderPath='pairs',front=2,previewIsDraft=false;
const folds=[...document.querySelectorAll('.fold')];
function status(text){$('chat-operation').textContent=text;}
const operation=document.createElement('p');operation.id='chat-operation';operation.setAttribute('role','status');operation.className='caption';$('chat-form').after(operation);
function prompt(){ $('conflict-path').textContent='pairs/'+selectedPair+'/index.html'; $('setup-prompt').textContent=`Help me join this workshop using this local AI coding session. My pair is ${selectedPair}.

1. Check Git and GitHub CLI (gh). Guide me through missing setup and GitHub browser sign-in; never ask for credentials in chat.
2. Clone https://github.com/artur-octalysis/html-the-new-english into a new folder, or safely reuse an existing clone. Check my Git commit name and email.
3. Check push permission. If needed, prepare my fork and keep the original repository as upstream. Explain the remotes.
4. Create or resume pair/${selectedPair}. Read pairs/${selectedPair}/README.md. Work only in that pair folder.
5. Show the local path and branch. If index.html is missing, wait for the presenter’s handout. Do not push yet.`;
 $('handoff-prompt').textContent=`Help our pair, ${selectedPair}, submit our fitness tracker prototype. Update our README, commit, and open a pull request.

1. Inspect the current branch, remotes, and local changes. Work on pair/${selectedPair}; preserve unrelated work.
2. Update pairs/${selectedPair}/README.md with our motivation hypothesis, what changed, checks actually performed, known limitations, and the next step. Ask us for any missing information; do not invent test results.
3. Test the prototype against the brief’s acceptance checks and review the diff. Fix issues within our pair folder.
4. Stage and commit only our intended changes in pairs/${selectedPair}/. Push our pair branch to the appropriate remote; use our fork if we lack write access. Do not force-push.
5. Open a pull request to artur-octalysis/html-the-new-english, targeting main. Explain the improvement and validation. If a PR already exists for this branch, update it instead. Return its link and check status. Leave merging to the presenter.`;
 $('handoff-status').textContent='';
 $('terminal-commands').textContent=terminalCommands(selectedPair);
 $('sync-prompt').textContent=`I’m on pair/${selectedPair}. The presenter has merged the starter into the original repository’s main branch. Inspect my remotes and local changes first. Preserve my work, fetch main from artur-octalysis/html-the-new-english, then merge it into my current pair branch. Use upstream for a fork or origin for a direct clone. Do not reset or force-push. Confirm pairs/${selectedPair}/index.html exists and open it locally.`;
}
function selectSetup(mode){setupMode=mode;for(const name of ['ai','terminal']){const active=name===mode;$(name+'-tab').setAttribute('aria-selected',String(active));$(name+'-tab').tabIndex=active?0:-1;$(name+'-setup').hidden=!active;}$('copy-prompt').textContent=mode==='ai'?'Copy setup prompt':'Copy terminal commands';$('copy-status').textContent='';}
for(const mode of ['ai','terminal']){$(mode+'-tab').onclick=()=>selectSetup(mode);$(mode+'-tab').onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'ai':event.key==='End'?'terminal':mode==='ai'?'terminal':'ai';selectSetup(next);$(next+'-tab').focus();}};}
$('copy-prompt').onclick=async()=>{try{await navigator.clipboard.writeText($(setupMode==='ai'?'setup-prompt':'terminal-commands').textContent);$('copy-status').textContent='Copied.';}catch{$('copy-status').textContent='Select the text above and copy it manually.';}};
function raise(windowEl){windowEl.style.zIndex=String(++front);}
function openWindow(id){$(id).hidden=false;raise($(id));}
function desktopOpen(buttonId,windowId){const button=$(buttonId);const open=()=>{if(windowId==='browser-window'&&stage>=0&&$('live-app').hidden)openFile('workshop/live/index.html');else openWindow(windowId);};button.ondblclick=open;button.onclick=event=>{if(event.detail===0||matchMedia('(pointer: coarse)').matches)open();};}
desktopOpen('folder-icon','repo-panel');desktopOpen('browser-icon','browser-window');desktopOpen('github-icon','github-window');
$('close-github').onclick=()=>$('github-window').hidden=true;
$('close-repo').onclick=()=>$('repo-panel').hidden=true;$('close-browser').onclick=()=>$('browser-window').hidden=true;
function setFolder(path='pairs'){folderPath=path;$('draft-tree').hidden=path!=='live';$('repo-tree').hidden=path!=='pairs';$('pairs-path').setAttribute('aria-pressed',String(path==='pairs'));$('live-path').setAttribute('aria-pressed',String(path==='live'));$('folder-github').href=repo+'/tree/'+(path==='live'&&realSession?.branch?realSession.branch:'main')+'/'+(path==='live'?'workshop/live':'pairs');}
$('pairs-path').onclick=()=>setFolder('pairs');$('live-path').onclick=()=>setFolder('live');
function renderDraft(){const tree=$('draft-tree');tree.replaceChildren();if(stage<0){const empty=document.createElement('p');empty.className='folder-empty';empty.textContent='Run the first prompt to create index.html here.';tree.append(empty);return;}const row=document.createElement('button');row.className='file-row draft-file';row.textContent='index.html';row.title='Double-click to open in browser';row.ondblclick=()=>openFile('workshop/live/index.html');row.onclick=event=>{if(event.detail===0||matchMedia('(pointer: coarse)').matches)openFile('workshop/live/index.html');};tree.append(row);}
function showFile(path,content,download,github){renderMarkdown($('file-content'),content);$('file-title').textContent=path;$('file-download').href=download;$('file-github').hidden=!github;if(github)$('file-github').href=github;openWindow('reader-window');}
async function openFile(path){try{const response=await fetch(realSession?endpoint('file',{path}):path,{cache:'no-store',headers:authHeaders()});if(!response.ok)throw Error();const content=await response.text();if(path.endsWith('.html')){$('live-app').removeAttribute('src');$('live-app').srcdoc=content;$('live-app').hidden=false;$('browser-empty').hidden=true;$('browser-address').textContent=path;$('preview-stage').textContent=path==='workshop/live/index.html'&&stage>=0?steps[Math.min(stage,2)].label:'Pair prototype';previewIsDraft=path==='workshop/live/index.html';openWindow('browser-window');}else {if(draftURL)URL.revokeObjectURL(draftURL);draftURL=URL.createObjectURL(new Blob([content],{type:'text/plain'}));showFile(path,content,draftURL,repo+'/blob/main/'+path);}}catch{status('Could not open this file. Check your connection and try again.');}}
async function loadFiles(){try{const response=await fetch(realSession?endpoint('tree'):'repo-files.json?refresh='+Date.now(),{cache:'no-store',headers:authHeaders()});if(!response.ok)throw Error();const manifest=await response.json();const previousFolders=new Map([...document.querySelectorAll('.pair-folder')].map(folder=>[folder.querySelector('summary').textContent,folder.open]));$('repo-tree').replaceChildren();if(!$('pair-select').options.length){for(const pair of manifest.pairs){const option=document.createElement('option');option.value=pair.id;option.textContent=pair.team;$('pair-select').append(option);}prompt();}
for(const pair of manifest.pairs){const folder=document.createElement('details');folder.className='pair-folder';folder.open=previousFolders.has(pair.id+'/')?previousFolders.get(pair.id+'/'):pair.id===selectedPair;const summary=document.createElement('summary');summary.textContent=pair.id+'/';folder.append(summary);for(const path of pair.files){const button=document.createElement('button');button.className='file-row';button.textContent=path.replace('pairs/'+pair.id+'/','');button.onclick=event=>{if(!path.endsWith('.html')||event.detail===0||matchMedia('(pointer: coarse)').matches)openFile(path);};button.ondblclick=()=>{if(path.endsWith('.html'))openFile(path);};folder.append(button);}$('repo-tree').append(folder);}
if(realSession){Object.assign(realSession,manifest);if(stage!==manifest.stage){stage=manifest.stage;restoreConversation();}}renderDraft();setFolder(folderPath);}catch{status('Could not load repository files. Check your connection.');}}
$('close-file').onclick=()=>$('reader-window').hidden=true;
$('pair-select').onchange=()=>{selectedPair=$('pair-select').value;prompt();$('copy-status').textContent='';for(const folder of document.querySelectorAll('.pair-folder'))folder.open=folder.querySelector('summary').textContent===selectedPair+'/';};
$('copy-handoff').onclick=async()=>{try{await navigator.clipboard.writeText($('handoff-prompt').textContent);$('handoff-status').textContent='Copied. Paste into your local AI coding session.';}catch{$('handoff-status').textContent='Select the prompt above and copy it manually.';}};
$('copy-sync').onclick=async()=>{try{await navigator.clipboard.writeText($('sync-prompt').textContent);$('sync-status').textContent='Copied. Paste into your local AI coding session.';}catch{$('sync-status').textContent='Select and copy the prompt above.';}};
const finalStep={prompt:'Put one copy of this screen in each pair’s folder, then push it to GitHub.',label:'Copy · push · merge',reply:'Copied the screen into all five pair folders and merged the validated handout into main. Each pair can now sync their local branch.'};
const conversationSteps=[...steps,finalStep];
function updateComposer(){const next=conversationSteps[stage+1];$('chat-count').textContent=(stage+1)+' / 4';$('chat-prompt').value=next?.prompt||'Ready. Let’s sync everyone’s local branch.';$('chat-step-label').textContent=next?String(stage+2).padStart(2,'0')+' / '+next.label:'The handout is on main';$('chat-run').disabled=busy||!next||!sources||!realSession;$('chat-run').textContent=busy?'Working…':next?'Run ↑':'Complete ✓';}
function message(text,type){const row=document.createElement('div');row.className='chat-message '+type;const label=document.createElement('span');label.textContent=type==='user'?'YOU':'ASSISTANT';const body=document.createElement('p');body.textContent=text;row.append(label,body);$('chat-messages').append(row);$('chat-messages').scrollTop=$('chat-messages').scrollHeight;return row;}
function restoreConversation(){$('chat-messages').replaceChildren();if(stage<0){const welcome=document.createElement('div');welcome.className='chat-welcome';welcome.textContent='Let’s build something we can try.';$('chat-messages').append(welcome);}else for(let i=0;i<=Math.min(stage,3);i++){message(conversationSteps[i].prompt,'user');message(conversationSteps[i].reply,'assistant');}updateComposer();}
async function mutation(path,body){const response=await fetch(endpoint(path.replace('/api/','')),{method:'POST',headers:{'Content-Type':'application/json',...(realSession.mode==='hosted'?authHeaders():{'X-Workshop-Session':realSession.token})},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw Error(data.error||'Repository operation failed.');return data;}
async function waitForPublish(){for(;;){await new Promise(resolve=>setTimeout(resolve,1500));let state;if(realSession.mode==='hosted'){state=await mutation('/api/progress',{});}else{const response=await fetch('/api/tree',{cache:'no-store'});if(!response.ok)throw Error('Lost the workspace connection. Reopen it to check the operation.');state=await response.json();}status(state.message);if(!state.busy){if(state.error)throw Error(state.error);return state;}}}
$('chat-form').onsubmit=async event=>{event.preventDefault();if(busy||!realSession||!sources||stage>=3)return;busy=true;const next=stage+1;$('chat-messages').querySelector('.chat-welcome')?.remove();message(conversationSteps[next].prompt,'user');updateComposer();const thinking=message(next===3?'Publishing the real files':'Thinking','thinking');const dots=document.createElement('span');dots.className='thinking-dots';dots.innerHTML='<i></i><i></i><i></i>';thinking.append(dots);try{
let result;if(next===3){await mutation('/api/publish',{});result=await waitForPublish();}else{[result]=await Promise.all([mutation('/api/build',{stage:next}),new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1200))]);}
Object.assign(realSession,result);stage=result.stage;thinking.remove();message(conversationSteps[next].reply,'assistant');await loadFiles();openWindow('repo-panel');setFolder(next===3?'pairs':'live');if(next>0&&next<3){await openFile('workshop/live/index.html');}status(next===3?'Merged. GitHub Pages deploys automatically.': '');
}catch(error){thinking.remove();message(error.message,'assistant');status('Operation stopped. Completed file changes are preserved.');}finally{busy=false;updateComposer();}};
function renderRows(){$('activity-rows').replaceChildren();records.forEach((row,i)=>{const tr=document.createElement('tr');for(const value of [i+1,row.type,row.minutes]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}$('activity-rows').append(tr);});$('data-status').textContent=records.length?records.length+' record(s) in this demo. Reloading or applying code clears them.':'No records yet. Log a walk or run.';}
window.addEventListener('message',event=>{if(event.source!==$('live-app').contentWindow||event.data?.source!=='move-starter')return;const a=event.data.activity;if(!a||!['Walk','Run'].includes(a.type)||!Number.isInteger(a.minutes)||a.minutes<1||a.minutes>300)return;records.push({type:a.type,minutes:a.minutes});records=records.slice(-100);renderRows();});
function selectGitHubView(view){if(view==='conflict')$('github-current-branch').textContent='artur/heading';else gitStep(gitCurrent);for(const name of ['flow','conflict']){const active=view===name;$('github-'+name+'-view').hidden=!active;$('github-'+name+'-tab').setAttribute('aria-selected',String(active));$('github-'+name+'-tab').tabIndex=active?0:-1;}}
for(const name of ['flow','conflict']){const tab=$('github-'+name+'-tab');tab.onclick=()=>selectGitHubView(name);tab.onkeydown=event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'flow':event.key==='End'?'conflict':name==='flow'?'conflict':'flow';selectGitHubView(next);$('github-'+next+'-tab').focus();}};}

let conflictResolved=false,conflictCommitted=false;
function conflictEdit(){conflictResolved=false;conflictCommitted=false;const heading=$('conflict-heading').value.trim();$('conflict-result').textContent=heading?'<h1>'+heading+'</h1>':'Choose the heading to keep.';$('mark-resolved').disabled=!heading;$('commit-resolution').disabled=true;$('conflict-file-state').textContent='Conflict';$('conflict-title').textContent='1 file needs a decision';$('conflict-message').textContent='Preview the chosen wording, then mark this file as resolved.';$('github-window').dataset.conflict='pending';}
$('conflict-heading').addEventListener('input',conflictEdit);
for(const [id,heading] of [['choose-artur','Every step is progress.'],['choose-pair','Your next small win.']])$(id).onclick=()=>{$('conflict-heading').value=heading;conflictEdit();};
$('mark-resolved').onclick=()=>{if(!$('conflict-heading').value.trim())return;conflictResolved=true;$('mark-resolved').disabled=true;$('commit-resolution').disabled=false;$('conflict-file-state').textContent='Resolved';$('conflict-title').textContent='The conflict is resolved';$('conflict-message').textContent='The file now contains one agreed heading. Test the result, then commit the resolution.';$('github-window').dataset.conflict='resolved';};
$('commit-resolution').onclick=()=>{if(!conflictResolved)return;conflictCommitted=true;$('commit-resolution').disabled=true;$('conflict-heading').disabled=true;$('choose-artur').disabled=true;$('choose-pair').disabled=true;$('conflict-file-state').textContent='Committed';$('conflict-title').textContent='Resolution committed · simulation';$('conflict-message').textContent='Next in the real workflow: push this branch, rerun checks, and merge its pull request after review. No real commit was made here.';$('replay-conflict').hidden=false;$('github-window').dataset.conflict='committed';};
$('replay-conflict').onclick=()=>{$('conflict-heading').disabled=false;$('choose-artur').disabled=false;$('choose-pair').disabled=false;$('conflict-heading').value='';$('replay-conflict').hidden=true;conflictEdit();};
function updateGitHubStep(step){
 const branch='pair/'+selectedPair;
 const views=[
 ['MAIN','Shared repository','The shared version is on main. The pair has not created a branch yet.','main','Unchanged','<h1>Every move counts.</h1>','Latest commit · Shared fitness tracker'],
 ['BRANCH','A separate place to work','The pair switches to a new branch and saves its first change. Main remains unchanged.',branch,'1 commit','<h1>Every move counts.</h1>','Branch created · '+branch+' from main'],
 ['DIFF','Review the changed line','The diff compares the proposed heading with the shared version.',branch,'1 file changed','− <h1>Every move counts.</h1>\n+ <h1>Your next small win.</h1>','Changes · pairs/'+selectedPair+'/index.html'],
 ['PULL REQUEST','Ready for review','Propose merging the pair branch into main. Review and checks must pass first.',branch,'Open PR','base: main ← compare: '+branch,'Pull request · Improve the fitness tracker heading'],
 ['MERGED','The reviewed change is on main','The pull request has been merged. The shared file now includes the chosen heading.','main','Merged','<h1>Your next small win.</h1>','Merged pull request · '+branch+' → main'],
 ['HISTORY','Branch deleted. Work retained.','The finished branch name is gone. Its merged contribution remains in the shared history.','main','Branch deleted','<h1>Your next small win.</h1>','History · Merged change retained on main']
 ];
 const [badge,title,copy,current,fileBadge,code,event]=views[step];$('github-step-badge').textContent=badge;$('github-step-title').textContent=title;$('github-step-copy').textContent=copy;$('github-current-branch').textContent=current;$('github-step-file').textContent='pairs/'+selectedPair+'/index.html';$('github-file-badge').textContent=fileBadge;const codeView=$('github-step-code');codeView.replaceChildren();if(step===2){for(const [index,line] of code.split('\n').entries()){const row=document.createElement('span');row.className=index===0?'diff-removed':'diff-added';row.textContent=line;codeView.append(row);}}else codeView.textContent=code;codeView.classList.toggle('app-diff',step===2);$('github-step-event').textContent=event;$('github-pr-status').hidden=step!==3;$('github-review-state').textContent=gitApproved?'Approved':'Pending';$('github-check-state').textContent=gitApproved?'Passed':'Pending';$('github-merge-state').textContent=gitApproved?'Ready to merge':'Blocked';$('github-window').dataset.gitStep=String(step);
}
const descriptions=[
'Main is the shared line of work. Its blue dots represent saved commits. No pair branch exists yet.',
'Create a pair branch from main, then save your first change as a commit. The orange path shows your separate work; main stays available.',
'Save another change and inspect the diff. Red shows removed text; green shows added text. A diff is a comparison, not a Git operation that creates a commit.',
'Open a pull request to propose bringing the pair’s work into main. Review and required checks form the gate: approve this illustrated review to unlock Merge.',
'Merge the approved work into main. The orange path joins the shared line, making the reviewed changes part of the shared version.',
'Delete the finished branch name after merging. The dashed path represents completed work, not an active branch. The merged changes remain on main; deleting the branch does not undo them.'
];
let gitCurrent=0,gitApproved=false,gitMerged=false,gitPhase=0;
const flowStages=[0,1,2,3,3,3,4,5];
const flowActions=['Create branch','Commit change & view diff','Create pull request','Review changes','Approve review','Merge pull request','Delete branch'];
function gitStep(i){
 gitCurrent=i;updateGitHubStep(i);
 const graph=$('git-graph');graph.dataset.step=String(i);graph.classList.toggle('is-approved',gitApproved);graph.setAttribute('aria-label',descriptions[i]);$('git-detail').textContent=descriptions[i];$('diff-view').hidden=i!==2;
 for(const item of document.querySelectorAll('[data-timeline]')){const n=Number(item.dataset.timeline);item.classList.toggle('is-complete',n<gitPhase);item.classList.toggle('is-current',n===gitPhase);if(n===gitPhase)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');}
 $('github-next').hidden=gitPhase===7;$('github-next').textContent=flowActions[gitPhase]||'Complete';$('github-replay').hidden=gitPhase===0;
 if(i===3){
  const reviewing=gitPhase===4;
  $('github-step-title').textContent=gitApproved?'Approved · ready to merge':reviewing?'Review the proposed change':'Pull request opened';
  $('github-step-copy').textContent=gitApproved?'The reviewer approved the change and the simulated checks passed. Merge is now available.':reviewing?'Compare the removed and added lines before approving. In a team, another person reviews the author’s work.':'The pair proposes bringing its change into main. Open the review to inspect it.';
  $('github-review-state').textContent=gitApproved?'Approved':reviewing?'In review':'Requested';
  $('github-check-state').textContent=gitPhase>=4?'Passed (simulated)':'Pending';
  if(reviewing){const code=$('github-step-code');code.replaceChildren();code.classList.add('app-diff');for(const [cls,line] of [['diff-removed','− <h1>Every move counts.</h1>'],['diff-added','+ <h1>Your next small win.</h1>']]){const row=document.createElement('span');row.className=cls;row.textContent=line;code.append(row);}}
  $('git-detail').textContent=gitApproved?'Review approved and simulated checks passed. Merge the pull request in the GitHub window.':reviewing?'Review the actual changed lines. Approval is a separate decision from opening a pull request.':'The pull request is open. Start the review in the GitHub window.';
 }
}
$('github-next').onclick=()=>{if(gitPhase>=7)return;gitPhase++;gitApproved=gitPhase>=5;gitMerged=gitPhase>=6;gitStep(flowStages[gitPhase]);};
$('github-replay').onclick=()=>{gitPhase=0;gitApproved=false;gitMerged=false;gitStep(0);};
gitStep(0);
let remaining=720,end=0,ticking=null;
function timerPaint(){$('timer').textContent=Math.floor(remaining/60).toString().padStart(2,'0')+':'+(remaining%60).toString().padStart(2,'0');}
function stopTimer(){clearInterval(ticking);ticking=null;$('timer-toggle').textContent='Resume practice';}
$('timer-toggle').onclick=()=>{if(ticking){stopTimer();return;}if(remaining===0)remaining=720;end=Date.now()+remaining*1000;$('timer-toggle').textContent='Pause practice';ticking=setInterval(()=>{remaining=Math.max(0,Math.ceil((end-Date.now())/1000));timerPaint();if(!remaining){stopTimer();$('timer-toggle').textContent='Practice complete';}},250);};
$('timer-reset').onclick=()=>{stopTimer();remaining=720;timerPaint();$('timer-toggle').textContent='Start practice';};
// Windows move only within the desktop. Title bars also support keyboard movement.
function positionWindow(el,x,y){const area=$('desktop');el.style.left=Math.round(Math.max(0,Math.min(x,area.clientWidth-el.offsetWidth)))+'px';el.style.top=Math.round(Math.max(0,Math.min(y,area.clientHeight-el.offsetHeight)))+'px';el.style.right='auto';}
for(const el of document.querySelectorAll('.desktop-window')){el.addEventListener('pointerdown',()=>raise(el));const bar=el.querySelector('.window-titlebar');let drag=null;bar.addEventListener('pointerdown',event=>{if(event.target.closest('button')||event.button!==0||innerWidth<=800)return;const rect=el.getBoundingClientRect(),area=$('desktop').getBoundingClientRect();drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left-area.left,top:rect.top-area.top};bar.setPointerCapture(event.pointerId);el.classList.add('dragging');event.preventDefault();});bar.addEventListener('pointermove',event=>{if(!drag||drag.pointer!==event.pointerId)return;positionWindow(el,drag.left+event.clientX-drag.x,drag.top+event.clientY-drag.y);});const end=()=>{drag=null;el.classList.remove('dragging');};bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);bar.addEventListener('lostpointercapture',end);bar.addEventListener('keydown',event=>{if(event.target!==bar||!event.key.startsWith('Arrow')||innerWidth<=800)return;event.preventDefault();event.stopPropagation();const step=event.shiftKey?30:10;positionWindow(el,el.offsetLeft+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0),el.offsetTop+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0));});}
let current=-1;
const reduceScrollMotion=matchMedia('(prefers-reduced-motion: reduce)');
// Each fold has a stationary reveal stage and a separate scroll interval.
for(const fold of folds){const stage=document.createElement('div');stage.className='fold-stage';stage.append(fold.querySelector('.content'));fold.append(stage);}
const smooth=value=>{const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);};
function updateFoldFades(){
 const height=innerHeight,reduced=reduceScrollMotion.matches;
 document.documentElement.classList.toggle('focus-scroll',!reduced);
 for(const fold of folds){
  const stage=fold.querySelector('.fold-stage');
  const stageHeight=stage.offsetHeight;
  fold.style.height=reduced?'':(stageHeight+(fold===folds.at(-1)?0:height*.78))+'px';
  const rect=fold.getBoundingClientRect();
  const enter=smooth((height*.72-rect.top)/(height*.55));
  const leave=smooth((rect.bottom-height*1.04)/(height*.48));
  const opacity=reduced?1:Math.min(enter,fold===folds.at(-1)?1:leave);
  fold.style.setProperty('--fold-opacity',opacity.toFixed(3));
  fold.style.setProperty('--fold-blur',((1-opacity)*16).toFixed(2)+'px');
  fold.style.setProperty('--stage-top',Math.min(0,height-stageHeight)+'px');
  // Cancel the incoming slide's scroll movement while it resolves into focus.
  fold.style.setProperty('--reveal-offset',(!reduced?-Math.max(0,rect.top):0)+'px');
  stage.style.pointerEvents=opacity<.08?'none':'';
 }
}
reduceScrollMotion.addEventListener('change',updateFoldFades);
function track(){updateFoldFades();let index=0;for(let i=0;i<folds.length;i++)if(folds[i].getBoundingClientRect().top<innerHeight*.48)index=i;if(current===index)return;current=index;const fold=folds[index];$('chapter-count').textContent=String(index+1).padStart(2,'0')+' / '+folds.length;$('desktop').hidden=fold.id==='architecture';if(fold.id==='database'&&stage>=0){if(!previewIsDraft)openFile('workshop/live/index.html');else openWindow('browser-window');}if(innerWidth<=800){fold.querySelector('.content').append($('desktop'));}else if($('desktop').parentElement!==document.body)document.body.append($('desktop'));}
let scrollFrame=0;window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;track();});},{passive:true});window.addEventListener('resize',()=>{for(const el of document.querySelectorAll('.desktop-window')){el.style.left='';el.style.top='';el.style.right='';}current=-1;track();});
document.addEventListener('keydown',event=>{if(event.target.closest('input,textarea,select,button,dialog,.window-titlebar')||event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();folds[Math.max(0,Math.min(folds.length-1,current+(event.key==='ArrowRight'?1:-1)))].scrollIntoView();}});
function authUI(){$('presenter-connection').hidden=!!realSession;$('github-signin').textContent=cloudToken?'Sign out · '+(realSession?.user?.login||'GitHub'):'Sign in with GitHub';updateComposer();}
async function completeSignIn(data){cloudToken=data.session;try{const response=await fetch(cloudURL('session'),{headers:authHeaders(),cache:'no-store'});const session=await response.json();if(!response.ok)throw Error(session.error||'Could not sign in.');realSession=session;stage=session.stage;busy=session.busy;restoreConversation();authUI();await loadFiles();if(busy){const state=await waitForPublish();Object.assign(realSession,state);stage=state.stage;busy=false;restoreConversation();await loadFiles();}status('');}catch(error){cloudToken=null;realSession=null;busy=false;authUI();status(error.message);}}
window.addEventListener('message',event=>{if(event.origin!==new URL(cloud).origin||event.source!==authPopup||event.data?.type!=='workshop-signin'||event.data.nonce!==authNonce)return;authNonce=null;completeSignIn(event.data);});
$('github-signin').onclick=async()=>{if(cloudToken){try{await fetch(cloudURL('logout'),{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:'{}'});}finally{cloudToken=null;realSession=null;stage=-1;busy=false;restoreConversation();authUI();await loadFiles();}return;}
authNonce=crypto.randomUUID().replaceAll('-','');authPopup=window.open(cloudURL('login',{nonce:authNonce,origin:location.origin}),'workshop-github-signin','popup,width=620,height=760');if(!authPopup){status('Allow the GitHub sign-in popup, then try again.');return;}status('Complete GitHub sign-in in the new window.');};
try{const response=await fetch('starter-source.json');if(!response.ok)throw Error();sources=await response.json();}catch{status('Starter source unavailable. Refresh the page.');}
try{if(['127.0.0.1','localhost'].includes(location.hostname)){const response=await fetch('/api/session',{cache:'no-store'});if(response.ok){const session=await response.json();if(session.mode==='presenter'){realSession=session;stage=session.stage;busy=session.busy;restoreConversation();if(busy)waitForPublish().then(async state=>{Object.assign(realSession,state);stage=state.stage;busy=false;restoreConversation();await loadFiles();}).catch(error=>{busy=false;status(error.message);updateComposer();});}}}}catch{}
authUI();updateComposer();await loadFiles();await document.fonts.ready;const initialFold=folds.find(fold=>'#'+fold.id===location.hash);if(initialFold)initialFold.scrollIntoView({behavior:'instant'});track();setInterval(()=>{if(!busy&&!document.hidden)loadFiles();},15000);
