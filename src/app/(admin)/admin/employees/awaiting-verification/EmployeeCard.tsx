import { User } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerifyUser } from "./VerifyUser";

type EmployeeCardProps = {
  user: User;
};

export function EmployeeCard({ user }: EmployeeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {user.name}{" "}
          <span className="text-sm font-medium text-muted-foreground">
            {user.email}
          </span>
        </CardTitle>
        <CardDescription>
          <span className="capitalize">{user.role}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <VerifyUser user={user} />
      </CardContent>
    </Card>
  );
}
