import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, "Required");

// Create report
export const CreateReportSchema = z.object({
  totalSales: z.coerce.number().gte(0, "Invalid"),
  cardSales: z.coerce.number().gte(0, "Invalid"),
  uberEatsSales: z.coerce.number().gte(0, "Invalid"),
  doorDashSales: z.coerce.number().gte(0, "Invalid"),
  skipTheDishesSales: z.coerce.number().gte(0, "Invalid"),
  onlineSales: z.coerce.number().gte(0, "Invalid"),
  expenses: z.coerce.number().gte(0, "Invalid"),
  expensesReason: trimmedString.toLowerCase().optional(),
  cardTips: z.coerce.number().gte(0, "Invalid"),
  cashTips: z.coerce.number().gte(0, "Invalid"),
  extraTips: z.coerce.number().gte(0, "Invalid"),
  cashInTill: z.coerce.number().gte(0, "Invalid"),
  employees: z
    .array(
      z.object({
        userId: requiredString,
        hour: z.coerce.number().gt(0, "Invalid"),
        name: requiredString,
        image: trimmedString.url().optional(),
      }),
    )
    .min(1, "At least 1 employee is required"),
});
export type CreateReportSchemaInput = z.infer<typeof CreateReportSchema>;

// Search report by date
export const SearchReportSchema = z.object({
  date: z.date({ message: "Invalid date" }),
});
export type SearchReportInput = z.infer<typeof SearchReportSchema>;
