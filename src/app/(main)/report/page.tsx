import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { ClipboardPen } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ReportPicker } from "./ReportPicker";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Fragment>
      <Header>
        <div className="flex flex-1 items-center justify-between">
          <h1>Past report lookup</h1>

          {hasAccess(user.role, "/report", "create") && (
            <Button
              size="sm"
              className="flex w-fit items-center gap-2"
              variant="outline"
              asChild
            >
              <Link href={`report/new`}>
                <ClipboardPen />
                Create report
              </Link>
            </Button>
          )}
        </div>
      </Header>

      <Container>
        <section className="">
          <ReportPicker />
        </section>
      </Container>
    </Fragment>
  );
}
