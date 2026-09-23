import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishPairs} from './pair-workshop.mjs';
test('published tree uses actual files and only ready pairs enter gallery',async t=>{
 const root=await mkdtemp(join(tmpdir(),'pair-publish-'));t.after(()=>rm(root,{recursive:true,force:true}));
 for(const path of ['workshop/starter','pairs/one-two','dist'])await mkdir(join(root,path),{recursive:true});
 await writeFile(join(root,'workshop/pairs.json'),JSON.stringify([{id:'one-two',team:'One & Two'}]));
 await writeFile(join(root,'workshop/starter/index.html'),'<html><style id="app-css">body{color:blue}</style><!-- APP HTML START --><h1>Hello</h1><!-- APP HTML END --><script id="app-js">void 0;</script></html>');
 await writeFile(join(root,'pairs/one-two/README.md'),'# Real brief');
 const manifest=[];await publishPairs(root,join(root,'dist'),async()=>0,manifest);
 assert.equal(manifest.length,0);const files=JSON.parse(await readFile(join(root,'dist/repo-files.json')));assert.deepEqual(files.pairs[0].files,['pairs/one-two/README.md']);
 assert.equal(await readFile(join(root,'dist/pairs/one-two/README.md'),'utf8'),'# Real brief');
 await writeFile(join(root,'pairs/one-two/index.html'),'<html>Hello</html>');await publishPairs(root,join(root,'dist'),async()=>0,manifest);assert.equal(manifest[0].path,'pairs/one-two/index.html');
 const source=JSON.parse(await readFile(join(root,'dist/starter-source.json')));assert.equal(source.html,'<h1>Hello</h1>');
});

test('live build leads the gallery; unchanged copies stay hidden and changed pairs follow',async t=>{
 const root=await mkdtemp(join(tmpdir(),'gallery-live-'));t.after(()=>rm(root,{recursive:true,force:true}));
 for(const path of ['workshop/starter','workshop/live','pairs/one-two','dist'])await mkdir(join(root,path),{recursive:true});
 const live='<html><style id="app-css">body{color:blue}</style><!-- APP HTML START --><h1>Move</h1><!-- APP HTML END --><script id="app-js">void 0;</script></html>';
 await writeFile(join(root,'workshop/pairs.json'),JSON.stringify([{id:'one-two',team:'One & Two'}]));
 for(const path of ['workshop/starter/index.html','workshop/live/index.html','pairs/one-two/index.html'])await writeFile(join(root,path),live);
 await writeFile(join(root,'pairs/one-two/README.md'),'# Brief');
 const first=[];await publishPairs(root,join(root,'dist'),async()=>0,first);assert.deepEqual(first.map(p=>p.id),['live-build']);
 assert.equal(await readFile(join(root,'dist',first[0].path),'utf8'),live);
 await writeFile(join(root,'pairs/one-two/index.html'),live.replace('<h1>Move</h1>','<h1>Our next small win</h1>'));
 const next=[];await publishPairs(root,join(root,'dist'),async()=>0,next);assert.deepEqual(next.map(p=>p.id),['live-build','one-two']);
});
