import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import ongbaLogo from "@/assets/ongbaIcon.png";

export default async function NavBar() {
  const { user } = await getCurrentSession();

  return (
    <header className="sticky top-0 border-b bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3">
        <Link href="/" className="flex items-center font-bold">
          <Image
            src={ongbaLogo}
            alt="Ongba Logo"
            width={30}
            height={30}
            className="aspect-square object-cover"
          />
          ONGBA
        </Link>

        {user ? (
          <UserButton user={user} />
        ) : (
          <Button asChild>
            <Link href={`/login`}>Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
