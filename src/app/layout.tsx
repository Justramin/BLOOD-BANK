import type { Metadata } from "next";
import { Inter, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "DYFI Pinarayi Blood Connect | Saving Lives Together",
  description: "A humanitarian volunteer-driven blood donation network by DYFI Pinarayi Block Committee.",
  icons: {
    icon: "/Images/DYFI-Logo.jpg",
    apple: "/Images/DYFI-Logo.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} ${nunito.variable} font-sans min-h-full bg-slate-50/50 antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
