import { Container } from "@/components/Container";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTodayReport } from "@/data/report";
import { CircleCheck } from "lucide-react";
import {
  getUserMonthToDateHours,
  getUserMonthToDateTips,
} from "@/data/employee";
import { formatPriceWithDollarSign } from "@/lib/utils";
import { SaleReportCard } from "@/components/SaleReportCard";
import { SaleReportCardProcessedData, SaleReportCardRawData } from "@/types";
import { processReportDataForView } from "@/utils/report";

export default async function Home() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (!user.userVerified) redirect("/user-not-verify");

  const userMonthToDateTips = await getUserMonthToDateTips(user.id);
  const userMonthToDateHours = await getUserMonthToDateHours(user.id);

  const todayReport = await getTodayReport();
  let processedTodayReportData: SaleReportCardProcessedData | undefined;
  if (todayReport) {
    const employees = todayReport.individualTips.map((data) => ({
      userId: data.userId,
      fullDay: data.hours === todayReport.fullDayHours,
      name: data.user.name,
    }));

    const rawData: SaleReportCardRawData = {
      reporterName: todayReport.reporter.name,
      employees,
      ...todayReport,
    };

    processedTodayReportData = processReportDataForView(rawData);
  }

  return (
    <Container className="space-y-4">
      <div className="space-y-4 rounded-md border p-4 shadow">
        <div>Good day, {user.name}!</div>

        <div>
          Today is{" "}
          <span className="font-bold">
            {moment().format("dddd, MMM DD, YYYY")}
          </span>
        </div>

        {todayReport && (
          <div className="flex items-center gap-2">
            <CircleCheck size={17} className="text-green-500" />
            Today's report has been submitted.
          </div>
        )}

        <Button className="w-fit" asChild>
          <Link href={`report/new`}>Create new sale report</Link>
        </Button>
      </div>

      {todayReport && (
        <div className="space-y-4 rounded-md border p-4 shadow">
          <h1 className="font-semibold">Today's Sale Report</h1>
          <SaleReportCard data={processedTodayReportData} />
        </div>
      )}

      <div className="space-y-4 rounded-md border p-4 shadow">
        <div>
          Your month-to-date tips:{" "}
          <span className="font-bold">
            {formatPriceWithDollarSign(userMonthToDateTips)}
          </span>
        </div>

        <div>
          Your month-to-date hours:{" "}
          <span className="font-bold">{userMonthToDateHours}</span>
        </div>
      </div>
    </Container>
  );
}
