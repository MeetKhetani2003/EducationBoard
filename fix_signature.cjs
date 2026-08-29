const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  /<div className="h-16 w-48 border-b-2 border-stone-400 mb-2 flex items-end justify-center pb-2">\s*\{\/\* Placeholder for Signature Image \*\/\}\s*<span className="italic text-stone-300 text-sm">Valid Authorized Signature<\/span>\s*<\/div>/g,
  `<div className="h-20 w-56 border-b-2 border-stone-400 mb-2 flex flex-col items-center justify-end pb-2">\n                          <span className="italic text-[#8d1c2f] font-semibold text-sm leading-tight">Digitally Signed & Verified</span>\n                          <span className="text-[10px] text-stone-400 mt-0.5">Valid System Generated Document</span>\n                        </div>`
);

fs.writeFileSync('app/page.tsx', c);
console.log('Signature updated!');
