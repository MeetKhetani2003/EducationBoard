const studentsData = [
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

async function createStudents() {
  for (let i = 0; i < studentsData.length; i++) {
    const student = studentsData[i];
    const enrollment = `ENR2026${String(i + 1).padStart(3, '0')}`;
    const payload = {
      enrollmentNumber: enrollment,
      name: student.name,
      fatherName: student.father,
      dob: student.dob,
      email: `${student.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `987654321${i}`,
      address: `123 Test St, City ${i}`,
      passwordHash: 'student123'
    };

    console.log(`Creating student ${enrollment}...`);
    try {
      const res = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`Success: ${enrollment}`);
      } else {
        console.error(`Failed ${enrollment}:`, data);
      }
    } catch (e) {
      console.error(`Error ${enrollment}:`, e.message);
    }
  }
}

createStudents();
