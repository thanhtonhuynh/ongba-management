import { ProfilePicture } from "@/components/ProfilePicture";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceWithDollar } from "@/lib/utils";
import { BreakdownData, DayRange } from "@/types";
import moment from "moment";

type DataTableProps = {
  dateRange: DayRange;
  data: BreakdownData[];
  isMoney?: boolean;
};

export async function DataTable({
  dateRange,
  data,
  isMoney = false,
}: DataTableProps) {
  const startDay = dateRange.start.getDate();
  const endDay = dateRange.end.getDate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-background sticky left-0 min-w-max">
            Name
          </TableHead>

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
        {data.map((employee) => (
          <TableRow key={employee.userId}>
            <TableCell className="bg-background sticky left-0 min-w-max">
              <div className="bg-background flex w-max items-center gap-2">
                {employee.image && (
                  <ProfilePicture image={employee.image} size={40} />
                )}
                <span className="flex-1">{employee.userName}</span>
              </div>
            </TableCell>

            {employee.keyData.map((key, index) => (
              <TableCell className="text-center" key={index}>
                {key > 0
                  ? isMoney
                    ? formatPriceWithDollar(key / 100)
                    : key
                  : "-"}
              </TableCell>
            ))}

            <TableCell className="text-right">
              {isMoney
                ? formatPriceWithDollar(employee.total / 100)
                : employee.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
