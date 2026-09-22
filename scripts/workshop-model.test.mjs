import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,readState,projectFiles,profileHTML,SUGGESTIONS,zipFiles,ideaCatalog,scoresReady,featuresReady} from '../site/assets/workshop-model.js';
test('empty folder and draft decisions create no files; setting creates portable artifacts',()=>{
 const s=initialState();s.created=true;
 assert.deepEqual(projectFiles(s),[]);
 s.metrics=[...SUGGESTIONS.metrics];assert.equal(projectFiles(s).length,0);
 s.metricsLocked=true;assert.match(projectFiles(s)[0].content,/Week-4/);
 s.axes={...SUGGESTIONS.axes};s.axesLocked=true;
 s.players[0]={...SUGGESTIONS.players[0],locked:true,image:''};
 const files=projectFiles(s);assert.deepEqual(files.map(f=>f.path),['context/business-metrics.md','context/player-axes.json','context/player-types.json','players/player-1.html']);
 const saved=JSON.parse(files[2].content);assert.equal(saved.players[0].coreDrives.length,8);
 assert.equal(saved.players[0].quadrant,'Self-directed · Shared progress');
});
test('restored state validates dependencies and bounds instead of trusting local storage',()=>{
 const s=initialState();s.created=true;s.players[0]={title:'A',description:'B',drives:[999,-3],image:'javascript:alert(1)',locked:true};
 const clean=readState(s);assert.equal(clean.players[0].locked,false);assert.deepEqual(clean.players[0].drives,[10,0,0,0,0,0,0,0]);assert.equal(clean.players[0].image,'');
 assert.equal(readState({version:400,created:true}).created,false);
});
test('generated player HTML escapes user text and rejects executable image URLs',()=>{
 const html=profileHTML({title:'<script>alert(1)</script>',description:'<img src=x onerror=alert(1)>',drives:Array(8).fill(5),image:'javascript:alert(1)'},SUGGESTIONS.axes,0);
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(!html.includes('src="javascript:'));
});
test('zip directory preserves all UTF-8 filenames and file contents',()=>{
 const files=[{path:'context/metrics.md',content:'Progress → habit'},{path:'players/player-1.html',content:'<h1>Explorer</h1>'}];
 const zip=zipFiles(files),view=new DataView(zip.buffer);assert.equal(view.getUint32(0,true),0x04034b50);
 const end=zip.length-22;assert.equal(view.getUint32(end,true),0x06054b50);assert.equal(view.getUint16(end+10,true),2);
 let pos=0;const decoder=new TextDecoder();
 for(const f of files){const size=view.getUint32(pos+18,true),len=view.getUint16(pos+26,true);assert.equal(decoder.decode(zip.slice(pos+30,pos+30+len)),f.path);assert.equal(decoder.decode(zip.slice(pos+30+len,pos+30+len+size)),f.content);pos+=30+len+size;}
 assert.equal(view.getUint32(pos,true),0x02014b50);
});
test('desired actions preserve phase order, win-states and metric references in exports',()=>{
 const s=initialState();s.created=true;s.metrics=[...SUGGESTIONS.metrics];s.metricsLocked=true;
 s.actions=SUGGESTIONS.actions.map(p=>({lines:p.lines.join('\n'),winState:p.winState,metricIds:p.metricIds,locked:true}));
 const doc=JSON.parse(projectFiles(s).find(f=>f.path==='context/desired-actions.json').content);
 assert.deepEqual(doc.phases.map(p=>p.phase),['Discovery','Onboarding','Scaffolding','Endgame']);
 assert.equal(doc.phases[0].actions[0].id,'DA1.1');
 assert.deepEqual(doc.phases[2].metricIds,['M1']);
 assert.equal(doc.metrics[0].text,s.metrics[0]);
 s.actions[1].locked=false;
 assert.deepEqual(JSON.parse(projectFiles(s).find(f=>f.path==='context/desired-actions.json').content).phases.map(p=>p.order),[1,3,4]);
 s.metricsLocked=false;
 assert.ok(!projectFiles(s).some(f=>f.path==='context/desired-actions.json'));
});
test('old drafts gain empty action phases; invalid metric references cannot lock a phase',()=>{
 const old=initialState();delete old.actions;
 assert.equal(readState(old).actions.length,4);
 const s=initialState();s.created=true;s.metrics=[...SUGGESTIONS.metrics];s.metricsLocked=true;
 s.actions[0]={lines:'Log a walk',winState:'First activity complete',metricIds:[0,8,'M1'],locked:true};
 assert.equal(readState(s).actions[0].locked,false);
 s.actions[0].metricIds=[2,2,4,99];
 assert.deepEqual(readState(s).actions[0].metricIds,[2,4]);
 assert.equal(readState(s).actions[0].locked,true);
 s.metricsLocked=false;assert.equal(readState(s).actions[0].locked,false);
});
test('brainstorm ideas drive P/E rows and all scores gate release planning',()=>{
 const s=initialState();s.created=true;s.brainstorm[0]={lines:'A shared mission\nPersonal purpose',locked:true};
 const [a,b]=ideaCatalog(s);
 assert.equal(scoresReady(s),false);
 s.featureScores[a.id]={power:3,ease:4,release:'MVP'};
 assert.equal(scoresReady(s),false);
 s.featureScores[b.id]={power:5,ease:2,release:''};
 assert.equal(scoresReady(s),true);assert.equal(featuresReady(s),false);
 s.featureScores[b.id].release='V1';s.featuresLocked=true;
 assert.equal(featuresReady(s),true);
 const file=projectFiles(s).find(f=>f.path==='planning/pe-features.json');
 assert.deepEqual(JSON.parse(file.content).features.map(x=>x.release),['MVP','V1']);
 s.featureScores[b.id].ease=6;assert.equal(featuresReady(s),false);
 assert.ok(!projectFiles(s).some(f=>f.path==='planning/pe-features.json'));
});
test('idea scores follow unchanged text through reordering; changed ideas require new scores',()=>{
 const s=initialState();s.created=true;s.brainstorm[0]={lines:'First idea\nSecond idea',locked:true};
 const [a,b]=ideaCatalog(s);s.featureScores[a.id]={power:5,ease:5,release:'MVP'};
 s.brainstorm[0].lines='Second idea\nFirst idea\nFirst idea';
 assert.deepEqual(ideaCatalog(s).map(x=>x.id),[b.id,a.id]);
 assert.equal(s.featureScores[ideaCatalog(s)[1].id].power,5);
 s.brainstorm[0].lines='Changed idea';
 assert.notEqual(ideaCatalog(s)[0].id,a.id);assert.equal(scoresReady(s),false);
});
test('feedback and reward lists generate readable Markdown and survive restoration',()=>{
 const s=initialState();s.created=true;s.feedback={mechanics:'Points\nProgress',vehicles:'App\nEmail',locked:true};s.rewards={lines:'A badge\nNew routes',locked:true};
 const restored=readState(s),files=projectFiles(restored);
 assert.match(files.find(f=>f.path==='context/feedback.md').content,/## Vehicles\n- App\n- Email/);
 assert.match(files.find(f=>f.path==='context/rewards.md').content,/- A badge\n- New routes/);
});
