const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add state for enroll mode
const stateInjection = `
  const [enrollMode, setEnrollMode] = useState<"new"|"existing">("new");
  const [allSystemStudents, setAllSystemStudents] = useState<any[]>([]);
  const [selectedExistingId, setSelectedExistingId] = useState("");

  useEffect(() => {
    if (showStudentModal) {
      fetch("/api/students").then(r => r.json()).then(data => {
        if(Array.isArray(data)) setAllSystemStudents(data);
      }).catch(console.error);
    }
  }, [showStudentModal]);

  const handleEnrollStudent = async`;

c = c.replace(/const handleEnrollStudent = async/, stateInjection);

// 2. Replace handleEnrollStudent logic
const newHandleEnrollStudent = `const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (enrollMode === "existing") {
        if (!selectedExistingId) {
          alert("Please select a student");
          setSaving(false);
          return;
        }
        const student = allSystemStudents.find(s => s._id === selectedExistingId);
        if (!student) {
          setSaving(false);
          return;
        }
        const updatedProgrammes = [...new Set([...(student.programmes || []), programme.title])];
        
        const res = await fetch("/api/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: student._id,
            name: student.name,
            fatherName: student.fatherName,
            dob: student.dob,
            programmes: updatedProgrammes
          })
        });
        if (res.ok) {
           notify("Existing Student enrolled to program successfully!");
           setShowStudentModal(false);
           fetchData();
        } else {
           const text = await res.json();
           alert(text.error || "Enrollment failed");
        }
      } else {
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollmentNumber: studentEnroll,
            name: studentName,
            fatherName: studentFather,
            dob: studentDob,
            programmes: [programme.title]
          })
        });
        if (res.ok) {
          notify("New Student enrolled to program successfully!");
          setShowStudentModal(false);
          setStudentEnroll("");
          setStudentName("");
          setStudentFather("");
          setStudentDob("");
          fetchData();
        } else {
          const text = await res.json();
          alert(text.error || "Enrollment failed");
        }
      }
    } catch(err) {
      alert("Enrolling failed");
    } finally {
      setSaving(false);
    }
  };`;

// We need to carefully replace the old handleEnrollStudent string.
// Let's use a regex to match from `const handleEnrollStudent = async` until `setSaving(false);\n    }\n  };`
c = c.replace(/const handleEnrollStudent = async \(e: React\.FormEvent\) => \{[\s\S]*?setSaving\(false\);\n    \}\n  \};/, newHandleEnrollStudent);

// 3. Replace the Modal UI
const oldModalStr = `<AnimatePresence>{showStudentModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleEnrollStudent} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Enroll Student to Programme</h3><button type="button" onClick={() => setShowStudentModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentEnroll} onChange={e => setStudentEnroll(e.target.value)} placeholder="e.g. ENR2026101" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Full Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentName} onChange={e => setStudentName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentFather} onChange={e => setStudentFather(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentDob} onChange={e => setStudentDob(e.target.value)} /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowStudentModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Enrolling..." : "Enroll Student"}</Button></div></motion.form></motion.div>}</AnimatePresence>`;

const newModalStr = `<AnimatePresence>
      {showStudentModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5 overflow-y-auto">
          <motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleEnrollStudent} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Enroll Student to Programme</h3>
              <button type="button" onClick={() => setShowStudentModal(false)}><X className="h-5 w-5 text-stone-400" /></button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="radio" checked={enrollMode === 'new'} onChange={() => setEnrollMode('new')} className="accent-[#8d1c2f]" />
                New Student
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="radio" checked={enrollMode === 'existing'} onChange={() => setEnrollMode('existing')} className="accent-[#8d1c2f]" />
                Existing Student
              </label>
            </div>

            {enrollMode === 'new' ? (
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentEnroll} onChange={e => setStudentEnroll(e.target.value)} placeholder="e.g. ENR2026101" /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Full Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentName} onChange={e => setStudentName(e.target.value)} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentFather} onChange={e => setStudentFather(e.target.value)} /></div>
                <div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={studentDob} onChange={e => setStudentDob(e.target.value)} /></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Select Existing Student *</label>
                  <select required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c] font-sans" value={selectedExistingId} onChange={e => setSelectedExistingId(e.target.value)}>
                    <option value="">-- Choose a Student --</option>
                    {allSystemStudents.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.enrollmentNumber})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4">
              <Button type="button" variant="secondary" onClick={() => setShowStudentModal(false)}>Cancel</Button>
              <Button disabled={saving} type="submit">{saving ? "Enrolling..." : "Enroll Student"}</Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>`;

// Just run string replace
c = c.replace(oldModalStr, newModalStr);

fs.writeFileSync('app/page.tsx', c);
console.log('Enrollment UI successfully updated!');
