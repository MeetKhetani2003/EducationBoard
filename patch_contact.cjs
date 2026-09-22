const fs = require("fs");

let content = fs.readFileSync("src/App.tsx", "utf8");

const contactPageStart = `function ContactPage({ navigate }: { navigate: Navigate }) {`;
const contactPageEnd = `</>;\n}`;

const startIndex = content.indexOf(contactPageStart);
const endIndex = content.indexOf(contactPageEnd, startIndex) + contactPageEnd.length;

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find ContactPage");
  process.exit(1);
}

const newContactPage = `function ContactPage({ navigate }: { navigate: Navigate }) {
  const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) { 
    e.preventDefault(); 
    setSending(true); 
    setError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSent(true);
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return <><PageHero title="Contact the Board" text="Connect with our student services and examination support teams." label="Contact Us" image={images.conversation} navigate={navigate} /><main className="py-14 md:py-20"><div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr]"><section><SectionHeading eyebrow="Get in Touch" title="We are here to help" text="For result queries, keep your roll number and registration number available when contacting support." /><div className="mt-7 space-y-5">{[[MapPin, "Office Address", "Academic Services Centre, Knowledge Avenue, New Delhi 110001"], [Phone, "Examination Helpline", "1800-123-2026"], [Mail, "Email", "help@thar.demo"], [Clock3, "Working Hours", "Monday-Friday, 9:30 AM-5:30 PM"]].map(([Icon, label, value]) => { const I = Icon as LucideIcon; return <div key={label as string} className="flex gap-4"><I className="mt-1 h-5 w-5 shrink-0 text-[#8d581c]" /><div><h3 className="text-sm font-semibold text-[#4a3013]">{label as string}</h3><p className="mt-1 max-w-xs text-sm leading-6 text-stone-600">{value as string}</p></div></div>; })}</div></section><form onSubmit={submit} className="border border-stone-200 bg-[#fcfaf7] p-6 md:p-8"><h2 className="text-xl font-semibold text-[#4a3013]">Send a message</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Full Name" required placeholder="Your full name" value={name} onChange={setName} /><Field label="Email" required type="email" placeholder="you@example.com" value={email} onChange={setEmail} /><Field label="Phone" placeholder="Phone number" value={phone} onChange={setPhone} />
  
  <label className="block text-sm font-semibold text-stone-700">Subject<span className="relative mt-2 block"><select required value={subject} onChange={e => setSubject(e.target.value)} className="h-12 w-full appearance-none rounded-lg border border-stone-300 bg-white px-3.5 pr-10 text-sm font-normal text-stone-700 outline-none transition focus:border-[#8d581c] focus:ring-3 focus:ring-stone-100"><option value="" disabled>Select subject</option>{["Result Query", "Examination Query", "Document Service", "Admission", "General"].map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-stone-400" /></span></label>
  
  </div><label className="mt-5 block text-sm font-semibold text-stone-700">Message<textarea required rows={5} placeholder="Describe how we can help" value={message} onChange={e => setMessage(e.target.value)} className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3.5 text-sm outline-none focus:border-[#8d581c]" /></label>
  {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
  <Button type="submit" disabled={sending} className="mt-5">{sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? "Sending..." : "Send Message"}</Button>{sent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 bg-lime-50 p-3 text-sm font-medium text-lime-700"><CheckCircle2 className="h-5 w-5" /> Your message has been submitted successfully.</motion.div>}</form></div><div className="mx-auto mt-14 max-w-[1160px] px-5 md:px-8"><div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#f1e9e0]"><div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#bda993_1px,transparent_1px),linear-gradient(90deg,#bda993_1px,transparent_1px)] [background-size:36px_36px]" /><div className="relative text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#8d581c] text-white shadow-lg"><MapPin className="h-6 w-6" /></span><h2 className="mt-3 font-semibold text-[#4a3013]">Academic Services Centre</h2><p className="mt-1 text-xs text-stone-600">Interactive map placeholder</p></div></div></div></main><HelpCta navigate={navigate} /></>;
}`;

content = content.substring(0, startIndex) + newContactPage + content.substring(endIndex);
fs.writeFileSync("src/App.tsx", content, "utf8");
console.log("ContactPage replaced successfully!");
