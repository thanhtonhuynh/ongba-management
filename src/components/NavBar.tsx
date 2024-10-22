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
    <header className="sticky top-0 z-10 border-b bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-1 font-bold">
            <Image
              src={ongbaLogo}
              alt="Ongba Logo"
              width={40}
              height={40}
              className="aspect-square object-cover"
            />
            <span className="text-xl tracking-wider">ONGBA</span>
          </Link>

          <NavLink href={`/report`}>Sale Reports</NavLink>
        </div>

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
