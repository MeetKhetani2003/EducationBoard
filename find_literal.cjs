const fs = require('fs');
const lines = fs.readFileSync('app/ClientApp.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('{resultData.studentName}')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
