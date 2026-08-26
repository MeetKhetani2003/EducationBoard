const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8').split('\n');
console.log('App component starts at line:', content.findIndex(l => l.includes('function App(')) + 1);
console.log(content.slice(content.findIndex(l => l.includes('function App(')), content.length).join('\n'));
