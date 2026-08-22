const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
const lines = c.split('\n');

// ===== FIX 1: Add cmsData state and Provider to App component =====
const toastIdx = lines.findIndex((l, i) => i > 720 && l.includes('const [toast, setToast] = useState("")'));
// Insert cmsData state after toast line
lines.splice(toastIdx + 1, 0, `
  const [cmsData, setCmsData] = React.useState({});

  const fetchCms = React.useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      data.forEach(d => map[d.key] = d.value);
      setCmsData(map);
    } catch(e) {}
  }, []);

  useEffect(() => { fetchCms(); }, [fetchCms]);`
);

// Rebuild the file string after splice
let newContent = lines.join('\n');

// ===== FIX 2: Wrap App return with CmsContext.Provider =====
// Find isAdmin line and the return
newContent = newContent.replace(
  'const isAdmin = page.startsWith("admin-");\n  return <>',
  `const isAdmin = page.startsWith("admin-");
  return <CmsContext.Provider value={{ cmsData, fetchCms }}>`
);

// Close the Provider instead of </>
// The closing is: </>;  but we need </CmsContext.Provider>;
newContent = newContent.replace(
  `  </AnimatePresence>\n  </>;
}`,
  `  </AnimatePresence>
  </CmsContext.Provider>;
}`
);

// ===== FIX 3: Fix cmsData safely in HomePage =====
newContent = newContent.replace(
  `  const { cmsData } = React.useContext(CmsContext);
  
  const heroTitle = cmsData['home.hero.title']`,
  `  const { cmsData } = React.useContext(CmsContext);
  const safeCms = cmsData || {};
  
  const heroTitle = safeCms['home.hero.title']`
);
newContent = newContent.replace(
  `cmsData['home.hero.text']`,
  `safeCms['home.hero.text']`
);
newContent = newContent.replace(
  `cmsData['home.hero.image']`,
  `safeCms['home.hero.image']`
);

// Also fix AdminSettings useContext cmsData to be safe
newContent = newContent.replace(
  `  const { cmsData, fetchCms } = React.useContext(CmsContext);
  const [activeTab, setActiveTab] = React.useState("Home Page");`,
  `  const { cmsData: rawCms, fetchCms } = React.useContext(CmsContext);
  const cmsData = rawCms || {};
  const [activeTab, setActiveTab] = React.useState("Home Page");`
);

