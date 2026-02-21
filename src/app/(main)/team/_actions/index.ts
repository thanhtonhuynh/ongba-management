"use server";

import { getRoleById } from "@/data-access/roles";
import { getUserById, updateUser } from "@/data-access/user";
import { UpdateEmployeeRoleInput, UpdateEmployeeRoleSchema } from "@/lib/validations/employee";
import { canAssignRole } from "@/utils/access-control";
import { authorizeEmployeeAction } from "@/utils/authorize-employee";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string };

/**
 * Activates a user account (used for both verification and reactivation).
 * @param userId - The ID of the user to activate
 */
export async function activateUserAction(userId: string): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    await updateUser(userId, { accountStatus: "active" });

    revalidatePath("/team");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Activation failed. Please try again." };
  }
}

/**
 * Deactivates a user account.
 */
export async function deactivateUserAction(userId: string): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    const { user } = authResult;
    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Deactivation failed. Please try again." };
    }

    if (!canAssignRole(user.role, targetUser.role)) {
      return { error: "Unauthorized" };
    }

    await updateUser(userId, { accountStatus: "deactivated" });

    revalidatePath("/team");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Deactivation failed. Please try again." };
  }
}

/**
 * Updates a user's role.
 */
export async function updateUserRoleAction(data: UpdateEmployeeRoleInput): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    const { user } = authResult;
    const { userId, roleId } = UpdateEmployeeRoleSchema.parse(data);

    const targetRole = await getRoleById(roleId);

    if (!targetRole) {
      return { error: "Role not found" };
    }

    if (!canAssignRole(user.role, targetRole)) {
      return { error: "You are not authorized to assign this role." };
    }

    // // TODO: Update to use roleId instead of role string once migration is complete
    // // For now, find the role by name and update the user's roleId
    // const prisma = (await import("@/lib/prisma")).default;
    // const targetRole = await prisma.role.findFirst({
    //   where: { name: { equals: role, mode: "insensitive" } },
    // });

    // if (!targetRole) {
    //   return { error: "Role not found" };
    // }

    await updateUser(userId, { roleId });

    revalidatePath("/team");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Role change failed. Please try again." };
  }
}
