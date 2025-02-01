import { MonthlyExpense } from "@/types";
import { Expense } from "@prisma/client";

export function reshapeExpenses(expenses: Expense[]): MonthlyExpense[] {
  const data = Array(12)
    .fill(null)
    .map((_, month) => {
      const monthExpenses = expenses.filter(
        (expense) => expense.date.getMonth() === month,
      );
      const entries = monthExpenses.flatMap((expense) => expense.entries);
      const totalExpenses = entries.reduce(
        (acc, entry) => acc + entry.amount,
        0,
      );

      return {
        month,
        monthExpenses,
        totalExpenses,
      };
    });

  return data;
}
