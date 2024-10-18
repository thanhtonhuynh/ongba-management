import { getCurrentSession, User } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeactivateUser } from "./DeactivateUser";
import { ChangeUserRoleDialog } from "./ChangeUserRoleDialog";
import { canDeactivateUser } from "@/utils/access-control";

type EmployeeCardProps = {
  employee: User;
};

export async function EmployeeCard({ employee }: EmployeeCardProps) {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>
          {employee.name}{" "}
          <span className="text-sm font-medium text-muted-foreground">
            {employee.email}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          <span className="capitalize">{employee.role}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between space-x-2 p-4 pt-0">
        <ChangeUserRoleDialog selectedUser={employee} />

        {canDeactivateUser(user.role, employee.role) && (
          <DeactivateUser user={employee} />
        )}
      </CardContent>
    </Card>
  );
}
