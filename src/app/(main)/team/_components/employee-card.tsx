import { ProfilePicture } from "@/components/shared/profile-picture";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployeeStatusConfig } from "@/constants/employee";
import { DisplayUser } from "@/types";
import Link from "next/link";
import { ReactNode } from "react";

type EmployeeCardProps = {
  user: DisplayUser;
  actions: ReactNode;
};

export function EmployeeCard({ user, actions }: EmployeeCardProps) {
  const statusConfig = getEmployeeStatusConfig(user.accountStatus);

  return (
    <Card className="flex flex-col justify-center gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${user.username}`} className="group flex items-center gap-2">
            <ProfilePicture image={user.image} size={32} name={user.name} />
            <span className="underline-offset-2 group-hover:underline">{user.name}</span>
          </Link>
        </CardTitle>

        <div className="">{actions}</div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pt-0 pb-4 text-sm">
        <p className="flex items-center gap-1">Role: {user.role?.name ?? "No Role"}</p>

        <div className="flex items-center gap-1">
          Status:
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
        <p>Email: {user.email}</p>
      </CardContent>
    </Card>
  );
}
