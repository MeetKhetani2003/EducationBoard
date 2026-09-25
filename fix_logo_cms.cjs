const fs = require('fs');

let clientApp = fs.readFileSync('app/ClientApp.tsx', 'utf8');

// 1. Add fields to AdminSettings
const initSettingsSearch = `"home.hero.title":`;
const initSettingsReplace = `"global.logo.image": cmsData["global.logo.image"] || "",
      "global.logo.text_hindi": cmsData["global.logo.text_hindi"] || "थार विद्यालय एवं तकनीकी शिक्षा बोर्ड",
      "global.logo.text_english": cmsData["global.logo.text_english"] || "Thar Vidyalaya Evam Takniki Shiksha Board",
      "global.logo.subtitle": cmsData["global.logo.subtitle"] || "EXAMINATION & CERTIFICATION AUTHORITY",
      "home.hero.title":`;
clientApp = clientApp.replace(initSettingsSearch, initSettingsReplace);

const tabsSearch = `            <button
              onClick={() => setActiveTab("Home Page")}
              className={\`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium \${activeTab === "Home Page" ? "border-[#8d1c2f] text-[#8d1c2f]" : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700"}\`}
            >
              Home Page
            </button>`;
const tabsReplace = `            <button
              onClick={() => setActiveTab("Global")}
              className={\`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium \${activeTab === "Global" ? "border-[#8d1c2f] text-[#8d1c2f]" : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700"}\`}
            >
              Global
            </button>
            <button
              onClick={() => setActiveTab("Home Page")}
              className={\`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium \${activeTab === "Home Page" ? "border-[#8d1c2f] text-[#8d1c2f]" : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700"}\`}
            >
              Home Page
            </button>`;
clientApp = clientApp.replace(tabsSearch, tabsReplace);

const formFieldsSearch = `          <form onSubmit={handleSave} className="space-y-10 p-6 md:p-8">
            {activeTab === "Home Page" && (
              <>`;
const formFieldsReplace = `          <form onSubmit={handleSave} className="space-y-10 p-6 md:p-8">
            {activeTab === "Global" && (
              <>
                <div>
                  <h3 className="mb-4 text-lg font-bold text-stone-800">Board Identity</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Logo URL (Image)</label>
                      <input className="w-full rounded border border-stone-200 p-2 text-sm outline-none focus:border-[#a1283c]" value={fv["global.logo.image"]} onChange={e => setFv({...fv, "global.logo.image": e.target.value})} placeholder="e.g. https://... or /logo.png" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Board Name (Hindi)</label>
                      <input className="w-full rounded border border-stone-200 p-2 text-sm outline-none focus:border-[#a1283c]" value={fv["global.logo.text_hindi"]} onChange={e => setFv({...fv, "global.logo.text_hindi": e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Board Name (English)</label>
                      <input className="w-full rounded border border-stone-200 p-2 text-sm outline-none focus:border-[#a1283c]" value={fv["global.logo.text_english"]} onChange={e => setFv({...fv, "global.logo.text_english": e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Subtitle</label>
                      <input className="w-full rounded border border-stone-200 p-2 text-sm outline-none focus:border-[#a1283c]" value={fv["global.logo.subtitle"]} onChange={e => setFv({...fv, "global.logo.subtitle": e.target.value})} />
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === "Home Page" && (
              <>`;
clientApp = clientApp.replace(formFieldsSearch, formFieldsReplace);

// 2. Update Logo component
const logoComponentSearch = `function Logo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={\`grid \${compact ? "h-10 w-10" : "h-12 w-12"} shrink-0 place-items-center rounded-full border-2 \${inverse ? "border-white/50 bg-white/10" : "border-[#8d581c] bg-[#fdf9f5]"}\`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          className={\`h-7 w-7 \${inverse ? "text-white" : "text-[#8d581c]"}\`}
          fill="none"
        >
          <path
            d="M8 17.5 24 9l16 8.5L24 26 8 17.5Z"
            fill="currentColor"
          />
          <path
            d="M14 22v9c5.2 4.7 14.8 4.7 20 0v-9M39 19v11"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="39" cy="33" r="2" fill="#f1be26" />
        </svg>
      </div>
      <div className="min-w-0 flex flex-col justify-center leading-[1.2] text-left">
        <div
          className={\`font-bold tracking-wide \${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} \${inverse ? "text-[#e8c476]" : "text-[#440d16]"} drop-shadow-sm\`}
        >
          थार विद्यालय एवं तकनीकी शिक्षा बोर्ड
        </div>
        <div
          className={\`font-bold tracking-[0.02em] \${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} \${inverse ? "text-[#e8c476]" : "text-[#440d16]"}\`}
        >
          Thar Vidyalaya Evam Takniki Shiksha Board
        </div>
        <div
          className={\`mt-0.5 font-semibold tracking-[0.15em] uppercase \${compact ? "text-[8px]" : "text-[9px] md:text-[10px]"} \${inverse ? "text-[#e8c476]/80" : "text-[#440d16]/80"}\`}
        >
          EXAMINATION & CERTIFICATION AUTHORITY
        </div>
      </div>
    </div>
  );
}`;

const logoComponentReplace = `function Logo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const { cmsData } = React.useContext(CmsContext);
  const safeCms = cmsData || {};
  const logoUrl = safeCms["global.logo.image"];
  const textHindi = safeCms["global.logo.text_hindi"] || "थार विद्यालय एवं तकनीकी शिक्षा बोर्ड";
  const textEnglish = safeCms["global.logo.text_english"] || "Thar Vidyalaya Evam Takniki Shiksha Board";
  const subtitle = safeCms["global.logo.subtitle"] || "EXAMINATION & CERTIFICATION AUTHORITY";

  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className={\`\${compact ? "h-10 w-10" : "h-12 w-12"} object-contain\`} />
      ) : (
        <div
          className={\`grid \${compact ? "h-10 w-10" : "h-12 w-12"} shrink-0 place-items-center rounded-full border-2 \${inverse ? "border-white/50 bg-white/10" : "border-[#8d581c] bg-[#fdf9f5]"}\`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 48 48"
            className={\`h-7 w-7 \${inverse ? "text-white" : "text-[#8d581c]"}\`}
            fill="none"
          >
            <path
              d="M8 17.5 24 9l16 8.5L24 26 8 17.5Z"
              fill="currentColor"
            />
            <path
              d="M14 22v9c5.2 4.7 14.8 4.7 20 0v-9M39 19v11"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="39" cy="33" r="2" fill="#f1be26" />
          </svg>
        </div>
      )}
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

clientApp = clientApp.replace(logoComponentSearch, logoComponentReplace);

// 3. Marksheet Print Logo Fix
const marksheetLogoSearch = `          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#8d1c2f] bg-[#f9eaec]">
              <Award className="h-8 w-8 text-[#8d1c2f]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-[#440d16]">
                थार विद्यालय एवं तकनीकी शिक्षा बोर्ड
              </h1>
              <h2 className="text-xl font-bold tracking-tight text-[#440d16]">
                Thar Vidyalaya Evam Takniki Shiksha Board
              </h2>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8d1c2f]">
                Examination & Certification Authority
              </div>
            </div>
          </div>`;

const marksheetLogoReplace = `          <div className="flex items-center gap-4">
            <Logo compact={false} />
          </div>`;

clientApp = clientApp.replace(marksheetLogoSearch, marksheetLogoReplace);

fs.writeFileSync('app/ClientApp.tsx', clientApp, 'utf8');
console.log('Fixed CMS logo settings and component');
