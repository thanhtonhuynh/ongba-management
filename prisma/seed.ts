import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Predefined permissions based on app features
const PERMISSIONS = [
  // Reports
  {
    code: "reports.view",
    name: "View Reports",
    description: "Access to sales reports page",
    resource: "reports",
    action: "view",
  },
  {
    code: "reports.create",
    name: "Create Reports",
    description: "Create new sales reports",
    resource: "reports",
    action: "create",
  },
  {
    code: "reports.update",
    name: "Update Reports",
    description: "Edit existing sales reports",
    resource: "reports",
    action: "update",
  },
  {
    code: "reports.delete",
    name: "Delete Reports",
    description: "Delete sales reports",
    resource: "reports",
    action: "delete",
  },

  // Employees
  {
    code: "employees.view",
    name: "View Employees",
    description: "View team members list",
    resource: "employees",
    action: "view",
  },
  {
    code: "employees.update",
    name: "Manage Employees",
    description: "Update employee roles and details",
    resource: "employees",
    action: "update",
  },

  // Expenses
  {
    code: "expenses.view",
    name: "View Expenses",
    description: "View expense records",
    resource: "expenses",
    action: "view",
  },
  {
    code: "expenses.manage",
    name: "Manage Expenses",
    description: "Create, edit, and delete expenses",
    resource: "expenses",
    action: "manage",
  },

  // Hours & Tips
  {
    code: "hours_tips.view",
    name: "View Hours & Tips",
    description: "View hours and tips records",
    resource: "hours_tips",
    action: "view",
  },

  // Cashflow
  {
    code: "cashflow.view",
    name: "View Cashflow",
    description: "Access cashflow reports",
    resource: "cashflow",
    action: "view",
  },

  // Store Settings
  {
    code: "store_settings.manage",
    name: "Manage Store Settings",
    description: "Configure store settings",
    resource: "store_settings",
    action: "manage",
  },

  // Shifts
  {
    code: "shifts.view_own",
    name: "View Own Shifts",
    description: "View personal shift history",
    resource: "shifts",
    action: "view_own",
  },

  // Roles management
  {
    code: "roles.view",
    name: "View Roles",
    description: "View roles and permissions",
    resource: "roles",
    action: "view",
  },
  {
    code: "roles.manage",
    name: "Manage Roles",
    description: "Create, edit, and delete roles",
    resource: "roles",
    action: "manage",
  },
] as const;

// Default roles with their permissions
const DEFAULT_ROLES = [
  {
    name: "Admin",
    description: "Restaurant administrator with full access",
    editable: false,
    permissions: [], // All permissions
  },
  {
    name: "Manager",
    description: "Manager with access to reports, employees, and cashflow",
    editable: true,
    permissions: [
      "reports.view",
      "reports.create",
      "reports.update",
      "employees.view",
      "employees.update",
      "cashflow.view",
      "shifts.view_own",
    ],
  },
  {
    name: "Server",
    description: "Server with access to create and view reports",
    editable: true,
    permissions: ["reports.view", "reports.create", "employees.view", "shifts.view_own"],
  },
  {
    name: "Chef",
    description: "Kitchen staff with basic access",
    editable: true,
    permissions: ["employees.view", "shifts.view_own"],
  },
  {
    name: "Team Member",
    description: "Default role for new users with minimal access",
    editable: true,
    permissions: ["shifts.view_own"],
  },
] as const;

async function seedPermissionsAndRoles() {
  console.log("🔐 Seeding permissions and roles...");

  // Create all permissions
  const permissionMap = new Map<string, string>(); // code -> id

  for (const permission of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
      },
      create: permission,
    });
    permissionMap.set(permission.code, created.id);
    console.log(`  ✓ Permission: ${permission.code}`);
  }

  // Create all roles with their permissions
  for (const role of DEFAULT_ROLES) {
    const permissionIds = role.permissions
      .map((code) => permissionMap.get(code))
      .filter((id): id is string => id !== undefined);

    // Find existing role by name (since name is no longer unique at DB level)
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name },
    });

    if (existingRole) {
      await prisma.role.update({
        where: { id: existingRole.id },
        data: {
          description: role.description,
          editable: role.editable,
          permissionIds: permissionIds,
        },
      });
    } else {
      await prisma.role.create({
        data: {
          name: role.name,
          description: role.description,
          editable: role.editable,
          permissionIds: permissionIds,
        },
      });
    }
    console.log(`  ✓ Role: ${role.name} (${permissionIds.length} permissions)`);
  }

  console.log("✅ Permissions and roles seeded successfully!");
}

async function main() {
  await seedPermissionsAndRoles();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
