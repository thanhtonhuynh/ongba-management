"use server";

import { updateEmployeeStatus } from "@/data/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
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

    await updateEmployeeStatus(userId, "deactivated");

    revalidatePath("/admin/employees/active");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Deactivation failed. Please try again." };
  }
}
