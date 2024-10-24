import { getUserShiftsInDateRange } from "@/data/employee";
import { User } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { DayRange, UserShift } from "@/types";
import { getTodayBiweeklyPeriod } from "@/utils/hours-tips";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="space-y-2 rounded-md border p-4 shadow">
      <h1 className="font-semibold">For You</h1>

      <div className="gap-2 font-semibold sm:flex sm:items-baseline">
        <p>Current biweekly period:</p>
        <p className="text-sm font-medium">
          {moment(todayBiweeklyPeriod.start).format("MMM D, YYYY")} -{" "}
          {moment(todayBiweeklyPeriod.end).format("MMM D, YYYY")}
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

function UserShiftTable({
  dateRange,
  userShifts,
}: {
  dateRange: DayRange;
  userShifts: UserShift[];
}) {
  const startDay = dateRange.start.getDate();
  const endDay = dateRange.end.getDate();

  const hours = Array.from({ length: endDay - startDay + 1 }).map(
    (_, index) => {
      return (
        userShifts.find((shift) => shift.date.getDate() === startDay + index)
          ?.hours || 0
      );
    },
  );
  const tips = Array.from({ length: endDay - startDay + 1 }).map((_, index) => {
    return (
      userShifts.find((shift) => shift.date.getDate() === startDay + index)
        ?.tips || 0
    );
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background"></TableHead>
          {Array.from({ length: endDay - startDay + 1 }).map((_, index) => (
            <TableHead className="text-center" key={index}>
              {startDay + index}
            </TableHead>
          ))}
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell className="sticky left-0 bg-background">Hours</TableCell>
          {hours.map((hour, index) => (
            <TableCell key={index} className="text-center">
              {hour > 0 ? hour : "-"}
            </TableCell>
          ))}
          <TableCell className="text-right">
            {userShifts.reduce((acc, shift) => acc + shift.hours, 0)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="sticky left-0 bg-background">Tips</TableCell>
          {tips.map((tip, index) => (
            <TableCell key={index} className="text-center">
              {tip > 0 ? formatPriceWithDollar(tip) : "-"}
            </TableCell>
          ))}
          <TableCell className="text-right">
            {formatPriceWithDollar(
              userShifts.reduce((acc, shift) => acc + shift.tips, 0),
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
