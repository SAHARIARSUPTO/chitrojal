import type { Metadata } from "next";
import "./globals.css";
import NotificationRenderer from "./components/shared/NotificationRenderer"; // Import NotificationRenderer

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <NotificationRenderer /> {/* Render the NotificationRenderer */}
      </body>
    </html>
  );
}
