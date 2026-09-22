export const DRIVE_NAMES=['Epic Meaning & Calling','Development & Accomplishment','Empowerment of Creativity & Feedback','Ownership & Possession','Social Influence & Relatedness','Scarcity & Impatience','Unpredictability & Curiosity','Loss & Avoidance'];
export const SUGGESTIONS={
 metrics:[
 'Week-4 active-member retention: 30% → 40% of signups, with qualifying activity on 3 distinct days in week 4.',
 'First-week activation: 40% → 60% of signups log a first 10-minute Run or Walk within 7 days.',
 'Free-to-paid conversion: 3% → 5% of eligible free members within 90 days. Pricing and value need validation.',
 'Referral share: 10% → 20% of newly activated members come through referrals within 90 days.'
 ],
 axes:{left:'Self-directed',right:'Guided',top:'Shared progress',bottom:'Personal progress'},
 players:[
 {title:'Social explorer',description:'An adult returning to movement who enjoys discovering routes with friends. Wants freedom to choose an activity, shared discoveries, and low-pressure encouragement.',drives:[6,5,9,3,9,2,8,2]},
 {title:'Team regular',description:'An adult rebuilding a routine with a group. Wants a clear weekly plan, a shared commitment, and encouragement when showing up feels difficult.',drives:[6,8,4,4,9,3,3,4]},
 {title:'Independent explorer',description:'An adult who wants movement to fit their own rhythm. Enjoys choosing routes, experimenting with small goals, and seeing personal improvement without comparison.',drives:[4,7,9,6,2,2,8,2]},
 {title:'Personal achiever',description:'An adult who likes a clear path back to fitness. Wants achievable milestones, a structured plan, and private evidence of consistent progress.',drives:[4,9,4,7,3,3,3,4]}
 ]
};
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const emptyPlayer=()=>({title:'',description:'',image:'',drives:Array(8).fill(0),locked:false});
export const initialState=()=>({version:1,created:false,metrics:Array(4).fill(''),metricsLocked:false,axes:{left:'',right:'',top:'',bottom:''},axesLocked:false,players:Array.from({length:4},emptyPlayer)});
export function quadrant(axes,index){return [(index%2===0?axes.left:axes.right),(index<2?axes.top:axes.bottom)].filter(Boolean).join(' · ');}
export function validImage(value){return typeof value==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)&&value.length<1800000;}
export function readState(value){
 const clean=initialState();if(!value||value.version!==1)return clean;
 clean.created=value.created===true;
 if(Array.isArray(value.metrics)&&value.metrics.length===4)clean.metrics=value.metrics.map(x=>String(x).slice(0,500));
 clean.metricsLocked=clean.created&&value.metricsLocked===true&&clean.metrics.every(x=>x.trim());
 for(const k of Object.keys(clean.axes))clean.axes[k]=String(value.axes?.[k]||'').slice(0,70);
 clean.axesLocked=clean.created&&value.axesLocked===true&&Object.values(clean.axes).every(x=>x.trim());
 clean.players=clean.players.map((p,i)=>{
  const x=value.players?.[i];if(!x)return p;
  p.title=String(x.title||'').slice(0,80);p.description=String(x.description||'').slice(0,900);p.image=validImage(x.image)?x.image:'';
  p.drives=p.drives.map((_,j)=>Math.max(0,Math.min(10,Number(x.drives?.[j])||0)));
  p.locked=clean.axesLocked&&x.locked===true&&!!p.title.trim()&&!!p.description.trim();return p;
 });return clean;
}
export function radar(values,{labels=true}={}){
 const point=(i,r)=>{const a=-Math.PI/2+i*Math.PI/4;return [150+Math.cos(a)*r,150+Math.sin(a)*r];};
 const polygon=r=>Array.from({length:8},(_,i)=>point(i,r).join(',')).join(' ');
 // A neutral eight-axis hypothesis chart; not a reproduction of branded framework artwork.
 return '<svg viewBox="0 0 300 300" role="img" aria-label="Eight Core Drive emphasis values from zero to ten"><g fill="none" stroke="#cbdde9">'+[30,60,90].map(r=>'<polygon points="'+polygon(r)+'"/>').join('')+Array.from({length:8},(_,i)=>'<path d="M150 150 L'+point(i,90).join(' ')+'"/>').join('')+'</g><polygon points="'+values.map((v,i)=>point(i,Math.max(0,Math.min(10,v))*9).join(',')).join(' ')+'" fill="#0078fa24" stroke="#005cc2" stroke-width="2.5"/>'+values.map((v,i)=>'<circle cx="'+point(i,v*9)[0]+'" cy="'+point(i,v*9)[1]+'" r="3.5" fill="#005cc2"/>').join('')+(labels?values.map((v,i)=>'<text x="'+point(i,116)[0]+'" y="'+(point(i,116)[1]+4)+'" text-anchor="middle" fill="#00428f" font-family="Arial,sans-serif" font-size="11">CD'+(i+1)+' · '+v+'</text>').join(''):'')+'</svg>';
}
export function profileHTML(player,axes,index){
 const e=escapeHTML;
 return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(player.title)+' — Move player type</title><style>body{font:16px/1.6 system-ui,sans-serif;margin:0;background:#f2f8fd;color:#00428f}main{max-width:740px;margin:40px auto;padding:32px;background:white;border-radius:18px}h1{font-size:40px;line-height:1.1}img{width:100px;height:100px;object-fit:cover;border-radius:16px}svg{max-width:340px;display:block;margin:auto}li{padding:6px 0}small{color:#52667a}p{white-space:pre-wrap}@media(max-width:600px){main{margin:12px;padding:22px}}</style><main><small>MOVE / PLAYER TYPE '+(index+1)+' · WORKSHOP HYPOTHESIS</small><h1>'+e(player.title)+'</h1>'+(validImage(player.image)?'<img src="'+player.image+'" alt="Image selected for '+e(player.title)+'">':'')+'<p>'+e(quadrant(axes,index))+'</p><p>'+e(player.description)+'</p>'+radar(player.drives)+'<ol>'+DRIVE_NAMES.map((n,i)=>'<li>'+e(n)+': <b>'+player.drives[i]+'/10</b></li>').join('')+'</ol><small>Discussion hypotheses, not researched segments or measured scores. Review before using in a real product.</small></main></html>';
}
export function projectFiles(state){
 const files=[];if(!state.created)return files;
 if(state.metricsLocked)files.push({path:'context/business-metrics.md',type:'text/markdown',content:'# Move — Business metrics\n\nStatus: workshop hypotheses; not validated outcomes.\nPriority: highest first.\n\n'+state.metrics.map((m,i)=>(i+1)+'. '+m.trim()).join('\n\n')+'\n\nThese are narrative context. Review dependencies before changing executable qualification or reward rules.\n'});
 if(state.axesLocked)files.push({path:'context/player-axes.json',type:'application/json',content:JSON.stringify({status:'Workshop hypothesis',horizontal:{left:state.axes.left,right:state.axes.right},vertical:{top:state.axes.top,bottom:state.axes.bottom}},null,2)});
 const players=state.players.flatMap((p,i)=>p.locked?[{id:'P'+(i+1),quadrant:quadrant(state.axes,i),title:p.title,description:p.description,image:p.image,coreDrives:DRIVE_NAMES.map((name,j)=>({id:j+1,name,emphasis:p.drives[j]}))}]:[]);
 if(players.length)files.push({path:'context/player-types.json',type:'application/json',content:JSON.stringify({status:'Workshop hypotheses; scores are discussion inputs',players},null,2)});
 state.players.forEach((p,i)=>{if(p.locked)files.push({path:'players/player-'+(i+1)+'.html',type:'text/html',content:profileHTML(p,state.axes,i)});});
 return files;
}
// Small uncompressed ZIP writer: no server, third-party runtime, or upload required.
export function zipFiles(files){
 const encode=new TextEncoder(),parts=[],central=[];let offset=0;
 const crc32=bytes=>{let c=0xffffffff;for(const byte of bytes){c^=byte;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 const header=(size,values)=>{const a=new Uint8Array(size),v=new DataView(a.buffer);for(const [o,n,w] of values)w===4?v.setUint32(o,n,true):v.setUint16(o,n,true);return a;};
 for(const f of files){
  const name=encode.encode(f.path),data=encode.encode(f.content),crc=crc32(data);
  const h=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[12,33,2],[14,crc,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]);
  parts.push(h,name,data);
  const c=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[14,33,2],[16,crc,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]);
  central.push(c,name);offset+=h.length+name.length+data.length;
 }
 const centralSize=central.reduce((n,a)=>n+a.length,0);
 const end=header(22,[[0,0x06054b50,4],[8,files.length,2],[10,files.length,2],[12,centralSize,4],[16,offset,4]]);
 const all=[...parts,...central,end],out=new Uint8Array(all.reduce((n,a)=>n+a.length,0));let pos=0;
 for(const a of all){out.set(a,pos);pos+=a.length;}return out;
}
