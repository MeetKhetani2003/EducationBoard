const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

// Read components to inject (optional - may not exist if already applied)
const injectPath = path.join(__dirname, 'components_to_inject.txt');
let newDashboardCode = '';
try { newDashboardCode = fs.readFileSync(injectPath, 'utf8'); } catch(e) { console.log('components_to_inject.txt not found, skipping dashboard injection'); }

// 1. Locate and insert AdminProgrammeDashboard before App component
const appStartToken = 'export default function App() {';
const appIndex = pageCode.indexOf(appStartToken);

if (appIndex === -1) {
  console.error("App start boundary not found!");
  process.exit(1);
}

if (newDashboardCode) {
  const partBeforeDashboard = pageCode.substring(0, appIndex);
  const partAfterDashboard = pageCode.substring(appIndex);
  pageCode = partBeforeDashboard + newDashboardCode + '\n\n' + partAfterDashboard;
}

// 2. Add "Online Exams" to portalNav inside StudentPortalShell
pageCode = pageCode.replace(
  '    { label: "My Results", icon: FileCheck2 },',
  '    { label: "My Results", icon: FileCheck2 },\n    { label: "Online Exams", icon: SlidersHorizontal },'
);

// 3. Inject activeTab check and render under StudentPortalShell main block
const activeTabSupportToken = '        {activeTab === "Help & Support" && (';
pageCode = pageCode.replace(
  activeTabSupportToken,
  `        {activeTab === "Online Exams" && (
          <StudentOnlineExamView student={student} notify={notify} />
        )}

        {activeTab === "Help & Support" && (`
);

// 4. Inject StudentOnlineExamView component before StudentPortalShell definition
const portalShellStart = 'function StudentPortalShell({';
const portalShellIndex = pageCode.indexOf(portalShellStart);

if (portalShellIndex === -1) {
  console.error("StudentPortalShell boundary not found!");
  process.exit(1);
}

