const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const search = `          {activeTab === "My Results" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">All Academic Results</h2>
              </div>
              <div className="p-6 space-y-6">
                {results.length === 0 ? (
                  <p className="text-stone-500 text-center">No results available.</p>
                ) : (
                  results.map((res: any, idx: number) => (
                    <div key={idx} className="border border-stone-200 rounded-lg overflow-hidden">
                      <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-[#8d1c2f] text-lg">{res.examination} {res.examYear}</h3>
                          <p className="text-xs text-stone-500">{res.programme}</p>
                        </div>
                        <div className="text-right">
                          <span className={\`px-3 py-1 rounded text-xs font-bold uppercase \${res.resultStatus === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`}>{res.resultStatus}</span>
                        </div>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200">
                            <tr>
                              <th className="pb-2 pr-4 font-semibold">Subject</th>
                              <th className="pb-2 px-4 font-semibold text-center">Max Marks</th>
                              <th className="pb-2 px-4 font-semibold text-center">Min Marks</th>
                              <th className="pb-2 pl-4 font-semibold text-right">Obtained</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                              <tr key={sIdx}>
                                <td className="py-2 pr-4 text-stone-800 font-medium">{sub.name}</td>
                                <td className="py-2 px-4 text-center text-stone-500">{sub.max}</td>
                                <td className="py-2 px-4 text-center text-stone-500">{sub.min}</td>
                                <td className="py-2 pl-4 text-right font-bold text-[#8d1c2f]">{sub.total}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t border-stone-200 font-bold bg-stone-50/50">
                            <tr>
                              <td className="py-2 pr-4">GRAND TOTAL</td>
                              <td colSpan={2}></td>
                              <td className="py-2 pl-4 text-right text-lg text-[#8d1c2f]">{res.grandTotal}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}`;

const replacement = `          {activeTab === "My Results" && (
            <div className="space-y-8">
              <div className="flex justify-end no-print">
                <Button onClick={() => window.print()} className="bg-[#8d1c2f] text-white hover:bg-[#6b1422] flex items-center gap-2">
                  <Printer className="h-4 w-4" /> Download / Print Marksheet
                </Button>
              </div>

              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
                  No results available.
                </div>
              ) : (
                results.map((res: any, idx: number) => (
                  <div key={idx} className="relative bg-white border-2 border-[#8d1c2f] shadow-lg mx-auto max-w-4xl p-8 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <img src={images.logo} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
                    </div>
                    
                    {/* Official Header */}
                    <div className="relative flex flex-col items-center justify-center text-center border-b-4 border-[#8d1c2f] pb-6 mb-6">
                      <div className="flex items-center gap-6 mb-2">
                        <img src={images.logo} alt="Logo" className="h-24 w-24 object-contain" />
                        <div>
                          <h1 className="text-2xl md:text-3xl font-extrabold text-[#440d16] uppercase tracking-wider">Thar Board of School & Technical Education</h1>
                          <p className="text-[#8d1c2f] font-bold text-sm tracking-widest uppercase mt-1">Examination & Certification Authority</p>
                        </div>
                      </div>
                      <h2 className="mt-4 inline-block bg-[#440d16] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-md">
                        Official Statement of Marks
                      </h2>
                    </div>

                    {/* Student Details */}
                    <div className="relative grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Student Name:</span>
                        <span className="w-2/3 font-bold text-stone-900 uppercase">{studentDetails?.name || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Enrollment No:</span>
                        <span className="w-2/3 font-bold text-[#8d1c2f]">{res.enrollmentNumber}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Father's Name:</span>
                        <span className="w-2/3 font-semibold text-stone-900 uppercase">{studentDetails?.fatherName || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Date of Birth:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{studentDetails?.dob ? new Date(studentDetails.dob).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Examination:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.examination} {res.examYear}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Programme:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.programme}</span>
                      </div>
                    </div>

                    {/* Marks Table */}
                    <div className="relative mb-12">
                      <table className="w-full text-left border-collapse border border-stone-300">
                        <thead>
                          <tr className="bg-[#440d16] text-white">
                            <th className="p-3 border border-stone-300 font-bold w-1/2">Subject</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Max Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Min Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Marks Obtained</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                            <tr key={sIdx} className="odd:bg-stone-50">
                              <td className="p-3 border border-stone-300 font-semibold text-stone-800">{sub.name}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.max}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.min}</td>
                              <td className="p-3 border border-stone-300 text-center font-bold text-stone-900">{sub.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#faebee] border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] uppercase text-right pr-6" colSpan={3}>Grand Total</td>
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] text-center text-xl">{res.grandTotal}</td>
                          </tr>
                          <tr className="border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={3}>Result Status</td>
                            <td className={\`p-3 border border-stone-300 font-extrabold text-center text-lg uppercase tracking-wider \${res.resultStatus === 'PASS' ? 'text-green-700' : 'text-red-700'}\`}>
                              {res.resultStatus}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="relative mt-16 pt-8 flex justify-between items-end">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-stone-500 mb-1">Date of Issue</div>
                        <div className="font-bold text-stone-800">{new Date().toLocaleDateString('en-GB')}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="h-16 w-48 border-b-2 border-stone-400 mb-2 flex items-end justify-center pb-2">
                          {/* Placeholder for Signature Image */}
                          <span className="italic text-stone-300 text-sm">Valid Authorized Signature</span>
                        </div>
                        <div className="font-bold text-[#440d16] uppercase text-sm">Controller of Examinations</div>
                        <div className="text-xs text-stone-500 font-medium">Thar Board of School & Technical Education</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}`;

if (content.includes('All Academic Results')) {
  content = content.replace(search, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated My Results tab with new Marksheet UI.');
} else {
  console.log('Error: Could not find the My Results block to replace.');
}
