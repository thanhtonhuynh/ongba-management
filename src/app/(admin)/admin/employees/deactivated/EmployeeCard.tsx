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
import { ProfilePicture } from "@/components/ProfilePicture";

type EmployeeCardProps = {
  user: User;
};

export function EmployeeCard({ user }: EmployeeCardProps) {
  return (
    <Card className="flex flex-col justify-center">
      <CardHeader className="mb-2 px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {user.image && <ProfilePicture image={user.image} size={40} />}
          {user.name}
          <EmployeeRoleTag role={user.role} />
        </CardTitle>

        <CardDescription>{user.email}</CardDescription>
      </CardHeader>

      <CardContent className="flex space-x-2 px-4 pb-2 pt-0">
        <ReactivateUser user={user} />
      </CardContent>
    </Card>
  );
}
