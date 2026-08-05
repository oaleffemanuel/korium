import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "contabilidade",
    "trocar de contador",
    "contabilidade para clínicas",
    "contabilidade para médicos",
    "contabilidade para empresas de tecnologia",
    "contabilidade online",
    "escritório de contabilidade",
  ],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Font variables live on <html> so :root can resolve them.
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrument.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
