"use client";

import moment from "moment";

export function ClientTimeDisplay({ className }: { className?: string }) {
  return (
    <span className={className}>{moment().format("dddd, MMMM DD, YYYY")}</span>
  );
}
