import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Blind Spot Review",

  description:
    "Start a Tax Blind Spot Review to identify potential planning opportunities involving income, investments, retirement accounts, business ownership, charitable giving, and major financial decisions.",

  alternates: {
    canonical: "/tax-opportunity-scan",
  },

  openGraph: {
    title: "Tax Blind Spot Review | Unity Tax Planning",
    description:
      "Complete a short intake to help identify tax planning opportunities that may deserve a closer review.",
    url: "/tax-opportunity-scan",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tax Blind Spot Review | Unity Tax Planning",
    description:
      "Complete a short intake to help identify tax planning opportunities that may deserve a closer review.",
  },
};

export default function TaxOpportunityScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}