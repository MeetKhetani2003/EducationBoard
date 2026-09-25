const fs = require('fs');
const lines = fs.readFileSync('app/ClientApp.tsx', 'utf8').split('\n');
for(let i=0;i<lines.length;i++) { 
  if(lines[i].includes('function AdminSettings(')) {
    console.log('Found on line:', i);
  }
}
