import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { YearCashFlowData } from "@/types";

type Props = {
  data: YearCashFlowData[];
};

export function YearCashFlowTable({ data }: Props) {
  const yearTotal = data.reduce(
    (acc, monthData) => {
      acc.totalSales += monthData.totalSales;
      acc.totalUberEatsSales += monthData.totalUberEatsSales;
      acc.totalDoorDashSales += monthData.totalDoorDashSales;
      acc.totalSkipTheDishesSales += monthData.totalSkipTheDishesSales;
      acc.totalOnlineSales += monthData.totalOnlineSales;
      acc.totalInStoreSales += monthData.totalInStoreSales;
      acc.totalInstoreExpenses += monthData.totalInstoreExpenses;
      acc.totalMonthMainExpenses += monthData.totalMonthMainExpenses;
      acc.totalExpenses += monthData.totalExpenses;
      acc.netIncome += monthData.netIncome;
      return acc;
    },
    {
      totalSales: 0,
      totalUberEatsSales: 0,
      totalDoorDashSales: 0,
      totalSkipTheDishesSales: 0,
      totalOnlineSales: 0,
      totalInStoreSales: 0,
      totalInstoreExpenses: 0,
      totalMonthMainExpenses: 0,
      totalExpenses: 0,
      netIncome: 0,
    },
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background">Month</TableHead>
          <TableHead className="text-center">In-store sales</TableHead>
          <TableHead className="text-center">UberEats</TableHead>
          <TableHead className="text-center">Ritual</TableHead>
          <TableHead className="text-center">DoorDash</TableHead>
          <TableHead className="text-center">SkipDishes</TableHead>
          <TableHead className="text-center">Total sales</TableHead>
          <TableHead className="text-center">In-store expenses</TableHead>
          <TableHead className="text-center">Main expenses</TableHead>
          <TableHead className="text-center">Total expenses</TableHead>
          <TableHead className="text-right">Net income</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((monthData) => (
          <TableRow key={monthData.month}>
            <TableCell className="sticky left-0 bg-background">
              {monthData.month}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalInStoreSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalUberEatsSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalOnlineSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalDoorDashSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalSkipTheDishesSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalInstoreExpenses)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalMonthMainExpenses)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(monthData.totalExpenses)}
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(monthData.netIncome)}
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell className="sticky left-0 bg-background font-bold">
            Totals
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalInStoreSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalUberEatsSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalOnlineSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalDoorDashSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalSkipTheDishesSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalSales)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalInstoreExpenses)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalMonthMainExpenses)}
          </TableCell>
          <TableCell className="text-center font-bold">
            {formatPrice(yearTotal.totalExpenses)}
          </TableCell>
          <TableCell className="text-right font-bold">
            {formatPrice(yearTotal.netIncome)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
