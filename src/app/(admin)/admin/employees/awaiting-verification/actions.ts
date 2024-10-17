"use server";

import { updateEmployeeStatus } from "@/data/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { revalidatePath } from "next/cache";

export async function verifyUserAction(userId: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin/employees", "update")
    ) {
      return { error: "Unauthorized" };
    }

    await updateEmployeeStatus(userId, "active");

    revalidatePath("/admin/employees/awaiting-verification");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Activation failed. Please try again." };
  }
}
