const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add state for searchQuery and showDropdown
c = c.replace(
  /const \[selectedExistingId, setSelectedExistingId\] = useState\(""\);/g,
  `const [selectedExistingId, setSelectedExistingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);`
);

// 2. Replace the select dropdown with searchable select HTML
const oldSelect = `<div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Select Existing Student *</label>
                  <select required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c] font-sans" value={selectedExistingId} onChange={e => setSelectedExistingId(e.target.value)}>
                    <option value="">-- Choose a Student --</option>
                    {allSystemStudents.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.enrollmentNumber})</option>
                    ))}
                  </select>
                </div>`;

const newSearchableSelect = `<div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Select Existing Student *</label>
                  <input 
                    type="text" 
                    placeholder="Search by name or enrollment number..." 
                    className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); if(e.target.value === '') setSelectedExistingId(''); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-stone-200 rounded shadow-xl max-h-56 overflow-y-auto z-[150]">
                      {allSystemStudents.filter(s => (s.name + ' ' + s.enrollmentNumber).toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? 
                        allSystemStudents.filter(s => (s.name + ' ' + s.enrollmentNumber).toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                          <div 
                            key={s._id} 
                            onClick={() => { setSelectedExistingId(s._id); setSearchQuery(s.name + ' (' + s.enrollmentNumber + ')'); setShowDropdown(false); }}
                            className={\`p-2.5 text-xs cursor-pointer hover:bg-stone-50 border-b border-stone-100 last:border-0 \${selectedExistingId === s._id ? 'bg-stone-100 font-bold' : ''}\`}
                          >
                            <span className="font-semibold text-stone-900">{s.name}</span> <span className="text-stone-500">({s.enrollmentNumber})</span>
                          </div>
                        ))
                       : (
                        <div className="p-3 text-xs text-stone-500 italic text-center">No matching students found</div>
                       )}
                    </div>
                  )}
                  {/* Backdrop to close dropdown */}
                  {showDropdown && <div className="fixed inset-0 z-[140]" onClick={() => setShowDropdown(false)}></div>}
                </div>`;

c = c.replace(oldSelect, newSearchableSelect);

fs.writeFileSync('app/page.tsx', c);
console.log('Searchable select updated!');
