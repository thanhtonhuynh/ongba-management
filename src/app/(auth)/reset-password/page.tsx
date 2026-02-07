import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function Page() {
  const token = (await cookies()).get("pw-reset")?.value;
  if (!token) redirect("/login/forgot-password");
  const { session } = await getCurrentSession();
  if (session) redirect("/");

  return (
    <main className="flex h-[90vh] items-center justify-center">
      <div className="flex h-full max-h-140 w-full max-w-160 flex-col items-center justify-center space-y-4 rounded-xl border p-4 py-8 shadow-xl">
        <h1>Enter new password</h1>

        <div className="flex w-1/2 flex-col space-y-4">
          <ResetPasswordForm />

          <Button
            className="w-full gap-1"
            variant={"outline"}
            render={
              <Link href={"/login"}>
                <ArrowLeft size={15} />
                Back to Login
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
}
