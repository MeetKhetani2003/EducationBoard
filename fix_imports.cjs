const fs = require('fs');
const path = require('path');

const apiFiles = [
  'app/api/results/route.ts',
  'app/api/cms/route.ts',
  'app/api/documents/route.ts'
];

apiFiles.forEach(file => {
  if (!fs.existsSync(file)) { console.log('Missing:', file); return; }
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/from '@\/lib\/db'/g, "from '../../../lib/db'");
  c = c.replace(/from '@\/models\/Result'/g, "from '../../../models/Result'");
  c = c.replace(/from '@\/models\/Content'/g, "from '../../../models/Content'");
  c = c.replace(/from '@\/models\/Document'/g, "from '../../../models/Document'");
  c = c.replace(/from '@\/models\/Student'/g, "from '../../../models/Student'");
  fs.writeFileSync(file, c);
  console.log('Fixed:', file);
});
