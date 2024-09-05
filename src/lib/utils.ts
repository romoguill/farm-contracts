import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const MAX_CONTRACT_PDF_SIZE = 1500 * 1000; // 1.5 MB

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFromCalendar(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getRgbString(rgb: string[], a: string = '1') {
  return `rgba(${rgb.join(',')},${a})`;
}
