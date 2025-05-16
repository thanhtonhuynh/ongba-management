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
import {
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
  MoveRight,
} from "lucide-react";
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

      <Container>
        {searchParams.year && searchParams.month && (
          <GoBackButton
            url={`/my-shifts`}
            variant={`outline`}
            className="w-fit gap-2"
          >
            Back to current
          </GoBackButton>
        )}

        <h2 className="flex items-center gap-2">
          <span>
            {FULL_MONTHS[selectedMonth - 1]} {selectedYear}
          </span>
          {selectedYear === today.getFullYear() &&
            selectedMonth === today.getMonth() + 1 && <CurrentTag />}
        </h2>

        <div className="flex justify-center space-x-2">
          <div className="flex h-24 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow-sm">
            <p className="flex items-center gap-2 font-semibold">
              <CalendarClock size={18} />
              <span>Total Hours</span>
            </p>
            <p className="font-medium text-blue-500">
              {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
            </p>
          </div>
          <div className="flex h-24 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow-sm">
            <p className="flex items-center gap-2 font-semibold">
              <CircleDollarSign size={18} />
              <span>Total Tips</span>
            </p>
            <p className="font-medium text-blue-500">
              {formatPriceWithDollar(
                userShifts.reduce((acc, shift) => acc + shift.tips, 0),
              )}
            </p>
          </div>
        </div>

        {periods.map((period, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border p-6 shadow-sm"
          >
            <h3 className="bg-muted flex w-fit items-center space-x-2 rounded border-l-2 border-l-blue-500 px-2 py-1 text-sm font-medium">
              <CalendarDays size={15} className="text-blue-500" />
              <span>{moment(period.start).format("MMM D")}</span>
              <MoveRight size={15} />
              <span>{moment(period.end).format("MMM D")}</span>
            </h3>
            <UserShiftTable
              dateRange={period}
              userShifts={index === 0 ? firstPeriodShifts : secondPeriodShifts}
            />
          </div>
        ))}
      </Container>
    </Fragment>
  );
}
