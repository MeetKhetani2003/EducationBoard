const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

console.log('Original length:', content.length);

// --- 1. Fix Hydration mismatch in App component (hash routing) ---
const appSearch = `export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [toast, setToast] = useState("");

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

  useEffect(() => { fetchCms(); }, [fetchCms]);

  useEffect(() => {
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  useEffect(() => {
    const label = [...adminNav, ...navItems].find((item) => item.page === page)?.label || "Official Portal";
    document.title = \`\${label} | Thar Board of School and Technical Education\`;
  }, [page]);`;

const appReplace = `export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [toast, setToast] = useState("");

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

  useEffect(() => { fetchCms(); }, [fetchCms]);

  useEffect(() => {
    setPage(pageFromHash());
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  useEffect(() => {
    const label = [...adminNav, ...navItems].find((item) => item.page === page)?.label || "Official Portal";
    document.title = \`\${label} | Thar Board of School and Technical Education\`;
  }, [page]);`;

content = content.replace(appSearch, appReplace);

// --- 2. Update AdminDownloads to handle programme allocation ---
const startMarker = 'function AdminDownloads({ notify }: { notify: (message: string) => void }) {';
const endMarker = 'function AdminSettings({ notify }) {';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Error: Could not locate AdminDownloads markers');
} else {
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
}

// --- 3. Update AdminStudents to handle programme selection ---
const adminStudentsStart = 'function AdminStudents({ notify }: { notify: (message: string) => void }) {';
const adminStudentsEnd = 'function AdminExams({ notify }: { notify: (message: string) => void }) {';
const sIndex = content.indexOf(adminStudentsStart);
const eIndex = content.indexOf(adminStudentsEnd);

