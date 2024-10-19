"use server";

import { updateUser } from "@/data/users";
import { getCurrentSession } from "@/lib/auth/session";
import { UpdateNameSchema, UpdateNameSchemaInput } from "@/lib/auth/validation";
import { revalidatePath } from "next/cache";

export async function updateNameAction(data: UpdateNameSchemaInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.accountStatus !== "active") {
      return { error: "Unauthorized." };
    }

    const { name } = UpdateNameSchema.parse(data);

    await updateUser(user.id, { name });

    revalidatePath("/");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Update name failed. Please try again." };
  }
}
