import { FULL_MONTHS, NUM_MONTHS } from "@/app/constants";
import { GoBackButton } from "@/components/buttons/GoBackButton";
import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { UserShiftTable } from "@/components/UserShiftTable";
import { ViewPeriodsDialog } from "@/app/(main)/my-shifts/ViewPeriodsDialog";
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

  const dateRange = getDayRangeByMonthAndYear(selectedYear, selectedMonth);
  const periods = getPeriodsByMonthAndYear(selectedYear, selectedMonth);
  const userShifts = await getUserShiftsInDateRange(user.id, dateRange);

  const firstPeriodShifts = userShifts.filter(
    (shift) => shift.date.getDate() <= 15,
  );
  const secondPeriodShifts = userShifts.filter(
    (shift) => shift.date.getDate() > 15,
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1>My Shifts</h1>
        {years.length > 0 && <ViewPeriodsDialog years={years} />}
      </div>

      <Separator />

      {searchParams.year && searchParams.month && (
        <GoBackButton
          url={`/my-shifts`}
          variant={`outline`}
          className="gap-1"
          size={"sm"}
        >
          Back to current
        </GoBackButton>
      )}

      <h2 className="flex items-center gap-2 text-lg">
        <span>{FULL_MONTHS[selectedMonth - 1]}</span>
        <span className="text-sm text-muted-foreground">{selectedYear}</span>
        {selectedYear === today.getFullYear() &&
          selectedMonth === today.getMonth() + 1 && (
            <span className="rounded-md border bg-muted px-2 py-1 text-xs">
              Current
            </span>
          )}
      </h2>

      <div className="flex justify-center space-x-2">
        <div className="flex h-24 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow">
          <p className="flex items-center gap-2 font-semibold">
            <CalendarClock size={18} />
            <span>Total Hours</span>
          </p>

          <p className="font-medium text-blue-500">
            {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
          </p>
        </div>

        <div className="flex h-24 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow">
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
        <div key={index} className="space-y-2 rounded-md border p-4 shadow">
          <h3 className="flex w-fit items-center space-x-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 text-sm font-medium">
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
    </section>
  );
}
