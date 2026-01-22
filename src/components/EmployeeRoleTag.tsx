import { cn } from "@/lib/utils";

type EmployeeRoleTagProps = {
  role: string;
  className?: string;
};

export function EmployeeRoleTag({ role, className }: EmployeeRoleTagProps) {
  return (
    <span
      className={cn(
        `font-medium capitalize select-none`,
        role === "admin" && "text-red-500",
        role === "manager" && "text-amber-500",
        role === "chef" && "text-violet-500",
        role === "server" && "text-blue-500",
        role === "unassigned role" && "text-neutral-500",
        className,
      )}
    >
      {role}
    </span>
  );
}
