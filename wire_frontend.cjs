const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Wire up ResultSearch to fetch from API
c = c.replace(
  'function submit(event: FormEvent) { event.preventDefault(); if (enrollment.trim().length < 4) { setError("Enter a valid enrollment number with at least 4 characters."); return; } setError(""); setLoading(true); window.setTimeout(() => { setLoading(false); if (enrollment.toLowerCase() === "notfound") setError("No result found. Please verify your enrollment number, examination and year."); else navigate("result-detail"); }, 1100); }',
  'async function submit(event: FormEvent) { event.preventDefault(); if (enrollment.trim().length < 4) { setError("Enter a valid enrollment number."); return; } setError(""); setLoading(true); try { const res = await fetch(`/api/results?enrollment=${enrollment}&dob=${dob}`); if (!res.ok) throw new Error("No result found. Please check your Enrollment Number and Date of Birth."); const data = await res.json(); window.sessionStorage.setItem("currentResult", JSON.stringify(data)); navigate("result-detail"); } catch (err: any) { setError(err.message); } finally { setLoading(false); } }'
);

// 2. Wire ResultDetailPage to load from sessionStorage
c = c.replace(
  'function ResultDetailPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {',
  'function ResultDetailPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {\n  const [resultData, setResultData] = useState<any>(null);\n  useEffect(() => {\n    const data = window.sessionStorage.getItem("currentResult");\n    if (data) setResultData(JSON.parse(data));\n    else navigate("results");\n  }, []);\n  if (!resultData) return <div className="min-h-screen grid place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-[#8d1c2f]" /></div>;'
);

// Replace hardcoded values in ResultDetailPage with resultData
c = c.replace(/Aarav Sharma/g, '{resultData.studentName}');
c = c.replace(/Rajesh Sharma/g, '{resultData.fatherName}');
c = c.replace(/14 May 2008/g, '{new Date(resultData.dob).toLocaleDateString()}');
c = c.replace(/TBSTE2601842/g, '{resultData.enrollmentNumber}');
c = c.replace(/202648310/g, '{resultData.rollNumber}');
c = c.replace(/{subjects\.map\(\(row\)/g, '{(resultData.subjects || []).map((row: any)');

c = c.replace(
  '<td className="px-4 py-4 text-center font-bold text-xl text-[#8d1c2f] border-r border-stone-300">383</td>',
  '<td className="px-4 py-4 text-center font-bold text-xl text-[#8d1c2f] border-r border-stone-300">{resultData.grandTotal}</td>'
);

c = c.replace(
  '<strong className="block text-3xl text-[#4a131c]">PASS <span className="text-xl font-medium">(Qualified)</span></strong>',
  '<strong className="block text-3xl text-[#4a131c] uppercase">{resultData.resultStatus} <span className="text-xl font-medium">{resultData.resultStatus === "PASS" ? "(Qualified)" : ""}</span></strong>'
);

// 3. Add Excel Upload to AdminResults
const adminResultsTarget = 'function AdminResults({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {';
const excelUploadUI = `function AdminResults({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/results", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify(data.message || "Results uploaded successfully via Excel");
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }
`;
c = c.replace(adminResultsTarget, excelUploadUI);

// Add the upload button to AdminHeader actions in AdminResults
c = c.replace(
  '<AdminHeader title="Result Management" text="Manage, validate and publish examination results." actions={<><Button variant="secondary" onClick={() => navigate("admin-import")}><FileSpreadsheet className="h-4 w-4" /> Import Results</Button><Button onClick={() => notify("New result draft created.")}><Plus className="h-4 w-4" /> New Result</Button></>} />',
  '<AdminHeader title="Result Management" text="Manage, validate and publish examination results." actions={<><input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} /><Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />} {uploading ? "Uploading..." : "Upload Excel"}</Button><Button onClick={() => navigate("admin-import")}><Plus className="h-4 w-4" /> Manual Entry</Button></>} />'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Successfully wired frontend UI to API');
