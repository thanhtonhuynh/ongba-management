import { Separator } from "@/components/ui/separator";
import { ViewPeriodsDialog } from "./_components/ViewPeriodsDialog";
import { populateMonthSelectData } from "@/utils/hours-tips";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { years } = await populateMonthSelectData();

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Hours & Tips</h1>

        <Separator className="my-4 sm:hidden" />

        {years.length > 0 && <ViewPeriodsDialog years={years} />}
      </div>

      <Separator className="my-4 hidden sm:block" />

      {children}
    </section>
  );
}
