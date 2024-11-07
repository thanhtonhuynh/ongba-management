import { getCurrentSession, User } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeactivateUser } from "./DeactivateUser";
import { ChangeUserRoleDialog } from "./ChangeUserRoleDialog";
import { canUpdateUser, hasAccess } from "@/utils/access-control";
import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";
import { ProfilePicture } from "@/components/ProfilePicture";

type EmployeeCardProps = {
  employee: User;
};

export async function EmployeeCard({ employee }: EmployeeCardProps) {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <Card className="flex flex-col justify-center space-y-2">
      <CardHeader className="px-4 py-2">
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
          <CardContent className="flex justify-between space-x-2 px-4 pb-2 pt-0">
            <ChangeUserRoleDialog selectedUser={employee} />
            <DeactivateUser user={employee} />
          </CardContent>
        )}
    </Card>
  );
}