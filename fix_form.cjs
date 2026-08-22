const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(/const \[roll, setRoll\] = useState\(""\);/, 'const [enrollment, setEnrollment] = useState(""); const [dob, setDob] = useState("");');
c = c.replace(/roll\.trim/g, 'enrollment.trim');
c = c.replace(/roll\.toLowerCase/g, 'enrollment.toLowerCase');
c = c.replace(/roll number/g, 'enrollment number');

c = c.replace(
  /<Field label="Roll Number" required placeholder="e\.g\. NAB2601842" value=\{roll\} onChange=\{setRoll\} \/><Field label="Registration Number" placeholder="Registration number" \/>\{\!compact && <Field label="Date of Birth" type="date" \/>\}/,
  '<Field label="Enrollment Number" required placeholder="e.g. NAB2601842" value={enrollment} onChange={setEnrollment} /><Field label="Date of Birth" type="date" value={dob} onChange={setDob} required />'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Fixed ResultSearch fields');
