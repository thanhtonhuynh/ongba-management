import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { BreakdownData, DayRange } from "@/types";
import moment from "moment";

type DataTableProps = {
  dateRange: DayRange;
  data: BreakdownData[];
};

export async function DataTable({ dateRange, data }: DataTableProps) {
  const startDay = dateRange.start.getDate();
  const endDay = dateRange.end.getDate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background">Name</TableHead>

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
            <TableCell className="sticky left-0 bg-background">
              {employee.userName}
            </TableCell>

            {employee.keyData.map((key, index) => (
              <TableCell className="text-center" key={index}>
                {key > 0 ? formatPrice(key) : "-"}
              </TableCell>
            ))}

            <TableCell className="text-right">
              {formatPrice(employee.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
