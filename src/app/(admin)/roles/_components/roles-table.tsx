"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RoleWithDetails } from "@/types/rbac";
import { Permission } from "@prisma/client";
import { RoleActions } from "./role-actions";

type RolesTableProps = {
  roles: RoleWithDetails[];
  canManageRoles: boolean;
  permissionsGrouped: Record<string, Permission[]>;
};

export function RolesTable({ roles, canManageRoles, permissionsGrouped }: RolesTableProps) {
  if (roles.length === 0) {
    return <div className="text-muted-foreground py-8 text-center text-sm">No roles found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-center">Permissions</TableHead>
          {canManageRoles && <TableHead className="w-20">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-medium">{role.name}</span>
                {!role.editable && (
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
            </TableCell>

            <TableCell className="text-muted-foreground max-w-xs truncate">
              {role.description || "-"}
            </TableCell>

            <TableCell className="text-center">
              <Badge variant="outline">{role.permissions.length}</Badge>
            </TableCell>

            {canManageRoles && (
              <TableCell>
                <RoleActions role={role} permissionsGrouped={permissionsGrouped} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
