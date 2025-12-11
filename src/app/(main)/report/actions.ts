"use server";

import {
  deleteReportById,
  getReportRaw,
  reportExists,
} from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";

export async function findReportByDateAction(data: SearchReportInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.accountStatus !== "active") {
      return { error: "Unauthorized.", reportId: null };
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return {
        error: "Too many requests. Please try again later.",
        reportId: null,
      };
    }

    const { date } = SearchReportSchema.parse(data);

    const rawReport = await getReportRaw({ date });
    if (!rawReport) {
      return { error: "Report not found", reportId: null };
    }

    return { reportId: rawReport.id, error: null };
  } catch (error) {
    console.error(error);
    return {
      error: "Report search failed. Please try again.",
      reportId: null,
    };
  }
}

export async function deleteReportAction(reportId: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/report", "delete")
    ) {
      return "Unauthorized.";
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return "Too many requests. Please try again later.";
    }

    // Check if report exists
    const isReportExisted = await reportExists(reportId);
    if (!isReportExisted) {
      return "Report not found.";
    }

    // Delete the report
    await deleteReportById(reportId);

    // revalidatePath("/report", "page");
  } catch (error) {
    console.error(error);
    return "Failed to delete report";
  }
}
