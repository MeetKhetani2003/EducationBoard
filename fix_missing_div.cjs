const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  '/[1, 2, 3].map((item) => <button key={item} className={"grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold " + (item === 1 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600")}>{item}</button>)}</div></div></main></>;',
  '/[1, 2, 3].map((item) => <button key={item} className={"grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold " + (item === 1 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600")}>{item}</button>)}</div></div></div></main></>;'
);

// Fallback search replace without slash
c = c.replace(
  '{[1, 2, 3].map((item) => <button key={item} className={"grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold " + (item === 1 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600")}>{item}</button>)}</div></div></main></>;',
  '{[1, 2, 3].map((item) => <button key={item} className={"grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold " + (item === 1 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600")}>{item}</button>)}</div></div></div></main></>;'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Fixed missing closing div in NewsPage return!');
