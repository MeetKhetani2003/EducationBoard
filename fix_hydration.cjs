const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  'export default function App() {\n  const [page, setPage] = useState<Page>(pageFromHash);',
  'export default function App() {\n  const [mounted, setMounted] = useState(false);\n  const [page, setPage] = useState<Page>(pageFromHash);'
);

c = c.replace(
  'useEffect(() => {\n    const syncPage',
  'useEffect(() => {\n    setMounted(true);\n    const syncPage'
);

// In the App return block:
c = c.replace(
  'return <>\n      {isAdmin ? <AdminShell page={page} navigate={navigate} notify={notify} />',
  'if (!mounted) return <div className="min-h-screen bg-[#fcf7f8] grid place-items-center"><div className="animate-pulse text-[#8d1c2f] font-bold text-xl">Loading Platform...</div></div>;\n\n    return <>\n      {isAdmin ? <AdminShell page={page} navigate={navigate} notify={notify} />'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Fixed Hydration');
