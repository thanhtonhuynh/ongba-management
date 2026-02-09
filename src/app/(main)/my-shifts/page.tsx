import { NUM_MONTHS } from "@/app/constants";
import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { ErrorMessage } from "@/components/Message";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserShiftTable } from "@/components/UserShiftTable";
import { getUserShiftsInDateRange } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { formatMoney } from "@/lib/utils";
import {
  getDayRangeByMonthAndYear,
  getPeriodsByMonthAndYear,
  populateMonthSelectData,
} from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { ArrowRight01Icon, Coins01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarClock, CalendarDays } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ViewPeriodsDialog } from "./ViewPeriodsDialog";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Page(props: { searchParams: SearchParams }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const searchParams = await props.searchParams;

  const { years } = await populateMonthSelectData();

  let selectedYear: number;
  let selectedMonth: number;
  const today = moment().tz("America/Vancouver").startOf("day").toDate();

  if (searchParams.year && searchParams.month) {
    selectedYear = parseInt(searchParams.year);
    selectedMonth = parseInt(searchParams.month);

    if (
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      !years.includes(selectedYear) ||
      !NUM_MONTHS.includes(selectedMonth)
    ) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year or month. Please check the URL and try again."
        />
      );
    }
  } else {
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
  }

  const dateRange = getDayRangeByMonthAndYear(selectedYear, selectedMonth - 1);
  const periods = getPeriodsByMonthAndYear(selectedYear, selectedMonth - 1);
  const userShifts = await getUserShiftsInDateRange(user.id, dateRange);

  const firstPeriodShifts = userShifts.filter(
    (shift) => shift.date.getDate() <= 15,
  );
  const secondPeriodShifts = userShifts.filter(
    (shift) => shift.date.getDate() > 15,
  );

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">My Shifts</Typography>
      </Header>

      <Container>
        <div className="flex items-center gap-2">
          {years.length > 0 && (
            <ViewPeriodsDialog
              years={years}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          )}

          <Button
            variant={"link"}
            nativeButton={false}
            size={"sm"}
            render={<Link href="/my-shifts">View current</Link>}
          />
        </div>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <CalendarClock className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Hours</p>
                <p className="text-sm font-semibold">
                  {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <HugeiconsIcon
                  icon={Coins01Icon}
                  className="text-muted-foreground size-5"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Tips</p>
                <p className="text-sm font-semibold">
                  {formatMoney(
                    userShifts.reduce((acc, shift) => acc + shift.tips, 0) /
                      100,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {periods.map((period, index) => (
              <div key={index} className="space-y-1">
                <Typography
                  variant="h3"
                  className="flex items-center gap-2 text-xs font-medium"
                >
                  <CalendarDays className="text-primary size-4" />
                  <span>{moment(period.start).format("MMM D")}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                  <span>{moment(period.end).format("MMM D")}</span>
                </Typography>

                <UserShiftTable
                  dateRange={period}
                  userShifts={
                    index === 0 ? firstPeriodShifts : secondPeriodShifts
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </Container>
    </Fragment>
  );
}
