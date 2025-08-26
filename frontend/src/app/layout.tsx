/**
 * Layout file of the Frontend Intern project
 * Author: Dhaval Shrishrimal
 */

// External Imports
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Internal Imports
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientProvider } from "@/components/client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intern Project",
  description: "Intern Project for MAI by Fibonaco",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ClientProvider>
            {children}
            <Toaster richColors closeButton position="top-right" swipeDirections={['right', 'top']} visibleToasts={5} duration={7000} />
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
