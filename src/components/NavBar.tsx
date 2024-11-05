import Link from "next/link";
import UserButton from "@/components/buttons/UserButton";
import { Button } from "./ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import ongbaIcon from "@/assets/ongbaIcon.png";
import { NavLink } from "./Nav";
import { ModeToggle } from "./ModeToggle";

export default async function NavBar() {
  const { user } = await getCurrentSession();

  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center space-x-1 font-bold">
            <Image
              src={ongbaIcon}
              alt="Ongba Logo"
              width={40}
              height={40}
              className="aspect-square object-cover dark:invert"
            />
            <span className="text-xl tracking-wider">ONGBA</span>
          </Link>

          <NavLink href={`/report`}>Sale Reports</NavLink>

          <NavLink href={`/my-shifts`}>My Shifts</NavLink>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          {user ? (
            <UserButton user={user} />
          ) : (
            <Button asChild>
              <Link href={`/login`}>Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
