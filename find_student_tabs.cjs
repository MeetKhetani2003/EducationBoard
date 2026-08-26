const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8').split('\n');
content.forEach((line, index) => {
  if (line.toLowerCase().includes('students') && line.includes('setActiveTab')) {
    console.log(index + 1, line);
  }
});
