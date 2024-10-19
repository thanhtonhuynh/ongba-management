import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BreakdownData } from "@/types";

type DataTableProps = {
  startDay: number;
  endDay: number;
  data: BreakdownData[];
};

export async function DataTable({ startDay, endDay, data }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          {Array.from({ length: endDay - startDay + 1 }).map((_, index) => (
            <TableHead className="text-center" key={index}>
              {startDay + index}
            </TableHead>
          ))}
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((employee) => (
          <TableRow key={employee.userId}>
            <TableCell>{employee.userName}</TableCell>
            {employee.keyData.map((hours, index) => (
              <TableCell className="text-center" key={index}>
                {hours > 0 ? hours : "-"}
              </TableCell>
            ))}
            <TableCell className="text-right">{employee.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
