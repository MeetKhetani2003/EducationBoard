const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');

// =========================================================
// PATCH 1: Add selectedProgrammeId state in App component
// =========================================================
const stateTarget = '  const [page, setPage] = useState<Page>(pageFromHash);';
if (code.includes(stateTarget)) {
  code = code.replace(
    stateTarget,
    `  const [page, setPage] = useState<Page>("home");\r\n  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);`
  );
  console.log("PATCH 1: Added selectedProgrammeId state + hydration fix");
} else {
  console.log("PATCH 1: SKIP - state target not found");
}

// =========================================================
// PATCH 1b: Add useEffect for hash sync
// =========================================================
const syncTarget = '    const syncPage = () => setPage(pageFromHash());\r\n    window.addEventListener("popstate", syncPage);\r\n    return () => window.removeEventListener("popstate", syncPage);';
if (code.includes(syncTarget)) {
  code = code.replace(
    syncTarget,
    '    setPage(pageFromHash());\r\n    const syncPage = () => setPage(pageFromHash());\r\n    window.addEventListener("popstate", syncPage);\r\n    return () => window.removeEventListener("popstate", syncPage);'
  );
  console.log("PATCH 1b: Added hydration sync in useEffect");
} else {
  console.log("PATCH 1b: SKIP - sync target not found");
}

// =========================================================
// PATCH 2: Pass selectedProgrammeId to AdminShell
// =========================================================
const shellTarget = '<AdminShell page={page} navigate={navigate} notify={notify} />';
if (code.includes(shellTarget)) {
  code = code.replace(
    shellTarget,
    '<AdminShell page={page} navigate={navigate} notify={notify} selectedProgrammeId={selectedProgrammeId} setSelectedProgrammeId={setSelectedProgrammeId} />'
  );
  console.log("PATCH 2: Passed state props to AdminShell");
} else {
  console.log("PATCH 2: SKIP - shell target not found");
}

// =========================================================
// PATCH 3: Update AdminShell function definition
// =========================================================
const adminShellDefTarget = 'function AdminShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {';
if (code.includes(adminShellDefTarget)) {
  code = code.replace(
    adminShellDefTarget,
    'function AdminShell({ page, navigate, notify, selectedProgrammeId, setSelectedProgrammeId }: { page: Page; navigate: Navigate; notify: (message: string) => void; selectedProgrammeId: string | null; setSelectedProgrammeId: (id: string | null) => void }) {'
  );
  console.log("PATCH 3: Updated AdminShell function definition");
} else {
  console.log("PATCH 3: SKIP - AdminShell def not found");
}

// =========================================================
// PATCH 4: Update renderAdminPage call inside AdminShell
// =========================================================
const renderCallTarget = '{renderAdminPage(page, navigate, notify)}';
if (code.includes(renderCallTarget)) {
  code = code.replace(
    renderCallTarget,
    '{renderAdminPage(page, navigate, notify, selectedProgrammeId, setSelectedProgrammeId)}'
  );
  console.log("PATCH 4: Updated renderAdminPage call");
} else {
  console.log("PATCH 4: SKIP - renderAdminPage call not found");
}

// =========================================================
// PATCH 5: Update renderAdminPage function definition
// =========================================================
const renderDefTarget = 'function renderAdminPage(page: Page, navigate: Navigate, notify: (message: string) => void) {';
if (code.includes(renderDefTarget)) {
  code = code.replace(
    renderDefTarget,
    'function renderAdminPage(page: Page, navigate: Navigate, notify: (message: string) => void, selectedProgrammeId: string | null, setSelectedProgrammeId: (id: string | null) => void) {'
  );
  console.log("PATCH 5: Updated renderAdminPage function definition");
} else {
  console.log("PATCH 5: SKIP - renderAdminPage def not found");
}

// =========================================================
// PATCH 6: Update admin switch statement - add programme-dashboard case and pass props to AdminCollection
// =========================================================
const switchTarget = '    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;\r\n    default: return <AdminCollection page={page} notify={notify} />;';
if (code.includes(switchTarget)) {
  code = code.replace(
    switchTarget,
    '    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;\r\n    case "admin-programme-dashboard": return <AdminProgrammeDashboard programmeId={selectedProgrammeId} navigate={navigate} notify={notify} />;\r\n    default: return <AdminCollection page={page} notify={notify} navigate={navigate} setSelectedProgrammeId={setSelectedProgrammeId} />;'
  );
  console.log("PATCH 6: Added programme-dashboard case to switch");
} else {
  console.log("PATCH 6: SKIP - switch target not found");
}

// =========================================================
// PATCH 7: Update AdminCollection to accept navigate and setSelectedProgrammeId
// =========================================================
const adminColTarget = 'function AdminCollection({ page, notify }: { page: Page; notify: (message: string) => void }) {';
if (code.includes(adminColTarget)) {
  code = code.replace(
    adminColTarget,
    'function AdminCollection({ page, notify, navigate, setSelectedProgrammeId }: { page: Page; notify: (message: string) => void; navigate?: Navigate; setSelectedProgrammeId?: (id: string | null) => void }) {'
  );
  console.log("PATCH 7: Updated AdminCollection props");
} else {
  console.log("PATCH 7: SKIP - AdminCollection def not found");
}

