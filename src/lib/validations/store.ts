import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, "Required");

// Update shift hours
export const UpdateShiftHoursSchema = z.object({
  monday: z.coerce.number().min(0).max(24),
  tuesday: z.coerce.number().min(0).max(24),
  wednesday: z.coerce.number().min(0).max(24),
  thursday: z.coerce.number().min(0).max(24),
  friday: z.coerce.number().min(0).max(24),
  saturday: z.coerce.number().min(0).max(24),
  sunday: z.coerce.number().min(0).max(24),
});
export type UpdateShiftHoursInput = z.infer<typeof UpdateShiftHoursSchema>;

// Update start cash
export const UpdateStartCashSchema = z.object({
  startCash: z.coerce.number().min(0),
});
export type UpdateStartCashInput = z.infer<typeof UpdateStartCashSchema>;
