import { getTodayStartOfDay } from "@/utils/datetime";
import { redirect } from "next/navigation";

export default function CashflowPage() {
  const today = getTodayStartOfDay();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Convert to 1-indexed

  redirect(`/cashflow/monthly?year=${currentYear}&month=${currentMonth}`);
}
