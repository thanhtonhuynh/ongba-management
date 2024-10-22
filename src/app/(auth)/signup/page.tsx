import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { SignUpForm } from "./SignUpForm";
import Image from "next/image";
import ongbaLogo from "@/assets/ongbaLogo.png";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session) redirect("/");

  return (
    <main className="flex flex-col items-center justify-center md:h-screen">
      <Image
        src={ongbaLogo}
        alt="Ongba Logo"
        width={250}
        height={250}
        className="aspect-square object-cover"
      />

      <div className="flex w-full max-w-[40rem] flex-col items-center justify-center space-y-4 rounded-xl border p-4 py-8 shadow-xl">
        <h1 className="text-3xl font-bold">Sign Up</h1>

        <SignUpForm />

        <Link href={`/login`} className="text-center hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
}
