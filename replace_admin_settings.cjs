const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

const oldSettings = `function AdminSettings({ notify }: { notify: (message: string) => void }) {
  return <><AdminHeader title="Website Settings" text="Manage institutional identity, contacts and portal configuration." actions={<Button onClick={() => notify("Website settings saved.")}>Save Changes</Button>} /><div className="grid gap-6 xl:grid-cols-[240px_1fr]"><nav className="h-fit border border-stone-200 bg-white p-2">{["General Information", "Branding", "Contact Details", "Result Settings", "Email Notifications", "Accessibility"].map((item, i) => <button key={item} className={\`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium \${i === 0 ? "bg-stone-50 text-[#a1283c]" : "text-stone-500 hover:bg-stone-50"}\`}>{i === 0 ? <Building2 className="h-4 w-4" /> : <Settings className="h-4 w-4" />}{item}</button>)}</nav><section className="border border-stone-200 bg-white p-5 md:p-7"><h2 className="font-semibold text-stone-900">General Information</h2><p className="mt-1 text-xs text-stone-400">Public organization details shown throughout the website.</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div className="md:col-span-2"><Field label="Organization Name" value="Thar Board of School and Technical Education" /></div><div className="md:col-span-2"><Field label="Official Tagline" value="Examination & Certification Authority" /></div><Field label="Public Email" value="help@tbste.edu" /><Field label="Helpline Number" value="1800-123-2026" /><SelectField label="Default Language" options={["English", "Hindi"]} /><SelectField label="Timezone" options={["Asia/Kolkata (IST)"]} /></div><div className="mt-7 border-t border-stone-200 pt-6"><h3 className="text-sm font-semibold text-stone-800">Portal Status</h3><div className="mt-4 flex items-center justify-between rounded-lg border border-stone-200 p-4"><div><b className="text-xs text-stone-700">Public website</b><p className="mt-1 text-[11px] text-stone-400">Allow public access to the website and result portal.</p></div><button className="relative h-6 w-11 rounded-full bg-lime-500"><span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" /></button></div></div></section></div></>;
}`;

