import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, "Required");

/** Schema for a single platform sale entry */
export const PlatformSaleSchema = z.object({
  platformId: requiredString,
  amount: z.coerce.number().gte(0, "Invalid"),
});

// Create report
export const SaleReportSchema = z
  .object({
    date: z.date({ message: "Invalid date" }),
    totalSales: z.coerce.number().gte(0, "Invalid"),
    cardSales: z.coerce.number().gte(0, "Invalid"),
    platformSales: z.array(PlatformSaleSchema).default([]),
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
          hour: z.coerce.number().gt(0, "Invalid hour"),
          name: trimmedString.optional(),
          image: trimmedString.optional(),
        }),
      )
      .min(1, "At least 1 employee is required"),
  })
  .superRefine((data, ctx) => {
    const userIds = data.employees.map((e) => e.userId);
    const seen = new Map<string, number[]>();

    userIds.forEach((id, i) => {
      seen.set(id, [...(seen.get(id) ?? []), i]);
    });

    for (const [_, indices] of seen.entries()) {
      if (indices.length > 1) {
        indices.forEach((i) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate employees are not allowed.",
            path: ["employees", i, "userId"],
          });
        });
      }
    }
  });
export type SaleReportInputs = z.infer<typeof SaleReportSchema>;

// Search report by date
export const SearchReportSchema = z.object({
  date: z.date({ message: "Invalid date" }),
});
export type SearchReportInput = z.infer<typeof SearchReportSchema>;
