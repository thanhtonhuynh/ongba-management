import Link from "next/link";
import UserButton from "@/components/buttons/UserButton";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import ongbaIcon from "@/assets/ongbaIcon.png";
import { NavLink } from "./Nav";
import { ModeToggle } from "./ModeToggle";

export default async function NavBar() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 mb-4 border-b bg-background px-3 shadow-sm">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 py-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-1 font-bold">
            <Image
              src={ongbaIcon}
              alt="Ongba Logo"
              width={40}
              height={40}
              className="aspect-square object-cover dark:invert"
            />
            <span className="text-xl tracking-wider">ONGBA</span>
          </Link>

          <div className="hidden sm:block sm:space-x-1">
            <NavLink href={`/report`}>Sale Reports</NavLink>
            <NavLink href={`/cash-counter`}>Cash Counter</NavLink>
            <NavLink href={`/my-shifts`}>My Shifts</NavLink>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          <UserButton user={user} />
        </div>
      </nav>

      <div className="mb-1 flex justify-center space-x-2 sm:hidden">
        <NavLink href={`/report`}>Sale Reports</NavLink>
        <NavLink href={`/cash-counter`}>Cash Counter</NavLink>
        <NavLink href={`/my-shifts`}>My Shifts</NavLink>
      </div>
    </header>
  );
}
