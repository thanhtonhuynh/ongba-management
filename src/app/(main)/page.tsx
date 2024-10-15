import { Container } from "@/components/Container";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTodayReport, todayReportIsCreated } from "@/data/report";
import { CircleCheck } from "lucide-react";
import {
  getUserMonthToDateHours,
  getUserMonthToDateTips,
} from "@/data/employee";
import { formatPriceWithDollarSign } from "@/lib/utils";
import { SaleReportView } from "@/components/SaleReportView";

export default async function Home() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (!user.userVerified) redirect("/user-not-verify");

  const userMonthToDateTips = await getUserMonthToDateTips(user.id);
  const userMonthToDateHours = await getUserMonthToDateHours(user.id);
  const todayReportCreated = await todayReportIsCreated();
  const todayReport = await getTodayReport();
  const saleEmployees = todayReport?.individualTips.map((data) => ({
    userId: data.userId,
    fullDay: data.hours === todayReport.fullDayHours,
    name: data.user.name,
  }));

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

        {todayReportCreated && (
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
        <div>
          <SaleReportView report={todayReport} employees={saleEmployees} />
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
