const fs = require('fs');

async function testUploads() {
  console.log('Generating dummy files...');
  fs.writeFileSync('dummy_syllabus.pdf', 'Mock Syllabus Content');
  fs.writeFileSync('dummy_notes.pdf', 'Mock Notes Content');
  fs.writeFileSync('dummy_form.pdf', 'Mock Form Content');

  const uploadDoc = async (title, category, programme, filename) => {
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('category', category);
      form.append('programme', programme);
      
      const fileBlob = new Blob([fs.readFileSync(filename)]);
      form.append('file', fileBlob, filename);

      const res = await fetch('http://localhost:3000/api/documents', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      console.log("Uploaded " + title + ": " + res.status);
    } catch (e) {
      console.error('Error uploading', title, e.message);
    }
  };

  await uploadDoc('Senior Secondary Math Syllabus', 'Syllabus', 'BBA', 'dummy_syllabus.pdf'); // Using BBA since the screenshot showed BBA
  await uploadDoc('General Science Notes', 'Notes', 'BBA', 'dummy_notes.pdf');
  await uploadDoc('Global Scholarship Form', 'Forms', 'All Programmes', 'dummy_form.pdf');

  // Also add some exams
  console.log('Uploading exams...');
  try {
    await fetch('http://localhost:3000/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Mid-Term Mathematics',
        date: new Date(Date.now() + 86400000 * 10).toISOString(),
        description: 'Semester 1 Mathematics Mid-Term',
        programme: 'BBA',
        fileUrl: ''
      })
    });
    console.log('Uploaded Exam');
  } catch (e) {
    console.error('Error uploading exam', e.message);
  }

  // Cleanup
  fs.unlinkSync('dummy_syllabus.pdf');
  fs.unlinkSync('dummy_notes.pdf');
  fs.unlinkSync('dummy_form.pdf');
  console.log('Done!');
}

testUploads();
