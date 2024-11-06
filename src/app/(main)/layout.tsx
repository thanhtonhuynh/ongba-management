import { Container } from "@/components/Container";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <>
      <NavBar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
