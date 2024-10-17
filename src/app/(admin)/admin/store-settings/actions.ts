"use server";

import { updateStoreSettings } from "@/data/store";
import { getCurrentSession } from "@/lib/auth/session";
import {
  UpdateShiftHoursInput,
  UpdateShiftHoursSchema,
  UpdateStartCashInput,
  UpdateStartCashSchema,
} from "@/lib/validations/store";
import { revalidatePath } from "next/cache";

export async function updateShiftHours(data: UpdateShiftHoursInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || !user.userVerified || user.role !== "admin") {
      return { error: "Unauthorized." };
    }

    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
      UpdateShiftHoursSchema.parse(data);

    await updateStoreSettings({
      mondayShift: monday,
      tuesdayShift: tuesday,
      wednesdayShift: wednesday,
      thursdayShift: thursday,
      fridayShift: friday,
      saturdayShift: saturday,
      sundayShift: sunday,
    });

    revalidatePath("/admin/store-settings");
    return {};
  } catch (error) {
    console.log(error);
    return { error: "Update shift hours failed. Please try again." };
  }
}

export async function updateStartCash(data: UpdateStartCashInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || !user.userVerified || user.role !== "admin") {
      return { error: "Unauthorized." };
    }

    const { startCash } = UpdateStartCashSchema.parse(data);

    await updateStoreSettings({ startCash });

    revalidatePath("/admin/store-settings");
    return {};
  } catch (error) {
    console.log(error);
    return { error: "Update start cash failed. Please try again." };
  }
}
