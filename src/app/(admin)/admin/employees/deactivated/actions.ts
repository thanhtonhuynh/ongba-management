"use server";

import { updateUser } from "@/data-access/user";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { revalidatePath } from "next/cache";

export async function reactivateUserAction(userId: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    await updateUser(userId, { accountStatus: "active" });

    revalidatePath("/admin/employees/deactivated");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Reactivation failed. Please try again." };
  }
}
