import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
<<<<<<< Updated upstream
 * Format a date string for display
 * @param dateStr - ISO date string
 * @param locale - Locale code (ar or en)
 * @returns Formatted date string
 */
export function formatDate(dateStr: string, locale: string = 'ar'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculate age from date of birth string (YYYY-MM-DD or ISO format)
 * @param dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns Current age in years
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return 0;
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
=======
 * Formats a date based on the specified locale
 * - Arabic (ar): Uses Arabic- Saudi Arabia format (dd/MM/yyyy with Arabic numerals)
 * - English (en): Uses US format (MM/dd/yyyy)
 * @returns Formatted date string or '-' if date is null/undefined
 */
export function formatDate(date: Date | string | null | undefined, locale: string): string {
  if (!date) {
    return '-'
  }

  const validDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(validDate.getTime())) {
    return '-'
  }

  if (locale === 'ar') {
    // Arabic format: dd/MM/yyyy with Arabic numerals
    const day = validDate.getDate().toLocaleString('ar-SA', { numberingSystem: 'arab' })
    const month = (validDate.getMonth() + 1).toLocaleString('ar-SA', { numberingSystem: 'arab' })
    const year = validDate.getFullYear().toLocaleString('ar-SA', { numberingSystem: 'arab' })
    return `${day}/${month}/${year}`
  }

  // English format: MM/dd/yyyy
  const month = (validDate.getMonth() + 1).toString().padStart(2, '0')
  const day = validDate.getDate().toString().padStart(2, '0')
  const year = validDate.getFullYear()
  return `${month}/${day}/${year}`
}

/**
 * Formats a currency amount based on the specified locale
 * @param amount - The numeric amount to format
 * @param currency - The currency code (default: 'SAR')
 * @param locale - The locale ('ar' for Arabic, 'en' for English)
 * @returns Formatted currency string (e.g., "١٠٠ ر.س" for Arabic or "SAR 100.00" for English)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'SAR',
  locale: string
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '-'
  }

  const currencyLabels: Record<string, Record<string, string>> = {
    SAR: { ar: 'ر.س', en: 'SAR' },
  }

  const label = currencyLabels[currency]?.[locale] || currency

  if (locale === 'ar') {
    // Arabic format: amount with Arabic numerals
    const formattedAmount = amount.toLocaleString('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      numberingSystem: 'arab',
    })
    return `${formattedAmount} ${label}`
  }

  // English format: currency code followed by amount
  return `${label} ${amount.toFixed(2)}`
>>>>>>> Stashed changes
}
