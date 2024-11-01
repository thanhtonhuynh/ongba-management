"use server";

import { upsertReport } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  CreateReportSchema,
  CreateReportSchemaInput,
} from "@/lib/validations/report";
import { isISOString } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit, rateLimitByKey } from "@/utils/rate-limiter";

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

    if (!(await authenticatedRateLimit(user.id))) {
      return { error: "Too many requests. Please try again later." };
    }

    if (
      !(await rateLimitByKey({
        key: `${user.id}-create-report`,
        limit: 3,
        interval: 30000,
      }))
    ) {
      return { error: "Too many requests. Please try again later." };
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
