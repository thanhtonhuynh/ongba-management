import { SessionProvider } from "@/contexts/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { getCurrentSession } from "@/lib/auth/session";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { title: "Ongba Management System" };

export const viewport: Viewport = { maximumScale: 1 };

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, user } = await getCurrentSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-geist-sans p-0! antialiased`}
      >
        <ThemeProvider>
          <SessionProvider value={{ session, user }}>
            {children}
          </SessionProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
