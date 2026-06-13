import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Received",

  description:
    "Confirmation that your Tax Blind Spot Review has been submitted to Unity Tax Planning.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}