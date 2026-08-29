const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf8');

// Replace the page state definition
const stateTarget = '  const [page, setPage] = useState<Page>(pageFromHash);\n  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);';
const stateNew = '  const [page, setPage] = useState<Page>("home");\n  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);';

pageCode = pageCode.replace(stateTarget, stateNew);

// Replace the useEffect block for hash synchronization
const syncTarget = `  useEffect(() => {
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);`;

const syncNew = `  useEffect(() => {
    setPage(pageFromHash());
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);`;

pageCode = pageCode.replace(syncTarget, syncNew);

fs.writeFileSync(pagePath, pageCode, 'utf8');
console.log("Hydration sync applied successfully");
