const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Update updateSubject function
c = c.replace(
  /if \(field === 'th' \|\| field === 'pr'\) \{\s*updated\[index\]\.total = Number\(updated\[index\]\.th \|\| 0\) \+ Number\(updated\[index\]\.pr \|\| 0\);\s*\}/g,
  `if (['th', 'pr', 'ia'].includes(field)) { updated[index].total = Number(updated[index].th || 0) + Number(updated[index].pr || 0) + Number(updated[index].ia || 0); }`
);

// 2. Add Internal Marks Column Header in AdminAddResult
c = c.replace(
  /<th className="px-4 py-2 w-20">Practical Marks<\/th>/g,
  `<th className="px-4 py-2 w-20">Practical Marks</th>\n                <th className="px-4 py-2 w-20">Internal Marks</th>`
);

// 3. Add Internal Marks input in AdminAddResult
c = c.replace(
  /<input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-\[#a1283c\] outline-none" value=\{sub\.pr\} onChange=\{e => updateSubject\(idx, "pr", Number\(e\.target\.value\)\)\} \/>\s*<\/td>/g,
  `<input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.pr} onChange={e => updateSubject(idx, "pr", Number(e.target.value))} />\n                  </td>\n                  <td className="px-4 py-2">\n                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.ia} onChange={e => updateSubject(idx, "ia", Number(e.target.value))} />\n                  </td>`
);

// Now for the Marksheet table in SystemResultView / renderPublicPage:
// Let's replace the Marksheet Headers
c = c.replace(
  /<th className="p-3 border border-stone-300 font-bold w-1\/2">Subject<\/th>\s*<th className="p-3 border border-stone-300 font-bold text-center w-1\/6">Max Marks<\/th>\s*<th className="p-3 border border-stone-300 font-bold text-center w-1\/6">Min Marks<\/th>\s*<th className="p-3 border border-stone-300 font-bold text-center w-1\/6">Marks Obtained<\/th>/g,
  `<th className="p-3 border border-stone-300 font-bold text-left w-1/3">Subject</th>
<th className="p-3 border border-stone-300 font-bold text-center">Max</th>
<th className="p-3 border border-stone-300 font-bold text-center">Min</th>
<th className="p-3 border border-stone-300 font-bold text-center">Theory</th>
<th className="p-3 border border-stone-300 font-bold text-center">Practical</th>
<th className="p-3 border border-stone-300 font-bold text-center">Internal</th>
<th className="p-3 border border-stone-300 font-bold text-center">Total</th>`
);

// Let's replace the Marksheet Subject Row cells
c = c.replace(
  /<td className="p-3 border border-stone-300 font-semibold text-stone-800">\{sub\.name\}<\/td>\s*<td className="p-3 border border-stone-300 text-center text-stone-600">\{sub\.max\}<\/td>\s*<td className="p-3 border border-stone-300 text-center text-stone-600">\{sub\.min\}<\/td>\s*<td className="p-3 border border-stone-300 text-center font-bold text-stone-900">\{sub\.total\}<\/td>/g,
  `<td className="p-3 border border-stone-300 font-semibold text-stone-800">{sub.name}</td>
<td className="p-3 border border-stone-300 text-center text-stone-600">{sub.max}</td>
<td className="p-3 border border-stone-300 text-center text-stone-600">{sub.min}</td>
<td className="p-3 border border-stone-300 text-center text-stone-600">{sub.th || "-"}</td>
<td className="p-3 border border-stone-300 text-center text-stone-600">{sub.pr || "-"}</td>
<td className="p-3 border border-stone-300 text-center text-stone-600">{sub.ia || "-"}</td>
<td className="p-3 border border-stone-300 text-center font-bold text-stone-900">{sub.total}</td>`
);

// Grand total colspan update from 3 to 6
c = c.replace(
  /<td className="p-3 border border-stone-300 font-bold text-\[#8d1c2f\] uppercase text-right pr-6" colSpan=\{3\}>Grand Total<\/td>/g,
  `<td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] uppercase text-right pr-6" colSpan={6}>Grand Total</td>`
);

// Add Percentage and Grade rows to the footer
c = c.replace(
  /<tr className="border border-stone-300">\s*<td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan=\{3\}>Result Status<\/td>/g,
  `
                          <tr className="border border-stone-300 bg-stone-50">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={6}>Percentage</td>
                            <td className="p-3 border border-stone-300 font-bold text-center text-lg">{res.percentage}%</td>
                          </tr>
                          <tr className="border border-stone-300 bg-stone-50">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={6}>Grade</td>
                            <td className="p-3 border border-stone-300 font-bold text-center text-lg text-[#8d1c2f]">
                              {res.percentage >= 90 ? 'A+' : res.percentage >= 80 ? 'A' : res.percentage >= 70 ? 'B+' : res.percentage >= 60 ? 'B' : res.percentage >= 50 ? 'C' : res.percentage >= 33 ? 'D' : 'E'}
                            </td>
                          </tr>
                          <tr className="border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={6}>Result Status</td>`
);


fs.writeFileSync('app/page.tsx', c);
console.log('Marksheet successfully updated!');