// ===== FIX 4: Fix AdminCollection body (it returns null, fix with settings + full body) =====
newContent = newContent.replace(
  `function AdminCollection({ page, notify }: { page: Page; notify: (message: string) => void }) {
  return null;
}`,
  `function AdminCollection({ page, notify }: { page: Page; notify: (message: string) => void }) {
  if (page === "admin-settings") return <AdminSettings notify={notify} />;
  if (page === "admin-programmes") return <><AdminHeader title="Programmes Management" text="Manage academic pathways and programme information." actions={<Button><Plus className="h-4 w-4" /> Add Programme</Button>} /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{programmes.map((item) => <article key={item.title} className="border border-stone-200 bg-white"><img src={item.image} alt="" className="aspect-[16/7] w-full object-cover" /><div className="p-5"><div className="flex justify-between"><StatusBadge tone="green">Published</StatusBadge><button><MoreHorizontal className="h-4 w-4 text-stone-400" /></button></div><h2 className="mt-4 font-semibold text-stone-800">{item.title}</h2><p className="mt-2 text-xs leading-5 text-stone-500">{item.eligibility} / {item.duration}</p><div className="mt-4 flex gap-2"><Button variant="secondary" className="min-h-9 flex-1"><Pencil className="h-4 w-4" /> Edit</Button><Button variant="ghost" className="min-h-9"><Eye className="h-4 w-4" /></Button></div></div></article>)}</div></>;
  if (page === "admin-gallery") return <><AdminHeader title="Gallery Management" text="Organize institutional images and event albums." actions={<Button onClick={() => notify("Gallery image uploader opened.")}><UploadCloud className="h-4 w-4" /> Upload Images</Button>} /><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{[images.graduation, images.exams, images.campus, images.ceremony, images.students, images.graduates, images.conversation, images.celebrate].map((image, i) => <div className="group relative overflow-hidden bg-white" key={image}><img src={image} alt="" className="aspect-square w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-stone-950/75 p-3 text-white transition group-hover:translate-y-0"><span className="text-[11px]">Gallery image {i + 1}</span><button><Trash2 className="h-4 w-4" /></button></div></div>)}</div></>;
  if (page === "admin-recognition") return <><AdminHeader title="Recognition Management" text="Manage recognition records and document references." actions={<Button><Plus className="h-4 w-4" /> Add Record</Button>} /><section className="border border-stone-200 bg-white">{["Educational Recognition Record", "Institutional Registration", "Copyright Registration", "Quality & Compliance Record"].map((item, i) => <div key={item} className="grid gap-3 border-b border-stone-100 p-4 last:border-0 sm:grid-cols-[1fr_180px_110px_90px] sm:items-center"><div className="flex items-center gap-3"><Award className="h-5 w-5 text-[#a1283c]" /><div><h2 className="text-xs font-semibold text-stone-800">{item}</h2><p className="mt-1 text-[11px] text-stone-400">TBSTE/DEMO/2026/00{i + 1}</p></div></div><span className="text-xs text-stone-500">Recognition Authority</span><StatusBadge tone="green">Published</StatusBadge><Button variant="ghost" className="min-h-8 px-2"><Pencil className="h-4 w-4" /> Edit</Button></div>)}</section></>;
  if (page === "admin-messages") return <><AdminHeader title="Contact Messages" text="Review and respond to website enquiries." /><div className="grid gap-6 xl:grid-cols-[360px_1fr]"><section className="border border-stone-200 bg-white">{["Result access support", "Certificate correction request", "Examination centre query", "Admission document question"].map((item, i) => <button key={item} className={\`block w-full border-b border-stone-100 p-4 text-left \${i === 0 ? "bg-stone-50" : "hover:bg-stone-50"}\`}><div className="flex justify-between"><span className="text-xs font-semibold text-stone-800">{["Rajesh Kumar", "Priya Nair", "Dev Mehta", "Fatima Ali"][i]}</span><span className="text-[10px] text-stone-400">{i + 1}h ago</span></div><p className="mt-1 text-xs font-medium text-stone-600">{item}</p><p className="mt-1 truncate text-[11px] text-stone-400">I need assistance with my student service request...</p></button>)}</section><section className="border border-stone-200 bg-white"><div className="border-b border-stone-200 p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-stone-900">Result access support</h2><p className="mt-1 text-xs text-stone-400">From Rajesh Kumar / rajesh@example.com</p></div><StatusBadge tone="amber">Open</StatusBadge></div></div><div className="p-5"><div className="rounded-lg bg-stone-50 p-4 text-sm leading-6 text-stone-600">I am unable to access my Senior Secondary result even after entering the details shown on my admit card.</div><label className="mt-6 block text-xs font-semibold text-stone-700">Reply<textarea rows={6} className="mt-2 w-full rounded-lg border border-stone-200 p-3 text-sm" placeholder="Write a response" /></label><div className="mt-4 flex justify-end gap-2"><Button variant="secondary">Mark Resolved</Button><Button onClick={() => notify("Reply sent to Rajesh Kumar.")}><Send className="h-4 w-4" /> Send Reply</Button></div></div></section></div></>;
  return null;
}`
);

// ===== FIX 5: Add admin-settings to renderAdminPage switch =====
newContent = newContent.replace(
  `case "admin-downloads": return <AdminDownloads notify={notify} />;
    default: return <AdminCollection page={page} notify={notify} />;`,
  `case "admin-downloads": return <AdminDownloads notify={notify} />;
    case "admin-settings": return <AdminSettings notify={notify} />;
    default: return <AdminCollection page={page} notify={notify} />;`
);

fs.writeFileSync('app/page.tsx', newContent);

// Verify
const verify = fs.readFileSync('app/page.tsx', 'utf8');
console.log('✅ CmsContext.Provider wraps App:', verify.includes('CmsContext.Provider'));
console.log('✅ safeCms used in HomePage:', verify.includes('const safeCms = cmsData || {}'));
console.log('✅ AdminCollection has content:', verify.includes('admin-settings') && verify.includes('admin-recognition'));
console.log('✅ saveAll in AdminSettings:', verify.includes('saveAll'));
console.log('✅ cmsData fetch in App:', verify.includes('fetchCms = React.useCallback'));
console.log('Done! All fixes applied.');
