import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { GoBackButton } from "@/components/buttons/GoBackButton";
import { Container } from "@/components/Container";
import { CurrentTag } from "@/components/CurrentTag";
import { Header } from "@/components/header";
import { ErrorMessage } from "@/components/Message";
import { UserShiftTable } from "@/components/UserShiftTable";
import { getUserShiftsInDateRange } from "@/data-access/employee";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
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
        <div className="flex flex-1 items-center justify-between">
          <h1>My Shifts</h1>
          {years.length > 0 && <ViewPeriodsDialog years={years} />}
        </div>
      </Header>

      <Container className="gap-4">
        {searchParams.year && searchParams.month && (
          <GoBackButton
            url={`/my-shifts`}
            variant={`outline`}
            className="w-fit gap-2"
            size={"sm"}
          >
            View current
          </GoBackButton>
        )}

        <section className="space-y-4">
          <h6 className="flex items-center gap-2">
            {FULL_MONTHS[selectedMonth - 1]} {selectedYear}
            {selectedYear === today.getFullYear() &&
              selectedMonth === today.getMonth() + 1 && <CurrentTag />}
          </h6>

          <div className="bg-muted/50 space-y-3 rounded-lg p-4">
            <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Summary
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
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
                    {formatPriceWithDollar(
                      userShifts.reduce((acc, shift) => acc + shift.tips, 0) /
                        100,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h6>Daily Breakdown</h6>
          {periods.map((period, index) => (
            <div key={index} className="bg-muted/50 space-y-3 rounded-lg p-4">
              <h3 className="flex items-center gap-2 text-xs font-medium">
                <CalendarDays className="text-primary size-4" />
                <span>{moment(period.start).format("MMM D")}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                <span>{moment(period.end).format("MMM D")}</span>
              </h3>

              <UserShiftTable
                dateRange={period}
                userShifts={
                  index === 0 ? firstPeriodShifts : secondPeriodShifts
                }
              />
            </div>
          ))}
        </section>
      </Container>
    </Fragment>
  );
}
