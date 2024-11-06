import { Container } from "@/components/Container";
import { AdminNavBar, AdminNavBarMobile } from "./AdminNavBar";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  return (
    <>
      <NavBar />

      <Container className="relative sm:space-y-4">
        <AdminNavBar />
        <AdminNavBarMobile />

        {children}
      </Container>

      <Footer />
    </>
  );
}
