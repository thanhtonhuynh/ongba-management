import { Container } from "@/components/Container";
import { getAllUsers } from "@/data/users";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { NewReportPortal } from "./NewReportPortal";
import { getStartCash } from "@/data/store";
import { hasAccess } from "@/utils/access-control";
import { getEmployees } from "@/data/employee";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/report/new")) return notFound();

  const users = await getEmployees("active");
  const startCash = await getStartCash();

  return (
    <Container className="items-center space-y-4">
      <div className="flex w-full max-w-[50rem] flex-col space-y-4 rounded-md border px-4 py-8 shadow-xl">
        <h1 className="text-2xl font-bold">Create sale report</h1>
        <NewReportPortal users={users} startCash={startCash} />
      </div>
    </Container>
  );
}
