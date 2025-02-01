import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceWithDollar } from "@/lib/utils";
import { MonthlyExpense } from "@/types";

type Props = {
  monthlyExpenses: MonthlyExpense[];
};

export function ExpensesTable({ monthlyExpenses }: Props) {
  const yearTotal = monthlyExpenses.reduce(
    (acc, month) => acc + month.totalExpenses,
    0,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: 12 }).map((_, index) => (
            <TableHead key={index} className="text-center">
              {index + 1}
            </TableHead>
          ))}
          <TableHead className="text-center font-bold">Year total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          {monthlyExpenses.map((monthData) => (
            <TableCell key={monthData.month} className="text-center">
              {monthData.totalExpenses
                ? formatPriceWithDollar(monthData.totalExpenses)
                : "-"}
            </TableCell>
          ))}

          <TableCell className="text-center font-bold">
            {formatPriceWithDollar(yearTotal)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
