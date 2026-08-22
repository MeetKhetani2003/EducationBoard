const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(/<SelectField label="Examination \/ Programme" required options=\{\["Senior Secondary", "Secondary", "Vocational Programme"\]\} \/><SelectField label="Exam Year" required options=\{\["2026", "2025", "2024", "2023"\]\} \/>/g, '');

c = c.replace(/className=\{`grid gap-5 \$\{compact \? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-5"\}`\}/g, 'className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}');

fs.writeFileSync('app/page.tsx', c);
console.log('Removed dropdowns');
