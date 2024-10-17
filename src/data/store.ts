import prisma from "@/lib/prisma";
import { StoreSettings } from "@prisma/client";

export async function getShiftHours() {
  const storeSettings = await prisma.storeSettings.findFirst();

  if (!storeSettings) {
    throw new Error("Store settings not found");
  }

  return {
    monday: storeSettings.mondayShift,
    tuesday: storeSettings.tuesdayShift,
    wednesday: storeSettings.wednesdayShift,
    thursday: storeSettings.thursdayShift,
    friday: storeSettings.fridayShift,
    saturday: storeSettings.saturdayShift,
    sunday: storeSettings.sundayShift,
  };
}

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

export async function updateStoreSettings(data: Partial<StoreSettings>) {
  const storeSettings = await prisma.storeSettings.findFirst();

  if (!storeSettings) {
    throw new Error("Store settings not found");
  }

  return prisma.storeSettings.update({
    where: { id: storeSettings.id },
    data,
  });
}
