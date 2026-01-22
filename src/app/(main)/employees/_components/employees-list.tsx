"use client";

import { Input } from "@/components/ui/input";
import { User } from "@/lib/auth/session";
import { canUpdateUser } from "@/utils/access-control";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmployeesCards } from "./employees-cards";
import { EmployeesTable } from "./employees-table";
import { type ViewMode } from "./view-toggle";

type EmployeesListProps = {
  employees: User[];
  view: ViewMode;
  canUpdateEmployees: boolean;
  currentUserRole: string;
};

export function EmployeesList({
  employees,
  view,
  canUpdateEmployees,
  currentUserRole,
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

  const canUpdateEmployeeFn = (employeeRole: string) =>
    canUpdateUser(currentUserRole, employeeRole);

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
        />
      ) : (
        <EmployeesCards
          employees={filteredEmployees}
          canUpdateEmployees={canUpdateEmployees}
          canUpdateEmployee={canUpdateEmployeeFn}
        />
      )}
    </div>
  );
}
