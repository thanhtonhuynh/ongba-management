import { User } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactivateUser } from "./ReactivateUser";

type EmployeeCardProps = {
  user: User;
};

export function EmployeeCard({ user }: EmployeeCardProps) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>
          {user.name}{" "}
          <span className="text-sm font-medium text-muted-foreground">
            {user.email}
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          <span className="capitalize">{user.role}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex space-x-2 p-4 pt-0">
        <ReactivateUser user={user} />
      </CardContent>
    </Card>
  );
}
