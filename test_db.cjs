const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/education-board');
  const student = await mongoose.connection.collection('students').findOne({ enrollmentNumber: '100107' });
  console.log('Student:', student);
  const results = await mongoose.connection.collection('results').find({ enrollmentNumber: '100107' }).toArray();
  console.log('Results:', results);
  process.exit(0);
}

run().catch(console.error);
