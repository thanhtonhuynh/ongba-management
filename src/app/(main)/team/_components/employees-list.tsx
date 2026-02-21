"use client";

import { Input } from "@/components/ui/input";
import { DisplayUser } from "@/types";
import type { RoleWithDetails, UserRole } from "@/types/rbac";
import { canAssignRole } from "@/utils/access-control";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmployeesCards } from "./employees-cards";
import { EmployeesTable } from "./employees-table";
import { type ViewMode } from "./view-toggle";

type EmployeesListProps = {
  employees: DisplayUser[];
  view: ViewMode;
  canUpdateEmployees: boolean;
  userRole: UserRole;
  rolesPromise: Promise<RoleWithDetails[]>;
};

export function EmployeesList({
  employees,
  view,
  canUpdateEmployees,
  userRole,
  rolesPromise,
}: EmployeesListProps) {
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees;

    const query = search.toLowerCase().trim();
    return employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query),
    );
  }, [employees, search]);

  const canUpdateEmployeeFn = (
    employeeRole: { id: string; name: string; permissions: { code: string }[] } | null,
  ) => canAssignRole(userRole, employeeRole);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Content: Table or Cards view */}
      {view === "table" ? (
        <EmployeesTable
          employees={filteredEmployees}
          canUpdateEmployees={canUpdateEmployees}
          canUpdateEmployee={canUpdateEmployeeFn}
          rolesPromise={rolesPromise}
        />
      ) : (
        <EmployeesCards
          employees={filteredEmployees}
          canUpdateEmployees={canUpdateEmployees}
          canUpdateEmployee={canUpdateEmployeeFn}
          rolesPromise={rolesPromise}
        />
      )}
    </div>
  );
}
