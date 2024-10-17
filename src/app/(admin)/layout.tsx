import { AdminNavBar } from "@/components/AdminNavBar";
import { Container } from "@/components/Container";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <Container className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
        <AdminNavBar />
        <div className="flex-1">{children}</div>
      </Container>
      <Footer />
    </>
  );
}
