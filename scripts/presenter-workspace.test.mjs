import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,cp,rm,access,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {PresenterWorkspace,command} from './presenter-workspace.mjs';
import {buildDocument,terminalCommands} from '../site/assets/chat-build-model.js';
const sources={html:'<main><h1>Move</h1><button>Log</button></main>',css:'body { color: blue; }',js:'document.querySelector("button").onclick=()=>{};'};
test('staged HTML exports progressively add CSS and JS; commands reject injected pair names',()=>{assert.ok(!buildDocument(sources,0).includes(sources.css));assert.ok(!buildDocument(sources,0).includes(sources.js));assert.ok(buildDocument(sources,1).includes(sources.css));assert.ok(!buildDocument(sources,1).includes(sources.js));assert.ok(buildDocument(sources,2).includes(sources.js));assert.match(terminalCommands('myrte-rob'),/pair\/myrte-rob/);assert.throws(()=>terminalCommands('x; rm -rf /'));});
test('real Git workspace isolates live writes, distributes exact copies, and safely resumes failed publication',async t=>{
 const base=await mkdtemp(join(tmpdir(),'presenter-test-'));t.after(()=>rm(base,{recursive:true,force:true}));const root=join(base,'source');await mkdir(root);
 for(const folder of ['site','scripts','workshop','pairs','prototypes'])await cp(resolve(folder),join(root,folder),{recursive:true});
 // Start with an undistributed fixture regardless of the real workshop state.
 await rm(join(root,'workshop/live'),{recursive:true,force:true});
 for(const pair of JSON.parse(await readFile(join(root,'workshop/pairs.json'),'utf8')))await rm(join(root,'pairs',pair.id,'index.html'),{force:true});
 await writeFile(join(root,'package.json'),'{"type":"module"}');
 await command('git',['init','--initial-branch=main'],root);await command('git',['config','user.name','Workshop Test'],root);await command('git',['config','user.email','workshop@example.test'],root);await command('git',['add','.'],root);await command('git',['commit','-m','Fixture'],root);await command('git',['remote','add','origin',root],root);
 let attempts=0;const workspace=new PresenterWorkspace({root,sources,publish:async()=>{attempts++;if(attempts===1)throw Error('Network interrupted');return {pullRequest:'https://example.test/pr/1'};}});
 await assert.rejects(workspace.build(1),/in order/);await workspace.build(0);t.after(()=>rm(workspace.dir,{recursive:true,force:true}));await assert.rejects(access(join(root,'workshop/live/index.html')));assert.equal(await workspace.read('workshop/live/index.html'),buildDocument(sources,0));
 await workspace.build(1);await workspace.build(2);await assert.rejects(workspace.read('../package.json'),/outside/);
 await assert.rejects(workspace.handout(),/Network interrupted/);assert.equal(workspace.prepared,true);await workspace.handout();assert.equal(workspace.stage,3);assert.equal(attempts,2);
 for(const pair of JSON.parse(await readFile(join(root,'workshop/pairs.json')))){assert.equal(await workspace.read('pairs/'+pair.id+'/index.html'),buildDocument(sources,2));await assert.rejects(access(join(root,'pairs',pair.id,'index.html')));}
 await assert.rejects(workspace.handout(),/JavaScript|already/);
 const outside=join(base,'private.txt');await writeFile(outside,'secret');await symlink(outside,join(workspace.dir,'pairs/dirk-chris/outside.txt'));await assert.rejects(workspace.read('pairs/dirk-chris/outside.txt'),/outside/);
});
