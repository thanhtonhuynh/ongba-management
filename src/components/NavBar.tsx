import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import ongbaLogo from "@/assets/ongbaIcon.png";
import { NavLink } from "./Nav";

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
          <div className="flex items-center space-x-4">
            <NavLink href={`/report`}>Sale Reports</NavLink>

            <UserButton user={user} />
          </div>
        ) : (
          <Button asChild>
            <Link href={`/login`}>Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
