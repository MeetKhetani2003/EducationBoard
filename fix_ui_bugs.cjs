const fs = require('fs');
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// 1. Fix DownloadsPage to exclude Gallery Images
const downloadsPageSearch = `fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setDbDocs(data);
      })`;

const downloadsPageReplace = `fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Exclude Gallery Image from downloads
          const filtered = data.filter((d: any) => d.category !== "Gallery Image" && d.category !== "Gallery");
          setDbDocs(filtered);
        }
      })`;

clientApp = clientApp.replace(downloadsPageSearch, downloadsPageReplace);

// 2. Fix Document Verification Page
const verifySearch = `function VerificationPage({ navigate }: { navigate: Navigate }) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  function verify(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 900);
  }`;

const verifyReplace = `function VerificationPage({ navigate }: { navigate: Navigate }) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [certNum, setCertNum] = useState("");
  const [resultData, setResultData] = useState<any>(null);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(\`/api/results?enrollment=\${rollNumber}&dob=\${dob}\`);
      if (res.ok) {
        const data = await res.json();
        setResultData(data);
        setVerified(true);
      } else {
        alert("Document verification failed. Please check the details.");
      }
    } catch (e) {
      alert("Error verifying document.");
    } finally {
      setLoading(false);
    }
  }`;

clientApp = clientApp.replace(verifySearch, verifyReplace);

// Fix inputs in VerificationPage
const verifyInputsSearch = `              <Field
                label="Roll Number"
                required
                placeholder="Enter roll number"
              />
              <Field
                label="Certificate Number"
                required
                placeholder="Enter certificate number"
              />
              <Field label="Date of Birth" required type="date" />`;

const verifyInputsReplace = `              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Roll Number</label>
                <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" placeholder="Enter roll number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Certificate Number</label>
                <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" placeholder="Enter certificate number" value={certNum} onChange={(e) => setCertNum(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Date of Birth</label>
                <input required type="date" className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>`;

clientApp = clientApp.replace(verifyInputsSearch, verifyInputsReplace);

// Fix verified data in VerificationPage
const verifiedDataSearch = `                  {[
                    ["Student", "{resultData.studentName}"],
                    ["Document", "Senior Secondary Marksheet"],
                    ["Roll Number", "{resultData.enrollmentNumber}"],
                    ["Issue Date", "17 August 2026"],
                    ["Programme", "Senior Secondary"],
                    ["Verification ID", "THAR-R26-1842-0098"],
                  ].map(([label, value]) => (`;

const verifiedDataReplace = `                  {[
                    ["Student", resultData?.studentName || "N/A"],
                    ["Document", "Marksheet"],
                    ["Roll Number", resultData?.enrollmentNumber || resultData?.rollNumber || "N/A"],
                    ["Issue Date", new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
                    ["Programme", resultData?.programme || "N/A"],
                    ["Verification ID", certNum || "THAR-VERIFIED"],
                  ].map(([label, value]) => (`;

clientApp = clientApp.replace(verifiedDataSearch, verifiedDataReplace);


// 3. Marksheet current date
// Locate ResultDetailPage
const marksheetSearch1 = `<td className="p-2 font-bold text-stone-800">
                      {resultData.printDate || "17 August 2026"}
                    </td>`;
const marksheetReplace1 = `<td className="p-2 font-bold text-stone-800">
                      {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </td>`;

clientApp = clientApp.replace(marksheetSearch1, marksheetReplace1);

const marksheetSearch2 = `<p className="mt-1">Published: {resultData.printDate || "17 August 2026"}</p>`;
const marksheetReplace2 = `<p className="mt-1">Published: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>`;

clientApp = clientApp.replace(marksheetSearch2, marksheetReplace2);

fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
console.log('Fixed ClientApp.tsx downloads, verification, and marksheet date');
