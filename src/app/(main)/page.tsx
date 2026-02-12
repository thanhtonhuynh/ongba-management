import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Message } from "@/components/message";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportRaw } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { getTodayStartOfDay } from "@/utils/datetime";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import {
  Calculator01Icon,
  Calendar02Icon,
  TaskAdd01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { SalesSummary } from "../(admin)/SalesSummary";
import { EmployeeAnalytics } from "./EmployeeAnalytics";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Home(props: { searchParams: SearchParams }) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return <Message variant="error" message="Too many requests. Please try again later." />;
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
            <Typography variant="h3">Quick Actions</Typography>

            <div className="flex flex-col items-start gap-1">
              {!todayReport && hasAccess(user.role, "/report", "create") && (
                <Button
                  nativeButton={false}
                  size="sm"
                  variant={"link"}
                  className="text-foreground border-0 p-0"
                  render={
                    <Link href={`report/new`}>
                      <HugeiconsIcon icon={TaskAdd01Icon} />
                      Create report
                    </Link>
                  }
                />
              )}

              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href="/cash-counter">
                    <HugeiconsIcon icon={Calculator01Icon} />
                    Cash calculator
                  </Link>
                }
              />

              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href="/my-shifts">
                    <HugeiconsIcon icon={Calendar02Icon} />
                    My shifts
                  </Link>
                }
              />
              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                className="text-foreground border-0 p-0"
                render={
                  <Link href={`/profile/${user.username}`}>
                    <HugeiconsIcon icon={UserAccountIcon} />
                    My profile
                  </Link>
                }
              />
            </div>
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

        <EmployeeAnalytics user={user} />

        {user.role === "admin" && <SalesSummary year={selectedYear} month={selectedMonth} />}
      </Container>
    </Fragment>
  );
}
