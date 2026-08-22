const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
const lines = c.split('\n');

// Find the return statement in App and wrap with Provider
const isAdminLine = lines.findIndex((l, i) => i > 765 && l.includes('const isAdmin = page.startsWith("admin-");'));
console.log('isAdmin at line:', isAdminLine + 1);
console.log('Line:', lines[isAdminLine]);
console.log('Return line:', lines[isAdminLine + 1]);

// The return is `  return <>` - we need to change it to wrap with CmsContext.Provider
lines[isAdminLine + 1] = `  return <CmsContext.Provider value={{ cmsData, fetchCms }}>`;

// Find the closing </>;
const closingLine = lines.findIndex((l, i) => i > isAdminLine + 1 && l.trim() === '</>;');
console.log('Closing </> at line:', closingLine + 1, ':', lines[closingLine]);

if (closingLine !== -1) {
  lines[closingLine] = `  </CmsContext.Provider>;`;
} else {
  // Try to find it another way
  lines.forEach((l, i) => {
    if (i > isAdminLine && l.trim() === '</>;') {
      console.log('Found </> at:', i+1);
    }
  });
}

const result = lines.join('\n');
fs.writeFileSync('app/page.tsx', result);

const verify = fs.readFileSync('app/page.tsx', 'utf8');
console.log('Provider in file:', verify.includes('CmsContext.Provider'));
