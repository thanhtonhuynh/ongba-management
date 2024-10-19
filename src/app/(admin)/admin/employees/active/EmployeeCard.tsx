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
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-sm">
          {employee.name}{" "}
          <span className="font-medium text-muted-foreground">
            {employee.email}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          <span className="capitalize">{employee.role}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between space-x-2 px-4 pb-2 pt-0">
        <ChangeUserRoleDialog selectedUser={employee} />

        {canDeactivateUser(user.role, employee.role) && (
          <DeactivateUser user={employee} />
        )}
      </CardContent>
    </Card>
  );
}
