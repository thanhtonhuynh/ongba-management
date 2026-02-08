import { AppSidebar } from "@/components/app-sidebar";
import { TailwindScreenSizeIndicator } from "@/components/dev/tw-screen-size-indicator";
import { Footer } from "@/components/layout";
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

export const metadata: Metadata = { title: "Serva" };

export const viewport: Viewport = { maximumScale: 1 };

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, user } = await getCurrentSession();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} scroll-smooth`}
    >
      <body
        className={`${geistSans.variable} font-inter bg-neutral-100 antialiased`}
      >
        <ThemeProvider>
          <SessionProvider session={session} user={user}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="overflow-x-auto md:peer-data-[variant=floating]:m-2 md:peer-data-[variant=floating]:ml-0 md:peer-data-[variant=floating]:peer-data-[state=collapsed]:ml-1">
                <div className="flex flex-1 flex-col">{children}</div>
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