const studentExamViewComponent = `function StudentOnlineExamView({ student, notify }: { student: any; notify: (msg: string) => void }) {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [examSession, setExamSession] = useState<any>(null);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [joined, setJoined] = useState(false);
  const [answers, setAnswers] = useState<{ mcqs: Record<number, number>, theory: Record<number, string> }>({ mcqs: {}, theory: {} });

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams");
      if (res.ok) {
        setExams(await res.json());
      }
    } catch(e){} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleJoin = async (exam: any) => {
    try {
      const res = await fetch("/api/student-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          studentEnrollment: student.enrollmentNumber,
          examId: exam._id
        })
      });
      if (res.ok) {
        const doc = await res.json();
        setExamSession(doc);
        setActiveExam(exam);
        setJoined(true);
        setAnswers(doc.answers || { mcqs: {}, theory: {} });
        
        if (exam.examState === 'portal_open') {
          const expires = new Date(exam.portalOpenTime).getTime() + (exam.joiningWindow * 60 * 1000);
          setTimerRemaining(Math.max(0, Math.round((expires - Date.now()) / 1000)));
        } else if (exam.examState === 'running') {
          const expires = new Date(exam.startTime).getTime() + (exam.duration * 60 * 1000);
          setTimerRemaining(Math.max(0, Math.round((expires - Date.now()) / 1000)));
        }
      }
    } catch(e){}
  };

  useEffect(() => {
    if (!joined || !activeExam || activeExam.examState !== 'running' || examSession?.leftExam) return;
    
    let warningCount = 0;
    const handleBlur = async () => {
      warningCount++;
      if (warningCount >= 2) {
        notify("LOCKOUT ALERT: You left the exam screen. Exam auto-submitted!");
        await fetch("/api/student-exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "lockout",
            studentEnrollment: student.enrollmentNumber,
            examId: activeExam._id
          })
        });
        setJoined(false);
        setActiveExam(null);
        fetchExams();
      } else {
        alert("WARNING: Changing tabs or losing focus is strictly prohibited. Doing it again will submit and lock your exam.");
      }
    };
    
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [joined, activeExam, examSession]);

  useEffect(() => {
    if (!joined || timerRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [joined, timerRemaining]);

  const handleTimeOut = async () => {
    if (activeExam.examState === 'portal_open') {
      notify("Joining window ended! Releasing exam paper.");
      fetchExams();
    } else if (activeExam.examState === 'running') {
      notify("Exam duration completed! Saving answers.");
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/student-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          studentEnrollment: student.enrollmentNumber,
          examId: activeExam._id,
          answers
        })
      });
      if (res.ok) {
        notify("Paper submitted successfully!");
        setJoined(false);
        setActiveExam(null);
        fetchExams();
      }
    } catch(e){}
  };

  if (loading) return <div className="p-8 text-stone-500">Loading exams...</div>;

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
      {!joined ? (
        <>
          <div className="border-b pb-3">
            <h2 className="font-bold text-stone-850">Online Exams Workspace</h2>
            <p className="text-xs text-stone-400">Join ongoing and scheduled examinations live.</p>
          </div>
          <div className="divide-y divide-stone-100">
            {exams.filter(e => e.examState !== 'inactive').length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">No live exam conduction room active right now.</div>
            ) : (
              exams.filter(e => e.examState !== 'inactive').map((exam, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#a1283c]">{exam.title}</h3>
                    <p className="text-xs text-stone-500 mt-1">Programme: {exam.programme} | State: {exam.examState}</p>
                  </div>
                  <Button onClick={() => handleJoin(exam)}>Join Examination Room</Button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-stone-900 text-white p-4 rounded-lg">
            <div>
              <span className="bg-[#a1283c] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active Session</span>
              <h2 className="font-bold mt-1 text-sm">{activeExam.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/50 block">Time Remaining</span>
              <span className="font-mono font-bold text-lg text-[#e8c476]">
                {Math.floor(timerRemaining / 60)}m {timerRemaining % 60}s
              </span>
            </div>
          </div>

          {activeExam.examState === 'portal_open' && (
            <div className="p-12 text-center bg-stone-50 border rounded-lg space-y-4">
              <Clock3 className="h-10 w-10 text-stone-400 mx-auto animate-pulse" />
              <h3 className="font-bold text-stone-850">Seated in Waiting Hall</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">Please do not refresh or change tabs. The exam paper will automatically appear once the controller starts the examination.</p>
            </div>
          )}

          {activeExam.examState === 'running' && (
            <div className="space-y-8 font-sans">
              {activeExam.paper?.mcqs?.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-sm border-b pb-2 text-stone-800 uppercase tracking-wider font-sans">Multiple Choice Questions</h3>
                  {activeExam.paper.mcqs.map((q, idx) => (
                    <div key={idx} className="border p-4 rounded-lg bg-stone-50 space-y-3 font-sans">
                      <div className="font-semibold text-sm text-stone-850 font-sans">{idx + 1}. {q.question}</div>
                      <div className="grid sm:grid-cols-2 gap-3 font-sans">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-2 text-xs bg-white border p-3 rounded-lg cursor-pointer hover:border-[#a1283c] transition font-sans">
                            <input 
                              type="radio" 
                              name={\`q_\${idx}\`} 
                              checked={answers.mcqs[idx] === oIdx} 
                              onChange={() => setAnswers({ ...answers, mcqs: { ...answers.mcqs, [idx]: oIdx } })}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeExam.paper?.theory?.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-sm border-b pb-2 text-stone-800 uppercase tracking-wider">Subjective Questions</h3>
                  {activeExam.paper.theory.map((tq, idx) => (
                    <div key={idx} className="border p-4 rounded-lg bg-stone-50 space-y-3 font-sans">
                      <div className="font-semibold text-sm text-stone-850 font-sans">{idx + 1}. {tq.question} ({tq.marks} Marks)</div>
                      <textarea 
                        rows={6}
                        placeholder="Write your answer statement here..."
                        className="w-full bg-white border rounded-lg p-3 text-xs outline-none focus:border-[#a1283c] leading-5 font-sans"
                        value={answers.theory[idx] || ""}
                        onChange={e => setAnswers({ ...answers, theory: { ...answers.theory, [idx]: e.target.value } })}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSubmit}>Submit Examination Paper</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

`;

