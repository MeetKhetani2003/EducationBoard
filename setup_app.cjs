const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
fs.writeFileSync('app/page.tsx', '"use client";\n' + content + '\nexport default App;\n');
const layout = 'import "./globals.css";\nexport default function RootLayout({ children }: { children: React.ReactNode }) { return ( <html lang="en"> <body>{children}</body> </html> ); }';
fs.writeFileSync('app/layout.tsx', layout);
console.log('Done');
