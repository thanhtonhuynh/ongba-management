import { formatPriceWithDollar } from "@/lib/utils";
import { DayRange, UserShift } from "@/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import moment from "moment";

export function UserShiftTable({
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
              <div className="flex flex-col gap-1">
                <span>
                  {moment(dateRange.start).add(index, "days").format("ddd")}
                </span>
                {startDay + index}
              </div>
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
