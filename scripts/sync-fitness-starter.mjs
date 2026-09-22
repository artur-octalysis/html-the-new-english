import {readFile,writeFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [html,css,js,model,project]=await Promise.all(['site/fitness-demo.html','site/assets/fitness-demo.css','site/assets/fitness-demo.js','site/assets/project-model.js','site/project/fitness-project.json'].map(read));
const script=model.replaceAll('export function','function')+'\n'+js.replace("import {progression} from './project-model.js';",'').replace('const EMBEDDED_POLICY=null;', 'const EMBEDDED_POLICY='+project.trim()+';').replaceAll('tog-fitness-workshop-v2','tog-fitness-starter-v2');
const result=html.replace(/<link rel="stylesheet" href="assets\/fitness-demo.css[^"]*">/,'<style>'+css+'</style>').replace(/<script src="assets\/fitness-demo.js[^"]*" type="module"><\/script>/,'').replace('</body>','<script type="module">'+script+'</script></body>');
await writeFile(new URL('../site/downloads/fitness-starter.html',import.meta.url),result);
