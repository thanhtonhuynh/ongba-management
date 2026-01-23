import { ErrorMessage } from "@/components/Message";
import { getEmployees } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { type EmployeeStatus } from "@/types";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { EmployeesList } from "./_components/employees-list";
import { StatusFilter } from "./_components/status-filter";
import { ViewToggle, type ViewMode } from "./_components/view-toggle";

type PageProps = {
  searchParams: Promise<{ status?: string; view?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const params = await searchParams;
  const canManageEmployees = hasAccess(user.role, "/employees", "update");

  // Non-managers can only see active employees
  const status: EmployeeStatus = canManageEmployees
    ? (params.status as EmployeeStatus) || "active"
    : "active";

  const view: ViewMode = (params.view as ViewMode) || "table";

  const employees = await getEmployees(status);

  return (
    <div className="space-y-4">
      {/* Toolbar: Filter + View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {canManageEmployees && <StatusFilter />}
        </div>

        <ViewToggle />
      </div>

      {/* Content: Search + Table/Cards view */}
      <EmployeesList
        employees={employees}
        view={view}
        canUpdateEmployees={canManageEmployees}
        currentUserRole={user.role}
      />
    </div>
  );
}
