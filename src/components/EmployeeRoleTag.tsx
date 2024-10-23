import { cn } from "@/lib/utils";

type EmployeeRoleTagProps = {
  role: string;
};

export function EmployeeRoleTag({ role }: EmployeeRoleTagProps) {
  return (
    <span
      className={cn(
        `select-none rounded-full border px-2 py-[1px] text-xs font-medium capitalize`,
        role === "admin" && "border-brick text-brick",
        role === "manager" && "border-prosper text-prosper",
        (role === "chef" || role === "server") && "border-primary text-primary",
        role === "unassigned role" && "bg-muted text-muted-foreground",
      )}
    >
      {role}
    </span>
  );
}
