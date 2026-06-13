import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Planning Pricing",

  description:
    "Review pricing for the Tax Blind Spot Review, comprehensive tax planning, and advanced family office-style tax planning coordination.",

  alternates: {
    canonical: "/pricing",
  },

  openGraph: {
    title: "Tax Planning Pricing | Unity Tax Planning",
    description:
      "Compare tax planning engagement options for high-income families, business owners, retirees, investors, and complex planning situations.",
    url: "/pricing",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tax Planning Pricing | Unity Tax Planning",
    description:
      "Compare tax planning engagement options for high-income families, business owners, retirees, investors, and complex planning situations.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}