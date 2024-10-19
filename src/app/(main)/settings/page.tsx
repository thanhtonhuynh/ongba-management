import { Container } from "@/components/Container";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { UpdateNameForm } from "./UpdateNameForm";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Container>
      <div>
        <h1 className="text-xl font-semibold">Account settings</h1>
      </div>

      <Separator className="my-4" />

      <UpdateNameForm user={user} />
    </Container>
  );
}
