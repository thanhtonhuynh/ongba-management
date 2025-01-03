import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";
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
        className="aspect-square h-64 w-64 object-cover dark:invert"
      />

      <div className="flex w-full max-w-[40rem] flex-col items-center justify-center space-y-4 rounded-xl border p-4 py-8 shadow-xl">
        <h1>Ongba Management System</h1>

        <LoginForm />

        <Link href={`/signup`} className="text-center hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </main>
  );
}
