require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const Result = require("./models/Result.ts"); // Wait, models/Result.ts might need compiling. I can just use raw mongodb driver or mongoose.

async function cleanResults() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // We don't have to load the model if it's TS, we can just use mongoose directly
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
          { $set: { subjects: filtered } }
        );
        updatedCount++;
      }
    }
  }

  console.log(`Cleaned up ${updatedCount} results.`);
  mongoose.disconnect();
}

cleanResults().catch(console.error);
