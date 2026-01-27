import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { ClipboardPen } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment, ReactNode } from "react";
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
          <h1>Sales Reports</h1>

          {hasAccess(user.role, "/report", "create") && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="tracking-normal"
            >
              <Link href={`report/new`}>
                <ClipboardPen />
                Create report
              </Link>
            </Button>
          )}
        </div>
      </Header>

      <Container className="min-[1150px]:flex-row">
        <ReportPicker />
        <div className="flex-1">{children}</div>
      </Container>
    </Fragment>
  );
}
