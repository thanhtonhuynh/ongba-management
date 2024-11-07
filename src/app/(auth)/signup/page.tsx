import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { SignUpForm } from "./SignUpForm";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session) redirect("/");

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-[40rem] flex-col items-center justify-center space-y-4 rounded-xl border p-4 py-8 shadow-xl">
        <h1>Sign Up</h1>

        <SignUpForm />

        <Link href={`/login`} className="text-center hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
}
