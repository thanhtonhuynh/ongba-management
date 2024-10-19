"use server";

import {
  createReport,
  deleteTodayReport,
  todayReportIsCreated,
} from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  CreateReportSchema,
  CreateReportSchemaTypes,
} from "@/lib/report/validation";
import { hasAccess } from "@/utils/access-control";

export async function createReportAction(
  data: CreateReportSchemaTypes,
  utcDay: string,
) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/report/new")
    ) {
      return { error: "Unauthorized." };
    }

    const parsedData = CreateReportSchema.parse(data);

    // if (await todayReportIsCreated()) {
    //   await deleteTodayReport();
    // }

    await createReport(parsedData, user.id, utcDay);

    return {};
  } catch (error) {
    console.error(error);
    return { error: "Report creation failed. Please try again." };
  }
}
