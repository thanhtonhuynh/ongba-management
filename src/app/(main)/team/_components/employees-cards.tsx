import { DisplayUser } from "@/types";
import type { RoleWithDetails } from "@/types/rbac";
import { EmployeeActions } from "./employee-actions";
import { EmployeeCard } from "./employee-card";

type EmployeesCardsProps = {
  employees: DisplayUser[];
  /** Whether the current user can update employees */
  canUpdateEmployees: boolean;
  /** Function to check if current user can update a specific employee */
  canUpdateEmployee: (
    employeeRole: { id: string; name: string; permissions: { code: string }[] } | null,
  ) => boolean;
  rolesPromise: Promise<RoleWithDetails[]>;
};

export function EmployeesCards({
  employees,
  canUpdateEmployees,
  canUpdateEmployee,
  rolesPromise,
}: EmployeesCardsProps) {
  if (employees.length === 0) {
    return <div className="text-muted-foreground py-8 text-center">No results found.</div>;
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {employees.map((employee) => {
        const canUpdate = canUpdateEmployees && canUpdateEmployee(employee.role);

        return (
          <EmployeeCard
            key={employee.id}
            user={employee}
            actions={
              <EmployeeActions
                employee={employee}
                canUpdate={canUpdate}
                rolesPromise={rolesPromise}
              />
            }
          />
        );
      })}
    </section>
  );
}
