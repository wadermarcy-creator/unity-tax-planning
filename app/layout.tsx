import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "Unity Tax Planning";

const siteDescription =
  "Proactive tax planning for business owners, high-income families, retirees, and investors. Identify potential tax blind spots before important financial decisions are finalized.";

export const metadata: Metadata = {
  metadataBase: new URL("https://unitytaxplanning.com"),

  title: {
    default: "Unity Tax Planning | Proactive Tax Planning",
    template: "%s | Unity Tax Planning",
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    "tax planning",
    "proactive tax planning",
    "tax strategy",
    "business owner tax planning",
    "high income tax planning",
    "retirement tax planning",
    "Roth conversion planning",
    "capital gains tax planning",
    "charitable giving tax planning",
    "investment tax planning",
    "tax blind spot review",
    "financial planning",
  ],

  authors: [
    {
      name: "Unity Tax Planning",
    },
  ],

  creator: "Unity Tax Planning",
  publisher: "Unity Tax Planning",
  category: "Financial Services",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: "Unity Tax Planning | Proactive Tax Planning",
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title: "Unity Tax Planning | Proactive Tax Planning",
    description: siteDescription,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}