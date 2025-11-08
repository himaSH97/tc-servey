import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";
import { LanguageProvider } from "~/providers/language-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tour connect - Connecting Tour Guides & Drivers with Tourists",
  description:
    "Tour connect is an online platform that connects tour guides and drivers with tourists. Get early access and be among the first to join when we launch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <Toaster />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
