"use server";

import { upsertReport } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportInputs, SaleReportSchema } from "@/lib/validations/report";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit, rateLimitByKey } from "@/utils/rate-limiter";
import moment from "moment-timezone";

export async function saveReportAction(
  data: SaleReportInputs,
  mode: "create" | "edit",
) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.accountStatus !== "active") {
      return { error: "Unauthorized." };
    }

    if (mode === "edit" && !hasAccess(user.role, "/report", "update")) {
      return { error: "Unauthorized." };
    } else {
      if (mode === "create" && !hasAccess(user.role, "/report", "create")) {
        return { error: "Unauthorized." };
      }

      const today = moment().tz("America/Vancouver").startOf("day").toDate();
      if (mode === "create" && data.date.getTime() !== today.getTime()) {
        return { error: "Unauthorized." };
      }
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

    const parsedData = SaleReportSchema.parse(data);

    const report = await upsertReport(parsedData, user.id);

    return { reportDate: report.date, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Save report failed. Please try again." };
  }
}
