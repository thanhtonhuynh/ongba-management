import ongbaLogo from "@/assets/ongbaLogo.png";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session) redirect("/");

  return (
    <main className="flex flex-col items-center justify-center md:h-screen">
      <Image
        src={ongbaLogo}
        alt="Ongba Logo"
        className="aspect-square h-64 w-64 object-cover"
      />

      <div className="flex w-full max-w-160 flex-col items-center justify-center space-y-4 rounded-xl border p-4 py-8 shadow-xl">
        <h1>Ongba Management System</h1>

        <LoginForm />

        <Link href={`/signup`} className="text-center hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </main>
  );
}
