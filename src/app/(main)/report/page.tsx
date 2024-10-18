import { Container } from "@/components/Container";
import { getAllReports } from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { processReportDataForView } from "@/utils/report";
import { ReportPicker } from "./ReportPicker";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  // const reports = await getAllReports();
  // const processedReports = reports.map((report) => {
  //   const employees = report.individualTips.map((data) => ({
  //     userId: data.userId,
  //     fullDay: data.hours === report.fullDayHours,
  //     name: data.user.name,
  //   }));

  //   const rawData = {
  //     reporterName: report.reporter.name,
  //     employees,
  //     ...report,
  //   };

  //   return processReportDataForView(rawData);
  // });

  return (
    <Container>
      {/* <ReportSelect processedReports={processedReports} /> */}
      <ReportPicker />
    </Container>
  );
}
