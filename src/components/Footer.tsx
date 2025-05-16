import ongbaLogo from "@/assets/ongbaIcon.png";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Footer() {
  return (
    <footer className="flex items-center gap-4 border-t px-4 py-8 md:px-8">
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
    </footer>
  );
}
