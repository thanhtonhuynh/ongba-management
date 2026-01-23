export const EMPLOYEE_STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "secondary" | "destructive" | "outline" | "success";
  }
> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Awaiting", variant: "outline" },
  deactivated: { label: "Deactivated", variant: "destructive" },
};

export function getEmployeeStatusConfig(accountStatus: string) {
  return (
    EMPLOYEE_STATUS_LABELS[accountStatus] || {
      label: accountStatus,
      variant: "secondary" as const,
    }
  );
}
