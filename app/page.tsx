"use client";
import React, { FormEvent, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility, AlertCircle, ArrowDownToLine, ArrowLeft, ArrowRight, Award,
  Bell, BookOpen, Building2, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Clock3,
  Download, ExternalLink, Eye, FileCheck2, FileDown,
  FileSpreadsheet, FileText, Filter, GraduationCap, Headphones, Image as ImageIcon,
  Languages, LayoutDashboard, LifeBuoy, LoaderCircle, LockKeyhole, LogIn, Mail,
  Map, MapPin, Menu, MessageSquare, MoreHorizontal, Newspaper,
  Pencil, Phone, Plus, Printer, QrCode, Search, Send, Settings, ShieldCheck,
  SlidersHorizontal, Sparkles, Trash2, UploadCloud, User, UserCheck, UserPlus, Users, X, LogOut,
  type LucideIcon,
} from "lucide-react";

const CmsContext = React.createContext<any>({ cmsData: {}, fetchCms: () => {} });

type Page =
  | "home" | "about" | "recognition" | "programmes" | "examinations"
  | "results" | "result-detail" | "verification" | "result-archive"
  | "news" | "news-detail" | "notices" | "downloads" | "student-zone"
  | "services" | "gallery" | "contact" | "admin-dashboard" | "admin-results"
  | "admin-import" | "admin-students" | "admin-exams" | "admin-news"
  | "admin-notices" | "admin-downloads" | "admin-programmes" | "admin-gallery"
  | "admin-recognition" | "admin-messages" | "admin-settings" | "admin-add-result" | "system-result-view" | "student-login";

type Navigate = (page: Page) => void;

const images = {
  logo: "/logo.png",
  hero: "https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&q=88",
  about: "https://images.pexels.com/photos/16420473/pexels-photo-16420473.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  exams: "https://images.pexels.com/photos/6683675/pexels-photo-6683675.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  examHall: "https://images.pexels.com/photos/7092339/pexels-photo-7092339.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  students: "https://images.pexels.com/photos/8197511/pexels-photo-8197511.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  campus: "https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  conversation: "https://images.pexels.com/photos/7972542/pexels-photo-7972542.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  graduation: "https://images.pexels.com/photos/7942522/pexels-photo-7942522.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&q=85",
  graduates: "https://images.pexels.com/photos/7972737/pexels-photo-7972737.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  diploma: "https://images.pexels.com/photos/37012315/pexels-photo-37012315.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  ceremony: "https://images.pexels.com/photos/34311558/pexels-photo-34311558.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
  celebrate: "https://images.pexels.com/photos/7713351/pexels-photo-7713351.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&q=85",
};

const programmes = [
  { title: "Secondary Education", eligibility: "Class VIII pass or equivalent", duration: "2 academic years", image: images.students, text: "A structured pathway with languages, sciences, mathematics and social studies." },
  { title: "Senior Secondary (Arts, Science & Commerce)", eligibility: "Secondary pass", duration: "2 academic years", image: images.campus, text: "Flexible academic streams including Arts, Science, and Commerce designed for higher education and career readiness." },
  { title: "Vocational Programmes", eligibility: "Programme-specific", duration: "6-18 months", image: images.conversation, text: "Applied learning in technology, commerce, services and community skills." },
  { title: "Skill Development", eligibility: "Open eligibility", duration: "3-12 months", image: images.examHall, text: "Short-form industry-oriented programmes supported by practical assessment." },
];

const newsItems = [
  { category: "Result", date: "17 Aug 2026", title: "Senior Secondary Examination Result 2026 declared", summary: "Students can access their verified digital result and provisional marksheet through the official portal.", image: images.graduation },
  { category: "Examination", date: "12 Aug 2026", title: "October public examination schedule released", summary: "The subject-wise examination calendar is now available for download.", image: images.exams },
  { category: "Admission", date: "08 Aug 2026", title: "Online registration opens for the 2026-27 session", summary: "New learners may complete registration and document submission online.", image: images.students },
  { category: "Circular", date: "04 Aug 2026", title: "Updated instructions for accredited examination centres", summary: "Centres are requested to review the revised operational guidelines.", image: images.campus },
  { category: "Notice", date: "29 Jul 2026", title: "Revaluation applications open for June examination", summary: "Eligible students may apply online until 12 August 2026.", image: images.diploma },
  { category: "General", date: "22 Jul 2026", title: "Digital certificate verification service enhanced", summary: "Verification requests now include secure reference tracking.", image: images.ceremony },
];

const resultRows = [
  { name: "Senior Secondary Examination 2026", date: "17 August 2026", status: "Declared", programme: "Senior Secondary" },
  { name: "Secondary Examination 2026", date: "04 July 2026", status: "Declared", programme: "Secondary" },
  { name: "Vocational Assessment - Term II", date: "28 June 2026", status: "Declared", programme: "Vocational" },
  { name: "October Public Examination 2026", date: "Expected 18 December 2026", status: "Upcoming", programme: "All Programmes" },
];

const documentRows = [
  { title: "Senior Secondary Examination Time Table - October 2026", category: "Time Tables", date: "12 Aug 2026", size: "1.2 MB", type: "PDF" },
  { title: "Application Form for Result Revaluation", category: "Forms", date: "09 Aug 2026", size: "680 KB", type: "PDF" },
  { title: "Secondary Programme Academic Syllabus", category: "Syllabus", date: "28 Jul 2026", size: "4.8 MB", type: "PDF" },
  { title: "Instructions for Examination Candidates", category: "Circulars", date: "20 Jul 2026", size: "920 KB", type: "PDF" },
  { title: "Migration Certificate Application", category: "Student Documents", date: "11 Jul 2026", size: "540 KB", type: "PDF" },
  { title: "Examination Centre Directory 2026", category: "Examination", date: "02 Jul 2026", size: "2.1 MB", type: "PDF" },
];

const marks = [
  { subject: "English Language", max: 100, obtained: 84, grade: "A", status: "Pass" },
  { subject: "Mathematics", max: 100, obtained: 91, grade: "A+", status: "Pass" },
  { subject: "Physics", max: 100, obtained: 86, grade: "A", status: "Pass" },
  { subject: "Chemistry", max: 100, obtained: 82, grade: "A", status: "Pass" },
  { subject: "Computer Science", max: 100, obtained: 94, grade: "A+", status: "Pass" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" as const } },
};

function Logo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return <div className="flex items-center gap-3">
    <div className={`grid ${compact ? "h-12 w-12" : "h-14 w-14 md:h-16 md:w-16"} shrink-0 place-items-center rounded-full bg-white overflow-hidden p-0.5 shadow-sm`}>
      <img src={images.logo} alt="Logo" className="w-full h-full object-contain" />
    </div>
    <div className="min-w-0 flex flex-col justify-center leading-[1.2] text-left">
      <div className={`font-bold tracking-wide ${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} ${inverse ? "text-[#e8c476]" : "text-[#440d16]"} drop-shadow-sm`}>थार विद्यालय एवं तकनीकी शिक्षा बोर्ड</div>
      <div className={`font-bold tracking-[0.02em] ${compact ? "text-[14px]" : "text-[16px] md:text-[18px]"} ${inverse ? "text-[#e8c476]" : "text-[#440d16]"}`}>THAR BOARD OF SCHOOL & TECHNICAL EDUCATION</div>
      <div className={`mt-0.5 font-semibold tracking-[0.15em] uppercase ${compact ? "text-[8px]" : "text-[9px] md:text-[10px]"} ${inverse ? "text-[#e8c476]/80" : "text-[#440d16]/80"}`}>EXAMINATION & CERTIFICATION AUTHORITY</div>
    </div>
  </div>;
}

function Button({ children, variant = "primary", className = "", type = "button", onClick, disabled = false }: { children: React.ReactNode; variant?: "primary" | "secondary" | "light" | "ghost" | "danger"; className?: string; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean }) {
  const styles = { primary: "bg-[#8d1c2f] text-white hover:bg-[#741222] shadow-sm", secondary: "border border-stone-300 bg-white text-[#4a131c] hover:border-[#8d1c2f] hover:text-[#8d1c2f]", light: "bg-white text-[#4a131c] hover:bg-stone-50", ghost: "text-[#8d1c2f] hover:bg-stone-50", danger: "bg-red-600 text-white hover:bg-red-700" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fb791c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}>{children}</button>;
}

