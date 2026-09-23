import {readFile, readdir, writeFile, cp} from 'node:fs/promises';
import {join} from 'node:path';
export async function publishPairs(root, dist, validateFiles, manifest) {
  if(!(await readdir(root)).includes('workshop'))return;
  const pairs=JSON.parse(await readFile(join(root,'workshop/pairs.json'),'utf8'));
  let live=null;
  try{live=await readFile(join(root,'workshop/live/index.html'),'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
  if(live)manifest.unshift({id:'live-build',team:'Built together · The Octalysis Group',title:'Every move counts',description:'The fitness tracker we created together: HTML, CSS, then JavaScript.',coreDrive:'Our shared starting point.',kind:'live',path:'workshop/live/index.html',sourcePath:'workshop/live'});
  const files=[];
  for(const pair of pairs){
    if(!/^[a-z]+(?:-[a-z]+)*$/.test(pair.id))throw Error('Invalid pair id');
    const dir=join(root,'pairs',pair.id);
    const bytes=await validateFiles(dir);
    if(bytes>25*1024*1024)throw Error('Pair folder exceeds 25 MB');
    await readFile(join(dir,'README.md'),'utf8');
    const paths=[];
    async function walk(folder,prefix){for(const e of await readdir(folder,{withFileTypes:true})){const path=prefix+'/'+e.name;if(e.isDirectory())await walk(join(folder,e.name),path);else paths.push(path);}}
    await walk(dir,`pairs/${pair.id}`);
    files.push({...pair,files:paths});
    if(paths.includes(`pairs/${pair.id}/index.html`)&&(!live||(await readFile(join(dir,'index.html'),'utf8')).trim()!==live.trim()))manifest.push({id:pair.id,team:pair.team,title:pair.team+' · Move',description:'A fitness experience built in the workshop.',coreDrive:'Read the pair brief for the motivation hypothesis.',kind:'team',path:`pairs/${pair.id}/index.html`,sourcePath:`pairs/${pair.id}`});
  }
  await validateFiles(join(root,'workshop'));
  await cp(join(root,'pairs'),join(dist,'pairs'),{recursive:true});
  await cp(join(root,'workshop'),join(dist,'workshop'),{recursive:true});
  const source=await readFile(join(root,'workshop/starter/index.html'),'utf8');
  const html=source.match(/<!-- APP HTML START -->([\s\S]*?)<!-- APP HTML END -->/)?.[1];
  const css=source.match(/<style id="app-css">([\s\S]*?)<\/style>/)?.[1];
  const js=source.match(/<script id="app-js">([\s\S]*?)<\/script>/)?.[1];
  if(!html||!css||!js)throw Error('Starter source markers missing');
  await writeFile(join(dist,'starter-source.json'),JSON.stringify({html:html.trim(),css:css.trim(),js:js.trim()}));
  await writeFile(join(dist,'repo-files.json'),JSON.stringify({revision:process.env.GITHUB_SHA||'local preview',pairs:files},null,2));
}
