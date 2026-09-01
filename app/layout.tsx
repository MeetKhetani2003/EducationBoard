import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tharboard.in'),
  title: {
    default: "Thar Board of School and Technical Education",
    template: "%s | Thar Board of School and Technical Education"
  },
  description: "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
  keywords: ["Education Board", "Thar Board", "Technical Education", "Examination Results", "Student Portal", "Thar Board"],
  authors: [{ name: "Thar Board of School and Technical Education" }],
  openGraph: {
    title: "Thar Board of School and Technical Education",
    description: "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
    url: "https://tharboard.in",
    siteName: "Thar Board of School and Technical Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thar Board of School and Technical Education",
    description: "Official portal for Thar Board of School and Technical Education. Access examination results, admit cards, student services, and academic programmes.",
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