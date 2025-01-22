"use server";

import { getReportByDate } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  SearchReportInput,
  SearchReportSchema,
} from "@/lib/validations/report";
import { SaleReportCardRawData } from "@/types";
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

    const report = await getReportByDate(date);
    if (!report) {
      return { error: "Report not found", processedReport: null };
    }

    const employees = report.employeeShifts.map((data) => ({
      userId: data.userId,
      hour: data.hours,
      name: data.user.name,
      image: data.user.image || undefined,
    }));

    const rawData: SaleReportCardRawData = {
      reporterName: report.reporter.name,
      reporterImage: report.reporter.image,
      employees,
      ...report,
    };

    const processedReport = processReportDataForView(rawData);

    return { processedReport };
  } catch (error) {
    console.error(error);
    return {
      error: "Report search failed. Please try again.",
      processedReport: null,
    };
  }
}
