import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { UpdateNameForm } from "./UpdateNameForm";
import { UpdateUsernameForm } from "./UpdateUsernameForm";
import { UpdateEmailForm } from "./UpdateEmailForm";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { UpdateAvatar } from "./UpdateAvatar";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <section className="space-y-4">
      <h1>Account settings</h1>

      <Separator />

      <UpdateAvatar user={user} />

      <UpdateNameForm user={user} />

      <UpdateUsernameForm user={user} />

      <UpdateEmailForm user={user} />

      <UpdatePasswordForm />
    </section>
  );
}
