import type { Metadata } from "next";
import "./globals.css";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";

export const metadata: Metadata = {
  title: "SIAGA — BMKG Warning-to-Action Copilot",
  description:
    "Menerjemahkan peringatan dini cuaca resmi BMKG menjadi rencana tindakan operasional berbasis lokasi dan peran.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <div className="flex-1 flex flex-col">{children}</div>
        <DisclaimerBanner />
      </body>
    </html>
  );
}
