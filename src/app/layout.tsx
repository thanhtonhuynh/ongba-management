import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/contexts/SessionProvider";
import { getCurrentSession } from "@/lib/auth/session";
import { ThemeProvider } from "@/contexts/ThemeProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ongba Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getCurrentSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} !p-0 font-sans antialiased`}
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