const partBeforePortal = pageCode.substring(0, portalShellIndex);
const partAfterPortal = pageCode.substring(portalShellIndex);

pageCode = partBeforePortal + studentExamViewComponent + '\n\n' + partAfterPortal;

// 5. Update Excel import check and match programme
const importStartToken = 'function AdminImport({';
const importEndToken = 'function AdminAddResult({';
const importStartIndex = pageCode.indexOf(importStartToken);
const importEndIndex = pageCode.indexOf(importEndToken);

if (importStartIndex !== -1 && importEndIndex !== -1) {
  const targetFieldsCode = `  const targetFields = [
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
  ];`;

  const newAdminImportCode = `function AdminImport({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [mapping, setMapping] = useState<any>({});
  const [validatedData, setValidatedData] = useState<any[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);
  
  const [programmesList, setProgrammesList] = useState<any[]>([]);
  const [selectedProgTitle, setSelectedProgTitle] = useState("");
  const [targetProgramme, setTargetProgramme] = useState<any>(null);

  const steps = ["Upload File", "Select Programme", "Map Fields", "Validate Data", "Preview", "Publish"];

  useEffect(() => {
    fetch("/api/programmes")
      .then(res => res.json())
      .then(data => setProgrammesList(data || []));
  }, []);

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
      
      const excelProg = data.rawRows[0]?.[data.mapping.programme] || "";
      const matched = programmesList.find(p => p.title.toLowerCase() === excelProg.toLowerCase());
      if (matched) {
        setTargetProgramme(matched);
        setSelectedProgTitle(matched.title);
        setStep(3);
      } else {
        setStep(2);
      }
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
    if (!parsedData || !targetProgramme) {
      alert("Programme selection is mandatory!");
      return;
    }
    const targetRows: any[] = [];
    let errs = 0;
    const headerValues = Object.values(mapping).filter(v => v !== "");

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

      const subjects: any[] = [];
      if (targetProgramme.subjects && targetProgramme.subjects.length > 0) {
        targetProgramme.subjects.forEach((pSub: any, i: number) => {
          const matchedKey = Object.keys(row).find(k => k.toLowerCase() === pSub.name.toLowerCase() || k.toLowerCase().replace(/_?(th|pr|ia|total)$/g, '') === pSub.name.toLowerCase());
          const scoreVal = matchedKey ? Number(row[matchedKey]) || 0 : 0;
          subjects.push({
            sNo: String(i + 1),
            name: pSub.name,
            max: pSub.max,
            min: pSub.min,
            th: scoreVal,
            pr: 0,
            ia: 0,
            total: scoreVal,
            grade: scoreVal >= pSub.min ? "PASS" : "FAIL"
          });
        });
      } else {
        const rowKeys = Object.keys(row);
        const subjectColumns = rowKeys.filter(k => !headerValues.includes(k));
        const subjectMap: Record<string, any> = {};
        subjectColumns.forEach(col => {
          const val = row[col];
          const baseName = col.replace(/_?(TH|PR|IA|Max|Min|Total|Grade)$/i, '').trim();
          if (!subjectMap[baseName]) subjectMap[baseName] = { name: baseName };
          const suffix = (col.match(/_(TH|PR|IA|Max|Min|Total|Grade)$/i) || [])[1]?.toUpperCase();
          
          if (suffix === 'TH') subjectMap[baseName].th = isNaN(Number(val)) ? val : Number(val);
          else if (suffix === 'PR') subjectMap[baseName].pr = isNaN(Number(val)) ? val : Number(val);
          else if (suffix === 'IA') subjectMap[baseName].ia = isNaN(Number(val)) ? val : Number(val);
          else if (suffix === 'MAX') subjectMap[baseName].max = Number(val) || 100;
          else if (suffix === 'MIN') subjectMap[baseName].min = Number(val) || 33;
          else if (suffix === 'TOTAL') subjectMap[baseName].total = isNaN(Number(val)) ? val : Number(val);
          else if (suffix === 'GRADE') subjectMap[baseName].grade = String(val);
          else {
            subjectMap[baseName].th = isNaN(Number(val)) ? val : Number(val);
          }
        });

        Object.values(subjectMap).forEach((s: any, i) => {
          const totalVal = Number(s.total) || (Number(s.th) || 0) + (Number(s.pr) || 0);
          subjects.push({
            sNo: String(i + 1),
            name: s.name,
            max: s.max || 100,
            min: s.min || 33,
            th: Number(s.th) || 0,
            pr: Number(s.pr) || 0,
            ia: Number(s.ia) || 0,
            total: totalVal,
            grade: s.grade || (totalVal >= (s.min || 33) ? "PASS" : "FAIL")
          });
        });
      }

      let grandTotal = 0;
      subjects.forEach(s => grandTotal += s.total);

      targetRows.push({
        enrollmentNumber,
        rollNumber: String(row[mapping.rollNumber] || enrollmentNumber).trim(),
        studentName,
        fatherName: String(row[mapping.fatherName] || "N/A").trim(),
        dob,
        programme: targetProgramme.title,
        examination: String(row[mapping.examination] || "Public Examination").trim(),
        examYear: String(row[mapping.examYear] || "2026").trim(),
        subjects,
        grandTotal,
        percentage: Number(row[mapping.percentage] || ((grandTotal / (subjects.length * 100)) * 100).toFixed(2)),
        resultStatus: String(row[mapping.resultStatus] || (grandTotal >= (subjects.length * 33) ? "PASS" : "FAIL")).trim(),
        isValid
      });
    });

    setValidatedData(targetRows);
    setErrorsCount(errs);
    setStep(4);
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

  ${targetFieldsCode}

  return <><AdminHeader title="Import Examination Results" text="Upload, validate and publish result records in a guided workflow." actions={<Button variant="secondary" onClick={() => navigate("admin-results")}><ArrowLeft className="h-4 w-4" /> Back to Results</Button>} /><section className="border border-stone-200 bg-white"><div className="grid grid-cols-6 border-b border-stone-200">{steps.map((label, index) => <div key={label} className={"relative p-3 text-center md:p-5 " + (step === index + 1 ? "bg-stone-50" : "")}><div className={"mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-bold " + (step > index + 1 ? "bg-lime-500 text-white" : step === index + 1 ? "bg-[#a1283c] text-white" : "bg-stone-100 text-stone-400")}>{step > index + 1 ? <Check className="h-4 w-4" /> : "0" + (index + 1)}</div><span className={"mt-2 hidden text-xs font-medium sm:block " + (step === index + 1 ? "text-[#a1283c]" : "text-stone-400")}>{label}</span></div>)}</div><div className="p-5 md:p-8">
      {step === 1 && <div className="mx-auto max-w-2xl"><label className="flex min-h-72 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center transition hover:border-[#a1283c] hover:bg-stone-100"><span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#a1283c] shadow-sm"><UploadCloud className="h-7 w-7" /></span><h2 className="mt-5 font-semibold text-stone-800">Select result file here</h2><p className="mt-2 text-xs text-stone-400">Choose XLSX, XLS or CSV. Maximum file size 25 MB.</p><span className="mt-5 rounded-lg bg-[#a1283c] px-4 py-2 text-xs font-semibold text-white">Choose file</span><input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" /></label>{uploading && <div className="mt-5 text-center text-xs text-stone-500">Processing and parsing Excel headers...</div>}<div className="mt-4 text-center"><a href="/sample_results.xlsx" download className="text-xs text-[#a1283c] font-semibold hover:underline">Download Sample Excel Template</a></div></div>}
      
      {step === 2 && <div className="mx-auto max-w-xl space-y-4"><h2 className="font-bold text-stone-800 text-sm">Mandatory Program Selection</h2><p className="text-xs text-stone-400">Please select the target Programme for this result sheet. If the Programme is not created, you must go to Programmes and create it first.</p><select className="w-full h-11 border rounded-lg px-3 text-xs outline-none" value={selectedProgTitle} onChange={e => { const found = programmesList.find(p => p.title === e.target.value); if (found) { setTargetProgramme(found); setSelectedProgTitle(found.title); } }}><option value="">-- Select Target Program --</option>{programmesList.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}</select></div>}

      {step === 3 && parsedData && <div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center gap-3 bg-lime-50 p-4 text-sm text-lime-700"><FileSpreadsheet className="h-5 w-5" /><b>{parsedData.fileName}</b><span className="ml-auto text-xs">Rows found: {parsedData.totalRowsCount}</span></div><h2 className="font-semibold text-stone-800">Map Excel Columns to Result Fields</h2><p className="mt-1 text-xs text-stone-400">Map the column headers of your uploaded Excel sheet to database result fields.</p><div className="mt-5 grid gap-3">{targetFields.map((field) => <div key={field.key} className="grid items-center gap-3 border-b border-stone-100 pb-3 sm:grid-cols-[1fr_40px_1fr]"><div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-600 font-semibold">{field.label}</div><ArrowRight className="mx-auto h-4 w-4 text-stone-300" /><select value={mapping[field.key] || ""} onChange={(e) => handleMapChange(field.key, e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2.5 text-xs text-stone-600"><option value="">-- Choose Column --</option>{parsedData.headers.map((h) => <option key={h} value={h}>{h}</option>)}</select></div>)}</div></div>}
      
      {step === 4 && <div className="mx-auto max-w-2xl text-center"><motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime-50 text-lime-600"><ClipboardCheck className="h-8 w-8" /></motion.div><h2 className="mt-5 text-xl font-semibold text-stone-800">Validation completed</h2><p className="mt-2 text-sm text-stone-500">Validation run completed on the mapped fields.</p><div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 text-left sm:grid-cols-3"><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-stone-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length}</b><span className="text-xs text-stone-400">Total Rows</span></div><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-lime-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length - errorsCount}</b><span className="text-xs text-stone-400">Ready to publish</span></div><div className="bg-white p-5"><AlertCircle className="h-5 w-5 text-amber-600" /><b className="mt-3 block text-xl text-stone-800">{errorsCount}</b><span className="text-xs text-stone-400">Invalid (Missing fields)</span></div></div></div>}
      
      {step === 5 && <div><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-stone-800">Preview result records</h2><p className="mt-1 text-xs text-stone-400">Previewing parsed records.</p></div></div><div className="overflow-x-auto border border-stone-200"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-stone-50 text-stone-400"><tr>{["Student", "Enrollment", "Programme", "Marks", "Status", "Validation"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead><tbody>{validatedData.slice(0, 10).map((row, index) => <tr className="border-t border-stone-100 hover:bg-stone-50" key={index}><td className="px-4 py-3 font-medium">{row.studentName || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.enrollmentNumber || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.programme}</td><td className="px-4 py-3 text-stone-500">{row.grandTotal} ({row.percentage}%)</td><td className="px-4 py-3 text-stone-500">{row.resultStatus}</td><td className="px-4 py-3"><StatusBadge tone={row.isValid ? "green" : "amber"}>{row.isValid ? "Valid" : "Invalid Date/Name/Enrollment"}</StatusBadge></td></tr>)}</tbody></table></div></div>}
      
      {step === 6 && <div className="mx-auto max-w-xl py-8 text-center"><ShieldCheck className="mx-auto h-14 w-14 text-[#a1283c]" /><h2 className="mt-5 text-xl font-semibold text-stone-800">Ready to publish results</h2><p className="mt-2 text-sm leading-6 text-stone-500">All valid records will become live immediately.</p></div>}
      
      <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5"><Button variant="secondary" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}>Previous</Button>{step > 1 && <Button onClick={step === 6 ? () => setConfirm(true) : step === 3 ? runValidation : () => setStep(step + 1)}>{step === 4 ? "Preview Results" : step === 6 ? "Publish Results" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>}</div>
    </div></section>
    <AnimatePresence>{confirm && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-600"><Bell className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-semibold text-stone-900">Publish results?</h2><p className="mt-2 text-sm leading-6 text-stone-500">Are you sure you want to write these results to the database?</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={publish}>Confirm & Publish</Button></div></motion.div></motion.div>}</AnimatePresence></>;
  }
  `;

  const beforeImport = pageCode.substring(0, importStartIndex);
  const afterImport = pageCode.substring(importEndIndex);
  pageCode = beforeImport + newAdminImportCode + afterImport;
}

