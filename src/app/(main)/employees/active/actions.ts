"use server";

import { getUserById, updateUser } from "@/data-access/user";
import { getCurrentSession } from "@/lib/auth/session";
import {
  UpdateEmployeeRoleInput,
  UpdateEmployeeRoleSchema,
} from "@/lib/validations/employee";
import { canUpdateUser, hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { revalidatePath } from "next/cache";

export async function deactivateUserAction(userId: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return { error: "Too many requests. Please try again later." };
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Deactivation failed. Please try again." };
    }

    if (!canUpdateUser(user.role, targetUser.role)) {
      return { error: "Unauthorized" };
    }

    await updateUser(userId, { accountStatus: "deactivated" });

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
      !hasAccess(user.role, "/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return { error: "Too many requests. Please try again later." };
    }

    const { userId, role } = UpdateEmployeeRoleSchema.parse(data);

    if (!canUpdateUser(user.role, role)) {
      return { error: "Unauthorized" };
    }

    await updateUser(userId, { role });

    revalidatePath("/admin/employees/active");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Role change failed. Please try again." };
  }
}
