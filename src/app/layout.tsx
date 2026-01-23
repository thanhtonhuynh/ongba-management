import { AppSidebar } from "@/components/app-sidebar";
import { TailwindScreenSizeIndicator } from "@/components/dev/tw-screen-size-indicator";
import Footer from "@/components/Footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "@/contexts/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { getCurrentSession } from "@/lib/auth/session";
import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = { title: "Ongba Management System" };

export const viewport: Viewport = { maximumScale: 1 };

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, user } = await getCurrentSession();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className={`${geistSans.variable} font-inter antialiased`}>
        <ThemeProvider>
          <SessionProvider session={session} user={user}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="w-[calc(100svw-var(--sidebar-width))] overflow-x-auto">
                <div className="relative flex flex-1 flex-col md:rounded-t-xl">
                  {children}
                </div>
                <Footer />
                <Toaster richColors />
              </SidebarInset>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
        <TailwindScreenSizeIndicator />
      </body>
    </html>
  );
}
