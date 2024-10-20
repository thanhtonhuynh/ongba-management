"use client";

import moment from "moment";

export function ClientTimeDisplay({ className }: { className?: string }) {
  return (
    <span className={className}>
      {new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}
      {/* {moment().format("dddd, MMM DD, YYYY")} */}
    </span>
  );
}
