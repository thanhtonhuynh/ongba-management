export const EMPLOYEE_STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline" | "success";
  }
> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Awaiting", variant: "secondary" },
  deactivated: { label: "Deactivated", variant: "destructive" },
};

export function getEmployeeStatusConfig(accountStatus: string) {
  return (
    EMPLOYEE_STATUS_LABELS[accountStatus] || {
      label: accountStatus,
      variant: "outline" as const,
    }
  );
}
