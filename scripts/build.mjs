import { readdir, readFile, writeFile, mkdir, cp, rm, lstat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { publishPairs } from './pair-workshop.mjs';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const allowed=new Set(['.html','.css','.js','.json','.md','.png','.jpg','.jpeg','.gif','.svg','.webp','.avif','.ico','.woff','.woff2','.mp3','.mp4','.webm','.ogg']);
export function validateMetadata(data,id){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error(`Invalid prototype folder: ${id}. Use lowercase words joined by hyphens.`);
  if(!data || typeof data!=='object' || Array.isArray(data))throw Error(`${id}: metadata must be an object`);
  for(const [key,limit] of Object.entries({title:100,team:100,description:400,coreDrive:200})){
    if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>limit)throw Error(`${id}: ${key} must be a non-empty string up to ${limit} characters`);
  }
  if(data.kind!==undefined&&!['example','team'].includes(data.kind))throw Error(`${id}: kind must be team or example`);
  return {id,title:data.title.trim(),team:data.team.trim(),description:data.description.trim(),coreDrive:data.coreDrive.trim(),kind:data.kind||'team',path:`prototypes/${id}/index.html`};
}
async function validateFiles(dir){
  let bytes=0;
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name),stat=await lstat(path);
    if(stat.isSymbolicLink())throw Error(`Symbolic links are not accepted: ${path}`);
    if(entry.name.startsWith('.'))throw Error(`Hidden files are not published: ${path}`);
    if(stat.isDirectory()){bytes+=await validateFiles(path);continue;}
    if(!allowed.has(extname(entry.name).toLowerCase()))throw Error(`Unsupported file type: ${path}`);
    if(stat.size>5*1024*1024)throw Error(`File exceeds 5 MB: ${path}`);
    bytes+=stat.size;
    if(extname(path)==='.html'){
      const html=await readFile(path,'utf8');
      if(!/<html[\s>]/i.test(html))throw Error(`Missing HTML document: ${path}`);
      // Parse classic inline scripts without executing prototype code.
      for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
        if(/\bsrc\s*=|\btype\s*=\s*["']?(?:module|application\/|importmap)/i.test(match[1]))continue;
        new Script(match[2],{filename:path});
      }
    }
  }
  return bytes;
}
export async function build(projectRoot=root){
  const source=join(projectRoot,'prototypes'),manifest=[];
  for(const entry of (await readdir(source,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    if(!entry.isDirectory())throw Error(`Only prototype directories belong in prototypes/: ${entry.name}`);
    const dir=join(source,entry.name);
    for(const name of ['index.html','prototype.json','README.md'])if(!(await lstat(join(dir,name))).isFile())throw Error(`${entry.name}: missing ${name}`);
    const size=await validateFiles(dir);if(size>25*1024*1024)throw Error(`${entry.name}: prototype exceeds 25 MB`);
    manifest.push(validateMetadata(JSON.parse(await readFile(join(dir,'prototype.json'),'utf8')),entry.name));
  }
  await validateFiles(join(projectRoot,'site'));
  const dist=join(projectRoot,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
  await cp(join(projectRoot,'site'),dist,{recursive:true});
  if((await readdir(projectRoot)).includes('versions'))await cp(join(projectRoot,'versions'),join(dist,'versions'),{recursive:true});await cp(source,join(dist,'prototypes'),{recursive:true});
  await publishPairs(projectRoot,dist,validateFiles,manifest);
  await writeFile(join(dist,'prototypes.json'),JSON.stringify(manifest,null,2)+'\n');await writeFile(join(dist,'.nojekyll'),'');
  console.log(`Built presentation and gallery: ${manifest.length} prototype(s).`);
  return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
