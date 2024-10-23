import { User } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactivateUser } from "./ReactivateUser";
import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";

type EmployeeCardProps = {
  user: User;
};

export function EmployeeCard({ user }: EmployeeCardProps) {
  return (
    <Card>
      <CardHeader className="mb-2 px-4 py-2">
        <CardTitle className="text-sm">
          {user.name}{" "}
          <span className="font-medium text-muted-foreground">
            {user.email}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          <EmployeeRoleTag role={user.role} />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex space-x-2 px-4 pb-2 pt-0">
        <ReactivateUser user={user} />
      </CardContent>
    </Card>
  );
}
