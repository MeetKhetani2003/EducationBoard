const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

// Find type Page definition and add "admin-add-result"
c = c.replace(
  '| "admin-messages" | "admin-settings";',
  '| "admin-messages" | "admin-settings" | "admin-add-result";'
);

// Find validPages list and add "admin-add-result"
c = c.replace(
  '"admin-recognition", "admin-messages", "admin-settings",',
  '"admin-recognition", "admin-messages", "admin-settings", "admin-add-result",'
);

// Find renderAdminPage switch and add case "admin-add-result"
c = c.replace(
  'case "admin-settings": return <AdminSettings notify={notify} />;',
  'case "admin-settings": return <AdminSettings notify={notify} />;\n    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;'
);

// Find the block of code to replace: from AdminResults up to AdminStudents
const startToken = 'function AdminResults(';
const endToken = 'function AdminStudents(';

const startIndex = c.indexOf(startToken);
const endIndex = c.indexOf(endToken);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate insertion tokens');
  process.exit(1);
}

const beforePart = c.substring(0, startIndex);
const afterPart = c.substring(endIndex);

const newComponents = `function AdminResults({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/results");
      if (res.ok) {
        const data = await res.json();
        setDbResults(data.results || data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
      const res = await fetch("/api/results?id=" + id, { method: "DELETE" });
      if (res.ok) {
        notify("Result deleted successfully.");
        fetchResults();
      } else {
        alert("Failed to delete result");
      }
    } catch (e) {
      alert("Delete failed");
    }
  }

  const rows = dbResults.filter((row) => 
    (row.studentName || "").toLowerCase().includes(query.toLowerCase()) || 
    (row.enrollmentNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Result Management" text="Manage, validate and publish examination results." actions={<><Button variant="secondary" onClick={() => navigate("admin-import")}><UploadCloud className="h-4 w-4" /> Import Excel</Button><Button onClick={() => navigate("admin-add-result")}><Plus className="h-4 w-4" /> Add Result</Button></>} /><section className="border border-stone-200 bg-white"><div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[1fr_repeat(3,170px)]"><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search student or enrollment number" /></label>{["All Programmes", "June Examination", "All Status"].map((item) => <select key={item} className="h-9 rounded-lg border border-stone-200 px-3 text-xs text-stone-500"><option>{item}</option></select>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-stone-50 uppercase tracking-wider text-stone-400"><tr>{["Student", "Roll Number", "Programme", "Exam", "Marks", "Status", "Published Date", "Actions"].map((item) => <th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">Loading records from MongoDB...</td></tr> : rows.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">No records found. Upload an Excel file or add results manually.</td></tr> : rows.map((row) => <tr key={row._id} className="border-t border-stone-100 hover:bg-stone-50"><td className="px-4 py-4 font-semibold text-stone-800">{row.studentName}</td><td className="px-4 py-4 text-stone-500">{row.enrollmentNumber}</td><td className="px-4 py-4 text-stone-500">{row.programme}</td><td className="px-4 py-4 text-stone-500">{row.examination} ({row.examYear})</td><td className="px-4 py-4 text-stone-500">{row.grandTotal} ({row.percentage}%)</td><td className="px-4 py-4 text-stone-500"><StatusBadge tone={row.resultStatus === "PASS" ? "green" : "slate"}>{row.resultStatus}</StatusBadge></td><td className="px-4 py-4 text-stone-500">{row.resultDate ? new Date(row.resultDate).toLocaleDateString() : "-"}</td><td className="px-4 py-4"><div className="flex gap-1"><button title="Delete" onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-xs text-stone-400"><span>Showing {rows.length} of {dbResults.length} results</span></div></section></>;
}

function AdminImport({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [mapping, setMapping] = useState<any>({});
  const [validatedData, setValidatedData] = useState<any[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);

  const steps = ["Upload File", "Map Fields", "Validate Data", "Preview", "Publish"];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/results/parse", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setParsedData(data);
      setMapping(data.mapping);
      setStep(2);
    } catch (err: any) {
      alert("Error parsing file: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleMapChange(field: string, column: string) {
    setMapping((prev: any) => ({ ...prev, [field]: column }));
  }

  function runValidation() {
    if (!parsedData) return;
    const targetRows: any[] = [];
    let errs = 0;

    parsedData.rawRows.forEach((row: any) => {
      const enrollmentNumber = String(row[mapping.enrollmentNumber] || "").trim();
      const studentName = String(row[mapping.studentName] || "").trim();
      const dobRaw = row[mapping.dob];
      
      let dob = "";
      if (dobRaw) {
        const d = new Date(dobRaw);
        if (!isNaN(d.getTime())) {
          dob = d.toISOString().split('T')[0];
        }
      }

      const isValid = enrollmentNumber !== "" && studentName !== "" && dob !== "";
      if (!isValid) errs++;

      targetRows.push({
        enrollmentNumber,
        rollNumber: String(row[mapping.rollNumber] || enrollmentNumber).trim(),
        studentName,
        fatherName: String(row[mapping.fatherName] || "N/A").trim(),
        dob,
        programme: String(row[mapping.programme] || "Senior Secondary").trim(),
        examination: String(row[mapping.examination] || "Public Examination").trim(),
        examYear: String(row[mapping.examYear] || "2026").trim(),
        grandTotal: Number(row[mapping.grandTotal] || 0),
        percentage: Number(row[mapping.percentage] || 0),
        resultStatus: String(row[mapping.resultStatus] || "PASS").trim(),
        isValid
      });
    });

    setValidatedData(targetRows);
    setErrorsCount(errs);
    setStep(3);
  }

  async function publish() {
    setUploading(true);
    try {
      const validRows = validatedData.filter(r => r.isValid);
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRows)
      });
      if (!res.ok) throw new Error(await res.text());
      const resData = await res.json();
      notify(resData.message || "Results uploaded successfully!");
      setConfirm(false);
      navigate("admin-results");
    } catch (e: any) {
      alert("Failed to save results: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  const targetFields = [
    { key: "enrollmentNumber", label: "Enrollment Number (Required)" },
    { key: "rollNumber", label: "Roll Number" },
    { key: "studentName", label: "Student Name (Required)" },
    { key: "fatherName", label: "Father's Name" },
    { key: "dob", label: "Date of Birth (Required)" },
    { key: "programme", label: "Programme" },
    { key: "examination", label: "Examination" },
    { key: "examYear", label: "Examination Year" },
    { key: "grandTotal", label: "Grand Total" },
    { key: "percentage", label: "Percentage" },
    { key: "resultStatus", label: "Result Status" }
  ];

  return <><AdminHeader title="Import Examination Results" text="Upload, validate and publish result records in a guided workflow." actions={<Button variant="secondary" onClick={() => navigate("admin-results")}><ArrowLeft className="h-4 w-4" /> Back to Results</Button>} /><section className="border border-stone-200 bg-white"><div className="grid grid-cols-5 border-b border-stone-200">{steps.map((label, index) => <div key={label} className={"relative p-3 text-center md:p-5 " + (step === index + 1 ? "bg-stone-50" : "")}><div className={"mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-bold " + (step > index + 1 ? "bg-lime-500 text-white" : step === index + 1 ? "bg-[#a1283c] text-white" : "bg-stone-100 text-stone-400")}>{step > index + 1 ? <Check className="h-4 w-4" /> : "0" + (index + 1)}</div><span className={"mt-2 hidden text-xs font-medium sm:block " + (step === index + 1 ? "text-[#a1283c]" : "text-stone-400")}>{label}</span></div>)}</div><div className="p-5 md:p-8">
      {step === 1 && <div className="mx-auto max-w-2xl"><label className="flex min-h-72 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center transition hover:border-[#a1283c] hover:bg-stone-100"><span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#a1283c] shadow-sm"><UploadCloud className="h-7 w-7" /></span><h2 className="mt-5 font-semibold text-stone-800">Select result file here</h2><p className="mt-2 text-xs text-stone-400">Choose XLSX, XLS or CSV. Maximum file size 25 MB.</p><span className="mt-5 rounded-lg bg-[#a1283c] px-4 py-2 text-xs font-semibold text-white">Choose file</span><input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" /></label>{uploading && <div className="mt-5 text-center text-xs text-stone-500">Processing and parsing Excel headers...</div>}</div>}
      
      {step === 2 && parsedData && <div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center gap-3 bg-lime-50 p-4 text-sm text-lime-700"><FileSpreadsheet className="h-5 w-5" /><b>{parsedData.fileName}</b><span className="ml-auto text-xs">Rows found: {parsedData.totalRowsCount}</span></div><h2 className="font-semibold text-stone-800">Map Excel Columns to Result Fields</h2><p className="mt-1 text-xs text-stone-400">Map the column headers of your uploaded Excel sheet to database result fields.</p><div className="mt-5 grid gap-3">{targetFields.map((field) => <div key={field.key} className="grid items-center gap-3 border-b border-stone-100 pb-3 sm:grid-cols-[1fr_40px_1fr]"><div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-600 font-semibold">{field.label}</div><ArrowRight className="mx-auto h-4 w-4 text-stone-300" /><select value={mapping[field.key] || ""} onChange={(e) => handleMapChange(field.key, e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2.5 text-xs text-stone-600"><option value="">-- Choose Column --</option>{parsedData.headers.map((h) => <option key={h} value={h}>{h}</option>)}</select></div>)}</div></div>}
      
      {step === 3 && <div className="mx-auto max-w-2xl text-center"><motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime-50 text-lime-600"><ClipboardCheck className="h-8 w-8" /></motion.div><h2 className="mt-5 text-xl font-semibold text-stone-800">Validation completed</h2><p className="mt-2 text-sm text-stone-500">Validation run completed on the mapped fields.</p><div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 text-left sm:grid-cols-3"><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-stone-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length}</b><span className="text-xs text-stone-400">Total Rows</span></div><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-lime-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length - errorsCount}</b><span className="text-xs text-stone-400">Ready to publish</span></div><div className="bg-white p-5"><AlertCircle className="h-5 w-5 text-amber-600" /><b className="mt-3 block text-xl text-stone-800">{errorsCount}</b><span className="text-xs text-stone-400">Invalid (Missing fields)</span></div></div></div>}
      
      {step === 4 && <div><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-stone-800">Preview result records</h2><p className="mt-1 text-xs text-stone-400">Previewing parsed records.</p></div></div><div className="overflow-x-auto border border-stone-200"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-stone-50 text-stone-400"><tr>{["Student", "Enrollment", "Programme", "Marks", "Status", "Validation"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead><tbody>{validatedData.slice(0, 10).map((row, index) => <tr className="border-t border-stone-100 hover:bg-stone-50" key={index}><td className="px-4 py-3 font-medium">{row.studentName || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.enrollmentNumber || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.programme}</td><td className="px-4 py-3 text-stone-500">{row.grandTotal} ({row.percentage}%)</td><td className="px-4 py-3 text-stone-500">{row.resultStatus}</td><td className="px-4 py-3"><StatusBadge tone={row.isValid ? "green" : "amber"}>{row.isValid ? "Valid" : "Invalid Date/Name/Enrollment"}</StatusBadge></td></tr>)}</tbody></table></div></div>}
      
      {step === 5 && <div className="mx-auto max-w-xl py-8 text-center"><ShieldCheck className="mx-auto h-14 w-14 text-[#a1283c]" /><h2 className="mt-5 text-xl font-semibold text-stone-800">Ready to publish results</h2><p className="mt-2 text-sm leading-6 text-stone-500">All valid records will become live and searchable immediately. Invalid records will be skipped.</p></div>}
      
      <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5"><Button variant="secondary" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}>Previous</Button>{step > 1 && <Button onClick={step === 5 ? () => setConfirm(true) : step === 2 ? runValidation : () => setStep(step + 1)}>{step === 3 ? "Preview Results" : step === 5 ? "Publish Results" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>}</div>
    </div></section>
    <AnimatePresence>{confirm && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-600"><Bell className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-semibold text-stone-900">Publish results?</h2><p className="mt-2 text-sm leading-6 text-stone-500">Are you sure you want to write these results to the database?</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={publish}>Confirm & Publish</Button></div></motion.div></motion.div>}</AnimatePresence></>;
}

function AdminAddResult({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [programme, setProgramme] = useState("Senior Secondary");
  const [examination, setExamination] = useState("June Public Examination");
  const [examYear, setExamYear] = useState("2026");
  const [percentage, setPercentage] = useState(0);
  const [resultStatus, setResultStatus] = useState("PASS");
  
  const [subjects, setSubjects] = useState([
    { sNo: "1", name: "Hindi", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
    { sNo: "2", name: "English", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { sNo: String(subjects.length + 1), name: "", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "" }]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index).map((s, idx) => ({ ...s, sNo: String(idx + 1) })));
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    if (field === 'th' || field === 'pr') {
      updated[index].total = Number(updated[index].th || 0) + Number(updated[index].pr || 0);
    }
    setSubjects(updated);
  };

  const grandTotal = subjects.reduce((sum, s) => sum + (s.total || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        enrollmentNumber,
        rollNumber: rollNumber || enrollmentNumber,
        studentName,
        fatherName,
        dob,
        programme,
        examination,
        examYear,
        subjects,
        grandTotal,
        percentage: Number(percentage) || 0,
        resultStatus
      };

      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());
      notify("Manual result created successfully!");
      navigate("admin-results");
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return <>
    <AdminHeader title="Add Manual Student Result" text="Manually enter examination results and subject marks." actions={<Button variant="secondary" onClick={() => navigate("admin-results")}><ArrowLeft className="h-4 w-4" /> Back to Results</Button>} />
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-stone-200 bg-white p-6 md:p-8">
        <h2 className="text-base font-semibold text-stone-900 mb-4">Student Profile Details</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Student Name *</label>
            <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={studentName} onChange={e => setStudentName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Enrollment Number *</label>
            <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Roll Number</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Father's Name</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={fatherName} onChange={e => setFatherName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Date of Birth *</label>
            <input required type="date" className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={dob} onChange={e => setDob(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Programme</label>
            <select className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={programme} onChange={e => setProgramme(e.target.value)}>
              <option value="Secondary">Secondary</option>
              <option value="Senior Secondary">Senior Secondary</option>
              <option value="Vocational">Vocational</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Examination Session</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={examination} onChange={e => setExamination(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Examination Year</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={examYear} onChange={e => setExamYear(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Result Status</label>
            <select className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={resultStatus} onChange={e => setResultStatus(e.target.value)}>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
              <option value="COMPARTMENT">COMPARTMENT</option>
              <option value="WITHHELD">WITHHELD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-stone-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-stone-900">Subject Marks Sheet</h2>
          <Button type="button" onClick={addSubject} variant="secondary"><Plus className="h-4 w-4" /> Add Subject</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-stone-50 uppercase tracking-wider text-stone-400">
              <tr>
                <th className="px-4 py-2 w-12">S.No</th>
                <th className="px-4 py-2">Subject Name</th>
                <th className="px-4 py-2 w-20">Max Marks</th>
                <th className="px-4 py-2 w-20">Min Marks</th>
                <th className="px-4 py-2 w-20">Theory Marks</th>
                <th className="px-4 py-2 w-20">Practical Marks</th>
                <th className="px-4 py-2 w-20">Total</th>
                <th className="px-4 py-2 w-20">Grade</th>
                <th className="px-4 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={idx} className="border-t border-stone-100">
                  <td className="px-4 py-2 font-medium">{sub.sNo}</td>
                  <td className="px-4 py-2">
                    <input required className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.name} onChange={e => updateSubject(idx, "name", e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.max} onChange={e => updateSubject(idx, "max", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.min} onChange={e => updateSubject(idx, "min", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.th} onChange={e => updateSubject(idx, "th", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.pr} onChange={e => updateSubject(idx, "pr", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2 font-bold">{sub.total}</td>
                  <td className="px-4 py-2">
                    <input className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.grade} onChange={e => updateSubject(idx, "grade", e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => removeSubject(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3 border-t border-stone-100 pt-6">
          <div className="text-sm font-semibold text-stone-700">Grand Total: <span className="font-bold text-[#a1283c] text-lg">{grandTotal}</span></div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Calculated Percentage *</label>
            <input required type="number" step="0.01" className="w-full rounded border border-stone-200 p-2 text-sm focus:border-[#a1283c] outline-none" value={percentage} onChange={e => setPercentage(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate("admin-results")}>Cancel</Button>
        <Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Result"}</Button>
      </div>
    </form>
  </>;
}
`;

const outputContent = beforePart + newComponents + afterPart;
fs.writeFileSync('app/page.tsx', outputContent);
console.log('Admin results components injected successfully!');
