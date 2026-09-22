import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, validateMetadata } from './build.mjs';
const valid={title:'Example',team:'Pair 1',description:'An interaction',coreDrive:'A hypothesis',kind:'team'};
test('rejects invalid names and incomplete gallery metadata',()=>{
  assert.throws(()=>validateMetadata(valid,'../escape'));
  assert.throws(()=>validateMetadata({...valid,title:''},'pair-one'));
  assert.throws(()=>validateMetadata({...valid,kind:'unknown'},'pair-one'));
});
test('builds a newly contributed prototype into the gallery and rejects symbolic links',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'workshop-build-'));
  try{
    await cp(new URL('../site',import.meta.url),join(dir,'site'),{recursive:true});
    const prototype=join(dir,'prototypes','pair-one');await mkdir(prototype,{recursive:true});
    await writeFile(join(prototype,'index.html'),'<!doctype html><html lang="en"><title>Prototype</title><body>Working</body></html>');
    await writeFile(join(prototype,'README.md'),'Purpose and handoff');
    await writeFile(join(prototype,'prototype.json'),JSON.stringify(valid));
    await build(dir);
    const manifest=JSON.parse(await readFile(join(dir,'dist','prototypes.json'),'utf8'));
    assert.equal(manifest[0].path,'prototypes/pair-one/index.html');
    assert.match(await readFile(join(dir,'dist',manifest[0].path),'utf8'),/Working/);
    await symlink(join(prototype,'README.md'),join(prototype,'linked.md'));
    await assert.rejects(build(dir),/Symbolic links/);
  }finally{await rm(dir,{recursive:true,force:true})}
});
