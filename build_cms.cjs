const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add CmsContext at the top (after imports)
if (!c.includes('const CmsContext = React.createContext')) {
  c = c.replace(
    'type Page =',
    'export const CmsContext = React.createContext<Record<string, any>>({});\n\ntype Page ='
  );
}

// 2. Fetch CMS Data in App
if (!c.includes('const [cmsData, setCmsData] = useState')) {
  c = c.replace(
    'export default function App() {\n  const [mounted, setMounted] = useState(false);',
    'export default function App() {\n  const [mounted, setMounted] = useState(false);\n  const [cmsData, setCmsData] = useState<Record<string, any>>({});\n\n  const fetchCms = async () => {\n    try {\n      const res = await fetch("/api/cms");\n      const data = await res.json();\n      const map: Record<string, any> = {};\n      data.forEach((d: any) => map[d.key] = d.value);\n      setCmsData(map);\n    } catch(e) {}\n  };\n\n  useEffect(() => { fetchCms(); }, []);'
  );
}

// Wrap the App return with Provider
c = c.replace(
  'return <>\n      {isAdmin ? <AdminShell page={page} navigate={navigate} notify={notify} /> : <div className="min-h-screen bg-white"><PublicHeader navigate={navigate} active={page} /><AnimatePresence mode="wait">',
  'return <CmsContext.Provider value={{ cmsData, fetchCms }}>\n      {isAdmin ? <AdminShell page={page} navigate={navigate} notify={notify} /> : <div className="min-h-screen bg-white"><PublicHeader navigate={navigate} active={page} /><AnimatePresence mode="wait">'
);
c = c.replace(
  '</AnimatePresence><PublicFooter navigate={navigate} /></div>}\n    </>;',
  '</AnimatePresence><PublicFooter navigate={navigate} /></div>}\n    </CmsContext.Provider>;'
);

// 3. Make HomePage dynamic
// Find function HomePage
const homePageTarget = 'function HomePage({ navigate }: { navigate: Navigate }) {';
const homePageReplacement = `function HomePage({ navigate }: { navigate: Navigate }) {
  const { cmsData } = React.useContext(CmsContext);
  
  const heroTitle = cmsData['home.hero.title'] || "Excellence in\\nEducation & Skill Development";
  const heroText = cmsData['home.hero.text'] || "Fostering academic brilliance and technical proficiency to empower the next generation of leaders and innovators.";
  const heroBg = cmsData['home.hero.image'] || images.campus;
`;
c = c.replace(homePageTarget, homePageReplacement);

// Replace static text with variables in HomePage
c = c.replace(
  '<h1 className="text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"><span className="block text-white/90">Excellence in</span><span className="block text-white">Education &amp; Skill Development</span></h1>',
  '<h1 className="text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl whitespace-pre-line text-white">{heroTitle}</h1>'
);

c = c.replace(
  '<p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:mt-6 md:text-base">Fostering academic brilliance and technical proficiency to empower the next generation of leaders and innovators.</p>',
  '<p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:mt-6 md:text-base">{heroText}</p>'
);

c = c.replace(
  'className="absolute inset-0 h-full w-full object-cover object-center"',
  'src={heroBg} className="absolute inset-0 h-full w-full object-cover object-center"'
);

// 4. Overhaul AdminSettings into a CMS Panel
const adminSettingsRegex = /function AdminSettings\(\{ notify \}: \{ notify: \(message: string\) => void \}\) \{[\s\S]*?function AdminMessages/m;
const newAdminSettings = `function AdminSettings({ notify }: { notify: (message: string) => void }) {
  const { cmsData, fetchCms } = React.useContext(CmsContext);
  const [activeTab, setActiveTab] = useState("Home Page");
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Sync formData with cmsData on load
  useEffect(() => { setFormData(cmsData); }, [cmsData]);

  const handleTextChange = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleImageUpload = async (key: string, file: File) => {
    try {
      notify("Uploading image...");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", key);
      fd.append("category", "CMS");
      
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      const data = await res.json();
      
      if (res.ok) {
        const imageUrl = \`/api/documents?id=\${data._id}\`;
        setFormData(prev => ({ ...prev, [key]: imageUrl }));
        notify("Image uploaded successfully.");
      } else throw new Error(data.error);
    } catch(err: any) {
      alert("Upload failed: " + err.message);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save all modified fields
      const promises = Object.keys(formData).map(key => {
        if (formData[key] !== cmsData[key]) {
          return fetch("/api/cms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, type: "text", value: formData[key] })
          });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      await fetchCms();
      notify("All website settings saved securely to database.");
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return <><AdminHeader title="Website Settings (CMS)" text="Manage institutional identity, page content, and images." actions={<Button disabled={saving} onClick={saveSettings}>{saving ? "Saving..." : "Save Changes"}</Button>} /><div className="grid gap-6 xl:grid-cols-[240px_1fr]"><nav className="h-fit border border-stone-200 bg-white p-2">{["Home Page", "About Page", "Programmes", "General Information"].map((item) => <button key={item} onClick={() => setActiveTab(item)} className={\`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium \${activeTab === item ? "bg-stone-50 text-[#a1283c]" : "text-stone-500 hover:bg-stone-50"}\`}><Settings className="h-4 w-4" />{item}</button>)}</nav>
  <section className="border border-stone-200 bg-white p-5 md:p-7">
    
    {activeTab === "Home Page" && (
      <div>
        <h2 className="font-semibold text-stone-900">Home Page Content</h2>
        <p className="mt-1 text-xs text-stone-400 mb-6">Fully customize the public homepage hero section and images.</p>
        
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Hero Title</label>
            <textarea className="w-full rounded border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none" rows={2} value={formData['home.hero.title'] || ""} onChange={e => handleTextChange('home.hero.title', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Hero Subtext</label>
            <textarea className="w-full rounded border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none" rows={3} value={formData['home.hero.text'] || ""} onChange={e => handleTextChange('home.hero.text', e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Hero Background Image</label>
            <div className="flex gap-4 items-center">
              {formData['home.hero.image'] && <img src={formData['home.hero.image']} className="w-32 h-20 object-cover rounded border" />}
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload('home.hero.image', e.target.files[0])} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === "General Information" && (
      <div>
        <h2 className="font-semibold text-stone-900">General Information</h2>
        <p className="mt-1 text-xs text-stone-400 mb-6">Public organization details shown throughout the website.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Organization Name</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={formData['org.name'] || "Thar Board of School and Technical Education"} onChange={e => handleTextChange('org.name', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Official Tagline</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={formData['org.tagline'] || "Examination & Certification Authority"} onChange={e => handleTextChange('org.tagline', e.target.value)} />
          </div>
        </div>
      </div>
    )}

    {(activeTab === "About Page" || activeTab === "Programmes") && (
      <div className="flex flex-col items-center justify-center py-12 text-stone-400">
        <Sparkles className="h-12 w-12 mb-3 opacity-20" />
        <p>CMS Integration for this section is ready to be expanded.</p>
      </div>
    )}
  </section></div></>;
}

function AdminMessages`;
c = c.replace(adminSettingsRegex, newAdminSettings);

fs.writeFileSync('app/page.tsx', c);
console.log('Successfully injected CMS layer!');
