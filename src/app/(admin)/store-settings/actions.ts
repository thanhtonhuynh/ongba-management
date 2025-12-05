"use server";

import { updateStoreSettings } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { toCents } from "@/lib/utils";
import {
  UpdateStartCashInput,
  UpdateStartCashSchema,
} from "@/lib/validations/store";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { revalidatePath } from "next/cache";

export async function updateStartCash(data: UpdateStartCashInput) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin")
    ) {
      return { error: "Unauthorized." };
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return { error: "Too many requests. Please try again later." };
    }

    const { startCash } = UpdateStartCashSchema.parse(data);

    await updateStoreSettings({ startCash: toCents(startCash) });

    revalidatePath("/store-settings");
    return {};
  } catch (error) {
    console.log(error);
    return { error: "Update start cash failed. Please try again." };
  }
}