// =========================================================
// PATCH 8: Add Manage button to programme card
// =========================================================
const deleteButtonTarget = '<Button onClick={() => handleDeleteProg(item._id)} variant="secondary" className="min-h-9 flex-1 text-red-600 border-red-100 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</Button>';
if (code.includes(deleteButtonTarget)) {
  code = code.replace(
    deleteButtonTarget,
    '<Button onClick={() => handleDeleteProg(item._id)} variant="secondary" className="min-h-9 text-red-600 border-red-100 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</Button>\r\n            <Button onClick={() => { if (setSelectedProgrammeId && navigate) { setSelectedProgrammeId(item._id); navigate("admin-programme-dashboard"); } }} className="min-h-9 flex-1"><GraduationCap className="h-4 w-4" /> Manage</Button>'
  );
  console.log("PATCH 8: Added Manage button to programme card");
} else {
  console.log("PATCH 8: SKIP - delete button target not found");
}

// =========================================================
// PATCH 9: Update Page type to include admin-programme-dashboard
// =========================================================
const pageTypeTarget = '"admin-settings" | "admin-add-result"';
if (code.includes(pageTypeTarget) && !code.includes('"admin-programme-dashboard"')) {
  code = code.replace(
    pageTypeTarget,
    '"admin-settings" | "admin-add-result" | "admin-programme-dashboard"'
  );
  console.log("PATCH 9: Added admin-programme-dashboard to Page type");
} else {
  console.log("PATCH 9: SKIP - already exists or not found");
}

// =========================================================
// PATCH 10: Add admin-programme-dashboard to validPages array
// =========================================================
const validPagesTarget = '"admin-recognition", "admin-messages", "admin-settings", "admin-add-result",';
if (code.includes(validPagesTarget) && !code.includes('"admin-programme-dashboard",')) {
  code = code.replace(
    validPagesTarget,
    '"admin-recognition", "admin-messages", "admin-settings", "admin-add-result", "admin-programme-dashboard",'
  );
  console.log("PATCH 10: Added admin-programme-dashboard to validPages");
} else {
  console.log("PATCH 10: SKIP - already exists or not found");
}

// =========================================================
// PATCH 11: Fix examState conditions for conduction room
// =========================================================
code = code.replace(
  /disabled=\{conductionExam\.examState\s*!==\s*'inactive'\}/g,
  "disabled={!(conductionExam.examState === 'inactive' || !conductionExam.examState)}"
);
code = code.replace(
  /conductionExam\.examState\s*===\s*'inactive'/g,
  "(conductionExam.examState === 'inactive' || !conductionExam.examState)"
);
console.log("PATCH 11: Fixed examState fallback conditions");

// =========================================================
// PATCH 12: Fix student login - replace simulated login with real API-backed login
// =========================================================
const loginSimTarget = "    // Simulate API call for login\r\n    setTimeout(() => {\r\n      setLoading(false);\r\n      navigate(\"student-zone\");\r\n    }, 800);";
if (code.includes(loginSimTarget)) {
  code = code.replace(
    "  const handleLogin = (e: React.FormEvent) => {",
    "  const handleLogin = async (e: React.FormEvent) => {"
  );
  code = code.replace(
    loginSimTarget,
    `    try {
      const res = await fetch('/api/students?search=' + encodeURIComponent(enrollment.trim()));
      const students = await res.json();
      const studentList = Array.isArray(students) ? students : (students.students || []);
      const matched = studentList.find((s: any) => s.enrollmentNumber === enrollment.trim());
      
      if (!matched) {
        setError("No student found with this Enrollment Number. Please check and try again.");
        setLoading(false);
        return;
      }
      
      if (matched.dob) {
        const studentDob = new Date(matched.dob).toISOString().split('T')[0];
        if (studentDob !== dob) {
          setError("Date of Birth does not match our records. Please verify and try again.");
          setLoading(false);
          return;
        }
      }
      
      const session = {
        enrollmentNumber: matched.enrollmentNumber,
        name: matched.name,
        fatherName: matched.fatherName || '',
        dob: matched.dob,
        programmes: matched.programmes || [],
        _id: matched._id
      };
      localStorage.setItem('studentSession', JSON.stringify(session));
      navigate("student-zone");
    } catch (err: any) {
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }`
  );
  console.log("PATCH 12: Replaced simulated login with real API-backed login");
} else {
  console.log("PATCH 12: SKIP - simulated login target not found");
}

// =========================================================
// PATCH 13: Insert AdminProgrammeDashboard component before App
// =========================================================
const injectPath = path.join(__dirname, 'components_to_inject.txt');
if (fs.existsSync(injectPath)) {
  const newDashboardCode = fs.readFileSync(injectPath, 'utf8');
  const appStartToken = 'export default function App() {';
  const appIndex = code.indexOf(appStartToken);
  if (appIndex !== -1) {
    code = code.substring(0, appIndex) + newDashboardCode + '\n\n' + code.substring(appIndex);
    console.log("PATCH 13: Inserted AdminProgrammeDashboard component");
  } else {
    console.log("PATCH 13: SKIP - App component not found");
  }
} else {
  console.log("PATCH 13: SKIP - components_to_inject.txt not found");
}

fs.writeFileSync(pagePath, code, 'utf8');
console.log("\n=== ALL PATCHES APPLIED SUCCESSFULLY ===");
