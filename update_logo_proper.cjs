const fs = require('fs');
let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

const regex = /function Logo\(\{[\s\S]*?inverse = false,[\s\S]*?compact = false,[\s\S]*?\}\: \{[\s\S]*?inverse\?\: boolean;[\s\S]*?compact\?\: boolean;[\s\S]*?\}\) \{[\s\S]*?return \([\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<div[\s\S]*?className=\{`grid \$\{compact \? "h-12 w-12" : "h-14 w-14 md:h-16 md:w-16"\} shrink-0 place-items-center rounded-full bg-white overflow-hidden p-0\.5 shadow-sm`\}[\s\S]*?>[\s\S]*?<img[\s\S]*?src=\{images\.logo\}[\s\S]*?alt="Logo"[\s\S]*?className="w-full h-full object-contain"[\s\S]*?\/>[\s\S]*?<\/div>[\s\S]*?<div className="min-w-0 flex flex-col justify-center leading-\[1\.2\] text-left">[\s\S]*?<div[\s\S]*?className=\{`font-bold tracking-wide \$\{compact \? "text-\[14px\]" : "text-\[16px\] md:text-\[18px\]"\} \$\{inverse \? "text-\[\#e8c476\]" : "text-\[\#440d16\]"\} drop-shadow-sm`\}[\s\S]*?>[\s\S]*?थार विद्यालय एवं तकनीकी शिक्षा बोर्ड[\s\S]*?<\/div>[\s\S]*?<div[\s\S]*?className=\{`font-bold tracking-\[0\.02em\] \$\{compact \? "text-\[14px\]" : "text-\[16px\] md:text-\[18px\]"\} \$\{inverse \? "text-\[\#e8c476\]" : "text-\[\#440d16\]"\}`\}[\s\S]*?>[\s\S]*?Thar Vidyalaya Evam Takniki Shiksha Board[\s\S]*?<\/div>[\s\S]*?<div[\s\S]*?className=\{`mt-0\.5 font-semibold tracking-\[0\.15em\] uppercase \$\{compact \? "text-\[8px\]" : "text-\[9px\] md:text-\[10px\]"\} \$\{inverse \? "text-\[\#e8c476\]\/80" : "text-\[\#440d16\]\/80"\}`\}[\s\S]*?>[\s\S]*?EXAMINATION & CERTIFICATION AUTHORITY[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}/;

const replacement = `function Logo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const { cmsData } = React.useContext(CmsContext);
  const safeCms = cmsData || {};
  const logoUrl = safeCms["global.logo.image"] || images.logo;
  const textHindi = safeCms["global.logo.text_hindi"] || "थार विद्यालय एवं तकनीकी शिक्षा बोर्ड";
  const textEnglish = safeCms["global.logo.text_english"] || "Thar Vidyalaya Evam Takniki Shiksha Board";
  const subtitle = safeCms["global.logo.subtitle"] || "EXAMINATION & CERTIFICATION AUTHORITY";

  return (
    <div className="flex items-center gap-3">
      <div
        className={\`grid \${compact ? "h-12 w-12" : "h-14 w-14 md:h-16 md:w-16"} shrink-0 place-items-center rounded-full bg-white overflow-hidden p-0.5 shadow-sm\`}
      >
        <img
          src={logoUrl}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="min-w-0 flex flex-col justify-center leading-[1.2] text-left">
        <div
          className={\`font-bold tracking-wide \${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} \${inverse ? "text-[#e8c476]" : "text-[#440d16]"} drop-shadow-sm\`}
        >
          {textHindi}
        </div>
        <div
          className={\`font-bold tracking-[0.02em] \${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} \${inverse ? "text-[#e8c476]" : "text-[#440d16]"}\`}
        >
          {textEnglish}
        </div>
        <div
          className={\`mt-0.5 font-semibold tracking-[0.15em] uppercase \${compact ? "text-[8px]" : "text-[9px] md:text-[10px]"} \${inverse ? "text-[#e8c476]/80" : "text-[#440d16]/80"}\`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}`;

if (regex.test(clientApp)) {
  clientApp = clientApp.replace(regex, replacement);
  fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
  console.log('Logo component updated successfully');
} else {
  console.log('Regex did not match Logo component');
}
