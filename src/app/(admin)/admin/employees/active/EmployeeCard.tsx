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
import { canDeactivateUser } from "@/utils/access-control";
import { EmployeeRoleTag } from "@/components/EmployeeRoleTag";
import { ProfilePicture } from "@/components/ProfilePicture";

type EmployeeCardProps = {
  employee: User;
};

export async function EmployeeCard({ employee }: EmployeeCardProps) {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <Card className="flex flex-col justify-center">
      <CardHeader className="mb-2 px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {employee.image && (
            <ProfilePicture image={employee.image} size={40} />
          )}
          {employee.name}
          <EmployeeRoleTag role={employee.role} />
        </CardTitle>

        <CardDescription>{employee.email}</CardDescription>
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
