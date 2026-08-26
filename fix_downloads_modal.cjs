const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the entire AdminDownloads component with the updated one
const startMarker = 'function AdminDownloads({ notify }: { notify: (message: string) => void }) {';
const endMarker = 'function AdminSettings({ notify }) {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not locate markers in app/page.tsx');
  process.exit(1);
}

const updatedAdminDownloads = `function AdminDownloads({ notify }: { notify: (message: string) => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Form");
  const [programme, setProgramme] = useState("All Programmes");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data || []);
      }
      const pRes = await fetch("/api/programmes");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgs(pData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("category", category);
    fd.append("programme", programme);
    try {
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (res.ok) {
        notify("Document uploaded successfully!");
        setShowAddModal(false);
        setTitle("");
        setCategory("Form");
        setProgramme("All Programmes");
        setFile(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(\`/api/documents?id=\${id}\`, { method: "DELETE" });
      if (res.ok) {
        notify("Document deleted.");
        fetchData();
      }
    } catch (err) {
      alert("Error deleting document");
    }
  };

  const rows = docs.filter(row => 
    (row.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Downloads Management" text="Manage public forms, circulars and academic documents." actions={<Button onClick={() => setShowAddModal(true)}><UploadCloud className="h-4 w-4" /> Upload Document</Button>} /><section className="border border-stone-200 bg-white"><div className="flex gap-3 border-b border-stone-200 p-4"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search files..." /></label></div><div className="divide-y divide-stone-100">{loading ? <div className="p-8 text-center text-stone-400 text-xs">Loading documents...</div> : rows.length === 0 ? <div className="p-8 text-center text-stone-400 text-xs">No documents found. Upload one.</div> : rows.map((row) => <div key={row._id} className="grid gap-3 p-4 md:grid-cols-[1fr_150px_100px_100px_90px] md:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600"><FileText className="h-5 w-5" /></span><div><h2 className="text-xs font-semibold text-stone-800">{row.title}</h2><p className="mt-1 text-[11px] text-stone-400">{row.contentType} / {Math.round(row.size / 1024)} KB</p></div></div><span className="text-xs text-stone-500">{row.category} <span className="text-stone-400 font-normal">| {row.programme || 'All Programmes'}</span></span><span className="text-xs text-stone-400">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span><StatusBadge tone="green">Published</StatusBadge><div className="flex gap-1 md:justify-end"><button onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>

    {/* ADD DOCUMENT MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleUpload} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Upload New Document</h3><button type="button" onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Document Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Examination Form 2026" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={category} onChange={e => setCategory(e.target.value)}><option value="Form">Form</option><option value="Syllabus">Syllabus</option><option value="Prospectus">Prospectus</option><option value="Circular">Circular</option><option value="Notice">Notice</option><option value="Study Material">Study Material</option><option value="Notes">Notes</option></select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Allocate Programme</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={programme} onChange={e => setProgramme(e.target.value)}><option value="All Programmes">All Programmes</option>{progs.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}</select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Choose File *</label><input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Uploading..." : "Upload"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;
}

`;

content = content.substring(0, startIndex) + updatedAdminDownloads + content.substring(endIndex);

fs.writeFileSync(path, content, 'utf8');
console.log('AdminDownloads updated successfully.');
