import type { Metadata } from 'next';
import ClientApp from '../ClientApp';

type Props = {
  params: Promise<{ route?: string[] }>
}

const descriptions: Record<string, string> = {
  "home": "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
  "about": "Learn about the Thar Board of School and Technical Education, our mission, vision, and guiding principles.",
  "contact": "Contact the Thar Board of School and Technical Education for student services, examination support, and result queries.",
  "programmes": "Explore academic programmes offered by the Thar Board of School and Technical Education.",
  "results": "Check your examination results online. Enter your enrollment number and registration number to view your results.",
  "news": "Latest news and updates from Thar Board of School and Technical Education.",
  "notices": "Official notices and circulars from Thar Board of School and Technical Education.",
  "downloads": "Download forms, syllabus, and other official documents.",
  "student-zone": "Secure portal for students of Thar Board of School and Technical Education."
};

const navItems = [
  { page: "home", label: "Home" },
  { page: "about", label: "About" },
  { page: "programmes", label: "Programmes" },
  { page: "examinations", label: "Examinations" },
  { page: "results", label: "Results" },
  { page: "contact", label: "Contact Us" },
  { page: "news", label: "News & Updates" },
  { page: "notices", label: "Official Notices" },
  { page: "downloads", label: "Downloads" },
  { page: "student-zone", label: "Student Zone" }
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const route = resolvedParams.route?.[0] || 'home';
  const label = navItems.find((item) => item.page === route)?.label || "Official Portal";
  
  // Custom title logic to match exactly what they had
  const title = `${label} | Thar Board of School and Technical Education`;
  const desc = descriptions[route] || descriptions["home"];
  
  const url = `https://tharboard.in${route === 'home' ? '' : '/' + route}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description: desc,
      url: url,
      siteName: 'Thar Board of School and Technical Education',
    },
    twitter: {
      title,
      description: desc,
    }
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const route = resolvedParams.route?.[0] || 'home';
  
  // Cast route to any since the types in ClientApp expect a specific union
  return <ClientApp initialPage={route as any} />
}
