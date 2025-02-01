import { Container } from "@/components/Container";
import Footer from "@/components/Footer";
import { ErrorMessage } from "@/components/Message";
import NavBar from "@/components/NavBar";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { AdminNavBar, AdminNavBarMobile } from "./AdminNavBar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

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
