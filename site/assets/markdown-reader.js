// Render a readable subset of Markdown with text nodes; raw HTML is never executed.
export function renderMarkdown(target,markdown){
 target.replaceChildren();let paragraph=[],list=null,code=null;
 const inline=(el,text)=>{for(const part of text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)){const tag=part.startsWith('`')?'code':part.startsWith('**')?'strong':null;if(tag){const child=document.createElement(tag);child.textContent=part.slice(tag==='code'?1:2,tag==='code'?-1:-2);el.append(child);}else el.append(document.createTextNode(part));}};
 const flush=()=>{if(paragraph.length){const p=document.createElement('p');inline(p,paragraph.join(' '));target.append(p);paragraph=[];}};
 for(const line of markdown.split(/\r?\n/)){
  if(line.startsWith('```')){flush();list=null;if(code){const pre=document.createElement('pre');pre.textContent=code.join('\n');target.append(pre);code=null;}else code=[];continue;}
  if(code){code.push(line);continue;}
  const heading=line.match(/^(#{1,6})\s+(.+)$/),item=line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
  if(heading){flush();list=null;const h=document.createElement('h'+Math.min(heading[1].length+1,6));inline(h,heading[2]);target.append(h);}
  else if(item){flush();const type=/^\s*\d+\./.test(line)?'ol':'ul';if(!list||list.tagName.toLowerCase()!==type){list=document.createElement(type);target.append(list);}const li=document.createElement('li');inline(li,item[1]);list.append(li);}
  else if(!line.trim()){flush();list=null;}
  else{list=null;paragraph.push(line);}
 }
 flush();if(code){const pre=document.createElement('pre');pre.textContent=code.join('\n');target.append(pre);}
}
