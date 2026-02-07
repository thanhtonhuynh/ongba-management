import { UserShiftTable } from "@/components/UserShiftTable";
import { getUserShiftsInDateRange } from "@/data-access/employee";
import { User } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { getTodayBiweeklyPeriod } from "@/utils/hours-tips";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Coins01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarClock } from "lucide-react";
import moment from "moment";

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
    <div className="bg-background space-y-4 rounded-xl border border-blue-950 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h6>This Pay Period</h6>
        <p className="bg-muted flex w-fit items-center gap-2 rounded-md px-2 py-1 text-xs font-medium">
          <HugeiconsIcon
            icon={Calendar03Icon}
            className="text-primary size-4"
          />
          <span>{moment(todayBiweeklyPeriod.start).format("MMM D")}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
        </p>
      </div>

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
                  userShifts.reduce((acc, shift) => acc + shift.tips, 0) / 100,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 space-y-3 rounded-lg p-4">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Daily Breakdown
        </h3>
        <UserShiftTable
          dateRange={todayBiweeklyPeriod}
          userShifts={userShifts}
        />
      </div>
    </div>
  );
}
