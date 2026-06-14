import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "SAR"): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, locale = "ar-SA"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getDurationInWeeks(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
}

export function getDurationInDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getRiskColor(score: number): string {
  if (score >= 15) return "text-red-600 bg-red-50";
  if (score >= 8)  return "text-orange-600 bg-orange-50";
  if (score >= 4)  return "text-yellow-600 bg-yellow-50";
  return "text-green-600 bg-green-50";
}

export function getRiskLabel(score: number): string {
  if (score >= 15) return "حرج";
  if (score >= 8)  return "عالٍ";
  if (score >= 4)  return "متوسط";
  return "منخفض";
}

export function getProbabilityScore(probability: string): number {
  const map: Record<string, number> = {
    very_high: 5, high: 4, medium: 3, low: 2, very_low: 1,
  };
  return map[probability] ?? 3;
}

export function getImpactScore(impact: string): number {
  const map: Record<string, number> = {
    very_high: 5, high: 4, medium: 3, low: 2, very_low: 1,
  };
  return map[impact] ?? 3;
}

export function truncate(str: string, length = 80): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function addWeeksToDate(date: string, weeks: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}
