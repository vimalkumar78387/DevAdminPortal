import { clsx } from "clsx";

export function cn(...inputs: Array<string | undefined | null | false>) {
  return clsx(inputs);
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  const instance = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(instance);
}

export function truncate(text: string, limit = 120) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
}
