import { ProfilePicture } from "@/components/ProfilePicture";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/utils";
import { BreakdownData, DayRange } from "@/types";
import { addDays, format } from "date-fns";
import Link from "next/link";

type DataTableProps = {
  dateRange: DayRange;
  data: BreakdownData[];
  isMoney?: boolean;
};

export async function DataTable({ dateRange, data, isMoney = false }: DataTableProps) {
  const startDay = dateRange.start.getDate();
  const endDay = dateRange.end.getDate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-accent sticky left-0 h-15 min-w-max border-r">Name</TableHead>

          {Array.from({ length: endDay - startDay + 1 }).map((_, index) => (
            <TableHead className="text-center" key={index}>
              <div className="flex flex-col gap-1">
                <span>{format(addDays(dateRange.start, index), "EEE")}</span>
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
            <TableCell className="bg-background sticky left-0 min-w-max border-r">
              <Link
                href={`/profile/${employee.userUsername}`}
                className="group flex w-max items-center gap-2"
              >
                <ProfilePicture image={employee.image} size={32} name={employee.userName} />
                <span className="underline-offset-2 group-hover:underline">
                  {employee.userName}
                </span>
              </Link>
            </TableCell>

            {employee.keyData.map((key, index) => (
              <TableCell className="text-center" key={index}>
                {key > 0 ? (isMoney ? formatMoney(key / 100) : key) : "-"}
              </TableCell>
            ))}

            <TableCell className="text-right">
              {isMoney ? formatMoney(employee.total / 100) : employee.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
