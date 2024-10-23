"use server";

import { upsertReport } from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  CreateReportSchema,
  CreateReportSchemaInput,
} from "@/lib/report/validation";
import { isISOString } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";

export async function createReportAction(
  data: CreateReportSchemaInput,
  isoString: string,
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

    // Validate if isoString is a valid date string in ISO format
    if (!isISOString(isoString)) {
      return { error: "Invalid date." };
    }

    await upsertReport(parsedData, user.id, isoString);

    return {};
  } catch (error) {
    console.error(error);
    return { error: "Report creation failed. Please try again." };
  }
}
