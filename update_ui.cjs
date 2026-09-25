const fs = require('fs');
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// 1. Add examCenter to AdminAddResult state
clientApp = clientApp.replace(
  'const [printDate, setPrintDate] = useState(() => new Date().toISOString().split("T")[0]);',
  'const [printDate, setPrintDate] = useState(() => new Date().toISOString().split("T")[0]);\n  const [examCenter, setExamCenter] = useState("");'
);

// 2. Add examCenter to AdminAddResult payload
const payloadSearch = `        printDate,
      };`;
const payloadReplace = `        printDate,
        examCenter,
      };`;
clientApp = clientApp.replace(payloadSearch, payloadReplace);

// 3. Add examCenter input to AdminAddResult form
const printDateDiv = `            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Print Date
              </label>
              <input
                type="date"
                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none"
                value={printDate}
                onChange={(e) => setPrintDate(e.target.value)}
              />
            </div>`;

const centerDiv = `            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Exam Center
              </label>
              <input
                className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none"
                value={examCenter}
                onChange={(e) => setExamCenter(e.target.value)}
                placeholder="Enter Center Name"
              />
            </div>`;

clientApp = clientApp.replace(printDateDiv, printDateDiv + "\n" + centerDiv);

// 4. Update the ResultDetailPage (Marksheet) to show Exam Center
// Find where to put it. Let's put it next to Examination Year or Programme.
const centerSearch = `                <div className="font-semibold text-stone-800">
                  {result.examination}
                </div>
              </div>`;
const centerReplace = `                <div className="font-semibold text-stone-800">
                  {result.examination}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-stone-500">Exam Center</div>
                <div className="font-semibold text-stone-800">
                  {result.examCenter || "N/A"}
                </div>
              </div>`;

clientApp = clientApp.replace(centerSearch, centerReplace);

fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
console.log('Updated ClientApp.tsx for Exam Center and AdminShell Logout');
