const fs = require('fs');
const content = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// Find all components starting with Admin
const regex = /function Admin[a-zA-Z0-9_]+\s*\(/g;
let match;
const matches = [];
while ((match = regex.exec(content)) !== null) {
  matches.push(match[0]);
}
console.log('Admin Components: ', matches);
