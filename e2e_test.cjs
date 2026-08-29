const fs = require('fs');
const path = require('path');

// ---- Step 1: Upload Excel via API ----
async function uploadExcel() {
  const filePath = path.join(__dirname, 'test_students_10.xlsx');
  const fileBuffer = fs.readFileSync(filePath);
  
  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  formData.append('file', blob, 'test_students_10.xlsx');
  
  console.log('\n=== STEP 1: EXCEL UPLOAD ===');
  const res = await fetch('http://localhost:3000/api/results', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  return data;
}

// ---- Step 2: Verify students were created ----
async function verifyStudents() {
  console.log('\n=== STEP 2: VERIFY STUDENTS CREATED ===');
  const res = await fetch('http://localhost:3000/api/students');
  const data = await res.json();
  console.log('Total students found:', Array.isArray(data) ? data.length : data.total || 'unknown');
  if (Array.isArray(data) && data.length > 0) {
    console.log('First 3 students:');
    data.slice(0, 3).forEach(s => {
      console.log(`  - ${s.name || s.studentName} (${s.enrollmentNumber}) programmes: ${JSON.stringify(s.programmes)}`);
    });
  } else if (data.students) {
    console.log('First 3 students:');
    data.students.slice(0, 3).forEach(s => {
      console.log(`  - ${s.name || s.studentName} (${s.enrollmentNumber}) programmes: ${JSON.stringify(s.programmes)}`);
    });
  }
  return data;
}

// ---- Step 3: Verify results were created ----
async function verifyResults() {
  console.log('\n=== STEP 3: VERIFY RESULTS CREATED ===');
  const res = await fetch('http://localhost:3000/api/results');
  const data = await res.json();
  const results = data.results || data;
  console.log('Total results found:', Array.isArray(results) ? results.length : data.total || 'unknown');
  if (Array.isArray(results) && results.length > 0) {
    console.log('First 3 results:');
    results.slice(0, 3).forEach(r => {
      console.log(`  - ${r.studentName} (${r.enrollmentNumber}) | Programme: ${r.programme} | Total: ${r.grandTotal} | Status: ${r.resultStatus} | Subjects: ${r.subjects?.length || 0}`);
    });
    // Store first student for portal test
    return results[0];
  }
  return null;
}

// ---- Step 4: Manual result creation via JSON POST ----
async function manualResultCreation() {
  console.log('\n=== STEP 4: MANUAL RESULT CREATION ===');
  const manualResult = {
    enrollmentNumber: 'MANUAL001',
    rollNumber: 'RMANUAL001',
    studentName: 'Manual Test Student',
    fatherName: 'Manual Father',
    dob: '2005-06-15',
    programme: 'BBA',
    examination: 'Semester 2',
    examYear: '2026',
    subjects: [
      { sNo: '1', name: 'Business Studies', max: 100, min: 33, th: 75, pr: 0, ia: 0, total: 75, grade: 'B+' },
      { sNo: '2', name: 'Accounting', max: 100, min: 33, th: 82, pr: 0, ia: 0, total: 82, grade: 'A' },
      { sNo: '3', name: 'Economics', max: 100, min: 33, th: 68, pr: 0, ia: 0, total: 68, grade: 'B' }
    ],
    grandTotal: 225,
    percentage: 75,
    resultStatus: 'PASS'
  };

  const res = await fetch('http://localhost:3000/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manualResult)
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  return data;
}

// ---- Step 5: Student portal lookup (simulating student login) ----
async function testStudentPortalLookup(enrollment, dob) {
  console.log('\n=== STEP 5: STUDENT PORTAL RESULT LOOKUP ===');
  console.log(`Looking up enrollment=${enrollment} dob=${dob}`);
  const res = await fetch(`http://localhost:3000/api/results?enrollment=${encodeURIComponent(enrollment)}&dob=${encodeURIComponent(dob)}`);
  const data = await res.json();
  console.log('Status:', res.status);
  if (res.status === 200) {
    console.log(`Found: ${data.studentName} | Programme: ${data.programme} | Total: ${data.grandTotal} | Status: ${data.resultStatus}`);
    console.log(`Subjects (${data.subjects?.length}):`);
    data.subjects?.forEach(s => {
      console.log(`  ${s.name}: TH=${s.th} PR=${s.pr} Total=${s.total} Grade=${s.grade}`);
    });
  } else {
    console.log('Error:', data.error);
  }
  return data;
}

// ---- Step 6: Verify manual student was also created in students collection ----
async function verifyManualStudent() {
  console.log('\n=== STEP 6: VERIFY MANUAL STUDENT IN STUDENTS DB ===');
  const res = await fetch('http://localhost:3000/api/students');
  const data = await res.json();
  const students = Array.isArray(data) ? data : (data.students || []);
  const manualStudent = students.find(s => s.enrollmentNumber === 'MANUAL001');
  if (manualStudent) {
    console.log(`Found manual student: ${manualStudent.name} (${manualStudent.enrollmentNumber}) programmes: ${JSON.stringify(manualStudent.programmes)}`);
  } else {
    console.log('Manual student NOT found in students collection!');
  }
  return manualStudent;
}

// ---- Run all tests ----
async function runAllTests() {
  console.log('============================================');
  console.log('  FULL FLOW E2E TEST SUITE');
  console.log('============================================');
  
  try {
    // Step 1: Upload Excel
    const uploadResult = await uploadExcel();
    
    // Step 2: Verify students
    const students = await verifyStudents();
    
    // Step 3: Verify results
    const firstResult = await verifyResults();
    
    // Step 4: Manual result creation
    await manualResultCreation();
    
    // Step 5: Student portal lookup - test with first Excel student
    if (firstResult) {
      const dob = firstResult.dob ? new Date(firstResult.dob).toISOString().split('T')[0] : '2005-01-15';
      await testStudentPortalLookup(firstResult.enrollmentNumber, dob);
    }
    
    // Step 5b: Student portal lookup for manual student
    await testStudentPortalLookup('MANUAL001', '2005-06-15');
    
    // Step 6: Verify manual student exists
    await verifyManualStudent();
    
    // Final summary
    console.log('\n============================================');
    console.log('  TEST SUMMARY');
    console.log('============================================');
    const studentsRes = await fetch('http://localhost:3000/api/students');
    const studentsData = await studentsRes.json();
    const studentCount = Array.isArray(studentsData) ? studentsData.length : (studentsData.students?.length || studentsData.total || 0);
    
    const resultsRes = await fetch('http://localhost:3000/api/results');
    const resultsData = await resultsRes.json();
    const resultCount = resultsData.total || (Array.isArray(resultsData.results) ? resultsData.results.length : 0);
    
    console.log(`Total Students in DB: ${studentCount}`);
    console.log(`Total Results in DB:  ${resultCount}`);
    console.log('============================================');
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runAllTests();
