import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Platform } from "@/constants/platforms";
import { formatPrice } from "@/lib/utils";
import { CashFlowData } from "@/types";
import { getPlatformAmount } from "@/utils/report";

type Props = {
  reports: CashFlowData[];
  platforms: Platform[];
};

export function MonthlyCashFlowTable({ reports, platforms }: Props) {
  // Calculate totals dynamically
  const totals = reports.reduce(
    (acc, report) => {
      acc.totalSales += report.totalSales;
      acc.cardSales += report.cardSales;
      acc.actualCash += report.actualCash;
      acc.expenses += report.expenses;
      acc.totalRevenue += report.totalRevenue;

      // Accumulate platform totals
      for (const ps of report.platformSales) {
        acc.platformTotals[ps.platformId] = (acc.platformTotals[ps.platformId] ?? 0) + ps.amount;
      }

      return acc;
    },
    {
      totalSales: 0,
      cardSales: 0,
      actualCash: 0,
      expenses: 0,
      totalRevenue: 0,
      platformTotals: {} as Record<string, number>,
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
          {platforms.map((p) => (
            <TableHead key={p.id} className="text-center">
              {p.label}
            </TableHead>
          ))}
          <TableHead className="text-center">Expenses</TableHead>
          <TableHead className="text-right">Total revenue</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {reports.map((report) => {
          return (
            <TableRow key={report.id}>
              <TableCell className="bg-background sticky left-0">{report.date.getDate()}</TableCell>
              <TableCell className="text-center">{formatPrice(report.totalSales / 100)}</TableCell>
              <TableCell className="text-center">{formatPrice(report.cardSales / 100)}</TableCell>
              <TableCell className="text-center">{formatPrice(report.actualCash / 100)}</TableCell>
              {platforms.map((p) => (
                <TableCell key={p.id} className="text-center">
                  {formatPrice(getPlatformAmount(report.platformSales, p.id) / 100)}
                </TableCell>
              ))}
              <TableCell className="text-center">{formatPrice(report.expenses / 100)}</TableCell>
              <TableCell className="text-right">{formatPrice(report.totalRevenue / 100)}</TableCell>
            </TableRow>
          );
        })}

        <TableRow>
          <TableCell className="bg-background sticky left-0">Totals</TableCell>
          <TableCell className="text-center">{formatPrice(totals.totalSales / 100)}</TableCell>
          <TableCell className="text-center">{formatPrice(totals.cardSales / 100)}</TableCell>
          <TableCell className="text-center">{formatPrice(totals.actualCash / 100)}</TableCell>
          {platforms.map((p) => (
            <TableCell key={p.id} className="text-center">
              {formatPrice((totals.platformTotals[p.id] ?? 0) / 100)}
            </TableCell>
          ))}
          <TableCell className="text-center">{formatPrice(totals.expenses / 100)}</TableCell>
          <TableCell className="text-right">{formatPrice(totals.totalRevenue / 100)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
