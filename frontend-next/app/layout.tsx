import type { Metadata } from "next";
import SignupPopup from "@/components/SignupPopup";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sahomeschooling.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SA Homeschooling & Beyond",
    template: "%s | SA Homeschooling & Beyond",
  },
  description:
    "Practical education, parenting, development, partner, and magazine resources for South African homeschooling families.",
  openGraph: {
    type: "website",
    siteName: "SA Homeschooling & Beyond",
    title: "SA Homeschooling & Beyond",
    description:
      "Practical education, parenting, development, partner, and magazine resources for South African homeschooling families.",
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
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
        {children}
        <SignupPopup />
      </body>
    </html>
  );
}
