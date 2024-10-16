import prisma from "@/lib/prisma";

export async function getFullDayHours(day: string) {
  const storeSettings = await prisma.storeSettings.findFirst();

  if (!storeSettings) {
    throw new Error("Store settings not found");
  }

  if (day === "monday") return storeSettings.mondayShift;
  if (day === "tuesday") return storeSettings.tuesdayShift;
  if (day === "wednesday") return storeSettings.wednesdayShift;
  if (day === "thursday") return storeSettings.thursdayShift;
  if (day === "friday") return storeSettings.fridayShift;
  if (day === "saturday") return storeSettings.saturdayShift;
  return storeSettings.sundayShift;
}

export async function getStartCash() {
  const storeSettings = await prisma.storeSettings.findFirst();

  if (!storeSettings) {
    throw new Error("Store settings not found");
  }

  return storeSettings.startCash;
}
