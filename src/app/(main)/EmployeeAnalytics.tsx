import { Typography } from "@/components/shared/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserShiftTable } from "@/components/UserShiftTable";
import { getUserShiftsInDateRange } from "@/data-access/employee";
import { User } from "@/lib/auth/session";
import { formatMoney } from "@/lib/utils";
import { getTodayBiweeklyPeriod } from "@/utils/hours-tips";
import { ArrowRight01Icon, Calendar03Icon, Coins01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarClock } from "lucide-react";
import moment from "moment";

type EmployeeAnalyticsProps = {
  user: User;
};

export async function EmployeeAnalytics({ user }: EmployeeAnalyticsProps) {
  const todayBiweeklyPeriod = getTodayBiweeklyPeriod();
  const userShifts = await getUserShiftsInDateRange(user.id, todayBiweeklyPeriod);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Current Pay Period</CardTitle>
        <p className="bg-primary text-primary-foreground flex w-fit items-center gap-2 rounded-md px-2 py-1 text-xs font-medium">
          <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
          <span>{moment(todayBiweeklyPeriod.start).format("MMM D")}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          <span>{moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Typography variant="h3">Summary</Typography>

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
                <HugeiconsIcon icon={Coins01Icon} className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Tips</p>
                <p className="text-sm font-semibold">
                  {formatMoney(userShifts.reduce((acc, shift) => acc + shift.tips, 0) / 100)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Typography variant="h3">Daily Breakdown</Typography>
          <UserShiftTable dateRange={todayBiweeklyPeriod} userShifts={userShifts} />
        </div>
      </CardContent>
    </Card>
  );
}
