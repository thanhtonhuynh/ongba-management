"use server";

import {
  createExpenses,
  deleteExpense,
  updateExpenses,
} from "@/data-access/expenses";
import { getCurrentSession } from "@/lib/auth/session";
import {
  ExpensesFormInput,
  ExpensesFormSchema,
} from "@/lib/validations/expenses";
import { hasAccess } from "@/utils/access-control";
import { authenticatedRateLimit } from "@/utils/rate-limiter";
import { revalidatePath } from "next/cache";

export async function addExpensesAction(data: ExpensesFormInput) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin")
    ) {
      return "Unauthorized";
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return "Too many requests. Please try again later.";
    }

    const parsedData = ExpensesFormSchema.parse(data);

    await createExpenses(parsedData);

    revalidatePath("/admin/expenses");
  } catch (error) {
    console.log(error);
    return "Expenses creation failed";
  }
}

export async function updateExpensesAction(
  data: ExpensesFormInput,
  id: string,
) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin")
    ) {
      return "Unauthorized";
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return "Too many requests. Please try again later.";
    }

    const parsedData = ExpensesFormSchema.parse(data);

    await updateExpenses(parsedData, id);

    revalidatePath("/admin/expenses");
  } catch (error) {
    console.log(error);
    return "Expense update failed";
  }
}

export async function deleteExpenseAction(id: string) {
  try {
    const { user } = await getCurrentSession();
    if (
      !user ||
      user.accountStatus !== "active" ||
      !hasAccess(user.role, "/admin")
    ) {
      return "Unauthorized";
    }

    if (!(await authenticatedRateLimit(user.id))) {
      return "Too many requests. Please try again later.";
    }

    await deleteExpense(id);

    revalidatePath("/admin/expenses");
  } catch (error) {
    console.log(error);
    return "Expense deletion failed";
  }
}
