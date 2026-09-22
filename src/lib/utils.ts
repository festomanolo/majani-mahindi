import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely */
export function formatConfidence(value: number): string {
  return `${Math.round(value)}%`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
