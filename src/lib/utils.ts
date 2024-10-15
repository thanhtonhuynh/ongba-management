import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    // style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}
