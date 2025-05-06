import ongbaLogo from "@/assets/ongbaIcon.png";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default async function Footer() {
  return (
    <footer className="flex flex-col-reverse items-center justify-between gap-4 border-t p-4 sm:flex-row md:px-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center font-bold">
          <Image
            src={ongbaLogo}
            alt="Ongba Logo"
            width={30}
            height={30}
            className="aspect-square object-cover dark:invert"
          />
          ONGBA
        </Link>

        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()}, Ongba Vietnamese Eatery.</p>
          <p className="flex items-center gap-1">
            Built by Ton Huynh with <Heart size={15} fill="#FF0000" />
          </p>
        </div>
      </div>

      <ModeToggle />
    </footer>
  );
}
