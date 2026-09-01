import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Thar Board of School and Technical Education",
    template: "%s | Thar Board of School and Technical Education"
  },
  description: "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
  keywords: ["Education Board", "Thar Board", "Technical Education", "Examination Results", "Student Portal", "TBSTE"],
  authors: [{ name: "TBSTE" }],
  openGraph: {
    title: "Thar Board of School and Technical Education",
    description: "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
    url: "https://tbste.edu",
    siteName: "Thar Board of School and Technical Education",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}