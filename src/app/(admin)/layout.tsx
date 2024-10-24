import { Container } from "@/components/Container";
import { AdminNavBar, AdminNavBarMobile } from "./AdminNavBar";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
