import { getUserShiftsInDateRange } from "@/data-access/employee";
import { User } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { getTodayBiweeklyPeriod } from "@/utils/hours-tips";
import moment from "moment";
import { UserShiftTable } from "@/components/UserShiftTable";
import {
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
  MoveRight,
} from "lucide-react";

type EmployeeAnalyticsProps = {
  user: User;
};

export async function EmployeeAnalytics({ user }: EmployeeAnalyticsProps) {
  const todayBiweeklyPeriod = getTodayBiweeklyPeriod();
  const userShifts = await getUserShiftsInDateRange(
    user.id,
    todayBiweeklyPeriod,
  );

  return (
    <div className="space-y-5 rounded-md border p-4 shadow">
      <div className="space-y-3">
        <h1 className="text-xl">For You</h1>

        <div className="space-y-2 sm:flex sm:items-center sm:space-x-4 sm:space-y-0">
          <p>Current biweekly period</p>

          <p className="flex w-fit items-center space-x-2 rounded border-l-2 border-l-blue-500 bg-muted px-2 py-1 text-sm font-medium">
            <CalendarDays size={15} className="text-blue-500" />
            <span>
              {moment(todayBiweeklyPeriod.start).format("MMM D, YYYY")}
            </span>
            <MoveRight size={15} />
            <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-8 text-sm">
        <div className="flex h-20 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow">
          <p className="flex items-center gap-2 font-semibold">
            <CalendarClock size={17} />
            <span>Total Hours</span>
          </p>
          <p className="text-base font-medium text-blue-500">
            {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
          </p>
        </div>

        <div className="flex h-20 w-40 flex-col items-center justify-center space-y-2 rounded-md border p-2 shadow">
          <p className="flex items-center gap-2 font-semibold">
            <CircleDollarSign size={17} />
            <span>Total Tips</span>
          </p>
          <p className="text-base font-medium text-blue-500">
            {formatPriceWithDollar(
              userShifts.reduce((acc, shift) => acc + shift.tips, 0),
            )}
          </p>
        </div>
      </div>

      <UserShiftTable dateRange={todayBiweeklyPeriod} userShifts={userShifts} />
    </div>
  );
}
