const data = {
  enrollmentNumber: "SAMPLE-12345",
  rollNumber: "SAMPLE-ROLL-01",
  studentName: "John Doe Sample",
  fatherName: "Richard Doe",
  dob: "2005-08-15",
  programme: "Senior Secondary",
  examination: "Public Examination",
  examYear: "2026",
  examCenter: "Delhi Public School Center",
  subjects: [
    {
      sNo: "1",
      name: "Mathematics",
      max: 100,
      min: 33,
      th: 75,
      pr: 20,
      ia: 0,
      total: 95,
      grade: "A+",
    },
    {
      sNo: "2",
      name: "Physics",
      max: 100,
      min: 33,
      th: 60,
      pr: 25,
      ia: 0,
      total: 85,
      grade: "A",
    },
  ],
  grandTotal: 180,
  percentage: 90.0,
  resultStatus: "PASS",
  printDate: new Date().toISOString(),
  forceUpdate: true,
};

fetch("http://localhost:3000/api/results", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((json) => {
    console.log("Result created:");
    console.log(json);
  })
  .catch((err) => {
    console.error("Error creating result:");
    console.error(err);
  });
