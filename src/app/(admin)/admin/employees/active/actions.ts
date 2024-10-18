"use server";

import { updateEmployeeRole, updateEmployeeStatus } from "@/data/employee";
import { getUserById } from "@/data/users";
import { getCurrentSession } from "@/lib/auth/session";
import {
  UpdateEmployeeRoleInput,
  UpdateEmployeeRoleSchema,
} from "@/lib/validations/employee";
import { canDeactivateUser, hasAccess } from "@/utils/access-control";
import { revalidatePath } from "next/cache";

export async function deactivateUserAction(userId: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Deactivation failed. Please try again." };
    }

    if (!canDeactivateUser(user.role, targetUser.role)) {
      return { error: "Unauthorized" };
    }

    await updateEmployeeStatus(userId, "deactivated");

    revalidatePath("/admin/employees/active");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Deactivation failed. Please try again." };
  }
}

export async function updateUserRoleAction(data: UpdateEmployeeRoleInput) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    const { userId, role } = UpdateEmployeeRoleSchema.parse(data);

    if (user.role !== "admin" && (role === "admin" || role === "manager")) {
      return { error: "Unauthorized" };
    }

    await updateEmployeeRole(userId, role);

    revalidatePath("/admin/employees/active");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Role change failed. Please try again." };
  }
}
