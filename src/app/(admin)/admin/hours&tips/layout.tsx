import { Separator } from "@/components/ui/separator";
import { PeriodSelect } from "./_components/PeriodSelect";
import { populatePeriodSelectData } from "@/utils/hours-tips";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { years, firstYearMonths, latestYearMonths } =
    await populatePeriodSelectData();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Hours & Tips</h1>
      </div>

      <Separator className="my-4" />

      <div className="flex space-x-4">
        <PeriodSelect
          years={years}
          firstYearMonths={firstYearMonths}
          latestYearMonths={latestYearMonths}
        />

        {children}
      </div>
    </section>
  );
}
