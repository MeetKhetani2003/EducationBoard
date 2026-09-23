const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({}, { strict: false });
const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

async function recompute() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const allResults = await Result.find({});
  let fixed = 0;
  for (const res of allResults) {
    let subjects = res.subjects || [];
    
    // Filter out ghost subjects
    subjects = subjects.filter(s => s.name && !String(s.name).startsWith('__EMPTY'));
    if (subjects.length === 0) continue;
    
    // Evaluate if all subjects pass
    const allPass = subjects.every(s => {
      const total = s.total ?? (Number(s.th || 0) + Number(s.pr || 0) + Number(s.ia || 0));
      return total >= (Number(s.min) || 33);
    });
    
    const correctStatus = allPass ? 'PASS' : 'FAIL';
    
    // Evaluate totals
    const totalMaxMarks = subjects.reduce((sum, s) => sum + (Number(s.max) || 100), 0);
    const grandTotal = subjects.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    const correctPercentage = totalMaxMarks > 0 ? Math.round((grandTotal / totalMaxMarks) * 10000) / 100 : res.percentage;
    
    let needsUpdate = false;
    if (res.resultStatus !== correctStatus) { res.resultStatus = correctStatus; needsUpdate = true; }
    if (res.grandTotal !== grandTotal) { res.grandTotal = grandTotal; needsUpdate = true; }
    if (res.percentage !== correctPercentage) { res.percentage = correctPercentage; needsUpdate = true; }
    if (res.subjects.length !== subjects.length) { needsUpdate = true; }
    
    if (needsUpdate) {
      await Result.updateOne({ _id: res._id }, { $set: { subjects, resultStatus: res.resultStatus, grandTotal: res.grandTotal, percentage: res.percentage } });
      fixed++;
      console.log(`Fixed ${res.enrollmentNumber} -> ${correctStatus} | ${grandTotal} (${correctPercentage}%)`);
    }
  }
  
  console.log(`Recomputed ${allResults.length} results. Fixed ${fixed} incorrect records.`);
  process.exit(0);
}

recompute().catch(console.error);
