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
      <Container className="relative flex flex-col sm:space-y-4 md:flex-row md:space-x-12 md:space-y-0 lg:max-w-screen-xl">
        <AdminNavBar />
        <AdminNavBarMobile />

        <div className="flex-1">{children}</div>
      </Container>
      <Footer />
    </>
  );
}
