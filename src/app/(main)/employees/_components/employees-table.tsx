"use client";

import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";
import { ProfilePicture } from "@/components/ProfilePicture";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEmployeeStatusConfig } from "@/constants/employee";
import { User } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
import { EmployeeActions } from "./employee-actions";

type EmployeesTableProps = {
  employees: User[];
  /** Whether the current user can update employees */
  canUpdateEmployees: boolean;
  /** Function to check if current user can update a specific employee */
  canUpdateEmployee: (employeeRole: string) => boolean;
};

export function EmployeesTable({
  employees,
  canUpdateEmployees,
  canUpdateEmployee,
}: EmployeesTableProps) {
  const router = useRouter();

  if (employees.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No employees found.
      </div>
    );
  }

  const handleRowClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          {canUpdateEmployees && <TableHead>Status</TableHead>}
          {canUpdateEmployees && (
            <TableHead className="w-20">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => {
          const statusConfig = getEmployeeStatusConfig(employee.accountStatus);
          const canUpdate =
            canUpdateEmployees && canUpdateEmployee(employee.role);

          return (
            <TableRow
              key={employee.id}
              className="cursor-pointer"
              onClick={() => handleRowClick(employee.username)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <ProfilePicture
                    image={employee.image}
                    size={32}
                    name={employee.name}
                  />
                  <span className="font-medium">{employee.name}</span>
                </div>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {employee.email}
              </TableCell>

              <TableCell>
                <EmployeeRoleTag role={employee.role} />
              </TableCell>

              {canUpdateEmployees && (
                <TableCell>
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                </TableCell>
              )}

              {canUpdateEmployees && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <EmployeeActions employee={employee} canUpdate={canUpdate} />
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
