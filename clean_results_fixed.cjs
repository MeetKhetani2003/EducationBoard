const mongoose = require("mongoose");
const uri = "mongodb://codevibe2003_db_user:uOen7CiFtNmv5qIa@ac-ouysurt-shard-00-00.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-01.3soisin.mongodb.net:27017,ac-ouysurt-shard-00-02.3soisin.mongodb.net:27017/?ssl=true&replicaSet=atlas-tspvzs-shard-0&authSource=admin&appName=Cluster0";

async function cleanResults() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const resultSchema = new mongoose.Schema({}, { strict: false });
  const ResultModel = mongoose.models.Result || mongoose.model("Result", resultSchema, "results");

  const results = await ResultModel.find({});
  let updatedCount = 0;

  for (const doc of results) {
    if (doc.subjects && Array.isArray(doc.subjects)) {
      const originalLen = doc.subjects.length;
      const filtered = doc.subjects.filter(s => {
        const th = Number(s.th) || 0;
        const pr = Number(s.pr) || 0;
        const ia = Number(s.ia) || 0;
        const total = Number(s.total) || (th + pr);
        
        // Remove "Exam Center" pseudo-subject and any other 0 mark subjects
        if (s.name === "Exam Center" || (total === 0 && th === 0 && pr === 0 && ia === 0)) {
          return false;
        }
        return true;
      });

      if (filtered.length !== originalLen) {
        // Fix sNo
        filtered.forEach((s, idx) => {
          s.sNo = String(idx + 1);
        });

        await ResultModel.updateOne(
          { _id: doc._id },
          { $set: { subjects: filtered, grandTotal: filtered.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) } }
        );
        updatedCount++;
      }
    }
  }

  console.log(`Cleaned up ${updatedCount} results.`);
  mongoose.disconnect();
}

cleanResults().catch(console.error);
