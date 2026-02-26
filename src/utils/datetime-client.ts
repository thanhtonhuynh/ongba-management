import "client-only";

export function getLocalDateFromUTC(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
