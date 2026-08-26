const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  const fileBuffer = fs.readFileSync('test_students_10.xlsx');
  const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  formData.append('file', blob, 'test_students_10.xlsx');

  console.log("Uploading Excel file to API...");
  try {
    const res = await fetch('http://localhost:3000/api/results', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.dir(data, { depth: null });
  } catch(e) {
    console.error("Upload failed:", e);
  }
}

testUpload();
