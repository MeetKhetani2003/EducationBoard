const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(/py-16 md:py-24/g, 'py-10 md:py-16')
     .replace(/py-14 md:py-20/g, 'py-8 md:py-12')
     .replace(/py-16 md:py-20/g, 'py-10 md:py-16')
     .replace(/py-12 md:py-16 lg:py-20/g, 'py-8 md:py-12')
     .replace(/min-h-\[610px\]/g, 'min-h-[400px]')
     .replace(/md:min-h-\[660px\]/g, 'md:min-h-[450px]')
     .replace(/px-5 py-16 md:min-h-\[660px\]/g, 'px-5 py-12 md:min-h-[450px]')
     .replace(/className="-translate-y-10 md:-translate-y-14"/g, 'className=""')
     .replace(/bg-\[#fcf7f8\] pb-16 md:pb-20/g, 'bg-[#fcf7f8] pt-8 pb-10 md:pt-12 md:pb-16')
     .replace(/-mt-4 flex flex-col items-start/g, 'mt-8 flex flex-col items-start');
fs.writeFileSync('app/page.tsx', c);
console.log('Fixed paddings');
