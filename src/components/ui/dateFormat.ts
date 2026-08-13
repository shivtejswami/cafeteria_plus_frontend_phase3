export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface CalendarDate {
  year: number;
  /** 1-12, not the zero-based month `Date` uses. */
  month: number;
  day: number;
}

/**
 * Date inputs speak ISO (`YYYY-MM-DD`). Parse and format by hand rather than via `Date`
 * so the displayed day never shifts with the viewer's timezone.
 */
export function parseIsoDate(iso: string): CalendarDate | null {
  const [year, month, day] = (iso ?? '').split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

export function toIsoDate({ year, month, day }: CalendarDate): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** `2026-07-23` → `23 Jul 2026`. Returns the input unchanged if it isn't a valid ISO date. */
export function formatIsoDate(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return `${parsed.day} ${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`;
}
