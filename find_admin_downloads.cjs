const fs = require('fs');
const lines = fs.readFileSync('app/ClientApp.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('function Admin') && l.includes('Download')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
