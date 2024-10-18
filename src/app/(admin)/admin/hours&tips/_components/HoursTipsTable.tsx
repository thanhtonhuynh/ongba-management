import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type HoursTipsTableProps = {
  data: {
    userId: string;
    name: string;
    hours: number;
    tips: number;
  }[];
};

export async function HoursTipsTable({ data }: HoursTipsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Employee Name</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead className="text-right">Tips</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((employee) => (
          <TableRow key={employee.userId}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.hours}</TableCell>
            <TableCell className="text-right">{employee.tips}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
