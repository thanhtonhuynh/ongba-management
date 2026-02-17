import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { NotiMessage } from "@/components/noti-message";
import { Typography } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { getTodayStartOfDay } from "@/utils/datetime";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SalesSummary } from "../(admin)/SalesSummary";
import { CurrentPayPeriodSummary } from "./_components";
import { QuickActions } from "./_components/quick-actions";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Home(props: { searchParams: SearchParams }) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return <NotiMessage variant="error" message="Too many requests. Please try again later." />;
  }

  const searchParams = await props.searchParams;

  const today = getTodayStartOfDay();
  const todayReport = await getReportRaw({ date: today });

  let selectedYear: number, selectedMonth: number;
  if (searchParams.year && searchParams.month) {
    selectedYear = parseInt(searchParams.year);
    selectedMonth = parseInt(searchParams.month);
  } else {
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
  }

  return (
    <Fragment>
      <Header>
        {/* Business name, will change later when scaling */}
        <Typography variant="h1">Ongba Eatery</Typography>
      </Header>

      <Container>
        {/* Greetings */}
        <Card>
          <CardHeader>
            <CardTitle>Good day, {user.name}!</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <QuickActions user={user} />
          </CardContent>
        </Card>

        {/* TODO: Removed this, will replace with just general today's sales data */}
        {/* {todayReport && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Today's Sales Report</CardTitle>
              </CardHeader>
              <CardContent>
                <SaleReportCard data={processedTodayReportData} />
              </CardContent>
            </Card>
          </>
        )} */}

        {/* Current pay period summary */}
        <CurrentPayPeriodSummary user={user} />

        {/* Sales summary */}
        {user.role === "admin" && <SalesSummary year={selectedYear} month={selectedMonth} />}
      </Container>
    </Fragment>
  );
}
