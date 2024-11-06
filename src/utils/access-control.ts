type AccessControl = {
  [path: string]: {
    [action: string]: string[];
  };
};

const accessControl: AccessControl = {
  "/admin": {
    read: ["admin"],
  },
  "/report/new": {
    read: ["admin", "manager", "server"],
  },
  "/employees": {
    update: ["admin", "manager"],
  },
};

export function hasAccess(role: string, path: string, action?: string) {
  if (!accessControl[path]) return false;

  if (!action) return accessControl[path].read.includes(role);

  if (!accessControl[path][action]) return false;

  return accessControl[path][action].includes(role);
}

export function canUpdateUser(userRole: string, targetRole: string) {
  if (
    (targetRole === "admin" || targetRole === "manager") &&
    userRole !== "admin"
  ) {
    return false;
  }

  return true;
}
