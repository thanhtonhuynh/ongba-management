"use server";

import { getReportByDate } from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SearchReportInput, SearchReportSchema } from "@/lib/report/validation";
import { SaleReportCardRawData } from "@/types";
import { processReportDataForView } from "@/utils/report";

export async function searchReportAction(data: SearchReportInput) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.accountStatus !== "active") {
      return { error: "Unauthorized.", processedReport: null };
    }

    const { date } = SearchReportSchema.parse(data);

    const report = await getReportByDate(date);
    if (!report) {
      return { error: "Report not found", processedReport: null };
    }

    const employees = report.individualTips.map((data) => ({
      userId: data.userId,
      fullDay: data.hours === report.fullDayHours,
      name: data.user.name,
    }));

    const rawData: SaleReportCardRawData = {
      reporterName: report.reporter.name,
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