function SectionHeading({ eyebrow, title, text, align = "left", action }: { eyebrow?: string; title: string; text?: string; align?: "left" | "center"; action?: React.ReactNode }) {
  return <div className={`mb-8 flex flex-col gap-4 md:mb-10 ${align === "center" ? "mx-auto max-w-2xl text-center" : "md:flex-row md:items-end md:justify-between"}`}><div className={align === "center" ? "" : "max-w-2xl"}>{eyebrow && <div className="mb-3 text-xs font-bold uppercase tracking-[0.19em] text-[#d85d05]">{eyebrow}</div>}<h2 className="text-[clamp(1.8rem,3.1vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-[#4a131c]">{title}</h2>{text && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-600">{text}</p>}</div>{action}</div>;
}

function StatusBadge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "amber" | "blue" | "slate" | "red" }) {
  const tones = { green: "bg-lime-50 text-lime-700 ring-lime-200", amber: "bg-amber-50 text-amber-700 ring-amber-200", blue: "bg-stone-50 text-stone-700 ring-stone-200", slate: "bg-stone-100 text-stone-600 ring-stone-200", red: "bg-red-50 text-red-700 ring-red-200" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

function Field({ label, placeholder, type = "text", required = false, value, onChange }: { label: string; placeholder?: string; type?: string; required?: boolean; value?: string; onChange?: (value: string) => void }) {
  return <label className="block text-sm font-semibold text-stone-700">{label}{required && <span className="text-red-600"> *</span>}<input type={type} placeholder={placeholder} required={required} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} className="mt-2 h-12 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-sm font-normal text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#8d1c2f] focus:ring-3 focus:ring-stone-100" /></label>;
}

function SelectField({ label, options, required = false }: { label: string; options: string[]; required?: boolean }) {
  return <label className="block text-sm font-semibold text-stone-700">{label}{required && <span className="text-red-600"> *</span>}<span className="relative mt-2 block"><select required={required}  defaultValue="" className="h-12 w-full appearance-none rounded-lg border border-stone-300 bg-white px-3.5 pr-10 text-sm font-normal text-stone-700 outline-none transition focus:border-[#8d1c2f] focus:ring-3 focus:ring-stone-100"><option value="" disabled>Select {label.toLowerCase()}</option>{options.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-stone-400" /></span></label>;
}

function Breadcrumb({ items, navigate }: { items: string[]; navigate: Navigate }) {
  return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500"><button onClick={() => navigate("home")} className="transition hover:text-[#8d1c2f]">Home</button>{items.map((item) => <span className="contents" key={item}><ChevronRight className="h-3.5 w-3.5" /><span className="text-stone-700">{item}</span></span>)}</nav>;
}

function PageHero({ title, text, label, image, navigate }: { title: string; text: string; label: string; image?: string; navigate: Navigate }) {
  return <section className="relative overflow-hidden bg-[#faf0f2]">{image && <div className="absolute inset-y-0 right-0 hidden w-[44%] lg:block"><img src={image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#faf0f2] via-[#faf0f2]/35 to-transparent" /></div>}<div className="relative mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16 lg:py-20"><Breadcrumb items={[label]} navigate={navigate} /><motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-8 max-w-2xl"><div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#d85d05]">{label}</div><h1 className="text-[clamp(2.1rem,4.8vw,4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-[#4a131c]">{title}</h1><p className="mt-5 max-w-xl text-base leading-7 text-stone-600">{text}</p></motion.div></div></section>;
}

const navItems: { label: string; page: Page; children?: { label: string; page: Page }[] }[] = [
  { label: "Home", page: "home" }, { label: "About Us", page: "about", children: [{ label: "About the Board", page: "about" }, { label: "Recognition & Approvals", page: "recognition" }] },
  { label: "Recognition", page: "recognition" }, { label: "Programmes", page: "programmes" },
  { label: "Examinations", page: "examinations", children: [{ label: "Examination Schedule", page: "examinations" }, { label: "Admit Card", page: "student-login" }, { label: "Examination Centres", page: "examinations" }] },
  { label: "Results", page: "results", children: [{ label: "Check Result", page: "results" }, { label: "Result Archive", page: "result-archive" }, { label: "Result Verification", page: "verification" }] },
  { label: "Student Zone", page: "student-login" }, { label: "News & Notices", page: "news", children: [{ label: "News & Announcements", page: "news" }, { label: "Notices & Circulars", page: "notices" }] },
  { label: "Downloads", page: "downloads" }, { label: "Contact", page: "contact" },
];

function PublicHeader({ navigate, active }: { navigate: Navigate; active: Page }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <><div className="bg-[#440d16] text-[11px] font-medium text-stone-100"><div className="mx-auto flex min-h-8 max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8"><div className="hidden items-center gap-2 sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-[#ff9245]" /> Official Examination & Result Portal</div><div className="flex w-full items-center justify-end gap-4 sm:w-auto"><a href="tel:+918869844584" className="hidden hover:text-white md:inline">Helpline: +91 8869844584</a><button onClick={() => navigate("contact")} className="hover:text-white">Help</button><button className="inline-flex items-center gap-1 hover:text-white"><Accessibility className="h-3.5 w-3.5" /> Accessibility</button><button className="inline-flex items-center gap-1 hover:text-white"><Languages className="h-3.5 w-3.5" /> EN</button></div></div></div>
    <header className="border-b border-[#310910] bg-[#440d16]"><div className="mx-auto flex min-h-[84px] max-w-[1240px] items-center justify-between gap-6 px-5 py-3 md:px-8"><button onClick={() => navigate("home")} aria-label="Go to homepage"><Logo inverse /></button><div className="hidden items-center gap-7 text-xs text-stone-300 lg:flex"><a href="mailto:help@tbste.edu" className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-[#e8c476]" /><span><b className="block text-white">Email Support</b>help@tbste.edu</span></a><button onClick={() => navigate("student-login")} className="flex items-center gap-2 text-left hover:text-white"><UserCheck className="h-4 w-4 text-[#e8c476]" /><span><b className="block text-white">Student Portal</b>Secure login</span></button><button onClick={() => navigate("admin-dashboard")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#e8c476]/30 px-4 font-semibold text-[#e8c476] transition-colors hover:bg-[#e8c476]/10"><LockKeyhole className="h-4 w-4" /> Staff login</button></div><button onClick={() => setMobileOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 text-white lg:hidden" aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button></div></header>
    <nav className="sticky top-0 z-40 border-b border-stone-200 bg-white/96 shadow-[0_5px_18px_rgba(15,35,70,0.04)] backdrop-blur" aria-label="Main navigation"><div className="mx-auto hidden max-w-[1240px] items-center justify-between px-8 lg:flex"><div className="flex">{navItems.map((item) => <div className="group relative" key={item.label}><button onClick={() => navigate(item.page)} className={`flex h-12 items-center gap-1.5 border-b-2 px-3.5 text-[13px] font-semibold transition ${active === item.page ? "border-[#fb791c] text-[#8d1c2f]" : "border-transparent text-stone-700 hover:border-stone-200 hover:text-[#8d1c2f]"}`}>{item.label}{item.children && <ChevronDown className="h-3.5 w-3.5" />}</button>{item.children && <div className="invisible absolute left-0 top-[49px] z-50 w-60 transtone-y-2 border border-stone-200 bg-white p-2 opacity-0 shadow-xl shadow-stone-900/10 transition-all group-hover:visible group-hover:transtone-y-0 group-hover:opacity-100">{item.children.map((child) => <button key={child.label} onClick={() => navigate(child.page)} className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-50 hover:text-[#8d1c2f]">{child.label}<ChevronRight className="h-4 w-4" /></button>)}</div>}</div>)}</div><button onClick={() => navigate("results")} className="flex h-12 items-center gap-2 border-b-2 border-[#8d1c2f] px-4 text-[13px] font-bold text-[#8d1c2f]"><Search className="h-4 w-4" /> Check result</button></div>
      <AnimatePresence>{mobileOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-stone-100 bg-white lg:hidden"><div className="max-h-[72vh] overflow-y-auto p-4">{navItems.map((item) => <button key={item.label} onClick={() => { navigate(item.page); setMobileOpen(false); }} className="flex w-full items-center justify-between border-b border-stone-100 px-2 py-3.5 text-left text-sm font-semibold text-stone-700">{item.label}<ChevronRight className="h-4 w-4" /></button>)}<Button onClick={() => { navigate("results"); setMobileOpen(false); }} className="mt-4 w-full">Check Your Result</Button></div></motion.div>}</AnimatePresence></nav></>;
}

function Footer({ navigate }: { navigate: Navigate }) {
  const link = (label: string, page: Page) => <button onClick={() => navigate(page)} className="block py-1.5 text-left text-sm text-stone-300 transition hover:transtone-x-0.5 hover:text-white">{label}</button>;
  return <footer className="bg-[#3c0b13] text-white"><div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-16"><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><Logo inverse /><div className="mt-5 max-w-sm text-xs leading-5 text-stone-300"><p className="font-semibold text-white">THAR BOARD OF SCHOOL & TECHNICAL EDUCATION</p><p className="mt-2">(GOVERNMENT RECOGNISED, ESTABLISHED UNDER INDIAN TRUST ACT, 1882  IV48/2013)</p><p>(REGISTERED WITH PLANNING COMMISSION, GOVT. OF INDIA)</p><p>ISO 9001:2008-CERTIFIED ORGANIZATION</p></div><div className="mt-5 flex items-center gap-2 text-xs text-stone-200"><ShieldCheck className="h-4 w-4 text-[#ff9245]" /> Designed for secure, accessible public services</div></div><div><h3 className="mb-3 text-sm font-semibold">Quick Links</h3>{link("About the Board", "about")}{link("Examination Results", "results")}{link("Examinations", "examinations")}{link("Programmes", "programmes")}</div><div><h3 className="mb-3 text-sm font-semibold">Student Services</h3>{link("Downloads", "downloads")}{link("Admit Card", "student-login")}{link("Result Verification", "verification")}{link("Student Zone", "student-login")}</div><div><h3 className="mb-3 text-sm font-semibold">Support</h3>{link("Contact Us", "contact")}<a className="block py-1.5 text-sm text-stone-300" href="mailto:help@tbste.edu">help@tbste.edu</a><a className="block py-1.5 text-sm text-stone-300" href="tel:+918869844584">+91 8869844584</a><span className="mt-3 block text-xs leading-5 text-stone-400">Mon-Fri, 9:30 AM-5:30 PM</span></div></div></div><div className="border-t border-white/10"><div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-5 text-xs text-stone-400 md:flex-row md:items-center md:justify-between md:px-8"><p>Copyright 2026 Thar Board of School and Technical Education. Demo concept only.</p><div className="flex gap-5"><button>Privacy Policy</button><button>Terms</button><button>Accessibility</button></div></div></div></footer>;
}

function ResultSearch({ navigate, compact = false }: { navigate: Navigate; compact?: boolean }) {
  const [enrollment, setEnrollment] = useState(""); const [dob, setDob] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); if (enrollment.trim().length < 4) { setError("Enter a valid enrollment number."); return; } setError(""); setLoading(true); try { const res = await fetch(`/api/results?enrollment=${enrollment}&dob=${dob}`); if (!res.ok) throw new Error("No result found. Please check your Enrollment Number and Date of Birth."); const data = await res.json(); window.sessionStorage.setItem("currentResult", JSON.stringify(data)); navigate("result-detail"); } catch (err: any) { setError(err.message); } finally { setLoading(false); } }
  return <form onSubmit={submit} className={compact ? "" : "border border-stone-200 bg-white p-5 shadow-[0_20px_50px_rgba(13,40,87,0.09)] md:p-8"}><div className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}><Field label="Enrollment Number" required placeholder="e.g. {resultData.enrollmentNumber}" value={enrollment} onChange={setEnrollment} /><Field label="Date of Birth" type="date" value={dob} onChange={setDob} required /></div>{error && <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs leading-5 text-stone-500"><LockKeyhole className="h-4 w-4 text-lime-600" /> Your information is used only to retrieve your official examination result.</p><div className="flex flex-col-reverse gap-2 sm:flex-row"><Button variant="secondary" onClick={() => navigate("result-archive")}>Search Result Archive</Button><Button type="submit" disabled={loading}>{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Searching Result...</> : <>View Result <ArrowRight className="h-4 w-4" /></>}</Button></div></div></form>;
}

function RecognitionSection({ navigate }: { navigate: Navigate }) {
  const items = ["Recognition Authority", "Registration Authority", "Academic Quality Body", "Digital Services Authority"];
  return <section className="bg-[#fbf4f5] py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Institutional Trust" title="Recognition & approvals" text="Organized access to illustrative recognition records and supporting documents. No official legal claims are made in this demo." action={<Button variant="secondary" onClick={() => navigate("recognition")}>View document archive</Button>} /><div className="grid border border-stone-200 bg-white md:grid-cols-2 lg:grid-cols-4">{items.map((name, index) => <button onClick={() => navigate("recognition")} key={name} className="group border-b border-stone-200 p-6 text-left last:border-b-0 md:border-r lg:border-b-0"><div className="grid h-12 w-12 place-items-center rounded-full border border-stone-100 bg-stone-50 text-[#8d1c2f]"><Award className="h-6 w-6" /></div><h3 className="mt-5 font-semibold text-[#4a131c]">{name}</h3><p className="mt-2 text-xs leading-5 text-stone-500">Illustrative registration record<br />Reference No. NAB/DEMO/0{index + 1}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#8d1c2f]">View document <ExternalLink className="h-3.5 w-3.5" /></span></button>)}</div></div></section>;
}

function StudentServices({ navigate }: { navigate: Navigate }) {
  const services: { label: string; icon: LucideIcon; page: Page }[] = [{ label: "Student Login", icon: LogIn, page: "student-login" }, { label: "Admit Card", icon: FileCheck2, page: "student-login" }, { label: "Study Material", icon: BookOpen, page: "downloads" }, { label: "Application Status", icon: ClipboardCheck, page: "services" }, { label: "Important Forms", icon: FileText, page: "downloads" }, { label: "Help & Support", icon: LifeBuoy, page: "contact" }];
  return <section className="bg-white py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Student Zone" title="Services designed around your academic journey" text="Find the right service quickly, from enrolment through certification." /><div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">{services.map((item) => <button key={item.label} onClick={() => navigate(item.page)} className="group flex items-center justify-between bg-white p-5 text-left transition hover:bg-stone-50"><span className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-lg bg-[#fceff1] text-[#8d1c2f]"><item.icon className="h-5 w-5" /></span><span className="font-semibold text-[#4a131c]">{item.label}</span></span><ChevronRight className="h-4 w-4 text-stone-400 transition group-hover:transtone-x-1 group-hover:text-[#8d1c2f]" /></button>)}</div></div></section>;
}

function GalleryStrip({ navigate }: { navigate: Navigate }) {
  const gallery = [images.ceremony, images.examHall, images.graduates, images.campus];
  return <section className="bg-[#fbf4f5] py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Institutional Moments" title="Learning, assessment and achievement" action={<Button variant="ghost" className="px-0" onClick={() => navigate("gallery")}>Open gallery <ArrowRight className="h-4 w-4" /></Button>} /><div className="grid h-[520px] grid-cols-2 grid-rows-2 gap-2 md:h-[470px] md:grid-cols-4">{gallery.map((image, index) => <button key={image} onClick={() => navigate("gallery")} className={`group overflow-hidden ${index === 0 ? "col-span-2 row-span-2" : index === 3 ? "col-span-2 md:col-span-1" : ""}`}><img src={image} alt="Institutional academic moment" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></button>)}</div></div></section>;
}

function HelpCta({ navigate }: { navigate: Navigate }) {
  return <section className="bg-[#f9eaec] py-14"><div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-5 md:flex-row md:items-center md:justify-between md:px-8"><div className="flex items-start gap-5"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#8d1c2f]"><Headphones className="h-6 w-6" /></span><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-[#d85d05]">Examination Helpdesk</div><h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#4a131c]">Need help with your result?</h2><p className="mt-2 text-sm text-stone-600">Our support team can assist with result access and document queries.</p></div></div><Button onClick={() => navigate("contact")}>Contact Examination Support <ArrowRight className="h-4 w-4" /></Button></div></section>;
}

function HomePage({ navigate }: { navigate: Navigate }) {
  const { cmsData } = React.useContext(CmsContext);
  const [dbNews, setDbNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/editorial?kind=News")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDbNews(data);
      })
      .catch(e => console.error(e));
  }, []);

  const displayNews = dbNews.length > 0 ? dbNews.map(item => ({
    category: item.category,
    date: item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "Latest",
    title: item.title,
    summary: item.summary,
    image: item.imageUrl || images.ceremony
  })) : newsItems;
  const safeCms = cmsData || {};
  
  const heroTitle = safeCms['home.hero.title'] || "Excellence in\nEducation & Skill Development";
  const heroText = safeCms['home.hero.text'] || "Fostering academic brilliance and technical proficiency to empower the next generation of leaders and innovators.";
  const heroBg = safeCms['home.hero.image'] || images.campus;
  const quickTitle = safeCms['home.quick_access.title'] || "Quick Access";
  const quickText = safeCms['home.quick_access.text'] || "Essential student services.";
  const aboutTitle = safeCms['home.about.title'] || "About the Board";
  const aboutText = safeCms['home.about.text'] || "Learn more.";
  const aboutImage = safeCms['home.about.image'] || images.campus;
  const resultsTitle = safeCms['home.results.title'] || "Latest Results";
  const resultsText = safeCms['home.results.text'] || "Recent updates.";
  const programmesTitle = safeCms['home.programmes.title'] || "Academic Pathways";
  const programmesText = safeCms['home.programmes.text'] || "Our courses.";
  const examsTitle = safeCms['home.exams.title'] || "Examination Cycle";
  const examsText = safeCms['home.exams.text'] || "Calendar.";
  const newsTitle = safeCms['home.news.title'] || "Official Updates";
  const newsText = safeCms['home.news.text'] || "Latest news.";
  const quickServices: { title: string; text: string; icon: LucideIcon; image: string; page: Page }[] = [
    { title: "Admit Card", text: "Download your card.", icon: FileCheck2, page: "student-login", image: images.students },
    { title: "Exam Schedule", text: "Dates and times.", icon: Clock3, page: "examinations", image: images.exams },
    { title: "Result Portal", text: "View official results.", icon: BookOpen, page: "results", image: images.diploma },
    { title: "Contact Us", text: "Help and support.", icon: Headphones, page: "contact", image: images.conversation }
  ];

  return <>
    <section className="relative min-h-[400px] overflow-hidden bg-[#4a0e18] text-white md:min-h-[450px]">
      <motion.img initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: "easeOut" }} src={heroBg} alt="Students engaged in an academic classroom" className="absolute inset-0 h-full w-full object-cover object-center md:object-[65%_45%]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,25,57,.98)_0%,rgba(7,33,73,.9)_39%,rgba(8,35,76,.38)_72%,rgba(8,28,61,.12)_100%)]" />
      <div className="relative mx-auto flex min-h-[400px] max-w-[1240px] items-center px-5 py-16 md:min-h-[450px] md:px-8"><motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-[670px]"><div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ff9e58]"><span className="h-px w-8 bg-[#ff9e58]" /> Official Examination Portal</div><div className="mb-5 text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">Thar Board of School and Technical Education</div><h1 className="max-w-2xl text-[clamp(2.8rem,6.5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">{heroTitle.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h1><p className="mt-6 max-w-xl text-[16px] leading-7 text-stone-50/85 md:text-lg">{heroText}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button variant="light" onClick={() => navigate("results")} className="px-6">Check Your Result <ArrowRight className="h-4 w-4" /></Button><Button onClick={() => navigate("student-login")} className="border border-white/35 bg-white/5 px-6 hover:bg-white/10">Explore Student Services</Button></div></motion.div></div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#fb791c] via-[#ffa869] to-transparent" />
    </section>

    <section className="relative z-10 bg-[#fcf7f8] pt-8 pb-10 md:pt-12 md:pb-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="-transtone-y-10 md:-transtone-y-14"><div className="mb-5"><div className="text-xs font-bold uppercase tracking-[0.18em] text-[#d85d05]">Official Results</div><h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#4a131c] md:text-3xl">Check Your Examination Result</h2><p className="mt-2 text-sm text-stone-600">Enter your examination details to securely access your result.</p></div><ResultSearch navigate={navigate} /></motion.div><div className="mt-8 flex flex-col items-start justify-between gap-4 border-l-4 border-[#fb791c] bg-[#621421] px-5 py-5 text-white md:flex-row md:items-center md:px-7"><div className="flex items-start gap-4"><Bell className="mt-1 h-5 w-5 shrink-0 text-[#ff9245]" /><div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffa260]">Result Update</div><p className="mt-1 text-sm font-semibold md:text-base">Senior Secondary Examination Result 2026 has been declared.</p></div></div><Button variant="light" onClick={() => navigate("results")} className="min-h-10">Check Result <ArrowRight className="h-4 w-4" /></Button></div></div></section>

    <section className="bg-white py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Quick Access" title={quickTitle} text={quickText} /><div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 md:grid-cols-2 lg:grid-cols-4">{quickServices.map((item, index) => <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }} onClick={() => navigate(item.page)} key={item.title} className="group relative min-h-72 overflow-hidden bg-[#490f19] p-6 text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff9245]"><img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-45" /><div className="absolute inset-0 bg-gradient-to-t from-[#3c0a12] via-[#4f0e19]/70 to-transparent" /><div className="relative flex h-full flex-col justify-end"><item.icon className="mb-5 h-7 w-7 text-[#ff9245]" /><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-100/85">{item.text}</p><ArrowRight className="mt-5 h-5 w-5 transition group-hover:transtone-x-1" /></div></motion.button>)}</div></div></section>

    <section className="bg-[#faf3f4] py-10 md:py-16"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16"><motion.div initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative"><img src={aboutImage} alt="Students collaborating in an academic library" className="aspect-[5/4] w-full object-cover" /><div className="absolute bottom-0 left-0 h-24 w-1.5 bg-[#fb791c]" /></motion.div><div><SectionHeading eyebrow="About the Board" title={aboutTitle} text={aboutText} /><p className="-mt-5 text-[15px] leading-7 text-stone-600">Our systems are designed to protect academic integrity while making essential services simpler for students, institutions and examination centres.</p><div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-7 border-t border-stone-300 pt-7 sm:grid-cols-4">{[["20+", "Years"], ["50K+", "Students"], ["100+", "Centres"], ["99%", "Digital services"]].map(([value, label]) => <div key={label}><div className="text-2xl font-semibold tracking-tight text-[#8d1c2f]">{value}</div><div className="mt-1 text-xs font-medium text-stone-500">{label}</div></div>)}</div><Button onClick={() => navigate("about")} variant="ghost" className="mt-6 px-0">Discover our purpose <ArrowRight className="h-4 w-4" /></Button></div></div></section>

    <section className="bg-white py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Latest Results" title={resultsTitle} text={resultsText} action={<Button variant="secondary" onClick={() => navigate("result-archive")}>View result archive</Button>} /><div className="border-y border-stone-200">{resultRows.map((row) => <button key={row.name} onClick={() => row.status === "Declared" && navigate("results")} className="group grid w-full gap-3 border-b border-stone-200 px-1 py-5 text-left last:border-b-0 md:grid-cols-[1fr_180px_120px_120px] md:items-center"><div><h3 className="font-semibold text-[#4a131c] group-hover:text-[#8d1c2f]">{row.name}</h3><p className="mt-1 text-xs text-stone-500">{row.programme}</p></div><span className="text-sm text-stone-600">{row.date}</span><StatusBadge tone={row.status === "Declared" ? "green" : "amber"}>{row.status}</StatusBadge><span className="inline-flex items-center justify-end gap-1 text-sm font-semibold text-[#8d1c2f]">{row.status === "Declared" ? "Check result" : "View details"}<ChevronRight className="h-4 w-4 transition group-hover:transtone-x-1" /></span></button>)}</div></div></section>

    <section className="bg-[#fbf4f5] py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Academic Pathways" title={programmesTitle} text={programmesText} action={<Button variant="ghost" onClick={() => navigate("programmes")} className="px-0">Explore all programmes <ArrowRight className="h-4 w-4" /></Button>} /><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">{programmes.map((item) => <button onClick={() => navigate("programmes")} key={item.title} className="group text-left"><div className="overflow-hidden"><img src={item.image} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="pt-5"><h3 className="text-lg font-semibold text-[#4a131c] group-hover:text-[#8d1c2f]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8d1c2f]">View details <ArrowRight className="h-4 w-4 transition group-hover:transtone-x-1" /></span></div></button>)}</div></div></section>

    <section className="overflow-hidden bg-[#520f1a] py-16 text-white md:py-24"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="mb-10 max-w-2xl"><div className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#ff9245]">Examination Cycle</div><h2 className="text-[clamp(1.8rem,3.1vw,2.7rem)] font-semibold tracking-[-.035em]">{examsTitle}</h2><p className="mt-4 text-sm leading-7 text-stone-100">{examsText}</p></div><div className="relative"><div className="absolute left-5 top-5 h-[calc(100%-40px)] w-px bg-white/20 md:left-0 md:top-5 md:h-px md:w-full" /><motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }} className="absolute left-0 top-5 hidden h-0.5 w-full origin-left bg-[#fb791c] md:block" /><div className="grid gap-8 md:grid-cols-5">{[["01", "Registration Opens", "01 Sep 2026"], ["02", "Admit Card Released", "05 Oct 2026"], ["03", "Examination Begins", "18 Oct 2026"], ["04", "Evaluation", "12 Nov 2026"], ["05", "Result Declaration", "18 Dec 2026"]].map(([number, title, date]) => <div key={number} className="relative flex gap-5 pl-1 md:block md:pl-0"><div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-[#520f1a] bg-[#fb791c] text-xs font-bold">{number}</div><div className="md:mt-5"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs text-stone-200">{date}</p></div></div>)}</div></div><Button variant="light" onClick={() => navigate("examinations")} className="mt-10">View examination calendar</Button></div></section>

    <section className="bg-white py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Official Updates" title={newsTitle} text={newsText} action={<Button variant="ghost" onClick={() => navigate("news")} className="px-0">View all news <ArrowRight className="h-4 w-4" /></Button>} /><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]"><button onClick={() => navigate("news-detail")} className="group text-left"><div className="overflow-hidden"><img src={displayNews[0].image} alt="Graduates celebrating academic success" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.025]" /></div><div className="mt-5 flex items-center gap-3 text-xs"><StatusBadge tone="blue">{displayNews[0].category}</StatusBadge><span className="text-stone-500">{displayNews[0].date}</span></div><h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#4a131c] group-hover:text-[#8d1c2f]">{displayNews[0].title}</h3><p className="mt-3 text-sm leading-6 text-stone-600">{displayNews[0].summary}</p></button><div className="border-t border-stone-200 lg:border-l lg:border-t-0 lg:pl-8">{displayNews.slice(1, 5).map((item) => <button onClick={() => navigate("news-detail")} key={item.title} className="group flex w-full items-start justify-between gap-5 border-b border-stone-200 py-5 text-left first:pt-0"><div><div className="text-[11px] font-bold uppercase tracking-wider text-[#d85d05]">{item.category} <span className="ml-2 font-medium normal-case tracking-normal text-stone-400">{item.date}</span></div><h3 className="mt-2 text-sm font-semibold leading-6 text-[#4a131c] group-hover:text-[#8d1c2f]">{item.title}</h3></div><ArrowRight className="mt-6 h-4 w-4 shrink-0 text-stone-400 transition group-hover:transtone-x-1 group-hover:text-[#8d1c2f]" /></button>)}</div></div></div></section>
    <RecognitionSection navigate={navigate} /><StudentServices navigate={navigate} /><GalleryStrip navigate={navigate} /><HelpCta navigate={navigate} />
  </>;
}

function AboutPage({ navigate }: { navigate: Navigate }) {
  const { cmsData } = React.useContext(CmsContext);
  const safeCms = cmsData || {};

  const heroTitle = safeCms['about.hero.title'] || "Building trust through fair and accessible education";
  const heroText = safeCms['about.hero.text'] || "A learner-centred examination authority concept designed around integrity, inclusion and dependable public services.";
  const heroImage = safeCms['about.hero.image'] || images.about;

  const orgTitle = safeCms['about.org.title'] || "Education that remains open, credible and connected";
  const orgImage = safeCms['about.org.image'] || images.campus;
  const missionText = safeCms['about.mission.text'] || "Deliver fair assessment and accessible academic services.";
  const visionText = safeCms['about.vision.text'] || "A trusted digital education ecosystem for every learner.";

  const principlesTitle = safeCms['about.principles.title'] || "What informs every decision";
  const milestonesTitle = safeCms['about.milestones.title'] || "A continuous journey toward better services";

  return <><PageHero title={heroTitle} text={heroText} label="About Us" image={heroImage} navigate={navigate} />
    <section className="py-10 md:py-16"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center"><img src={orgImage} alt="Students walking through a university campus" className="aspect-[4/3] h-full w-full object-cover" /><div><SectionHeading eyebrow="Our Organization" title={orgTitle} /><div className="space-y-4 text-[15px] leading-7 text-stone-600"><p>The Thar Board of School &amp; Technical Education was established Under Indian Trust Act 1882 IV48/2013 Registred with planning commission (New Delhi), Govt. of India. TBSTE is a ISO 9001 : 2008 Certified Organization. The Board head office is situated at Centre of India District-Etawah, Uttar Pradesh.</p><p>The TBSTE is reputed to disseminate life oriented education and job oriented Modern education. The board offers secondary &amp; Seinor secondary programmes in regular, Private &amp; Open Schooling mode.</p><p>TBSTE is the only Board who has introduced the Door Step education for the candidate who are not able even to go school. For Such Candidates Board Deside to setup a open schooling branch which provide the secondary &amp; seinor secondary education at their door step. TBSTE also provided free education to candidates who belong from tribal areas, rular areas, below poority line, widow, handicape.</p><p>TBSTE is regular working on the curriculam of new courses (Certificate Course, Diploma Course) which will be launched in up coming years. Our Hon&apos;ble Chairman is trying to impart knowledge to large number of Students.</p></div><div className="mt-8 grid grid-cols-2 gap-6 border-t border-stone-200 pt-7"><div><h3 className="font-semibold text-[#4a131c]">Mission</h3><p className="mt-2 text-sm leading-6 text-stone-600">{missionText}</p></div><div><h3 className="font-semibold text-[#4a131c]">Vision</h3><p className="mt-2 text-sm leading-6 text-stone-600">{visionText}</p></div></div></div></div></section>
    <section className="bg-[#fbf4f5] py-10 md:py-16"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Guiding Principles" title={principlesTitle} align="center" /><div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 md:grid-cols-3">{[[ShieldCheck, "Integrity", "Consistent assessment standards and secure academic records."], [Accessibility, "Accessibility", "Clear services designed for diverse learner needs."], [Sparkles, "Progress", "Technology that reduces friction without compromising trust."]].map(([Icon, title, text]) => { const I = Icon as LucideIcon; return <div className="bg-white p-7 text-center" key={title as string}><I className="mx-auto h-7 w-7 text-[#8d1c2f]" /><h3 className="mt-4 text-lg font-semibold text-[#4a131c]">{title as string}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{text as string}</p></div>; })}</div></div></section>
    <section className="py-10 md:py-16"><div className="mx-auto max-w-[1000px] px-5 md:px-8"><SectionHeading eyebrow="Milestones" title={milestonesTitle} /><div className="border-l-2 border-stone-100 pl-7">{[["2006", "Institutional foundation", "Academic and examination services established."], ["2014", "Student services digitized", "Online forms and information services introduced."], ["2021", "Digital result platform", "Secure result access and document workflows consolidated."], ["2026", "Unified learner experience", "A modern, accessible portal concept for all stakeholders."]].map(([year, title, text]) => <div key={year} className="relative pb-9 last:pb-0"><span className="absolute -left-[34px] top-1 h-3 w-3 rounded-full bg-[#fb791c] ring-4 ring-white" /><div className="text-xs font-bold text-[#d85d05]">{year}</div><h3 className="mt-1 font-semibold text-[#4a131c]">{title}</h3><p className="mt-1 text-sm text-stone-600">{text}</p></div>)}</div></div></section><RecognitionSection navigate={navigate} /></>;
}

function RecognitionPage({ navigate }: { navigate: Navigate }) {
  const [dbRecs, setDbRecs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/recognition")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDbRecs(data);
      })
      .catch(e => console.error(e));
  }, []);

  const fallbackDocs = ["Educational Recognition Record", "Institutional Registration", "Copyright Registration", "Quality & Compliance Record", "Digital Services Compliance Certification"];

  const displayDocs = dbRecs.length > 0 ? dbRecs.map((r, i) => ({
    title: r.title,
    ref: r.reference,
    url: r.documentUrl || "#"
  })) : fallbackDocs.map((doc, index) => ({
    title: doc,
    ref: "TBSTE/REC/2026/" + (103 + index),
    url: "#"
  }));

  return <><PageHero title="Recognition & approval archive" text="A clear, searchable presentation of institutional records and supporting documents. Use reference codes to verify credentials." label="Recognition" navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1060px] px-5 md:px-8"><div className="grid gap-3 border-y border-stone-200 py-6 last:border-b-0">{displayDocs.map((doc) => <article key={doc.title} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"><div><span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Reference: {doc.ref}</span><h2 className="mt-1 font-semibold text-[#4a131c]">{doc.title}</h2></div>{doc.url !== "#" ? <a href={doc.url} download className="inline-flex h-9 items-center justify-center rounded-lg bg-stone-100 px-4 text-xs font-semibold text-stone-700 hover:bg-[#8d1c2f] hover:text-white transition">View certificate <ExternalLink className="ml-1 h-3 w-3" /></a> : <Button variant="ghost" className="justify-start px-0 md:justify-end">View certificate <ExternalLink className="h-4 w-4" /></Button>}</article>)}</div></div></main></>;
}

function ProgrammesPage({ navigate }: { navigate: Navigate }) {
  const [dbProgs, setDbProgs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/programmes")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDbProgs(data);
      })
      .catch(e => console.error(e));
  }, []);

  const displayProgs = dbProgs.length > 0 ? dbProgs.map(p => ({
    title: p.title,
    eligibility: p.eligibility,
    duration: p.duration,
    image: p.image,
    text: p.text
  })) : programmes;

  return <><PageHero title="Flexible pathways for every learner" text="Explore structured academic and vocational programmes supported by transparent assessment and learner services." label="Programmes" image={images.students} navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="mb-10 flex flex-wrap gap-2">{["All Programmes", "Academic", "Vocational", "Skill Development"].map((item, index) => <button className={"rounded-full px-4 py-2 text-xs font-semibold " + (index === 0 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 bg-white text-stone-600 hover:border-[#8d1c2f]")} key={item}>{item}</button>)}</div><div className="grid gap-10 md:grid-cols-2">{displayProgs.map((item) => <article className="group grid border-b border-stone-200 pb-8 sm:grid-cols-[190px_1fr]" key={item.title}><div className="overflow-hidden"><img src={item.image} alt="" className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="pt-5 sm:pl-6 sm:pt-0"><div className="text-[11px] font-bold uppercase tracking-wider text-[#d85d05]">Academic Programme</div><h2 className="mt-2 text-xl font-semibold text-[#4a131c]">{item.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><span><b className="block text-stone-800">Eligibility</b><span className="text-stone-500">{item.eligibility}</span></span><span><b className="block text-stone-800">Duration</b><span className="text-stone-500">{item.duration}</span></span></div><Button variant="ghost" className="mt-4 px-0">View programme details <ArrowRight className="h-4 w-4" /></Button></div></article>)}</div></div></main><HelpCta navigate={navigate} /></>;
}

function ExaminationsPage({ navigate }: { navigate: Navigate }) {
  const examServices: { title: string; text: string; icon: LucideIcon; page: Page }[] = [
    { title: "Upcoming Examinations", text: "View active and forthcoming examination sessions.", icon: CalendarDays, page: "examinations" },
    { title: "Examination Schedule", text: "Check programme and subject-wise dates.", icon: Clock3, page: "downloads" },
    { title: "Time Table", text: "Download the official examination time table.", icon: FileSpreadsheet, page: "downloads" },
    { title: "Admit Card", text: "Access your examination hall admission card.", icon: UserCheck, page: "student-zone" },
    { title: "Examination Centres", text: "Find centre details and reporting information.", icon: Map, page: "examinations" },
    { title: "Candidate Instructions", text: "Read essential rules before examination day.", icon: ClipboardCheck, page: "downloads" },
  ];
  return <><PageHero title="Examinations, clearly organized" text="Find schedules, candidate instructions, centres, admit card services and the complete examination lifecycle in one place." label="Examinations" image={images.exams} navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><SectionHeading eyebrow="Examination Services" title="Everything you need before examination day" /><div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">{examServices.map((item) => <button onClick={() => navigate(item.page)} key={item.title} className="group bg-white p-6 text-left transition hover:bg-stone-50"><item.icon className="h-6 w-6 text-[#8d1c2f]" /><h2 className="mt-5 font-semibold text-[#4a131c]">{item.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><ArrowRight className="mt-5 h-4 w-4 text-[#8d1c2f] transition group-hover:transtone-x-1" /></button>)}</div></div></main>
    <section className="bg-[#fbf4f5] py-10 md:py-16"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-[.9fr_1.1fr]"><div><SectionHeading eyebrow="Next Session" title="October Public Examination 2026" text="A coordinated timeline keeps students, institutions and centres informed at each stage." /><div className="flex gap-3"><StatusBadge tone="amber">Registration open</StatusBadge><span className="text-sm text-stone-500">18 October-02 November 2026</span></div><Button variant="secondary" className="mt-6" onClick={() => navigate("downloads")}><Download className="h-4 w-4" /> Download time table</Button></div><div className="border-l border-stone-300 pl-7">{[["01 Sep", "Registration Opens", "Online registration and fee payment"], ["05 Oct", "Admit Card Released", "Available from the Student Zone"], ["18 Oct", "Examination Begins", "Reporting time: 9:00 AM"], ["12 Nov", "Evaluation Begins", "Centralized digital evaluation"], ["18 Dec", "Expected Result", "Subject to official confirmation"]].map(([date, title, text], index) => <div key={title} className="relative pb-7 last:pb-0"><span className={`absolute -left-[34px] top-1.5 h-3 w-3 rounded-full ring-4 ring-[#fbf4f5] ${index < 2 ? "bg-lime-500" : "bg-stone-300"}`} /><div className="text-xs font-bold text-[#d85d05]">{date}</div><h3 className="mt-1 text-sm font-semibold text-[#4a131c]">{title}</h3><p className="mt-1 text-xs text-stone-500">{text}</p></div>)}</div></div></section>
    <section className="py-16"><div className="mx-auto grid max-w-[1240px] gap-8 px-5 md:px-8 lg:grid-cols-2"><img src={images.examHall} alt="Examination hall with candidates" className="aspect-[16/9] h-full w-full object-cover" /><div className="bg-[#520f1a] p-7 text-white md:p-10"><div className="text-xs font-bold uppercase tracking-wider text-[#ff9245]">Candidate Guidance</div><h2 className="mt-3 text-2xl font-semibold">Prepare with confidence</h2><p className="mt-4 text-sm leading-7 text-stone-100">Arrive early, carry your valid admit card and photo identification, and review the examination instructions before your scheduled paper.</p><Button variant="light" className="mt-6" onClick={() => navigate("downloads")}>Read candidate instructions</Button></div></div></section></>;
}

function ResultsPage({ navigate }: { navigate: Navigate }) {
  return <><PageHero title="Examination results" text="Access official examination results securely and conveniently. Use your enrollment number or registration number to begin." label="Results" navigate={navigate} /><main className="bg-[#fcf7f8] py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><section className="border border-stone-200 bg-white p-5 md:p-8"><div className="mb-7"><h2 className="text-2xl font-semibold tracking-tight text-[#4a131c]">Find your result</h2><p className="mt-2 text-sm text-stone-600">Select your examination details and enter a valid candidate identifier.</p></div><ResultSearch navigate={navigate} compact /></section><section className="mt-14"><SectionHeading eyebrow="Result Publications" title="Latest results" text="Publication dates and current access status for recent examinations." /><div className="overflow-x-auto border-y border-stone-200 bg-white"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#f9f0f2] text-[11px] uppercase tracking-wider text-stone-500"><tr><th className="px-5 py-4">Examination</th><th className="px-5 py-4">Programme</th><th className="px-5 py-4">Publication date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody>{resultRows.map((row) => <tr key={row.name} className="border-t border-stone-200"><td className="px-5 py-5 font-semibold text-[#4a131c]">{row.name}</td><td className="px-5 py-5 text-sm text-stone-600">{row.programme}</td><td className="px-5 py-5 text-sm text-stone-600">{row.date}</td><td className="px-5 py-5"><StatusBadge tone={row.status === "Declared" ? "green" : "amber"}>{row.status}</StatusBadge></td><td className="px-5 py-5 text-right"><Button onClick={() => navigate(row.status === "Declared" ? "result-detail" : "examinations")} variant="ghost" className="min-h-9 px-2">{row.status === "Declared" ? "Check Result" : "Details"}<ChevronRight className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div></section></div></main></>;
}

function ResultDetailPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [resultData, setResultData] = useState<any>(null);
  useEffect(() => {
    const data = window.sessionStorage.getItem("currentResult");
    if (data) setResultData(JSON.parse(data));
    else navigate("results");
  }, []);
  if (!resultData) return <div className="min-h-screen grid place-items-center"><LoaderCircle className="h-8 w-8 animate-spin text-[#8d1c2f]" /></div>;
  const [downloading, setDownloading] = useState(false);
  function download() { setDownloading(true); window.setTimeout(() => { setDownloading(false); notify("Provisional marksheet prepared for download."); }, 900); }
  
  const subjects = [
    { sNo: "1", name: "Hindi", max: "100", min: "33", th: "60", pr: "20", total: "80", grade: "A" },
    { sNo: "2", name: "English", max: "100", min: "33", th: "58", pr: "18", total: "76", grade: "B+" },
    { sNo: "3", name: "Physics / Trade Theory", max: "100", min: "33", th: "66", pr: "15", total: "81", grade: "A" },
    { sNo: "4", name: "Chemistry / Workshop Cal.", max: "100", min: "33", th: "49", pr: "18", total: "67", grade: "B" },
    { sNo: "5", name: "Biology / Practical", max: "100", min: "33", th: "60", pr: "19", total: "79", grade: "B+" },
  ];

  return <><div className="bg-[#f9eef0] py-6 print:hidden"><div className="mx-auto max-w-[1060px] px-5 md:px-8"><Breadcrumb items={["Results", "Result Details"]} navigate={navigate} /></div></div>
  <main className="bg-[#f9eef0] pb-16 print:bg-white print:p-0"><motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1060px] px-5 md:px-8 print:px-0 print:max-w-none"><div className="overflow-hidden border border-stone-300 bg-white shadow-[0_18px_45px_rgba(13,40,87,.08)] print:border-none print:shadow-none">
    
    <div className="flex flex-col gap-6 border-b-[6px] border-[#8d1c2f] p-6 md:flex-row md:items-center md:justify-between md:p-8"><Logo /><div className="md:text-right print:hidden"><StatusBadge tone="green">Result declared</StatusBadge><p className="mt-2 text-xs text-stone-500">Published: 17 August 2026</p></div></div>
    
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-7 text-center">
        <div className="text-xs font-bold uppercase tracking-[.18em] text-stone-500">Statement of Marks</div>
        <h1 className="mt-2 text-2xl font-semibold text-[#4a131c]">Senior Secondary Examination 2026</h1>
        <p className="mt-1 text-sm text-stone-500">Provisional online result</p>
      </div>
      
      <div className="grid gap-x-10 gap-y-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Student Name", "{resultData.studentName}"], ["Father's Name", "{resultData.fatherName}"], ["Date of Birth", "{new Date(resultData.dob).toLocaleDateString()}"], 
          ["Enrollment Number", "{resultData.enrollmentNumber}"], ["Roll Number", "{resultData.rollNumber}"], ["Programme", "Senior Secondary"], 
          ["Examination", "June Public Examination"], ["Year", "2026"], ["Result Date", "17 August 2026"]
        ].map(([label, value]) => <div key={label} className="border-b border-stone-100 pb-2"><div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</div><div className="mt-1 text-sm font-semibold text-stone-800">{value}</div></div>)}
      </div>
      
      <h2 className="mb-4 text-lg font-semibold text-[#4a131c]">Academic Performance</h2>
      
      <div className="overflow-x-auto border border-stone-300">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[#fdf5f6] text-[11px] uppercase tracking-wider text-stone-600 border-b-2 border-stone-300">
            <tr>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">S.No.</th>
              <th className="px-4 py-3.5 border-r border-stone-300">Subject / Assessment</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Max Marks</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Min Pass Marks</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Theory</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Practical / CA</th>
              <th className="px-4 py-3.5 border-r border-stone-300 text-center">Total</th>
              <th className="px-4 py-3.5 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {(resultData.subjects || []).map((row: any) => 
              <tr key={row.sNo} className="border-t border-stone-200">
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-500">{row.sNo}</td>
                <td className="px-4 py-3 border-r border-stone-200 font-semibold text-stone-800">{row.name}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-600">{row.max}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-600">{row.min}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-800">{row.th}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center text-stone-800">{row.pr}</td>
                <td className="px-4 py-3 border-r border-stone-200 text-center font-bold text-[#4a131c]">{row.total}</td>
                <td className="px-4 py-3 text-center font-bold">{row.grade}</td>
              </tr>
            )}
            
            <tr className="border-t-2 border-stone-300 bg-[#fdf5f6]">
              <td colSpan={2} className="px-4 py-4 text-right font-bold text-stone-800 border-r border-stone-300">Grand Total</td>
              <td className="px-4 py-4 text-center font-bold text-stone-800 border-r border-stone-300">500</td>
              <td colSpan={3} className="border-r border-stone-300"></td>
              <td className="px-4 py-4 text-center font-bold text-xl text-[#8d1c2f] border-r border-stone-300">{resultData.grandTotal}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-2 border-[#8d1c2f] bg-[#fdf5f6] p-6 rounded-lg">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Result Status</span>
          <strong className="block text-3xl text-[#4a131c] uppercase">{resultData.resultStatus} <span className="text-xl font-medium">{resultData.resultStatus === "PASS" ? "(Qualified)" : ""}</span></strong>
        </div>
        <div className="mt-6 md:mt-0 text-center">
          <div className="font-[cursive] text-4xl text-[#8d1c2f] mb-2 transform -rotate-2">Sumai</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 border-t border-stone-300 pt-1">Controller of Examination</div>
        </div>
      </div>
      
      <div className="mt-7 flex flex-col gap-5 border-t border-stone-200 pt-7 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center border border-stone-200 bg-stone-50"><QrCode className="h-11 w-11 text-[#4a131c]" /></div>
          <p className="max-w-xs text-xs leading-5 text-stone-500">Verification ID: TBSTE-R26-1842<br />Scan placeholder or use online verification.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Result</Button>
          <Button variant="secondary" onClick={() => navigate("verification")}><ShieldCheck className="h-4 w-4" /> Verify</Button>
          <Button onClick={download} disabled={downloading}>{downloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {downloading ? "Preparing..." : "Download Marksheet"}</Button>
        </div>
      </div>
      
      <div className="mt-7 border-t border-stone-200 pt-4 text-[11px] leading-5 text-stone-500 text-justify">
        <strong>Disclaimer:</strong> This is a digitally signed, computer generated Mark Sheet. All contents of this Mark Sheet can be verified for authenticity by the process of online verification through scanning the QR code printed above. The Board shall not be responsible for any direct or indirect financial losses, any loss of goodwill or reputation, or any other loss or damage caused by any incorrect / fraudulent information.
      </div>
    </div>
  </div></motion.div></main></>;
}

function VerificationPage({ navigate }: { navigate: Navigate }) {
  const [verified, setVerified] = useState(false); const [loading, setLoading] = useState(false);
  function verify(event: FormEvent) { event.preventDefault(); setLoading(true); window.setTimeout(() => { setLoading(false); setVerified(true); }, 900); }
  return <><PageHero title="Verify result or certificate" text="Enter the document details below to simulate secure verification of an academic record." label="Document Verification" navigate={navigate} /><main className="bg-[#fcf7f8] py-8 md:py-12"><div className="mx-auto max-w-[900px] px-5 md:px-8"><div className="mb-5 flex gap-3 bg-stone-50 p-4 text-xs leading-5 text-stone-800"><CircleHelp className="h-5 w-5 shrink-0" /><p>This is a UI demonstration only. It does not connect to a government or institutional verification database.</p></div><form onSubmit={verify} className="border border-stone-200 bg-white p-6 md:p-9"><div className="grid gap-5 md:grid-cols-2"><SelectField label="Document Type" required options={["Result", "Marksheet", "Certificate", "Migration Certificate"]} /><Field label="Roll Number" required placeholder="Enter enrollment number" /><Field label="Certificate Number" required placeholder="Enter certificate number" /><Field label="Verification Code" required placeholder="e.g. NAB-R26-1842-0098" /></div><Button type="submit" disabled={loading} className="mt-7 w-full sm:w-auto">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} {loading ? "Verifying Document..." : "Verify Document"}</Button></form><AnimatePresence>{verified && <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border border-lime-200 bg-white"><div className="flex items-center gap-3 bg-lime-600 p-5 text-white"><CheckCircle2 className="h-7 w-7" /><div><div className="text-xs font-bold uppercase tracking-wider text-lime-100">Verification complete</div><h2 className="text-xl font-semibold">Document Verified</h2></div></div><div className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">{[["Student", "{resultData.studentName}"], ["Document", "Senior Secondary Marksheet"], ["Roll Number", "{resultData.enrollmentNumber}"], ["Issue Date", "17 August 2026"], ["Programme", "Senior Secondary"], ["Verification ID", "NAB-R26-1842-0098"]].map(([label, value]) => <div key={label}><span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</span><b className="mt-1 block text-sm text-stone-800">{value}</b></div>)}</div></motion.section>}</AnimatePresence></div></main></>;
}

function ResultArchivePage({ navigate }: { navigate: Navigate }) {
  const rows = [...resultRows, { name: "Senior Secondary Examination 2025", date: "12 August 2025", status: "Archived", programme: "Senior Secondary" }, { name: "Secondary Examination 2025", date: "02 July 2025", status: "Archived", programme: "Secondary" }];
  return <><PageHero title="Result archive" text="Browse published examination results by programme, session and year." label="Result Archive" navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1100px] px-5 md:px-8"><div className="grid gap-4 border-b border-stone-200 pb-7 sm:grid-cols-3"><SelectField label="Programme" options={["All Programmes", "Secondary", "Senior Secondary", "Vocational"]} /><SelectField label="Year" options={["2026", "2025", "2024", "2023"]} /><div className="self-end"><Button className="h-12 w-full"><Search className="h-4 w-4" /> Search Archive</Button></div></div><div className="mt-8 border-y border-stone-200">{rows.map((row) => <div key={row.name} className="grid gap-3 border-b border-stone-200 py-5 last:border-0 md:grid-cols-[1fr_170px_110px_120px] md:items-center"><div><h2 className="font-semibold text-[#4a131c]">{row.name}</h2><p className="mt-1 text-xs text-stone-500">{row.programme}</p></div><span className="text-sm text-stone-500">{row.date}</span><StatusBadge tone={row.status === "Declared" ? "green" : row.status === "Upcoming" ? "amber" : "slate"}>{row.status}</StatusBadge><Button variant="ghost" className="justify-start px-0 md:justify-end" onClick={() => navigate("results")}>View result <ChevronRight className="h-4 w-4" /></Button></div>)}</div></div></main></>;
}

function NewsPage({ navigate }: { navigate: Navigate }) {
  const [filter, setFilter] = useState("All"); 
  const [query, setQuery] = useState("");
  const [dbNews, setDbNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/editorial?kind=News")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDbNews(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const displayNews = dbNews.length > 0 ? dbNews.map(item => ({
    category: item.category,
    date: item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "Latest",
    title: item.title,
    summary: item.summary,
    image: item.imageUrl || images.ceremony
  })) : newsItems;

  const filtered = displayNews.filter((item) => 
    (filter === "All" || item.category === filter.replace("s", "")) && 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return <><PageHero title="News & announcements" text="Official updates on results, examinations, admissions, notices and academic services." label="News & Announcements" image={images.ceremony} navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="flex flex-col gap-5 border-b border-stone-200 pb-7 lg:flex-row lg:items-center lg:justify-between"><label className="relative block w-full max-w-md"><span className="sr-only">Search announcements</span><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full rounded-lg border border-stone-300 pl-10 pr-4 text-sm outline-none focus:border-[#8d1c2f]" placeholder="Search announcements" /></label><div className="flex gap-2 overflow-x-auto pb-1">{["All", "Result", "Examination", "Admission", "Notice", "Circular"].map((item) => <button onClick={() => setFilter(item)} key={item} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${filter === item ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600"}`}>{item}</button>)}</div></div><div>{filtered.length ? <motion.div layout className="mt-10 grid gap-x-7 gap-y-11 md:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <motion.article layout key={item.title} className="group"><button onClick={() => navigate("news-detail")} className="block w-full overflow-hidden text-left"><img src={item.image} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.035]" /><div className="mt-5 flex items-center gap-3"><StatusBadge tone="blue">{item.category}</StatusBadge><span className="text-xs text-stone-500">{item.date}</span></div><h2 className="mt-3 text-xl font-semibold leading-snug text-[#4a131c] group-hover:text-[#8d1c2f]">{item.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.summary}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8d1c2f]">Read more <ArrowRight className="h-4 w-4 transition group-hover:transtone-x-1" /></span></button></motion.article>)}</motion.div> : <div className="py-24 text-center"><Newspaper className="mx-auto h-10 w-10 text-stone-300" /><h2 className="mt-4 font-semibold text-stone-700">No announcements available</h2><p className="mt-2 text-sm text-stone-500">Try changing your search or category filter.</p></div>}<div className="mt-14 flex justify-center gap-2">{[1, 2, 3].map((item) => <button key={item} className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold ${item === 1 ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600"}`}>{item}</button>)}</div></div></div></main></>;
}

function NewsDetailPage({ navigate }: { navigate: Navigate }) {
  return <><div className="bg-[#fbf4f5] py-5"><div className="mx-auto max-w-[1160px] px-5 md:px-8"><Breadcrumb items={["News", "Result Declaration"]} navigate={navigate} /></div></div><main className="py-12 md:py-16"><div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[1fr_300px]"><article><div className="flex items-center gap-3"><StatusBadge tone="blue">Result</StatusBadge><span className="text-xs text-stone-500">Published 17 August 2026</span></div><h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,4.6vw,4.1rem)] font-semibold leading-[1.04] tracking-[-.045em] text-[#4a131c]">Senior Secondary Examination Result 2026 declared</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">Students can now access their verified digital result and provisional marksheet through the official examination portal.</p><img src={images.graduation} alt="Graduates celebrating academic achievement" className="mt-9 aspect-[16/9] w-full object-cover" /><div className="prose-demo mt-9 space-y-5 text-[15px] leading-8 text-stone-700"><p>The Thar Board of School and Technical Education has published the result of the Senior Secondary Examination 2026. Candidates may use their enrollment number, registration details and date of birth to access the result securely.</p><h2 className="text-2xl font-semibold text-[#4a131c]">How to access the result</h2><p>Open the Results section, choose Senior Secondary Examination 2026, and enter the candidate details exactly as shown on the admit card. After successful lookup, the provisional marksheet may be viewed, printed or downloaded.</p><p>Students who identify a discrepancy should contact the examination helpdesk and keep their enrollment number and registration number ready. Revaluation and document services are available through the Student Zone.</p></div><div className="mt-10 border border-stone-200 bg-[#fcf7f8] p-5"><h3 className="font-semibold text-[#4a131c]">Attachments</h3><button className="mt-4 flex w-full items-center justify-between gap-4 border-t border-stone-200 pt-4 text-left"><span className="flex items-center gap-3"><FileText className="h-6 w-6 text-red-500" /><span><b className="block text-sm text-stone-800">Result declaration notice</b><span className="text-xs text-stone-500">PDF, 820 KB</span></span></span><Download className="h-4 w-4 text-[#8d1c2f]" /></button></div></article><aside><div className="sticky top-20 border-t-4 border-[#8d1c2f] bg-[#fbf4f5] p-5"><h2 className="font-semibold text-[#4a131c]">Latest Updates</h2><div className="mt-3">{newsItems.slice(1, 5).map((item) => <button key={item.title} onClick={() => navigate("news-detail")} className="block w-full border-b border-stone-200 py-4 text-left"><span className="text-[10px] font-bold uppercase tracking-wider text-[#d85d05]">{item.category}</span><h3 className="mt-1 text-sm font-semibold leading-5 text-stone-700 hover:text-[#8d1c2f]">{item.title}</h3><span className="mt-1 block text-[11px] text-stone-400">{item.date}</span></button>)}</div></div></aside></div></main></>;
}

function NoticesPage({ navigate }: { navigate: Navigate }) {
  const [dbNotices, setDbNotices] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All categories");

  const fallbackNotices = ["Revaluation application window for June Examination 2026", "Instructions for accredited examination centres", "Correction window for candidate registration data", "Extension of online admission submission date", "Updated guidelines for practical examinations", "Public notice regarding unauthorized websites"];

  useEffect(() => {
    fetch("/api/editorial?kind=Notices")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDbNotices(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const displayNotices = dbNotices.length > 0 ? dbNotices.map((n, i) => ({
    index: String(dbNotices.length - i).padStart(2, "0"),
    date: n.publishDate ? new Date(n.publishDate).toLocaleDateString() : "Latest",
    category: n.category,
    title: n.title,
    ref: "TBSTE/NOTICE/2026/" + String(100 + dbNotices.length - i)
  })) : fallbackNotices.map((title, i) => ({
    index: String(17 - i).padStart(2, "0"),
    date: "Aug 2026",
    category: i % 2 ? "Circular" : "Notice",
    title,
    ref: "TBSTE/NOTICE/2026/" + (112 - i)
  }));

  const filteredNotices = displayNotices.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCategory = filterCategory === "All categories" || item.category === filterCategory;
    return matchesQuery && matchesCategory;
  });

  return <><PageHero title="Notices & circulars" text="Important administrative instructions, official circulars and time-sensitive academic notices." label="Notices / Circulars" navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1060px] px-5 md:px-8"><div className="grid gap-4 border-b border-stone-200 pb-7 sm:grid-cols-[1fr_190px_auto]"><label className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-11 w-full rounded-lg border border-stone-300 pl-10 pr-3 text-sm outline-none focus:border-[#8d1c2f]" placeholder="Search notices" /></label><select value={category} onChange={e => setCategory(e.target.value)} className="h-11 rounded-lg border border-stone-300 px-3 text-sm text-stone-600 outline-none focus:border-[#8d1c2f]"><option value="All categories">All categories</option><option value="Notice">Notice</option><option value="Circular">Circular</option><option value="Announcement">Announcement</option></select><Button onClick={() => { setFilterQuery(query); setFilterCategory(category); }}><Filter className="h-4 w-4" /> Apply</Button></div><div className="mt-8 border-y border-stone-200">{filteredNotices.map((item, index) => <article key={item.title} className="grid gap-4 border-b border-stone-200 py-5 last:border-b-0 md:grid-cols-[100px_1fr_120px] md:items-center"><div className="text-center md:text-left"><b className="block text-2xl text-[#8d1c2f]">{item.index}</b><span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{item.date}</span></div><div><div className="flex gap-2"><StatusBadge tone={item.category === "Circular" ? "blue" : "amber"}>{item.category}</StatusBadge>{index < 2 && <StatusBadge tone="red">Important</StatusBadge>}</div><h2 className="mt-2 font-semibold text-[#4a131c]">{item.title}</h2><p className="mt-1 text-xs text-stone-500">Reference: {item.ref}</p></div><Button variant="ghost" className="justify-start px-0 md:justify-end">View PDF <ExternalLink className="h-4 w-4" /></Button></article>)}</div></div></main></>;
}
function DownloadsPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [dbDocs, setDbDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDbDocs(data);
      })
      .catch(e => console.error(e));
  }, []);

  const displayRows: any[] = dbDocs.length > 0 ? dbDocs.map(doc => ({
    title: doc.title,
    category: doc.category + "s", 
    date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Latest",
    size: Math.round(doc.size / 1024) + " KB",
    type: doc.contentType.includes("pdf") ? "PDF" : "Doc",
    id: doc._id
  })) : documentRows;

  const rows = displayRows.filter((row) => 
    (category === "All" || row.category.toLowerCase().includes(category.toLowerCase().replace("s", ""))) && 
    row.title.toLowerCase().includes(query.toLowerCase())
  );

  return <><PageHero title="Downloads & documents" text="Find official forms, syllabi, time tables, circulars and student documents." label="Downloads" image={images.diploma} navigate={navigate} /><main className="bg-[#fcf7f8] py-8 md:py-12"><div className="mx-auto max-w-[1160px] px-5 md:px-8"><div className="grid gap-4 border border-stone-200 bg-white p-5 md:grid-cols-[1fr_230px_auto]"><label className="relative"><span className="sr-only">Search documents</span><Search className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full rounded-lg border border-stone-300 pl-10 pr-3 text-sm outline-none focus:border-[#8d1c2f]" placeholder="Search documents" /></label><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-lg border border-stone-300 px-3 text-sm text-stone-600 outline-none focus:border-[#8d1c2f]"><option value="All">All</option><option value="Forms">Forms</option><option value="Syllabus">Syllabus</option><option value="Prospectus">Prospectus</option><option value="Circulars">Circulars</option><option value="Notices">Notices</option></select><Button variant="secondary"><SlidersHorizontal className="h-4 w-4" /> Filters</Button></div><div className="mt-8 overflow-x-auto border-y border-stone-200 bg-white">{rows.length ? <table className="w-full min-w-[760px] text-left"><thead className="bg-[#f9eef0] text-[11px] uppercase tracking-wider text-stone-500"><tr><th className="px-5 py-4">Document</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Published</th><th className="px-5 py-4">File</th><th className="px-5 py-4 text-right">Download</th></tr></thead><tbody>{rows.map((row) => <tr key={row.title} className="border-t border-stone-200"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center bg-red-50 text-red-600"><FileText className="h-5 w-5" /></span><span className="text-sm font-semibold text-[#4a131c]">{row.title}</span></div></td><td className="px-5 py-4 text-sm text-stone-600">{row.category}</td><td className="px-5 py-4 text-sm text-stone-500">{row.date}</td><td className="px-5 py-4 text-xs text-stone-500">{row.type}<br />{row.size}</td><td className="px-5 py-4 text-right">{row.id ? <a href={"/api/documents?id=" + row.id} download className="inline-flex h-9 items-center justify-center rounded-lg bg-stone-100 px-4 text-xs font-semibold text-stone-700 hover:bg-[#8d1c2f] hover:text-white transition">Download</a> : <Button onClick={() => notify("Download started.")} variant="ghost" className="min-h-9 px-2">Download</Button>}</td></tr>)}</tbody></table> : <div className="py-20 text-center"><FileText className="mx-auto h-10 w-10 text-stone-300" /><h2 className="mt-3 font-semibold text-stone-700">No documents available</h2><p className="mt-1 text-sm text-stone-500">Try a different search or category.</p></div>}</div></div></main></>;
}

function StudentZonePage({ navigate }: { navigate: Navigate }) {
  const items: { title: string; text: string; icon: LucideIcon; page: Page }[] = [
    { title: "Student Login", text: "Access your learner profile and active applications.", icon: LogIn, page: "services" }, { title: "Check Result", text: "Find your latest official examination result.", icon: Search, page: "results" }, { title: "Download Certificate", text: "Access eligible academic documents.", icon: Award, page: "verification" }, { title: "Download Forms", text: "Get applications and service request forms.", icon: FileDown, page: "downloads" }, { title: "Examination Schedule", text: "Track dates for your next examination.", icon: CalendarDays, page: "examinations" }, { title: "Study Material", text: "Browse programme-specific learning resources.", icon: BookOpen, page: "downloads" }, { title: "Application Status", text: "Track enrolment and document requests.", icon: ClipboardCheck, page: "services" }, { title: "Help & Support", text: "Connect with student service specialists.", icon: LifeBuoy, page: "contact" },
  ];
  return <><PageHero title="Your student service centre" text="One place for results, schedules, documents, applications and academic support." label="Student Zone" image={images.students} navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <button onClick={() => navigate(item.page)} key={item.title} className="group min-h-52 bg-white p-6 text-left transition hover:bg-stone-50"><item.icon className="h-7 w-7 text-[#8d1c2f]" /><h2 className="mt-6 text-lg font-semibold text-[#4a131c]">{item.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p><ArrowRight className="mt-4 h-4 w-4 text-[#8d1c2f] transition group-hover:transtone-x-1" /></button>)}</div></div></main><section className="bg-[#520f1a] py-14 text-white"><div className="mx-auto flex max-w-[1100px] flex-col gap-7 px-5 md:flex-row md:items-center md:justify-between md:px-8"><div><div className="text-xs font-bold uppercase tracking-wider text-[#ff9245]">Secure Student Access</div><h2 className="mt-2 text-2xl font-semibold">Continue to your learner account</h2><p className="mt-2 text-sm text-stone-100">Sign in to view active applications and personalized services.</p></div><Button variant="light"><LogIn className="h-4 w-4" /> Student Login</Button></div></section></>;
}

function ServicesPage({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [reference, setReference] = useState(""); const [searched, setSearched] = useState(false);
  return <><PageHero title="Online services" text="Track applications, request documents and access secure learner services." label="Online Services" navigate={navigate} /><main className="bg-[#fcf7f8] py-8 md:py-12"><div className="mx-auto max-w-[1000px] px-5 md:px-8"><div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><section className="border border-stone-200 bg-white p-6 md:p-8"><h2 className="text-xl font-semibold text-[#4a131c]">Track application status</h2><p className="mt-2 text-sm text-stone-600">Enter the application reference issued after submission.</p><form onSubmit={(e) => { e.preventDefault(); if (reference.length > 3) setSearched(true); }} className="mt-6"><Field label="Application Reference" required placeholder="e.g. APP-2026-01842" value={reference} onChange={setReference} /><Button type="submit" className="mt-4 w-full"><Search className="h-4 w-4" /> Track Application</Button></form>{searched && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 bg-lime-50 p-4 text-sm text-lime-800"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" /> Application approved</div><p className="mt-2 text-xs leading-5">Your document request has been approved and is ready for download.</p></motion.div>}</section><section className="bg-[#621421] p-6 text-white md:p-8"><h2 className="text-xl font-semibold">Document requests</h2><p className="mt-2 text-sm leading-6 text-stone-100">Apply for migration certificates, duplicate marksheets and verification letters.</p><div className="mt-6 space-y-2">{["Migration Certificate", "Duplicate Marksheet", "Verification Letter"].map((item) => <button key={item} onClick={() => notify(`${item} request flow opened.`)} className="flex w-full items-center justify-between border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10">{item}<ArrowRight className="h-4 w-4" /></button>)}</div></section></div></div></main></>;
}

function GalleryPage({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [dbPhotos, setDbPhotos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gallery?category=" + activeTab)
      .then(res => res.json())
      .then(data => {
        if (data) setDbPhotos(data);
      })
      .catch(e => console.error(e));
  }, [activeTab]);

  const fallbackGallery = [images.graduation, images.examHall, images.campus, images.ceremony, images.students, images.graduates, images.conversation, images.celebrate];

  const displayPhotos = dbPhotos.length > 0 ? dbPhotos.map(p => p.imageUrl) : fallbackGallery;

  return <><PageHero title="Institutional gallery" text="Moments from academic life, examinations, award ceremonies and learner activities." label="Gallery" navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="mb-8 flex gap-2 overflow-x-auto">{["All", "Events", "Examinations", "Award Ceremonies", "Students", "Centres"].map((item) => <button key={item} onClick={() => setActiveTab(item)} className={"shrink-0 rounded-full px-4 py-2 text-xs font-semibold " + (activeTab === item ? "bg-[#8d1c2f] text-white" : "border border-stone-300 text-stone-600 hover:border-[#8d1c2f]")}>{item}</button>)}</div>{displayPhotos.length > 0 ? <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">{displayPhotos.map((image, index) => <button onClick={() => setSelected(image)} key={index} className="group relative mb-4 block w-full overflow-hidden"><img src={image} alt={"Institutional gallery moment " + (index + 1)} className="w-full object-cover transition duration-500 group-hover:scale-[1.035]" /></button>)}</div> : <div className="py-20 text-center text-stone-400">No images found in this category.</div>}</div></main><HelpCta navigate={navigate} />
  
  {selected && <div onClick={() => setSelected(null)} className="fixed inset-0 z-[120] grid place-items-center bg-black/90 p-5 cursor-zoom-out"><img src={selected} alt="Enlarged view" className="max-h-[90vh] max-w-full object-contain" /></div>}
  </>;
}

function ContactPage({ navigate }: { navigate: Navigate }) {
  const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  function submit(e: FormEvent) { e.preventDefault(); setSending(true); window.setTimeout(() => { setSending(false); setSent(true); }, 900); }
  return <><PageHero title="Contact the Board" text="Connect with our student services and examination support teams." label="Contact Us" image={images.conversation} navigate={navigate} /><main className="py-8 md:py-12"><div className="mx-auto grid max-w-[1160px] gap-12 px-5 md:px-8 lg:grid-cols-[.8fr_1.2fr]"><section><SectionHeading eyebrow="Get in Touch" title="We are here to help" text="For result queries, keep your enrollment number and registration number available when contacting support." /><div className="mt-7 space-y-5">{[[MapPin, "Office Address", "Centre of India District-Etawah, Uttar Pradesh"], [Phone, "Examination Helpline", "+91 8869844584"], [Mail, "Email", "help@tbste.edu"], [Clock3, "Working Hours", "Monday-Friday, 9:30 AM-5:30 PM"]].map(([Icon, label, value]) => { const I = Icon as LucideIcon; return <div key={label as string} className="flex gap-4"><I className="mt-1 h-5 w-5 shrink-0 text-[#8d1c2f]" /><div><h3 className="text-sm font-semibold text-[#4a131c]">{label as string}</h3><p className="mt-1 max-w-xs text-sm leading-6 text-stone-600">{value as string}</p></div></div>; })}</div></section><form onSubmit={submit} className="border border-stone-200 bg-[#fcf7f8] p-6 md:p-8"><h2 className="text-xl font-semibold text-[#4a131c]">Send a message</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Full Name" required placeholder="Your full name" /><Field label="Email" required type="email" placeholder="you@example.com" /><Field label="Phone" placeholder="Phone number" /><SelectField label="Subject" options={["Result Query", "Examination Query", "Document Service", "Admission", "General"]} /></div><label className="mt-5 block text-sm font-semibold text-stone-700">Message<textarea required rows={5} placeholder="Describe how we can help" className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3.5 text-sm outline-none focus:border-[#8d1c2f]" /></label><Button type="submit" disabled={sending} className="mt-5">{sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? "Sending..." : "Send Message"}</Button>{sent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 bg-lime-50 p-3 text-sm font-medium text-lime-700"><CheckCircle2 className="h-5 w-5" /> Your message has been submitted successfully.</motion.div>}</form></div><div className="mx-auto mt-14 max-w-[1160px] px-5 md:px-8"><div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#f1e0e3]"><div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#bd939a_1px,transparent_1px),linear-gradient(90deg,#bd939a_1px,transparent_1px)] [background-size:36px_36px]" /><div className="relative text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#8d1c2f] text-white shadow-lg"><MapPin className="h-6 w-6" /></span><h2 className="mt-3 font-semibold text-[#4a131c]">Centre of India District-Etawah</h2><p className="mt-1 text-xs text-stone-600">Uttar Pradesh, India</p></div></div></div></main><HelpCta navigate={navigate} /></>;
}

const adminNav: { label: string; page: Page; icon: LucideIcon }[] = [
  { label: "Dashboard", page: "admin-dashboard", icon: LayoutDashboard },
  { label: "Results", page: "admin-results", icon: FileCheck2 },
  { label: "Students", page: "admin-students", icon: Users },
  { label: "Examinations", page: "admin-exams", icon: CalendarDays },
  { label: "News", page: "admin-news", icon: Newspaper },
  { label: "Notices", page: "admin-notices", icon: Bell },
  { label: "Downloads", page: "admin-downloads", icon: Download },
  { label: "Programmes", page: "admin-programmes", icon: GraduationCap },
  { label: "Gallery", page: "admin-gallery", icon: ImageIcon },
  { label: "Recognition", page: "admin-recognition", icon: Award },
  { label: "Contact Messages", page: "admin-messages", icon: MessageSquare },
  { label: "Website Settings", page: "admin-settings", icon: Settings },
];

function AdminHeader({ title, text, actions }: { title: string; text?: string; actions?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">{title}</h1>{text && <p className="mt-2 text-sm text-stone-500">{text}</p>}</div>{actions && <div className="flex flex-wrap gap-2">{actions}</div>}</div>;
}

function AdminShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const pageTitle = adminNav.find((item) => item.page === page)?.label || (page === "admin-import" ? "Import Results" : "Administration");
  return <div className="min-h-screen bg-[#faf5f6] text-stone-800"><aside className={`fixed inset-y-0 left-0 z-50 w-[252px] border-r border-stone-800 bg-[#360e14] text-white transition-transform lg:transtone-x-0 ${open ? "transtone-x-0" : "-transtone-x-full"}`}><div className="flex h-[72px] items-center border-b border-white/10 px-5"><Logo inverse compact /><button onClick={() => setOpen(false)} className="ml-auto lg:hidden" aria-label="Close sidebar"><X className="h-5 w-5" /></button></div><nav className="h-[calc(100vh-136px)] overflow-y-auto px-3 py-4" aria-label="Admin navigation">{adminNav.map((item) => <button key={item.label} onClick={() => { navigate(item.page); setOpen(false); }} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${page === item.page || (page === "admin-import" && item.page === "admin-results") ? "bg-[#a1283c] text-white" : "text-stone-300 hover:bg-white/7 hover:text-white"}`}><item.icon className="h-[18px] w-[18px]" />{item.label}</button>)}</nav><button onClick={() => navigate("home")} className="absolute bottom-0 left-0 flex h-16 w-full items-center gap-3 border-t border-white/10 px-6 text-sm text-stone-300 hover:bg-white/5 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to public website</button></aside>
    <div className="lg:pl-[252px]"><header className="sticky top-0 z-40 flex h-[72px] items-center border-b border-stone-200 bg-white px-4 md:px-7"><button onClick={() => setOpen(true)} className="mr-3 grid h-10 w-10 place-items-center rounded-lg border border-stone-200 lg:hidden" aria-label="Open sidebar"><Menu className="h-5 w-5" /></button><div className="hidden text-sm font-semibold text-stone-700 sm:block">{pageTitle}</div><div className="ml-auto flex items-center gap-2 md:gap-4"><label className="relative hidden md:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input className="h-9 w-60 rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search administration" /></label><button className="relative grid h-10 w-10 place-items-center rounded-lg border border-stone-200 text-stone-500"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" /></button><button className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#faebee] text-xs font-bold text-[#8d1c2f]">AM</span><span className="hidden text-left text-xs md:block"><b className="block text-stone-800">Anita Mehra</b><span className="text-stone-400">Administrator</span></span><ChevronDown className="hidden h-4 w-4 text-stone-400 md:block" /></button></div></header><main className="p-4 md:p-7 lg:p-8">{renderAdminPage(page, navigate, notify)}</main></div>
    <AnimatePresence>{open && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-stone-950/50 lg:hidden" aria-label="Close sidebar overlay" />}</AnimatePresence></div>;
}

function AdminDashboard({ navigate }: { navigate: Navigate }) {
  const metrics: { label: string; value: string; change: string; icon: LucideIcon; color: string }[] = [
    { label: "Total Students", value: "52,840", change: "+4.8% this year", icon: Users, color: "bg-stone-50 text-stone-700" },
    { label: "Published Results", value: "18", change: "3 this month", icon: FileCheck2, color: "bg-lime-50 text-lime-700" },
    { label: "Pending Results", value: "3", change: "Requires review", icon: Clock3, color: "bg-amber-50 text-amber-700" },
    { label: "Upcoming Exams", value: "7", change: "Next: 18 Oct", icon: CalendarDays, color: "bg-violet-50 text-violet-700" },
    { label: "News Published", value: "126", change: "8 this month", icon: Newspaper, color: "bg-sky-50 text-sky-700" },
    { label: "Downloads", value: "84.2K", change: "+12.4% this month", icon: Download, color: "bg-orange-50 text-orange-700" },
  ];
  return <><AdminHeader title="Dashboard" text="Overview of examinations, results and portal activity." actions={<Button onClick={() => navigate("admin-import")}><UploadCloud className="h-4 w-4" /> Import Results</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map((item) => <div key={item.label} className="border border-stone-200 bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-stone-500">{item.label}</p><strong className="mt-2 block text-2xl tracking-tight text-stone-900">{item.value}</strong><span className="mt-2 block text-[11px] text-stone-400">{item.change}</span></div><span className={`grid h-10 w-10 place-items-center rounded-lg ${item.color}`}><item.icon className="h-5 w-5" /></span></div></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_.8fr]"><section className="border border-stone-200 bg-white p-5 md:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold text-stone-900">Result Activity</h2><p className="mt-1 text-xs text-stone-400">Last 7 months</p></div><select className="rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-500"><option>Last 7 months</option></select></div><div className="flex h-64 items-end gap-3 border-b border-l border-stone-200 px-4 pt-4 sm:gap-5">{[42, 56, 48, 71, 66, 82, 94].map((value, i) => <div className="group flex h-full flex-1 items-end gap-1" key={i}><motion.div initial={{ height: 0 }} animate={{ height: `${value}%` }} transition={{ duration: .6, delay: i * .06 }} className="w-1/2 rounded-t-sm bg-[#a1283c]" title={`Results viewed: ${value}k`} /><motion.div initial={{ height: 0 }} animate={{ height: `${value * .55}%` }} transition={{ duration: .6, delay: i * .06 + .08 }} className="w-1/2 rounded-t-sm bg-[#f8893a]" title={`Verifications: ${Math.round(value * .55)}k`} /></div>)}</div><div className="mt-4 flex justify-center gap-5 text-[11px] text-stone-500"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 bg-[#a1283c]" /> Results viewed</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 bg-[#f8893a]" /> Verification requests</span></div></section><section className="border border-stone-200 bg-white p-5 md:p-6"><h2 className="font-semibold text-stone-900">Publishing Progress</h2><p className="mt-1 text-xs text-stone-400">Current examination cycle</p><div className="mt-7 flex justify-center"><div className="relative grid h-40 w-40 place-items-center rounded-full" style={{ background: "conic-gradient(#a1283c 0 78%, #f3e8ea 78% 100%)" }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center"><div><strong className="text-3xl text-stone-900">78%</strong><span className="block text-[10px] text-stone-400">Validated</span></div></div></div></div><div className="mt-7 space-y-3">{[["Records processed", "18,420"], ["Awaiting review", "382"], ["Errors flagged", "24"]].map(([label, value]) => <div key={label} className="flex justify-between text-xs"><span className="text-stone-500">{label}</span><b className="text-stone-800">{value}</b></div>)}</div></section></div>
    <section className="mt-6 border border-stone-200 bg-white"><div className="flex items-center justify-between border-b border-stone-200 px-5 py-4"><div><h2 className="font-semibold text-stone-900">Recent Result Publications</h2><p className="mt-1 text-xs text-stone-400">Latest activity across all programmes</p></div><Button variant="ghost" className="min-h-9 px-2" onClick={() => navigate("admin-results")}>View all</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-stone-50 uppercase tracking-wider text-stone-400"><tr><th className="px-5 py-3">Examination</th><th className="px-5 py-3">Records</th><th className="px-5 py-3">Published</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Views</th></tr></thead><tbody>{resultRows.slice(0, 3).map((row, index) => <tr className="border-t border-stone-100" key={row.name}><td className="px-5 py-4 font-semibold text-stone-700">{row.name}</td><td className="px-5 py-4 text-stone-500">{[12480, 18320, 2450][index].toLocaleString()}</td><td className="px-5 py-4 text-stone-500">{row.date}</td><td className="px-5 py-4"><StatusBadge tone="green">Published</StatusBadge></td><td className="px-5 py-4 text-stone-500">{[38600, 52100, 4800][index].toLocaleString()}</td></tr>)}</tbody></table></div></section>
  </>;
}

const adminResultRows = [
  ["{resultData.studentName}", "{resultData.enrollmentNumber}", "Senior Secondary", "June 2026", "437/500", "Published", "17 Aug 2026"],
  ["Meera Iyer", "TBSTE2601843", "Senior Secondary", "June 2026", "421/500", "Published", "17 Aug 2026"],
  ["Kabir Singh", "TBSTE2601844", "Senior Secondary", "June 2026", "389/500", "Draft", "-"],
  ["Ananya Das", "TBSTE2601845", "Senior Secondary", "June 2026", "446/500", "Published", "17 Aug 2026"],
  ["Rohan Patel", "TBSTE2601846", "Senior Secondary", "June 2026", "374/500", "Review", "-"],
  ["Sana Khan", "TBSTE2601847", "Senior Secondary", "June 2026", "412/500", "Published", "17 Aug 2026"],
];

function AdminResults({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/results");
      if (res.ok) {
        const data = await res.json();
        setDbResults(data.results || data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
      const res = await fetch("/api/results?id=" + id, { method: "DELETE" });
      if (res.ok) {
        notify("Result deleted successfully.");
        fetchResults();
      } else {
        alert("Failed to delete result");
      }
    } catch (e) {
      alert("Delete failed");
    }
  }

  const rows = dbResults.filter((row) => 
    (row.studentName || "").toLowerCase().includes(query.toLowerCase()) || 
    (row.enrollmentNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Result Management" text="Manage, validate and publish examination results." actions={<><Button variant="secondary" onClick={() => navigate("admin-import")}><UploadCloud className="h-4 w-4" /> Import Excel</Button><Button onClick={() => navigate("admin-add-result")}><Plus className="h-4 w-4" /> Add Result</Button></>} /><section className="border border-stone-200 bg-white"><div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[1fr_repeat(3,170px)]"><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search student or enrollment number" /></label>{["All Programmes", "June Examination", "All Status"].map((item) => <select key={item} className="h-9 rounded-lg border border-stone-200 px-3 text-xs text-stone-500"><option>{item}</option></select>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-stone-50 uppercase tracking-wider text-stone-400"><tr>{["Student", "Roll Number", "Programme", "Exam", "Marks", "Status", "Published Date", "Actions"].map((item) => <th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">Loading records from MongoDB...</td></tr> : rows.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">No records found. Upload an Excel file or add results manually.</td></tr> : rows.map((row) => <tr key={row._id} className="border-t border-stone-100 hover:bg-stone-50"><td className="px-4 py-4 font-semibold text-stone-800">{row.studentName}</td><td className="px-4 py-4 text-stone-500">{row.enrollmentNumber}</td><td className="px-4 py-4 text-stone-500">{row.programme}</td><td className="px-4 py-4 text-stone-500">{row.examination} ({row.examYear})</td><td className="px-4 py-4 text-stone-500">{row.grandTotal} ({row.percentage}%)</td><td className="px-4 py-4 text-stone-500"><StatusBadge tone={row.resultStatus === "PASS" ? "green" : "slate"}>{row.resultStatus}</StatusBadge></td><td className="px-4 py-4 text-stone-500">{row.resultDate ? new Date(row.resultDate).toLocaleDateString() : "-"}</td><td className="px-4 py-4"><div className="flex gap-1"><button title="Delete" onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-xs text-stone-400"><span>Showing {rows.length} of {dbResults.length} results</span></div></section></>;
}

function AdminImport({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [mapping, setMapping] = useState<any>({});
  const [validatedData, setValidatedData] = useState<any[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);

  const steps = ["Upload File", "Map Fields", "Validate Data", "Preview", "Publish"];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/results/parse", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setParsedData(data);
      setMapping(data.mapping);
      setStep(2);
    } catch (err: any) {
      alert("Error parsing file: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleMapChange(field: string, column: string) {
    setMapping((prev: any) => ({ ...prev, [field]: column }));
  }

  function runValidation() {
    if (!parsedData) return;
    const targetRows: any[] = [];
    let errs = 0;

    parsedData.rawRows.forEach((row: any) => {
      const enrollmentNumber = String(row[mapping.enrollmentNumber] || "").trim();
      const studentName = String(row[mapping.studentName] || "").trim();
      const dobRaw = row[mapping.dob];
      
      let dob = "";
      if (dobRaw) {
        const d = new Date(dobRaw);
        if (!isNaN(d.getTime())) {
          dob = d.toISOString().split('T')[0];
        }
      }

      const isValid = enrollmentNumber !== "" && studentName !== "" && dob !== "";
      if (!isValid) errs++;

      targetRows.push({
        enrollmentNumber,
        rollNumber: String(row[mapping.rollNumber] || enrollmentNumber).trim(),
        studentName,
        fatherName: String(row[mapping.fatherName] || "N/A").trim(),
        dob,
        programme: String(row[mapping.programme] || "Senior Secondary").trim(),
        examination: String(row[mapping.examination] || "Public Examination").trim(),
        examYear: String(row[mapping.examYear] || "2026").trim(),
        grandTotal: Number(row[mapping.grandTotal] || 0),
        percentage: Number(row[mapping.percentage] || 0),
        resultStatus: String(row[mapping.resultStatus] || "PASS").trim(),
        isValid
      });
    });

    setValidatedData(targetRows);
    setErrorsCount(errs);
    setStep(3);
  }

  async function publish() {
    setUploading(true);
    try {
      const validRows = validatedData.filter(r => r.isValid);
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRows)
      });
      if (!res.ok) throw new Error(await res.text());
      const resData = await res.json();
      notify(resData.message || "Results uploaded successfully!");
      setConfirm(false);
      navigate("admin-results");
    } catch (e: any) {
      alert("Failed to save results: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  const targetFields = [
    { key: "enrollmentNumber", label: "Enrollment Number (Required)" },
    { key: "rollNumber", label: "Roll Number" },
    { key: "studentName", label: "Student Name (Required)" },
    { key: "fatherName", label: "Father's Name" },
    { key: "dob", label: "Date of Birth (Required)" },
    { key: "programme", label: "Programme" },
    { key: "examination", label: "Examination" },
    { key: "examYear", label: "Examination Year" },
    { key: "grandTotal", label: "Grand Total" },
    { key: "percentage", label: "Percentage" },
    { key: "resultStatus", label: "Result Status" }
  ];

  return <><AdminHeader title="Import Examination Results" text="Upload, validate and publish result records in a guided workflow." actions={<Button variant="secondary" onClick={() => navigate("admin-results")}><ArrowLeft className="h-4 w-4" /> Back to Results</Button>} /><section className="border border-stone-200 bg-white"><div className="grid grid-cols-5 border-b border-stone-200">{steps.map((label, index) => <div key={label} className={"relative p-3 text-center md:p-5 " + (step === index + 1 ? "bg-stone-50" : "")}><div className={"mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-bold " + (step > index + 1 ? "bg-lime-500 text-white" : step === index + 1 ? "bg-[#a1283c] text-white" : "bg-stone-100 text-stone-400")}>{step > index + 1 ? <Check className="h-4 w-4" /> : "0" + (index + 1)}</div><span className={"mt-2 hidden text-xs font-medium sm:block " + (step === index + 1 ? "text-[#a1283c]" : "text-stone-400")}>{label}</span></div>)}</div><div className="p-5 md:p-8">
      {step === 1 && <div className="mx-auto max-w-2xl"><label className="flex min-h-72 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center transition hover:border-[#a1283c] hover:bg-stone-100"><span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#a1283c] shadow-sm"><UploadCloud className="h-7 w-7" /></span><h2 className="mt-5 font-semibold text-stone-800">Select result file here</h2><p className="mt-2 text-xs text-stone-400">Choose XLSX, XLS or CSV. Maximum file size 25 MB.</p><span className="mt-5 rounded-lg bg-[#a1283c] px-4 py-2 text-xs font-semibold text-white">Choose file</span><input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" /></label>{uploading && <div className="mt-5 text-center text-xs text-stone-500">Processing and parsing Excel headers...</div>}</div>}
      
      {step === 2 && parsedData && <div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center gap-3 bg-lime-50 p-4 text-sm text-lime-700"><FileSpreadsheet className="h-5 w-5" /><b>{parsedData.fileName}</b><span className="ml-auto text-xs">Rows found: {parsedData.totalRowsCount}</span></div><h2 className="font-semibold text-stone-800">Map Excel Columns to Result Fields</h2><p className="mt-1 text-xs text-stone-400">Map the column headers of your uploaded Excel sheet to database result fields.</p><div className="mt-5 grid gap-3">{targetFields.map((field) => <div key={field.key} className="grid items-center gap-3 border-b border-stone-100 pb-3 sm:grid-cols-[1fr_40px_1fr]"><div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-600 font-semibold">{field.label}</div><ArrowRight className="mx-auto h-4 w-4 text-stone-300" /><select value={mapping[field.key] || ""} onChange={(e) => handleMapChange(field.key, e.target.value)} className="rounded-lg border border-stone-200 px-3 py-2.5 text-xs text-stone-600"><option value="">-- Choose Column --</option>{parsedData.headers.map((h) => <option key={h} value={h}>{h}</option>)}</select></div>)}</div></div>}
      
      {step === 3 && <div className="mx-auto max-w-2xl text-center"><motion.div initial={{ scale: .8 }} animate={{ scale: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime-50 text-lime-600"><ClipboardCheck className="h-8 w-8" /></motion.div><h2 className="mt-5 text-xl font-semibold text-stone-800">Validation completed</h2><p className="mt-2 text-sm text-stone-500">Validation run completed on the mapped fields.</p><div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 text-left sm:grid-cols-3"><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-stone-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length}</b><span className="text-xs text-stone-400">Total Rows</span></div><div className="bg-white p-5"><CheckCircle2 className="h-5 w-5 text-lime-600" /><b className="mt-3 block text-xl text-stone-800">{validatedData.length - errorsCount}</b><span className="text-xs text-stone-400">Ready to publish</span></div><div className="bg-white p-5"><AlertCircle className="h-5 w-5 text-amber-600" /><b className="mt-3 block text-xl text-stone-800">{errorsCount}</b><span className="text-xs text-stone-400">Invalid (Missing fields)</span></div></div></div>}
      
      {step === 4 && <div><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-stone-800">Preview result records</h2><p className="mt-1 text-xs text-stone-400">Previewing parsed records.</p></div></div><div className="overflow-x-auto border border-stone-200"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-stone-50 text-stone-400"><tr>{["Student", "Enrollment", "Programme", "Marks", "Status", "Validation"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead><tbody>{validatedData.slice(0, 10).map((row, index) => <tr className="border-t border-stone-100 hover:bg-stone-50" key={index}><td className="px-4 py-3 font-medium">{row.studentName || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.enrollmentNumber || "N/A"}</td><td className="px-4 py-3 text-stone-500">{row.programme}</td><td className="px-4 py-3 text-stone-500">{row.grandTotal} ({row.percentage}%)</td><td className="px-4 py-3 text-stone-500">{row.resultStatus}</td><td className="px-4 py-3"><StatusBadge tone={row.isValid ? "green" : "amber"}>{row.isValid ? "Valid" : "Invalid Date/Name/Enrollment"}</StatusBadge></td></tr>)}</tbody></table></div></div>}
      
      {step === 5 && <div className="mx-auto max-w-xl py-8 text-center"><ShieldCheck className="mx-auto h-14 w-14 text-[#a1283c]" /><h2 className="mt-5 text-xl font-semibold text-stone-800">Ready to publish results</h2><p className="mt-2 text-sm leading-6 text-stone-500">All valid records will become live and searchable immediately. Invalid records will be skipped.</p></div>}
      
      <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-5"><Button variant="secondary" disabled={step === 1} onClick={() => setStep(Math.max(1, step - 1))}>Previous</Button>{step > 1 && <Button onClick={step === 5 ? () => setConfirm(true) : step === 2 ? runValidation : () => setStep(step + 1)}>{step === 3 ? "Preview Results" : step === 5 ? "Publish Results" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>}</div>
    </div></section>
    <AnimatePresence>{confirm && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-600"><Bell className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-semibold text-stone-900">Publish results?</h2><p className="mt-2 text-sm leading-6 text-stone-500">Are you sure you want to write these results to the database?</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={publish}>Confirm & Publish</Button></div></motion.div></motion.div>}</AnimatePresence></>;
}

function AdminAddResult({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [programme, setProgramme] = useState("Senior Secondary");
  const [examination, setExamination] = useState("June Public Examination");
  const [examYear, setExamYear] = useState("2026");
  const [percentage, setPercentage] = useState(0);
  const [resultStatus, setResultStatus] = useState("PASS");
  
  const [subjects, setSubjects] = useState([
    { sNo: "1", name: "Hindi", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
    { sNo: "2", name: "English", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "A" },
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { sNo: String(subjects.length + 1), name: "", max: 100, min: 33, th: 0, pr: 0, total: 0, grade: "" }]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index).map((s, idx) => ({ ...s, sNo: String(idx + 1) })));
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    if (field === 'th' || field === 'pr') {
      updated[index].total = Number(updated[index].th || 0) + Number(updated[index].pr || 0);
    }
    setSubjects(updated);
  };

  const grandTotal = subjects.reduce((sum, s) => sum + (s.total || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        enrollmentNumber,
        rollNumber: rollNumber || enrollmentNumber,
        studentName,
        fatherName,
        dob,
        programme,
        examination,
        examYear,
        subjects,
        grandTotal,
        percentage: Number(percentage) || 0,
        resultStatus
      };

      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());
      notify("Manual result created successfully!");
      navigate("admin-results");
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return <>
    <AdminHeader title="Add Manual Student Result" text="Manually enter examination results and subject marks." actions={<Button variant="secondary" onClick={() => navigate("admin-results")}><ArrowLeft className="h-4 w-4" /> Back to Results</Button>} />
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-stone-200 bg-white p-6 md:p-8">
        <h2 className="text-base font-semibold text-stone-900 mb-4">Student Profile Details</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Student Name *</label>
            <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={studentName} onChange={e => setStudentName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Enrollment Number *</label>
            <input required className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Roll Number</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Father's Name</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={fatherName} onChange={e => setFatherName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Date of Birth *</label>
            <input required type="date" className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={dob} onChange={e => setDob(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Programme</label>
            <select className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={programme} onChange={e => setProgramme(e.target.value)}>
              <option value="Secondary">Secondary</option>
              <option value="Senior Secondary">Senior Secondary</option>
              <option value="Vocational">Vocational</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Examination Session</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={examination} onChange={e => setExamination(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Examination Year</label>
            <input className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={examYear} onChange={e => setExamYear(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Result Status</label>
            <select className="w-full rounded border border-stone-200 p-2.5 text-sm focus:border-[#a1283c] outline-none" value={resultStatus} onChange={e => setResultStatus(e.target.value)}>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
              <option value="COMPARTMENT">COMPARTMENT</option>
              <option value="WITHHELD">WITHHELD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-stone-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-stone-900">Subject Marks Sheet</h2>
          <Button type="button" onClick={addSubject} variant="secondary"><Plus className="h-4 w-4" /> Add Subject</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-stone-50 uppercase tracking-wider text-stone-400">
              <tr>
                <th className="px-4 py-2 w-12">S.No</th>
                <th className="px-4 py-2">Subject Name</th>
                <th className="px-4 py-2 w-20">Max Marks</th>
                <th className="px-4 py-2 w-20">Min Marks</th>
                <th className="px-4 py-2 w-20">Theory Marks</th>
                <th className="px-4 py-2 w-20">Practical Marks</th>
                <th className="px-4 py-2 w-20">Total</th>
                <th className="px-4 py-2 w-20">Grade</th>
                <th className="px-4 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={idx} className="border-t border-stone-100">
                  <td className="px-4 py-2 font-medium">{sub.sNo}</td>
                  <td className="px-4 py-2">
                    <input required className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.name} onChange={e => updateSubject(idx, "name", e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.max} onChange={e => updateSubject(idx, "max", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.min} onChange={e => updateSubject(idx, "min", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.th} onChange={e => updateSubject(idx, "th", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.pr} onChange={e => updateSubject(idx, "pr", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2 font-bold">{sub.total}</td>
                  <td className="px-4 py-2">
                    <input className="w-full rounded border border-stone-200 p-2 text-xs focus:border-[#a1283c] outline-none" value={sub.grade} onChange={e => updateSubject(idx, "grade", e.target.value)} />
                  </td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => removeSubject(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3 border-t border-stone-100 pt-6">
          <div className="text-sm font-semibold text-stone-700">Grand Total: <span className="font-bold text-[#a1283c] text-lg">{grandTotal}</span></div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Calculated Percentage *</label>
            <input required type="number" step="0.01" className="w-full rounded border border-stone-200 p-2 text-sm focus:border-[#a1283c] outline-none" value={percentage} onChange={e => setPercentage(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate("admin-results")}>Cancel</Button>
        <Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Result"}</Button>
      </div>
    </form>
  </>;
}
function AdminStudents({ notify }: { notify: (message: string) => void }) {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editFatherName, setEditFatherName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editProgs, setEditProgs] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProgs, setSelectedProgs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (res.ok) {
        const data = await res.json();
        setDbStudents(data || []);
      }
      const pRes = await fetch("/api/programmes");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgs(pData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent._id,
          name: editName,
          fatherName: editFatherName,
          dob: editDob,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          programmes: editProgs
        })
      });
      if (res.ok) {
        notify("Student profile updated successfully!");
        setSelectedStudent(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Update failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, enrollmentNumber, fatherName, dob, email, phone, address, programmes: selectedProgs })
      });
      if (res.ok) {
        notify("Student created successfully!");
        setShowAddModal(false);
        setName("");
        setEnrollmentNumber("");
        setFatherName("");
        setDob("");
        setEmail("");
        setPhone("");
        setAddress("");
        setSelectedProgs([]);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create student");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Student record deleted.");
        fetchData();
      }
    } catch (err) {
      alert("Error deleting student");
    }
  };

  const rows = dbStudents.filter(row => 
    (row.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (row.enrollmentNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Students Directory" text="Manage registered learners and their profile database." actions={<Button onClick={() => setShowAddModal(true)}><UserPlus className="h-4 w-4" /> Add Student</Button>} /><section className="border border-stone-200 bg-white"><div className="flex gap-3 border-b border-stone-200 p-4"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search by name or enrollment number..." /></label></div><div className="divide-y divide-stone-100">{loading ? <div className="p-8 text-center text-stone-400 text-xs">Loading students...</div> : rows.length === 0 ? <div className="p-8 text-center text-stone-400 text-xs">No student records found.</div> : rows.map((row) => <div key={row._id} className="grid gap-3 p-4 md:grid-cols-[1fr_150px_100px_90px] md:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><User className="h-5 w-5" /></span><div><h2 className="text-xs font-semibold text-stone-800">{row.name}</h2><p className="mt-1 text-[11px] text-stone-400">Enrollment: {row.enrollmentNumber}</p></div></div><span className="text-xs text-stone-500">{row.phone || "No Phone"}</span><span className="text-xs text-stone-400">{row.dob ? new Date(row.dob).toLocaleDateString() : "-"}</span><div className="flex gap-1 md:justify-end"><button onClick={() => {
  setSelectedStudent(row);
  setEditName(row.name || "");
  setEditFatherName(row.fatherName || "");
  setEditDob(row.dob ? new Date(row.dob).toISOString().split('T')[0] : "");
  setEditEmail(row.email || "");
  setEditPhone(row.phone || "");
  setEditAddress(row.address || "");
  setEditProgs(row.programmes || []);
}} className="grid h-8 w-8 place-items-center rounded hover:bg-stone-50 text-stone-600" title="Edit Student"><Eye className="h-4 w-4" /></button><button onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>

    {/* ADD STUDENT MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add Student Record</h3><button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><form onSubmit={handleAddStudent} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={name} onChange={e => setName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={enrollmentNumber} onChange={e => setEnrollmentNumber(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={fatherName} onChange={e => setFatherName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={dob} onChange={e => setDob(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Email</label><input type="email" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={email} onChange={e => setEmail(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={phone} onChange={e => setPhone(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Course / Programme Allocation</label><div className="mt-1 border border-stone-200 rounded p-3 bg-stone-50 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{progs.map(p => (<label key={p._id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"><input type="checkbox" checked={selectedProgs.includes(p.title)} onChange={e => { if (e.target.checked) { setSelectedProgs([...selectedProgs, p.title]); } else { setSelectedProgs(selectedProgs.filter(item => item !== p.title)); } }} className="rounded border-stone-300 text-[#a1283c] focus:ring-[#a1283c]" />{p.title}</label>))}</div></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Address</label><textarea rows={2} className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={address} onChange={e => setAddress(e.target.value)} /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Student"}</Button></div></form></motion.div></motion.div>}</AnimatePresence>

    {/* EDIT PROFILE MODAL */}
    <AnimatePresence>{selectedStudent && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Edit Student Profile</h3><button onClick={() => setSelectedStudent(null)}><X className="h-5 w-5 text-stone-400" /></button></div><form onSubmit={handleUpdateStudent} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Student Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editName} onChange={e => setEditName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Enrollment Number</label><input disabled className="w-full rounded border border-stone-200 p-2 text-xs bg-stone-100 outline-none text-stone-500" value={selectedStudent.enrollmentNumber} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Father's Name *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editFatherName} onChange={e => setEditFatherName(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Date of Birth *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editDob} onChange={e => setEditDob(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Email</label><input type="email" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editEmail} onChange={e => setEditEmail(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Phone</label><input className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Course / Programme Allocation</label><div className="mt-1 border border-stone-200 rounded p-3 bg-stone-50 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">{progs.map(p => (<label key={p._id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"><input type="checkbox" checked={editProgs.includes(p.title)} onChange={e => { if (e.target.checked) { setEditProgs([...editProgs, p.title]); } else { setEditProgs(editProgs.filter(item => item !== p.title)); } }} className="rounded border-stone-300 text-[#a1283c] focus:ring-[#a1283c]" />{p.title}</label>))}</div></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Address</label><textarea rows={2} className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={editAddress} onChange={e => setEditAddress(e.target.value)} /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setSelectedStudent(null)}>Cancel</Button><Button disabled={updating} type="submit">{updating ? "Saving Changes..." : "Save Changes"}</Button></div></form></motion.div></motion.div>}</AnimatePresence></>;
}
function AdminExams({ notify }: { notify: (message: string) => void }) {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [programme, setProgramme] = useState("All Programmes");
  const [examYear, setExamYear] = useState("2026");
  const [regStart, setRegStart] = useState("");
  const [examStart, setExamStart] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [status, setStatus] = useState<any>("Upcoming");
  const [saving, setSaving] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exams");
      if (res.ok) {
        const data = await res.json();
        setExams(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, programme, examYear,
          registrationStartDate: regStart,
          examStartDate: examStart,
          resultDate, status
        })
      });
      if (res.ok) {
        notify("Examination session created successfully!");
        setShowAddModal(false);
        // Reset states
        setTitle("");
        setProgramme("All Programmes");
        setExamYear("2026");
        setRegStart("");
        setExamStart("");
        setResultDate("");
        setStatus("Upcoming");
        fetchExams();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create exam session");
      }
    } catch (err: any) {
      alert("Error adding exam: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this examination session?")) return;
    try {
      const res = await fetch("/api/exams?id=" + id, { method: "DELETE" });
      if (res.ok) {
        notify("Examination session deleted.");
        fetchExams();
      }
    } catch (err) {
      alert("Error deleting session");
    }
  };

  const rows = exams.filter(row => 
    (row.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Examination Management" text="Plan sessions, schedules and result publication dates." actions={<Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> Add Session</Button>} /><section className="border border-stone-200 bg-white"><div className="grid gap-3 border-b border-stone-200 p-4 sm:grid-cols-[1fr_170px]"><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search exams..." /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[970px] text-left text-xs"><thead className="bg-stone-50 uppercase tracking-wider text-stone-400"><tr>{["Examination Session", "Programme", "Year", "Registration Start", "Exam Date", "Result Publication", "Status", ""].map((item) => <th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">Loading sessions...</td></tr> : rows.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-stone-400 text-xs">No examination sessions found. Add a session manually.</td></tr> : rows.map((row) => <tr key={row._id} className="border-t border-stone-100 hover:bg-stone-50"><td className="px-4 py-4 font-semibold text-stone-800">{row.title}</td><td className="px-4 py-4 text-stone-500">{row.programme}</td><td className="px-4 py-4 text-stone-500">{row.examYear}</td><td className="px-4 py-4 text-stone-500">{row.registrationStartDate ? new Date(row.registrationStartDate).toLocaleDateString() : "-"}</td><td className="px-4 py-4 text-stone-500">{row.examStartDate ? new Date(row.examStartDate).toLocaleDateString() : "-"}</td><td className="px-4 py-4 text-stone-500">{row.resultDate ? new Date(row.resultDate).toLocaleDateString() : "-"}</td><td className="px-4 py-4 text-stone-500"><StatusBadge tone={row.status === "Upcoming" ? "blue" : row.status === "Result Declared" ? "green" : "slate"}>{row.status}</StatusBadge></td><td className="px-4 py-4"><button onClick={() => handleDeleteExam(row._id)} className="text-red-500 hover:underline">Delete</button></td></tr>)}</tbody></table></div><div className="border-t border-stone-200 px-4 py-3 text-xs text-stone-400">Showing {rows.length} of {exams.length} sessions</div></section>

    {/* ADD EXAM MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.div initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add Examination Session</h3><button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><form onSubmit={handleAddExam} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Session Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. October Public Examination" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Programme *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={programme} onChange={e => setProgramme(e.target.value)}><option value="All Programmes">All Programmes</option><option value="Secondary">Secondary</option><option value="Senior Secondary">Senior Secondary</option><option value="Vocational">Vocational</option></select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Examination Year *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={examYear} onChange={e => setExamYear(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Registration Start Date *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={regStart} onChange={e => setRegStart(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Exam Start Date *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={examStart} onChange={e => setExamStart(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Result Publication Date *</label><input required type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={resultDate} onChange={e => setResultDate(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Status</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={status} onChange={e => setStatus(e.target.value)}><option value="Upcoming">Upcoming</option><option value="Ongoing">Ongoing</option><option value="Result Declared">Result Declared</option><option value="Completed">Completed</option></select></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Session"}</Button></div></form></motion.div></motion.div>}</AnimatePresence></>;
}

function AdminEditorial({ kind, notify }: { kind: "News" | "Notices"; notify: (message: string) => void }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(kind === "News" ? "Result" : "Notice");
  const [publishDate, setPublishDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<any>("Published");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEditorial = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/editorial?kind=" + kind);
      if (res.ok) {
        const data = await res.json();
        setEntries(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditorial();
  }, [kind]);

  const handleAddEditorial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, kind, category, publishDate, summary, content, status, imageUrl
        })
      });
      if (res.ok) {
        notify(kind + " content saved successfully!");
        setShowAddModal(false);
        // Reset states
        setTitle("");
        setCategory(kind === "News" ? "Result" : "Notice");
        setPublishDate("");
        setSummary("");
        setContent("");
        setStatus("Published");
        setImageUrl("");
        fetchEditorial();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create content");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEditorial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this " + kind.toLowerCase() + "?")) return;
    try {
      const res = await fetch("/api/editorial?id=" + id, { method: "DELETE" });
      if (res.ok) {
        notify(kind + " content deleted.");
        fetchEditorial();
      }
    } catch (err) {
      alert("Error deleting content");
    }
  };

  const rows = entries.filter(row => 
    (row.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title={kind + " Management"} text={"Create, schedule and publish " + kind.toLowerCase() + " content."} actions={<Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> Create {kind === "News" ? "News" : "Notice"}</Button>} /><section className="border border-stone-200 bg-white"><div className="grid gap-3 border-b border-stone-200 p-4 sm:grid-cols-[1fr_170px]"><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder={"Search " + kind.toLowerCase() + "..."} /></label></div><div className="divide-y divide-stone-100">{loading ? <div className="p-8 text-center text-stone-400 text-xs">Loading items...</div> : rows.length === 0 ? <div className="p-8 text-center text-stone-400 text-xs">No {kind.toLowerCase()} content found. Create one.</div> : rows.map((entry) => <div key={entry._id} className="grid gap-3 p-4 sm:grid-cols-[1fr_120px_110px_100px] sm:items-center"><div><h2 className="text-xs font-semibold text-stone-800">{entry.title}</h2><p className="mt-1 text-[11px] text-stone-400">{entry.category} / {entry.publishDate ? new Date(entry.publishDate).toLocaleDateString() : "-"}</p></div><StatusBadge tone={entry.status === "Published" ? "green" : entry.status === "Scheduled" ? "blue" : "slate"}>{entry.status}</StatusBadge><span className="text-[11px] text-stone-400">{entry.publishDate ? new Date(entry.publishDate).toLocaleDateString() : "-"}</span><div className="flex justify-end gap-1"><button onClick={() => handleDeleteEditorial(entry._id)} className="grid h-8 w-8 place-items-center rounded text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>

    {/* ADD EDITORIAL MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleAddEditorial} className="w-full max-w-3xl rounded-xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]"><div className="flex items-center justify-between border-b border-stone-200 px-6 py-4"><div><h2 className="font-semibold text-stone-900">Create {kind === "News" ? "News Article" : "Notice"}</h2><p className="mt-1 text-xs text-stone-400">Enter publication details and content.</p></div><button type="button" onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="grid gap-5 p-6 sm:grid-cols-2"><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={title} onChange={e => setTitle(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={category} onChange={e => setCategory(e.target.value)}>{kind === "News" ? <><option value="Result">Result</option><option value="Examination">Examination</option><option value="Admission">Admission</option><option value="General">General</option></> : <><option value="Notice">Notice</option><option value="Circular">Circular</option><option value="Announcement">Announcement</option></>}</select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Publish Date</label><input type="date" className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={publishDate} onChange={e => setPublishDate(e.target.value)} /></div>
    
    {kind === "News" && <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Article Image</label><div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">{imageUrl && <img src={imageUrl} alt="" className="h-12 w-20 rounded object-cover border" />}
<label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">Choose Image<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; notify("Uploading article image..."); const fd = new FormData(); fd.append("file", file); fd.append("title", "Article Image"); fd.append("category", "News"); try { const res = await fetch("/api/documents", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); setImageUrl("/api/documents?id=" + data._id); notify("Image uploaded successfully!"); } catch (err) { alert("Upload failed: " + err.message); } }} /></label><span className="text-[10px] text-stone-400">JPG, PNG, WebP</span></div></div>}

    <div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Summary</label><textarea className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" rows={2} value={summary} onChange={e => setSummary(e.target.value)} /></div><div className="sm:col-span-2"><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Content</label><textarea required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" rows={6} value={content} onChange={e => setContent(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Status</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={status} onChange={e => setStatus(e.target.value)}><option value="Published">Published</option><option value="Scheduled">Scheduled</option><option value="Draft">Draft</option></select></div></div><div className="flex justify-end gap-2 border-t border-stone-200 px-6 py-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Publishing..." : "Publish"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;
}

function AdminDownloads({ notify }: { notify: (message: string) => void }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Form");
  const [programme, setProgramme] = useState("All Programmes");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data || []);
      }
      const pRes = await fetch("/api/programmes");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgs(pData || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("category", category);
    fd.append("programme", programme);
    try {
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (res.ok) {
        notify("Document uploaded successfully!");
        setShowAddModal(false);
        setTitle("");
        setCategory("Form");
        setProgramme("All Programmes");
        setFile(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Document deleted.");
        fetchData();
      }
    } catch (err) {
      alert("Error deleting document");
    }
  };

  const rows = docs.filter(row => 
    (row.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return <><AdminHeader title="Downloads Management" text="Manage public forms, circulars and academic documents." actions={<Button onClick={() => setShowAddModal(true)}><UploadCloud className="h-4 w-4" /> Upload Document</Button>} /><section className="border border-stone-200 bg-white"><div className="flex gap-3 border-b border-stone-200 p-4"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-stone-200 pl-9 pr-3 text-xs outline-none focus:border-[#a1283c]" placeholder="Search files..." /></label></div><div className="divide-y divide-stone-100">{loading ? <div className="p-8 text-center text-stone-400 text-xs">Loading documents...</div> : rows.length === 0 ? <div className="p-8 text-center text-stone-400 text-xs">No documents found. Upload one.</div> : rows.map((row) => <div key={row._id} className="grid gap-3 p-4 md:grid-cols-[1fr_150px_100px_100px_90px] md:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600"><FileText className="h-5 w-5" /></span><div><h2 className="text-xs font-semibold text-stone-800">{row.title}</h2><p className="mt-1 text-[11px] text-stone-400">{row.contentType} / {Math.round(row.size / 1024)} KB</p></div></div><span className="text-xs text-stone-500">{row.category} <span className="text-stone-400 font-normal">| {row.programme || 'All Programmes'}</span></span><span className="text-xs text-stone-400">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span><StatusBadge tone="green">Published</StatusBadge><div className="flex gap-1 md:justify-end"><button onClick={() => handleDelete(row._id)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></section>

    {/* ADD DOCUMENT MODAL */}
    <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleUpload} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Upload New Document</h3><button type="button" onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Document Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Examination Form 2026" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={category} onChange={e => setCategory(e.target.value)}><option value="Form">Form</option><option value="Syllabus">Syllabus</option><option value="Prospectus">Prospectus</option><option value="Circular">Circular</option><option value="Notice">Notice</option><option value="Study Material">Study Material</option><option value="Notes">Notes</option></select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Allocate Programme</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={programme} onChange={e => setProgramme(e.target.value)}><option value="All Programmes">All Programmes</option>{progs.map(p => <option key={p._id} value={p.title}>{p.title}</option>)}</select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Choose File *</label><input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" /></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Uploading..." : "Upload"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;
}
function AdminSettings({ notify }) {
  const { cmsData: rawCms, fetchCms } = React.useContext(CmsContext);
  const cmsData = rawCms || {};
  const [activeTab, setActiveTab] = React.useState("Home Page");
  const [saving, setSaving] = React.useState(false);
  const [fv, setFv] = React.useState({});

  React.useEffect(() => {
    setFv({
      "home.hero.title": cmsData["home.hero.title"] || "Excellence in Education & Skill Development",
      "home.hero.text": cmsData["home.hero.text"] || "Fostering academic brilliance and technical proficiency to empower the next generation of leaders and innovators.",
      "home.quick_access.title": cmsData["home.quick_access.title"] || "Essential result services",
      "home.quick_access.text": cmsData["home.quick_access.text"] || "Secure, direct access to the services students use most.",
      "home.about.title": cmsData["home.about.title"] || "Committed to accessible, transparent and quality education",
      "home.about.text": cmsData["home.about.text"] || "The Thar Board of School and Technical Education concept supports learners through reliable examinations, fair assessment, secure certification and accessible digital services.",
      "home.results.title": cmsData["home.results.title"] || "Recently declared examinations",
      "home.results.text": cmsData["home.results.text"] || "View current publication status and access official result services.",
      "home.programmes.title": cmsData["home.programmes.title"] || "Programmes built around learner progress",
      "home.programmes.text": cmsData["home.programmes.text"] || "Flexible routes for secondary education, senior secondary study and applied skills.",
      "home.exams.title": cmsData["home.exams.title"] || "A clear path from registration to result",
      "home.exams.text": cmsData["home.exams.text"] || "Key dates are communicated through the portal at every stage of the examination cycle.",
      "home.news.title": cmsData["home.news.title"] || "News and announcements",
      "home.news.text": cmsData["home.news.text"] || "Important academic updates, notices and circulars from the examination authority.",
      "about.hero.title": cmsData["about.hero.title"] || "About the Board",
      "about.hero.text": cmsData["about.hero.text"] || "We are a premier educational body committed to excellence in assessment and certification.",
      "about.org.title": cmsData["about.org.title"] || "Education that remains open, credible and connected",
      "about.mission.text": cmsData["about.mission.text"] || "Deliver fair assessment and accessible academic services.",
      "about.vision.text": cmsData["about.vision.text"] || "A trusted digital education ecosystem for every learner.",
      "about.principles.title": cmsData["about.principles.title"] || "What informs every decision",
      "about.milestones.title": cmsData["about.milestones.title"] || "A continuous journey toward better services",
      "programmes.hero.title": cmsData["programmes.hero.title"] || "Our Programmes",
      "programmes.hero.text": cmsData["programmes.hero.text"] || "Explore our wide range of academic and vocational programmes.",
      "org.name": cmsData["org.name"] || "Thar Board of School and Technical Education",
      "org.tagline": cmsData["org.tagline"] || "Examination & Certification Authority",
      "org.email": cmsData["org.email"] || "help@tbste.edu",
      "org.phone": cmsData["org.phone"] || "1800-123-2026",
    });
  }, [cmsData]);

  const set = (key, val) => setFv(prev => ({ ...prev, [key]: val }));

  const handleImg = async (key, file) => {
    notify("Uploading image...");
    const fd = new FormData();
    fd.append("file", file); fd.append("title", key); fd.append("category", "CMS");
    try {
      const res = await fetch("/api/documents", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      set(key, "/api/documents?id=" + data._id);
      notify("Image uploaded! Click Save Changes to apply.");
    } catch (e) { alert(e.message); }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all(Object.entries(fv).map(([key, value]) =>
        fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, type: "text", value }) })
      ));
      await fetchCms();
      notify("All settings saved to database successfully!");
    } catch (e) { alert("Error saving"); } finally { setSaving(false); }
  };

  const tabs = ["Home Page", "About Page", "Programmes", "General Information"];

  const F = ({ label, fkey, rows }: { label: string; fkey: string; rows?: number }) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      {rows
        ? <textarea className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none resize-none" rows={rows} value={fv[fkey] || ""} onChange={e => set(fkey, e.target.value)} />
        : <input className="w-full rounded-lg border border-stone-200 p-3 text-sm focus:border-[#a1283c] outline-none" value={fv[fkey] || ""} onChange={e => set(fkey, e.target.value)} />}
    </div>
  );

  const ImgU = ({ label, fkey }: { label: string; fkey: string }) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
        {fv[fkey] && <img src={fv[fkey]} alt="" className="h-16 w-24 rounded object-cover border" />}
        <label className="cursor-pointer rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
          Choose Image<input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImg(fkey, e.target.files[0])} />
        </label>
        <span className="text-[11px] text-stone-400">JPG, PNG, WebP</span>
      </div>
    </div>
  );

  return <>
    <AdminHeader title="Website Settings" text="Edit public page content, text and images saved to your MongoDB database." actions={
      <Button disabled={saving} onClick={saveAll}>{saving ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}</Button>
    } />
    <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
      <nav className="h-fit border border-stone-200 bg-white p-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={"flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors " + (activeTab === tab ? "bg-[#fdf5f6] text-[#a1283c] font-semibold" : "text-stone-500 hover:bg-stone-50")}>
            <Settings className="h-4 w-4" />{tab}
          </button>
        ))}
      </nav>
      <div className="space-y-6">
        {activeTab === "Home Page" && <div className="border border-stone-200 bg-white p-6 md:p-8 space-y-12">
          
          <div>
            <h2 className="text-base font-semibold text-stone-900 mb-1">Hero Section</h2>
            <p className="text-xs text-stone-400 mb-6">Edit the hero banner text and background image on the homepage.</p>
            <div className="space-y-5">
              <F label="Hero Title" fkey="home.hero.title" rows={2} />
              <F label="Hero Subtext" fkey="home.hero.text" rows={3} />
              <ImgU label="Hero Background Image" fkey="home.hero.image" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Quick Access Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.quick_access.title" />
              <F label="Section Description" fkey="home.quick_access.text" rows={2} />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">About Board Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.about.title" />
              <F label="Section Description" fkey="home.about.text" rows={3} />
              <ImgU label="About Image" fkey="home.about.image" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Latest Results Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.results.title" />
              <F label="Section Description" fkey="home.results.text" rows={2} />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Academic Pathways Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.programmes.title" />
              <F label="Section Description" fkey="home.programmes.text" rows={2} />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Examination Cycle Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.exams.title" />
              <F label="Section Description" fkey="home.exams.text" rows={2} />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Official Updates Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="home.news.title" />
              <F label="Section Description" fkey="home.news.text" rows={2} />
            </div>
          </div>

        </div>}
        {activeTab === "About Page" && <div className="border border-stone-200 bg-white p-6 md:p-8 space-y-12">
          
          <div>
            <h2 className="text-base font-semibold text-stone-900 mb-1">Hero Section</h2>
            <p className="text-xs text-stone-400 mb-6">Edit the hero text and image on the About page.</p>
            <div className="space-y-5">
              <F label="Hero Title" fkey="about.hero.title" />
              <F label="Hero Subtext" fkey="about.hero.text" rows={3} />
              <ImgU label="Hero Background Image" fkey="about.hero.image" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Our Organization Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="about.org.title" />
              <F label="Mission Text" fkey="about.mission.text" rows={3} />
              <F label="Vision Text" fkey="about.vision.text" rows={3} />
              <ImgU label="Section Image" fkey="about.org.image" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Guiding Principles Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="about.principles.title" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <h2 className="text-base font-semibold text-stone-900 mb-1">Milestones Section</h2>
            <div className="space-y-5 mt-4">
              <F label="Section Title" fkey="about.milestones.title" />
            </div>
          </div>

        </div>}
        {activeTab === "Programmes" && <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">Programmes Page</h2>
          <div className="space-y-5">
            <F label="Hero Title" fkey="programmes.hero.title" />
            <F label="Hero Subtext" fkey="programmes.hero.text" rows={3} />
            <ImgU label="Hero Background Image" fkey="programmes.hero.image" />
          </div>
        </div>}
        {activeTab === "General Information" && <div className="border border-stone-200 bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-stone-900 mb-1">General Information</h2>
          <p className="text-xs text-stone-400 mb-6">Organization details shown site-wide.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><F label="Organization Name" fkey="org.name" /></div>
            <div className="md:col-span-2"><F label="Official Tagline" fkey="org.tagline" /></div>
            <F label="Public Email" fkey="org.email" />
            <F label="Helpline Number" fkey="org.phone" />
          </div>
        </div>}
      </div>
    </div>
  </>;
}


function AdminCollection({ page, notify }: { page: Page; notify: (message: string) => void }) {
  const [progs, setProgs] = useState<any[]>([]);
  const [loadingProgs, setLoadingProgs] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Programme form states
  const [title, setTitle] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [duration, setDuration] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  // Gallery states
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Events");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");

  // Recognition states
  const [recs, setRecs] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [showRecModal, setShowRecModal] = useState(false);
  const [recTitle, setRecTitle] = useState("");
  const [recReference, setRecReference] = useState("");
  const [recDocUrl, setRecDocUrl] = useState("");

  const fetchProgs = async () => {
    setLoadingProgs(true);
    try {
      const res = await fetch("/api/programmes");
      if (res.ok) {
        const data = await res.json();
        setProgs(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProgs(false);
    }
  };

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchRecs = async () => {
    setLoadingRecs(true);
    try {
      const res = await fetch("/api/recognition");
      if (res.ok) {
        const data = await res.json();
        setRecs(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    if (page === "admin-programmes") fetchProgs();
    if (page === "admin-gallery") fetchPhotos();
    if (page === "admin-recognition") fetchRecs();
  }, [page]);

  const handleAddProg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/programmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, eligibility, duration, text, image })
      });
      if (res.ok) {
        notify("Programme added successfully!");
        setShowAddModal(false);
        setTitle("");
        setEligibility("");
        setDuration("");
        setText("");
        setImage("");
        fetchProgs();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add programme");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProg = async (id: string) => {
    if (!confirm("Are you sure you want to delete this programme?")) return;
    try {
      const res = await fetch(`/api/programmes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Programme deleted.");
        fetchProgs();
      }
    } catch (err) {
      alert("Error deleting programme");
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImageUrl) {
      alert("Please upload an image first");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: galleryTitle, imageUrl: galleryImageUrl, category: galleryCategory })
      });
      if (res.ok) {
        notify("Photo added to gallery successfully!");
        setShowGalleryModal(false);
        setGalleryTitle("");
        setGalleryCategory("Events");
        setGalleryImageUrl("");
        fetchPhotos();
      } else {
        alert("Failed to add photo");
      }
    } catch (err) {
      alert("Error saving photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Photo deleted.");
        fetchPhotos();
      }
    } catch (err) {
      alert("Error deleting photo");
    }
  };

  const handleAddRec = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: recTitle, reference: recReference, documentUrl: recDocUrl })
      });
      if (res.ok) {
        notify("Recognition record added successfully!");
        setShowRecModal(false);
        setRecTitle("");
        setRecReference("");
        setRecDocUrl("");
        fetchRecs();
      } else {
        alert("Failed to add record");
      }
    } catch (err) {
      alert("Error saving record");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRec = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/recognition?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Record deleted.");
        fetchRecs();
      }
    } catch (err) {
      alert("Error deleting record");
    }
  };

  if (page === "admin-settings") return <AdminSettings notify={notify} />;
  
  if (page === "admin-programmes") return <><AdminHeader title="Programmes Management" text="Manage academic pathways and programme information." actions={<Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> Add Programme</Button>} /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{loadingProgs ? <div className="p-5 text-stone-400 text-xs">Loading programmes...</div> : progs.length === 0 ? <div className="p-5 text-stone-400 text-xs">No programmes found in database. Add one.</div> : progs.map((item) => <article key={item._id} className="border border-stone-200 bg-white"><img src={item.image} alt="" className="aspect-[16/7] w-full object-cover" /><div className="p-5"><div className="flex justify-between"><StatusBadge tone="green">Published</StatusBadge></div><h2 className="mt-4 font-semibold text-stone-800">{item.title}</h2><p className="mt-2 text-xs leading-5 text-stone-500">{item.eligibility} / {item.duration}</p><p className="mt-2 text-xs text-stone-400 line-clamp-2">{item.text}</p><div className="mt-4 flex gap-2"><Button onClick={() => handleDeleteProg(item._id)} variant="secondary" className="min-h-9 flex-1 text-red-600 border-red-100 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</Button></div></div></article>)}</div>
  
  <AnimatePresence>{showAddModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleAddProg} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add New Programme</h3><button type="button" onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Programme Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Higher Secondary Education" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Eligibility *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={eligibility} onChange={e => setEligibility(e.target.value)} placeholder="e.g. Class X pass" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Duration *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2 academic years" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Description *</label><textarea required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" rows={3} value={text} onChange={e => setText(e.target.value)} /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Programme Image</label><div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">{image && <img src={image} alt="" className="h-12 w-20 rounded object-cover border" />}<label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">Choose Image<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; notify("Uploading programme image..."); const fd = new FormData(); fd.append("file", file); fd.append("title", "Programme Image"); fd.append("category", "Programme"); try { const res = await fetch("/api/documents", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); setImage("/api/documents?id=" + data._id); notify("Image uploaded successfully!"); } catch (err) { alert("Upload failed: " + err.message); } }} /></label><span className="text-[10px] text-stone-400">JPG, PNG, WebP</span></div></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Programme"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;

  if (page === "admin-gallery") return <><AdminHeader title="Gallery Management" text="Organize institutional images and event albums." actions={<Button onClick={() => setShowGalleryModal(true)}><Plus className="h-4 w-4" /> Add Photo</Button>} /><section className="border border-stone-200 bg-white p-5"><div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{loadingPhotos ? <div className="text-stone-400 text-xs">Loading photos...</div> : photos.length === 0 ? <div className="text-stone-400 text-xs">No photos in database. Add some.</div> : photos.map((row) => <div key={row._id} className="border border-stone-100 p-2 bg-stone-50 rounded-lg"><img src={row.imageUrl} alt="" className="aspect-square w-full object-cover border rounded" /><div className="mt-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{row.category}</span><button onClick={() => handleDeletePhoto(row._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button></div></div>)}</div></section>

  <AnimatePresence>{showGalleryModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleAddPhoto} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add Photo to Gallery</h3><button type="button" onClick={() => setShowGalleryModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Photo Description *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} placeholder="e.g. Annual graduation day ceremony" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Category *</label><select className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)}><option value="Events">Events</option><option value="Examinations">Examinations</option><option value="Award Ceremonies">Award Ceremonies</option><option value="Students">Students</option><option value="Centres">Centres</option></select></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Photo Upload *</label><div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">{galleryImageUrl && <img src={galleryImageUrl} alt="" className="h-12 w-20 rounded object-cover border" />}{/* Curly brace closed correctly! */}<label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">Choose Image<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; notify("Uploading photo..."); const fd = new FormData(); fd.append("file", file); fd.append("title", "Gallery Image"); fd.append("category", "Gallery"); try { const res = await fetch("/api/documents", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); setGalleryImageUrl("/api/documents?id=" + data._id); notify("Photo uploaded successfully!"); } catch (err) { alert("Upload failed: " + err.message); } }} /></label><span className="text-[10px] text-stone-400">JPG, PNG, WebP</span></div></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowGalleryModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Photo"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;

  if (page === "admin-recognition") return <><AdminHeader title="Recognition Management" text="Manage recognition records and document references." actions={<Button onClick={() => setShowRecModal(true)}><Plus className="h-4 w-4" /> Add Record</Button>} /><section className="border border-stone-200 bg-white p-5"><div className="divide-y divide-stone-100">{loadingRecs ? <div className="text-stone-400 text-xs">Loading records...</div> : recs.length === 0 ? <div className="text-stone-400 text-xs">No records in database. Add one.</div> : recs.map((row) => <div key={row._id} className="flex items-center justify-between p-4"><div className="space-y-1"><h2 className="text-xs font-semibold text-stone-800">{row.title}</h2><p className="text-[10px] text-stone-400">Reference: {row.reference}</p></div><div className="flex gap-2 items-center"><a href={row.documentUrl} download className="text-xs font-semibold text-stone-600 hover:text-[#a1283c] hover:underline flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> View PDF</a><button onClick={() => handleDeleteRec(row._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2"><Trash2 className="h-3.5 w-3.5 inline mr-1" />Delete</button></div></div>)}</div></section>

  <AnimatePresence>{showRecModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/50 p-5"><motion.form initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onSubmit={handleAddRec} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4"><h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Add Recognition Document</h3><button type="button" onClick={() => setShowRecModal(false)}><X className="h-5 w-5 text-stone-400" /></button></div><div className="space-y-4"><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Document Title *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={recTitle} onChange={e => setRecTitle(e.target.value)} placeholder="e.g. Quality Compliance Record" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Reference Code *</label><input required className="w-full rounded border border-stone-200 p-2 text-xs outline-none focus:border-[#a1283c]" value={recReference} onChange={e => setRecReference(e.target.value)} placeholder="e.g. TBSTE/REC/2026/108" /></div><div><label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Upload Certificate File</label><div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">{recDocUrl && <span className="text-xs text-stone-600 font-semibold truncate max-w-xs">{recDocUrl}</span>}<label className="cursor-pointer rounded border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">Choose File<input type="file" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; notify("Uploading document..."); const fd = new FormData(); fd.append("file", file); fd.append("title", "Recognition Document"); fd.append("category", "Recognition"); try { const res = await fetch("/api/documents", { method: "POST", body: fd }); if (!res.ok) throw new Error("Upload failed"); const data = await res.json(); setRecDocUrl("/api/documents?id=" + data._id); notify("File uploaded successfully!"); } catch (err) { alert("Upload failed: " + err.message); } }} /></label></div></div></div><div className="flex justify-end gap-2 border-t border-stone-200 pt-4 mt-4"><Button type="button" variant="secondary" onClick={() => setShowRecModal(false)}>Cancel</Button><Button disabled={saving} type="submit">{saving ? "Saving..." : "Save Record"}</Button></div></motion.form></motion.div>}</AnimatePresence></>;

  if (page === "admin-messages") return <><AdminHeader title="Contact Messages" text="Review and respond to website enquiries." /></>;
  return null;
}

