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
            <TableCell className="flex items-center gap-2">
              <ProfilePicture
                image={employee.image}
                size={32}
                name={employee.name}
              />
              {employee.name}
            </TableCell>
            <TableCell className="text-center">{employee.totalHours}</TableCell>
            <TableCell className="text-right">
              {formatPriceWithDollar(employee.totalTips / 100)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
