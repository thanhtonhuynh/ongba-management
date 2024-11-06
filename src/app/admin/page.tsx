import { FULL_MONTHS } from "@/app/constants";
import { ErrorMessage } from "@/components/Message";
import { Separator } from "@/components/ui/separator";
import { getReportsByDateRange } from "@/data-access/report";
import { getCurrentSession } from "@/lib/auth/session";
import { formatPriceWithDollar } from "@/lib/utils";
import { hasAccess } from "@/utils/access-control";
import { getDayRangeByMonthAndYear } from "@/utils/hours-tips";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import moment from "moment-timezone";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();
  if (!hasAccess(user.role, "/admin")) return notFound();

  if (hasAccess(user.role, "/admin/dashboard")) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/employees");
  }
}