if (sIndex === -1 || eIndex === -1) {
  console.log('Error: Could not locate AdminStudents markers');
} else {
  const updatedAdminStudents = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProgs, setSelectedProgs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setDbStudents(data || []);
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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollmentNumber, fatherName, dob, email, phone, address, programmes: selectedProgs })
      });
      if (res.ok) {
        notify("Student created successfully!");
        setShowAddModal(false);
        setName("");
        setEnrollmentNumber("");
        setFatherName("");
        setDob("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSelectedProgs([]);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create student");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      const res = await fetch(\`/api/students?id=\${id}\`, { method: "DELETE" });
      if (res.ok) {
        notify("Student record deleted.");
        fetchData();
      }
    } catch (err) {
      alert("Error deleting student");
    }
  };

  const rows = dbStudents.filter(row => 
    (row.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (row.enrollmentNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Students Directory" text="Manage registered learners and their profile database." actions={<Button onClick={() => setShowAddModal(true)}><UserPlus className="h-4 w-4" /> Add Student</Button>} /><section className="border border-stone-200 bg-white"><div className="flex gap-3 border-b border-stone-200 p-4"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search by name or enrollment number..." /></label></div><div className="divide-y divide-stone-100">{loading ? <div className="p-8 text-center text-stone-400 text-xs">Loading students...</div> : rows.length === 0 ? <div className="p-8 text-center text-stone-400 text-xs">No student records found.</div> : rows.map((row) => <div key={row._id} className="grid gap-3 p-4 md:grid-cols-[1fr_150px_100px_90px] md:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><User className="h-5 w-5" /></span><div><h2 className="text-xs font-semibold text-stone-800">{row.name}</h2><p className="mt-1 text-[11px] text-stone-400">Enrollment: {row.enrollmentNumber}</p></div></div><span className="text-xs text-stone-500">{row.phone || "No Phone"}</span><span className="text-xs text-stone-400">{row.dob ? new Date(row.dob).toLocaleDateString() : "-"}</span><div className="flex gap-1 md:justify-end"><button onClick={() => setSelectedStudent(row)} className="grid h-8 w-8 place-items-center rounded hover:bg-stone-50 text-stone-600"><Eye className="h-4 w-4" /></button><button onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>

    {/* ADD STUDENT MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add Student Record</h3><button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><form onSubmit={handleAddStudent} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={name} onChange={e => setName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={fatherName} onChange={e => setFatherName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={dob} onChange={e => setDob(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Email</label><input type="email" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={email} onChange={e => setEmail(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={phone} onChange={e => setPhone(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Course / Programme Allocation</label><div className="mt-1 border border-stone-200 rounded p-3 bg-stone-50 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{progs.map(p => (<label key={p._id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"><input type="checkbox" checked={selectedProgs.includes(p.title)} onChange={e => { if (e.target.checked) { setSelectedProgs([...selectedProgs, p.title]); } else { setSelectedProgs(selectedProgs.filter(item => item !== p.title)); } }} className="rounded border-stone-300 text-[#a1283c] focus:ring-[#a1283c]" />{p.title}</label>))}</div></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Address</label><textarea rows={2} className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={address} onChange={e => setAddress(e.target.value)} /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Student"}</Button></div></form></motion.div></motion.div>}</AnimatePresence>

    {/* VIEW DETAILS MODAL */}
    <AnimatePresence>{selectedStudent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Student Profile Details</h3><button onClick={() => setSelectedStudent(null)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-3 text-xs"><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Full Name</span><span className="text-stone-800 font-bold">{selectedStudent.name}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Enrollment Number</span><span className="text-stone-800 font-semibold">{selectedStudent.enrollmentNumber}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Father's Name</span><span className="text-stone-800">{selectedStudent.fatherName}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Date of Birth</span><span className="text-stone-800">{selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : "-"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Email Address</span><span className="text-stone-800">{selectedStudent.email || "N/A"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Phone Number</span><span className="text-stone-800">{selectedStudent.phone || "N/A"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Address</span><span className="text-stone-800 whitespace-pre-wrap">{selectedStudent.address || "N/A"}</span></div><div className="grid grid-cols-2 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Allocated Programmes</span><span className="text-stone-800 font-bold">{selectedStudent.programmes && selectedStudent.programmes.length > 0 ? selectedStudent.programmes.join(', ') : "None"}</span></div></div><div className="flex justify-end border-t border-stone-200 pt-3 mt-4"><Button onClick={() => setSelectedStudent(null)}>Close</Button></div></motion.div></motion.div>}</AnimatePresence></>;
}
`;
  content = content.substring(0, sIndex) + updatedAdminStudents + content.substring(eIndex);
}

// --- 4. Update StudentPortalShell for tabs + active course selector + watermark marksheet ---
const startPortal = 'function StudentPortalShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {';
const endPortal = 'export default function App() {';
const pStartIndex = content.indexOf(startPortal);
const pEndIndex = content.indexOf(endPortal);

if (pStartIndex === -1 || pEndIndex === -1) {
  console.log('Error: Could not locate StudentPortalShell markers');
} else {
  const updatedStudentPortal = `function StudentPortalShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [activeCourse, setActiveCourse] = useState("All Programmes");
  const [allocatedCourses, setAllocatedCourses] = useState<string[]>([]);

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (!sessionStr) {
      navigate("student-login");
      return;
    }
    try {
      const session = JSON.parse(sessionStr);
      setStudent(session);
      
      Promise.all([
        fetch('/api/results?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/students?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch('/api/documents').then(r => r.json())
      ]).then(([resData, stuData, exmData, docData]) => {
        let profileProgs: string[] = [];
        if (stuData && stuData.length > 0) {
          const found = stuData.find((s: any) => s.enrollmentNumber === session.enrollmentNumber);
          setStudentDetails(found);
          if (found && found.programmes) profileProgs = found.programmes;
        }

        let resultsProgs: string[] = [];
        if (resData.results) {
          const myResults = resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber);
          setResults(myResults);
          resultsProgs = myResults.map((r: any) => r.programme);
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
          resultsProgs = [resData.programme];
        }

        const combined = Array.from(new Set([...profileProgs, ...resultsProgs]));
        setAllocatedCourses(combined);
        if (combined.length > 0) setActiveCourse(combined[0]);
        
        setExams(Array.isArray(exmData) ? exmData : []);
        setDocuments(Array.isArray(docData) ? docData : []);
        
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } catch (e) {
      navigate("student-login");
    }
  }, []);

  const portalNav = [
    { label: "My Dashboard", icon: LayoutDashboard },
    { label: "Academic Profile", icon: User },
    { label: "Examination Schedule", icon: CalendarDays },
    { label: "My Results", icon: FileCheck2 },
    { label: "Study Material", icon: BookOpen },
    { label: "Downloads & Forms", icon: Download },
    { label: "Help & Support", icon: LifeBuoy },
  ];

  if (loading || !student) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]"><LoaderCircle className="h-8 w-8 animate-spin text-[#8d1c2f]" /></div>;
  }

  const handleSignOut = () => {
    localStorage.removeItem('studentSession');
    navigate("home");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-800 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={\`fixed inset-y-0 left-0 z-50 w-64 bg-[#4a131c] text-white flex flex-col transition-transform md:translate-x-0 md:static shrink-0 \${open ? "translate-x-0" : "-translate-x-full"}\`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Logo inverse compact />
          <button onClick={() => setOpen(false)} className="md:hidden text-white hover:text-stone-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#8d1c2f] flex items-center justify-center border-2 border-[#e8c476]">
              <span className="font-bold text-lg text-[#e8c476]">{student.studentName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold text-sm line-clamp-1" title={student.studentName}>{student.studentName}</div>
              <div className="text-xs text-[#e8c476]">Enr: {student.enrollmentNumber}</div>
            </div>
          </div>
          {allocatedCourses.length > 0 && (
            <div className="mt-2">
              <label className="text-[10px] uppercase text-white/50 tracking-wider mb-1 block">Active Course</label>
              <select 
                className="w-full bg-[#3c0f16] border border-white/20 text-xs rounded p-1.5 outline-none text-white focus:border-[#e8c476]"
                value={activeCourse}
                onChange={e => setActiveCourse(e.target.value)}
              >
                {allocatedCourses.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {portalNav.map((item) => (
            <button key={item.label} onClick={() => { setActiveTab(item.label); setOpen(false); }} className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition \${activeTab === item.label ? "bg-[#8d1c2f] text-white shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}\`}>
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 bg-[#8d1c2f] hover:bg-[#721523] text-white text-xs font-semibold py-2 rounded-lg transition">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden text-stone-600 hover:text-stone-900">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-stone-800 text-lg md:text-xl">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <span className="text-stone-400 block font-medium">Session ID</span>
              <span className="font-semibold text-stone-700">{student.id.substring(0, 8)}...</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "My Dashboard" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#4a131c] rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-2">
                    <span className="bg-[#e8c476] text-[#4a131c] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Official Student Portal</span>
                    <h2 className="text-xl md:text-2xl font-bold">Welcome back, {student.studentName}!</h2>
                    <p className="text-white/80 text-sm max-w-lg">Access study materials, download syllabi, view exam dates, and check your declared marksheet directly.</p>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6">
                    <GraduationCap className="h-48 w-48" />
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
                    <h2 className="font-bold text-stone-800">Upcoming Examinations</h2>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).length === 0 ? (
                      <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled for this course.</div>
                    ) : (
                      exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).map((exam, i) => (
                        <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition">
                          <div>
                            <h3 className="font-bold text-[#8d1c2f]">{exam.title}</h3>
                            <p className="text-sm text-stone-600 mt-1">{exam.description}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="inline-block bg-[#faebee] text-[#8d1c2f] text-xs font-bold px-3 py-1 rounded-full mb-1">{exam.programme}</span>
                            <div className="text-sm font-semibold text-stone-800">{new Date(exam.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-b from-[#4a131c] to-[#631824] rounded-xl shadow-sm text-white overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-[#e8c476]" /> Notice Board</h2>
                  </div>
                  <div className="p-5 text-center text-sm text-white/70">
                    No new notices.
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
                  <h2 className="font-bold text-stone-800 mb-4">Quick Links</h2>
                  <div className="space-y-3">
                    <button onClick={() => notify("Admit Card not available.")} className="w-full flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-[#8d1c2f] hover:bg-[#faebee] hover:text-[#8d1c2f] transition text-sm font-semibold text-stone-700">
                      <span className="flex items-center gap-3"><FileCheck2 className="h-4 w-4" /> Admit Card</span>
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "My Results" && (
            <div className="space-y-8">
              <div className="flex justify-end no-print">
                <Button onClick={() => window.print()} className="bg-[#8d1c2f] text-white hover:bg-[#6b1422] flex items-center gap-2">
                  <Printer className="h-4 w-4" /> Download / Print Marksheet
                </Button>
              </div>

              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
                  No results available.
                </div>
              ) : (
                results.map((res: any, idx: number) => (
                  <div key={idx} className="relative bg-white border-2 border-[#8d1c2f] shadow-lg mx-auto max-w-4xl p-8 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <img src={images.logo} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
                    </div>
                    
                    {/* Official Header */}
                    <div className="relative flex flex-col items-center justify-center text-center border-b-4 border-[#8d1c2f] pb-6 mb-6">
                      <div className="flex items-center gap-6 mb-2">
                        <img src={images.logo} alt="Logo" className="h-24 w-24 object-contain" />
                        <div>
                          <h1 className="text-2xl md:text-3xl font-extrabold text-[#440d16] uppercase tracking-wider">Thar Board of School & Technical Education</h1>
                          <p className="text-[#8d1c2f] font-bold text-sm tracking-widest uppercase mt-1">Examination & Certification Authority</p>
                        </div>
                      </div>
                      <h2 className="mt-4 inline-block bg-[#440d16] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-md">
                        Official Statement of Marks
                      </h2>
                    </div>

                    {/* Student Details */}
                    <div className="relative grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Student Name:</span>
                        <span className="w-2/3 font-bold text-stone-900 uppercase">{studentDetails?.name || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Enrollment No:</span>
                        <span className="w-2/3 font-bold text-[#8d1c2f]">{res.enrollmentNumber}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Father's Name:</span>
                        <span className="w-2/3 font-semibold text-stone-900 uppercase">{studentDetails?.fatherName || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Date of Birth:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{studentDetails?.dob ? new Date(studentDetails.dob).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Examination:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.examination} {res.examYear}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Programme:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.programme}</span>
                      </div>
                    </div>

                    {/* Marks Table */}
                    <div className="relative mb-12">
                      <table className="w-full text-left border-collapse border border-stone-300">
                        <thead>
                          <tr className="bg-[#440d16] text-white">
                            <th className="p-3 border border-stone-300 font-bold w-1/2">Subject</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Max Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Min Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Marks Obtained</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                            <tr key={sIdx} className="odd:bg-stone-50">
                              <td className="p-3 border border-stone-300 font-semibold text-stone-800">{sub.name}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.max}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.min}</td>
                              <td className="p-3 border border-stone-300 text-center font-bold text-stone-900">{sub.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#faebee] border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] uppercase text-right pr-6" colSpan={3}>Grand Total</td>
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] text-center text-xl">{res.grandTotal}</td>
                          </tr>
                          <tr className="border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={3}>Result Status</td>
                            <td className={\`p-3 border border-stone-300 font-extrabold text-center text-lg uppercase tracking-wider \${res.resultStatus === 'PASS' ? 'text-green-700' : 'text-red-700'}\`}>
                              {res.resultStatus}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="relative mt-16 pt-8 flex justify-between items-end">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-stone-500 mb-1">Date of Issue</div>
                        <div className="font-bold text-stone-800">{new Date().toLocaleDateString('en-GB')}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="h-16 w-48 border-b-2 border-stone-400 mb-2 flex items-end justify-center pb-2">
                          {/* Placeholder for Signature Image */}
                          <span className="italic text-stone-300 text-sm">Valid Authorized Signature</span>
                        </div>
                        <div className="font-bold text-[#440d16] uppercase text-sm">Controller of Examinations</div>
                        <div className="text-xs text-stone-500 font-medium">Thar Board of School & Technical Education</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Academic Profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Academic Profile</h2>
              </div>
              <div className="p-6">
                {studentDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Student Name</span><div className="font-semibold text-stone-800">{studentDetails.name}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Enrollment Number</span><div className="font-semibold text-stone-800">{studentDetails.enrollmentNumber}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Father's Name</span><div className="font-semibold text-stone-800">{studentDetails.fatherName || '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Date of Birth</span><div className="font-semibold text-stone-800">{studentDetails.dob ? new Date(studentDetails.dob).toLocaleDateString() : '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Email Address</span><div className="font-semibold text-stone-800">{studentDetails.email || '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Phone Number</span><div className="font-semibold text-stone-800">{studentDetails.phone || '-'}</div></div>
                    <div className="md:col-span-2"><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Address</span><div className="font-semibold text-stone-800">{studentDetails.address || '-'}</div></div>
                  </div>
                ) : (
                  <div className="text-stone-500 text-center py-4">Profile details not found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Examination Schedule" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Upcoming Examinations</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled for this course.</div>
                ) : (
                  exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).map((exam, i) => (
                    <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition">
                      <div>
                        <h3 className="font-bold text-[#8d1c2f]">{exam.title}</h3>
                        <p className="text-sm text-stone-600 mt-1">{exam.description}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="inline-block bg-[#faebee] text-[#8d1c2f] text-xs font-bold px-3 py-1 rounded-full mb-1">{exam.programme}</span>
                        <div className="text-sm font-semibold text-stone-800">{new Date(exam.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Study Material" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Study Materials & Notes</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No study materials available at the moment.</div>
                ) : (
                  documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{doc.title}</div>
                          <div className="text-xs text-stone-500">{doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <a href={\`/api/documents?id=\${doc._id}\`} download className="h-8 w-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-[#8d1c2f] hover:text-white transition">
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Downloads & Forms" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Downloads & Forms</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No forms or circulars available at the moment.</div>
                ) : (
                  documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileDown className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{doc.title}</div>
                          <div className="text-xs text-stone-500">{doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <a href={\`/api/documents?id=\${doc._id}\`} download className="h-8 w-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-[#8d1c2f] hover:text-white transition">
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Help & Support" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                  <h2 className="font-bold text-stone-800">Send us a Message</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setSupportSending(true); setTimeout(() => { setSupportSending(false); notify("Message sent to administration!"); setSupportMsg(""); }, 1000); }} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Your Message</label>
                    <textarea required rows={5} value={supportMsg} onChange={e => setSupportMsg(e.target.value)} className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none focus:border-[#8d1c2f]" placeholder="How can we help you today?"></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={supportSending}>{supportSending ? "Sending..." : "Submit Message"}</Button>
                  </div>
                </form>
              </div>
              
              <div className="bg-[#4a131c] rounded-xl shadow-sm border border-stone-200 p-6 text-white h-fit">
                <h3 className="font-bold text-lg mb-4 text-[#e8c476]">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Helpline</div>
                      <div className="text-sm font-semibold">+91 141 2700 000</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Email Support</div>
                      <div className="text-sm font-semibold">studentcare@tbste.edu.in</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Head Office</div>
                      <div className="text-sm font-semibold">Education Hub, Jaipur, Rajasthan 302001</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-stone-950/50 md:hidden" />}
    </div>
  );
}
`;
  content = content.substring(0, pStartIndex) + updatedStudentPortal + content.substring(pEndIndex);
}

console.log('Final length:', content.length);
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully completed applying all changes.');
