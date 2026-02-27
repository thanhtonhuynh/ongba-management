/** A single time slot within a day entry. */
export type SlotFormValue = {
  startMinutes: number;
  endMinutes: number;
  note?: string;
};

/** One employee's entry for a single day. */
export type EntryFormValue = {
  userId: string;
  slots: SlotFormValue[];
  note?: string;
};

/** One day's worth of schedule data. */
export type DayFormValue = {
  dateStr: string; // YYYY-MM-DD (UTC)
  entries: EntryFormValue[];
};

/** The entire week form. */
export type WeekFormValues = {
  days: DayFormValue[];
};

/** Identifier for a slot in the grid: day index, entry index, slot index. */
export type SlotAddress = {
  dayIndex: number;
  entryIndex: number;
  slotIndex: number;
};

/** Minutes since midnight to "h:mm a" (e.g. 540 -> "9:00 AM") */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

/** "HH:mm" to minutes since midnight */
export function timeToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Minutes since midnight to "HH:mm" for input[type=time] */
export function minutesToTimeInput(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Extract YYYY-MM-DD from an ISO string or Date, always in UTC. */
export function toUTCDateKey(d: string | Date): string {
  const iso = typeof d === "string" ? d : d.toISOString();
  return iso.slice(0, 10);
}
