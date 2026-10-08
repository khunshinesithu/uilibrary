// cn(): joins class names and merges Tailwind classes.
// Your code imports this from "@/helpers/classname-helper".
// Standard version (clsx + tailwind-merge). Replace it with your own if it is different.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
