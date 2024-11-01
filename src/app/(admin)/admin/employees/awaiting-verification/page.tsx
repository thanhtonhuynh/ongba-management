import { getEmployees } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { EmployeeCard } from "./EmployeeCard";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ErrorMessage } from "@/components/Message";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/employees")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const employees = await getEmployees("inactive");

  return (
    <section className="grid gap-2 md:grid-cols-2">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} user={employee} />
      ))}
    </section>
  );
}
