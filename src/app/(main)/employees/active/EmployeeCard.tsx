import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";
import { ProfilePicture } from "@/components/ProfilePicture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentSession, User } from "@/lib/auth/session";
import { canUpdateUser, hasAccess } from "@/utils/access-control";
import { ChangeUserRoleDialog } from "./ChangeUserRoleDialog";
import { DeactivateUser } from "./DeactivateUser";

type EmployeeCardProps = {
  employee: User;
};

export async function EmployeeCard({ employee }: EmployeeCardProps) {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <Card className="flex flex-col justify-center space-y-2">
      <CardHeader className="px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          {employee.image && (
            <ProfilePicture image={employee.image} size={40} />
          )}
          {employee.name}
          <EmployeeRoleTag role={employee.role} />
        </CardTitle>

        <CardDescription>{employee.email}</CardDescription>
      </CardHeader>

      {hasAccess(user.role, "/employees", "update") &&
        canUpdateUser(user.role, employee.role) && (
          <CardContent className="flex justify-between space-x-2 px-4 pt-0 pb-4">
            <ChangeUserRoleDialog selectedUser={employee} />
            <DeactivateUser user={employee} />
          </CardContent>
        )}
    </Card>
  );
}
