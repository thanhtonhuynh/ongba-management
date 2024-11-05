import { getUserShiftsInDateRange } from "@/data-access/employee";
import { User } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { getTodayBiweeklyPeriod } from "@/utils/hours-tips";
import moment from "moment";
import { UserShiftTable } from "@/components/UserShiftTable";
import { MoveRight } from "lucide-react";

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
    <div className="space-y-3 rounded-md border p-4 shadow">
      <h1 className="font-semibold">For You</h1>

      <div className="gap-2 font-semibold sm:flex sm:items-baseline">
        <p>Current biweekly period:</p>
        <p className="flex items-center space-x-2 text-sm font-medium">
          <span>{moment(todayBiweeklyPeriod.start).format("MMM D, YYYY")}</span>
          <MoveRight size={15} />
          <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
        </p>
      </div>

      <div>
        Total hours:{" "}
        <span className="font-bold">
          {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
        </span>
      </div>

      <div>
        Total tips:{" "}
        <span className="font-bold">
          {formatPriceWithDollar(
            userShifts.reduce((acc, shift) => acc + shift.tips, 0),
          )}
        </span>
      </div>

      <UserShiftTable dateRange={todayBiweeklyPeriod} userShifts={userShifts} />
    </div>
  );
}
