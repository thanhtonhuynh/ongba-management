import { cn } from "@/lib/utils";

type EmployeeRoleTagProps = {
  role: string;
};

export function EmployeeRoleTag({ role }: EmployeeRoleTagProps) {
  return (
    <span
      className={cn(
        `rounded-full px-2 py-[2px] text-xs font-medium capitalize select-none`,
        role === "admin" && "bg-muted text-yellow-500",
        role === "manager" && "bg-muted text-blue-500",
        (role === "chef" || role === "server") && "bg-muted",
        role === "unassigned role" && "bg-muted text-muted-foreground",
      )}
    >
      {role}
    </span>
  );
}
