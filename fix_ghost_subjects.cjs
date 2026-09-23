// fix_ghost_subjects.cjs
// Removes ghost/empty __EMPTY subjects from all results and recomputes pass/fail correctly.

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://codevibe2003_db_user:uOen7CiFtNmv5qIa@ac-ouysurt-shard-00-00.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-01.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-02.3soisin.mongodb.net:27017/?ssl=true&replicaSet=atlas-tspvzs-shard-0&authSource=admin&appName=Cluster0';

async function fixGhostSubjects() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const results = db.collection('results');
    const allResults = await results.find({}).toArray();
    console.log(`📊 Checking ${allResults.length} results for ghost subjects...\n`);

    let fixed = 0;

    for (const result of allResults) {
      const originalSubjects = result.subjects || [];

      // Remove ghost subjects (__EMPTY columns from Excel)
      const cleanSubjects = originalSubjects.filter(s => {
        const name = (s.name || '').trim();
        return name && !name.startsWith('__EMPTY') && name !== '__EMPTY';
      });

      // Also remove subjects with all-zero marks and no name value
      const validSubjects = cleanSubjects.filter(s => {
        const total = s.total ?? ((s.th || 0) + (s.pr || 0) + (s.ia || 0));
        return total > 0 || (s.name && s.name.trim().length > 0 && !s.name.startsWith('__'));
      });

      const removedCount = originalSubjects.length - validSubjects.length;

      if (removedCount > 0) {
        // Recompute totals and pass/fail with clean subjects
        const grandTotal = validSubjects.reduce((sum, s) => sum + (s.total || 0), 0);
        const totalMaxMarks = validSubjects.reduce((sum, s) => sum + (s.max || 100), 0);
        const percentage = totalMaxMarks > 0 ? Math.round((grandTotal / totalMaxMarks) * 10000) / 100 : 0;
        const allPass = validSubjects.every(s => (s.total ?? ((s.th||0)+(s.pr||0)+(s.ia||0))) >= (s.min || 33));
        const resultStatus = allPass ? 'PASS' : 'FAIL';

        await results.updateOne(
          { _id: result._id },
          { $set: { subjects: validSubjects, grandTotal, percentage, resultStatus } }
        );

        console.log(`🔧 FIXED: ${result.studentName} (${result.enrollmentNumber})`);
        console.log(`   Removed ${removedCount} ghost subjects`);
        console.log(`   Was: ${result.resultStatus} → Now: ${resultStatus}`);
        console.log(`   Grand Total: ${grandTotal}/${totalMaxMarks} (${percentage}%)`);
        console.log(`   Valid subjects: ${validSubjects.map(s => s.name).join(', ')}\n`);
        fixed++;
      } else {
        console.log(`✓  ${result.studentName} (${result.enrollmentNumber}): No ghost subjects`);
      }
    }

    console.log('\n===== DONE =====');
    console.log(`🔧 Fixed: ${fixed} records`);
    console.log(`✓  Clean: ${allResults.length - fixed} records`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

fixGhostSubjects();
