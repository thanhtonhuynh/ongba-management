import { Container, Header } from "@/components/layout";
import { NotiMessage, Typography } from "@/components/shared";
import { PERMISSIONS } from "@/constants/permissions";
import { getEmployees } from "@/data-access/employee";
import { getScheduleDaysByDateRange, getScheduleUserMap } from "@/data-access/schedule";
import { getCurrentSession } from "@/lib/auth/session";
import type { DayRange } from "@/types";
import { hasPermission } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { addDays } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ScheduleWeekGrid } from "./_components/schedule-week-grid";

type PageProps = {
  searchParams: Promise<{ week?: string }>;
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
  const weekParam = params.week; // YYYY-MM-DD of any day in the week

  // Parse week param as UTC date to avoid timezone offset issues
  const baseDate = weekParam ? new Date(weekParam + "T00:00:00.000Z") : new Date();
  // Compute Monday of that week in UTC
  const dayOfWeek = baseDate.getUTCDay(); // 0=Sun..6=Sat
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate() + mondayOffset,
    ),
  );
  const weekEnd = new Date(
    Date.UTC(
      weekStart.getUTCFullYear(),
      weekStart.getUTCMonth(),
      weekStart.getUTCDate() + 6,
      23,
      59,
      59,
      999,
    ),
  );

  const dateRange: DayRange = { start: weekStart, end: weekEnd };
  const [days, employees] = await Promise.all([
    getScheduleDaysByDateRange(dateRange),
    getEmployees("active"),
  ]);

  const userMap = await getScheduleUserMap(days);
  const userMapRecord: Record<
    string,
    { id: string; name: string; image: string | null; username: string }
  > = Object.fromEntries(userMap);

  const canManage = hasPermission(user.role, PERMISSIONS.SCHEDULE_MANAGE);

  const prevWeekStart = addDays(weekStart, -7);
  const nextWeekStart = addDays(weekStart, 7);

  const daysForClient = days.map((d) => ({
    ...d,
    date: d.date.toISOString(),
  }));

  return (
    <Fragment>
      <Header>
        <Typography variant="h1">Schedules</Typography>
      </Header>

      <Container>
        <div className="bg-background space-y-4 rounded-xl border border-blue-950 p-6">
          <ScheduleWeekGrid
            weekStart={weekStart.toISOString()}
            prevWeekStart={prevWeekStart.toISOString()}
            nextWeekStart={nextWeekStart.toISOString()}
            days={daysForClient}
            employees={employees}
            userMap={userMapRecord}
            canManage={canManage}
          />
        </div>
      </Container>
    </Fragment>
  );
}
