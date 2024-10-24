import { z } from "zod";

// View hours & tips of past periods
export const ViewPastPeriodsSchema = z.object({
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(0).max(11),
});
export type ViewPastPeriodsInput = z.infer<typeof ViewPastPeriodsSchema>;
