const fs = require('fs');
const files = ['app/ClientApp.tsx', 'app/layout.tsx', 'app/[[...route]]/page.tsx'];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Thar Board of School and Technical Education/gi, 'Thar Vidyalaya Evam Takniki Shiksha Board');
    content = content.replace(/Thar Board of School & Technical Education/gi, 'Thar Vidyalaya Evam Takniki Shiksha Board');
    content = content.replace(/THAR BOARD OF SCHOOL & TECHNICAL EDUCATION/gi, 'THAR VIDYALAYA EVAM TAKNIKI SHIKSHA BOARD');
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log('Replaced names');
