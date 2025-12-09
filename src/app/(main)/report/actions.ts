"use server";

import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { processReportDataForView } from "@/utils/report";

export async function searchReportAction(data: SearchReportInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.accountStatus !== "active") {
      return { error: "Unauthorized.", processedReport: null };
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return {
        error: "Too many requests. Please try again later.",
        processedReport: null,
      };
    }

    const { date } = SearchReportSchema.parse(data);

    const rawReport = await getReportRaw({ date });
    if (!rawReport) {
      return { error: "Report not found", processedReport: null };
    }

    const processedReport = processReportDataForView(rawReport);

    return { processedReport };
  } catch (error) {
    console.error(error);
    return {
      error: "Report search failed. Please try again.",
      processedReport: null,
    };
  }
}
