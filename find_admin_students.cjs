const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8').split('\n');
content.forEach((line, index) => {
  if (line.includes('function AdminStudents')) {
    console.log(index + 1);
    console.log(content.slice(index, index + 100).join('\n'));
  }
});
