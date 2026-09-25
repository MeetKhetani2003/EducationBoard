const fs = require('fs');
const lines = fs.readFileSync('app/ClientApp.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('function download') || l.includes('fetch("/api/documents")') || l.includes('setDbDocs(') || l.includes('data.filter')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
