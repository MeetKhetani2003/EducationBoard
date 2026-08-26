const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Step 1: Update the state variables inside StudentPortalShell
const stateSearch = `  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);`;

const stateReplacement = `  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);`;

content = content.replace(stateSearch, stateReplacement);

// Step 2: Update the useEffect to fetch all required data
const useEffectSearch = `      fetch('/api/results?search=' + encodeURIComponent(session.enrollmentNumber))
        .then(res => res.json())
        .then(data => {
          if (data.results) {
            setResults(data.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber));
          } else if (data.enrollmentNumber) {
            setResults([data]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });`;

const useEffectReplacement = `      Promise.all([
        fetch('/api/results?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/students?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch('/api/documents').then(r => r.json())
      ]).then(([resData, stuData, exmData, docData]) => {
        if (resData.results) {
          setResults(resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber));
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
        }
        
        if (stuData && stuData.length > 0) {
          setStudentDetails(stuData.find((s: any) => s.enrollmentNumber === session.enrollmentNumber));
        }
        
        setExams(Array.isArray(exmData) ? exmData : []);
        setDocuments(Array.isArray(docData) ? docData : []);
        
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });`;

content = content.replace(useEffectSearch, useEffectReplacement);

// Step 3: Replace the "Under Development" section with actual tabs
const tabsSearch = `          {activeTab !== "My Dashboard" && activeTab !== "My Results" && (
            <div className="bg-white rounded-xl p-8 border border-stone-200 shadow-sm text-center">
              <h2 className="text-xl font-bold text-stone-800 mb-2">{activeTab}</h2>
              <p className="text-stone-500">This section is currently under development.</p>
            </div>
          )}`;

const tabsReplacement = `          {activeTab === "Academic Profile" && (
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
                {exams.length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled.</div>
                ) : (
                  exams.map((exam, i) => (
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
                {documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No study materials available at the moment.</div>
                ) : (
                  documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category)).map((doc, i) => (
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
                {documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No forms or circulars available at the moment.</div>
                ) : (
                  documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category)).map((doc, i) => (
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
          )}`;

content = content.replace(tabsSearch, tabsReplacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated StudentPortalShell in app/page.tsx');
