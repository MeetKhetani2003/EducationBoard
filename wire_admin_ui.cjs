const fs = require('fs');

// 1. Update API Route to support fetching all results
let apiContent = fs.readFileSync('app/api/results/route.ts', 'utf8');
apiContent = apiContent.replace(
  "if (!enrollmentNumber || !dobString) {\n      return NextResponse.json({ error: 'Enrollment Number and Date of Birth are required' }, { status: 400 });\n    }",
  "if (!enrollmentNumber || !dobString) {\n      const allResults = await Result.find({}).sort({ createdAt: -1 });\n      return NextResponse.json(allResults);\n    }"
);
fs.writeFileSync('app/api/results/route.ts', apiContent);

// 2. Update AdminResults and AdminImport in page.tsx
let c = fs.readFileSync('app/page.tsx', 'utf8');

// Replace AdminResults
const adminResultsTarget = 'const [query, setQuery] = useState(""); const rows = adminResultRows.filter((row) => row[0].toLowerCase().includes(query.toLowerCase()) || row[1].toLowerCase().includes(query.toLowerCase()));\n  return <><AdminHeader title="Result Management" text="Manage, validate and publish examination results."';
const newAdminResults = `const [query, setQuery] = useState("");
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/results");
      if (res.ok) {
        const data = await res.json();
        setDbResults(data);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchResults(); }, []);

  // Update handleFileUpload to refresh table on success
  async function handleFileUploadEnhanced(e: React.ChangeEvent<HTMLInputElement>) {
    await handleFileUpload(e);
    fetchResults(); // Refresh table!
  }

  const rows = dbResults.filter((row) => 
    (row.studentName || "").toLowerCase().includes(query.toLowerCase()) || 
    (row.enrollmentNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Result Management" text="Manage, validate and publish examination results."`;
c = c.replace(adminResultsTarget, newAdminResults);

// Update table mapping
c = c.replace(
  '{rows.map((row) => <tr key={row[1]} className="border-t border-stone-100 hover:bg-stone-50"><td className="px-4 py-4"><input type="checkbox" /></td>{row.map((cell, index) => <td key={index} className={`px-4 py-4 ${index === 0 ? "font-semibold text-stone-800" : "text-stone-500"}`}>{index === 5 ? <StatusBadge tone={cell === "Published" ? "green" : cell === "Review" ? "amber" : "stone"}>{cell}</StatusBadge> : cell}</td>)}</tr>)}',
  `{rows.map((row) => <tr key={row.enrollmentNumber} className="border-t border-stone-100 hover:bg-stone-50">
    <td className="px-4 py-4"><input type="checkbox" /></td>
    <td className="px-4 py-4 font-semibold text-stone-800">{row.studentName}</td>
    <td className="px-4 py-4 text-stone-500">{row.enrollmentNumber}</td>
    <td className="px-4 py-4 text-stone-500">{row.programme}</td>
    <td className="px-4 py-4 text-stone-500">{row.examination}</td>
    <td className="px-4 py-4 text-stone-500">{row.percentage}%</td>
    <td className="px-4 py-4 text-stone-500"><StatusBadge tone={row.resultStatus === "PASS" ? "green" : "stone"}>{row.resultStatus}</StatusBadge></td>
    <td className="px-4 py-4 text-stone-500">{new Date(row.resultDate).toLocaleDateString()}</td>
    <td className="px-4 py-4 text-stone-500">View</td>
  </tr>)}
  {loading && <tr><td colSpan={9} className="text-center py-8">Loading results from database...</td></tr>}`
);

// We need to also hook up the onChange of the file input to handleFileUploadEnhanced
c = c.replace('onChange={handleFileUpload}', 'onChange={handleFileUploadEnhanced}');

// 3. Update AdminImport form submission
const adminImportTarget = 'function upload(e: FormEvent) { e.preventDefault(); setUploading(true); window.setTimeout(() => { setUploading(false); notify("Record successfully imported."); navigate("admin-results"); }, 1200); }';
const newAdminImport = `async function upload(e: FormEvent) { 
    e.preventDefault(); 
    setUploading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    // Construct payload for manual entry
    const payload = {
      enrollmentNumber: data.enrollment,
      rollNumber: data.roll,
      studentName: data.name,
      fatherName: data.father,
      dob: data.dob,
      programme: data.programme,
      examination: data.exam,
      examYear: data.year,
      grandTotal: Number(data.total),
      percentage: Number(data.percentage),
      resultStatus: data.status || 'PASS'
    };
    
    try {
      const res = await fetch("/api/results", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });
      if (res.ok) {
        notify("Record successfully created in database."); 
        navigate("admin-results");
      } else {
        const err = await res.json();
        alert("Failed: " + err.error);
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setUploading(false);
    }
  }`;
c = c.replace(adminImportTarget, newAdminImport);

// Add name attributes to AdminImport form inputs so FormData works
c = c.replace('<Field label="Enrollment Number" required />', '<Field label="Enrollment Number" name="enrollment" required />');
c = c.replace('<Field label="Roll Number" required />', '<Field label="Roll Number" name="roll" required />');
c = c.replace('<Field label="Student Name" required />', '<Field label="Student Name" name="name" required />');
c = c.replace('<Field label="Father\'s Name" required />', '<Field label="Father\'s Name" name="father" required />');
c = c.replace('<Field type="date" label="Date of Birth" required />', '<Field type="date" label="Date of Birth" name="dob" required />');
c = c.replace('<SelectField label="Programme" options={["Secondary", "Senior Secondary", "Vocational"]} />', '<SelectField label="Programme" name="programme" options={["Secondary", "Senior Secondary", "Vocational"]} />');
c = c.replace('<Field label="Examination Session" defaultValue="June Public Examination" />', '<Field label="Examination Session" name="exam" defaultValue="June Public Examination" />');
c = c.replace('<Field label="Examination Year" defaultValue="2026" />', '<Field label="Examination Year" name="year" defaultValue="2026" />');
c = c.replace('<Field label="Grand Total" type="number" />', '<Field label="Grand Total" name="total" type="number" />');
c = c.replace('<Field label="Percentage" type="number" />', '<Field label="Percentage" name="percentage" type="number" />');
c = c.replace('<SelectField label="Result Status" options={["PASS", "FAIL", "COMPARTMENT", "WITHHELD"]} />', '<SelectField label="Result Status" name="status" options={["PASS", "FAIL", "COMPARTMENT", "WITHHELD"]} />');

// Modify the Field/SelectField components in app/page.tsx to pass down `name` props
c = c.replace('function Field({ label, type = "text", required, placeholder, defaultValue }: { label: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {', 'function Field({ label, type = "text", required, placeholder, defaultValue, name }: { label: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string; name?: string }) {');
c = c.replace('<input type={type} required={required} placeholder={placeholder} defaultValue={defaultValue}', '<input type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} name={name}');

c = c.replace('function SelectField({ label, options, required }: { label: string; options: string[]; required?: boolean }) {', 'function SelectField({ label, options, required, name }: { label: string; options: string[]; required?: boolean; name?: string }) {');
c = c.replace('<select required={required}', '<select required={required} name={name}');


fs.writeFileSync('app/page.tsx', c);
console.log('Admin UI wired to Database successfully');
