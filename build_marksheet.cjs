const fs = require('fs');

const newComponent = `function ResultDetailPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [downloading, setDownloading] = useState(false);
  function download() { setDownloading(true); window.setTimeout(() => { setDownloading(false); notify("Provisional marksheet prepared for download."); }, 900); }
  
  const subjects = [
    { sNo: "1", name: "Hindi", max: "100", min: "33", th: "60", pr: "20", total: "80", grade: "A" },
    { sNo: "2", name: "English", max: "100", min: "33", th: "58", pr: "18", total: "76", grade: "B+" },
    { sNo: "3", name: "Physics / Trade Theory", max: "100", min: "33", th: "66", pr: "15", total: "81", grade: "A" },
    { sNo: "4", name: "Chemistry / Workshop Cal.", max: "100", min: "33", th: "49", pr: "18", total: "67", grade: "B" },
    { sNo: "5", name: "Biology / Practical", max: "100", min: "33", th: "60", pr: "19", total: "79", grade: "B+" },
  ];

  return <><div className="bg-[#f9eef0] py-6 print:hidden"><div className="mx-auto max-w-[1060px] px-5 md:px-8"><Breadcrumb items={["Results", "Result Details"]} navigate={navigate} /></div></div>
  <main className="bg-[#f9eef0] pb-16 print:bg-white print:p-0"><motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1060px] px-5 md:px-8 print:px-0 print:max-w-none"><div className="overflow-hidden border border-stone-300 bg-white shadow-[0_18px_45px_rgba(13,40,87,.08)] print:border-none print:shadow-none">
    
    <div className="flex flex-col gap-6 border-b-[6px] border-[#8d1c2f] p-6 md:flex-row md:items-center md:justify-between md:p-8"><Logo /><div className="md:text-right print:hidden"><StatusBadge tone="green">Result declared</StatusBadge><p className="mt-2 text-xs text-stone-500">Published: 17 August 2026</p></div></div>
    
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-7 text-center">
        <div className="text-xs font-bold uppercase tracking-[.18em] text-stone-500">Statement of Marks</div>
        <h1 className="mt-2 text-2xl font-semibold text-[#4a131c]">Senior Secondary Examination 2026</h1>
        <p className="mt-1 text-sm text-stone-500">Provisional online result</p>
      </div>
      
      <div className="grid gap-x-10 gap-y-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Student Name", "Aarav Sharma"], ["Father's Name", "Rajesh Sharma"], ["Date of Birth", "14 May 2008"], 
          ["Enrollment Number", "TBSTE2601842"], ["Roll Number", "202648310"], ["Programme", "Senior Secondary"], 
          ["Examination", "June Public Examination"], ["Year", "2026"], ["Result Date", "17 August 2026"]
        ].map(([label, value]) => <div key={label} className="border-b border-stone-100 pb-2"><div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</div><div className="mt-1 text-sm font-semibold text-stone-800">{value}</div></div>)}
      </div>
      
      <h2 className="mb-4 text-lg font-semibold text-[#4a131c]">Academic Performance</h2>
      
      <div className="overflow-x-auto border border-stone-300">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[#fdf5f6] text-[11px] uppercase tracking-wider text-stone-600 border-b-2 border-stone-300">
            <tr>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">S.No.</th>
              <th className="px-4 py-3.5 border-r border-stone-300">Subject / Assessment</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Max Marks</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Min Pass Marks</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Theory</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Practical / CA</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Total</th>
              <th className="px-4 py-3.5 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((row) => 
              <tr key={row.sNo} className="border-t border-stone-200">
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-500">{row.sNo}</td>
                <td className="px-4 py-3 border-r border-stone-200 font-semibold text-stone-800">{row.name}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-600">{row.max}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-600">{row.min}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-800">{row.th}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-800">{row.pr}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center font-bold text-[#4a131c]">{row.total}</td>
                <td className="px-4 py-3 text-center font-bold">{row.grade}</td>
              </tr>
            )}
            
            <tr className="border-t-2 border-stone-300 bg-[#fdf5f6]">
              <td colSpan={2} className="px-4 py-4 text-right font-bold text-stone-800 border-r border-stone-300">Grand Total</td>
              <td className="px-4 py-4 text-center font-bold text-stone-800 border-r border-stone-300">500</td>
              <td colSpan={3} className="border-r border-stone-300"></td>
              <td className="px-4 py-4 text-center font-bold text-xl text-[#8d1c2f] border-r border-stone-300">383</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-2 border-[#8d1c2f] bg-[#fdf5f6] p-6 rounded-lg">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Result Status</span>
          <strong className="block text-3xl text-[#4a131c]">PASS <span className="text-xl font-medium">(Qualified)</span></strong>
        </div>
        <div className="mt-6 md:mt-0 text-center">
          <div className="font-[cursive] text-4xl text-[#8d1c2f] mb-2 transform -rotate-2">Sumai</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-t border-stone-300 pt-1">Controller of Examination</div>
        </div>
      </div>
      
      <div className="mt-7 flex flex-col gap-5 border-t border-stone-200 pt-7 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center border border-stone-200 bg-stone-50"><QrCode className="h-11 w-11 text-[#4a131c]" /></div>
          <p className="max-w-xs text-xs leading-5 text-stone-500">Verification ID: TBSTE-R26-1842<br />Scan placeholder or use online verification.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Result</Button>
          <Button variant="secondary" onClick={() => navigate("verification")}><ShieldCheck className="h-4 w-4" /> Verify</Button>
          <Button onClick={download} disabled={downloading}>{downloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {downloading ? "Preparing..." : "Download Marksheet"}</Button>
        </div>
      </div>
      
      <div className="mt-7 border-t border-stone-200 pt-4 text-[11px] leading-5 text-stone-500 text-justify">
        <strong>Disclaimer:</strong> This is a digitally signed, computer generated Mark Sheet. All contents of this Mark Sheet can be verified for authenticity by the process of online verification through scanning the QR code printed above. The Board shall not be responsible for any direct or indirect financial losses, any loss of goodwill or reputation, or any other loss or damage caused by any incorrect / fraudulent information.
      </div>
    </div>
  </div></motion.div></main></>;
}`;

const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
const startIndex = pageContent.indexOf('function ResultDetailPage');
const endIndex = pageContent.indexOf('function VerificationPage');

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find ResultDetailPage component boundaries');
  process.exit(1);
}

const updatedContent = pageContent.substring(0, startIndex) + newComponent + '\n\n' + pageContent.substring(endIndex);
fs.writeFileSync('app/page.tsx', updatedContent);
console.log('Successfully updated ResultDetailPage marksheet layout!');
