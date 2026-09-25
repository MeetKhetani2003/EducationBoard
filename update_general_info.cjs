const fs = require('fs');
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

const regex = /<h2 className="text-base font-semibold text-stone-900 mb-1">\s*General Information\s*<\/h2>\s*<p className="text-xs text-stone-400 mb-6">\s*Organization details shown site-wide\.\s*<\/p>\s*<div className="grid gap-5 md:grid-cols-2">\s*<div className="md:col-span-2">\s*<CMSField\s*fv=\{fv\}\s*set=\{set\}\s*label="Organization Name"\s*fkey="org\.name"\s*\/>\s*<\/div>\s*<div className="md:col-span-2">\s*<CMSField\s*fv=\{fv\}\s*set=\{set\}\s*label="Official Tagline"\s*fkey="org\.tagline"\s*\/>\s*<\/div>\s*<\/div>/;

const replacement = `<h2 className="text-base font-semibold text-stone-900 mb-1">
                General Information
              </h2>
              <p className="text-xs text-stone-400 mb-6">
                Organization details shown site-wide.
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <CMSImageUpload
                    fv={fv}
                    handleImg={handleImg}
                    label="Board Logo"
                    fkey="global.logo.image"
                  />
                </div>
                <div className="md:col-span-2">
                  <CMSField
                    fv={fv}
                    set={set}
                    label="Board Name (Hindi)"
                    fkey="global.logo.text_hindi"
                  />
                </div>
                <div className="md:col-span-2">
                  <CMSField
                    fv={fv}
                    set={set}
                    label="Organization Name / Board Name (English)"
                    fkey="global.logo.text_english"
                  />
                </div>
                <div className="md:col-span-2">
                  <CMSField
                    fv={fv}
                    set={set}
                    label="Official Tagline / Subtitle"
                    fkey="global.logo.subtitle"
                  />
                </div>
              </div>`;

if (regex.test(clientApp)) {
  clientApp = clientApp.replace(regex, replacement);
  fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
  console.log('General Information tab updated successfully');
} else {
  console.log('Regex did not match General Information tab');
}
