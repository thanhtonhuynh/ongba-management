import prisma from "@/lib/prisma";
import { ExpensesFormInput } from "@/lib/validations/expenses";
import "server-only";

export async function createExpenses(data: ExpensesFormInput) {
  const { date, entries } = data;

  const existingExpense = await prisma.expense.findUnique({
    where: { date },
  });

  if (existingExpense) {
    const mergedEntries = [...existingExpense.entries, ...entries];
    await prisma.expense.update({
      where: { id: existingExpense.id },
      data: {
        entries: mergedEntries,
      },
    });
  } else {
    await prisma.expense.create({
      data: {
        date,
        entries,
      },
    });
  }
}

export async function updateExpenses(data: ExpensesFormInput, id: string) {
  const { date, entries } = data;

  await prisma.expense.update({
    where: { id },
    data: {
      date,
      entries,
    },
  });
}

export async function getExpensesByYear(year: number) {
  return prisma.expense.findMany({
    where: {
      date: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    },
  });
}

export async function getExpenseById(id: string) {
  return prisma.expense.findUnique({
    where: { id },
  });
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({
    where: { id },
  });
}
