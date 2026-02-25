"use server";

import { PERMISSIONS } from "@/constants/permissions";
import { type DayEntryInput, upsertScheduleDay } from "@/data-access/schedule";
import { hasPermission } from "@/utils/access-control";
import { authorizeEmployeeAction } from "@/utils/authorize-employee";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string };

type DayPayload = {
  dateStr: string; // YYYY-MM-DD
  entries: DayEntryInput[];
};

function parseScheduleDate(dateStr: string): Date | null {
  const d = new Date(dateStr + "T00:00:00.000Z");
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * Persist an entire week's schedule in one request.
 * Each item in `days` contains a date string and the full entries array for that day.
 */
export async function saveWeekScheduleAction(
  days: DayPayload[],
): Promise<ActionResult> {
  try {
    const authResult = await authorizeEmployeeAction();
    if ("error" in authResult) return authResult;

    const { user } = authResult;
    if (!hasPermission(user.role, PERMISSIONS.SCHEDULE_MANAGE))
      return { error: "Unauthorized" };

    for (const day of days) {
      const date = parseScheduleDate(day.dateStr);
      if (!date) return { error: `Invalid date: ${day.dateStr}` };
      await upsertScheduleDay(date, day.entries);
    }

    revalidatePath("/schedules");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "Failed to save schedule. Please try again." };
  }
}
