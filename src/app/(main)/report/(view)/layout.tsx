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
          <h1>Past report lookup</h1>

          {hasAccess(user.role, "/report", "create") && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`report/new`}>
                <ClipboardPen />
                Create report
              </Link>
            </Button>
          )}
        </div>
      </Header>

      <Container>
        <ReportPicker />
        {children}
      </Container>
    </Fragment>
  );
}
