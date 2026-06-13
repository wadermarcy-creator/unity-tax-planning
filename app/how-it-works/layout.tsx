import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Tax Planning Works",
  description:
    "Learn how Unity Tax Planning reviews your financial situation, identifies potential tax planning opportunities, prepares a written plan, and coordinates next steps with your professionals.",

  alternates: {
    canonical: "/how-it-works",
  },

  openGraph: {
    title: "How Tax Planning Works | Unity Tax Planning",
    description:
      "See the process for identifying tax blind spots, reviewing documents, preparing a written planning summary, and coordinating implementation.",
    url: "/how-it-works",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "How Tax Planning Works | Unity Tax Planning",
    description:
      "See the process for identifying tax blind spots, reviewing documents, preparing a written planning summary, and coordinating implementation.",
  },
};

export default function HowItWorksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}