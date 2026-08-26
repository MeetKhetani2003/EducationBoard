const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8').split('\n');
content.forEach((line, index) => {
  if (line.includes('case "admin-') || line.includes('case \'admin-')) {
    console.log(index + 1, line);
  }
});
