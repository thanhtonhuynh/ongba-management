import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { ClipboardPen } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment, ReactNode, Suspense } from "react";
import { SalesAnalyticsDashboard } from "../_components/sales-analytics";
import { SalesAnalyticsSkeleton } from "../_components/sales-analytics/sales-analytics-skeleton";
import { ReportPicker } from "../report-picker";

export default async function ReportViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Fragment>
      <Header>
        <div className="flex flex-1 items-center justify-between">
          <Typography variant="h1">Sales</Typography>

          {hasAccess(user.role, "/report", "create") && (
            <Button
              nativeButton={false}
              size="sm"
              variant="outline"
              className="tracking-normal"
              render={
                <Link href={`/report/new`}>
                  <ClipboardPen />
                  Create report
                </Link>
              }
            />
          )}
        </div>
      </Header>

      <Container>
        <Suspense fallback={<SalesAnalyticsSkeleton />}>
          <SalesAnalyticsDashboard />
        </Suspense>

        <div className="flex flex-col gap-8 min-[1150px]:flex-row">
          <ReportPicker />
          <div className="flex-1">{children}</div>
        </div>
      </Container>
    </Fragment>
  );
}
