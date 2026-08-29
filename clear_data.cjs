const mongoose = require('mongoose');
const mongoUri = "mongodb://localhost:27017/tbste"; // Let's check db connection URL in .env.local

const fs = require('fs');
let envFile = fs.readFileSync('.env.local', 'utf8');
let match = envFile.match(/MONGODB_URI=(.+)/);
const uri = match ? match[1].trim() : mongoUri;

console.log("Connecting to", uri);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB!");
    // Clear students and results collections
    await mongoose.connection.db.collection('students').deleteMany({});
    await mongoose.connection.db.collection('results').deleteMany({});
    console.log("Successfully cleared all students and results records from the database!");
    process.exit(0);
  })
  .catch(e => {
    console.error("Connection failed", e);
    process.exit(1);
  });
