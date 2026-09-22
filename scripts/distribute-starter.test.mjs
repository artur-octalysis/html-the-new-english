import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {distribute} from './distribute-starter.mjs';
async function fixture(t){const root=await mkdtemp(join(tmpdir(),'pair-handout-'));t.after(()=>rm(root,{recursive:true,force:true}));await mkdir(join(root,'workshop/starter'),{recursive:true});await writeFile(join(root,'workshop/pairs.json'),JSON.stringify([{id:'one-two'},{id:'three-four'}]));await writeFile(join(root,'workshop/starter/index.html'),'<html><body>Starter</body></html>');for(const id of ['one-two','three-four']){await mkdir(join(root,'pairs',id),{recursive:true});await writeFile(join(root,'pairs',id,'README.md'),'Brief');}return root;}
test('handout copies exact starter into every registered pair',async t=>{const root=await fixture(t);assert.equal(await distribute(root),2);for(const id of ['one-two','three-four'])assert.equal(await readFile(join(root,'pairs',id,'index.html'),'utf8'),'<html><body>Starter</body></html>');});
test('preflight refuses existing work before copying any files',async t=>{const root=await fixture(t);await writeFile(join(root,'pairs/three-four/index.html'),'Participant work');await assert.rejects(distribute(root),/Refusing to overwrite/);await assert.rejects(access(join(root,'pairs/one-two/index.html')));assert.equal(await readFile(join(root,'pairs/three-four/index.html'),'utf8'),'Participant work');});
