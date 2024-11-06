"use server";

import { updateUser } from "@/data-access/user";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
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

    if (!(await authenticatedRateLimit(user.id))) {
      return { error: "Too many requests. Please try again later." };
    }

    await updateUser(userId, { accountStatus: "active" });

    revalidatePath("/admin/employees/awaiting-verification");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Activation failed. Please try again." };
  }
}
