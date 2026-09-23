// fix_result_status.cjs
// Fixes all existing results in MongoDB where pass/fail was calculated incorrectly.
// A student PASSES only if ALL subjects individually meet their minimum pass marks.

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://codevibe2003_db_user:uOen7CiFtNmv5qIa@ac-ouysurt-shard-00-00.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-01.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-02.3soisin.mongodb.net:27017/?ssl=true&replicaSet=atlas-tspvzs-shard-0&authSource=admin&appName=Cluster0';

async function fixResultStatuses() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const results = db.collection('results');
    
    const allResults = await results.find({}).toArray();
    console.log(`📊 Found ${allResults.length} results to check`);
    
    let fixed = 0;
    let alreadyCorrect = 0;
    
    for (const result of allResults) {
      const subjects = result.subjects || [];
      
      if (subjects.length === 0) {
        console.log(`  ⚠️  ${result.studentName} (${result.enrollmentNumber}): No subjects found, skipping`);
        continue;
      }
      
      // Check each subject individually against its minimum marks
      const subjectDetails = subjects.map(s => {
        const obtained = s.total ?? ((s.th || 0) + (s.pr || 0) + (s.ia || 0));
        const minMarks = s.min || 33;
        const passed = obtained >= minMarks;
        return { name: s.name, obtained, minMarks, passed };
      });
      
      const allSubjectsPassed = subjectDetails.every(s => s.passed);
      const correctStatus = allSubjectsPassed ? 'PASS' : 'FAIL';
      
      // Recalculate grand total and percentage
      const grandTotal = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
      const totalMaxMarks = subjects.reduce((sum, s) => sum + (s.max || 100), 0);
      const percentage = totalMaxMarks > 0 ? Math.round((grandTotal / totalMaxMarks) * 10000) / 100 : result.percentage;
      
      if (result.resultStatus !== correctStatus || result.grandTotal !== grandTotal) {
        await results.updateOne(
          { _id: result._id },
          { $set: { resultStatus: correctStatus, grandTotal, percentage } }
        );
        
        const failedSubjects = subjectDetails.filter(s => !s.passed);
        console.log(`  🔧 FIXED: ${result.studentName} (${result.enrollmentNumber})`);
        console.log(`     Was: ${result.resultStatus} → Now: ${correctStatus}`);
        console.log(`     Grand Total: ${grandTotal}/${totalMaxMarks} (${percentage}%)`);
        if (failedSubjects.length > 0) {
          console.log(`     Failed subjects: ${failedSubjects.map(s => `${s.name} (${s.obtained}/${s.minMarks})`).join(', ')}`);
        }
        fixed++;
      } else {
        console.log(`  ✓  ${result.studentName} (${result.enrollmentNumber}): ${correctStatus} ← already correct`);
        alreadyCorrect++;
      }
    }
    
    console.log('\n===== DONE =====');
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`✓  Already correct: ${alreadyCorrect}`);
    console.log(`📊 Total processed: ${allResults.length}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

fixResultStatuses();
