import { getCurrentSession } from "@/lib/auth/session";
import { CircleAlert } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.userVerified) redirect("/");

  return (
    <main className="flex h-[90vh] items-center justify-center">
      <div className="flex w-full max-w-[30rem] items-center justify-center gap-4 rounded-lg bg-destructive p-4 py-8 text-muted shadow-lg">
        <CircleAlert size={25} />

        <div>
          <div>You are not verified to perform any action.</div>
          <div>Please ask a manager to verify your account.</div>
        </div>
      </div>
    </main>
  );
}
