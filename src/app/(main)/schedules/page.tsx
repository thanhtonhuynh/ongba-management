import { Container, Header } from "@/components/layout";
import { NotiMessage, Typography } from "@/components/shared";
import { PERMISSIONS } from "@/constants/permissions";
import { getEmployees } from "@/data-access/employee";
import { getScheduleDaysByDateRangeUTC } from "@/data-access/schedule";
import { getCurrentSession } from "@/lib/auth/session";
import type { DayRange } from "@/types";
import { hasPermission } from "@/utils/access-control";
import { getEndOfWeekUTC, getStartOfWeekUTC, getTodayStartOfDay } from "@/utils/datetime";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { utc } from "@date-fns/utc";
import { addDays, format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ScheduleWeekGrid } from "./_components/schedule-week-grid";

type PageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function SchedulePage({ searchParams }: PageProps) {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  if (!hasPermission(user.role, PERMISSIONS.SCHEDULE_VIEW)) return notFound();

  if (!(await authenticatedRateLimit(user.id))) {
    return <NotiMessage variant="error" message="Too many requests. Please try again later." />;
  }

  const params = await searchParams;
  const dateParam = params.date; // YYYY-MM-DD of any day in the week

  // If no dateParam, use today and redirect
  if (!dateParam) {
    redirect(`/schedules?date=${format(getTodayStartOfDay(), "yyyy-MM-dd")}`);
  }

  // Get start of week of the dateParam
  const weekStartUTC = getStartOfWeekUTC(dateParam);
  const weekEndUTC = getEndOfWeekUTC(dateParam);

  // Get schedule days for the week
  const dateRangeUTC: DayRange = { start: weekStartUTC, end: weekEndUTC };
  const [scheduleDays, employees] = await Promise.all([
    getScheduleDaysByDateRangeUTC(dateRangeUTC),
    getEmployees("active"),
  ]);

  const canManage = hasPermission(user.role, PERMISSIONS.SCHEDULE_MANAGE);

  // Get previous and next week start dates (in UTC)
  const prevWeekStart = addDays(weekStartUTC, -7);
  const prevWeekParam = format(prevWeekStart, "yyyy-MM-dd", { in: utc });
  const nextWeekStart = addDays(weekStartUTC, 7);
  const nextWeekParam = format(nextWeekStart, "yyyy-MM-dd", { in: utc });

  const daysForClient = scheduleDays.map((d) => ({
    ...d,
    date: d.date.toISOString(),
  }));

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">Schedules</Typography>
      </Header>

      <Container>
        <ScheduleWeekGrid
          weekStartUTC={weekStartUTC}
          weekEndUTC={weekEndUTC}
          prevWeekParam={prevWeekParam}
          nextWeekParam={nextWeekParam}
          days={daysForClient}
          employees={employees}
          canManage={canManage}
        />
      </Container>
    </Fragment>
  );
}