const newSettings = `function AdminSettings({ notify }: { notify: (message: string) => void }) {
  const { cmsData, fetchCms } = React.useContext(CmsContext);
  const [activeTab, setActiveTab] = useState("Home Page");
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Sync form with cms on first load
  useEffect(() => {
    setFormValues({
      'home.hero.title': cmsData['home.hero.title'] || 'Excellence in Education & Skill Development',
      'home.hero.text': cmsData['home.hero.text'] || 'Fostering academic brilliance and technical proficiency to empower the next generation of leaders and innovators.',
      'about.hero.title': cmsData['about.hero.title'] || 'About the Board',
      'about.hero.text': cmsData['about.hero.text'] || 'We are a premier educational body committed to excellence in assessment and certification.',
      'programmes.hero.title': cmsData['programmes.hero.title'] || 'Our Programmes',
      'programmes.hero.text': cmsData['programmes.hero.text'] || 'Explore our wide range of academic and vocational programmes.',
      'org.name': cmsData['org.name'] || 'Thar Board of School and Technical Education',
      'org.tagline': cmsData['org.tagline'] || 'Examination & Certification Authority',
      'org.email': cmsData['org.email'] || 'help@tbste.edu',
      'org.phone': cmsData['org.phone'] || '1800-123-2026',
    });
  }, [cmsData]);

  const set = (key: string, val: string) => setFormValues(prev => ({ ...prev, [key]: val }));

  const handleImageUpload = async (key: string, file: File) => {
    notify('Uploading image...');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', key);
    fd.append('category', 'CMS');
    try {
      const res = await fetch('/api/documents', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      set(key, \`/api/documents?id=\${data._id}\`);
      notify('Image uploaded! Click Save Changes to apply.');
    } catch(e: any) { alert(e.message); }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(formValues).map(([key, value]) =>
        fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, type: 'text', value })
        })
      ));
      await fetchCms();
      notify('All settings saved to database successfully!');
    } catch(e) { alert('Error saving settings'); }
    finally { setSaving(false); }
  };

  const tabs = ['Home Page', 'About Page', 'Programmes', 'General Information'];
  
  const CmsField = ({ label, fieldKey, rows }: { label: string; fieldKey: string; rows?: number }) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      {rows ? (
        <textarea className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none resize-none" rows={rows} value={formValues[fieldKey] || ''} onChange={e => set(fieldKey, e.target.value)} />
      ) : (
        <input className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none" value={formValues[fieldKey] || ''} onChange={e => set(fieldKey, e.target.value)} />
      )}
    </div>
  );

  const ImageUploader = ({ label, fieldKey }: { label: string; fieldKey: string }) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <div className="flex items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
        {formValues[fieldKey] && <img src={formValues[fieldKey]} alt="" className="h-16 w-24 rounded object-cover border" />}
        <label className="cursor-pointer rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
          Choose Image
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(fieldKey, e.target.files[0])} />
        </label>
        <span className="text-[11px] text-stone-400">JPG, PNG, WebP – max 5MB</span>
      </div>
    </div>
  );

  return <><AdminHeader title="Website Settings (CMS)" text="Edit all public page content, text and images from here." actions={<Button disabled={saving} onClick={saveAll}>{saving ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}</Button>} />
  <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
    <nav className="h-fit border border-stone-200 bg-white p-2">
      {tabs.map(tab => (
        <button key={tab} onClick={() => setActiveTab(tab)} className={\`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors \${activeTab === tab ? 'bg-[#fdf5f6] text-[#a1283c] font-semibold' : 'text-stone-500 hover:bg-stone-50'}\`}>
          <Settings className="h-4 w-4" />{tab}
        </button>
      ))}
    </nav>
    <section className="space-y-6">
      {activeTab === 'Home Page' && (
        <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">Home Page</h2>
          <p className="text-xs text-stone-400 mb-6">Edit the hero banner text and background image shown on the public homepage.</p>
          <div className="space-y-5">
            <CmsField label="Hero Title" fieldKey="home.hero.title" rows={2} />
            <CmsField label="Hero Subtext" fieldKey="home.hero.text" rows={3} />
            <ImageUploader label="Hero Background Image" fieldKey="home.hero.image" />
          </div>
        </div>
      )}
      {activeTab === 'About Page' && (
        <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">About Page</h2>
          <p className="text-xs text-stone-400 mb-6">Edit the hero text and background image shown on the About page.</p>
          <div className="space-y-5">
            <CmsField label="Hero Title" fieldKey="about.hero.title" />
            <CmsField label="Hero Subtext" fieldKey="about.hero.text" rows={3} />
            <ImageUploader label="Hero Background Image" fieldKey="about.hero.image" />
          </div>
        </div>
      )}
      {activeTab === 'Programmes' && (
        <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">Programmes Page</h2>
          <p className="text-xs text-stone-400 mb-6">Edit the hero section for the Programmes page.</p>
          <div className="space-y-5">
            <CmsField label="Hero Title" fieldKey="programmes.hero.title" />
            <CmsField label="Hero Subtext" fieldKey="programmes.hero.text" rows={3} />
            <ImageUploader label="Hero Background Image" fieldKey="programmes.hero.image" />
          </div>
        </div>
      )}
      {activeTab === 'General Information' && (
        <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">General Information</h2>
          <p className="text-xs text-stone-400 mb-6">Core organization details shown site-wide.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><CmsField label="Organization Name" fieldKey="org.name" /></div>
            <div className="md:col-span-2"><CmsField label="Official Tagline" fieldKey="org.tagline" /></div>
            <CmsField label="Public Email" fieldKey="org.email" />
            <CmsField label="Helpline Number" fieldKey="org.phone" />
          </div>
        </div>
      )}
    </section>
  </div></>;
}`;

// Use exact byte-level replacement
c = c.replace(oldSettings, newSettings);

if (!c.includes('const [activeTab, setActiveTab] = useState')) {
  console.error('Replacement FAILED - old string not found');
  process.exit(1);
}

fs.writeFileSync('app/page.tsx', c);
console.log('AdminSettings replaced successfully!');
