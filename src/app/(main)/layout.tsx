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
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
