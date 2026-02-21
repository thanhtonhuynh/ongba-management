/**
 * Permissions constants for the app.
 */
export const PERMISSIONS = {
  // Admin
  ADMIN_ACCESS: "admin.access",

  // Reports
  REPORTS_VIEW: "reports.view",
  REPORTS_CREATE: "reports.create",
  REPORTS_UPDATE: "reports.update",
  REPORTS_DELETE: "reports.delete",

  // Employees
  EMPLOYEES_VIEW: "employees.view",
  EMPLOYEES_UPDATE: "employees.update",

  // Expenses
  EXPENSES_VIEW: "expenses.view",
  EXPENSES_MANAGE: "expenses.manage",

  // Hours & Tips
  HOURS_TIPS_VIEW: "hours_tips.view",

  // Cashflow
  CASHFLOW_VIEW: "cashflow.view",

  // Store Settings
  STORE_SETTINGS_MANAGE: "store_settings.manage",

  // Shifts
  SHIFTS_VIEW_OWN: "shifts.view_own",
  SHIFTS_VIEW_ALL: "shifts.view_all",

  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",
} as const;
