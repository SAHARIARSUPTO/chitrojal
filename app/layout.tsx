import type { Metadata } from "next";
import "./globals.css";
import NotificationRenderer from "./components/shared/NotificationRenderer"; // Import NotificationRenderer

const siteUrl = 'https://www.chitrojaal.com'; //TODO: Change this to the actual domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "চিত্রজাল - Cinematic Wedding Photography & Films in Bangladesh",
  description:
    "চিত্রজাল (ChitroJal) offers premium wedding photography and cinematic videography services in Feni, Bangladesh. Book us for your special day to capture your moments beautifully.",
  keywords: [
    "Wedding Photography Bangladesh",
    "Cinematic Wedding Feni",
    "ChitroJal",
    "Best Photographer in Feni",
    "Event Photography",
    "চিত্রজাল",
    "ওয়েডিং ফটোগ্রাফি",
  ],
  openGraph: {
    title: "চিত্রজাল - Cinematic Wedding Photography & Films in Bangladesh",
    description: "চিত্রজাল (ChitroJal) offers premium wedding photography and cinematic videography services in Feni, Bangladesh. Book us for your special day to capture your moments beautifully.",
    url: siteUrl,
    siteName: 'ChitroJal',
    images: [
      {
        url: `${siteUrl}/logo.png`, // Must be a full URL
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "চিত্রজাল - Cinematic Wedding Photography & Films in Bangladesh",
    description: "চিত্রজাল (ChitroJal) offers premium wedding photography and cinematic videography services in Feni, Bangladesh. Book us for your special day to capture your moments beautifully.",
    images: [`${siteUrl}/logo.png`], // Must be a full URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <NotificationRenderer /> {/* Render the NotificationRenderer */}
      </body>
    </html>
  );
}
