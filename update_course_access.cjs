const fs = require('fs');
const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update AdminDownloads to include a programme selection dropdown
const adminDownloadsSearch = `function AdminDownloads({ notify }: { notify: (msg: string) => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Notices");
  const [uploading, setUploading] = useState(false);`;

const adminDownloadsReplace = `function AdminDownloads({ notify }: { notify: (msg: string) => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Notices");
  const [uploadProgramme, setUploadProgramme] = useState("All Programmes");
  const [uploading, setUploading] = useState(false);`;

content = content.replace(adminDownloadsSearch, adminDownloadsReplace);

const adminDownloadsFetchSearch = `  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);`;

const adminDownloadsFetchReplace = `  const fetchData = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) setDocs(await res.json());
      const pRes = await fetch("/api/programmes");
      if (pRes.ok) setProgs(await pRes.json());
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);`;

content = content.replace(adminDownloadsFetchSearch, adminDownloadsFetchReplace);

const adminDownloadsFormSearch = `      fd.append("title", uploadTitle);
      fd.append("category", uploadCategory);
      fd.append("file", file);`;

const adminDownloadsFormReplace = `      fd.append("title", uploadTitle);
      fd.append("category", uploadCategory);
      fd.append("programme", uploadProgramme);
      fd.append("file", file);`;

content = content.replace(adminDownloadsFormSearch, adminDownloadsFormReplace);

const adminDownloadsModalSearch = `<div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}><option value="Notices">Notices</option><option value="Syllabus">Syllabus</option><option value="Study Material">Study Material</option><option value="Notes">Notes</option><option value="Forms">Forms</option><option value="Circulars">Circulars</option></select></div>`;

const adminDownloadsModalReplace = `<div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}><option value="Notices">Notices</option><option value="Syllabus">Syllabus</option><option value="Study Material">Study Material</option><option value="Notes">Notes</option><option value="Forms">Forms</option><option value="Circulars">Circulars</option></select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Allocate Programme</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={uploadProgramme} onChange={e => setUploadProgramme(e.target.value)}><option value="All Programmes">All Programmes</option>{progs.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}</select></div>`;

content = content.replace(adminDownloadsModalSearch, adminDownloadsModalReplace);

const adminDownloadsListSearch = `<div className="text-xs font-bold uppercase tracking-wider text-[#a1283c]">{row.category}</div>`;
const adminDownloadsListReplace = `<div className="text-xs font-bold uppercase tracking-wider text-[#a1283c]">{row.category} <span className="text-stone-400 font-normal">| {row.programme || 'All Programmes'}</span></div>`;

content = content.replace(adminDownloadsListSearch, adminDownloadsListReplace);

// 2. Update StudentPortalShell to handle multiple courses and filter correctly
const shellStateSearch = `  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);`;

const shellStateReplace = `  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [activeCourse, setActiveCourse] = useState("All Programmes");`;

content = content.replace(shellStateSearch, shellStateReplace);

const shellFetchSearch = `        if (resData.results) {
          setResults(resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber));
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
        }`;

const shellFetchReplace = `        if (resData.results) {
          const myResults = resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber);
          setResults(myResults);
          if (myResults.length > 0) setActiveCourse(myResults[0].programme);
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
          setActiveCourse(resData.programme);
        }`;

content = content.replace(shellFetchSearch, shellFetchReplace);

const shellSidebarSearch = `        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#8d1c2f] flex items-center justify-center border-2 border-[#e8c476]">
              <span className="font-bold text-lg text-[#e8c476]">{student.studentName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold text-sm line-clamp-1" title={student.studentName}>{student.studentName}</div>
              <div className="text-xs text-[#e8c476]">Enrollment: {student.enrollmentNumber}</div>
            </div>
          </div>
        </div>`;

const shellSidebarReplace = `        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#8d1c2f] flex items-center justify-center border-2 border-[#e8c476]">
              <span className="font-bold text-lg text-[#e8c476]">{student.studentName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold text-sm line-clamp-1" title={student.studentName}>{student.studentName}</div>
              <div className="text-xs text-[#e8c476]">Enr: {student.enrollmentNumber}</div>
            </div>
          </div>
          {results.length > 1 && (
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
          )}
        </div>`;

content = content.replace(shellSidebarSearch, shellSidebarReplace);

const shellExamsSearch = `{exams.length === 0 ? (`;
const shellExamsReplace = `
                {exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled for this course.</div>
                ) : (
                  exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).map((exam, i) => (`;

content = content.replace(shellExamsSearch, shellExamsReplace);
// Note: Due to the generic search above, we might need a more precise replace for exams.

const shellMaterialsSearch = `{documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category)).length === 0 ? (`;
const shellMaterialsReplace = `{documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (`;

const shellMaterialsListSearch = `documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category)).map((doc, i) => (`
const shellMaterialsListReplace = `documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (`

content = content.replace(shellMaterialsSearch, shellMaterialsReplace);
content = content.replace(shellMaterialsListSearch, shellMaterialsListReplace);

const shellFormsSearch = `{documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category)).length === 0 ? (`;
const shellFormsReplace = `{documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (`;

const shellFormsListSearch = `documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category)).map((doc, i) => (`;
const shellFormsListReplace = `documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (`;

content = content.replace(shellFormsSearch, shellFormsReplace);
content = content.replace(shellFormsListSearch, shellFormsListReplace);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated course filtering and UI in app/page.tsx');
