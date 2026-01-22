import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceWithDollar } from "@/lib/utils";
import { LinkSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import Link from "next/link";

type RecentReport = {
  id: string;
  date: Date;
  totalSales: number;
};

type RecentReportsProps = {
  reports: RecentReport[];
  isOwner: boolean;
};

export function RecentReports({ reports, isOwner }: RecentReportsProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-sm">
            {isOwner
              ? "You haven't submitted any reports yet."
              : "No reports submitted yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/report/${format(report.date, "yyyy-MM-dd")}`}
            className="hover:bg-muted/50 group flex items-center justify-between rounded-lg border p-3 text-sm transition-colors"
          >
            <p className="">{format(report.date, "EEEE, MMM d, yyyy")}</p>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">
                  {formatPriceWithDollar(report.totalSales / 100)}
                </p>
                <p className="text-muted-foreground text-xs">Total Sales</p>
              </div>

              <HugeiconsIcon
                icon={LinkSquare01Icon}
                className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
