import { Separator } from "@/components/ui/separator";
import { PeriodSelect } from "./_components/PeriodSelect";
import { populateMonthSelectData } from "@/utils/hours-tips";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { years, firstYearMonths, latestYearMonths } =
    await populateMonthSelectData();

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Hours & Tips</h1>

        <Separator className="my-4 sm:hidden" />

        {years.length > 0 && (
          <PeriodSelect
            years={years}
            firstYearMonths={firstYearMonths}
            latestYearMonths={latestYearMonths}
          />
        )}
      </div>

      <Separator className="my-4 hidden sm:block" />

      {children}
    </section>
  );
}
