import { ErrorMessage } from "@/components/Message";
import { getEmployees } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { EmployeeCard } from "./EmployeeCard";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const employees = await getEmployees("active");

  return (
    <section className="grid gap-2 md:grid-cols-2">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </section>
  );
}
