const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
// Fix SSR
content = content.replace(/function pageFromHash\(\): Page\s*\{\s*const value = window\.location\.hash\.replace\("#", ""\) as Page;/g, 
  'function pageFromHash(): Page {\n  if (typeof window === "undefined") return "home";\n  const value = window.location.hash.replace("#", "") as Page;');

fs.writeFileSync('app/page.tsx', '"use client";\n' + content);
console.log('Fixed page.tsx');
