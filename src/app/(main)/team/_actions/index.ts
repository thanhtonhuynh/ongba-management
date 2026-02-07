"use server";

import { getUserById, updateUser } from "@/data-access/user";
import {
  UpdateEmployeeRoleInput,
  UpdateEmployeeRoleSchema,
} from "@/lib/validations/employee";
import { canUpdateUser } from "@/utils/access-control";
import { authorizeEmployeeAction } from "@/utils/authorize-employee";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string };

/**
 * Activates a user account (used for both verification and reactivation).
 * @param userId - The ID of the user to activate
 */
export async function activateUserAction(
  userId: string,
): Promise<ActionResult> {
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
export async function deactivateUserAction(
  userId: string,
): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    const { user } = authResult;
    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Deactivation failed. Please try again." };
    }

    if (!canUpdateUser(user.role, targetUser.role)) {
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
export async function updateUserRoleAction(
  data: UpdateEmployeeRoleInput,
): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    const { user } = authResult;
    const { userId, role } = UpdateEmployeeRoleSchema.parse(data);

    if (!canUpdateUser(user.role, role)) {
      return { error: "Unauthorized" };
    }

    await updateUser(userId, { role });

    revalidatePath("/team");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Role change failed. Please try again." };
  }
}
