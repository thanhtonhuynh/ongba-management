import { getEmployees } from "@/data/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { EmployeeCard } from "./EmployeeCard";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin/employees")) return notFound();

  const employees = await getEmployees("inactive");

  return (
    <section className="grid grid-cols-2 gap-2">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} user={employee} />
      ))}
    </section>
  );
}
