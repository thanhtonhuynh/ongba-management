import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { notFound, redirect } from "next/navigation";
import { SalesSummary } from "./SalesSummary";
import { populateMonthSelectData } from "@/utils/hours-tips";
import moment from "moment";
import { NUM_MONTHS } from "../constants";

type SearchParams = Promise<{
  year: string;
  month: string;
}>;

export default async function Page(props: { searchParams: SearchParams }) {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return (
      <ErrorMessage message="Too many requests. Please try again later." />
    );
  }

  const searchParams = await props.searchParams;
  const { years } = await populateMonthSelectData();

  let selectedYear: number;
  let selectedMonth: number;
  const today = moment().tz("America/Vancouver").startOf("day").toDate();

  if (searchParams.year && searchParams.month) {
    selectedYear = parseInt(searchParams.year);
    selectedMonth = parseInt(searchParams.month);

    if (
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      !years.includes(selectedYear) ||
      !NUM_MONTHS.includes(selectedMonth)
    ) {
      return (
        <ErrorMessage
          className="self-start"
          message="Invalid year or month. Please check the URL and try again."
        />
      );
    }
  } else {
    selectedYear = today.getFullYear();
    selectedMonth = today.getMonth() + 1;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Separator />

      <SalesSummary year={selectedYear} month={selectedMonth} />
    </section>
  );
}
