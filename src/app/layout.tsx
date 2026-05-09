import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DYFI Pinarayi Blood Connect",
  description: "Blood Donor Management System for DYFI Pinarayi Block Committee",
  icons: {
    icon: "/images/DYFI-Logo.jpg",
    apple: "/images/DYFI-Logo.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50/50`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
