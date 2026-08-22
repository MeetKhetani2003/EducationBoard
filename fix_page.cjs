const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  'function pageFromHash(): Page {\n  const value = window.location.hash.replace("#", "") as Page;',
  'function pageFromHash(): Page {\n  if (typeof window === "undefined") return "home";\n  const value = window.location.hash.replace("#", "") as Page;'
);
fs.writeFileSync('app/page.tsx', '"use client";\n' + content + '\n');
console.log('Fixed page.tsx');
