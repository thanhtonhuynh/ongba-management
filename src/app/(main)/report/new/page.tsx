import { Container } from "@/components/Container";
import { getAllUsers } from "@/data/users";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { NewReportPortal } from "./NewReportPortal";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (!user.userVerified) redirect("/user-not-verify");

  const users = await getAllUsers();

  return (
    <Container className="items-center space-y-4">
      <div className="flex w-full max-w-[50rem] flex-col space-y-8 rounded-xl border px-4 py-8 shadow-xl">
        <h1 className="text-2xl font-bold">Create new sale report</h1>
        <NewReportPortal users={users} />
      </div>
    </Container>
  );
}
