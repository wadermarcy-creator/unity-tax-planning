import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Planning Frequently Asked Questions",

  description:
    "Read answers to common questions about proactive tax planning, pricing, documents, CPA coordination, privacy, and the Tax Blind Spot Review.",

  alternates: {
    canonical: "/faq",
  },

  openGraph: {
    title: "Tax Planning FAQ | Unity Tax Planning",
    description:
      "Learn how proactive tax planning works, what an engagement may include, how pricing is determined, and how Unity Tax Planning coordinates with other professionals.",
    url: "/faq",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tax Planning FAQ | Unity Tax Planning",
    description:
      "Answers to common questions about proactive tax planning, pricing, documents, privacy, and professional coordination.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}