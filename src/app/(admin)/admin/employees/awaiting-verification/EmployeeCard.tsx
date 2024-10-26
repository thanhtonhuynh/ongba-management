import { User } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifyUser } from "./VerifyUser";

type EmployeeCardProps = {
  user: User;
};

export function EmployeeCard({ user }: EmployeeCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-sm">
          {user.name}{" "}
          <span className="font-medium text-muted-foreground">
            {user.email}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex space-x-2 px-4 pb-2 pt-0">
        <VerifyUser user={user} />
      </CardContent>
    </Card>
  );
}
