import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { CashFlowData } from "@/types";

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
          <TableHead className="bg-background sticky left-0">Date</TableHead>
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
            <TableCell className="bg-background sticky left-0">
              {report.date.getDate()}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.totalSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.cardSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.actualCash / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.uberEatsSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.onlineSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.doorDashSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.skipTheDishesSales / 100)}
            </TableCell>
            <TableCell className="text-center">
              {formatPrice(report.expenses / 100)}
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(report.totalRevenue / 100)}
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell className="bg-background sticky left-0">Totals</TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.totalSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.cardSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.actualCash / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.uberEatsSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.onlineSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.doorDashSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.skipTheDishesSales / 100)}
          </TableCell>
          <TableCell className="text-center">
            {formatPrice(totals.expenses / 100)}
          </TableCell>
          <TableCell className="text-right">
            {formatPrice(totals.totalRevenue / 100)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
