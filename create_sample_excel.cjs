const xlsx = require('xlsx');

// Define sample data with all required columns
const data = [
  {
    "Enrollment Number": "EXCEL-001",
    "Roll Number": "ROLL-EX-001",
    "Student Name": "Alice Excel",
    "Father Name": "Bob Excel",
    "DOB": "2006-03-12",
    "Programme": "Secondary",
    "Examination": "June Public Examination",
    "Exam Year": "2026",
    "Exam Center": "Global Excel Academy",
    "Mathematics_TH": 80,
    "Mathematics_PR": 15,
    "Science_TH": 70,
    "Science_PR": 20,
    "English_TH": 85,
    "Grand Total": 270,
    "Percentage": 90,
    "Result Status": "PASS"
  },
  {
    "Enrollment Number": "EXCEL-002",
    "Roll Number": "ROLL-EX-002",
    "Student Name": "Charlie Sheets",
    "Father Name": "David Sheets",
    "DOB": "2005-11-25",
    "Programme": "Senior Secondary",
    "Examination": "June Public Examination",
    "Exam Year": "2026",
    "Exam Center": "Global Excel Academy",
    "Physics_TH": 60,
    "Physics_PR": 25,
    "Chemistry_TH": 55,
    "Chemistry_PR": 28,
    "Computer_TH": 75,
    "Grand Total": 243,
    "Percentage": 81,
    "Result Status": "PASS"
  }
];

// Create a new workbook and add the data
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);

// Add the worksheet to the workbook
xlsx.utils.book_append_sheet(wb, ws, "Results");

// Write to file
xlsx.writeFile(wb, "sample_results_v2.xlsx");

console.log("sample_results.xlsx created successfully.");
