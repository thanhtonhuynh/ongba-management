import { ProfilePicture } from "@/components/ProfilePicture";
import { type ReportAuditLog } from "@/types";
import { formatVancouverDate } from "@/utils/datetime";
import Link from "next/link";

type Props = {
  auditLogs: ReportAuditLog[] | undefined;
};

export function ReportAuditLog({ auditLogs }: Props) {
  if (auditLogs === undefined || auditLogs.length === 0) return null;

  const sortedAuditLogs = auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-muted/50 space-y-3 rounded-lg p-4">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Audit Log
      </h3>
      <div className="space-y-2 text-sm">
        {sortedAuditLogs.map((log) => (
          <div
            key={`${log.userId}-${log.timestamp.toISOString()}`}
            className="flex items-center gap-2"
          >
            Edited by{" "}
            <Link
              href={`/profile/${log.username}`}
              className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <ProfilePicture image={log.image} size={24} name={log.name} />
              <span className="group-hover:underline">{log.name}</span>
            </Link>
            on {formatVancouverDate(log.timestamp, "MMM d, yyyy h:mma")}
          </div>
        ))}
      </div>
    </div>
  );
}
