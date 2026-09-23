// inspect_sanjna.cjs - Print SANJNA's full result data from DB
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://codevibe2003_db_user:uOen7CiFtNmv5qIa@ac-ouysurt-shard-00-00.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-01.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-02.3soisin.mongodb.net:27017/?ssl=true&replicaSet=atlas-tspvzs-shard-0&authSource=admin&appName=Cluster0';

async function inspect() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('results').findOne({ enrollmentNumber: '206001' });
    if (!result) { console.log('NOT FOUND'); return; }
    console.log('Student:', result.studentName);
    console.log('Enrollment:', result.enrollmentNumber);
    console.log('ResultStatus:', result.resultStatus);
    console.log('GrandTotal:', result.grandTotal);
    console.log('Percentage:', result.percentage);
    console.log('\nSubjects:');
    (result.subjects || []).forEach((s, i) => {
      const total = s.total ?? ((s.th||0)+(s.pr||0)+(s.ia||0));
      const pass = total >= (s.min || 33);
      console.log(`  ${i+1}. ${s.name}`);
      console.log(`     TH=${s.th}  PR=${s.pr}  IA=${s.ia}  Total=${total}  Min=${s.min||33}  Max=${s.max||100}  Grade=${s.grade}  → ${pass ? 'PASS' : 'FAIL ❌'}`);
    });
  } finally {
    await client.close();
  }
}
inspect();
