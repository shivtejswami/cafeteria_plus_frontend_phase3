/**
 * Formats a date string or Date object into a readable date and time string.
 * Example output: "Mar 15, 2026, 9:00 AM" or "Mar 15, 2026"
 */
export function formatDateTime(
  dateInput: string | Date | number | null | undefined,
  includeTime: boolean = true
): string {
  if (!dateInput) return '—';

  try {
    const date =
      typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;

    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    if (!includeTime) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return String(dateInput);
  }
}

export default formatDateTime;
