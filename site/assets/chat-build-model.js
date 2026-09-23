export const steps = [
 {prompt:'Create an HTML file for a fitness tracker page.',label:'HTML · structure',reply:'Created index.html with a heading, activity form and progress totals. Double-click the file to open it in the browser.'},
 {prompt:'Add CSS.',label:'CSS · layout and color',reply:'Updated index.html. Grid arranges the totals; flexbox structures the form. Spacing and color give the screen a clear hierarchy.'},
 {prompt:'Apply JS.',label:'JavaScript · interaction',reply:'Updated index.html with JavaScript. Log a walk or run: the activity list, totals and feedback now respond.'}
];
export function buildDocument(sources,stage){
 if(!Number.isInteger(stage)||stage<0||stage>2)throw Error('Complete an HTML build step first.');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Every move counts</title><style id="app-css">${stage>=1?sources.css:''}</style></head><body><!-- APP HTML START -->${sources.html}<!-- APP HTML END --><script id="app-js">${stage>=2?sources.js:'document.addEventListener("submit",event=>event.preventDefault());'}<\/script></body></html>`;
}
export function terminalCommands(pair){
 if(!/^[a-z]+(?:-[a-z]+)*$/.test(pair))throw Error('Invalid pair name');
 return `# Sign in (Git and GitHub CLI must be installed)\ngh auth login --hostname github.com --git-protocol https --web\ngh auth setup-git\n\n# Clone once into a new folder\ngh repo clone artur-octalysis/html-the-new-english\ncd html-the-new-english\n\n# Create your pair’s branch\ngit switch -c pair/${pair}\n\n# Read your shared brief\ncat pairs/${pair}/README.md`;
}
