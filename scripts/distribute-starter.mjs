import {readFile, access, copyFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
export async function distribute(root) {
  const pairs=JSON.parse(await readFile(join(root,'workshop/pairs.json'),'utf8'));
  const source=join(root,'workshop/starter/index.html');
  const html=await readFile(source,'utf8');
  if(!/<html[\s>]/i.test(html))throw Error('Starter must be a complete HTML document.');
  for(const {id} of pairs){
    if(!/^[a-z]+(?:-[a-z]+)*$/.test(id))throw Error('Invalid pair folder');
    await access(join(root,'pairs',id,'README.md'));
    try {await access(join(root,'pairs',id,'index.html'));} catch(error) {if(error.code==='ENOENT')continue;throw error;}
    throw Error(`Refusing to overwrite existing work: pairs/${id}/index.html`);
  }
  for(const {id} of pairs)await copyFile(source,join(root,'pairs',id,'index.html'),constants.COPYFILE_EXCL);
  return pairs.length;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(`Distributed starter to ${await distribute(resolve(fileURLToPath(new URL('..',import.meta.url))))} pairs.`);
