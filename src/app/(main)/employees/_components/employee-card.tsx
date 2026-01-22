import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";
import { ProfilePicture } from "@/components/ProfilePicture";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployeeStatusConfig } from "@/constants/employee";
import { User } from "@/lib/auth/session";
import { ReactNode } from "react";

type EmployeeCardProps = {
  user: User;
  actions: ReactNode;
};

export function EmployeeCard({ user, actions }: EmployeeCardProps) {
  const statusConfig = getEmployeeStatusConfig(user.accountStatus);

  return (
    <Card className="flex flex-col justify-center">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          {user.image && <ProfilePicture image={user.image} size={32} />}
          {user.name}
        </CardTitle>

        <div className="">{actions}</div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pt-0 pb-4 text-sm">
        <p className="flex items-center gap-1">
          Role: <EmployeeRoleTag role={user.role} />
        </p>

        <p className="flex items-center gap-1">
          Status:
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </p>
        <p>Email: {user.email}</p>
      </CardContent>
    </Card>
  );
}
