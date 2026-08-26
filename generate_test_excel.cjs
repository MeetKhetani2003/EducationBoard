const xlsx = require('xlsx');
const fs = require('fs');

const students = [
  { name: 'John Doe', father: 'Michael Doe', dob: '2005-01-15' },
  { name: 'Jane Smith', father: 'Robert Smith', dob: '2005-03-22' },
  { name: 'Alice Johnson', father: 'William Johnson', dob: '2005-07-10' },
  { name: 'Bob Brown', father: 'David Brown', dob: '2004-11-05' },
  { name: 'Charlie Davis', father: 'Richard Davis', dob: '2005-02-18' },
  { name: 'Eve Wilson', father: 'Charles Wilson', dob: '2005-09-30' },
  { name: 'Frank Miller', father: 'Thomas Miller', dob: '2004-12-12' },
  { name: 'Grace Taylor', father: 'Christopher Taylor', dob: '2005-05-25' },
  { name: 'Henry Anderson', father: 'Daniel Anderson', dob: '2005-08-08' },
  { name: 'Ivy Thomas', father: 'Paul Thomas', dob: '2005-04-14' }
];

const data = students.map((student, i) => {
  const enrollment = `ENR2026${String(i + 1).padStart(3, '0')}`;
  return {
    'Enrollment No': enrollment,
    'Roll No': `R${enrollment}`,
    'Student Name': student.name,
    'Father Name': student.father,
    'DOB': student.dob,
    'Programme': 'BBA',
    'Exam': 'Semester 1',
    'Year': '2026',
    'Math_TH': Math.floor(Math.random() * 60) + 40, // 40-100
    'Math_PR': Math.floor(Math.random() * 20) + 30, // 30-50
    'Physics_TH': Math.floor(Math.random() * 60) + 40,
    'Physics_PR': Math.floor(Math.random() * 20) + 30,
    'Chemistry_TH': Math.floor(Math.random() * 60) + 40,
    'Chemistry_PR': Math.floor(Math.random() * 20) + 30,
    'English_TH': Math.floor(Math.random() * 60) + 40,
    'English_PR': 0
  };
});

// Calculate Totals and Status
data.forEach(row => {
  const total = row.Math_TH + row.Math_PR + row.Physics_TH + row.Physics_PR + row.Chemistry_TH + row.Chemistry_PR + row.English_TH + row.English_PR;
  row['Total'] = total;
  row['Percentage'] = ((total / 450) * 100).toFixed(2);
  row['Status'] = row['Percentage'] >= 40 ? 'PASS' : 'FAIL';
});

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, "Students");
xlsx.writeFile(wb, 'test_students_10.xlsx');
console.log('Successfully created test_students_10.xlsx');
