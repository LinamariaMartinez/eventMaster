/**
 * Date utility functions to handle timezone issues
 */

/**
 * Parse a date string (YYYY-MM-DD) without timezone conversion
 * This prevents the date from shifting due to UTC conversion
 *
 * @param dateString - ISO date string in format YYYY-MM-DD
 * @returns Date object with correct local date
 */
export function parseEventDate(dateString: string): Date {
  // Split the date string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  // Month is 0-indexed in JavaScript Date
  return new Date(year, month - 1, day);
}

/**
 * Format a date string for display in Spanish locale
 *
 * @param dateString - ISO date string in format YYYY-MM-DD
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatEventDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date = parseEventDate(dateString);
  return date.toLocaleDateString('es-CO', options);
}

/**
 * Format a date for display in short format
 *
 * @param dateString - ISO date string in format YYYY-MM-DD
 * @returns Formatted date string (e.g., "15 Dic 2024")
 */
export function formatShortDate(dateString: string): string {
  return formatEventDate(dateString, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get relative time string (e.g., "En 5 días", "Hoy", "Hace 2 días")
 *
 * @param dateString - ISO date string in format YYYY-MM-DD
 * @returns Relative time string
 */
export function getRelativeDate(dateString: string): string {
  const eventDate = parseEventDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 0) return `En ${diffDays} días`;
  return `Hace ${Math.abs(diffDays)} días`;
}
