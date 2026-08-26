const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix AdminStudents component state, fetchData and useEffect
const adminStudentsSearch = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");`;

const adminStudentsReplace = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
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
  }, []);`;

// We also need to remove the old fetchStudents definition and useEffect from AdminStudents
const oldFetchSearch = `  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setDbStudents(data || []);
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

// Let's replace the top section of AdminStudents completely
// We will search for a larger block to avoid conflicts
const largerSearch = `function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
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
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setDbStudents(data || []);
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

content = content.replace(largerSearch, adminStudentsReplace);

// 2. Fix handleAddStudent to submit the programmes array and reset states
const handleAddSearch = `    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollmentNumber, fatherName, dob, email, phone, address })
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
        fetchData();`;

const handleAddReplace = `    try {
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
        fetchData();`;

content = content.replace(handleAddSearch, handleAddReplace);

// 3. Fix SystemVerification component to call fetchStudents instead of fetchData
const verificationSearch = `function SystemVerification({ notify }: { notify: (msg: string) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await fetch('/api/students'); if (res.ok) setStudents(await res.json()); } catch(e){} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);`;

const verificationReplace = `function SystemVerification({ notify }: { notify: (msg: string) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await fetch('/api/students'); if (res.ok) setStudents(await res.json()); } catch(e){} finally { setLoading(false); }
  };
  useEffect(() => { fetchStudents(); }, []);`;

content = content.replace(verificationSearch, verificationReplace);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully fixed AdminStudents and SystemVerification.');
