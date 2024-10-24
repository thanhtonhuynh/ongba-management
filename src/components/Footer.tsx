import Link from "next/link";
import Image from "next/image";
import ongbaLogo from "@/assets/ongbaIcon.png";
import { Heart } from "lucide-react";

export default async function Footer() {
  return (
    <footer className="border-t bg-background px-3 py-8">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
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

        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()}, Ongba Vietnamese Eatery.</p>
          <p className="flex items-center gap-1">
            Built by Ton with <Heart size={15} fill="#FF0000" />
          </p>
        </div>
      </div>
    </footer>
  );
}
