import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalHoursTips } from "@/types";

type HoursTipsTableProps = {
  data: TotalHoursTips[];
};

export async function HoursTipsTable({ data }: HoursTipsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead className="text-center">Hours</TableHead>
          <TableHead className="text-right">Tips</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((employee) => (
          <TableRow key={employee.userId}>
            <TableCell>{employee.name}</TableCell>
            <TableCell className="text-center">{employee.totalHours}</TableCell>
            <TableCell className="text-right">{employee.totalTips}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
