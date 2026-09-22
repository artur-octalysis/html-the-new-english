import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,readState,projectFiles,profileHTML,SUGGESTIONS,zipFiles} from '../site/assets/workshop-model.js';
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
