import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
