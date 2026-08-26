const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject Edit Form states into AdminStudents component
const searchStates = `  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");`;

const replaceStates = `  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editFatherName, setEditFatherName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editProgs, setEditProgs] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");`;

content = content.replace(searchStates, replaceStates);

// 2. Add handleUpdateStudent handler
const searchAddHandler = `  const handleAddStudent = async (e: React.FormEvent) => {`;
const replaceAddHandler = `  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent._id,
          name: editName,
          fatherName: editFatherName,
          dob: editDob,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          programmes: editProgs
        })
      });
      if (res.ok) {
        notify("Student profile updated successfully!");
        setSelectedStudent(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Update failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {`;

content = content.replace(searchAddHandler, replaceAddHandler);

// 3. Update the click handler for viewing/editing student to populate edit states
const searchClickEye = `<button onClick={() => setSelectedStudent(row)} className="grid h-8 w-8 place-items-center rounded hover:bg-stone-50 text-stone-600"><Eye className="h-4 w-4" /></button>`;
const replaceClickEye = `<button onClick={() => {
  setSelectedStudent(row);
  setEditName(row.name || "");
  setEditFatherName(row.fatherName || "");
  setEditDob(row.dob ? new Date(row.dob).toISOString().split('T')[0] : "");
  setEditEmail(row.email || "");
  setEditPhone(row.phone || "");
  setEditAddress(row.address || "");
  setEditProgs(row.programmes || []);
}} className="grid h-8 w-8 place-items-center rounded hover:bg-stone-50 text-stone-600" title="Edit Student"><Eye className="h-4 w-4" /></button>`;

content = content.replace(searchClickEye, replaceClickEye);

// 4. Overwrite VIEW DETAILS MODAL to make it the EDIT MODAL
const searchDetailsModal = `    {/* VIEW DETAILS MODAL */}
    <AnimatePresence>{selectedStudent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Student Profile Details</h3><button onClick={() => setSelectedStudent(null)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-3 text-xs"><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Full Name</span><span className="text-stone-800 font-bold">{selectedStudent.name}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Enrollment Number</span><span className="text-stone-800 font-semibold">{selectedStudent.enrollmentNumber}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Father's Name</span><span className="text-stone-800">{selectedStudent.fatherName}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Date of Birth</span><span className="text-stone-800">{selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : "-"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Email Address</span><span className="text-stone-800">{selectedStudent.email || "N/A"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Phone Number</span><span className="text-stone-800">{selectedStudent.phone || "N/A"}</span></div><div className="grid grid-cols-2 border-b border-stone-100 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Address</span><span className="text-stone-800 whitespace-pre-wrap">{selectedStudent.address || "N/A"}</span></div><div className="grid grid-cols-2 pb-2"><span className="text-stone-400 font-semibold uppercase tracking-wider">Allocated Programmes</span><span className="text-stone-800 font-bold">{selectedStudent.programmes && selectedStudent.programmes.length > 0 ? selectedStudent.programmes.join(', ') : "None"}</span></div></div><div className="flex justify-end border-t border-stone-200 pt-3 mt-4"><Button onClick={() => setSelectedStudent(null)}>Close</Button></div></motion.div></motion.div>}</AnimatePresence>`;

const replaceDetailsModal = `    {/* EDIT PROFILE MODAL */}
    <AnimatePresence>{selectedStudent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Edit Student Profile</h3><button onClick={() => setSelectedStudent(null)}><X className="h-5 w-5 text-stone-400" /></button></div><form onSubmit={handleUpdateStudent} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editName} onChange={e => setEditName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number</label><input disabled className="w-full rounded border border-stone-200 p-2 text-xs bg-stone-100 outline-none text-stone-500" value={selectedStudent.enrollmentNumber} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editFatherName} onChange={e => setEditFatherName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editDob} onChange={e => setEditDob(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Email</label><input type="email" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Course / Programme Allocation</label><div className="mt-1 border border-stone-200 rounded p-3 bg-stone-50 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{progs.map(p => (<label key={p._id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"><input type="checkbox" checked={editProgs.includes(p.title)} onChange={e => { if (e.target.checked) { setEditProgs([...editProgs, p.title]); } else { setEditProgs(editProgs.filter(item => item !== p.title)); } }} className="rounded border-stone-300 text-[#a1283c] focus:ring-[#a1283c]" />{p.title}</label>))}</div></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Address</label><textarea rows={2} className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editAddress} onChange={e => setEditAddress(e.target.value)} /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setSelectedStudent(null)}>Cancel</Button><Button disabled={updating} type="submit">{updating ? "Saving Changes..." : "Save Changes"}</Button></div></form></motion.div></motion.div>}</AnimatePresence>`;

content = content.replace(searchDetailsModal, replaceDetailsModal);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully added student edit profile capability in app/page.tsx');
