import { Container } from "@/components/Container";
import { Header } from "@/components/layout";
import { Typography } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { populateMonthSelectData } from "@/utils/hours-tips";
import { Invoice02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Fragment } from "react";
import { PeriodSelector } from "./_components";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { years } = await populateMonthSelectData();

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">Expenses</Typography>
      </Header>

      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {years.length > 0 && <PeriodSelector years={years} />}

          <Button
            nativeButton={false}
            size="sm"
            render={
              <Link href="/expenses/new">
                <HugeiconsIcon icon={Invoice02Icon} />
                Add expense
              </Link>
            }
          />
        </div>

        {children}
      </Container>
    </Fragment>
  );
}
