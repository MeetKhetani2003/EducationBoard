const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

// Replace Board Names
c = c.replace(/NATIONAL ACADEMIC BOARD/g, 'THAR BOARD OF SCHOOL AND TECHNICAL EDUCATION');
c = c.replace(/National Academic Board/g, 'Thar Board of School and Technical Education');

// Replace NAB with TBSTE
c = c.replace(/NAB26/g, 'TBSTE26');
c = c.replace(/help@nab\.demo/g, 'help@tbste.edu');

// Update Senior Secondary description
c = c.replace(
  'title: "Senior Secondary Education", eligibility: "Secondary pass", duration: "2 academic years", image: images.campus, text: "Flexible academic streams designed for higher education and career readiness."',
  'title: "Senior Secondary (Arts, Science & Commerce)", eligibility: "Secondary pass", duration: "2 academic years", image: images.campus, text: "Flexible academic streams including Arts, Science, and Commerce designed for higher education and career readiness."'
);

fs.writeFileSync('app/page.tsx', c);
console.log('Fixed board name and Senior Secondary streams');
