import { CashFlowData } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

type CashFlowTableProps = {
  reports: CashFlowData[];
};

export function CashFlowTable({ reports }: CashFlowTableProps) {
  const totals = reports.reduce(
    (acc, report) => {
      acc.totalSales += report.totalSales;
      acc.cardSales += report.cardSales;
      acc.actualCash += report.actualCash;
      acc.uberEatsSales += report.uberEatsSales;
      acc.onlineSales += report.onlineSales;
      acc.doorDashSales += report.doorDashSales;
      acc.skipTheDishesSales += report.skipTheDishesSales;
      acc.expenses += report.expenses;
      acc.totalRevenue += report.totalRevenue;
      return acc;
    },
    {
      totalSales: 0,
      cardSales: 0,
      actualCash: 0,
      uberEatsSales: 0,
      onlineSales: 0,
      doorDashSales: 0,
      skipTheDishesSales: 0,
      expenses: 0,
      totalRevenue: 0,
    },
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background">Date</TableHead>
          <TableHead className="text-center">Reported total</TableHead>
          <TableHead className="text-center">Card sales</TableHead>
          <TableHead className="text-center">Actual cash</TableHead>
          <TableHead className="text-center">UberEats</TableHead>
          <TableHead className="text-center">Ritual</TableHead>
          <TableHead className="text-center">DoorDash</TableHead>
          <TableHead className="text-center">Skip Dishes</TableHead>
          <TableHead className="text-center">Expenses</TableHead>
          <TableHead className="text-right">Total revenue</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="sticky left-0 bg-background">
              {report.date.getDate()}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.totalSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.cardSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.actualCash)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.uberEatsSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.onlineSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.doorDashSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.skipTheDishesSales)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.expenses)}
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(report.totalRevenue)}
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell className="sticky left-0 bg-background">Totals</TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.totalSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.cardSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.actualCash)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.uberEatsSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.onlineSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.doorDashSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.skipTheDishesSales)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.expenses)}
          </TableCell>
          <TableCell className="text-right">
            {formatPrice(totals.totalRevenue)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
