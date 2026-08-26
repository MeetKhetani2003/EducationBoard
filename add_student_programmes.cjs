const fs = require('fs');

// 1. Update app/api/students/route.ts
const apiPath = 'app/api/students/route.ts';
let apiContent = fs.readFileSync(apiPath, 'utf8');

const apiSearch = `    const newStudent = new Student({
      enrollmentNumber: data.enrollmentNumber,
      name: data.name,
      fatherName: data.fatherName,
      dob: new Date(data.dob),
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      passwordHash: passwordHash
    });`;

const apiReplace = `    const newStudent = new Student({
      enrollmentNumber: data.enrollmentNumber,
      name: data.name,
      fatherName: data.fatherName,
      dob: new Date(data.dob),
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      programmes: data.programmes || [],
      passwordHash: passwordHash
    });`;

if (apiContent.includes(apiSearch)) {
  apiContent = apiContent.replace(apiSearch, apiReplace);
  fs.writeFileSync(apiPath, apiContent, 'utf8');
  console.log('Successfully updated API for students programmes.');
} else {
  console.log('Error: Could not update students API.');
}

// 2. Update app/page.tsx for AdminStudents
const uiPath = 'app/page.tsx';
let uiContent = fs.readFileSync(uiPath, 'utf8');

// Locate AdminStudents declaration and inject programme state
const uiSearchState = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);`;

const uiReplaceState = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProgs, setSelectedProgs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);`;

uiContent = uiContent.replace(uiSearchState, uiReplaceState);

// Inject fetching programmes in AdminStudents useEffect
const fetchProgsSearch = `  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);`;

const fetchProgsReplace = `  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data || []);
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
  }, []);`;

uiContent = uiContent.replace(fetchProgsSearch, fetchProgsReplace);

// Update fetchStudents() calls to fetchData() inside AdminStudents
uiContent = uiContent.replace(/fetchStudents\(\)/g, 'fetchData()');

// Update handleAddStudent form submission data to include programmes
const handleAddSearch = `      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollmentNumber, fatherName, dob, email, phone, address })
      });`;

const handleAddReplace = `      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollmentNumber, fatherName, dob, email, phone, address, programmes: selectedProgs })
      });`;

uiContent = uiContent.replace(handleAddSearch, handleAddReplace);

// Reset state in handleAddStudent success block
const successResetSearch = `        setName("");
        setEnrollmentNumber("");
        setFatherName("");
        setDob("");
        setEmail("");
        setPhone("");
        setAddress("");
        fetchData();`;

const successResetReplace = `        setName("");
        setEnrollmentNumber("");
        setFatherName("");
        setDob("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSelectedProgs([]);
        fetchData();`;

uiContent = uiContent.replace(successResetSearch, successResetReplace);

// Inject programmes field checkbox list into Add Student Modal
const modalFormSearch = `<div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={phone} onChange={e => setPhone(e.target.value)} /></div>`;

const modalFormReplace = `<div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={phone} onChange={e => setPhone(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Course / Programme Allocation</label><div className="mt-1 border border-stone-200 rounded p-3 bg-stone-50 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{progs.map(p => (<label key={p._id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"><input type="checkbox" checked={selectedProgs.includes(p.title)} onChange={e => { if (e.target.checked) { setSelectedProgs([...selectedProgs, p.title]); } else { setSelectedProgs(selectedProgs.filter(item => item !== p.title)); } }} className="rounded border-stone-300 text-[#a1283c] focus:ring-[#a1283c]" />{p.title}</label>))}</div></div>`;

uiContent = uiContent.replace(modalFormSearch, modalFormReplace);

// Show allocated programmes in Student Details Modal
const detailsModalSearch = `<div className="grid grid-cols-2 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Address</span><span className="text-stone-800 whitespace-pre-wrap">{selectedStudent.address || "N/A"}</span></div>`;

const detailsModalReplace = `<div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Address</span><span className="text-stone-800 whitespace-pre-wrap">{selectedStudent.address || "N/A"}</span></div><div className="grid grid-cols-2 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Allocated Programmes</span><span className="text-stone-800 font-bold">{selectedStudent.programmes && selectedStudent.programmes.length > 0 ? selectedStudent.programmes.join(', ') : "None"}</span></div>`;

uiContent = uiContent.replace(detailsModalSearch, detailsModalReplace);

// 3. Update StudentPortalShell to combine Student profile programmes + Results programmes
const portalStateSearch = `  const [activeCourse, setActiveCourse] = useState("All Programmes");`;
const portalStateReplace = `  const [activeCourse, setActiveCourse] = useState("All Programmes");
  const [allocatedCourses, setAllocatedCourses] = useState<string[]>([]);`;

uiContent = uiContent.replace(portalStateSearch, portalStateReplace);

const portalFetchSearch = `        if (stuData && stuData.length > 0) {
          setStudentDetails(stuData.find((s: any) => s.enrollmentNumber === session.enrollmentNumber));
        }`;

const portalFetchReplace = `        let profileProgs: string[] = [];
        if (stuData && stuData.length > 0) {
          const found = stuData.find((s: any) => s.enrollmentNumber === session.enrollmentNumber);
          setStudentDetails(found);
          if (found && found.programmes) profileProgs = found.programmes;
        }`;

uiContent = uiContent.replace(portalFetchSearch, portalFetchReplace);

const portalFetchResultsSearch = `        if (resData.results) {
          const myResults = resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber);
          setResults(myResults);
          if (myResults.length > 0) setActiveCourse(myResults[0].programme);
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
          setActiveCourse(resData.programme);
        }`;

const portalFetchResultsReplace = `        let resultsProgs: string[] = [];
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
        if (combined.length > 0) setActiveCourse(combined[0]);`;

uiContent = uiContent.replace(portalFetchResultsSearch, portalFetchResultsReplace);

// Update portal sidebar to render active course selection using allocatedCourses instead of results
const sidebarDropdownSearch = `          {results.length > 1 && (
            <div className="mt-2">
              <label className="text-[10px] uppercase text-white/50 tracking-wider mb-1 block">Active Course</label>
              <select 
                className="w-full bg-[#3c0f16] border border-white/20 text-xs rounded p-1.5 outline-none text-white focus:border-[#e8c476]"
                value={activeCourse}
                onChange={e => setActiveCourse(e.target.value)}
              >
                {Array.from(new Set(results.map(r => r.programme))).map(p => (
                  <option key={p as string} value={p as string}>{p as string}</option>
                ))}
              </select>
            </div>
          )}`;

const sidebarDropdownReplace = `          {allocatedCourses.length > 0 && (
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
          )}`;

uiContent = uiContent.replace(sidebarDropdownSearch, sidebarDropdownReplace);

fs.writeFileSync(uiPath, uiContent, 'utf8');
console.log('Successfully updated student registration UI and portal shells.');
