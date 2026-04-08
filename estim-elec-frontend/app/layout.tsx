import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AppShell from "@/components/AppShell";
import ToastContainer from "@/components/Toast";
import "./globals.css";
import {ThemeToggle} from "@/components/ThemeToggle";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstimElec — Gestion de devis électriques",
  description: "Application de gestion de devis électriques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-white dark:bg-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
