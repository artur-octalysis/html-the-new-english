export const PHASES=['Discovery','Onboarding','Scaffolding','Endgame'];
export const DRIVE_NAMES=['Epic Meaning & Calling','Development & Accomplishment','Empowerment of Creativity & Feedback','Ownership & Possession','Social Influence & Relatedness','Scarcity & Impatience','Unpredictability & Curiosity','Loss & Avoidance'];
export const SUGGESTIONS={
 feedback:{mechanics:['An immediate activity-complete confirmation.','Points and a visible weekly progress meter.','A celebration when a personal milestone is reached.','A gentle return prompt at a time the player chooses.'],vehicles:['Fitness tracker home screen and activity history.','Optional push notifications.','Weekly progress email, when opted in.','A coach or activity partner, if the player chooses.']},
 rewards:['Status: a personal consistency badge and an optional shared milestone.','Access: unlock a fresh set of activity routes or challenges.','Power: customize the next weekly goal and choose a challenge theme.','Stuff: a capped partner reward, only after cost and availability are validated.'],
 ideas:[
 ['Connect a weekly movement goal to a personal reason to feel better.','Let a group choose a shared community movement mission.'],
 ['Show a weekly consistency path with reachable milestones.','Celebrate a player’s personal best against their own baseline.'],
 ['Let players create their own Run or Walk challenges.','Offer route choices and show how each choice changes the plan.'],
 ['Build a personal collection of favorite routes.','Let players customize a home screen that reflects their journey.'],
 ['Invite a friend into an optional weekly walking commitment.','Send a supportive reaction when a teammate completes an activity.'],
 ['Offer a seasonal challenge with a clearly stated participation window.','Unlock a new challenge after completing a prerequisite milestone.'],
 ['Reveal an optional new route suggestion after an activity.','Offer a varied weekly discovery mission.'],
 ['Let players protect progress with a flexible recovery day.','Offer an opt-in reminder for a personally chosen commitment.']
 ],

 metrics:[
 'Week-4 active-member retention: 30% → 40% of signups, with qualifying activity on 3 distinct days in week 4.',
 'First-week activation: 40% → 60% of signups log a first 10-minute Run or Walk within 7 days.',
 'Free-to-paid conversion: 3% → 5% of eligible free members within 90 days. Pricing and value need validation.',
 'Referral share: 10% → 20% of newly activated members come through referrals within 90 days.'
 ],
 actions:[
 {lines:['Discover Move through a friend or a short product introduction.','Open the landing page and explore how the tracker works.','Choose to try Move and create an account.'],winState:'Commits to trying the fitness tracker.',metricIds:[2,4]},
 {lines:['Choose a manageable movement goal.','Choose a Run or Walk and plan a first 10-minute activity.','Complete the activity and log it in the tracker.','See progress and choose when to return.'],winState:'Completes the first activity loop.',metricIds:[2]},
 {lines:['Choose the next Run or Walk.','Complete and log a qualifying activity.','Check points and weekly progress.','Return on 3 distinct days each week.','Review the weekly result and plan the next week.'],winState:'Repeats the activity loop consistently through week 4.',metricIds:[1]},
 {lines:['Review progress across several weeks.','Choose a new personal or shared movement goal.','Explore optional premium features and decide whether they are worth paying for.','Invite a friend who would enjoy the experience.','Support the friend’s first activity and continue the habit.'],winState:'Finds a lasting reason to continue, grow, and share.',metricIds:[1,3,4]}
 ],
 axes:{left:'Self-directed',right:'Guided',top:'Shared progress',bottom:'Personal progress'},
 players:[
 {title:'Social explorer',description:'An adult returning to movement who enjoys discovering routes with friends. Wants freedom to choose an activity, shared discoveries, and low-pressure encouragement.',drives:[6,5,9,3,9,2,8,2]},
 {title:'Team regular',description:'An adult rebuilding a routine with a group. Wants a clear weekly plan, a shared commitment, and encouragement when showing up feels difficult.',drives:[6,8,4,4,9,3,3,4]},
 {title:'Independent explorer',description:'An adult who wants movement to fit their own rhythm. Enjoys choosing routes, experimenting with small goals, and seeing personal improvement without comparison.',drives:[4,7,9,6,2,2,8,2]},
 {title:'Personal achiever',description:'An adult who likes a clear path back to fitness. Wants achievable milestones, a structured plan, and private evidence of consistent progress.',drives:[4,9,4,7,3,3,3,4]}
 ]
};
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const emptyPlayer=()=>({title:'',description:'',image:'',drives:Array(8).fill(0),locked:false});
export const emptyPhase=()=>({lines:'',winState:'',metricIds:[],locked:false});
export const initialState=()=>({version:1,created:false,metrics:Array(4).fill(''),metricsLocked:false,axes:{left:'',right:'',top:'',bottom:''},axesLocked:false,players:Array.from({length:4},emptyPlayer),actions:Array.from({length:4},emptyPhase),feedback:{mechanics:'',vehicles:'',locked:false},rewards:{lines:'',locked:false},brainstorm:Array.from({length:8},()=>({lines:'',locked:false})),featureScores:{},featuresLocked:false});
export function quadrant(axes,index){return [(index%2===0?axes.left:axes.right),(index<2?axes.top:axes.bottom)].filter(Boolean).join(' · ');}
export function validImage(value){return typeof value==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)&&value.length<1800000;}
export function readState(value){
 const clean=initialState();if(!value||value.version!==1)return clean;
 clean.created=value.created===true;
 if(Array.isArray(value.metrics)&&value.metrics.length===4)clean.metrics=value.metrics.map(x=>String(x).slice(0,500));
 clean.metricsLocked=clean.created&&value.metricsLocked===true&&clean.metrics.every(x=>x.trim());
 for(const k of Object.keys(clean.axes))clean.axes[k]=String(value.axes?.[k]||'').slice(0,70);
 clean.axesLocked=clean.created&&value.axesLocked===true&&Object.values(clean.axes).every(x=>x.trim());
 clean.players=clean.players.map((p,i)=>{
  const x=value.players?.[i];if(!x)return p;
  p.title=String(x.title||'').slice(0,80);p.description=String(x.description||'').slice(0,900);p.image=validImage(x.image)?x.image:'';
  p.drives=p.drives.map((_,j)=>Math.max(0,Math.min(10,Number(x.drives?.[j])||0)));
  p.locked=clean.axesLocked&&x.locked===true&&!!p.title.trim()&&!!p.description.trim();return p;
 });
 clean.actions=clean.actions.map((phase,i)=>{
  const x=value.actions?.[i];if(!x)return phase;
  phase.lines=String(x.lines||'').slice(0,2500);phase.winState=String(x.winState||'').slice(0,200);
  phase.metricIds=[...new Set(Array.isArray(x.metricIds)?x.metricIds.filter(n=>Number.isInteger(n)&&n>=1&&n<=4):[])];
  phase.locked=!!(clean.metricsLocked&&x.locked===true&&phase.lines.trim()&&phase.winState.trim()&&phase.metricIds.length);return phase;
 });
 clean.feedback={mechanics:String(value.feedback?.mechanics||'').slice(0,4000),vehicles:String(value.feedback?.vehicles||'').slice(0,4000),locked:false};
 clean.feedback.locked=!!(clean.created&&value.feedback?.locked&&clean.feedback.mechanics.trim()&&clean.feedback.vehicles.trim());
 clean.rewards={lines:String(value.rewards?.lines||'').slice(0,4000),locked:false};
 clean.rewards.locked=!!(clean.created&&value.rewards?.locked&&clean.rewards.lines.trim());
 clean.brainstorm=clean.brainstorm.map((group,i)=>({lines:String(value.brainstorm?.[i]?.lines||'').slice(0,6000),locked:!!(clean.created&&value.brainstorm?.[i]?.locked)}));
 for(const idea of ideaCatalog(clean)){
  const score=value.featureScores?.[idea.id];
  if(score)clean.featureScores[idea.id]={power:validScore(score.power)?score.power:null,ease:validScore(score.ease)?score.ease:null,release:['MVP','V1','V2'].includes(score.release)?score.release:''};
 }
 clean.featuresLocked=!!(clean.created&&value.featuresLocked&&featuresReady(clean));
 return clean;
}
export const listLines=text=>String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
export const validScore=n=>Number.isInteger(n)&&n>=1&&n<=5;
export function ideaCatalog(state){
 return (state.brainstorm||[]).flatMap((group,i)=>group.locked?[...new Set(listLines(group.lines))].map(text=>{
  let hash=2166136261;for(const ch of text){hash^=ch.codePointAt(0);hash=Math.imul(hash,16777619);}
  return {id:'CD'+(i+1)+'-'+(hash>>>0).toString(16),drive:i+1,driveName:DRIVE_NAMES[i],text};
 }):[]);
}
export function scoresReady(state){const ideas=ideaCatalog(state);return ideas.length>0&&ideas.every(x=>validScore(state.featureScores[x.id]?.power)&&validScore(state.featureScores[x.id]?.ease));}
export function featuresReady(state){return scoresReady(state)&&ideaCatalog(state).every(x=>['MVP','V1','V2'].includes(state.featureScores[x.id]?.release));}
export function suggestedScores(idea){
 const defaults=[[3,4],[5,4],[4,3],[3,4],[4,3],[2,3],[3,3],[3,4]];
 return {power:defaults[idea.drive-1][0],ease:defaults[idea.drive-1][1]};
}
export function radar(values,{labels=true}={}){
 const point=(i,r)=>{const a=-Math.PI/2+i*Math.PI/4;return [150+Math.cos(a)*r,150+Math.sin(a)*r];};
 const polygon=r=>Array.from({length:8},(_,i)=>point(i,r).join(',')).join(' ');
 // A neutral eight-axis hypothesis chart; not a reproduction of branded framework artwork.
 return '<svg viewBox="0 0 300 300" role="img" aria-label="Eight Core Drive emphasis values from zero to ten"><g fill="none" stroke="#cbdde9">'+[30,60,90].map(r=>'<polygon points="'+polygon(r)+'"/>').join('')+Array.from({length:8},(_,i)=>'<path d="M150 150 L'+point(i,90).join(' ')+'"/>').join('')+'</g><polygon points="'+values.map((v,i)=>point(i,Math.max(0,Math.min(10,v))*9).join(',')).join(' ')+'" fill="#0078fa24" stroke="#005cc2" stroke-width="2.5"/>'+values.map((v,i)=>'<circle cx="'+point(i,v*9)[0]+'" cy="'+point(i,v*9)[1]+'" r="3.5" fill="#005cc2"/>').join('')+(labels?values.map((v,i)=>'<text x="'+point(i,116)[0]+'" y="'+(point(i,116)[1]+4)+'" text-anchor="middle" fill="#00428f" font-family="Arial,sans-serif" font-size="11">CD'+(i+1)+' · '+v+'</text>').join(''):'')+'</svg>';
}
export function profileHTML(player,axes,index){
 const e=escapeHTML;
 return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(player.title)+' — Move player type</title><style>body{font:16px/1.6 system-ui,sans-serif;margin:0;background:#f2f8fd;color:#00428f}main{max-width:740px;margin:40px auto;padding:32px;background:white;border-radius:18px}h1{font-size:40px;line-height:1.1}img{width:100px;height:100px;object-fit:cover;border-radius:16px}svg{max-width:340px;display:block;margin:auto}li{padding:6px 0}small{color:#52667a}p{white-space:pre-wrap}@media(max-width:600px){main{margin:12px;padding:22px}}</style><main><small>MOVE / PLAYER TYPE '+(index+1)+' · WORKSHOP HYPOTHESIS</small><h1>'+e(player.title)+'</h1>'+(validImage(player.image)?'<img src="'+player.image+'" alt="Image selected for '+e(player.title)+'">':'')+'<p>'+e(quadrant(axes,index))+'</p><p>'+e(player.description)+'</p>'+radar(player.drives)+'<ol>'+DRIVE_NAMES.map((n,i)=>'<li>'+e(n)+': <b>'+player.drives[i]+'/10</b></li>').join('')+'</ol><small>Discussion hypotheses, not researched segments or measured scores. Review before using in a real product.</small></main></html>';
}
export function projectFiles(state){
 const files=[];if(!state.created)return files;
 if(state.metricsLocked)files.push({path:'context/business-metrics.md',type:'text/markdown',content:'# Move — Business metrics\n\nStatus: workshop hypotheses; not validated outcomes.\nPriority: highest first.\n\n'+state.metrics.map((m,i)=>(i+1)+'. '+m.trim()).join('\n\n')+'\n\nThese are narrative context. Review dependencies before changing executable qualification or reward rules.\n'});
 if(state.axesLocked)files.push({path:'context/player-axes.json',type:'application/json',content:JSON.stringify({status:'Workshop hypothesis',horizontal:{left:state.axes.left,right:state.axes.right},vertical:{top:state.axes.top,bottom:state.axes.bottom}},null,2)});
 const players=state.players.flatMap((p,i)=>p.locked?[{id:'P'+(i+1),quadrant:quadrant(state.axes,i),title:p.title,description:p.description,image:p.image,coreDrives:DRIVE_NAMES.map((name,j)=>({id:j+1,name,emphasis:p.drives[j]}))}]:[]);
 if(players.length)files.push({path:'context/player-types.json',type:'application/json',content:JSON.stringify({status:'Workshop hypotheses; scores are discussion inputs',players},null,2)});
 state.players.forEach((p,i)=>{if(p.locked)files.push({path:'players/player-'+(i+1)+'.html',type:'text/html',content:profileHTML(p,state.axes,i)});});
 const phases=(state.actions||[]).flatMap((phase,i)=>phase.locked?[{
  phase:PHASES[i],order:i+1,actions:phase.lines.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((text,j)=>({id:'DA'+(i+1)+'.'+(j+1),text})),
  winState:phase.winState,metricIds:phase.metricIds.map(n=>'M'+n)
 }]:[]);
 if(state.metricsLocked&&phases.length)files.push({path:'context/desired-actions.json',type:'application/json',content:JSON.stringify({status:'Workshop hypotheses',metrics:state.metrics.map((text,i)=>({id:'M'+(i+1),text})),phases},null,2)});
 if(state.feedback?.locked)files.push({path:'context/feedback.md',type:'text/markdown',content:'# Feedback\n\n## Mechanics\n'+listLines(state.feedback.mechanics).map(x=>'- '+x).join('\n')+'\n\n## Vehicles\n'+listLines(state.feedback.vehicles).map(x=>'- '+x).join('\n')+'\n'});
 if(state.rewards?.locked)files.push({path:'context/rewards.md',type:'text/markdown',content:'# Rewards\n\n'+listLines(state.rewards.lines).map(x=>'- '+x).join('\n')+'\n'});
 if(state.brainstorm?.some(x=>x.locked))files.push({path:'brainstorm/core-drives.json',type:'application/json',content:JSON.stringify({status:'Workshop ideas; validate with player and client context',coreDrives:state.brainstorm.flatMap((g,i)=>g.locked?[{id:i+1,name:DRIVE_NAMES[i],ideas:ideaCatalog(state).filter(x=>x.drive===i+1).map(({id,text})=>({id,text}))}]:[])},null,2)});
 if(state.featuresLocked&&featuresReady(state))files.push({path:'planning/pe-features.json',type:'application/json',content:JSON.stringify({scale:{power:'1–5: expected impact on desired actions and business metrics',ease:'1–5: higher means easier to deliver'},features:ideaCatalog(state).map(x=>({...x,...state.featureScores[x.id]}))},null,2)});
 return files;
}
// Small uncompressed ZIP writer: no server, third-party runtime, or upload required.
export function zipFiles(files){
 const encode=new TextEncoder(),parts=[],central=[];let offset=0;
 const crc32=bytes=>{let c=0xffffffff;for(const byte of bytes){c^=byte;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 const header=(size,values)=>{const a=new Uint8Array(size),v=new DataView(a.buffer);for(const [o,n,w] of values)w===4?v.setUint32(o,n,true):v.setUint16(o,n,true);return a;};
 for(const f of files){
  const name=encode.encode(f.path),data=encode.encode(f.content),crc=crc32(data);
  const h=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[12,33,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]);
  parts.push(h,name,data);
  const c=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[14,33,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]);
  central.push(c,name);offset+=h.length+name.length+data.length;
 }
 const centralSize=central.reduce((n,a)=>n+a.length,0);
 const end=header(22,[[0,0x06054b50,4],[8,files.length,2],[10,files.length,2],[12,centralSize,4],[16,offset,4]]);
 const all=[...parts,...central,end],out=new Uint8Array(all.reduce((n,a)=>n+a.length,0));let pos=0;
 for(const a of all){out.set(a,pos);pos+=a.length;}return out;
}
