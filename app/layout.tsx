import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PK2XK537";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unitytaxplanning.com"),
  title: "Unity Tax Planning",
  description: "Mission Control for proactive tax planning.",
  openGraph: {
    title: "Unity Tax Planning",
    description: "Mission Control for proactive tax planning.",
    url: "https://www.unitytaxplanning.com",
    siteName: "Unity Tax Planning",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unity Tax Planning",
    description: "Mission Control for proactive tax planning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {GTM_ID ? (
          <>
            <Script
              id="google-tag-manager"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />

            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        ) : null}

        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
