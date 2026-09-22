/* Teaching simulation: no external requests, database, or persistent storage. */
(()=>{'use strict';
const byId=id=>document.getElementById(id);
const steps=[
 {nodes:['repo','host'],button:'2. Open the hosted page',text:'Deployment: the workflow checks the repository and publishes a version of its files to the host.'},
 {nodes:['host','browser'],button:'3. Request a record',text:'A visitor opens the URL. Hosting sends the HTML, CSS, and JavaScript to their browser.'},
 {nodes:['page','api','db'],button:'4. Display the response',text:'The browser’s JavaScript asks an API for a record. The API checks access and queries the database.'},
 {nodes:['db','api','page'],button:'Walkthrough complete',text:'The database returns a record through the API. JavaScript uses those values to update the HTML. The deployed files did not change.'}
];let step=0;
byId('cloud-next').onclick=()=>{const state=steps[step++];document.querySelectorAll('[data-cloud]').forEach(el=>el.classList.toggle('active',state.nodes.includes(el.dataset.cloud)));byId('cloud-status').textContent=state.text;byId('cloud-next').textContent=state.button;byId('cloud-next').disabled=step===steps.length;};
byId('cloud-reset').onclick=()=>{step=0;document.querySelectorAll('[data-cloud]').forEach(el=>el.classList.remove('active'));byId('cloud-next').disabled=false;byId('cloud-next').textContent='1. Deploy the code';byId('cloud-status').textContent='Start with the source files in a repository. Follow the two journeys.';};
const initial=[{id:1,name:'Maya',focus:'Learning',points:40},{id:2,name:'Leo',focus:'Connection',points:75},{id:3,name:'Sam',focus:'Creativity',points:120}];let rows=initial.map(row=>({...row}));
const selected=()=>rows.find(row=>row.id===Number(byId('member-select').value));
function table(){const body=byId('member-rows');body.replaceChildren();for(const row of rows){const tr=document.createElement('tr');tr.classList.toggle('selected',row.id===selected().id);for(const key of ['id','name','focus','points']){const td=document.createElement('td');td.textContent=row[key];tr.append(td);}body.append(tr);}}
function render(){const row={...selected()};byId('data-json').textContent=JSON.stringify(row,null,2);byId('member-heading').textContent='Hello, '+row.name;byId('member-focus').textContent='Your focus: '+row.focus;byId('member-score').textContent=row.points;byId('data-render-status').textContent='Loaded member '+row.id+' ('+row.name+'). The response above supplies the card’s values.';}
byId('member-select').onchange=()=>{table();byId('member-points').value=selected().points;byId('data-save-status').textContent='Selected '+selected().name+'. Load the row to update the page.';};
byId('data-edit').onsubmit=event=>{event.preventDefault();if(!byId('data-edit').reportValidity())return;selected().points=Number(byId('member-points').value);table();byId('data-save-status').textContent='Saved '+selected().name+'’s points in the simulated table. The page still shows its last response; load the row again.';};
byId('data-fetch').onclick=render;
byId('data-reset').onclick=()=>{rows=initial.map(row=>({...row}));byId('member-select').value='1';byId('member-points').value=40;byId('data-save-status').textContent='Fictional records, kept only in this tab. Reloading resets them.';table();render();};table();render();
})();