// 6. Update AdminAddResult to pull preset subjects from Programme selected
const addResultStartToken = 'function AdminAddResult({';
const addResultEndToken = 'function AdminStudents({';
const addResultStartIndex = pageCode.indexOf(addResultStartToken);
const addResultEndIndex = pageCode.indexOf(addResultEndToken);

if (addResultStartIndex !== -1 && addResultEndIndex !== -1) {
  const beforeAddResult = pageCode.substring(0, addResultStartIndex);
  const afterAddResult = pageCode.substring(addResultEndIndex);

  const newAddResultCode = `function AdminAddResult({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [programme, setProgramme] = useState("");
  const [examination, setExamination] = useState("June Public Examination");
  const [examYear, setExamYear] = useState("2026");
  const [percentage, setPercentage] = useState(0);
  const [resultStatus, setResultStatus] = useState("PASS");
  
  const [programmesList, setProgrammesList] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/programmes")
      .then(res => res.json())
      .then(data => {
        setProgrammesList(data || []);
        if (data && data.length > 0) {
          setProgramme(data[0].title);
          loadPresetSubjects(data[0]);
        }
      });
  }, []);

  const loadPresetSubjects = (prog: any) => {
    if (prog && prog.subjects && prog.subjects.length > 0) {
      setSubjects(prog.subjects.map((s: any, idx: number) => ({
        sNo: String(idx + 1),
        name: s.name,
        max: s.max,
        min: s.min,
        th: 0,
        pr: 0,
        total: 0,
        grade: "A"
      })));
    } else {
      setSubjects([
        { sNo: "1", name: "Hindi", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
        { sNo: "2", name: "English", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
      ]);
    }
  };

  const handleProgChange = (progTitle: string) => {
    setProgramme(progTitle);
    const found = programmesList.find(p => p.title === progTitle);
    if (found) loadPresetSubjects(found);
  };

  const addSubject = () => {
    setSubjects([...subjects, { sNo: String(subjects.length + 1), name: "", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "" }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index).map((s, idx) => ({ ...s, sNo: String(idx + 1) })));
  };

  const updateSubject = (index: number, field: string, value: any) => {
    const updated = [...subjects];
    updated[index][field] = value;
    if (field === 'th' || field === 'pr') {
      updated[index].total = Number(updated[index].th || 0) + Number(updated[index].pr || 0);
    }
    setSubjects(updated);
  };

  const grandTotal = subjects.reduce((sum, s) => sum + (s.total || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
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
            <select className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none font-sans" value={programme} onChange={e => handleProgChange(e.target.value)}>
              {programmesList.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}
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

  pageCode = beforeAddResult + newAddResultCode + afterAddResult;
}

fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("Successfully patched page.tsx fully");
