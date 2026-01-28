import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getEmployees } from "@/data-access/employee";
import { getReportRaw } from "@/data-access/report";
import { getStartCash } from "@/data-access/store";
import { getCurrentSession } from "@/lib/auth/session";
import { SaleReportInputs } from "@/lib/validations/report";
import { hasAccess } from "@/utils/access-control";
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SaleReportPortal } from "../../new/sale-report-portal";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") notFound();
  if (!hasAccess(user.role, "/report", "update")) notFound();

  const params = await props.params;
  const report = await getReportRaw({ id: params.id });
  if (!report) notFound();

  const [usersPromise, startCashPromise] = [getEmployees(), getStartCash()];

  // Convert cents -> dollars
  const initialValues: SaleReportInputs = {
    date: report.date,
    totalSales: report.totalSales / 100,
    cardSales: report.cardSales / 100,
    uberEatsSales: report.uberEatsSales / 100,
    doorDashSales: report.doorDashSales / 100,
    skipTheDishesSales: report.skipTheDishesSales / 100,
    onlineSales: report.onlineSales / 100,
    expenses: report.expenses / 100,
    expensesReason: report.expensesReason ?? undefined,
    cardTips: report.cardTips / 100,
    cashTips: report.cashTips / 100,
    extraTips: report.extraTips / 100,
    cashInTill: report.cashInTill / 100,
    employees: report.employees,
  };

  return (
    <Fragment>
      <Header>
        <h1>Edit sale report</h1>
        <p className="text-sm">{format(report.date, "MMMM d, yyyy")}</p>
      </Header>

      <Container>
        <section className="max-w-5xl">
          <SaleReportPortal
            usersPromise={usersPromise}
            startCashPromise={startCashPromise}
            initialValues={initialValues}
            mode="edit"
            reporterName={report.reporterName}
            reporterImage={report.reporterImage}
            reporterUsername={report.reporterUsername}
          />
        </section>
      </Container>
    </Fragment>
  );
}