function renderAdminPage(page: Page, navigate: Navigate, notify: (message: string) => void) {
  switch (page) {
    case "admin-dashboard": return <AdminDashboard navigate={navigate} />;
    case "admin-results": return <AdminResults navigate={navigate} notify={notify} />;
    case "admin-import": return <AdminImport navigate={navigate} notify={notify} />;
    case "admin-students": return <AdminStudents notify={notify} />;
    case "admin-exams": return <AdminExams notify={notify} />;
    case "admin-news": return <AdminEditorial kind="News" notify={notify} />;
    case "admin-notices": return <AdminEditorial kind="Notices" notify={notify} />;
    case "admin-downloads": return <AdminDownloads notify={notify} />;
    case "admin-settings": return <AdminSettings notify={notify} />;
    case "admin-add-result": return <AdminAddResult navigate={navigate} notify={notify} />;
    default: return <AdminCollection page={page} notify={notify} />;
  }
}


function StudentLoginPage({ navigate }: { navigate: Navigate }) {
  const [enrollment, setEnrollment] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enrollment.trim().length < 4) {
      setError("Please enter a valid Enrollment Number.");
      return;
    }
    if (!dob) {
      setError("Please select your Date of Birth.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    // Simulate API call for login
    setTimeout(() => {
      setLoading(false);
      navigate("student-zone");
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fcf7f8] py-12 px-5">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="bg-[#4a131c] px-6 py-8 text-center text-white">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-[#4a131c]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Student Portal</h2>
          <p className="text-stone-300 mt-2 text-sm">Secure sign in to your learner account</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <Field 
            label="Enrollment Number" 
            placeholder="e.g. 2601842" 
            value={enrollment}
            onChange={setEnrollment}
            required
          />
          
          <Field 
            label="Date of Birth" 
            type="date"
            value={dob}
            onChange={setDob}
            required
          />
          
          <div className="pt-2">
            <Button type="submit" className="w-full text-base py-3 h-auto" disabled={loading}>
              {loading ? (
                <><LoaderCircle className="h-5 w-5 animate-spin" /> Authenticating...</>
              ) : (
                <><LogIn className="h-5 w-5" /> Sign In</>
              )}
            </Button>
          </div>
          
          <p className="text-center text-xs text-stone-500 mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-lime-600" />
            256-bit secure connection
          </p>
        </form>
      </div>
    </div>
  );
}

function renderPublicPage(page: Page, navigate: Navigate, notify: (message: string) => void) {
  switch (page) {
    case "about": return <AboutPage navigate={navigate} />;
    case "recognition": return <RecognitionPage navigate={navigate} />;
    case "programmes": return <ProgrammesPage navigate={navigate} />;
    case "examinations": return <ExaminationsPage navigate={navigate} />;
    case "results": return <ResultsPage navigate={navigate} />;
    case "result-detail": return <ResultDetailPage navigate={navigate} notify={notify} />;
    case "verification": return <VerificationPage navigate={navigate} />;
    case "result-archive": return <ResultArchivePage navigate={navigate} />;
    case "news": return <NewsPage navigate={navigate} />;
    case "news-detail": return <NewsDetailPage navigate={navigate} />;
    case "notices": return <NoticesPage navigate={navigate} />;
    case "downloads": return <DownloadsPage navigate={navigate} notify={notify} />;
    case "student-zone": return <StudentZonePage navigate={navigate} />;
    case "services": return <ServicesPage navigate={navigate} notify={notify} />;
    case "gallery": return <GalleryPage navigate={navigate} />;
    case "contact": return <ContactPage navigate={navigate} />;
    case "student-login": return <StudentLoginPage navigate={navigate} />;
    default: return <HomePage navigate={navigate} />;
  }
}

const validPages: Page[] = [
  "home", "about", "recognition", "programmes", "examinations", "results", "result-detail", "verification", "result-archive", "news", "news-detail", "notices", "downloads", "student-zone", "services", "gallery", "contact", "admin-dashboard", "admin-results", "admin-import", "admin-students", "admin-exams", "admin-news", "admin-notices", "admin-downloads", "admin-programmes", "admin-gallery", "admin-recognition", "admin-messages", "admin-settings", "admin-add-result", "system-result-view", "student-login",
];

function pageFromHash(): Page {
  if (typeof window === "undefined") return "home";
  const value = window.location.hash.replace("#", "") as Page;
  return validPages.includes(value) ? value : "home";
}




function SystemRegistration({ notify }: { notify: (msg: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ enrollmentNumber: '', name: '', fatherName: '', dob: '', course: '', email: '', phone: '', address: '', passwordHash: 'defaultpass' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/students', { method: 'POST', body: JSON.stringify(formData) });
      if (res.ok) { notify('Student registered successfully!'); setFormData({ enrollmentNumber: '', name: '', fatherName: '', dob: '', course: '', email: '', phone: '', address: '', passwordHash: 'defaultpass' }); }
      else alert('Failed to register');
    } catch (err) { alert('Error registering'); } finally { setSaving(false); }
  };

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Student Registration</h2>
      <form onSubmit={submit} className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm max-w-3xl space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Enrollment Number" required value={formData.enrollmentNumber} onChange={(v) => setFormData({...formData, enrollmentNumber: v})} />
          <Field label="Course" required value={formData.course} onChange={(v) => setFormData({...formData, course: v})} />
          <Field label="Full Name" required value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
          <Field label="Father's Name" required value={formData.fatherName} onChange={(v) => setFormData({...formData, fatherName: v})} />
          <Field label="Date of Birth" type="date" required value={formData.dob} onChange={(v) => setFormData({...formData, dob: v})} />
          <Field label="Email" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
          <Field label="Phone" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
        </div>
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Register Student"}</Button>
        </div>
      </form>
    </div>
  );
}

function SystemSemesters({ notify }: { notify: (msg: string) => void }) {
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', course: '', academicYear: '', isActive: true });

  const fetchSemesters = async () => {
    setLoading(true);
    try { const res = await fetch('/api/semesters'); if (res.ok) setSemesters(await res.json()); } catch(e){} finally { setLoading(false); }
  };
  useEffect(() => { fetchSemesters(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/semesters', { method: 'POST', body: JSON.stringify(formData) });
      if (res.ok) { notify('Semester added!'); fetchSemesters(); setFormData({ name: '', course: '', academicYear: '', isActive: true }); }
    } catch(e){}
  };
  const del = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch('/api/semesters?id=' + id, { method: 'DELETE' }); notify('Semester deleted'); fetchSemesters();
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Manage Semesters</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={add} className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 col-span-1 h-fit">
          <h3 className="font-semibold text-stone-800">Add New Semester</h3>
          <Field label="Semester Name" placeholder="e.g. SEMESTER - I" required value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
          <Field label="Course" placeholder="e.g. BBA" required value={formData.course} onChange={(v) => setFormData({...formData, course: v})} />
          <Field label="Academic Year" placeholder="e.g. 2026-2027" required value={formData.academicYear} onChange={(v) => setFormData({...formData, academicYear: v})} />
          <Button type="submit" className="w-full mt-2">Add Semester</Button>
        </form>
        <div className="col-span-2">
          {loading ? <div>Loading...</div> : semesters.map(s => (
            <div key={s._id} className="bg-white p-4 border border-stone-200 rounded mb-3 flex justify-between items-center">
              <div><strong className="text-stone-800">{s.name}</strong> <span className="text-xs text-stone-500 ml-2">{s.course} • {s.academicYear}</span></div>
              <button onClick={() => del(s._id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function SystemVerification({ notify }: { notify: (msg: string) => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await fetch('/api/students'); if (res.ok) setStudents(await res.json()); } catch(e){} finally { setLoading(false); }
  };
  useEffect(() => { fetchStudents(); }, []);

  const verifyStudent = async (id: string) => {
    try {
      // Dummy endpoint interaction
      notify('Student verified successfully!');
    } catch(e){}
  };

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Student Verification</h2>
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr><th className="px-5 py-3">Enrollment</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Course</th><th className="px-5 py-3 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? <tr><td colSpan={4} className="p-5 text-center text-stone-400">Loading...</td></tr> : students.length === 0 ? <tr><td colSpan={4} className="p-5 text-center text-stone-400">No students found.</td></tr> : students.map(s => (
              <tr key={s._id}>
                <td className="px-5 py-3 font-semibold text-stone-800">{s.enrollmentNumber}</td>
                <td className="px-5 py-3">{s.name}</td>
                <td className="px-5 py-3 text-stone-500">{s.course || 'N/A'}</td>
                <td className="px-5 py-3 text-right"><Button variant="secondary" className="min-h-8 py-0 text-xs px-3" onClick={() => verifyStudent(s._id)}>Verify</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemSubjects({ notify }: { notify: (msg: string) => void }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', code: '', semesterId: '', fullMarks: '100', passMarks: '40' });

  const fetchData = async () => {
    try { 
      const resSub = await fetch('/api/subjects'); if (resSub.ok) setSubjects(await resSub.json()); 
      const resSem = await fetch('/api/semesters'); if (resSem.ok) setSemesters(await resSem.json()); 
    } catch(e){}
  };
  useEffect(() => { fetchData(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, fullMarks: Number(formData.fullMarks), passMarks: Number(formData.passMarks) };
      const res = await fetch('/api/subjects', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) { notify('Subject added!'); fetchData(); setFormData({...formData, name: '', code: ''}); }
    } catch(e){}
  };
  const del = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch('/api/subjects?id=' + id, { method: 'DELETE' }); notify('Subject deleted'); fetchData();
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Manage Subjects</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={add} className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 col-span-1 h-fit">
          <h3 className="font-semibold text-stone-800">Add New Subject</h3>
          <SelectField label="Semester" required options={semesters.map(s => s._id)} />
          <div className="text-xs text-stone-400 -mt-3 mb-2 break-all">{formData.semesterId || "Select ID from dropdown"}</div>
          <select required className="w-full h-10 border rounded px-3 text-sm" value={formData.semesterId} onChange={e => setFormData({...formData, semesterId: e.target.value})}><option value="">Select Semester...</option>{semesters.map(s => <option key={s._id} value={s._id}>{s.name} ({s.course})</option>)}</select>
          <Field label="Subject Name" required value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
          <Field label="Subject Code" required value={formData.code} onChange={(v) => setFormData({...formData, code: v})} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Marks" type="number" required value={formData.fullMarks} onChange={(v) => setFormData({...formData, fullMarks: v})} />
            <Field label="Pass Marks" type="number" required value={formData.passMarks} onChange={(v) => setFormData({...formData, passMarks: v})} />
          </div>
          <Button type="submit" className="w-full mt-2">Add Subject</Button>
        </form>
        <div className="col-span-2">
          {subjects.map(s => (
            <div key={s._id} className="bg-white p-4 border border-stone-200 rounded mb-3 flex justify-between items-center">
              <div>
                <strong className="text-stone-800">{s.name}</strong> <span className="text-xs text-stone-500 ml-2">Code: {s.code}</span>
                <div className="text-xs text-stone-400 mt-1">Marks: {s.passMarks} / {s.fullMarks}</div>
              </div>
              <button onClick={() => del(s._id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemResultEntry({ notify }: { notify: (msg: string) => void }) {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Result Entry</h2>
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm max-w-xl text-center py-12">
        <FileCheck2 className="h-12 w-12 text-stone-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-stone-800">Result Entry Module</h3>
        <p className="text-sm text-stone-500 mt-2">To enter results, select a student and semester, then input the marks for each subject. Result processing logic is currently mocked.</p>
        <Button onClick={() => notify('Marks saved successfully (Mock)')} className="mt-6">Save Mock Marks</Button>
      </div>
    </div>
  );
}

function SystemExportStudents({ notify }: { notify: (msg: string) => void }) {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Export Students</h2>
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm max-w-xl">
        <p className="text-sm text-stone-600 mb-6">Download a full CSV export of all registered students, including their enrollment numbers, courses, and basic details.</p>
        <Button onClick={() => { notify('Generating CSV...'); setTimeout(() => notify('CSV Download started!'), 1000); }}><Download className="h-4 w-4 mr-2" /> Download Students (CSV)</Button>
      </div>
    </div>
  );
}

function SystemDashboardTab() {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-3 gap-6">
        {[['Total Students', '1,420', Users], ['Active Semesters', '8', CalendarDays], ['Results Declared', '12,050', FileCheck2]].map(([title, val, Icon]: any) => (
          <div key={title} className="bg-white border border-stone-200 p-5 rounded-lg flex justify-between items-center shadow-sm">
            <div><div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{title}</div><div className="text-2xl font-bold text-stone-900 mt-2">{val}</div></div>
            <Icon className="h-8 w-8 text-[#006B4C]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Ensure StudentSystemShell handles tabs


function SystemResultView() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[#006B4C] text-lg font-bold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> Result View & Print
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold rounded shadow-sm text-stone-700 hover:bg-stone-50 transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Main Dashboard
          </button>
          <div className="flex items-center gap-2 ml-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#006B4C] text-xs font-bold text-white">S</span>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-stone-800">superadmin</div>
              <div className="text-[10px] text-stone-500">Superadmin</div>
            </div>
          </div>
          <button className="flex items-center gap-1 text-red-600 text-xs font-semibold ml-4 hover:text-red-700 transition">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm">
        <div className="p-6">Mock Result View</div>
      </div>
    </div>
  );
}

function StudentSystemShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState("Result View");
  
  // Registration Form State
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentNumber, name, fatherName, dob })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register student');
      
      notify("Student registered successfully!");
      setEnrollmentNumber("");
      setName("");
      setFatherName("");
      setDob("");
    } catch (err: any) {
      notify("Error: " + err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex">
      <aside className="w-64 bg-[#0d1f2d] text-stone-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2 px-5 bg-[#006B4C] text-white">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-lg tracking-wide">Student System</span>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6 space-y-1">
            <button onClick={() => setActiveTab("Dashboard")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition ${activeTab === "Dashboard" ? "bg-[#006B4C]/20 text-[#006B4C] border-l-4 border-[#006B4C]" : "text-stone-300 hover:text-white hover:bg-white/5"}`}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button onClick={() => navigate("home")} className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition">
              <ArrowLeft className="h-4 w-4" /> Main Dashboard
            </button>
          </div>
          
          <div className="mb-6">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">STUDENTS</div>
            <div className="space-y-1">
              <button onClick={() => setActiveTab("Registration")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition ${activeTab === "Registration" ? "bg-[#006B4C]/20 text-[#006B4C] border-l-4 border-[#006B4C]" : "text-stone-300 hover:text-white hover:bg-white/5"}`}>
                <UserPlus className="h-4 w-4" /> Registration
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition">
                <UserCheck className="h-4 w-4" /> Verification
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">RESULTS</div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition">
                <FileCheck2 className="h-4 w-4" /> Result Entry
              </button>
              <button onClick={() => setActiveTab("Result View")} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition ${activeTab === "Result View" ? "bg-[#006B4C]/20 text-[#006B4C] border-l-4 border-[#006B4C]" : "text-stone-300 hover:text-white hover:bg-white/5"}`}>
                <FileText className="h-4 w-4" /> View / Print Result
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === "Result View" && <SystemResultView />}
        
        {activeTab === "Registration" && (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[#006B4C] text-lg font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5" /> Student Registration
              </h2>
            </div>
            
            <form onSubmit={handleRegister} className="bg-white border border-stone-200 rounded-xl shadow-sm p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Enrollment Number" required placeholder="Unique ID" value={enrollmentNumber} onChange={setEnrollmentNumber} />
                <Field label="Full Name" required placeholder="Student's Name" value={name} onChange={setName} />
                <Field label="Father's Name" required placeholder="Father's Name" value={fatherName} onChange={setFatherName} />
                <Field label="Date of Birth" type="date" required value={dob} onChange={setDob} />
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <Button type="submit" disabled={registering} className="w-full bg-[#006B4C] hover:bg-[#00543c]">
                  {registering ? "Saving..." : "Register Student"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "Dashboard" && (
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="text-[#006B4C] text-lg font-bold">System Dashboard</h2>
            <p className="text-stone-500">Welcome to the student management system.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StudentPortalShell({ page, navigate, notify }: { page: Page; navigate: Navigate; notify: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("My Dashboard");
  const [student, setStudent] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [activeCourse, setActiveCourse] = useState("All Programmes");
  const [allocatedCourses, setAllocatedCourses] = useState<string[]>([]);

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (!sessionStr) {
      navigate("student-login");
      return;
    }
    try {
      const session = JSON.parse(sessionStr);
      setStudent(session);
      
      Promise.all([
        fetch('/api/results?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/students?search=' + encodeURIComponent(session.enrollmentNumber)).then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch('/api/documents').then(r => r.json())
      ]).then(([resData, stuData, exmData, docData]) => {
        let profileProgs: string[] = [];
        if (stuData && stuData.length > 0) {
          const found = stuData.find((s: any) => s.enrollmentNumber === session.enrollmentNumber);
          setStudentDetails(found);
          if (found && found.programmes) profileProgs = found.programmes;
        }

        let resultsProgs: string[] = [];
        if (resData.results) {
          const myResults = resData.results.filter((r: any) => r.enrollmentNumber === session.enrollmentNumber);
          setResults(myResults);
          resultsProgs = myResults.map((r: any) => r.programme);
        } else if (resData.enrollmentNumber) {
          setResults([resData]);
          resultsProgs = [resData.programme];
        }

        const combined = Array.from(new Set([...profileProgs, ...resultsProgs]));
        setAllocatedCourses(combined);
        if (combined.length > 0) setActiveCourse(combined[0]);
        
        setExams(Array.isArray(exmData) ? exmData : []);
        setDocuments(Array.isArray(docData) ? docData : []);
        
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } catch (e) {
      navigate("student-login");
    }
  }, []);

  const portalNav = [
    { label: "My Dashboard", icon: LayoutDashboard },
    { label: "Academic Profile", icon: User },
    { label: "Examination Schedule", icon: CalendarDays },
    { label: "My Results", icon: FileCheck2 },
    { label: "Study Material", icon: BookOpen },
    { label: "Downloads & Forms", icon: Download },
    { label: "Help & Support", icon: LifeBuoy },
  ];

  if (loading || !student) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]"><LoaderCircle className="h-8 w-8 animate-spin text-[#8d1c2f]" /></div>;
  }

  const handleSignOut = () => {
    localStorage.removeItem('studentSession');
    navigate("home");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-800 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#4a131c] text-white flex flex-col transition-transform md:translate-x-0 md:static shrink-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Logo inverse compact />
          <button onClick={() => setOpen(false)} className="md:hidden text-white hover:text-stone-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#8d1c2f] flex items-center justify-center border-2 border-[#e8c476]">
              <span className="font-bold text-lg text-[#e8c476]">{student.studentName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-semibold text-sm line-clamp-1" title={student.studentName}>{student.studentName}</div>
              <div className="text-xs text-[#e8c476]">Enr: {student.enrollmentNumber}</div>
            </div>
          </div>
          {allocatedCourses.length > 0 && (
            <div className="mt-2">
              <label className="text-[10px] uppercase text-white/50 tracking-wider mb-1 block">Active Course</label>
              <select 
                className="w-full bg-[#3c0f16] border border-white/20 text-xs rounded p-1.5 outline-none text-white focus:border-[#e8c476]"
                value={activeCourse}
                onChange={e => setActiveCourse(e.target.value)}
              >
                {allocatedCourses.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {portalNav.map((item) => (
            <button key={item.label} onClick={() => { setActiveTab(item.label); setOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === item.label ? "bg-[#8d1c2f] text-white shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 bg-[#8d1c2f] hover:bg-[#721523] text-white text-xs font-semibold py-2 rounded-lg transition">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-stone-200 bg-white flex items-center justify-between px-4 md:px-8 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden text-stone-600 hover:text-stone-900">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-stone-800 text-lg md:text-xl">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <span className="text-stone-400 block font-medium">Session ID</span>
              <span className="font-semibold text-stone-700">{student.id.substring(0, 8)}...</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === "My Dashboard" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#4a131c] rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-2">
                    <span className="bg-[#e8c476] text-[#4a131c] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Official Student Portal</span>
                    <h2 className="text-xl md:text-2xl font-bold">Welcome back, {student.studentName}!</h2>
                    <p className="text-white/80 text-sm max-w-lg">Access study materials, download syllabi, view exam dates, and check your declared marksheet directly.</p>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6">
                    <GraduationCap className="h-48 w-48" />
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
                    <h2 className="font-bold text-stone-800">Upcoming Examinations</h2>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).length === 0 ? (
                      <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled for this course.</div>
                    ) : (
                      exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).map((exam, i) => (
                        <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition">
                          <div>
                            <h3 className="font-bold text-[#8d1c2f]">{exam.title}</h3>
                            <p className="text-sm text-stone-600 mt-1">{exam.description}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <span className="inline-block bg-[#faebee] text-[#8d1c2f] text-xs font-bold px-3 py-1 rounded-full mb-1">{exam.programme}</span>
                            <div className="text-sm font-semibold text-stone-800">{new Date(exam.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-b from-[#4a131c] to-[#631824] rounded-xl shadow-sm text-white overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-[#e8c476]" /> Notice Board</h2>
                  </div>
                  <div className="p-5 text-center text-sm text-white/70">
                    No new notices.
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
                  <h2 className="font-bold text-stone-800 mb-4">Quick Links</h2>
                  <div className="space-y-3">
                    <button onClick={() => notify("Admit Card not available.")} className="w-full flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-[#8d1c2f] hover:bg-[#faebee] hover:text-[#8d1c2f] transition text-sm font-semibold text-stone-700">
                      <span className="flex items-center gap-3"><FileCheck2 className="h-4 w-4" /> Admit Card</span>
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "My Results" && (
            <div className="space-y-8">
              <div className="flex justify-end no-print">
                <Button onClick={() => window.print()} className="bg-[#8d1c2f] text-white hover:bg-[#6b1422] flex items-center gap-2">
                  <Printer className="h-4 w-4" /> Download / Print Marksheet
                </Button>
              </div>

              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
                  No results available.
                </div>
              ) : (
                results.map((res: any, idx: number) => (
                  <div key={idx} className="relative bg-white border-2 border-[#8d1c2f] shadow-lg mx-auto max-w-4xl p-8 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <img src={images.logo} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
                    </div>
                    
                    {/* Official Header */}
                    <div className="relative flex flex-col items-center justify-center text-center border-b-4 border-[#8d1c2f] pb-6 mb-6">
                      <div className="flex items-center gap-6 mb-2">
                        <img src={images.logo} alt="Logo" className="h-24 w-24 object-contain" />
                        <div>
                          <h1 className="text-2xl md:text-3xl font-extrabold text-[#440d16] uppercase tracking-wider">Thar Board of School & Technical Education</h1>
                          <p className="text-[#8d1c2f] font-bold text-sm tracking-widest uppercase mt-1">Examination & Certification Authority</p>
                        </div>
                      </div>
                      <h2 className="mt-4 inline-block bg-[#440d16] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-md">
                        Official Statement of Marks
                      </h2>
                    </div>

                    {/* Student Details */}
                    <div className="relative grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Student Name:</span>
                        <span className="w-2/3 font-bold text-stone-900 uppercase">{studentDetails?.name || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Enrollment No:</span>
                        <span className="w-2/3 font-bold text-[#8d1c2f]">{res.enrollmentNumber}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Father's Name:</span>
                        <span className="w-2/3 font-semibold text-stone-900 uppercase">{studentDetails?.fatherName || '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Date of Birth:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{studentDetails?.dob ? new Date(studentDetails.dob).toLocaleDateString('en-GB') : '-'}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Examination:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.examination} {res.examYear}</span>
                      </div>
                      <div className="flex border-b border-stone-200 pb-2">
                        <span className="w-1/3 font-bold text-stone-600 text-sm">Programme:</span>
                        <span className="w-2/3 font-semibold text-stone-900">{res.programme}</span>
                      </div>
                    </div>

                    {/* Marks Table */}
                    <div className="relative mb-12">
                      <table className="w-full text-left border-collapse border border-stone-300">
                        <thead>
                          <tr className="bg-[#440d16] text-white">
                            <th className="p-3 border border-stone-300 font-bold w-1/2">Subject</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Max Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Min Marks</th>
                            <th className="p-3 border border-stone-300 font-bold text-center w-1/6">Marks Obtained</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                            <tr key={sIdx} className="odd:bg-stone-50">
                              <td className="p-3 border border-stone-300 font-semibold text-stone-800">{sub.name}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.max}</td>
                              <td className="p-3 border border-stone-300 text-center text-stone-600">{sub.min}</td>
                              <td className="p-3 border border-stone-300 text-center font-bold text-stone-900">{sub.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#faebee] border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] uppercase text-right pr-6" colSpan={3}>Grand Total</td>
                            <td className="p-3 border border-stone-300 font-bold text-[#8d1c2f] text-center text-xl">{res.grandTotal}</td>
                          </tr>
                          <tr className="border border-stone-300">
                            <td className="p-3 border border-stone-300 font-bold text-right pr-6 text-stone-600 uppercase" colSpan={3}>Result Status</td>
                            <td className={`p-3 border border-stone-300 font-extrabold text-center text-lg uppercase tracking-wider ${res.resultStatus === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
                              {res.resultStatus}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="relative mt-16 pt-8 flex justify-between items-end">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-stone-500 mb-1">Date of Issue</div>
                        <div className="font-bold text-stone-800">{new Date().toLocaleDateString('en-GB')}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="h-16 w-48 border-b-2 border-stone-400 mb-2 flex items-end justify-center pb-2">
                          {/* Placeholder for Signature Image */}
                          <span className="italic text-stone-300 text-sm">Valid Authorized Signature</span>
                        </div>
                        <div className="font-bold text-[#440d16] uppercase text-sm">Controller of Examinations</div>
                        <div className="text-xs text-stone-500 font-medium">Thar Board of School & Technical Education</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Academic Profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Academic Profile</h2>
              </div>
              <div className="p-6">
                {studentDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Student Name</span><div className="font-semibold text-stone-800">{studentDetails.name}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Enrollment Number</span><div className="font-semibold text-stone-800">{studentDetails.enrollmentNumber}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Father's Name</span><div className="font-semibold text-stone-800">{studentDetails.fatherName || '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Date of Birth</span><div className="font-semibold text-stone-800">{studentDetails.dob ? new Date(studentDetails.dob).toLocaleDateString() : '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Email Address</span><div className="font-semibold text-stone-800">{studentDetails.email || '-'}</div></div>
                    <div><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Phone Number</span><div className="font-semibold text-stone-800">{studentDetails.phone || '-'}</div></div>
                    <div className="md:col-span-2"><span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">Address</span><div className="font-semibold text-stone-800">{studentDetails.address || '-'}</div></div>
                  </div>
                ) : (
                  <div className="text-stone-500 text-center py-4">Profile details not found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Examination Schedule" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Upcoming Examinations</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No upcoming examinations scheduled for this course.</div>
                ) : (
                  exams.filter(e => e.programme === 'All Programmes' || e.programme === activeCourse).map((exam, i) => (
                    <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition">
                      <div>
                        <h3 className="font-bold text-[#8d1c2f]">{exam.title}</h3>
                        <p className="text-sm text-stone-600 mt-1">{exam.description}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="inline-block bg-[#faebee] text-[#8d1c2f] text-xs font-bold px-3 py-1 rounded-full mb-1">{exam.programme}</span>
                        <div className="text-sm font-semibold text-stone-800">{new Date(exam.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Study Material" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Study Materials & Notes</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No study materials available at the moment.</div>
                ) : (
                  documents.filter(d => ['Syllabus', 'Study Material', 'Notes'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{doc.title}</div>
                          <div className="text-xs text-stone-500">{doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <a href={`/api/documents?id=${doc._id}`} download className="h-8 w-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-[#8d1c2f] hover:text-white transition">
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Downloads & Forms" && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                <h2 className="font-bold text-stone-800">Downloads & Forms</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).length === 0 ? (
                  <div className="p-6 text-center text-stone-500">No forms or circulars available at the moment.</div>
                ) : (
                  documents.filter(d => !['Syllabus', 'Study Material', 'Notes', 'Recognition', 'Gallery', 'Programme'].includes(d.category) && (!d.programme || d.programme === 'All Programmes' || d.programme === activeCourse)).map((doc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileDown className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-sm">{doc.title}</div>
                          <div className="text-xs text-stone-500">{doc.category} • {(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <a href={`/api/documents?id=${doc._id}`} download className="h-8 w-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-[#8d1c2f] hover:text-white transition">
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Help & Support" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                  <h2 className="font-bold text-stone-800">Send us a Message</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setSupportSending(true); setTimeout(() => { setSupportSending(false); notify("Message sent to administration!"); setSupportMsg(""); }, 1000); }} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Your Message</label>
                    <textarea required rows={5} value={supportMsg} onChange={e => setSupportMsg(e.target.value)} className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none focus:border-[#8d1c2f]" placeholder="How can we help you today?"></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={supportSending}>{supportSending ? "Sending..." : "Submit Message"}</Button>
                  </div>
                </form>
              </div>
              
              <div className="bg-[#4a131c] rounded-xl shadow-sm border border-stone-200 p-6 text-white h-fit">
                <h3 className="font-bold text-lg mb-4 text-[#e8c476]">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Helpline</div>
                      <div className="text-sm font-semibold">+91 141 2700 000</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Email Support</div>
                      <div className="text-sm font-semibold">studentcare@tbste.edu.in</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-[#e8c476] shrink-0" />
                    <div>
                      <div className="text-xs text-white/70">Head Office</div>
                      <div className="text-sm font-semibold">Education Hub, Jaipur, Rajasthan 302001</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-stone-950/50 md:hidden" />}
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [toast, setToast] = useState("");

  const [cmsData, setCmsData] = React.useState({});

  const fetchCms = React.useCallback(async () => {
    try {
      const res = await fetch("/api/cms");
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      data.forEach(d => map[d.key] = d.value);
      setCmsData(map);
    } catch(e) {}
  }, []);

  useEffect(() => { fetchCms(); }, [fetchCms]);

  useEffect(() => {
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  useEffect(() => {
    const label = [...adminNav, ...navItems].find((item) => item.page === page)?.label || "Official Portal";
    document.title = `${label} | Thar Board of School and Technical Education`;
  }, [page]);

  function navigate(next: Page) {
    if (next !== page) window.history.pushState({}, "", `#${next}`);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  const isAdmin = page.startsWith("admin-");
  const isSystem = page.startsWith("system-");
  const isPortal = page === "student-zone";
  return <CmsContext.Provider value={{ cmsData, fetchCms }}>
    {isSystem ? <StudentSystemShell page={page} navigate={navigate} notify={notify} /> : isPortal ? <StudentPortalShell page={page} navigate={navigate} notify={notify} /> : isAdmin ? <AdminShell page={page} navigate={navigate} notify={notify} /> : <div className="min-h-screen bg-white"><PublicHeader navigate={navigate} active={page} /><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{renderPublicPage(page, navigate, notify)}</motion.div></AnimatePresence><Footer navigate={navigate} />{page !== "results" && page !== "result-detail" && <button onClick={() => navigate("results")} className="fixed bottom-4 left-4 right-4 z-40 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f57214] text-sm font-bold text-white shadow-xl md:hidden"><Search className="h-4 w-4" /> Check Your Result</button>}</div>}
    <AnimatePresence>{toast && <motion.div role="status" initial={{ opacity: 0, y: 16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 8, x: "-50%" }} className="fixed bottom-6 left-1/2 z-[120] flex min-w-[280px] items-center gap-3 rounded-lg bg-[#4a131c] px-4 py-3 text-sm font-medium text-white shadow-2xl"><CheckCircle2 className="h-5 w-5 text-lime-400" />{String(toast)}</motion.div>}</AnimatePresence>
  </CmsContext.Provider>;
}
