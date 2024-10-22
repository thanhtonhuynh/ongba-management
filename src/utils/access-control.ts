type AccessControl = {
  [path: string]: {
    [action: string]: string[];
  };
};

const accessControl: AccessControl = {
  "/admin": {
    read: ["admin", "manager"],
  },
  "/admin/employees": {
    read: ["admin", "manager"],
    update: ["admin", "manager"],
    delete: ["admin"],
  },
  "/admin/store-settings": {
    read: ["admin"],
    update: ["admin"],
  },
  "/admin/hours&tips": {
    read: ["admin"],
  },
  "/admin/cashflow": {
    read: ["admin"],
  },
  "/report/new": {
    read: ["admin", "manager", "server"],
  },
};

export function hasAccess(role: string, path: string, action?: string) {
  if (!accessControl[path]) return false;

  if (!action) return accessControl[path].read.includes(role);

  if (!accessControl[path][action]) return false;

  return accessControl[path][action].includes(role);
}

export function canDeactivateUser(userRole: string, targetRole: string) {
  if (
    (targetRole === "admin" || targetRole === "manager") &&
    userRole !== "admin"
  ) {
    return false;
  }

  return true;
}
