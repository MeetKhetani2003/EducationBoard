const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

// 1. Declare selectedProgrammeId state inside App component
// Let's find: const [page, setPage] = useState<Page>(pageFromHash);
const stateTarget = '  const [page, setPage] = useState<Page>(pageFromHash);';
pageCode = pageCode.replace(
  stateTarget,
  `  const [page, setPage] = useState<Page>(pageFromHash);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);`
);

// 2. Pass state to AdminShell inside App component return
// Let's find: <AdminShell page={page} navigate={navigate} notify={notify} />
const shellTarget = '<AdminShell page={page} navigate={navigate} notify={notify} />';
pageCode = pageCode.replace(
  shellTarget,
  `<AdminShell page={page} navigate={navigate} notify={notify} selectedProgrammeId={selectedProgrammeId} setSelectedProgrammeId={setSelectedProgrammeId} />`
);

// 3. Update AdminShell function properties to accept state props
const adminShellDefTarget = 'function AdminShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {';
const adminShellDefNew = 'function AdminShell({ page, navigate, notify, selectedProgrammeId, setSelectedProgrammeId }: { page: Page; navigate: Navigate; notify: (message: string) => void; selectedProgrammeId: string | null; setSelectedProgrammeId: (id: string | null) => void }) {';
pageCode = pageCode.replace(adminShellDefTarget, adminShellDefNew);

// 4. Update the renderAdminPage call inside AdminShell component to pass the state props
const renderAdminPageCallTarget = '{renderAdminPage(page, navigate, notify)}';
const renderAdminPageCallNew = '{renderAdminPage(page, navigate, notify, selectedProgrammeId, setSelectedProgrammeId)}';
pageCode = pageCode.replace(renderAdminPageCallTarget, renderAdminPageCallNew);

// 5. Update renderAdminPage function properties to accept state props and render dashboard case
const renderAdminPageDefTarget = 'function renderAdminPage(page: Page, navigate: Navigate, notify: (message: string) => void) {';
const renderAdminPageDefNew = 'function renderAdminPage(page: Page, navigate: Navigate, notify: (message: string) => void, selectedProgrammeId: string | null, setSelectedProgrammeId: (id: string | null) => void) {';
pageCode = pageCode.replace(renderAdminPageDefTarget, renderAdminPageDefNew);

// 6. Update renderAdminPage switch statement to handle admin-programme-dashboard and admin-programmes
const renderSwitchTarget = '    case "admin-settings": return <AdminSettings notify={notify} />;\n    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;\n    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;\n    default: return <AdminCollection page={page} notify={notify} />;';

const renderSwitchNew = `    case "admin-settings": return <AdminSettings notify={notify} />;
    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;
    case "admin-programme-dashboard": return <AdminProgrammeDashboard programmeId={selectedProgrammeId} navigate={navigate} notify={notify} />;
    default: return <AdminCollection page={page} notify={notify} navigate={navigate} setSelectedProgrammeId={setSelectedProgrammeId} />;`;

pageCode = pageCode.replace(renderSwitchTarget, renderSwitchNew);

// 7. Update AdminCollection function definition to accept navigate and setSelectedProgrammeId
const adminColTarget = 'function AdminCollection({ page, notify }: { page: Page; notify: (message: string) => void }) {';
const adminColNew = 'function AdminCollection({ page, notify, navigate, setSelectedProgrammeId }: { page: Page; notify: (message: string) => void; navigate?: Navigate; setSelectedProgrammeId?: (id: string | null) => void }) {';
pageCode = pageCode.replace(adminColTarget, adminColNew);

// 8. Inject the "Manage" button in AdminCollection list of programmes card
const deleteButtonTarget = '<Button onClick={() => handleDeleteProg(item._id)} variant="secondary" className="min-h-9 flex-1 text-red-600 border-red-100 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</Button>';
const deleteButtonNew = `<Button onClick={() => handleDeleteProg(item._id)} variant="secondary" className="min-h-9 text-red-600 border-red-100 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</Button>
            <Button onClick={() => { if (setSelectedProgrammeId && navigate) { setSelectedProgrammeId(item._id); navigate("admin-programme-dashboard"); } }} className="min-h-9 flex-1"><GraduationCap className="h-4 w-4" /> Manage</Button>`;
pageCode = pageCode.replace(deleteButtonTarget, deleteButtonNew);

// 9. Update the Page type to include admin-programme-dashboard
const pageTypeTarget = '"admin-settings" | "admin-add-result"';
const pageTypeNew = '"admin-settings" | "admin-add-result" | "admin-programme-dashboard"';
pageCode = pageCode.replace(pageTypeTarget, pageTypeNew);

// Let's add 'admin-programme-dashboard' to validPages array as well
const validPagesTarget = '"admin-recognition", "admin-messages", "admin-settings", "admin-add-result",';
const validPagesNew = '"admin-recognition", "admin-messages", "admin-settings", "admin-add-result", "admin-programme-dashboard",';
pageCode = pageCode.replace(validPagesTarget, validPagesNew);

// Write modified code back to page.tsx
fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("Successfully ran structural configuration patches on app/page.tsx");
