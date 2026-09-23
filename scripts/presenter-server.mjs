import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {PresenterWorkspace} from './presenter-workspace.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const port=Number(process.env.WORKSHOP_PORT||8768);
const source=JSON.parse(await readFile(join(root,'dist/starter-source.json'),'utf8'));
const workspace=new PresenterWorkspace({root,sources:source});
const secret=randomBytes(32).toString('hex');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain','.woff2':'font/woff2'};
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
function authorized(req){const token=String(req.headers['x-workshop-session']||'');return req.headers.origin===`http://${req.headers.host}`&&req.headers['content-type']==='application/json'&&token.length===secret.length&&timingSafeEqual(Buffer.from(token),Buffer.from(secret));}
const server=createServer(async(req,res)=>{if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)){json(res,403,{error:'Invalid host'});return;}try{const url=new URL(req.url,`http://${req.headers.host}`);
 if(url.pathname.startsWith('/api/')){
  if(req.method==='GET'&&url.pathname==='/api/session'){json(res,200,{mode:'presenter',token:secret,...await workspace.snapshot()});return;}
  if(req.method==='GET'&&url.pathname==='/api/tree'){json(res,200,await workspace.snapshot());return;}
  if(req.method==='GET'&&url.pathname==='/api/file'){const data=await workspace.read(url.searchParams.get('path')||'');res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);return;}
  if(req.method!=='POST'||!authorized(req)){json(res,403,{error:'Open the local presenter page to make repository changes.'});return;}
  let body='';for await(const chunk of req){body+=chunk;if(body.length>1024){json(res,413,{error:'Request too large'});return;}}const data=JSON.parse(body||'{}');
  if(url.pathname==='/api/build'){json(res,200,await workspace.build(data.stage));return;}
  if(url.pathname==='/api/publish'){if(workspace.busy||workspace.stage!==2||workspace.result){json(res,409,{error:'Finish the three build steps before publishing once.'});return;}workspace.handout().catch(error=>console.error('Handout:',error.message));json(res,202,{accepted:true});return;}
  json(res,404,{error:'Unknown operation'});return;
 }
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 let name=decodeURIComponent(url.pathname);if(name==='/')name='/index.html';const path=resolve(root,'dist','.'+name);if(!path.startsWith(resolve(root,'dist')+'/')){res.writeHead(403);res.end();return;}const file=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(file);
 }catch(error){json(res,error.code==='ENOENT'?404:400,{error:error.message});}});
server.listen(port,'127.0.0.1',()=>console.log(`Presenter workspace: http://127.0.0.1:${port}/\nReal writes run only when you press Run. Final prompt commits, pushes and merges after checks. Close with Ctrl+C.`));
